
import { motion } from "framer-motion";

const HeroScrollIndicator = () => {
  return (
    <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex flex-col items-center z-20">
      <motion.p 
        className="text-sm text-[#f9f1e7] mb-2"
        style={{ textShadow: '1px 1px 3px rgba(0,0,0,0.3)' }}
      >
        Scroll to explore
      </motion.p>
      <motion.div
        animate={{ y: [0, 8, 0] }}
        transition={{ repeat: Infinity, duration: 1.5 }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-[#f9f1e7]"
          style={{ filter: 'drop-shadow(1px 1px 3px rgba(0,0,0,0.3))' }}
        >
          <path d="M12 5v14M5 12l7 7 7-7" />
        </svg>
      </motion.div>
    </div>
  );
};

export default HeroScrollIndicator;
