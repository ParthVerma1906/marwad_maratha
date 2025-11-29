
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
      className="absolute bottom-8 left-1/2 -translate-x-1/2 text-center text-white z-20 flex flex-col items-center"
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
        <p className="text-sm font-light tracking-wide" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.8)' }}>
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
          className="text-[#f9f1e7] hover:text-white transition-all duration-300 cursor-pointer p-2 rounded-full hover:bg-white/10"
          style={{ filter: 'drop-shadow(2px 2px 4px rgba(0,0,0,0.8))' }}
          whileHover={{ scale: 1.2 }}
          whileTap={{ scale: 0.95 }}
        >
          <ArrowDown size={24} strokeWidth={2.5} />
        </motion.button>
      </motion.div>

      <motion.p 
        className="text-base font-light mt-6 max-w-md mx-auto px-4"
        style={{ 
          textShadow: '2px 2px 4px rgba(0,0,0,0.8)',
          lineHeight: '1.6'
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.0, duration: 1.0 }}
      >
        Trusted by 2,000+ delighted customers across India — and growing.
      </motion.p>
    </motion.div>
  );
};

export default HeroScrollIndicator;
