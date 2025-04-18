
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import AdminLogin from "../admin/AdminLogin";
import AdminPanel from "../admin/AdminPanel";

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [showAdminPanel, setShowAdminPanel] = useState(false);

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
  };

  return (
    <>
      <motion.header
        className={`fixed top-0 left-0 right-0 z-50 px-4 md:px-6 py-3 transition-all duration-300 ${
          scrolled
            ? "bg-background/90 backdrop-blur-md shadow-md"
            : "bg-transparent"
        }`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-2">
          <div className="flex items-center justify-between w-full md:w-auto">
            <motion.div
              className="flex items-center gap-2"
              whileHover={{ scale: 1.05 }}
            >
              <img 
                src="/src/assets/logo.png" 
                alt="Marwad Maratha"
                className="h-12 w-auto object-contain"
                onError={(e) => {
                  console.error("Logo failed to load");
                  const target = e.currentTarget;
                  target.onerror = null;
                  target.style.display = 'none';
                }}
              />
              <span className="font-heritage text-xl font-bold">
                <span className="text-maroon">Marwad</span>{" "}
                <span className="text-saffron">Maratha</span>
              </span>
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
    </>
  );
};

export default Navbar;
