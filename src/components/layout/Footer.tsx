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
    <section ref={ref} className="py-8 md:py-12 lg:py-[60px] bg-[hsl(30,25%,90%)]">
      <div className="w-full px-4 md:px-8 max-w-5xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
          {trustItems.map(({ icon: Icon, text }, i) => (
            <motion.div
              key={text}
              className="flex flex-col items-center text-center gap-2 md:gap-3"
              initial={{ opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.4, delay: i * 0.1 }}
            >
              <Icon size={22} strokeWidth={1.5} className="text-[hsl(350,75%,35%)]" />
              <span className="text-xs md:text-sm font-medium text-[hsl(20,10%,25%)]">{text}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Footer = () => (
  <>
    <TrustStrip />
    <footer className="bg-[hsl(15,30%,14%)] text-[hsl(40,30%,88%)] pt-10 md:pt-16 lg:pt-20 pb-8 md:pb-10">
      <div className="w-full px-4 md:px-8 lg:px-12 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 mb-10 md:mb-14">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2.5 mb-4 md:mb-5">
              <div className="h-9 w-9 md:h-10 md:w-10 rounded-full bg-[hsl(15,80%,50%)] flex items-center justify-center">
                <span className="text-white font-heritage text-lg md:text-xl font-bold">M</span>
              </div>
              <span className="font-heritage text-base md:text-lg font-bold text-[hsl(40,30%,92%)]">
                Marwad Maratha
              </span>
            </div>
            <p className="text-xs md:text-sm leading-relaxed mb-3 md:mb-4 text-[hsl(40,20%,70%)]">
              Traditional homemade pickles and papad, prepared in small batches using family recipes.
            </p>
            <div className="flex items-center gap-2 text-xs md:text-sm text-[hsl(40,20%,65%)]">
              <MapPin size={14} strokeWidth={1.5} />
              <span>Gondia, Maharashtra</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-heritage font-bold text-sm md:text-base mb-4 md:mb-5 text-[hsl(40,30%,92%)]">Quick Links</h4>
            <ul className="space-y-2 md:space-y-3">
              {quickLinks.map((item) => (
                <li key={item}>
                  <a
                    href={item === "Home" ? "/" : item === "Cart" ? "/checkout" : `#${item.toLowerCase()}`}
                    className="text-xs md:text-sm text-[hsl(40,20%,70%)] hover:text-[hsl(40,30%,90%)] hover:underline underline-offset-4 transition-colors min-h-[44px] inline-flex items-center"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Support */}
          <div>
            <h4 className="font-heritage font-bold text-sm md:text-base mb-4 md:mb-5 text-[hsl(40,30%,92%)]">Customer Support</h4>
            <ul className="space-y-3 md:space-y-4">
              <li className="flex items-center gap-2.5">
                <Phone size={15} strokeWidth={1.5} className="text-[hsl(40,20%,65%)] flex-shrink-0" />
                <a href={`tel:+91${BUSINESS_PHONE}`} className="text-xs md:text-sm text-[hsl(40,20%,70%)] hover:text-[hsl(40,30%,90%)] transition-colors">
                  +91 88302 57574
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <MessageCircle size={15} strokeWidth={1.5} className="text-[hsl(145,63%,42%)] flex-shrink-0" />
                <a href={`https://wa.me/91${BUSINESS_PHONE}`} target="_blank" rel="noopener" className="text-xs md:text-sm text-[hsl(40,20%,70%)] hover:text-[hsl(40,30%,90%)] transition-colors">
                  WhatsApp
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail size={15} strokeWidth={1.5} className="text-[hsl(40,20%,65%)] flex-shrink-0" />
                <a href={`mailto:${BUSINESS_EMAIL}`} className="text-xs md:text-sm text-[hsl(40,20%,70%)] hover:text-[hsl(40,30%,90%)] transition-colors break-all">
                  {BUSINESS_EMAIL}
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Clock size={15} strokeWidth={1.5} className="text-[hsl(40,20%,65%)] flex-shrink-0" />
                <span className="text-xs md:text-sm text-[hsl(40,20%,70%)]">10 AM – 7 PM</span>
              </li>
            </ul>
            <p className="text-[10px] md:text-xs text-[hsl(40,15%,55%)] mt-3 md:mt-4 leading-relaxed">
              We usually respond within 30 minutes during working hours.
            </p>
          </div>

          {/* Policies */}
          <div>
            <h4 className="font-heritage font-bold text-sm md:text-base mb-4 md:mb-5 text-[hsl(40,30%,92%)]">Policies</h4>
            <ul className="space-y-2 md:space-y-3">
              {policyLinks.map((item) => (
                <li key={item}>
                  <a href="#" className="text-xs md:text-sm text-[hsl(40,20%,70%)] hover:text-[hsl(40,30%,90%)] hover:underline underline-offset-4 transition-colors min-h-[44px] inline-flex items-center">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="h-px bg-[hsl(40,15%,25%)] mb-4 md:mb-6" />
        <div className="flex flex-col md:flex-row justify-between items-center gap-2 md:gap-3 text-[10px] md:text-xs text-[hsl(40,15%,50%)]">
          <p>&copy; {new Date().getFullYear()} Marwad Maratha. All rights reserved.</p>
          <p>Made with care in India.</p>
        </div>
      </div>
    </footer>
  </>
);

export default Footer;
