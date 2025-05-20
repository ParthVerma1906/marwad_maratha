
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
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [showAllProducts, setShowAllProducts] = useState(false);
  const { ref, inView } = useInView({ triggerOnce: false, threshold: 0.1 });
  const { products, categories: allCategories } = useAllProducts(initialProducts);

  // Make sure "all" is the first category and remove any duplicate "all" entries
  const categories = ["all", ...allCategories.filter(c => c !== "all")];

  // Filter products based on the selected category
  const filteredByCategory = activeCategory === "all"
    ? products
    : products.filter((product) => product.category === activeCategory);

  // Then apply the popularity filter if not showing all products
  const displayedProducts = showAllProducts
    ? filteredByCategory
    : filteredByCategory.filter((product) => product.isPopular);

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
        
        <ViewAllButton 
          showAllProducts={showAllProducts} 
          onClick={() => setShowAllProducts(!showAllProducts)} 
          inView={inView} 
        />
      </div>
    </section>
  );
};

export default ProductShowcase;
