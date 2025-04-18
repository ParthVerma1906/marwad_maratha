
import { motion } from "framer-motion";

const Footer = () => {
  return (
    <footer className="bg-gradient-to-b from-spiceYellow/30 to-maroon/10 pt-12 pb-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-fabric-texture opacity-5"></div>
      
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          <div>
            <div className="flex items-center gap-2 mb-6">
              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-saffron to-maroon flex items-center justify-center">
                <span className="text-white font-heritage text-xl font-bold">M</span>
              </div>
              <span className="font-heritage text-xl font-bold">
                <span className="text-maroon">Marwad</span>{" "}
                <span className="text-saffron">Maratha</span>
              </span>
            </div>
            <p className="text-muted-foreground mb-4">
              Traditional Indian pickles and papads, handcrafted with love and family recipes since 2017.
            </p>
            <div className="flex gap-4">
              {/* Social media icons */}
              {["facebook", "instagram", "youtube", "twitter"].map((social) => (
                <motion.a
                  key={social}
                  href="#"
                  className="w-9 h-9 bg-white rounded-full flex items-center justify-center hover:bg-maroon hover:text-white transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span className="sr-only">{social}</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                  </svg>
                </motion.a>
              ))}
            </div>
          </div>
          
          <div>
            <h3 className="font-heritage font-bold text-lg mb-4">Product Categories</h3>
            <ul className="space-y-3">
              {["Aachar (Pickles)", "Papad", "Dehydrated Powder", "Millets", "Namkeen", "Special Items"].map((item) => (
                <li key={item}>
                  <a href="#" className="text-muted-foreground hover:text-saffron transition-colors">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h3 className="font-heritage font-bold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-3">
              {["Home", "About Us", "Products", "Testimonials", "Contact", "FAQs", "Shipping Policy"].map((item) => (
                <li key={item}>
                  <a href="#" className="text-muted-foreground hover:text-saffron transition-colors">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h3 className="font-heritage font-bold text-lg mb-4">Newsletter</h3>
            <p className="text-muted-foreground mb-4">
              Subscribe to receive updates about new products and special offers.
            </p>
            <form className="flex">
              <input 
                type="email" 
                placeholder="Your email address" 
                className="px-4 py-2 rounded-l-full border-y border-l border-muted focus:outline-none focus:border-maroon flex-1"
              />
              <motion.button 
                type="submit"
                className="bg-maroon text-white px-4 py-2 rounded-r-full"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M5 12h14"></path>
                  <path d="m12 5 7 7-7 7"></path>
                </svg>
              </motion.button>
            </form>
          </div>
        </div>
        
        <div className="border-t border-muted pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-muted-foreground mb-4 md:mb-0">
            &copy; {new Date().getFullYear()} Marwad Maratha. All rights reserved.
          </p>
          <div className="flex gap-6">
            <a href="#" className="text-sm text-muted-foreground hover:text-saffron">
              Privacy Policy
            </a>
            <a href="#" className="text-sm text-muted-foreground hover:text-saffron">
              Terms of Service
            </a>
            <a href="#" className="text-sm text-muted-foreground hover:text-saffron">
              Cookie Policy
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
