import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";

interface MobileMenuProps {
  activeSection: string;
  scrollToSection: (sectionId: string) => void;
}

const MobileMenu = ({ activeSection, scrollToSection }: MobileMenuProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { name: "Home", id: "home" },
    { name: "Products", id: "products" },
    { name: "About", id: "story" },
    { name: "Contact", id: "contact" }
  ];

  const handleItemClick = (sectionId: string) => {
    scrollToSection(sectionId);
    setIsOpen(false);
  };

  return (
    <div className="md:hidden">
      {/* Hamburger Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 text-white"
        style={{ filter: 'drop-shadow(2px 2px 4px rgba(0,0,0,0.8))' }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </motion.button>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 20, stiffness: 100 }}
              className="absolute right-0 top-0 h-full w-80 bg-gradient-to-b from-maroon to-maroon/90 shadow-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex flex-col h-full">
                {/* Header */}
                <div className="flex justify-between items-center p-6 border-b border-white/20">
                  <h2 className="text-white text-xl font-bold" style={{ fontFamily: 'Playfair Display, serif' }}>
                    Menu
                  </h2>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="text-white p-2"
                  >
                    <X size={24} />
                  </button>
                </div>

                {/* Menu Items */}
                <nav className="flex-1 px-6 py-8">
                  <ul className="space-y-6">
                    {menuItems.map((item) => (
                      <li key={item.id}>
                        <motion.button
                          onClick={() => handleItemClick(item.id)}
                          className={`block w-full text-left py-3 px-4 rounded-lg transition-all duration-300 ${
                            activeSection === item.id
                              ? 'text-yellow-400 bg-white/10 font-semibold'
                              : 'text-white hover:text-yellow-400 hover:bg-white/5'
                          }`}
                          style={{ fontSize: '18px' }}
                          whileHover={{ x: 8 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          {item.name}
                          {activeSection === item.id && (
                            <motion.div
                              className="w-full h-0.5 bg-yellow-400 mt-2"
                              layoutId="activeIndicator"
                            />
                          )}
                        </motion.button>
                      </li>
                    ))}
                  </ul>
                </nav>

                {/* Footer */}
                <div className="p-6 border-t border-white/20">
                  <motion.button
                    onClick={() => {
                      scrollToSection('contact');
                      setIsOpen(false);
                    }}
                    className="w-full bg-gradient-to-r from-saffron to-yellow-400 text-maroon font-bold py-3 px-6 rounded-full"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Order Now
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MobileMenu;