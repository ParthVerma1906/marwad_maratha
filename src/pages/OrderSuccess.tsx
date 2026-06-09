import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { QRCodeSVG } from "qrcode.react";
import { productImages } from "@/utils/imageAssets";
import { Phone, CheckCircle, Clock, XCircle, Loader2, Copy, Check, Smartphone } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface OrderData {
  orderNumber?: string;
  items: { name: string; quantity: number; price: number }[];
  total: number;
  address: string;
  paymentMode: string;
  name: string;
  phone?: string;
  upiId?: string;
  businessName?: string;
}

type StatusKind = "pending" | "awaiting" | "paid" | "failed" | "cod";

const FALLBACK_UPI = "88302575741@ybl";
const FALLBACK_NAME = "Marwad Maratha";

const isMobile = () =>
  typeof navigator !== "undefined" && /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

const OrderSuccess = () => {
  const [params] = useSearchParams();
  const { toast } = useToast();
  const orderNumber = params.get("order") || "";
  const [order, setOrder] = useState<OrderData | null>(null);
  const [paymentStatus, setPaymentStatus] = useState<StatusKind>("pending");
  const [orderStatus, setOrderStatus] = useState<string>("new");
  const [paymentReference, setPaymentReference] = useState<string | null>(null);
  const [polling, setPolling] = useState(true);
  const pollRef = useRef<number | null>(null);

  const [utr, setUtr] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [copied, setCopied] = useState(false);

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

  const upiId = order?.upiId || FALLBACK_UPI;
  const businessName = order?.businessName || FALLBACK_NAME;
  const amount = order?.total || 0;

  const upiLink = useMemo(
    () =>
      `upi://pay?pa=${upiId}&pn=${encodeURIComponent(businessName)}&am=${amount}&cu=INR&tn=${encodeURIComponent(
        orderNumber || "",
      )}`,
    [upiId, businessName, amount, orderNumber],
  );

  const applyRow = (d: {
    payment_status: string;
    order_status: string;
    payment_method: string;
    payment_reference?: string | null;
  }) => {
    setOrderStatus(d.order_status);
    setPaymentReference(d.payment_reference ?? null);
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
    } else if (d.payment_status === "awaiting_verification") {
      setPaymentStatus("awaiting");
    } else {
      setPaymentStatus("pending");
    }
  };

  useEffect(() => {
    if (!orderNumber) {
      setPolling(false);
      return;
    }

    const fetchStatus = async () => {
      const { data, error } = await (supabase as any)
        .from("public_order_status")
        .select("payment_status, order_status, payment_method, payment_reference")
        .eq("order_number", orderNumber)
        .maybeSingle();
      if (error) {
        console.error("[order-success] fetch error", error);
        return;
      }
      if (data) applyRow(data);
    };

    fetchStatus();

    const channel = supabase
      .channel(`order-${orderNumber}`)
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "orders", filter: `order_number=eq.${orderNumber}` },
        (payload) => {
          applyRow(payload.new as any);
        },
      )
      .subscribe();

    pollRef.current = window.setInterval(fetchStatus, 15000);
    const stopAt = window.setTimeout(() => {
      if (pollRef.current) window.clearInterval(pollRef.current);
      setPolling(false);
    }, 15 * 60 * 1000);

    return () => {
      supabase.removeChannel(channel);
      if (pollRef.current) window.clearInterval(pollRef.current);
      window.clearTimeout(stopAt);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderNumber]);

  const copyUpi = async () => {
    try {
      await navigator.clipboard.writeText(upiId);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      toast({ title: "Copy failed", description: "Long-press to copy manually.", variant: "destructive" });
    }
  };

  const submitUtr = async () => {
    const clean = utr.replace(/\s+/g, "");
    if (!/^[0-9A-Za-z]{10,23}$/.test(clean)) {
      toast({
        title: "Invalid UTR",
        description: "Enter the 12-digit transaction reference from your UPI app.",
        variant: "destructive",
      });
      return;
    }
    setSubmitting(true);
    const { data, error } = await supabase.rpc("submit_payment_reference", {
      _order_number: orderNumber,
      _utr: clean,
    });
    setSubmitting(false);
    if (error || !data) {
      toast({
        title: "Could not submit",
        description: error?.message ?? "Order already verified or not found.",
        variant: "destructive",
      });
      return;
    }
    setPaymentStatus("awaiting");
    setPaymentReference(clean);
    toast({
      title: "Thanks — we'll verify your payment",
      description: "Status will update automatically here.",
    });
  };

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
      case "awaiting":
        return {
          icon: <Clock size={20} />,
          label: "Awaiting Verification",
          desc: `Reference ${paymentReference ?? ""} received. Our team will confirm shortly.`,
          bg: "#FFF6E0",
          fg: "#8A5A00",
        };
      default:
        return {
          icon: <Clock size={20} />,
          label: "Payment Pending",
          desc: "Complete the UPI payment, then submit your transaction reference below.",
          bg: "#FFF6E0",
          fg: "#8A5A00",
        };
    }
  })();

  const showPayBlock =
    order?.paymentMode === "upi" && (paymentStatus === "pending" || paymentStatus === "awaiting");

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
            className="bg-white rounded-2xl p-6 md:p-8"
            style={{ boxShadow: "0 2px 16px rgba(90,10,10,0.08)" }}
          >
            <div className="text-center">
              <h1 className="font-heritage text-2xl md:text-3xl font-bold mb-2" style={{ color: "#5A0A0A" }}>
                Order Placed Successfully
              </h1>
              {orderNumber && (
                <p className="text-sm font-medium mb-5" style={{ color: "#850E35" }}>
                  Order #{orderNumber}
                </p>
              )}
            </div>

            <div
              className="flex items-start gap-3 rounded-xl p-4 mb-5"
              style={{ background: badge.bg, color: badge.fg }}
            >
              <div className="mt-0.5 flex-shrink-0">{badge.icon}</div>
              <div className="flex-1">
                <p className="font-semibold text-sm flex items-center gap-2">
                  {badge.label}
                  {polling && (paymentStatus === "pending" || paymentStatus === "awaiting") && (
                    <Loader2 size={14} className="animate-spin opacity-70" />
                  )}
                </p>
                <p className="text-xs mt-1 opacity-90">{badge.desc}</p>
              </div>
            </div>

            {showPayBlock && (
              <div className="rounded-xl p-4 mb-5 border" style={{ borderColor: "#E8D9C4", background: "#FBF6EF" }}>
                <h3 className="font-semibold text-sm mb-3" style={{ color: "#5A0A0A" }}>
                  Pay ₹{amount} via UPI
                </h3>

                <div className="flex items-center justify-between gap-2 bg-white border border-muted rounded-lg p-3 mb-3">
                  <div className="min-w-0">
                    <p className="text-[11px] text-muted-foreground">UPI ID</p>
                    <p className="font-mono text-sm font-semibold truncate" style={{ color: "#5A0A0A" }}>
                      {upiId}
                    </p>
                  </div>
                  <button
                    onClick={copyUpi}
                    className="flex items-center gap-1 px-3 py-2 rounded-lg text-xs font-medium min-h-[40px]"
                    style={{ background: copied ? "#E6F7EC" : "#850E35", color: copied ? "#0F6D2E" : "#fff" }}
                  >
                    {copied ? <Check size={14} /> : <Copy size={14} />}
                    {copied ? "Copied" : "Copy"}
                  </button>
                </div>

                {!isMobile() ? (
                  <div className="flex flex-col items-center gap-2 mb-3 p-3 bg-white rounded-lg border border-muted">
                    <QRCodeSVG value={upiLink} size={168} includeMargin />
                    <p className="text-xs text-muted-foreground text-center">
                      Scan with any UPI app (PhonePe, GPay, Paytm)
                    </p>
                  </div>
                ) : (
                  <a
                    href={upiLink}
                    className="flex items-center justify-center gap-2 w-full py-3 rounded-lg font-medium text-white mb-3"
                    style={{ background: "#850E35", minHeight: "48px" }}
                  >
                    <Smartphone size={16} />
                    Open UPI App to Pay
                  </a>
                )}

                {paymentStatus !== "awaiting" ? (
                  <div>
                    <label className="block text-xs font-medium mb-1.5" style={{ color: "#5A0A0A" }}>
                      After paying, enter your 12-digit UPI reference / UTR
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        inputMode="numeric"
                        value={utr}
                        onChange={(e) => setUtr(e.target.value.replace(/\s+/g, "").slice(0, 23))}
                        placeholder="e.g. 432109876543"
                        className="flex-1 px-3 py-2 border border-input rounded-lg text-sm bg-white min-h-[44px] font-mono"
                      />
                      <button
                        onClick={submitUtr}
                        disabled={submitting}
                        className="px-4 py-2 rounded-lg font-medium text-white text-sm min-h-[44px] disabled:opacity-60"
                        style={{ background: "#850E35" }}
                      >
                        {submitting ? <Loader2 size={16} className="animate-spin" /> : "Submit"}
                      </button>
                    </div>
                    <p className="text-[11px] text-muted-foreground mt-1.5">
                      Find this in your UPI app under "Transaction History" → "UTR" or "RRN".
                    </p>
                  </div>
                ) : (
                  <div className="text-xs p-3 rounded-lg" style={{ background: "#FFF6E0", color: "#8A5A00" }}>
                    Reference <span className="font-mono font-semibold">{paymentReference}</span> submitted.
                  </div>
                )}
              </div>
            )}

            {order && (
              <div className="rounded-xl p-4 mb-5" style={{ background: "#FBF6EF" }}>
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

            <div className="rounded-xl p-4 mb-5" style={{ background: "#FBF6EF" }}>
              <h3 className="font-semibold text-sm mb-1" style={{ color: "#5A0A0A" }}>
                Order Status
              </h3>
              <p className="text-sm capitalize" style={{ color: "#850E35" }}>
                {orderStatus}
              </p>
            </div>

            <p className="text-xs text-muted-foreground mb-3 text-center">Need help with this order?</p>
            <a
              href="tel:+918830257574"
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-medium text-sm border w-full"
              style={{ borderColor: "#850E35", color: "#850E35", minHeight: "48px" }}
            >
              <Phone size={16} />
              Call Us
            </a>

            <Link to="/" className="block mt-5 text-sm text-accent hover:underline text-center">
              ← Back to Home
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default OrderSuccess;
