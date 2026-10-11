import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import ProductCategories from "./ProductCategories";
import ProductGrid from "./ProductGrid";
import ProductShowcaseHeader from "./ProductShowcaseHeader";
import ViewAllButton from "./ViewAllButton";
import { useAllProducts } from "./useAllProducts";
import { Skeleton } from "@/components/ui/skeleton";

const ProductShowcase = () => {
  const sectionRef = useRef<HTMLDivElement>(null);

  const [activeCategory, setActiveCategory] = useState<string>("popular");
  const [showAllProducts, setShowAllProducts] = useState(false);
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });
  const { products, categories: allCategories, loading, error } = useAllProducts();

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
      className="py-16 md:py-24 bg-background relative overflow-hidden"
    >
      
      <div ref={ref} className="w-full max-[480px]:px-3 px-4 sm:px-6 md:px-8 lg:px-12 max-w-7xl mx-auto relative z-10">
        <ProductShowcaseHeader inView={inView} />

        <div className="max-[480px]:mb-3 mb-4 sm:mb-6 md:mb-10">
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
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="bg-card rounded-lg overflow-hidden shadow-md">
                  <Skeleton className="h-40 sm:h-48 w-full" />
                  <div className="p-4 space-y-3">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-1/4" />
                  </div>
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-10 text-muted-foreground">
              {error}
            </div>
          ) : (
            <ProductGrid products={displayedProducts} />
          )}
        </motion.div>

        {!loading && !error && filteredProducts.length > 6 && (
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
