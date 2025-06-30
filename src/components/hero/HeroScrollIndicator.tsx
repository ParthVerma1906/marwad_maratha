
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
    <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex flex-col items-center z-20" style={{ marginTop: '50px' }}>
      <motion.p 
        className="text-sm text-[#f9f1e7] mb-4 font-medium"
        style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.4)', marginBottom: '20px' }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.5 }}
      >
        Scroll to explore
      </motion.p>
      <motion.button
        onClick={handleScrollDown}
        animate={{ y: [0, 8, 0] }}
        transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
        className="text-[#f9f1e7] hover:text-white transition-all duration-300 cursor-pointer p-2 rounded-full hover:bg-white/10"
        style={{ filter: 'drop-shadow(2px 2px 4px rgba(0,0,0,0.4))' }}
        whileHover={{ scale: 1.2 }}
        whileTap={{ scale: 0.95 }}
      >
        <ArrowDown size={24} strokeWidth={2.5} />
      </motion.button>
    </div>
  );
};

export default HeroScrollIndicator;
