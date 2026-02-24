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
    const msg = encodeURIComponent(`Hi, I'm ${form.name}.\nPhone: ${form.phone}\n\n${form.message}`);
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
    <section id="contact" ref={ref} className="relative overflow-hidden py-10 md:py-14 lg:py-[70px]" style={{ background: "#FCF7F1" }}>
      <div className="w-full px-4 md:px-8 lg:px-12 max-w-7xl mx-auto">
        <motion.div
          className="text-center mb-8 md:mb-10"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
        >
          <span className="text-accent font-heritage text-base md:text-lg">Reach Out</span>
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-heritage font-bold mt-1 mb-2 md:mb-3" style={{ color: "#5A0A0A" }}>
            Get in Touch
          </h2>
          <p className="text-muted-foreground max-w-lg mx-auto text-xs md:text-sm">
            We'd love to hear from you. Reach out for orders, questions, or just to say hello!
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 md:gap-8 max-w-4xl mx-auto">
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
            transition={{ duration: 0.6, delay: 0.15 }}
          >
            <div className="bg-white rounded-2xl p-5 md:p-6 lg:p-8 h-full" style={{ boxShadow: "0 2px 12px rgba(90,10,10,0.06)" }}>
              <h3 className="font-heritage text-lg md:text-xl font-bold mb-4 md:mb-5" style={{ color: "#5A0A0A" }}>
                Contact Information
              </h3>
              <div className="space-y-4 md:space-y-5">
                {contactInfo.map(({ icon: Icon, label, value, href }) => (
                  <div key={label} className="flex items-start gap-3">
                    <div className="w-8 h-8 md:w-9 md:h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: "#FBF2E9" }}>
                      <Icon size={16} className="text-accent" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[10px] md:text-xs text-muted-foreground font-medium uppercase tracking-wide">{label}</p>
                      {href ? (
                        <a href={href} target={href.startsWith("http") ? "_blank" : undefined} rel="noopener"
                          className="text-xs md:text-sm font-medium hover:text-accent transition-colors break-all">
                          {value}
                        </a>
                      ) : (
                        <p className="text-xs md:text-sm break-words">{value}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-[10px] md:text-xs text-muted-foreground mt-4 md:mt-6">
                We usually respond within 30 minutes during working hours.
              </p>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: 20 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <div className="bg-white rounded-2xl p-5 md:p-6 lg:p-8 h-full" style={{ boxShadow: "0 2px 12px rgba(90,10,10,0.06)" }}>
              <h3 className="font-heritage text-lg md:text-xl font-bold mb-4 md:mb-5" style={{ color: "#5A0A0A" }}>
                Send a Message
              </h3>
              <form onSubmit={handleSubmit} className="space-y-3 md:space-y-4">
                <div>
                  <label className="block text-xs md:text-sm font-medium mb-1 md:mb-1.5">Name</label>
                  <input type="text" name="name" value={form.name} onChange={handleChange} required
                    className="w-full px-3 md:px-4 py-2.5 md:py-3 rounded-xl border border-input bg-background focus:outline-none focus:ring-2 focus:ring-accent/30 text-sm"
                    placeholder="Your name" />
                </div>
                <div>
                  <label className="block text-xs md:text-sm font-medium mb-1 md:mb-1.5">Phone</label>
                  <input type="tel" name="phone" value={form.phone} onChange={handleChange} required
                    className="w-full px-3 md:px-4 py-2.5 md:py-3 rounded-xl border border-input bg-background focus:outline-none focus:ring-2 focus:ring-accent/30 text-sm"
                    placeholder="Your phone number" />
                </div>
                <div>
                  <label className="block text-xs md:text-sm font-medium mb-1 md:mb-1.5">Message</label>
                  <textarea name="message" value={form.message} onChange={handleChange} required rows={3}
                    className="w-full px-3 md:px-4 py-2.5 md:py-3 rounded-xl border border-input bg-background focus:outline-none focus:ring-2 focus:ring-accent/30 text-sm resize-none"
                    placeholder="How can we help you?" />
                </div>
                <button type="submit" disabled={sending}
                  className="w-full py-3 md:py-3.5 rounded-xl font-semibold text-white transition-all text-sm md:text-base"
                  style={{ background: "#850E35", minHeight: "48px" }}>
                  {sending ? "Sending..." : "Send Message"}
                </button>
              </form>
              <p className="text-[10px] md:text-xs text-muted-foreground mt-3 md:mt-4 text-center">
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
