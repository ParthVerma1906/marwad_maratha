
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
      className="absolute left-1/2 z-20 flex flex-col items-center gap-2 text-white"
      style={{
        bottom: '48px',
        transform: 'translateX(-50%)',
      }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.5, duration: 0.8 }}
    >
      <p 
        className="uppercase"
        style={{ 
          fontSize: '12px',
          letterSpacing: '2px',
          opacity: 0.7,
          fontWeight: 500,
          textShadow: '2px 2px 4px rgba(0,0,0,0.8)',
        }}
      >
        Scroll to explore
      </p>
      <motion.button
        onClick={handleScrollDown}
        animate={{ y: [0, 6, 0] }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="cursor-pointer p-1"
        style={{ 
          opacity: 0.8,
          filter: 'drop-shadow(2px 2px 4px rgba(0,0,0,0.8))',
        }}
        whileHover={{ scale: 1.2, opacity: 1 }}
        whileTap={{ scale: 0.95 }}
      >
        <ArrowDown size={18} strokeWidth={2} />
      </motion.button>
    </motion.div>
  );
};

export default HeroScrollIndicator;
