
import { useState } from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import ProductCard from "./ProductCard";

// Updated Product data based on provided list
const products = [
  // Aachar (Pickles)
  {
    id: 1,
    name: "Aam Aachar",
    category: "aachar",
    price: 299,
    image: "/src/assets/mango-pickle.jpg",
    description: "Traditional raw mango pickle with authentic Rajasthani spices.",
    ingredients: ["Raw Mango", "Mustard Oil", "Spices"],
    isPopular: true,
  },
  {
    id: 2,
    name: "Lassan Aachar",
    category: "aachar",
    price: 249,
    image: "/src/assets/garlic-pickle.jpg",
    description: "Spicy garlic pickle made with hand-picked garlic cloves.",
    ingredients: ["Garlic", "Mustard Oil", "Spices"],
    isPopular: true,
  },
  {
    id: 3,
    name: "Mirch Kuta",
    category: "aachar",
    price: 229,
    image: "/src/assets/mirchi-pickle.jpg",
    description: "Fiery ground chili pickle for spice lovers.",
    ingredients: ["Green Chili", "Spices", "Oil"],
    isPopular: true,
  },
  {
    id: 4,
    name: "Wheat Kurodi",
    category: "special",
    price: 179,
    image: "/placeholder.svg",
    description: "Traditional wheat-based crunchy snack.",
    ingredients: ["Wheat Flour", "Spices"],
    isPopular: true,
  },
  {
    id: 5,
    name: "Potato Chips",
    category: "papad",
    price: 149,
    image: "/src/assets/masala-papad.jpg",
    description: "Crispy hand-cut potato chips.",
    ingredients: ["Potato", "Oil", "Salt"],
    isPopular: true,
  }
];

const ProductShowcase = () => {
  const [activeCategory, setActiveCategory] = useState<string>("all");
  
  const { ref, inView } = useInView({
    triggerOnce: false,
    threshold: 0.1,
  });

  const filteredProducts = products.filter(product => 
    activeCategory === "all" || product.category === activeCategory
  );

  // Updated categories without spice level
  const categories = ["all", "aachar", "papad", "special"];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

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
          <h2 className="text-3xl md:text-4xl font-heritage font-bold mt-2 mb-4">Our Product Range</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Explore our collection of traditional pickles and snacks, made with recipes passed down through generations.
          </p>
        </motion.div>

        <div className="mb-10">
          {/* Category Filter Controls */}
          <div className="flex flex-col md:flex-row justify-center gap-6 mb-8">
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Category</p>
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setActiveCategory(category)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                      activeCategory === category
                        ? "bg-maroon text-white"
                        : "bg-muted hover:bg-muted/80 text-foreground"
                    }`}
                  >
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Product grid */}
          <motion.div 
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
            variants={containerVariants}
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
          >
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </motion.div>
        </div>

        <motion.div 
          className="text-center"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ delay: 0.6 }}
        >
          <motion.button
            className="bg-maroon hover:bg-maroon/90 text-white rounded-full py-3 px-8 font-medium inline-flex items-center gap-2"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            View All Products
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
