import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { productImages } from "@/utils/imageAssets";
import { Phone, MessageCircle, CheckCircle } from "lucide-react";

const BUSINESS_PHONE = "8830257574";

interface OrderData {
  items: { name: string; quantity: number; price: number }[];
  total: number;
  address: string;
  paymentMode: string;
  name: string;
}

const OrderReceived = () => {
  const [order, setOrder] = useState<OrderData | null>(null);

  useEffect(() => {
    const raw = sessionStorage.getItem("lastOrder");
    if (raw) {
      setOrder(JSON.parse(raw));
      sessionStorage.removeItem("lastOrder");
    }
  }, []);

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "#FCF7F1" }}>
      {/* Header */}
      <header className="py-4 px-6 border-b" style={{ borderColor: "hsl(20 10% 85%)" }}>
        <Link to="/" className="flex items-center gap-2">
          <img src={productImages.logo} alt="Logo" className="h-10" />
          <span className="font-heritage font-bold text-lg" style={{ color: "#5A0A0A" }}>Marwad Maratha</span>
        </Link>
      </header>

      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-lg"
        >
          <div className="bg-white rounded-2xl p-6 md:p-8 text-center" style={{ boxShadow: "0 2px 16px rgba(90,10,10,0.08)" }}>
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{ background: "#F0FFF4" }}>
                <CheckCircle size={36} className="text-mehendi" />
              </div>
            </div>

            <h1 className="font-heritage text-2xl md:text-3xl font-bold mb-2" style={{ color: "#5A0A0A" }}>
              Order Confirmation in Progress
            </h1>
            <p className="text-muted-foreground text-sm mb-1">
              Thank you for your order. We are verifying your payment and will confirm via WhatsApp shortly.
            </p>
            <p className="text-xs text-muted-foreground mb-5">
              Orders are usually confirmed within 30 minutes during business hours.
            </p>

            {/* Mini Order Summary */}
            {order && (
              <div className="text-left rounded-xl p-4 mb-5" style={{ background: "#FBF6EF" }}>
                <h3 className="font-semibold text-sm mb-2" style={{ color: "#5A0A0A" }}>Order Summary</h3>
                <div className="space-y-1 text-sm">
                  {order.items.map((item, i) => (
                    <div key={i} className="flex justify-between">
                      <span className="text-muted-foreground">{item.name} x{item.quantity}</span>
                      <span>₹{item.price * item.quantity}</span>
                    </div>
                  ))}
                  <div className="flex justify-between font-bold pt-2 border-t border-muted/40" style={{ color: "#5A0A0A" }}>
                    <span>Total</span>
                    <span>₹{order.total}</span>
                  </div>
                </div>
                <div className="mt-3 text-xs text-muted-foreground space-y-0.5">
                  <p><span className="font-medium text-foreground">Delivery:</span> {order.address}</p>
                  <p><span className="font-medium text-foreground">Payment:</span> {order.paymentMode === "cod" ? "Cash on Delivery" : "UPI"}</p>
                </div>
              </div>
            )}

            {/* Next Steps */}
            <div className="text-left rounded-xl p-4 mb-5" style={{ background: "#FBF6EF" }}>
              <h3 className="font-semibold text-sm mb-3" style={{ color: "#5A0A0A" }}>What happens next?</h3>
              <div className="space-y-3">
                {[
                  { step: "1", text: "We verify your payment" },
                  { step: "2", text: "We confirm via WhatsApp" },
                  { step: "3", text: "We prepare your order fresh" },
                ].map(s => (
                  <div key={s.step} className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                      style={{ background: "#850E35" }}>{s.step}</span>
                    <span className="text-sm text-muted-foreground">{s.text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Support */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a
                href={`https://wa.me/91${BUSINESS_PHONE}`}
                target="_blank"
                rel="noopener"
                className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-medium text-white text-sm"
                style={{ background: "#25D366", minHeight: "48px" }}
              >
                <MessageCircle size={16} />
                WhatsApp
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

            <Link to="/" className="block mt-5 text-sm text-accent hover:underline">
              ← Back to Home
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default OrderReceived;
