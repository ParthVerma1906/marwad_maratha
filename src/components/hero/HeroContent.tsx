
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
            className="font-display text-white text-[28px] md:text-[42px] lg:text-[48px] font-bold leading-tight"
            style={{ 
              textShadow: '2px 2px 5px rgba(0,0,0,0.4)',
              fontFamily: 'Playfair Display, serif'
            }}
          >
            <span className="block">Flavours of Tradition.</span>
            <span className="block">Taste of Home.</span>
          </h1>

          {/* Subtitle */}
          <motion.p 
            className="text-[#f9f1e7] text-[16px] md:text-[20px] max-w-2xl mx-auto leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6, ease: "easeInOut" }}
            style={{ 
              textShadow: '1px 1px 3px rgba(0,0,0,0.3)',
            }}
          >
            Discover authentic homemade pickles and papads, crafted with
            time-honored recipes from Rajasthan and Maharashtra's culinary heritage.
          </motion.p>

          {/* CTA Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6, ease: "easeInOut" }}
            className="pt-4"
          >
            <motion.button
              onClick={() => {
                const element = document.getElementById('products');
                if (element) element.scrollIntoView({ behavior: 'smooth' });
              }}
              className="bg-[#ff9933] hover:bg-[#cc7a29] text-white font-medium text-lg px-6 py-3 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
              style={{
                padding: '12px 24px',
                borderRadius: '12px',
                fontWeight: '600'
              }}
              whileHover={{ 
                scale: 1.05,
                boxShadow: '0 10px 25px rgba(0,0,0,0.2)'
              }}
              whileTap={{ scale: 0.98 }}
            >
              Explore Products
            </motion.button>
          </motion.div>

          {/* Social Proof */}
          <motion.div
            className="flex items-center justify-center gap-4 pt-8"
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
            <div className="text-sm text-[#f9f1e7]" style={{ textShadow: '1px 1px 3px rgba(0,0,0,0.3)' }}>
              <p className="font-semibold">2000+ Happy Customers</p>
              <p className="opacity-90">Across India</p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default HeroContent;
