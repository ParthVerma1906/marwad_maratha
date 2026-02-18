
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
    <motion.div 
      className="absolute bottom-[40px] left-1/2 -translate-x-1/2 text-center text-white z-20 flex flex-col items-center"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.5, duration: 0.8 }}
    >
      <motion.div
        animate={{ 
          y: [0, 8, 0],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="flex flex-col items-center gap-2"
      >
        <p className="text-xs font-light tracking-widest uppercase opacity-70" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.8)' }}>
          Scroll to explore
        </p>
        <motion.button
          onClick={handleScrollDown}
          animate={{ 
            y: [0, 6, 0],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="text-white/70 hover:text-white transition-all duration-300 cursor-pointer p-1"
          style={{ filter: 'drop-shadow(2px 2px 4px rgba(0,0,0,0.8))' }}
          whileHover={{ scale: 1.2 }}
          whileTap={{ scale: 0.95 }}
        >
          <ArrowDown size={20} strokeWidth={2} />
        </motion.button>
      </motion.div>
    </motion.div>
  );
};

export default HeroScrollIndicator;
