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
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/60 max-[480px]:from-black/10 max-[480px]:via-black/30 max-[480px]:to-black/70 z-10" />
      
      <div className="relative z-20 text-center w-full max-w-4xl mx-auto max-[480px]:px-5 px-4 sm:px-6 lg:px-8">
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
              className="block max-[480px]:text-[1.85rem] text-[1.75rem] sm:text-[2.25rem] md:text-[3rem] lg:text-[3.5rem] font-bold max-[480px]:mb-2 mb-2 sm:mb-3 max-[480px]:leading-[1.2] leading-[1.15]" 
              style={{ textShadow: '4px 4px 10px rgba(0,0,0,0.8), 0 0 20px rgba(0,0,0,0.5)' }}
            >
              Flavours of Tradition.
            </span>
            <span 
              className="block max-[480px]:text-[0.95rem] text-base sm:text-xl md:text-2xl lg:text-[2rem] font-handwritten leading-tight" 
              style={{ color: '#FFE5B4', textShadow: '3px 3px 8px rgba(0,0,0,0.7)', fontWeight: '400' }}
            >
              Taste of Home.
            </span>
          </motion.h1>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8, ease: "easeOut" }}
          >
            {/* Mobile: concise emotional hook + authority line */}
            <p 
              className="hidden max-[480px]:block max-[480px]:mt-3 text-[#f9f1e7] max-[480px]:text-[0.935rem] font-medium max-[480px]:leading-[1.4]"
              style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.8)' }}
            >
              Recipes passed down through generations.
            </p>
            <p 
              className="hidden max-[480px]:block max-[480px]:mt-2 max-[480px]:text-[0.8rem] max-[480px]:leading-[1.4]"
              style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.8)', color: 'rgba(249,241,231,0.75)' }}
            >
              Inspired by the rich culinary heritage of Maharashtra and Rajasthan.
            </p>
            {/* Desktop/tablet: original paragraph */}
            <p 
              className="max-[480px]:hidden mt-3 md:mt-4 text-[#f9f1e7] text-sm sm:text-base md:text-lg max-w-[720px] mx-auto font-medium leading-relaxed md:leading-[1.8]"
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
            className="max-[480px]:pt-5 pt-5 md:pt-8 flex flex-col sm:flex-row max-[480px]:gap-3 gap-3 sm:gap-4 items-center justify-center max-[480px]:px-0 px-2 sm:px-0"
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
