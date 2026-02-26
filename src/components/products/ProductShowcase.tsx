import { useState, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useInView } from "react-intersection-observer";
import ProductCategories from "./ProductCategories";
import ProductGrid from "./ProductGrid";
import ProductShowcaseHeader from "./ProductShowcaseHeader";
import ViewAllButton from "./ViewAllButton";
import { useAllProducts } from "./useAllProducts";
import initialProducts from "./productData";

const ProductShowcase = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });
  
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "15%"]);
  
  const [activeCategory, setActiveCategory] = useState<string>("popular");
  const [showAllProducts, setShowAllProducts] = useState(false);
  const { ref, inView } = useInView({ triggerOnce: false, threshold: 0.1 });
  const { products, categories: allCategories } = useAllProducts(initialProducts);

  const categories = ["popular", ...allCategories];

  const filteredProducts = activeCategory === "popular"
    ? products.filter(product => product.isPopular)
    : products.filter(product => product.category === activeCategory);

  const displayedProducts = showAllProducts 
    ? filteredProducts 
    : filteredProducts.slice(0, 6);

  return (
    <section
      id="products"
      ref={sectionRef}
      className="py-8 sm:py-10 md:py-16 lg:py-24 bg-gradient-to-b from-background via-spiceYellow/20 to-background relative overflow-hidden"
    >
      <motion.div 
        className="absolute inset-0 pointer-events-none hidden md:block"
        style={{ y }}
      >
        <div className="absolute top-10 left-10 w-32 h-32 bg-saffron/10 rounded-full blur-2xl" />
        <div className="absolute bottom-20 right-20 w-48 h-48 bg-maroon/10 rounded-full blur-3xl" />
      </motion.div>
      
      <div ref={ref} className="w-full px-4 sm:px-6 md:px-8 lg:px-12 max-w-7xl mx-auto relative z-10">
        <ProductShowcaseHeader inView={inView} />

        <div className="mb-4 sm:mb-6 md:mb-10">
          <p className="text-xs sm:text-sm font-medium text-muted-foreground mb-2">Category</p>
          <ProductCategories
            categories={categories}
            activeCategory={activeCategory}
            onSelect={(cat) => {
              setActiveCategory(cat);
              setShowAllProducts(false);
            }}
          />
        </div>
        
        <motion.div
          variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 1, transition: { staggerChildren: 0.2 } },
          }}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          <ProductGrid products={displayedProducts} />
        </motion.div>
        
        {filteredProducts.length > 6 && (
          <ViewAllButton 
            showAllProducts={showAllProducts} 
            onClick={() => setShowAllProducts(!showAllProducts)} 
            inView={inView} 
          />
        )}
      </div>
    </section>
  );
};

export default ProductShowcase;
