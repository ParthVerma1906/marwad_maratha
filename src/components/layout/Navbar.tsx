import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import AdminLogin from "../admin/AdminLogin";
import AdminPanel from "../admin/AdminPanel";
import ShoppingCart from "../cart/ShoppingCart";
import { useCart } from "@/hooks/useCart";
import { productImages } from "@/utils/imageAssets";

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [showCart, setShowCart] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const { cartItemsCount } = useCart();

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

  return (
    <>
      <motion.header
        className={`fixed top-0 left-0 right-0 z-50 px-4 md:px-6 py-4 transition-all duration-500 ease-in-out ${
          scrolled
            ? "bg-background/95 backdrop-blur-lg shadow-lg"
            : "bg-transparent"
        }`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center justify-between w-full md:w-auto">
            <motion.div
              className="flex flex-col items-center gap-0.5"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <img 
                src={productImages.logo}
                alt="Marwad Maratha Logo"
                className="h-12 w-auto object-contain"
                style={{ 
                  filter: 'drop-shadow(2px 2px 6px rgba(0,0,0,0.4))',
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
              <div className="text-center">
                <div 
                  className={`font-bold text-[18px] leading-tight transition-colors duration-500 text-[#5A0A0A]`}
                  style={{ 
                    fontFamily: 'Playfair Display, serif',
                    fontWeight: '700',
                    textShadow: '2px 2px 4px rgba(255,255,255,0.6), 1px 1px 3px rgba(0,0,0,0.8)',
                    letterSpacing: '0.5px',
                    filter: 'drop-shadow(0 0 2px rgba(255,255,255,0.3))'
                  }}
                >
                  Marwad Maratha
                </div>
              </div>
            </motion.div>

            <button className="md:hidden text-white">
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
                <line x1="4" x2="20" y1="12" y2="12"></line>
                <line x1="4" x2="20" y1="6" y2="6"></line>
                <line x1="4" x2="20" y1="18" y2="18"></line>
              </svg>
            </button>
          </div>

          <nav className="hidden md:flex items-center space-x-8">
            {[
              { name: "Home", id: "home" },
              { name: "Products", id: "products" },
              { name: "About", id: "story" },
              { name: "Contact", id: "contact" }
            ].map((item) => (
              <motion.a
                key={item.name}
                onClick={() => scrollToSection(item.id)}
                className={`font-medium relative group cursor-pointer transition-all duration-500 ${
                  scrolled 
                    ? activeSection === item.id 
                      ? 'text-[#D2691E]' 
                      : 'text-[#8B0000] hover:text-[#B22222]'
                    : activeSection === item.id 
                      ? 'text-[#FFD700]' 
                      : 'text-white hover:text-gray-200'
                }`}
                style={{ 
                  textShadow: scrolled ? 'none' : '1px 1px 2px rgba(0, 0, 0, 0.5)',
                  fontSize: '16px',
                  fontWeight: activeSection === item.id ? '600' : '500'
                }}
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
              >
                {item.name}
                <span className={`absolute bottom-0 left-0 h-0.5 transition-all duration-300 ${
                  activeSection === item.id 
                    ? 'w-full' 
                    : 'w-0 group-hover:w-full'
                } ${
                  scrolled ? 'bg-[#D2691E]' : 'bg-[#FFD700]'
                }`}></span>
              </motion.a>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            <motion.button
              onClick={handleAdminLogin}
              className={`p-2 rounded-full transition-all duration-300 ${
                scrolled 
                  ? 'text-[#8B0000] hover:text-[#B22222]' 
                  : 'text-white hover:text-gray-200'
              }`}
              style={{ filter: scrolled ? 'none' : 'drop-shadow(1px 1px 2px rgba(0,0,0,0.5))' }}
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
              className={`p-2 rounded-full relative transition-all duration-300 ${
                scrolled 
                  ? 'text-[#8B0000] hover:text-[#B22222]' 
                  : 'text-white hover:text-gray-200'
              }`}
              style={{ filter: scrolled ? 'none' : 'drop-shadow(1px 1px 2px rgba(0,0,0,0.5))' }}
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
              className="bg-[#8B1C44] hover:bg-[#7A1A3D] text-white rounded-full py-3 px-7 flex items-center gap-2 font-bold shadow-lg hover:shadow-xl transition-all duration-300"
              style={{ 
                borderRadius: '25px',
                fontSize: '16px',
                fontWeight: '700',
                height: '44px'
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
