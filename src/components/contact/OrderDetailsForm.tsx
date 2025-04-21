import { useState } from "react";
import { motion } from "framer-motion";
import { useCart } from "@/hooks/useCart";
import { useToast } from "@/hooks/use-toast";
import PaymentOptions from "./PaymentOptions";

const YOUR_UPI_ID = "88302575741@ybl";
const UPI_LINK = `upi://pay?pa=${YOUR_UPI_ID}&pn=Durga Gurhudyog&cu=INR`;
const QR_URL = ""; // Leave blank for now, will update when image is provided.
const BUSINESS_PHONE = "8830257574"; // Your business phone number

export interface OrderDetailsFormProps {
  onOrderPlaced?: () => void;
}

export default function OrderDetailsForm({ onOrderPlaced }: OrderDetailsFormProps) {
  const { cartItems, clearCart } = useCart();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
  });
  const [paymentMode, setPaymentMode] = useState("upi");
  const [paymentDone, setPaymentDone] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [processing, setProcessing] = useState(false);

  // Show WhatsApp confirmation and updated COD message states
  const [showCodMessage, setShowCodMessage] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (paymentMode !== "cod" && !paymentDone) {
      toast({
        title: "Complete Payment",
        description: "Please complete payment before placing your order.",
        variant: "destructive",
      });
      return;
    }

    setProcessing(true);
    const orderPayload = {
      customer: { ...formData },
      items: cartItems,
      amount: cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0),
      submittedAt: new Date().toISOString(),
      paymentMode,
      paymentDone: paymentMode === "cod" ? false : true,
    };

    try {
      // Send notification to business owner via email
      const response = await fetch("https://bbjtukueneekrzuieuxw.supabase.co/functions/v1/send-business-order-notification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderPayload),
      });
      
      const result = await response.json();
      console.log("Notification result:", result);
      
      // Send automated thank you message to customer
      // Note: This happens in the edge function, not redirecting the customer
    } catch (err) {
      console.error("Failed to notify business owner:", err);
    }

    toast({
      title: "Order Placed Successfully!",
      description: "Thank you for your order. We will contact you shortly.",
    });

    setSubmitted(true);
    setProcessing(false);
    clearCart();
    setFormData({ name: "", phone: "", email: "", address: "" });
    setPaymentDone(false);
    onOrderPlaced?.();

    // Show updated COD confirmation message for COD only
    if (paymentMode === "cod") {
      setShowCodMessage(true);
    } else {
      setShowCodMessage(false);
    }

    setTimeout(() => {
      setShowCodMessage(false);
      setSubmitted(false);
    }, 5000);
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-3">
        <div>
          <label className="block text-sm font-medium mb-1">
            Name
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-muted rounded-lg focus:outline-none focus:ring-2 focus:ring-maroon text-base"
            placeholder="Your name"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">
            Phone
          </label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-muted rounded-lg focus:outline-none focus:ring-2 focus:ring-maroon text-base"
            placeholder="Your phone number"
            required
          />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Email</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-muted rounded-lg focus:outline-none focus:ring-2 focus:ring-maroon text-base"
          placeholder="Your email address"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">
          Delivery Address
        </label>
        <textarea
          name="address"
          value={formData.address}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-muted rounded-lg focus:outline-none focus:ring-2 focus:ring-maroon text-base"
          rows={3}
          placeholder="Your full address"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">
          Most Preferred Products <span className="text-xs text-muted-foreground">(select or review your selection below)</span>
        </label>
        {cartItems.length > 0 ? (
          <div className="space-y-2 max-h-48 overflow-y-auto border border-muted rounded-lg p-3">
            {cartItems.map(item => (
              <div key={item.id} className="flex justify-between items-center text-sm border-b pb-1">
                <span>{item.name} x {item.quantity}</span>
                <span>₹{item.price * item.quantity}</span>
              </div>
            ))}
            <div className="pt-2 font-medium flex justify-between">
              <span>Total:</span>
              <span>₹{cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)}</span>
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            <div className="flex items-center">
              <input type="checkbox" id="aam-aachar" className="mr-2 h-4 w-4 text-maroon rounded focus:ring-maroon" />
              <label htmlFor="aam-aachar">
                Aam Aachar (₹299/jar)
              </label>
            </div>
            <div className="flex items-center">
              <input type="checkbox" id="lassan-aachar" className="mr-2 h-4 w-4 text-maroon rounded focus:ring-maroon" />
              <label htmlFor="lassan-aachar">
                Lassan Aachar (₹249/jar)
              </label>
            </div>
            <div className="flex items-center">
              <input type="checkbox" id="hari-mirch-kuta" className="mr-2 h-4 w-4 text-maroon rounded focus:ring-maroon" />
              <label htmlFor="hari-mirch-kuta">
                Hari Mirch Kuta (₹229/jar)
              </label>
            </div>
            <div className="flex items-center">
              <input type="checkbox" id="rice-papad" className="mr-2 h-4 w-4 text-maroon rounded focus:ring-maroon" />
              <label htmlFor="rice-papad">
                Rice Papad (₹159/pack)
              </label>
            </div>
            <div className="flex items-center">
              <input type="checkbox" id="potato-chips" className="mr-2 h-4 w-4 text-maroon rounded focus:ring-maroon" />
              <label htmlFor="potato-chips">
                Potato Chips (₹149/pack)
              </label>
            </div>
            <div className="flex items-center">
              <input type="checkbox" id="wheat-kurodi" className="mr-2 h-4 w-4 text-maroon rounded focus:ring-maroon" />
              <label htmlFor="wheat-kurodi">
                Wheat Kurodi (₹179/pack)
              </label>
            </div>
          </div>
        )}
      </div>
      <PaymentOptions
        paymentMode={paymentMode}
        setPaymentMode={setPaymentMode}
        paymentDone={paymentDone}
        setPaymentDone={setPaymentDone}
        upiId={YOUR_UPI_ID}
        upiLink={UPI_LINK}
        qrUrl={QR_URL}
        processing={processing}
      />
      <motion.button
        type="submit"
        className={`w-full rounded-full py-4 font-medium text-lg ${
          paymentMode !== "cod" && !paymentDone
            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
            : "bg-maroon hover:bg-maroon/90 text-white"
        }`}
        whileHover={{ scale: paymentMode !== "cod" && !paymentDone ? 1 : 1.02 }}
        whileTap={{ scale: 0.98 }}
        disabled={
          submitted ||
          processing ||
          (paymentMode !== "cod" && !paymentDone)
        }
      >
        {processing
          ? "Processing..."
          : submitted
          ? "Order Placed!"
          : paymentMode === "cod"
          ? "Place Order"
          : paymentDone
          ? "Place Order"
          : "Complete Payment to Place Order"}
      </motion.button>
      {/* Show COD message only for Cash on Delivery after placing the order */}
      {showCodMessage && paymentMode === "cod" && (
        <div className="mt-3 text-sm text-green-700 bg-green-100 border border-green-200 px-3 py-3 rounded-lg font-medium">
          ✅ Order received! Your order has been successfully noted. Our team will contact you shortly via phone or WhatsApp to confirm the details.<br />
          Thank you for choosing Marwad Maratha!
        </div>
      )}
    </form>
  );
}
