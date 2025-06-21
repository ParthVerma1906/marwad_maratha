
import { motion } from "framer-motion";
import { ArrowDown } from "lucide-react";

const HeroScrollIndicator = () => {
  const handleScrollDown = () => {
    const element = document.getElementById('products');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex flex-col items-center z-20">
      <motion.p 
        className="text-sm text-[#f9f1e7] mb-2"
        style={{ textShadow: '1px 1px 3px rgba(0,0,0,0.3)' }}
      >
        Scroll to explore
      </motion.p>
      <motion.button
        onClick={handleScrollDown}
        animate={{ y: [0, 8, 0] }}
        transition={{ repeat: Infinity, duration: 1.5 }}
        className="text-[#f9f1e7] hover:text-white transition-colors cursor-pointer"
        style={{ filter: 'drop-shadow(1px 1px 3px rgba(0,0,0,0.3))' }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        <ArrowDown size={24} />
      </motion.button>
    </div>
  );
};

export default HeroScrollIndicator;
