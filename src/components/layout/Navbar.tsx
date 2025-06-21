
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import AdminLogin from "../admin/AdminLogin";
import AdminPanel from "../admin/AdminPanel";
import ShoppingCart from "../cart/ShoppingCart";
import { useCart } from "@/hooks/useCart";

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [showCart, setShowCart] = useState(false);
  const { cartItemsCount } = useCart();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
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
    // Explicitly set adminLoggedIn to false in localStorage to prevent auto-open
    localStorage.setItem("adminLoggedIn", "false");
  };

  const toggleCart = () => {
    setShowCart(prev => !prev);
  };

  return (
    <>
      <motion.header
        className={`fixed top-0 left-0 right-0 z-50 px-4 md:px-6 py-4 transition-all duration-300 ${
          scrolled
            ? "bg-background/90 backdrop-blur-md shadow-md"
            : "bg-transparent"
        }`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="flex items-center justify-between w-full md:w-auto">
            <motion.div
              className="flex flex-col items-center gap-1"
              whileHover={{ scale: 1.05 }}
            >
              <img 
                src="/lovable-uploads/6d7f352c-0c0a-4cae-bf02-fffd05703c31.png" 
                alt="Marwad Maratha Logo"
                className="h-16 w-auto object-contain"
                style={{ filter: 'drop-shadow(2px 2px 4px rgba(0,0,0,0.3))' }}
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  console.error("Logo failed to load:", target.src);
                  target.onerror = null;
                  target.src = '/placeholder.svg';
                }}
              />
              <div className="text-center">
                <div className="text-[#7B1E1E] font-semibold text-[16px] leading-tight" style={{ fontFamily: 'Noto Serif, serif' }}>
                  Marwad
                </div>
                <div className="text-[#7B1E1E] font-semibold text-[16px] leading-tight" style={{ fontFamily: 'Noto Serif, serif' }}>
                  Maratha
                </div>
              </div>
            </motion.div>

            <button className="md:hidden text-foreground">
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

          <nav className="hidden md:flex items-center space-x-6">
            {[
              { name: "Home", id: "home" },
              { name: "Products", id: "products" },
              { name: "About", id: "story" },
              { name: "Contact", id: "contact" }
            ].map((item) => (
              <motion.a
                key={item.name}
                onClick={() => scrollToSection(item.id)}
                className="font-medium relative group cursor-pointer"
                whileHover={{ scale: 1.05 }}
              >
                {item.name}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-maroon transition-all group-hover:w-full"></span>
              </motion.a>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <motion.button
              onClick={handleAdminLogin}
              className="text-gray-700 hover:text-maroon p-2 rounded-full"
              whileHover={{ scale: 1.1 }}
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
              className="text-gray-700 hover:text-maroon p-2 rounded-full relative"
              whileHover={{ scale: 1.1 }}
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
              className="bg-maroon hover:bg-maroon/90 text-white rounded-full py-2 px-4 md:px-6 flex items-center gap-2"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span>Order Now</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
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
