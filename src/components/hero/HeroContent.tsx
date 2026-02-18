
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
      className="relative z-20 h-full flex flex-col items-center justify-center"
      style={{ y, opacity, transform: 'translateY(-5vh)' }}
    >
      {/* Light gradient overlay for text readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-transparent z-10"></div>
      
      {/* Subtle dark overlay behind text area for better readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-transparent z-15"></div>
      
      <div className="relative z-20 text-center max-w-4xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
        >
          {/* Headline */}
          <motion.h1 
            className="font-display text-white leading-tight"
            style={{ 
              textShadow: '3px 3px 8px rgba(0,0,0,0.7)',
              fontFamily: 'Playfair Display, serif',
              letterSpacing: '2px'
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8, ease: "easeOut" }}
          >
            <span className="block text-[2.5rem] sm:text-[3rem] md:text-[3.5rem] font-bold mb-4" style={{ 
              textShadow: '4px 4px 10px rgba(0,0,0,0.8), 0 0 20px rgba(0,0,0,0.5)',
              WebkitTextStroke: '1px rgba(255,255,255,0.1)'
            }}>
              Flavours of Tradition.
            </span>
            <span className="block text-[1.5rem] sm:text-[1.75rem] md:text-[2rem] font-handwritten" style={{ 
              color: '#FFE5B4',
              textShadow: '3px 3px 8px rgba(0,0,0,0.7)',
              fontWeight: '400',
              letterSpacing: '0.5px'
            }}>
              Taste of Home.
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8, ease: "easeOut" }}
          >
            <h2 
              className="mt-4 text-[#f9f1e7] text-[1.125rem] sm:text-[1.25rem] md:text-[1.375rem] max-w-[720px] mx-auto font-medium text-center"
              style={{ 
                textShadow: '2px 2px 4px rgba(0,0,0,0.8)',
                lineHeight: '1.8',
                fontWeight: '500'
              }}
            >
              Taste the richness of handmade pickles and papads,<br className="hidden sm:block" />
              prepared with heirloom recipes from the heart of Rajasthan and Maharashtra.
            </h2>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8, ease: "easeOut" }}
            className="pt-8 flex flex-col sm:flex-row gap-4 items-center justify-center"
          >
            <motion.button
              onClick={() => {
                const element = document.getElementById('products');
                if (element) element.scrollIntoView({ behavior: 'smooth' });
              }}
              className="text-white font-bold text-[18px] rounded-full transition-all duration-300"
              style={{
                padding: '18px 40px',
                background: 'linear-gradient(135deg, #850E35, #FF671F)',
                borderRadius: '50px',
                fontWeight: 'bold',
                boxShadow: '0 8px 25px rgba(133, 14, 53, 0.3), 0 4px 12px rgba(255, 103, 31, 0.2)'
              }}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ 
                delay: 0.8, 
                duration: 0.6, 
                ease: "easeOut",
                type: "spring",
                stiffness: 100
              }}
              whileHover={{ 
                scale: 1.08,
                boxShadow: '0 25px 50px rgba(133, 14, 53, 0.6), 0 0 50px rgba(255, 103, 31, 0.8)',
                y: -4,
                background: 'linear-gradient(135deg, #A62052, #FFB347)'
              }}
              whileTap={{ scale: 0.95 }}
            >
              Shop Now
            </motion.button>

            <motion.button
              onClick={() => {
                const element = document.getElementById('products');
                if (element) element.scrollIntoView({ behavior: 'smooth' });
              }}
              className="text-[16px] rounded-full transition-all duration-300"
              style={{
                padding: '14px 32px',
                background: 'transparent',
                borderRadius: '50px',
                fontWeight: '500',
                color: '#FFFFFF',
                border: '1.5px solid rgba(255,255,255,0.5)',
                letterSpacing: '0.5px'
              }}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ 
                delay: 1.0, 
                duration: 0.6, 
                ease: "easeOut",
                type: "spring",
                stiffness: 100
              }}
              whileHover={{ 
                scale: 1.05,
                borderColor: 'rgba(255,255,255,0.9)',
                background: 'rgba(255,255,255,0.1)',
                y: -2
              }}
              whileTap={{ scale: 0.95 }}
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
