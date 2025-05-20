
import { useState } from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import ProductCategories from "./ProductCategories";
import ProductGrid from "./ProductGrid";
import ProductShowcaseHeader from "./ProductShowcaseHeader";
import ViewAllButton from "./ViewAllButton";
import { useAllProducts } from "./useAllProducts";
import initialProducts from "./productData";

const ProductShowcase = () => {
  const [activeCategory, setActiveCategory] = useState<string>("popular");
  const [showAllProducts, setShowAllProducts] = useState(false);
  const { ref, inView } = useInView({ triggerOnce: false, threshold: 0.1 });
  const { products, categories: allCategories } = useAllProducts(initialProducts);

  // Replace "all" with "popular" and ensure no duplicates
  const categories = ["popular", ...allCategories];

  // Filter products based on selected category
  const filteredProducts = activeCategory === "popular"
    ? products.filter(product => product.isPopular)
    : products.filter(product => product.category === activeCategory);

  // Apply the show all or limited view
  const displayedProducts = showAllProducts 
    ? filteredProducts 
    : filteredProducts.slice(0, 6); // Limit to 6 products when not showing all

  return (
    <section
      id="products"
      className="py-16 md:py-24 bg-gradient-to-b from-background via-spiceYellow/20 to-background"
      ref={ref}
    >
      <div className="container mx-auto px-4">
        <ProductShowcaseHeader inView={inView} />

        <div className="mb-10 flex flex-col md:flex-row justify-center gap-6">
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">Category</p>
            <ProductCategories
              categories={categories}
              activeCategory={activeCategory}
              onSelect={(cat) => {
                setActiveCategory(cat);
                setShowAllProducts(false); // Reset to showing limited products when changing category
              }}
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
