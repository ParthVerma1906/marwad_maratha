
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Phone, MessageCircle, Mail, Clock, MapPin, HandHeart, ShieldCheck, Truck, Leaf } from "lucide-react";

const BUSINESS_PHONE = "8830257574";
const BUSINESS_EMAIL = "durgagurhudyoggondia@gmail.com";

const trustItems = [
  { icon: HandHeart, text: "Handmade in Small Batches" },
  { icon: Leaf, text: "No Preservatives" },
  { icon: ShieldCheck, text: "Secure UPI Payment" },
  { icon: Truck, text: "Ships Within 2 Days" },
];

const quickLinks = ["Home", "Products", "About", "Contact", "Cart"];
const policyLinks = ["Shipping Policy", "Privacy Policy", "Terms & Conditions"];

const TrustStrip = () => {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.2 });
  return (
    <section ref={ref} className="py-[60px] bg-[hsl(30,25%,90%)]">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 max-w-4xl mx-auto">
          {trustItems.map(({ icon: Icon, text }, i) => (
            <motion.div
              key={text}
              className="flex flex-col items-center text-center gap-3"
              initial={{ opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.4, delay: i * 0.1 }}
            >
              <Icon size={24} strokeWidth={1.5} className="text-[hsl(350,75%,35%)]" />
              <span className="text-sm font-medium text-[hsl(20,10%,25%)]">{text}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Footer = () => {
  return (
    <>
      <TrustStrip />
      <footer className="bg-[hsl(15,30%,14%)] text-[hsl(40,30%,88%)] pt-20 pb-10">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12 mb-14">
            {/* Column 1 — Brand */}
            <div>
              <div className="flex items-center gap-2.5 mb-5">
                <img
                  src="/lovable-uploads/010cf85d-1380-42f9-9e85-bbad9333219c.png"
                  alt="Marwad Maratha Logo"
                  className="h-10 w-10 rounded-full object-cover"
                />
                <span className="font-heritage text-lg font-bold text-[hsl(40,30%,92%)]">
                  Marwad Maratha
                </span>
              </div>
              <p className="text-sm leading-relaxed mb-4 text-[hsl(40,20%,70%)]">
                Traditional homemade pickles and papad,
                <br />
                prepared in small batches using family recipes.
              </p>
              <div className="flex items-center gap-2 text-sm text-[hsl(40,20%,65%)]">
                <MapPin size={14} strokeWidth={1.5} />
                <span>Gondia, Maharashtra</span>
              </div>
            </div>

            {/* Column 2 — Quick Links */}
            <div>
              <h4 className="font-heritage font-bold text-base mb-5 text-[hsl(40,30%,92%)]">Quick Links</h4>
              <ul className="space-y-3">
                {quickLinks.map((item) => (
                  <li key={item}>
                    <a
                      href={item === "Home" ? "/" : item === "Cart" ? "/checkout" : `#${item.toLowerCase()}`}
                      className="text-sm text-[hsl(40,20%,70%)] hover:text-[hsl(40,30%,90%)] hover:underline underline-offset-4 transition-colors"
                    >
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 3 — Customer Support */}
            <div>
              <h4 className="font-heritage font-bold text-base mb-5 text-[hsl(40,30%,92%)]">Customer Support</h4>
              <ul className="space-y-4">
                <li className="flex items-center gap-2.5">
                  <Phone size={16} strokeWidth={1.5} className="text-[hsl(40,20%,65%)]" />
                  <a href={`tel:+91${BUSINESS_PHONE}`} className="text-sm text-[hsl(40,20%,70%)] hover:text-[hsl(40,30%,90%)] transition-colors">
                    +91 88302 57574
                  </a>
                </li>
                <li className="flex items-center gap-2.5">
                  <MessageCircle size={16} strokeWidth={1.5} className="text-[hsl(145,63%,42%)]" />
                  <a href={`https://wa.me/91${BUSINESS_PHONE}`} target="_blank" rel="noopener" className="text-sm text-[hsl(40,20%,70%)] hover:text-[hsl(40,30%,90%)] transition-colors">
                    WhatsApp
                  </a>
                </li>
                <li className="flex items-center gap-2.5">
                  <Mail size={16} strokeWidth={1.5} className="text-[hsl(40,20%,65%)]" />
                  <a href={`mailto:${BUSINESS_EMAIL}`} className="text-sm text-[hsl(40,20%,70%)] hover:text-[hsl(40,30%,90%)] transition-colors break-all">
                    {BUSINESS_EMAIL}
                  </a>
                </li>
                <li className="flex items-center gap-2.5">
                  <Clock size={16} strokeWidth={1.5} className="text-[hsl(40,20%,65%)]" />
                  <span className="text-sm text-[hsl(40,20%,70%)]">10 AM – 7 PM</span>
                </li>
              </ul>
              <p className="text-xs text-[hsl(40,15%,55%)] mt-4 leading-relaxed">
                We usually respond within 30 minutes during working hours.
              </p>
            </div>

            {/* Column 4 — Policies */}
            <div>
              <h4 className="font-heritage font-bold text-base mb-5 text-[hsl(40,30%,92%)]">Policies</h4>
              <ul className="space-y-3">
                {policyLinks.map((item) => (
                  <li key={item}>
                    <a href="#" className="text-sm text-[hsl(40,20%,70%)] hover:text-[hsl(40,30%,90%)] hover:underline underline-offset-4 transition-colors">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Divider */}
          <div className="h-px bg-[hsl(40,15%,25%)] mb-6" />

          {/* Bottom bar */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-3 text-xs text-[hsl(40,15%,50%)]">
            <p>&copy; {new Date().getFullYear()} Marwad Maratha. All rights reserved.</p>
            <p>Made with care in India.</p>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
