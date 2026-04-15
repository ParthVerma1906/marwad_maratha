import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

const HeroContent = () => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"]
  });
  
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [1, 0.9, 0.6]);

  return (
    <motion.div 
      ref={ref}
      className="relative z-20 h-full flex flex-col items-center justify-end max-[480px]:justify-center max-[480px]:pb-0 pb-16 sm:justify-center sm:pb-0"
      style={{ y, opacity }}
    >
      {/* Bottom gradient overlay for mobile readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/60 max-[480px]:from-transparent max-[480px]:via-black/20 max-[480px]:to-black/60 z-10" />
      
      <div className="relative z-20 text-center w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
        >
          <motion.h1 
            className="font-display text-white"
            style={{ 
              textShadow: '3px 3px 8px rgba(0,0,0,0.7)',
              fontFamily: 'Playfair Display, serif',
              letterSpacing: '2px'
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8, ease: "easeOut" }}
          >
            <span 
              className="block max-[480px]:text-[1.8rem] text-[1.75rem] sm:text-[2.25rem] md:text-[3rem] lg:text-[3.5rem] font-bold max-[480px]:mb-3 mb-2 sm:mb-3 leading-[1.15]" 
              style={{ textShadow: '4px 4px 10px rgba(0,0,0,0.8), 0 0 20px rgba(0,0,0,0.5)' }}
            >
              Homemade Aachar & Papad
            </span>
            <span 
              className="block max-[480px]:text-[0.9rem] text-base sm:text-xl md:text-2xl lg:text-[2rem] font-handwritten leading-tight" 
              style={{ color: '#FFE5B4', textShadow: '3px 3px 8px rgba(0,0,0,0.7)', fontWeight: '400' }}
            >
              — Marwad Maratha
            </span>
          </motion.h1>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8, ease: "easeOut" }}
          >
            <p 
              className="max-[480px]:mt-4 mt-3 md:mt-4 text-[#f9f1e7] max-[480px]:text-[0.8rem] max-[480px]:leading-[1.5] text-sm sm:text-base md:text-lg max-w-[720px] mx-auto font-medium leading-relaxed md:leading-[1.8]"
              style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.8)' }}
            >
              Taste the richness of handmade pickles and papads,<br className="hidden sm:block" />
              prepared with heirloom recipes from the heart of Rajasthan and Maharashtra.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8, ease: "easeOut" }}
            className="max-[480px]:pt-[22px] pt-5 md:pt-8 flex flex-col sm:flex-row max-[480px]:gap-[14px] gap-3 sm:gap-4 items-center justify-center max-[480px]:px-4 px-2 sm:px-0"
          >
            <motion.button
              onClick={() => {
                const element = document.getElementById('products');
                if (element) element.scrollIntoView({ behavior: 'smooth' });
              }}
              className="text-white font-bold max-[480px]:text-[0.875rem] text-sm sm:text-base md:text-lg rounded-full w-full sm:w-auto"
              style={{
                padding: '12px 28px',
                minHeight: '48px',
                background: 'linear-gradient(135deg, #7A1E1E, #C48A00)',
                boxShadow: '0 4px 16px rgba(122, 30, 30, 0.3)',
              }}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.97 }}
            >
              Shop Now
            </motion.button>

            <motion.button
              onClick={() => {
                const element = document.getElementById('products');
                if (element) element.scrollIntoView({ behavior: 'smooth' });
              }}
              className="max-[480px]:text-[0.875rem] text-sm md:text-base rounded-full w-full sm:w-auto"
              style={{
                padding: '12px 28px',
                minHeight: '48px',
                color: '#FFFFFF',
                border: '1.5px solid rgba(255,255,255,0.5)',
              }}
              whileHover={{ scale: 1.05, borderColor: 'rgba(255,255,255,0.9)', background: 'rgba(255,255,255,0.1)' }}
              whileTap={{ scale: 0.97 }}
            >
              Explore Products
            </motion.button>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default HeroContent;
