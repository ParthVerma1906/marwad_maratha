import { motion } from "framer-motion";

interface ProductShowcaseHeaderProps {
  inView: boolean;
}

const ProductShowcaseHeader = ({ inView }: ProductShowcaseHeaderProps) => {
  return (
    <motion.div
      className="text-center mb-6 sm:mb-8 md:mb-12"
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.7 }}
    >
      <span className="text-maroon font-heritage text-sm sm:text-base md:text-lg">Handcrafted with Love</span>
      <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-heritage font-bold mt-1.5 sm:mt-2 mb-2 sm:mb-4">Most Preferred Products</h2>
      <p className="text-muted-foreground max-w-2xl mx-auto text-xs sm:text-sm md:text-base">
        Explore our collection of traditional pickles and snacks, made with recipes passed down through generations.
      </p>
    </motion.div>
  );
};

export default ProductShowcaseHeader;
