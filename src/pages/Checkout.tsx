import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useCart } from "@/hooks/useCart";
import { useToast } from "@/hooks/use-toast";
import { productImages } from "@/utils/imageAssets";
import { Phone, MessageCircle, ChevronRight } from "lucide-react";
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

const FALLBACK_PHONE = "8830257574";
const FALLBACK_UPI = "88302575741@ybl";

const sanitizePhone = (raw: string) => raw.replace(/[^\d]/g, "").replace(/^91/, "");

const Checkout = () => {
  const { cartItems, cartTotal, clearCart } = useCart();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [settings, setSettings] = useState<BusinessSettings | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    city: "",
    pincode: "",
  });
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

  const businessPhone = sanitizePhone(settings?.whatsapp || settings?.phone || FALLBACK_PHONE) || FALLBACK_PHONE;
  const upiId = settings?.upi_id || FALLBACK_UPI;
  const businessName = settings?.business_name || "Marwad Maratha";

  const shippingCharge =
    settings && cartTotal < Number(settings.free_shipping_above || 0)
      ? Number(settings.shipping_charge || 0)
      : 0;
  const totalAmount = cartTotal + shippingCharge;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const isFormValid =
    formData.name.trim() &&
    formData.phone.trim() &&
    formData.address.trim() &&
    formData.city.trim() &&
    formData.pincode.trim();

  const buildWhatsAppMessage = (orderNumber: string) => {
    const items = cartItems
      .map((i) => `• ${i.name} x${i.quantity} — ₹${i.price * i.quantity}`)
      .join("\n");
    return encodeURIComponent(
      `🛒 *New Order — ${businessName}*\n` +
        `*Order #:* ${orderNumber}\n\n` +
        `*Items:*\n${items}\n\n` +
        `*Subtotal:* ₹${cartTotal}\n` +
        `*Shipping:* ${shippingCharge === 0 ? "Free" : `₹${shippingCharge}`}\n` +
        `*Total:* ₹${totalAmount}\n\n` +
        `*Customer:* ${formData.name}\n` +
        `*Phone:* ${formData.phone}\n` +
        `*Address:* ${formData.address}, ${formData.city} - ${formData.pincode}\n` +
        `*Payment:* ${paymentMode === "upi" ? "UPI (Prepaid)" : "Cash on Delivery"}\n\n` +
        `Please confirm 🙏`
    );
  };

  const handleUpiPay = () => {
    const upiLink = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(businessName)}&am=${totalAmount}&cu=INR`;
    window.open(upiLink, "_blank", "noopener");
  };

  const placeOrder = async (mode: "upi" | "cod") => {
    if (!isFormValid) {
      toast({ title: "Please fill all delivery details", variant: "destructive" });
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

    try {
      const { data, error } = await supabase
        .from("orders")
        .insert({
          order_number: "", // trigger will generate
          customer_name: formData.name.trim(),
          phone: formData.phone.trim(),
          whatsapp: formData.phone.trim(),
          address: formData.address.trim(),
          city: formData.city.trim(),
          pincode: formData.pincode.trim(),
          items: cartItems.map((i) => ({
            id: i.id,
            name: i.name,
            price: i.price,
            quantity: i.quantity,
            image: i.image,
          })),
          total_amount: totalAmount,
          payment_method: mode === "upi" ? "UPI" : "COD",
          payment_status: "pending",
          order_status: "new",
        })
        .select("order_number")
        .single();

      if (error || !data) {
        console.error("Order insert failed:", error);
        toast({
          title: "Could not place order",
          description: error?.message || "Please try again.",
          variant: "destructive",
        });
        setProcessing(false);
        return;
      }

      const orderNumber = data.order_number;

      sessionStorage.setItem(
        "lastOrder",
        JSON.stringify({
          orderNumber,
          items: cartItems,
          total: totalAmount,
          subtotal: cartTotal,
          shipping: shippingCharge,
          address: `${formData.address}, ${formData.city} - ${formData.pincode}`,
          paymentMode: mode,
          name: formData.name,
          phone: formData.phone,
        })
      );

      // Open WhatsApp to the owner with the formatted summary
      const waUrl = `https://wa.me/91${businessPhone}?text=${buildWhatsAppMessage(orderNumber)}`;
      window.open(waUrl, "_blank", "noopener");

      clearCart();
      navigate("/order-received");
    } catch (err) {
      console.error("Checkout failure:", err);
      toast({
        title: "Something went wrong",
        description: "Please try again in a moment.",
        variant: "destructive",
      });
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
                  required
                  maxLength={100}
                  className="w-full px-4 py-3 rounded-xl border border-input bg-background focus:outline-none focus:ring-2 focus:ring-accent/30 text-sm"
                  placeholder="Your full name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">Phone Number</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  maxLength={20}
                  className="w-full px-4 py-3 rounded-xl border border-input bg-background focus:outline-none focus:ring-2 focus:ring-accent/30 text-sm"
                  placeholder="Your phone number"
                />
                <p className="text-xs text-muted-foreground mt-1.5">We may contact you to confirm your order.</p>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">Address</label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  required
                  rows={2}
                  maxLength={500}
                  className="w-full px-4 py-3 rounded-xl border border-input bg-background focus:outline-none focus:ring-2 focus:ring-accent/30 text-sm resize-none"
                  placeholder="Full delivery address"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium mb-1.5">City</label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    required
                    maxLength={80}
                    className="w-full px-4 py-3 rounded-xl border border-input bg-background focus:outline-none focus:ring-2 focus:ring-accent/30 text-sm"
                    placeholder="City"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5">Pincode</label>
                  <input
                    type="text"
                    name="pincode"
                    value={formData.pincode}
                    onChange={handleChange}
                    required
                    maxLength={10}
                    className="w-full px-4 py-3 rounded-xl border border-input bg-background focus:outline-none focus:ring-2 focus:ring-accent/30 text-sm"
                    placeholder="Pincode"
                  />
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
                  <p className="text-xs text-muted-foreground mt-0.5">Recommended for all prepaid orders.</p>
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
                    Available for verified local customers only. Contact us to request.
                  </p>
                </div>
              </label>
            </div>
          </div>

          {/* UPI Payment Block */}
          {paymentMode === "upi" && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="bg-white rounded-2xl p-5 md:p-6 mb-6"
              style={{ boxShadow: "0 2px 12px rgba(90,10,10,0.06)" }}
            >
              <h2 className="font-heritage text-xl font-bold mb-4" style={{ color: "#5A0A0A" }}>
                Pay ₹{totalAmount} via UPI
              </h2>
              <button
                onClick={handleUpiPay}
                disabled={processing}
                className="w-full py-3.5 rounded-xl font-semibold text-white mb-3 transition-all"
                style={{ background: "#850E35", minHeight: "48px" }}
              >
                Pay Now
              </button>
              <p className="text-xs text-muted-foreground text-center mb-4">
                After payment, return here and confirm on WhatsApp.
              </p>
              <button
                onClick={() => placeOrder("upi")}
                disabled={processing || !isFormValid}
                className="w-full py-3.5 rounded-xl font-semibold text-white flex items-center justify-center gap-2 transition-all"
                style={{ background: "#25D366", minHeight: "48px", opacity: isFormValid ? 1 : 0.6 }}
              >
                <MessageCircle size={18} />
                {processing ? "Processing..." : "Confirm on WhatsApp"}
              </button>
            </motion.div>
          )}

          {paymentMode === "cod" && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="mb-6">
              <button
                onClick={() => placeOrder("cod")}
                disabled={processing || !isFormValid}
                className="w-full py-3.5 rounded-xl font-semibold text-white transition-all"
                style={{ background: "#850E35", minHeight: "48px", opacity: isFormValid ? 1 : 0.5 }}
              >
                {processing ? "Processing..." : "Place Order (Cash on Delivery)"}
              </button>
            </motion.div>
          )}

          {/* Support Strip */}
          <div className="rounded-2xl p-5 md:p-6 text-center" style={{ background: "#F5EDE4" }}>
            <p className="text-sm font-medium mb-3" style={{ color: "#5A0A0A" }}>
              Have questions before placing your order?
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a
                href={`https://wa.me/91${businessPhone}`}
                target="_blank"
                rel="noopener"
                className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-medium text-white text-sm"
                style={{ background: "#25D366", minHeight: "48px" }}
              >
                <MessageCircle size={16} />
                Chat on WhatsApp
              </a>
              <a
                href={`tel:+91${businessPhone}`}
                className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-medium text-sm border"
                style={{ borderColor: "#850E35", color: "#850E35", minHeight: "48px" }}
              >
                <Phone size={16} />
                Call Us
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Checkout;
