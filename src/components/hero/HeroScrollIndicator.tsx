import { motion } from "framer-motion";
import { ArrowDown } from "lucide-react";

const HeroScrollIndicator = () => {
  const handleScrollDown = () => {
    const element = document.getElementById('products');
    if (element) element.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <motion.div 
      className="absolute left-0 right-0 z-20 flex flex-col items-center gap-1 text-white max-[480px]:bottom-3 bottom-6 md:bottom-12 max-[480px]:gap-0"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.5, duration: 0.8 }}
    >
      <p className="uppercase max-[480px]:text-[9px] text-[10px] md:text-xs tracking-[2px] max-[480px]:opacity-50 opacity-70 font-medium max-[480px]:hidden"
        style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.8)' }}>
        Scroll to explore
      </p>
      <motion.button
        onClick={handleScrollDown}
        aria-label="Scroll to products"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
        className="cursor-pointer rounded-full min-h-[48px] min-w-[48px] flex items-center justify-center border border-white/40 bg-black/20 backdrop-blur-sm"
        style={{ filter: 'drop-shadow(2px 2px 4px rgba(0,0,0,0.8))' }}
        whileHover={{ scale: 1.15, backgroundColor: 'rgba(0,0,0,0.4)' }}
        whileTap={{ scale: 0.95 }}
      >
        <ArrowDown size={22} strokeWidth={2.2} color="white" />
      </motion.button>
    </motion.div>
  );
};

export default HeroScrollIndicator;
