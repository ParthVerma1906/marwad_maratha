import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";

interface MobileMenuProps {
  activeSection: string;
  scrollToSection: (sectionId: string) => void;
}

const WHATSAPP_URL = "https://wa.me/918830257574?text=Namaste!%20Mujhe%20Marwad%20Maratha%20se%20order%20karna%20hai.";

const MobileMenu = ({ activeSection, scrollToSection }: MobileMenuProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { name: "Home", id: "home" },
    { name: "Products", id: "products" },
    { name: "About Us", id: "story" },
    { name: "Contact", id: "contact" }
  ];

  const handleItemClick = (sectionId: string) => {
    scrollToSection(sectionId);
    setIsOpen(false);
  };

  return (
    <div className="md:hidden">
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 text-white min-h-[44px] min-w-[44px] flex items-center justify-center"
        style={{ filter: 'drop-shadow(2px 2px 4px rgba(0,0,0,0.8))' }}
        whileTap={{ scale: 0.95 }}
        aria-label={isOpen ? "Close menu" : "Open menu"}
        aria-expanded={isOpen}
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm"
            style={{ zIndex: 9999 }}
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 20, stiffness: 100 }}
              className="absolute right-0 top-0 h-full w-[min(80vw,320px)] bg-gradient-to-b from-maroon to-maroon/90 shadow-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex flex-col h-full">
                <div className="flex justify-between items-center p-5 border-b border-white/20">
                  <h2 className="text-white text-lg font-bold font-heritage">Menu</h2>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="text-white p-2 min-h-[44px] min-w-[44px] flex items-center justify-center"
                    aria-label="Close menu"
                  >
                    <X size={24} />
                  </button>
                </div>

                <nav className="flex-1 px-5 py-6">
                  <ul className="space-y-2">
                    {menuItems.map((item) => (
                      <li key={item.id}>
                        <motion.button
                          onClick={() => handleItemClick(item.id)}
                          className={`block w-full text-left py-3 px-4 rounded-lg transition-all min-h-[48px] text-base ${
                            activeSection === item.id
                              ? 'text-yellow-400 bg-white/10 font-semibold'
                              : 'text-white hover:text-yellow-400 hover:bg-white/5'
                          }`}
                          whileTap={{ scale: 0.98 }}
                        >
                          {item.name}
                        </motion.button>
                      </li>
                    ))}
                  </ul>
                </nav>

                <div className="p-5 border-t border-white/20 space-y-3">
                  <motion.a
                    href={WHATSAPP_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setIsOpen(false)}
                    className="w-full flex items-center justify-center font-bold py-3 px-6 text-base"
                    style={{
                      backgroundColor: '#25D366',
                      color: '#ffffff',
                      borderRadius: '8px',
                      minHeight: '48px',
                    }}
                    whileTap={{ scale: 0.98 }}
                  >
                    📱 Order on WhatsApp
                  </motion.a>
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
