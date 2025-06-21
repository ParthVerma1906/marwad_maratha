
import { motion } from "framer-motion";

const HeroContent = () => {
  return (
    <div className="relative z-20 h-full flex items-center justify-center">
      <div className="container mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
          className="space-y-6 max-w-4xl mx-auto"
        >
          {/* Headline */}
          <h1 
            className="font-display text-white text-[36px] md:text-[52px] lg:text-[60px] font-bold leading-tight"
            style={{ 
              textShadow: '2px 2px 5px rgba(0,0,0,0.4)',
              fontFamily: 'Playfair Display, serif'
            }}
          >
            <span className="block">Flavours of Tradition.</span>
            <span className="block">Taste of Home.</span>
          </h1>

          {/* Subtitle */}
          <motion.h2 
            className="text-[#f9f1e7] text-[20px] md:text-[20px] max-w-[600px] mx-auto leading-relaxed font-medium"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6, ease: "easeInOut" }}
            style={{ 
              textShadow: '1px 1px 3px rgba(0,0,0,0.3)',
            }}
          >
            Taste the richness of handmade pickles and papads,<br className="hidden md:block" />
            prepared with heirloom recipes from the heart of Rajasthan and Maharashtra.
          </motion.h2>

          {/* CTA Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6, ease: "easeInOut" }}
            className="pt-6"
          >
            <motion.button
              onClick={() => {
                const element = document.getElementById('products');
                if (element) element.scrollIntoView({ behavior: 'smooth' });
              }}
              className="bg-[#FF8C42] hover:bg-[#E07A36] text-white font-bold text-[16px] rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl"
              style={{
                padding: '12px 24px',
                borderRadius: '8px',
                fontWeight: 'bold'
              }}
              whileHover={{ 
                scale: 1.02,
                boxShadow: '0 10px 25px rgba(0,0,0,0.2)'
              }}
              whileTap={{ scale: 0.98 }}
            >
              Explore Products
            </motion.button>
          </motion.div>

          {/* Trust Badge */}
          <motion.div
            className="flex flex-col items-center justify-center gap-4 pt-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.6, ease: "easeInOut" }}
          >
            <div className="flex -space-x-3">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="w-10 h-10 rounded-full border-2 border-white bg-gradient-to-br from-saffron/80 to-maroon/80"
                ></div>
              ))}
            </div>
            <div className="text-sm text-[#f9f1e7] text-center" style={{ textShadow: '1px 1px 3px rgba(0,0,0,0.3)' }}>
              <p className="font-semibold">Over 2,000 happy customers across India</p>
              <p className="opacity-90">— and growing.</p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default HeroContent;
