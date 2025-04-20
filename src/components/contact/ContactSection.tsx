import { useState } from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { useCart } from "@/hooks/useCart";
import { useToast } from "@/components/ui/use-toast";

const BUSINESS_EMAIL = "durgagurhudyoggondia@gmail.com";
const BUSINESS_PHONE = "+91 8830257574";

const ContactSection = () => {
  const { ref, inView } = useInView({
    triggerOnce: false,
    threshold: 0.1,
  });

  const { cartItems, clearCart } = useCart();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    address: ""
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Prepare order payload for backend
    const orderPayload = {
      customer: { ...formData },
      items: cartItems,
      amount: cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0),
      submittedAt: new Date().toISOString(),
    };

    // Send order notification via Edge Function
    try {
      await fetch("https://bbjtukueneekrzuieuxw.supabase.co/functions/v1/send-business-order-notification", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderPayload),
      });
    } catch (err) {
      console.error("Failed to notify business owner:", err);
    }

    toast({
      title: "Order Placed Successfully!",
      description: "Thank you for your order. We will contact you shortly.",
    });

    setSubmitted(true);
    clearCart();
    setFormData({
      name: "",
      phone: "",
      email: "",
      address: ""
    });

    // Reset submitted state after a delay
    setTimeout(() => {
      setSubmitted(false);
    }, 5000);
  };

  return (
    <section
      id="contact"
      ref={ref}
      className="py-14 md:py-24 relative overflow-hidden"
    >
      <div className="absolute top-0 left-0 w-72 h-72 md:w-96 md:h-96 rounded-full bg-turmeric/10 blur-3xl -z-10"></div>
      <div className="absolute bottom-0 right-0 w-40 h-40 md:w-64 md:h-64 rounded-full bg-maroon/5 blur-3xl -z-10"></div>
      <div className="absolute inset-0 bg-spice-pattern opacity-5 -z-10"></div>

      <div className="container mx-auto px-2 md:px-4">
        <motion.div
          className="text-center mb-10 md:mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.7 }}
        >
          <span className="text-maroon font-heritage text-lg">Get in Touch</span>
          <h2 className="text-3xl md:text-4xl font-heritage font-bold mt-2 mb-4">
            Quick Order Form
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Place your order easily with our simple form. We'll contact you shortly!
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 max-w-5xl mx-auto">
          <motion.div
            className="bg-white rounded-xl shadow-lg overflow-hidden indian-border order-2 md:order-1"
            initial={{ opacity: 0, x: -30 }}
            animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: -30 }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            <div className="p-3 md:p-8">
              <div className="mb-4">
                <div className="rounded bg-saffron/10 border border-saffron px-2 py-1 text-xs md:text-sm text-maroon font-medium">
                  <span>
                    This is a demo order form and does <b>not</b> place an actual order. Your details are only shared for follow-up; no payment will be charged now.
                  </span>
                </div>
              </div>
              <h3 className="text-xl font-heritage font-bold mb-6">
                Order Details
              </h3>
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
                  ></textarea>
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
                        <span>₹{cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)}</span>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="aam-aachar"
                          className="mr-2 h-4 w-4 text-maroon rounded focus:ring-maroon"
                        />
                        <label htmlFor="aam-aachar">
                          Aam Aachar (₹299/jar)
                        </label>
                      </div>
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="lassan-aachar"
                          className="mr-2 h-4 w-4 text-maroon rounded focus:ring-maroon"
                        />
                        <label htmlFor="lassan-aachar">
                          Lassan Aachar (₹249/jar)
                        </label>
                      </div>
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="hari-mirch-kuta"
                          className="mr-2 h-4 w-4 text-maroon rounded focus:ring-maroon"
                        />
                        <label htmlFor="hari-mirch-kuta">
                          Hari Mirch Kuta (₹229/jar)
                        </label>
                      </div>
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="rice-papad"
                          className="mr-2 h-4 w-4 text-maroon rounded focus:ring-maroon"
                        />
                        <label htmlFor="rice-papad">
                          Rice Papad (₹159/pack)
                        </label>
                      </div>
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="potato-chips"
                          className="mr-2 h-4 w-4 text-maroon rounded focus:ring-maroon"
                        />
                        <label htmlFor="potato-chips">
                          Potato Chips (₹149/pack)
                        </label>
                      </div>
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="wheat-kurodi"
                          className="mr-2 h-4 w-4 text-maroon rounded focus:ring-maroon"
                        />
                        <label htmlFor="wheat-kurodi">
                          Wheat Kurodi (₹179/pack)
                        </label>
                      </div>
                    </div>
                  )}
                </div>
                <motion.button
                  type="submit"
                  className="w-full bg-maroon hover:bg-maroon/90 text-white rounded-full py-4 font-medium text-lg"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  disabled={submitted}
                >
                  {submitted ? "Order Placed!" : "Place Order"}
                </motion.button>
                {submitted && (
                  <div className="mt-3 text-xs text-green-700 bg-green-100 border border-green-200 px-3 py-2 rounded-lg">
                    Your order was recorded in this browser only. We will contact you via the details provided. No payment has been processed online. <b>Orders are not recorded online or sent to the shop automatically!</b>
                  </div>
                )}
              </form>
            </div>
          </motion.div>

          <motion.div
            className="flex flex-col space-y-4 md:space-y-6 order-1 md:order-2"
            initial={{ opacity: 0, x: 30 }}
            animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: 30 }}
            transition={{ duration: 0.7, delay: 0.4 }}
          >
            <motion.div
              className="bg-white rounded-xl shadow-lg overflow-hidden p-4 md:p-8 h-fit"
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.7, delay: 0.6 }}
            >
              <h3 className="text-xl font-heritage font-bold mb-4">
                Payment Options
              </h3>
              <div className="rounded bg-maroon/10 text-maroon px-2 py-1 text-xs md:text-sm mb-4 border border-maroon/20">
                All payments are arranged after we contact you. You can use the preferred payment link or QR. No direct online payments are made through this form.
              </div>

              <div className="mb-4">
                <details className="rounded border border-maroon/40 bg-saffron/5 py-3 px-3 group" open>
                  <summary className="cursor-pointer font-medium flex items-center gap-2 text-maroon">
                    <span>
                      <svg xmlns="http://www.w3.org/2000/svg" className="inline-block" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><rect width="16" height="16" x="4" y="4" rx="2"/><path d="M6 8h.01"/><path d="M6 16h.01"/><path d="M16 8h.01"/><path d="M8 18v.01"/><path d="M8 6v.01"/><path d="M18 8v.01"/><path d="M8 16v.01"/><path d="M16 16v.01"/><path d="M18 16v.01"/></svg>
                    </span>
                    Pay via UPI / Payment Link / QR
                  </summary>
                  <div className="mt-2 space-y-2 text-sm text-maroon">
                    <div>
                      <span className="font-semibold">UPI ID:</span>{" "}
                      <span className="bg-white rounded px-2 py-1 border border-saffron/30 select-all">durgagurhudyog@oksbi</span>
                    </div>
                    <div>
                      <a
                        className="bg-saffron/90 hover:bg-maroon/90 hover:text-white transition rounded px-3 py-1 text-maroon font-medium"
                        href="upi://pay?pa=durgagurhudyog@oksbi&pn=Durga Gurhudyog&cu=INR"
                        target="_blank"
                        rel="noopener"
                      >
                        Pay Now via UPI link
                      </a>
                    </div>
                    <div className="flex items-center gap-4">
                      <div>
                        <span className="font-semibold">Scan UPI QR:</span>
                        <div className="mt-1 border border-saffron/30 rounded p-2 bg-white shadow">
                          <img
                            src="https://chart.googleapis.com/chart?cht=qr&chs=180x180&chl=upi://pay?pa=durgagurhudyog@oksbi&pn=Durga Gurhudyog&cu=INR"
                            alt="Scan to pay UPI QR"
                            className="w-32 h-32 object-contain"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="mt-2 text-xs text-muted-foreground">
                      After completing your payment, keep your transaction ID. It will be confirmed by phone or WhatsApp.
                    </div>
                  </div>
                </details>
              </div>

              <div className="flex items-center gap-4">
                <div className="bg-muted rounded-lg p-2 md:p-3 flex-shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect width="20" height="14" x="2" y="5" rx="2" />
                    <line x1="2" x2="22" y1="10" y2="10" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-medium">Credit/Debit Cards</h4>
                  <p className="text-xs md:text-sm text-muted-foreground">
                    Card payment link will be shared on WhatsApp or email after order confirmation.
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4 mt-4">
                <div className="bg-muted rounded-lg p-2 md:p-3 flex-shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
                    <path d="M3 6h18" />
                    <path d="M16 10a4 4 0 0 1-8 0" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-medium">Cash on Delivery</h4>
                  <p className="text-xs md:text-sm text-muted-foreground">
                    Available for local deliveries. Confirm with our team after placing the order.
                  </p>
                </div>
              </div>
            </motion.div>
            <motion.div
              className="bg-white rounded-xl shadow-lg overflow-hidden p-4 md:p-8 h-fit"
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.7, delay: 0.8 }}
            >
              <h3 className="text-xl font-heritage font-bold mb-4">
                Connect With Us
              </h3>
              <div className="space-y-3 md:space-y-4">
                <div className="flex items-center gap-3 md:gap-4">
                  <div className="bg-muted rounded-lg p-2 md:p-3">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-medium">Phone</h4>
                    <p className="text-saffron text-xs md:text-sm">+91 8830257574</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 md:gap-4">
                  <div className="bg-muted rounded-lg p-2 md:p-3">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                      <polyline points="22,6 12,13 2,6" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-medium">Email</h4>
                    <p className="text-saffron text-xs md:text-sm">durgagurhudyoggondia@gmail.com</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 md:gap-4">
                  <div className="bg-muted rounded-lg p-2 md:p-3">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                      <polyline points="9 22 9 12 15 12 15 22" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-medium">Address</h4>
                    <p className="text-xs md:text-sm text-muted-foreground">
                      Gokuldham Colony, Near Gaurav Furniture, Fulture Peth, Gondia (441601)
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 md:gap-4">
                  <div className="bg-muted rounded-lg p-2 md:p-3">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <rect width="20" height="16" x="2" y="4" rx="2" />
                      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-medium">Newsletter</h4>
                    <p className="text-xs md:text-sm text-muted-foreground">
                      Subscribe for new product updates and offers
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
