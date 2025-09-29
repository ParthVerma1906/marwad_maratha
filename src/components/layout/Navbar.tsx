
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import AdminLogin from "../admin/AdminLogin";
import AdminPanel from "../admin/AdminPanel";
import ShoppingCart from "../cart/ShoppingCart";
import MobileMenu from "./MobileMenu";
import { useCart } from "@/hooks/useCart";
import { productImages } from "@/utils/imageAssets";
import { useLocation } from "react-router-dom";

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [showCart, setShowCart] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const { cartItemsCount } = useCart();
  const location = useLocation();
  
  const isHomePage = location.pathname === '/';
  
  useEffect(() => {
    const handleScroll = () => {
      // Check if scrolled past hero section (roughly 80vh)
      const heroHeight = window.innerHeight * 0.8;
      setScrolled(window.scrollY > heroHeight);
      
      // Determine active section based on scroll position
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

    // Check if admin is already logged in from previous session
    const adminLoggedIn = localStorage.getItem("adminLoggedIn") === "true";
    if (adminLoggedIn) {
      setShowAdminPanel(true);
    }

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleAdminLogin = () => {
    setShowAdminLogin(true);
  };

  const handleLoginSuccess = () => {
    setShowAdminLogin(false);
    setShowAdminPanel(true);
  };

  const handleCloseAdminPanel = () => {
    setShowAdminPanel(false);
    localStorage.setItem("adminLoggedIn", "false");
  };

  const toggleCart = () => {
    setShowCart(prev => !prev);
  };

  // Determine if header should be transparent (homepage only)
  const isTransparent = isHomePage && !scrolled;
  
  // Determine header height based on section - reduced height when not on hero
  const isCompactHeader = activeSection !== 'home' || scrolled;
  
  // Always use white text for transparent design
  const textColorClass = 'text-white';
  const hoverTextColorClass = 'hover:text-gray-200';

  return (
    <>
      <motion.header
        className={`fixed top-0 left-0 right-0 w-full transition-all duration-500 ease-in-out ${
          scrolled ? "bg-black/60 backdrop-blur-sm" : "bg-transparent"
        }`}
        style={{ 
          position: 'fixed',
          zIndex: 1000,
          padding: isCompactHeader ? '4px 40px' : '8px 40px',
          transition: 'all 0.5s ease-in-out'
        }}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="container mx-auto flex items-center justify-between">
          {/* Logo Section */}
          <motion.a
            href="/"
            className="flex flex-col items-start"
            style={{ 
              marginLeft: '20px',
              marginTop: isCompactHeader ? '2px' : '6px', // Even less margin when compact
              zIndex: 10,
              maxWidth: isCompactHeader ? '100px' : '110px', // Smaller logo when compact
              flexShrink: 0,
              transition: 'all 0.3s ease-in-out'
            }}
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            <img 
              src={productImages.logo}
              alt="Marwad Maratha Logo"
              style={{ 
                maxWidth: '100%',
                height: 'auto',
                filter: 'drop-shadow(0.5px 0.5px 1px rgba(0,0,0,0.1))',
                background: 'transparent',
                padding: '0',
                margin: '0'
              }}
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                console.error("Logo failed to load:", target.src);
                target.onerror = null;
                target.src = '/placeholder.svg';
              }}
            />
            <div className="text-center w-full">
              <div 
                className="font-bold text-[13px] leading-tight transition-colors duration-300 text-white"
                style={{ 
                  fontFamily: 'Playfair Display, serif',
                  fontWeight: '700',
                  textShadow: '2px 2px 4px rgba(0,0,0,0.8)',
                  letterSpacing: '0.5px'
                }}
              >
                Marwad Maratha
              </div>
            </div>
          </motion.a>

          {/* Navigation */}
          <nav className="hidden md:flex items-center" style={{ gap: '20px' }}>
            {[
              { name: "Home", id: "home" },
              { name: "Products", id: "products" },
              { name: "About", id: "story" },
              { name: "Contact", id: "contact" }
            ].map((item) => (
              <motion.a
                key={item.name}
                onClick={() => scrollToSection(item.id)}
                className={`font-medium relative group cursor-pointer transition-all duration-300 ${
                  activeSection === item.id 
                    ? 'text-white font-semibold'
                    : `${textColorClass} ${hoverTextColorClass}`
                }`}
                style={{ 
                  textShadow: '2px 2px 4px rgba(0, 0, 0, 0.8)',
                  fontSize: '15px',
                  fontWeight: activeSection === item.id ? '600' : '500',
                  margin: 0,
                  position: 'relative'
                }}
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
              >
                {item.name}
                <span className={`absolute bottom-0 left-0 h-0.5 transition-all duration-300 ${
                  activeSection === item.id 
                    ? 'w-full bg-yellow-400' 
                    : 'w-0 group-hover:w-full group-hover:bg-yellow-400'
                }`}></span>
              </motion.a>
            ))}
          </nav>

          {/* Mobile Menu */}
          <MobileMenu activeSection={activeSection} scrollToSection={scrollToSection} />

          {/* Action Buttons */}
          <div className="hidden md:flex items-center gap-4">
            <motion.button
              onClick={handleAdminLogin}
              className={`p-2 rounded-full transition-all duration-300 ${textColorClass} ${hoverTextColorClass}`}
              style={{ filter: 'drop-shadow(2px 2px 4px rgba(0,0,0,0.8))' }}
              whileHover={{ scale: 1.05, boxShadow: '0 4px 15px rgba(255, 255, 255, 0.2)' }}
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
                <path d="M18 21a7 7 0 0 0-14 0" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </motion.button>

            <motion.button
              onClick={toggleCart}
              className={`p-2 rounded-full relative transition-all duration-300 ${textColorClass} ${hoverTextColorClass}`}
              style={{ filter: 'drop-shadow(2px 2px 4px rgba(0,0,0,0.8))' }}
              whileHover={{ scale: 1.05, boxShadow: '0 4px 15px rgba(255, 255, 255, 0.2)' }}
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
                <circle cx="8" cy="21" r="1" />
                <circle cx="19" cy="21" r="1" />
                <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
              </svg>
              {cartItemsCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-maroon text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {cartItemsCount}
                </span>
              )}
            </motion.button>
            
            <motion.button
              onClick={() => scrollToSection('contact')}
              className="bg-[#8B1C44] hover:bg-[#7A1A3D] text-white rounded-full py-2 px-6 flex items-center gap-2 font-bold shadow-lg hover:shadow-xl transition-all duration-300"
              style={{ 
                borderRadius: '25px',
                fontSize: isCompactHeader ? '13px' : '14px', // Even smaller when compact
                fontWeight: '700',
                height: isCompactHeader ? '32px' : '36px', // Reduced height when compact
                transition: 'all 0.3s ease-in-out'
              }}
              whileHover={{ 
                scale: 1.05,
                boxShadow: '0 8px 25px rgba(139, 28, 68, 0.4)',
                y: -2
              }}
              whileTap={{ scale: 0.98 }}
            >
              <span>Order Now</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M6 12h12m-6-6 6 6-6 6"></path>
              </svg>
            </motion.button>
          </div>
        </div>
      </motion.header>

      {showAdminLogin && <AdminLogin onLoginSuccess={handleLoginSuccess} />}
      {showAdminPanel && <AdminPanel onClose={handleCloseAdminPanel} />}
      {showCart && <ShoppingCart onClose={toggleCart} />}
    </>
  );
};

export default Navbar;
