import { useState } from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Phone, MessageCircle, Mail, MapPin, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const BUSINESS_PHONE = "8830257574";
const BUSINESS_EMAIL = "durgagurhudyoggondia@gmail.com";

const ContactSection = () => {
  const { ref, inView } = useInView({ triggerOnce: false, threshold: 0.1 });
  const { toast } = useToast();
  const [form, setForm] = useState({ name: "", phone: "", message: "" });
  const [sending, setSending] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    // Build WhatsApp message as fallback
    const msg = encodeURIComponent(
      `Hi, I'm ${form.name}.\nPhone: ${form.phone}\n\n${form.message}`
    );
    window.open(`https://wa.me/91${BUSINESS_PHONE}?text=${msg}`, "_blank", "noopener");
    toast({ title: "Message prepared!", description: "Opening WhatsApp to send your message." });
    setSending(false);
    setForm({ name: "", phone: "", message: "" });
  };

  const contactInfo = [
    { icon: Phone, label: "Phone", value: "+91 88302 57574", href: `tel:+91${BUSINESS_PHONE}` },
    { icon: MessageCircle, label: "WhatsApp", value: "+91 88302 57574", href: `https://wa.me/91${BUSINESS_PHONE}` },
    { icon: Mail, label: "Email", value: BUSINESS_EMAIL, href: `mailto:${BUSINESS_EMAIL}` },
    { icon: MapPin, label: "Address", value: "Gokuldham Colony, Near Gaurav Furniture, Fulture Peth, Gondia (441601), Maharashtra" },
    { icon: Clock, label: "Business Hours", value: "Mon–Sat: 9:00 AM – 7:00 PM" },
  ];

  return (
    <section id="contact" ref={ref} className="relative overflow-hidden" style={{ padding: "70px 0", background: "#FCF7F1" }}>
      <div className="container mx-auto px-4">
        <motion.div
          className="text-center mb-10"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
        >
          <span className="text-accent font-heritage text-lg">Reach Out</span>
          <h2 className="text-3xl md:text-4xl font-heritage font-bold mt-1 mb-3" style={{ color: "#5A0A0A" }}>
            Get in Touch
          </h2>
          <p className="text-muted-foreground max-w-lg mx-auto text-sm">
            We'd love to hear from you. Reach out for orders, questions, or just to say hello!
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Left: Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
            transition={{ duration: 0.6, delay: 0.15 }}
          >
            <div className="bg-white rounded-2xl p-6 md:p-8 h-full" style={{ boxShadow: "0 2px 12px rgba(90,10,10,0.06)" }}>
              <h3 className="font-heritage text-xl font-bold mb-5" style={{ color: "#5A0A0A" }}>
                Contact Information
              </h3>
              <div className="space-y-5">
                {contactInfo.map(({ icon: Icon, label, value, href }) => (
                  <div key={label} className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: "#FBF2E9" }}>
                      <Icon size={18} className="text-accent" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">{label}</p>
                      {href ? (
                        <a href={href} target={href.startsWith("http") ? "_blank" : undefined} rel="noopener"
                          className="text-sm font-medium hover:text-accent transition-colors">
                          {value}
                        </a>
                      ) : (
                        <p className="text-sm">{value}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-xs text-muted-foreground mt-6">
                We usually respond within 30 minutes during working hours.
              </p>
            </div>
          </motion.div>

          {/* Right: Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: 20 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <div className="bg-white rounded-2xl p-6 md:p-8 h-full" style={{ boxShadow: "0 2px 12px rgba(90,10,10,0.06)" }}>
              <h3 className="font-heritage text-xl font-bold mb-5" style={{ color: "#5A0A0A" }}>
                Send a Message
              </h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1.5">Name</label>
                  <input type="text" name="name" value={form.name} onChange={handleChange} required
                    className="w-full px-4 py-3 rounded-xl border border-input bg-background focus:outline-none focus:ring-2 focus:ring-accent/30 text-sm"
                    placeholder="Your name" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5">Phone</label>
                  <input type="tel" name="phone" value={form.phone} onChange={handleChange} required
                    className="w-full px-4 py-3 rounded-xl border border-input bg-background focus:outline-none focus:ring-2 focus:ring-accent/30 text-sm"
                    placeholder="Your phone number" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5">Message</label>
                  <textarea name="message" value={form.message} onChange={handleChange} required rows={4}
                    className="w-full px-4 py-3 rounded-xl border border-input bg-background focus:outline-none focus:ring-2 focus:ring-accent/30 text-sm resize-none"
                    placeholder="How can we help you?" />
                </div>
                <button type="submit" disabled={sending}
                  className="w-full py-3.5 rounded-xl font-semibold text-white transition-all"
                  style={{ background: "#850E35", minHeight: "48px" }}>
                  {sending ? "Sending..." : "Send Message"}
                </button>
              </form>
              <p className="text-xs text-muted-foreground mt-4 text-center">
                Prefer instant response?{" "}
                <a href={`https://wa.me/91${BUSINESS_PHONE}`} target="_blank" rel="noopener"
                  className="font-medium" style={{ color: "#25D366" }}>
                  Chat with us on WhatsApp.
                </a>
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
