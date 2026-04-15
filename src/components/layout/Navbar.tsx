import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import ShoppingCart from "../cart/ShoppingCart";
import MobileMenu from "./MobileMenu";
import { useCart } from "@/hooks/useCart";
import { productImages } from "@/utils/imageAssets";
import { useLocation, useNavigate } from "react-router-dom";

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [showCart, setShowCart] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const { cartItemsCount } = useCart();
  const location = useLocation();
  const navigate = useNavigate();
  
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > window.innerHeight * 0.8);
      
      const sections = ['home', 'products', 'story', 'contact'];
      const scrollPosition = window.scrollY + 100;
      
      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) element.scrollIntoView({ behavior: 'smooth' });
  };

  const toggleCart = () => setShowCart(prev => !prev);

  return (
    <>
      <motion.header
        className={`fixed top-0 left-0 right-0 w-full transition-all duration-500 ${
          scrolled ? "bg-black/60 backdrop-blur-sm" : "bg-transparent"
        }`}
        style={{ zIndex: 1000 }}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="w-full max-[480px]:h-[58px] h-[60px] md:h-[70px] px-4 md:px-6 lg:px-10 flex items-center justify-between">
          {/* Logo */}
          <motion.a
            href="/"
            className="flex flex-col items-start flex-shrink-0"
            whileHover={{ scale: 1.02 }}
          >
            <img 
              src={productImages.logo}
              alt="Marwad Maratha Logo - Homemade Aachar Papad Brand Gondia Maharashtra"
              className="max-[480px]:w-[56px] w-[70px] md:w-[90px] h-auto"
              style={{ filter: 'drop-shadow(2px 2px 4px rgba(0,0,0,0.5))' }}
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.onerror = null;
                target.src = '/placeholder.svg';
              }}
            />
            <div className="text-center w-full">
              <div 
                className="font-bold max-[480px]:text-[9px] text-[10px] md:text-[13px] leading-tight text-white"
                style={{ 
                  fontFamily: 'Playfair Display, serif',
                  textShadow: '2px 2px 4px rgba(0,0,0,0.8)',
                  letterSpacing: '0.5px'
                }}
              >
                Marwad Maratha
              </div>
            </div>
          </motion.a>

          {/* Desktop Navigation - centered */}
          <nav className="hidden md:flex items-center gap-5">
            {[
              { name: "Home", id: "home" },
              { name: "Products", id: "products" },
              { name: "About", id: "story" },
              { name: "Contact", id: "contact" }
            ].map((item) => (
              <motion.a
                key={item.name}
                onClick={() => scrollToSection(item.id)}
                className={`font-medium relative group cursor-pointer transition-all text-[15px] ${
                  activeSection === item.id 
                    ? 'text-white font-semibold'
                    : 'text-white hover:text-gray-200'
                }`}
                style={{ textShadow: '2px 2px 4px rgba(0, 0, 0, 0.8)' }}
                whileHover={{ scale: 1.05, color: '#FFD700' }}
              >
                {item.name}
                <span className={`absolute bottom-0 left-0 h-0.5 transition-all duration-300 ${
                  activeSection === item.id 
                    ? 'w-full bg-yellow-400' 
                    : 'w-0 group-hover:w-full group-hover:bg-yellow-400'
                }`} />
              </motion.a>
            ))}
          </nav>

          {/* Right side actions */}
          <div className="flex items-center gap-2 md:gap-3">
            {/* Cart */}
            <motion.button
              onClick={toggleCart}
              className="p-2 rounded-full relative text-white min-h-[44px] min-w-[44px] flex items-center justify-center"
              style={{ filter: 'drop-shadow(2px 2px 4px rgba(0,0,0,0.8))' }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="8" cy="21" r="1" />
                <circle cx="19" cy="21" r="1" />
                <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
              </svg>
              {cartItemsCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-maroon text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center font-bold">
                  {cartItemsCount}
                </span>
              )}
            </motion.button>

            {/* Order Now - desktop only */}
            <motion.button
              onClick={() => navigate('/checkout')}
              className="hidden md:flex bg-primary hover:bg-primary/90 text-primary-foreground rounded-full items-center gap-1 font-bold shadow-lg text-sm py-2 px-5"
              style={{ minHeight: '40px' }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
            >
              <span>Order Now</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 12h12m-6-6 6 6-6 6" />
              </svg>
            </motion.button>

            {/* Admin - desktop only */}
            <motion.button
              onClick={() => navigate("/admin")}
              className="hidden md:flex p-2 rounded-full text-white min-h-[44px] min-w-[44px] items-center justify-center"
              style={{ filter: 'drop-shadow(2px 2px 4px rgba(0,0,0,0.8))' }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 21a7 7 0 0 0-14 0" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </motion.button>

            {/* Mobile Menu (includes Order Now inside) */}
            <MobileMenu activeSection={activeSection} scrollToSection={scrollToSection} />
          </div>
        </div>
      </motion.header>

      {showCart && <ShoppingCart onClose={toggleCart} />}
    </>
  );
};

export default Navbar;
