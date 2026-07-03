import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { z } from "zod";
import { useCart } from "@/hooks/useCart";
import { useToast } from "@/hooks/use-toast";
import { productImages } from "@/utils/imageAssets";
import { ChevronRight, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface BusinessSettings {
  business_name: string;
  whatsapp: string;
  phone: string;
  upi_id: string | null;
  shipping_charge: number;
  free_shipping_above: number;
  is_accepting_orders: boolean;
}

const FALLBACK_UPI = "88302575741@ybl";

// ---- Strict validation schema ----
const checkoutSchema = z.object({
  name: z.string().trim().min(2, "Please enter your full name").max(100),
  phone: z
    .string()
    .trim()
    .regex(/^[6-9]\d{9}$/, "Enter a valid 10-digit Indian mobile number"),
  whatsapp: z
    .string()
    .trim()
    .regex(/^[6-9]\d{9}$/, "Enter a valid 10-digit WhatsApp number")
    .or(z.literal("")),
  address: z.string().trim().min(10, "Address must be at least 10 characters").max(500),
  city: z.string().trim().min(2, "Please enter your city").max(80),
  pincode: z.string().trim().regex(/^\d{6}$/, "Pincode must be exactly 6 digits"),
});

type FormData = z.infer<typeof checkoutSchema>;
type FieldErrors = Partial<Record<keyof FormData, string>>;

const Checkout = () => {
  const { cartItems, cartTotal, clearCart } = useCart();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [settings, setSettings] = useState<BusinessSettings | null>(null);
  const [formData, setFormData] = useState<FormData>({
    name: "",
    phone: "",
    whatsapp: "",
    address: "",
    city: "",
    pincode: "",
  });
  const [waSameAsPhone, setWaSameAsPhone] = useState(true);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [paymentMode, setPaymentMode] = useState<"upi" | "cod">("upi");
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    supabase
      .from("settings")
      .select("business_name,whatsapp,phone,upi_id,shipping_charge,free_shipping_above,is_accepting_orders")
      .limit(1)
      .maybeSingle()
      .then(({ data }) => {
        if (data) setSettings(data as BusinessSettings);
      });
  }, []);

  const upiId = settings?.upi_id || FALLBACK_UPI;
  const businessName = settings?.business_name || "Marwad Maratha";
  const shippingCharge =
    settings && cartTotal < Number(settings.free_shipping_above || 0)
      ? Number(settings.shipping_charge || 0)
      : 0;
  const totalAmount = cartTotal + shippingCharge;

  // Numeric-only filtering for phone and pincode
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    let v = value;
    if (name === "phone" || name === "whatsapp") v = value.replace(/\D/g, "").slice(0, 10);
    if (name === "pincode") v = value.replace(/\D/g, "").slice(0, 6);
    setFormData((prev) => {
      const next = { ...prev, [name]: v };
      if (name === "phone" && waSameAsPhone) next.whatsapp = v;
      return next;
    });
    setErrors((e) => ({ ...e, [name]: undefined }));
  };

  const handleSameAsPhone = (checked: boolean) => {
    setWaSameAsPhone(checked);
    if (checked) {
      setFormData((p) => ({ ...p, whatsapp: p.phone }));
      setErrors((e) => ({ ...e, whatsapp: undefined }));
    }
  };

  // Live validation result for button state
  const liveValidation = checkoutSchema.safeParse({
    ...formData,
    whatsapp: waSameAsPhone ? formData.phone : formData.whatsapp,
  });
  const isFormValid = liveValidation.success;

  const loadRazorpay = (): Promise<boolean> =>
    new Promise((resolve) => {
      if ((window as any).Razorpay) return resolve(true);
      const s = document.createElement("script");
      s.src = "https://checkout.razorpay.com/v1/checkout.js";
      s.onload = () => resolve(true);
      s.onerror = () => resolve(false);
      document.body.appendChild(s);
    });

  const placeOrder = async (mode: "upi" | "cod") => {
    const payload = {
      ...formData,
      whatsapp: waSameAsPhone ? formData.phone : formData.whatsapp,
    };
    const parsed = checkoutSchema.safeParse(payload);
    if (!parsed.success) {
      const fieldErrors: FieldErrors = {};
      for (const issue of parsed.error.issues) {
        const key = issue.path[0] as keyof FormData;
        if (!fieldErrors[key]) fieldErrors[key] = issue.message;
      }
      setErrors(fieldErrors);
      toast({
        title: "Please fix the errors below",
        description: "Some fields are missing or invalid.",
        variant: "destructive",
      });
      return;
    }
    if (settings && !settings.is_accepting_orders) {
      toast({
        title: "Orders paused",
        description: "We're not accepting new orders right now. Please try again later.",
        variant: "destructive",
      });
      return;
    }

    setProcessing(true);
    console.log("[checkout] placing order", { mode });

    try {
      const { data: orderNumber, error } = await supabase.rpc("place_order", {
        _customer_name: parsed.data.name,
        _phone: parsed.data.phone,
        _whatsapp: parsed.data.whatsapp || parsed.data.phone,
        _address: parsed.data.address,
        _city: parsed.data.city,
        _pincode: parsed.data.pincode,
        _items: cartItems.map((i) => ({
          id: i.id, name: i.name, price: i.price, quantity: i.quantity, image: i.image,
        })) as any,
        _total_amount: totalAmount,
        _payment_method: mode === "upi" ? "UPI" : "COD",
        _notes: null,
      });

      if (error || !orderNumber) {
        console.error("[checkout] insert failed", error);
        toast({ title: "Could not place order", description: "Please try again.", variant: "destructive" });
        return;
      }

      const orderPayload = {
        orderNumber, items: cartItems, total: totalAmount, subtotal: cartTotal,
        shipping: shippingCharge,
        address: `${parsed.data.address}, ${parsed.data.city} - ${parsed.data.pincode}`,
        paymentMode: mode, name: parsed.data.name, phone: parsed.data.phone,
        upiId, businessName,
      };
      sessionStorage.setItem("lastOrder", JSON.stringify(orderPayload));

      // COD: just navigate; notify owner
      if (mode === "cod") {
        supabase.functions.invoke("notify-owner-order", { body: { order_number: orderNumber } })
          .catch((e) => console.error("[checkout] notify failed", e));
        clearCart();
        navigate(`/order-success?order=${encodeURIComponent(orderNumber)}`);
        return;
      }

      // UPI: open Razorpay
      const ok = await loadRazorpay();
      if (!ok) {
        toast({
          title: "Payment SDK failed to load",
          description: "You can still complete payment via UPI on the next page.",
          variant: "destructive",
        });
        clearCart();
        navigate(`/order-success?order=${encodeURIComponent(orderNumber)}`);
        return;
      }

      const { data: rzp, error: rzpErr } = await supabase.functions.invoke("razorpay-create-order", {
        body: { order_number: orderNumber, amount: totalAmount },
      });
      if (rzpErr || !rzp?.order_id) {
        console.error("[checkout] rzp create failed", rzpErr, rzp);
        toast({
          title: "Could not start payment",
          description: "Falling back to manual UPI.",
          variant: "destructive",
        });
        clearCart();
        navigate(`/order-success?order=${encodeURIComponent(orderNumber)}`);
        return;
      }

      const options = {
        key: rzp.key_id,
        amount: rzp.amount,
        currency: rzp.currency,
        order_id: rzp.order_id,
        name: businessName,
        description: `Order ${orderNumber}`,
        prefill: {
          name: parsed.data.name,
          contact: parsed.data.phone,
        },
        notes: { order_number: orderNumber },
        theme: { color: "#850E35" },
        method: { upi: true, card: true, netbanking: true, wallet: true },
        config: {
          display: {
            blocks: {
              upi_block: {
                name: "Pay via UPI",
                instruments: [{ method: "upi" }],
              },
            },
            sequence: ["block.upi_block"],
            preferences: { show_default_blocks: true },
          },
        },
        handler: async (resp: any) => {
          try {
            const { data: v, error: vErr } = await supabase.functions.invoke("razorpay-verify-payment", {
              body: {
                razorpay_order_id: resp.razorpay_order_id,
                razorpay_payment_id: resp.razorpay_payment_id,
                razorpay_signature: resp.razorpay_signature,
              },
            });
            if (vErr || !v?.success) {
              toast({ title: "Payment verification failed", description: "Contact support with your payment ID.", variant: "destructive" });
              return;
            }
            clearCart();
            navigate(`/order-success?order=${encodeURIComponent(orderNumber)}&paid=1`);
          } catch (err) {
            console.error("[checkout] verify error", err);
            toast({ title: "Verification error", description: "Please contact support.", variant: "destructive" });
          }
        },
        modal: {
          ondismiss: () => {
            setProcessing(false);
            toast({ title: "Payment cancelled", description: "You can retry from Order Success page." });
            clearCart();
            navigate(`/order-success?order=${encodeURIComponent(orderNumber)}`);
          },
        },
      };

      const rz = new (window as any).Razorpay(options);
      rz.on("payment.failed", (resp: any) => {
        console.error("[razorpay] payment failed", resp?.error);
        toast({
          title: "Payment failed",
          description: resp?.error?.description || "Please try again.",
          variant: "destructive",
        });
      });
      rz.open();
    } catch (err) {
      console.error("[checkout] unexpected error", err);
      toast({ title: "Something went wrong", description: "Please try again.", variant: "destructive" });
    } finally {
      setProcessing(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen" style={{ background: "#FCF7F1" }}>
        <header className="py-4 px-6 border-b" style={{ borderColor: "hsl(20 10% 85%)" }}>
          <Link to="/" className="flex items-center gap-2">
            <img src={productImages.logo} alt="Logo" className="h-10" />
            <span className="font-heritage font-bold text-lg" style={{ color: "#5A0A0A" }}>
              Marwad Maratha
            </span>
          </Link>
        </header>
        <div className="flex flex-col items-center justify-center py-24 px-4 text-center">
          <h2 className="font-heritage text-2xl font-bold mb-3" style={{ color: "#5A0A0A" }}>
            Your cart is empty
          </h2>
          <p className="text-muted-foreground mb-6">Browse our products and add items to proceed.</p>
          <Link
            to="/"
            className="px-6 py-3 rounded-2xl font-medium text-white"
            style={{ background: "#850E35" }}
          >
            Browse Products
          </Link>
        </div>
      </div>
    );
  }

  // Helper: render an error message
  const FieldError = ({ name }: { name: keyof FormData }) =>
    errors[name] ? (
      <p className="text-xs text-red-600 mt-1.5">{errors[name]}</p>
    ) : null;

  const inputBase =
    "w-full px-4 py-3 rounded-xl border bg-background focus:outline-none focus:ring-2 focus:ring-accent/30 text-sm";
  const inputClass = (name: keyof FormData) =>
    `${inputBase} ${errors[name] ? "border-red-500" : "border-input"}`;

  return (
    <div className="min-h-screen" style={{ background: "#FCF7F1" }}>
      <Helmet>
        <title>Checkout — Marwad Maratha</title>
        <meta name="description" content="Securely place your order for homemade aachar and papad. UPI payment with WhatsApp confirmation." />
        <meta name="robots" content="noindex, follow" />
        <link rel="canonical" href="https://marwad-maratha.lovable.app/checkout" />
        <meta property="og:title" content="Checkout — Marwad Maratha" />
        <meta property="og:description" content="Place your order for homemade aachar and papad with quick UPI checkout." />
        <meta property="og:url" content="https://marwad-maratha.lovable.app/checkout" />
        <meta property="og:type" content="website" />
      </Helmet>
      <header className="py-4 px-6 border-b" style={{ borderColor: "hsl(20 10% 85%)" }}>
        <Link to="/" className="flex items-center gap-2">
          <img src={productImages.logo} alt="Logo" className="h-10" />
          <span className="font-heritage font-bold text-lg" style={{ color: "#5A0A0A" }}>
            Marwad Maratha
          </span>
        </Link>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <div className="flex items-center gap-1 text-sm text-muted-foreground mb-6">
          <Link to="/" className="hover:text-foreground">Home</Link>
          <ChevronRight size={14} />
          <span>Cart</span>
          <ChevronRight size={14} />
          <span className="text-foreground font-medium">Checkout</span>
        </div>

        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <h1 className="font-heritage text-3xl md:text-4xl font-bold mb-2" style={{ color: "#5A0A0A" }}>
            Complete Your Order
          </h1>
          <p className="text-muted-foreground mb-8">
            Freshly prepared in small batches. Secure UPI payment.
          </p>

          {/* Order Summary */}
          <div className="bg-white rounded-2xl p-5 md:p-6 mb-6" style={{ boxShadow: "0 2px 12px rgba(90,10,10,0.06)" }}>
            <h2 className="font-heritage text-xl font-bold mb-4" style={{ color: "#5A0A0A" }}>Order Summary</h2>
            <div className="space-y-3">
              {cartItems.map((item) => (
                <div key={item.id} className="flex items-center gap-3 pb-3 border-b border-muted/50 last:border-0 last:pb-0">
                  <div className="w-14 h-14 rounded-xl overflow-hidden flex-shrink-0 bg-muted">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "/placeholder.svg";
                      }}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{item.name}</p>
                    <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                  </div>
                  <p className="font-medium text-sm">₹{item.price * item.quantity}</p>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-3 border-t border-muted/50 space-y-1">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span>₹{cartTotal}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Delivery</span>
                <span className="text-mehendi font-medium">
                  {shippingCharge === 0 ? "Free" : `₹${shippingCharge}`}
                </span>
              </div>
              <div className="flex justify-between text-lg font-bold pt-2" style={{ color: "#5A0A0A" }}>
                <span>Total</span>
                <span>₹{totalAmount}</span>
              </div>
            </div>
          </div>

          {/* Delivery Details */}
          <div className="bg-white rounded-2xl p-5 md:p-6 mb-6" style={{ boxShadow: "0 2px 12px rgba(90,10,10,0.06)" }}>
            <h2 className="font-heritage text-xl font-bold mb-4" style={{ color: "#5A0A0A" }}>Delivery Details</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1.5">Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  maxLength={100}
                  className={inputClass("name")}
                  placeholder="Your full name"
                />
                <FieldError name="name" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">Phone Number</label>
                <input
                  type="tel"
                  inputMode="numeric"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  maxLength={10}
                  className={inputClass("phone")}
                  placeholder="10-digit mobile number"
                />
                <FieldError name="phone" />
              </div>
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-sm font-medium">WhatsApp Number</label>
                  <label className="flex items-center gap-2 text-xs text-muted-foreground cursor-pointer">
                    <input
                      type="checkbox"
                      checked={waSameAsPhone}
                      onChange={(e) => handleSameAsPhone(e.target.checked)}
                      className="accent-accent"
                    />
                    Same as phone
                  </label>
                </div>
                <input
                  type="tel"
                  inputMode="numeric"
                  name="whatsapp"
                  value={waSameAsPhone ? formData.phone : formData.whatsapp}
                  onChange={handleChange}
                  disabled={waSameAsPhone}
                  maxLength={10}
                  className={`${inputClass("whatsapp")} ${waSameAsPhone ? "opacity-60 cursor-not-allowed" : ""}`}
                  placeholder="10-digit WhatsApp number"
                />
                {!waSameAsPhone && <FieldError name="whatsapp" />}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">Address</label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  rows={2}
                  maxLength={500}
                  className={`${inputClass("address")} resize-none`}
                  placeholder="House #, street, locality"
                />
                <FieldError name="address" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium mb-1.5">City</label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    maxLength={80}
                    className={inputClass("city")}
                    placeholder="City"
                  />
                  <FieldError name="city" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5">Pincode</label>
                  <input
                    type="text"
                    inputMode="numeric"
                    name="pincode"
                    value={formData.pincode}
                    onChange={handleChange}
                    maxLength={6}
                    className={inputClass("pincode")}
                    placeholder="6-digit pincode"
                  />
                  <FieldError name="pincode" />
                </div>
              </div>
            </div>
          </div>

          {/* Payment Method */}
          <div className="bg-white rounded-2xl p-5 md:p-6 mb-6" style={{ boxShadow: "0 2px 12px rgba(90,10,10,0.06)" }}>
            <h2 className="font-heritage text-xl font-bold mb-4" style={{ color: "#5A0A0A" }}>Choose Payment Method</h2>
            <div className="space-y-3">
              <label
                className={`flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                  paymentMode === "upi" ? "border-accent bg-accent/5" : "border-muted hover:border-muted-foreground/30"
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  value="upi"
                  checked={paymentMode === "upi"}
                  onChange={() => setPaymentMode("upi")}
                  className="mt-1 accent-accent"
                />
                <div>
                  <p className="font-semibold text-sm">UPI — Instant & Secure</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Recommended. After paying, we verify and confirm automatically.
                  </p>
                </div>
              </label>
              <label
                className={`flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                  paymentMode === "cod" ? "border-accent bg-accent/5" : "border-muted hover:border-muted-foreground/30"
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  value="cod"
                  checked={paymentMode === "cod"}
                  onChange={() => setPaymentMode("cod")}
                  className="mt-1 accent-accent"
                />
                <div>
                  <p className="font-semibold text-sm">Cash on Delivery</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Available for verified local customers only.
                  </p>
                </div>
              </label>
            </div>
          </div>

          {/* Single unified Place Order action */}
          <button
            onClick={() => placeOrder(paymentMode)}
            disabled={processing || !isFormValid}
            className="w-full py-4 rounded-xl font-semibold text-white flex items-center justify-center gap-2 transition-all"
            style={{
              background: isFormValid ? "#850E35" : "#a87d84",
              minHeight: "52px",
              opacity: processing ? 0.7 : 1,
              cursor: processing || !isFormValid ? "not-allowed" : "pointer",
            }}
          >
            {processing ? (
              <>
                <Loader2 className="animate-spin" size={18} />
                Placing order…
              </>
            ) : paymentMode === "upi" ? (
              `Place Order & Pay ₹${totalAmount}`
            ) : (
              `Place Order — ₹${totalAmount} (COD)`
            )}
          </button>
          {!isFormValid && (
            <p className="text-xs text-muted-foreground text-center mt-3">
              Fill all delivery details correctly to enable this button.
            </p>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Checkout;
