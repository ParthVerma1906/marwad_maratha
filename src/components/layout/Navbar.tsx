import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import AdminLogin from "../admin/AdminLogin";
import AdminPanel from "../admin/AdminPanel";
import ShoppingCart from "../cart/ShoppingCart";
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
      setScrolled(window.scrollY > 20);
      
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
  
  // Text colors based on background
  const textColorClass = isTransparent 
    ? 'text-white' 
    : 'text-[#222]';
  
  const hoverTextColorClass = isTransparent 
    ? 'hover:text-gray-200' 
    : 'hover:text-[#8B0000]';

  return (
    <>
      <motion.header
        className={`fixed top-0 left-0 right-0 w-full transition-all duration-300 ease-in-out ${
          isTransparent
            ? "bg-transparent"
            : "bg-white/95 backdrop-blur-lg shadow-[0_2px_10px_rgba(0,0,0,0.1)]"
        }`}
        style={{ 
          position: 'fixed',
          zIndex: 1000,
          padding: '15px 40px' // Reduced from 20px to 15px for more compact header
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
              marginTop: '8px', // Reduced from 10px
              zIndex: 10,
              maxWidth: '120px', // Reduced from 140px for more compact header
              flexShrink: 0
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
                className={`font-bold text-[14px] leading-tight transition-colors duration-300 ${
                  isTransparent ? 'text-white' : 'text-[#5A0A0A]'
                }`}
                style={{ 
                  fontFamily: 'Playfair Display, serif',
                  fontWeight: '700',
                  textShadow: isTransparent ? '0.5px 0.5px 1px rgba(0,0,0,0.5)' : 'none',
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
                    ? (isTransparent ? 'text-[#FFD700]' : 'text-[#D2691E]')
                    : `${textColorClass} ${hoverTextColorClass}`
                }`}
                style={{ 
                  textShadow: isTransparent ? '1px 1px 2px rgba(0, 0, 0, 0.5)' : 'none',
                  fontSize: '16px',
                  fontWeight: activeSection === item.id ? '600' : '500',
                  margin: 0,
                  position: 'relative'
                }}
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
              >
                {item.name}
                <span className={`absolute bottom-0 left-0 h-0.5 transition-all duration-200 ${
                  activeSection === item.id 
                    ? 'w-full' 
                    : 'w-0 group-hover:w-full'
                } bg-[#8A1538]`}></span>
              </motion.a>
            ))}
          </nav>

          {/* Action Buttons */}
          <div className="flex items-center gap-4">
            <motion.button
              onClick={handleAdminLogin}
              className={`p-2 rounded-full transition-all duration-300 ${textColorClass} ${hoverTextColorClass}`}
              style={{ filter: isTransparent ? 'drop-shadow(1px 1px 2px rgba(0,0,0,0.5))' : 'none' }}
              whileHover={{ scale: 1.05, boxShadow: '0 4px 15px rgba(139, 0, 0, 0.2)' }}
              whileTap={{ scale: 0.95 }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
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
              style={{ filter: isTransparent ? 'drop-shadow(1px 1px 2px rgba(0,0,0,0.5))' : 'none' }}
              whileHover={{ scale: 1.05, boxShadow: '0 4px 15px rgba(139, 0, 0, 0.2)' }}
              whileTap={{ scale: 0.95 }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
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
                fontSize: '15px', // Reduced from 16px
                fontWeight: '700',
                height: '38px' // Reduced from 44px
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
                width="16"
                height="16"
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
