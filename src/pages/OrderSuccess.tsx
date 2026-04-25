import { useEffect, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { productImages } from "@/utils/imageAssets";
import { Phone, CheckCircle, Clock, XCircle, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface OrderData {
  orderNumber?: string;
  items: { name: string; quantity: number; price: number }[];
  total: number;
  address: string;
  paymentMode: string;
  name: string;
  phone?: string;
}

type StatusKind = "pending" | "paid" | "failed" | "cod";

const OrderSuccess = () => {
  const [params] = useSearchParams();
  const orderNumber = params.get("order") || "";
  const [order, setOrder] = useState<OrderData | null>(null);
  const [paymentStatus, setPaymentStatus] = useState<StatusKind>("pending");
  const [orderStatus, setOrderStatus] = useState<string>("new");
  const [polling, setPolling] = useState(true);
  const pollRef = useRef<number | null>(null);

  // Hydrate from sessionStorage (for instant render)
  useEffect(() => {
    const raw = sessionStorage.getItem("lastOrder");
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        setOrder(parsed);
        if (parsed.paymentMode === "cod") setPaymentStatus("cod");
      } catch {
        // ignore
      }
    }
  }, []);

  // Poll the public_order_status view every 8s for status updates
  useEffect(() => {
    if (!orderNumber) {
      setPolling(false);
      return;
    }

    const fetchStatus = async () => {
      const { data, error } = await (supabase as any)
        .from("public_order_status")
        .select("payment_status, order_status, payment_method")
        .eq("order_number", orderNumber)
        .maybeSingle();

      if (error) {
        console.error("[order-success] poll error", error);
        return;
      }
      if (!data) return;

      const d = data as { payment_status: string; order_status: string; payment_method: string };
      setOrderStatus(d.order_status);

      if (d.payment_method === "COD") {
        setPaymentStatus("cod");
        setPolling(false);
        return;
      }
      if (d.payment_status === "paid") {
        setPaymentStatus("paid");
        setPolling(false);
      } else if (d.payment_status === "failed") {
        setPaymentStatus("failed");
        setPolling(false);
      } else {
        setPaymentStatus("pending");
      }
    };

    fetchStatus();
    pollRef.current = window.setInterval(fetchStatus, 8000);
    // Stop polling after 10 minutes regardless
    const stopAt = window.setTimeout(() => {
      if (pollRef.current) window.clearInterval(pollRef.current);
      setPolling(false);
    }, 10 * 60 * 1000);

    return () => {
      if (pollRef.current) window.clearInterval(pollRef.current);
      window.clearTimeout(stopAt);
    };
  }, [orderNumber]);

  // Status badge config
  const badge = (() => {
    switch (paymentStatus) {
      case "paid":
        return {
          icon: <CheckCircle size={20} />,
          label: "Payment Confirmed",
          desc: "Thank you! We've received your payment and will start preparing your order.",
          bg: "#E6F7EC",
          fg: "#0F6D2E",
        };
      case "cod":
        return {
          icon: <CheckCircle size={20} />,
          label: "Order Confirmed — Cash on Delivery",
          desc: "We'll prepare your order and contact you before delivery.",
          bg: "#E6F7EC",
          fg: "#0F6D2E",
        };
      case "failed":
        return {
          icon: <XCircle size={20} />,
          label: "Payment Not Verified",
          desc: "We couldn't confirm your payment. Please call us to resolve this.",
          bg: "#FDECEC",
          fg: "#9B1C1C",
        };
      default:
        return {
          icon: <Clock size={20} />,
          label: "Payment Pending Verification",
          desc: "Your order is placed. We'll verify your UPI payment shortly — this page will update automatically.",
          bg: "#FFF6E0",
          fg: "#8A5A00",
        };
    }
  })();

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "#FCF7F1" }}>
      <header className="py-4 px-6 border-b" style={{ borderColor: "hsl(20 10% 85%)" }}>
        <Link to="/" className="flex items-center gap-2">
          <img src={productImages.logo} alt="Logo" className="h-10" />
          <span className="font-heritage font-bold text-lg" style={{ color: "#5A0A0A" }}>
            Marwad Maratha
          </span>
        </Link>
      </header>

      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-lg"
        >
          <div
            className="bg-white rounded-2xl p-6 md:p-8 text-center"
            style={{ boxShadow: "0 2px 16px rgba(90,10,10,0.08)" }}
          >
            <h1 className="font-heritage text-2xl md:text-3xl font-bold mb-2" style={{ color: "#5A0A0A" }}>
              Order Placed Successfully
            </h1>
            {orderNumber && (
              <p className="text-sm font-medium mb-5" style={{ color: "#850E35" }}>
                Order #{orderNumber}
              </p>
            )}

            {/* Live status badge */}
            <div
              className="flex items-start gap-3 rounded-xl p-4 mb-5 text-left"
              style={{ background: badge.bg, color: badge.fg }}
            >
              <div className="mt-0.5 flex-shrink-0">{badge.icon}</div>
              <div className="flex-1">
                <p className="font-semibold text-sm flex items-center gap-2">
                  {badge.label}
                  {polling && paymentStatus === "pending" && (
                    <Loader2 size={14} className="animate-spin opacity-70" />
                  )}
                </p>
                <p className="text-xs mt-1 opacity-90">{badge.desc}</p>
              </div>
            </div>

            {/* Mini Order Summary */}
            {order && (
              <div className="text-left rounded-xl p-4 mb-5" style={{ background: "#FBF6EF" }}>
                <h3 className="font-semibold text-sm mb-2" style={{ color: "#5A0A0A" }}>
                  Order Summary
                </h3>
                <div className="space-y-1 text-sm">
                  {order.items.map((item, i) => (
                    <div key={i} className="flex justify-between">
                      <span className="text-muted-foreground">
                        {item.name} x{item.quantity}
                      </span>
                      <span>₹{item.price * item.quantity}</span>
                    </div>
                  ))}
                  <div
                    className="flex justify-between font-bold pt-2 border-t border-muted/40"
                    style={{ color: "#5A0A0A" }}
                  >
                    <span>Total</span>
                    <span>₹{order.total}</span>
                  </div>
                </div>
                <div className="mt-3 text-xs text-muted-foreground space-y-0.5">
                  <p>
                    <span className="font-medium text-foreground">Delivery:</span> {order.address}
                  </p>
                  <p>
                    <span className="font-medium text-foreground">Payment:</span>{" "}
                    {order.paymentMode === "cod" ? "Cash on Delivery" : "UPI"}
                  </p>
                </div>
              </div>
            )}

            {/* Order status timeline */}
            <div className="text-left rounded-xl p-4 mb-5" style={{ background: "#FBF6EF" }}>
              <h3 className="font-semibold text-sm mb-1" style={{ color: "#5A0A0A" }}>
                Order Status
              </h3>
              <p className="text-sm capitalize" style={{ color: "#850E35" }}>
                {orderStatus}
              </p>
            </div>

            {/* Support — call only, no customer-side WhatsApp send */}
            <p className="text-xs text-muted-foreground mb-3">Need help with this order?</p>
            <a
              href="tel:+918830257574"
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-medium text-sm border w-full"
              style={{ borderColor: "#850E35", color: "#850E35", minHeight: "48px" }}
            >
              <Phone size={16} />
              Call Us
            </a>

            <Link to="/" className="block mt-5 text-sm text-accent hover:underline">
              ← Back to Home
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default OrderSuccess;
