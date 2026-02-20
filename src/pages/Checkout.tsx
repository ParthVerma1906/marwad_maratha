import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useCart } from "@/hooks/useCart";
import { useToast } from "@/hooks/use-toast";
import { productImages } from "@/utils/imageAssets";
import { Phone, MessageCircle, ChevronRight } from "lucide-react";

const BUSINESS_PHONE = "8830257574";
const UPI_ID = "88302575741@ybl";
const DELIVERY_CHARGE = 0;

const Checkout = () => {
  const { cartItems, cartTotal, clearCart } = useCart();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    city: "",
    pincode: "",
  });
  const [paymentMode, setPaymentMode] = useState<"upi" | "cod">("upi");
  const [processing, setProcessing] = useState(false);

  const totalAmount = cartTotal + DELIVERY_CHARGE;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const isFormValid = formData.name && formData.phone && formData.address && formData.city && formData.pincode;

  const buildWhatsAppMessage = () => {
    const items = cartItems.map(i => `• ${i.name} x${i.quantity} — ₹${i.price * i.quantity}`).join("\n");
    return encodeURIComponent(
      `🛒 *Order from Marwad Maratha*\n\n` +
      `*Items:*\n${items}\n\n` +
      `*Total:* ₹${totalAmount}\n` +
      `*Name:* ${formData.name}\n` +
      `*City:* ${formData.city}\n` +
      `*Payment:* ${paymentMode === "upi" ? "UPI" : "Cash on Delivery"}\n` +
      `*Transaction ID:* ___________\n\n` +
      `Please confirm my order 🙏`
    );
  };

  const handleUpiPay = () => {
    const upiLink = `upi://pay?pa=${UPI_ID}&pn=Marwad%20Maratha&am=${totalAmount}&cu=INR`;
    window.open(upiLink, "_blank", "noopener");
  };

  const handleWhatsAppConfirm = async () => {
    if (!isFormValid) {
      toast({ title: "Please fill all delivery details", variant: "destructive" });
      return;
    }
    setProcessing(true);

    try {
      await fetch(
        "https://bbjtukueneekrzuieuxw.supabase.co/functions/v1/send-business-order-notification",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            customer: formData,
            items: cartItems,
            amount: totalAmount,
            submittedAt: new Date().toISOString(),
            paymentMode,
            paymentDone: false,
          }),
        }
      );
    } catch (err) {
      console.error("Failed to notify:", err);
    }

    // Store order for confirmation page
    sessionStorage.setItem("lastOrder", JSON.stringify({
      items: cartItems,
      total: totalAmount,
      address: `${formData.address}, ${formData.city} - ${formData.pincode}`,
      paymentMode,
      name: formData.name,
    }));

    const waUrl = `https://wa.me/91${BUSINESS_PHONE}?text=${buildWhatsAppMessage()}`;
    window.open(waUrl, "_blank", "noopener");

    clearCart();
    setProcessing(false);
    navigate("/order-received");
  };

  const handleCodOrder = async () => {
    if (!isFormValid) {
      toast({ title: "Please fill all delivery details", variant: "destructive" });
      return;
    }
    setProcessing(true);

    try {
      await fetch(
        "https://bbjtukueneekrzuieuxw.supabase.co/functions/v1/send-business-order-notification",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            customer: formData,
            items: cartItems,
            amount: totalAmount,
            submittedAt: new Date().toISOString(),
            paymentMode: "cod",
            paymentDone: false,
          }),
        }
      );
    } catch (err) {
      console.error("Failed to notify:", err);
    }

    sessionStorage.setItem("lastOrder", JSON.stringify({
      items: cartItems,
      total: totalAmount,
      address: `${formData.address}, ${formData.city} - ${formData.pincode}`,
      paymentMode: "cod",
      name: formData.name,
    }));

    clearCart();
    setProcessing(false);
    navigate("/order-received");
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen" style={{ background: "#FCF7F1" }}>
        <header className="py-4 px-6 border-b" style={{ borderColor: "hsl(20 10% 85%)" }}>
          <Link to="/" className="flex items-center gap-2">
            <img src={productImages.logo} alt="Logo" className="h-10" />
            <span className="font-heritage font-bold text-lg" style={{ color: "#5A0A0A" }}>Marwad Maratha</span>
          </Link>
        </header>
        <div className="flex flex-col items-center justify-center py-24 px-4 text-center">
          <h2 className="font-heritage text-2xl font-bold mb-3" style={{ color: "#5A0A0A" }}>Your cart is empty</h2>
          <p className="text-muted-foreground mb-6">Browse our products and add items to proceed.</p>
          <Link to="/" className="px-6 py-3 rounded-2xl font-medium text-white" style={{ background: "#850E35" }}>
            Browse Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: "#FCF7F1" }}>
      {/* Minimal Header */}
      <header className="py-4 px-6 border-b" style={{ borderColor: "hsl(20 10% 85%)" }}>
        <Link to="/" className="flex items-center gap-2">
          <img src={productImages.logo} alt="Logo" className="h-10" />
          <span className="font-heritage font-bold text-lg" style={{ color: "#5A0A0A" }}>Marwad Maratha</span>
        </Link>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-3xl">
        {/* Breadcrumb */}
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

          {/* SECTION 1: Order Summary */}
          <div className="bg-white rounded-2xl p-5 md:p-6 mb-6" style={{ boxShadow: "0 2px 12px rgba(90,10,10,0.06)" }}>
            <h2 className="font-heritage text-xl font-bold mb-4" style={{ color: "#5A0A0A" }}>Order Summary</h2>
            <div className="space-y-3">
              {cartItems.map(item => (
                <div key={item.id} className="flex items-center gap-3 pb-3 border-b border-muted/50 last:border-0 last:pb-0">
                  <div className="w-14 h-14 rounded-xl overflow-hidden flex-shrink-0 bg-muted">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover"
                      onError={(e) => { (e.target as HTMLImageElement).src = "/placeholder.svg"; }} />
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
                <span className="text-mehendi font-medium">{DELIVERY_CHARGE === 0 ? "Free" : `₹${DELIVERY_CHARGE}`}</span>
              </div>
              <div className="flex justify-between text-lg font-bold pt-2" style={{ color: "#5A0A0A" }}>
                <span>Total</span>
                <span>₹{totalAmount}</span>
              </div>
            </div>
          </div>

          {/* SECTION 2: Delivery Details */}
          <div className="bg-white rounded-2xl p-5 md:p-6 mb-6" style={{ boxShadow: "0 2px 12px rgba(90,10,10,0.06)" }}>
            <h2 className="font-heritage text-xl font-bold mb-4" style={{ color: "#5A0A0A" }}>Delivery Details</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1.5">Full Name</label>
                <input type="text" name="name" value={formData.name} onChange={handleChange} required
                  className="w-full px-4 py-3 rounded-xl border border-input bg-background focus:outline-none focus:ring-2 focus:ring-accent/30 text-sm"
                  placeholder="Your full name" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">Phone Number</label>
                <input type="tel" name="phone" value={formData.phone} onChange={handleChange} required
                  className="w-full px-4 py-3 rounded-xl border border-input bg-background focus:outline-none focus:ring-2 focus:ring-accent/30 text-sm"
                  placeholder="Your phone number" />
                <p className="text-xs text-muted-foreground mt-1.5">We may contact you to confirm your order.</p>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">Address</label>
                <textarea name="address" value={formData.address} onChange={handleChange} required rows={2}
                  className="w-full px-4 py-3 rounded-xl border border-input bg-background focus:outline-none focus:ring-2 focus:ring-accent/30 text-sm resize-none"
                  placeholder="Full delivery address" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium mb-1.5">City</label>
                  <input type="text" name="city" value={formData.city} onChange={handleChange} required
                    className="w-full px-4 py-3 rounded-xl border border-input bg-background focus:outline-none focus:ring-2 focus:ring-accent/30 text-sm"
                    placeholder="City" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5">Pincode</label>
                  <input type="text" name="pincode" value={formData.pincode} onChange={handleChange} required
                    className="w-full px-4 py-3 rounded-xl border border-input bg-background focus:outline-none focus:ring-2 focus:ring-accent/30 text-sm"
                    placeholder="Pincode" />
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 3: Payment Method */}
          <div className="bg-white rounded-2xl p-5 md:p-6 mb-6" style={{ boxShadow: "0 2px 12px rgba(90,10,10,0.06)" }}>
            <h2 className="font-heritage text-xl font-bold mb-4" style={{ color: "#5A0A0A" }}>Choose Payment Method</h2>
            <div className="space-y-3">
              <label className={`flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                paymentMode === "upi" ? "border-accent bg-accent/5" : "border-muted hover:border-muted-foreground/30"
              }`}>
                <input type="radio" name="payment" value="upi" checked={paymentMode === "upi"}
                  onChange={() => setPaymentMode("upi")} className="mt-1 accent-accent" />
                <div>
                  <p className="font-semibold text-sm">UPI — Instant & Secure</p>
                  <p className="text-xs text-muted-foreground mt-0.5">Recommended for all prepaid orders.</p>
                </div>
              </label>
              <label className={`flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                paymentMode === "cod" ? "border-accent bg-accent/5" : "border-muted hover:border-muted-foreground/30"
              }`}>
                <input type="radio" name="payment" value="cod" checked={paymentMode === "cod"}
                  onChange={() => setPaymentMode("cod")} className="mt-1 accent-accent" />
                <div>
                  <p className="font-semibold text-sm">Cash on Delivery</p>
                  <p className="text-xs text-muted-foreground mt-0.5">Available for verified local customers only. Contact us to request.</p>
                </div>
              </label>
            </div>
          </div>

          {/* SECTION 4: UPI Payment Block */}
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
                onClick={handleWhatsAppConfirm}
                disabled={processing || !isFormValid}
                className="w-full py-3.5 rounded-xl font-semibold text-white flex items-center justify-center gap-2 transition-all"
                style={{ background: "#25D366", minHeight: "48px" }}
              >
                <MessageCircle size={18} />
                {processing ? "Processing..." : "Confirm on WhatsApp"}
              </button>
            </motion.div>
          )}

          {/* COD Place Order */}
          {paymentMode === "cod" && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="mb-6"
            >
              <button
                onClick={handleCodOrder}
                disabled={processing || !isFormValid}
                className="w-full py-3.5 rounded-xl font-semibold text-white transition-all"
                style={{ background: "#850E35", minHeight: "48px", opacity: isFormValid ? 1 : 0.5 }}
              >
                {processing ? "Processing..." : "Place Order (Cash on Delivery)"}
              </button>
            </motion.div>
          )}

          {/* SECTION 5: Support Strip */}
          <div className="rounded-2xl p-5 md:p-6 text-center" style={{ background: "#F5EDE4" }}>
            <p className="text-sm font-medium mb-3" style={{ color: "#5A0A0A" }}>
              Have questions before placing your order?
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a
                href={`https://wa.me/91${BUSINESS_PHONE}`}
                target="_blank"
                rel="noopener"
                className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-medium text-white text-sm"
                style={{ background: "#25D366", minHeight: "48px" }}
              >
                <MessageCircle size={16} />
                Chat on WhatsApp
              </a>
              <a
                href={`tel:+91${BUSINESS_PHONE}`}
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
