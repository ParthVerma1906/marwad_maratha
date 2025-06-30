
import { motion } from "framer-motion";

const HeroContent = () => {
  return (
    <div className="relative z-20 h-full flex items-center justify-center">
      {/* Light gradient overlay for text readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-transparent z-10"></div>
      
      {/* Subtle dark overlay behind text area for better readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-transparent z-15"></div>
      
      <div className="container mx-auto px-4 text-center h-full flex items-center justify-center relative z-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
          className="space-y-8 max-w-4xl mx-auto"
          style={{ marginTop: '190px' }} // Moved down by additional 30px (160+30)
        >
          {/* Headline */}
          <motion.h1 
            className="font-display text-white text-[28px] sm:text-[38px] md:text-[48px] lg:text-[56px] font-bold leading-tight"
            style={{ 
              textShadow: '3px 3px 8px rgba(0,0,0,0.7)',
              fontFamily: 'Playfair Display, serif',
              letterSpacing: '3px'
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8, ease: "easeOut" }}
          >
            <span className="block">Flavours of Tradition.</span>
            <span className="block">Taste of Home.</span>
          </motion.h1>

          {/* Subtitle with improved readability */}
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8, ease: "easeOut" }}
          >
            <h2 
              className="text-[#f9f1e7] text-[18px] sm:text-[20px] md:text-[20px] max-w-[600px] mx-auto leading-relaxed font-medium"
              style={{ 
                textShadow: '1px 1px 2px rgba(0,0,0,0.4)',
                lineHeight: '1.6'
              }}
            >
              Taste the richness of handmade pickles and papads,<br className="hidden sm:block" />
              prepared with heirloom recipes from the heart of Rajasthan and Maharashtra.
            </h2>
          </motion.div>

          {/* CTA Button with maroon color matching Order Now */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8, ease: "easeOut" }}
            className="pt-12 pb-4"
          >
            <motion.button
              onClick={() => {
                const element = document.getElementById('products');
                if (element) element.scrollIntoView({ behavior: 'smooth' });
              }}
              className="bg-[#8A1538] hover:bg-[#A62052] text-white font-bold text-[16px] rounded-xl transition-all duration-300 shadow-lg hover:shadow-2xl"
              style={{
                padding: '12px 24px',
                borderRadius: '12px',
                fontWeight: 'bold'
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
                scale: 1.05,
                boxShadow: '0 12px 30px rgba(138, 21, 56, 0.4)',
                y: -2
              }}
              whileTap={{ scale: 0.98 }}
            >
              Explore Products
            </motion.button>
          </motion.div>

          {/* Trust Badge with improved spacing */}
          <motion.div
            className="flex flex-col items-center justify-center gap-4 pt-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.0, duration: 0.8, ease: "easeOut" }}
          >
            <div className="flex -space-x-3" style={{ marginBottom: '30px' }}>
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="w-10 h-10 rounded-full border-2 border-white bg-gradient-to-br from-saffron/80 to-maroon/80"
                ></div>
              ))}
            </div>
            <div className="text-sm text-[#f9f1e7] text-center" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.4)' }}>
              <p className="font-semibold">Trusted by 2,000+ delighted customers across India</p>
              <p className="opacity-90" style={{ marginTop: '6px' }}>— and growing.</p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default HeroContent;
