
import { useState } from "react";
import { motion } from "framer-motion";

export interface PaymentOptionsProps {
  paymentMode: string;
  setPaymentMode: (value: string) => void;
  paymentDone: boolean;
  setPaymentDone: (value: boolean) => void;
  upiId: string;
  upiLink: string;
  qrUrl: string;
  processing: boolean;
}

export default function PaymentOptions(props: PaymentOptionsProps) {
  const {
    paymentMode,
    setPaymentMode,
    paymentDone,
    setPaymentDone,
    upiId,
    upiLink,
    qrUrl,
    processing,
  } = props;

  const paymentOptions = [
    {
      id: "upi",
      label: "✅ UPI / QR Payment",
      description: "Pay via UPI app or scan the QR code. Order is confirmed after payment.",
      value: "upi"
    },
    {
      id: "card",
      label: "💳 Card Payment (Credit / Debit)",
      description: "Pay using credit or debit card. Order is confirmed after payment.",
      value: "card"
    },
    {
      id: "cod",
      label: "🚚 Pay on Delivery (COD)",
      description: "Pay with cash when you receive your order. Order is confirmed instantly.",
      value: "cod"
    }
  ];

  const PAYMENT_CARD_LINK = "https://paytm.me/a-Paylink-Dummy"; // Replace with your live payment link

  const handlePayment = () => {
    if (paymentMode === "upi") {
      window.open(upiLink, "_blank", "noopener");
    } else if (paymentMode === "card") {
      window.open(PAYMENT_CARD_LINK, "_blank", "noopener");
    }
    setTimeout(() => setPaymentDone(true), 600);
  };

  return (
    <div>
      <label className="block text-sm font-medium mb-2">
        Choose Payment Option <span className="text-xs text-muted-foreground">(Order confirmation depends on selected method.)</span>
      </label>
      <div className="grid md:grid-cols-3 gap-4">
        {paymentOptions.map(option => (
          <label
            key={option.id}
            className={`cursor-pointer flex flex-col border rounded-lg p-4 transition ${
              paymentMode === option.value
                ? "border-maroon bg-maroon/5 shadow"
                : "border-muted hover:bg-muted/30"
            }`}
          >
            <span className="font-semibold">{option.label}</span>
            <span className="text-xs text-muted-foreground mt-1">{option.description}</span>
            <input
              type="radio"
              value={option.value}
              onChange={() => { setPaymentMode(option.value); setPaymentDone(false); }}
              checked={paymentMode === option.value}
              className="mt-3 mr-2"
              name="paymentMode"
              disabled={processing}
            />
          </label>
        ))}
      </div>
      <div className="mt-4">
        {paymentMode === "upi" && (
          <div>
            <div className="flex flex-col items-center gap-2">
              <button
                type="button"
                onClick={handlePayment}
                className="bg-maroon hover:bg-maroon/90 text-white rounded px-5 py-2 font-semibold mb-2"
                disabled={processing}
              >
                Pay via UPI Link / Scan QR
              </button>
              <div className="text-xs mb-2">
                <span className="font-semibold">UPI ID:</span>{" "}
                <span className="bg-white rounded px-2 py-1 border border-saffron/30 select-all">
                  {upiId}
                </span>
              </div>
              <div className="flex flex-col items-center">
                <span className="font-semibold mb-1">Or scan QR:</span>
                {qrUrl ? (
                  <img
                    src={qrUrl}
                    alt="Scan to pay UPI QR"
                    className="w-32 h-32 object-contain"
                  />
                ) : (
                  <div className="w-32 h-32 flex items-center justify-center bg-muted text-muted-foreground border border-saffron/30 rounded">
                    QR Not Available Yet
                  </div>
                )}
              </div>
              <div className="text-xs text-muted-foreground mt-2 text-center">
                After paying, click below to confirm payment.<br />
                <button
                  type="button"
                  className="mt-2 px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                  onClick={() => setPaymentDone(true)}
                  disabled={paymentDone || processing}
                >
                  {paymentDone ? "Payment Confirmed" : "I have paid"}
                </button>
              </div>
            </div>
          </div>
        )}
        {paymentMode === "card" && (
          <div className="flex flex-col items-start gap-2">
            <button
              type="button"
              onClick={handlePayment}
              className="bg-saffron hover:bg-maroon/90 hover:text-white text-maroon rounded px-4 py-2 font-semibold mt-1 mb-2"
              disabled={processing}
            >
              Pay Now via Card/Link
            </button>
            <div className="text-xs text-muted-foreground text-left">
              Card payment is redirected to a secure Paytm link.<br />
              After paying, click to confirm payment.<br />
              <button
                type="button"
                className="mt-2 px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                onClick={() => setPaymentDone(true)}
                disabled={paymentDone || processing}
              >
                {paymentDone ? "Payment Confirmed" : "I have paid"}
              </button>
            </div>
          </div>
        )}
        {paymentMode === "cod" && (
          <div className="text-green-700 text-sm my-2">
            Order will be confirmed instantly.<br />
            You pay with cash when you receive your order.
          </div>
        )}
      </div>
    </div>
  );
}
