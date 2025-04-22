import { useState } from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import ProductCategories from "./ProductCategories";
import ProductGrid from "./ProductGrid";
import { useAllProducts } from "./useAllProducts";
import initialProducts from "./productData";

const ProductShowcase = () => {
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [showAllProducts, setShowAllProducts] = useState(false);
  const { ref, inView } = useInView({ triggerOnce: false, threshold: 0.1 });
  const { products, categories: allCategories } = useAllProducts(initialProducts);

  const categories = ["all", ...allCategories.filter(c => c !== "all")];

  const filtered = activeCategory === "all"
    ? products
    : products.filter((p) => p.category === activeCategory);

  const displayedProducts = showAllProducts
    ? filtered
    : products.filter((prod) => prod.isPopular);

  return (
    <section
      id="products"
      className="py-16 md:py-24 bg-gradient-to-b from-background via-spiceYellow/20 to-background"
      ref={ref}
    >
      <div className="container mx-auto px-4">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.7 }}
        >
          <span className="text-maroon font-heritage text-lg">Handcrafted with Love</span>
          <h2 className="text-3xl md:text-4xl font-heritage font-bold mt-2 mb-4">Most Preferred Products</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Explore our collection of traditional pickles and snacks, made with recipes passed down through generations.
          </p>
        </motion.div>

        <div className="mb-10 flex flex-col md:flex-row justify-center gap-6">
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">Category</p>
            <ProductCategories
              categories={categories}
              activeCategory={activeCategory}
              onSelect={(cat) => setActiveCategory(cat)}
            />
          </div>
        </div>
        <motion.div
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: { staggerChildren: 0.2 },
            },
          }}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          <ProductGrid products={displayedProducts} />
        </motion.div>
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
            onClick={() => setShowAllProducts(!showAllProducts)}
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
      </div>
    </section>
  );
};

export default ProductShowcase;
