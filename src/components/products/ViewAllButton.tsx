
import { motion } from "framer-motion";

interface ViewAllButtonProps {
  showAllProducts: boolean;
  onClick: () => void;
  inView: boolean;
}

const ViewAllButton = ({ showAllProducts, onClick, inView }: ViewAllButtonProps) => {
  return (
    <motion.div
      className="text-center mt-12"
      initial={{ opacity: 0 }}
      animate={inView ? { opacity: 1 } : { opacity: 0 }}
      transition={{ delay: 0.6 }}
    >
      <motion.button
        className="bg-maroon hover:bg-maroon/90 text-white rounded-full py-3 px-8 font-medium inline-flex items-center gap-2"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onClick}
      >
        {showAllProducts ? "Show Less" : "View All Products"}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M6 12h12m-6-6 6 6-6 6"></path>
        </svg>
      </motion.button>
    </motion.div>
  );
};

export default ViewAllButton;
