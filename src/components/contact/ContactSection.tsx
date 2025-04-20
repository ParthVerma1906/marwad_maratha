import { useState } from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { useCart } from "@/hooks/useCart";
import { useToast } from "@/components/ui/use-toast";

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // In a real app, this would submit to a backend
    console.log("Order submitted:", {
      customer: formData,
      items: cartItems
    });
    
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
      className="py-16 md:py-24 relative overflow-hidden"
    >
      <div className="absolute top-0 left-0 w-96 h-96 rounded-full bg-turmeric/10 blur-3xl -z-10"></div>
      <div className="absolute bottom-0 right-0 w-64 h-64 rounded-full bg-maroon/5 blur-3xl -z-10"></div>
      <div className="absolute inset-0 bg-spice-pattern opacity-5 -z-10"></div>

      <div className="container mx-auto px-4">
        <motion.div
          className="text-center mb-12"
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

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          <motion.div
            className="bg-white rounded-xl shadow-lg overflow-hidden indian-border order-2 md:order-1"
            initial={{ opacity: 0, x: -30 }}
            animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: -30 }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            <div className="p-4 md:p-8">
              <h3 className="text-xl font-heritage font-bold mb-6">
                Order Details
              </h3>
              <form className="space-y-4" onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
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
                    Products
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
              </form>
            </div>
          </motion.div>

          <motion.div
            className="flex flex-col space-y-6 order-1 md:order-2"
            initial={{ opacity: 0, x: 30 }}
            animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: 30 }}
            transition={{ duration: 0.7, delay: 0.4 }}
          >
            <div className="bg-white rounded-xl shadow-lg overflow-hidden p-6 md:p-8 h-fit">
              <h3 className="text-xl font-heritage font-bold mb-4">
                Payment Options
              </h3>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="bg-muted rounded-lg p-3">
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
                      <rect width="20" height="14" x="2" y="5" rx="2" />
                      <line x1="2" x2="22" y1="10" y2="10" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-medium">Credit/Debit Cards</h4>
                    <p className="text-sm text-muted-foreground">
                      Secure payment via all major cards
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="bg-muted rounded-lg p-3">
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
                      <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
                      <path d="M3 6h18" />
                      <path d="M16 10a4 4 0 0 1-8 0" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-medium">Cash on Delivery</h4>
                    <p className="text-sm text-muted-foreground">
                      Pay when your order arrives
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="bg-muted rounded-lg p-3">
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
                      <circle cx="18" cy="6" r="3" />
                      <circle cx="6" cy="18" r="3" />
                      <path d="M18 9v12" />
                      <path d="M6 15V3" />
                      <path d="M9 6H3" />
                      <path d="M21 18h-6" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-medium">UPI</h4>
                    <p className="text-sm text-muted-foreground">
                      Pay via Google Pay, PhonePe, or Paytm
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg overflow-hidden p-6 md:p-8 h-fit">
              <h3 className="text-xl font-heritage font-bold mb-4">
                Connect With Us
              </h3>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="bg-muted rounded-lg p-3">
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
                    <p className="text-saffron">+91 8830257574</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="bg-muted rounded-lg p-3">
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
                    <p className="text-saffron">durgagurhudyoggondia@gmail.com</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="bg-muted rounded-lg p-3">
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
                    <p className="text-sm text-muted-foreground">
                      Gokuldham Colony, Near Gaurav Furniture, Fulture Peth, Gondia (441601)
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="bg-muted rounded-lg p-3">
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
                    <p className="text-sm text-muted-foreground">
                      Subscribe for new product updates and offers
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
