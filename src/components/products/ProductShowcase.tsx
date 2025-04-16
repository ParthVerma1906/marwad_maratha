
import { useState } from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import ProductCard from "./ProductCard";

// Complete product data
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
    name: "Aam Chunda",
    category: "aachar",
    price: 259,
    image: "/placeholder.svg",
    description: "Sweet and tangy grated mango pickle.",
    ingredients: ["Raw Mango", "Sugar", "Spices"],
  },
  {
    id: 3,
    name: "Aawla Aachar",
    category: "aachar",
    price: 279,
    image: "/placeholder.svg",
    description: "Nutritious Indian gooseberry pickle.",
    ingredients: ["Amla", "Oil", "Spices"],
  },
  {
    id: 4,
    name: "Selvat Aachar",
    category: "aachar",
    price: 269,
    image: "/placeholder.svg",
    description: "Traditional Selvat style pickle.",
    ingredients: ["Mixed Vegetables", "Oil", "Spices"],
  },
  {
    id: 5,
    name: "Nimbu Khatta",
    category: "aachar",
    price: 249,
    image: "/placeholder.svg",
    description: "Tangy lemon pickle.",
    ingredients: ["Lemon", "Oil", "Spices"],
  },
  {
    id: 6,
    name: "Nimbu Mitha",
    category: "aachar",
    price: 249,
    image: "/placeholder.svg",
    description: "Sweet and sour lemon pickle.",
    ingredients: ["Lemon", "Sugar", "Spices"],
  },
  {
    id: 7,
    name: "Ker Aachar",
    category: "aachar",
    price: 289,
    image: "/placeholder.svg",
    description: "Traditional Ker berry pickle.",
    ingredients: ["Ker Berries", "Oil", "Spices"],
  },
  {
    id: 8,
    name: "Ker Sangari",
    category: "aachar",
    price: 299,
    image: "/placeholder.svg",
    description: "Classic Ker Sangari pickle.",
    ingredients: ["Ker", "Sangari", "Spices"],
  },
  {
    id: 9,
    name: "Dana Methi Aachar",
    category: "aachar",
    price: 259,
    image: "/placeholder.svg",
    description: "Fenugreek seeds pickle.",
    ingredients: ["Fenugreek Seeds", "Oil", "Spices"],
  },
  {
    id: 10,
    name: "Mix Aachar",
    category: "aachar",
    price: 279,
    image: "/placeholder.svg",
    description: "Mixed vegetable pickle.",
    ingredients: ["Mixed Vegetables", "Oil", "Spices"],
  },
  {
    id: 11,
    name: "Desi Mirch",
    category: "aachar",
    price: 269,
    image: "/placeholder.svg",
    description: "Traditional chili pickle.",
    ingredients: ["Local Chilies", "Oil", "Spices"],
  },
  {
    id: 12,
    name: "Aathana Lal Mirch",
    category: "aachar",
    price: 259,
    image: "/placeholder.svg",
    description: "Red chili pickle.",
    ingredients: ["Red Chilies", "Oil", "Spices"],
  },
  {
    id: 13,
    name: "Aathana Hari Mirch",
    category: "aachar",
    price: 259,
    image: "/placeholder.svg",
    description: "Green chili pickle.",
    ingredients: ["Green Chilies", "Oil", "Spices"],
  },
  {
    id: 14,
    name: "Hari Mirch Kuta",
    category: "aachar",
    price: 229,
    image: "/src/assets/mirchi-pickle.jpg",
    description: "Ground green chili pickle.",
    ingredients: ["Green Chilies", "Spices", "Oil"],
    isPopular: true,
  },
  {
    id: 15,
    name: "Kathal Aachar",
    category: "aachar",
    price: 289,
    image: "/placeholder.svg",
    description: "Jackfruit pickle.",
    ingredients: ["Jackfruit", "Oil", "Spices"],
  },
  {
    id: 16,
    name: "Haldi Aachar",
    category: "aachar",
    price: 269,
    image: "/placeholder.svg",
    description: "Turmeric pickle.",
    ingredients: ["Fresh Turmeric", "Oil", "Spices"],
  },
  {
    id: 17,
    name: "Lassan Aachar",
    category: "aachar",
    price: 249,
    image: "/src/assets/garlic-pickle.jpg",
    description: "Spicy garlic pickle.",
    ingredients: ["Garlic", "Oil", "Spices"],
    isPopular: true,
  },

  // Papad
  {
    id: 18,
    name: "Moong Lassan Papad",
    category: "papad",
    price: 199,
    image: "/placeholder.svg",
    description: "Moong dal papad with garlic flavor.",
    ingredients: ["Moong Dal", "Garlic", "Spices"],
  },
  {
    id: 19,
    name: "Moong Panjabi Papad",
    category: "papad",
    price: 189,
    image: "/placeholder.svg",
    description: "Punjabi style moong dal papad.",
    ingredients: ["Moong Dal", "Spices"],
  },
  {
    id: 20,
    name: "Chana Panjabi Papad",
    category: "papad",
    price: 179,
    image: "/placeholder.svg",
    description: "Punjabi style chickpea papad.",
    ingredients: ["Chickpea Flour", "Spices"],
  },
  {
    id: 21,
    name: "Sabudana Plain Papad",
    category: "papad",
    price: 169,
    image: "/placeholder.svg",
    description: "Plain sago papad.",
    ingredients: ["Sago", "Salt"],
  },
  {
    id: 22,
    name: "Aalo Bhagar Sabudana",
    category: "papad",
    price: 189,
    image: "/placeholder.svg",
    description: "Potato and sago papad.",
    ingredients: ["Sago", "Potato", "Spices"],
  },
  {
    id: 23,
    name: "Rice Papad",
    category: "papad",
    price: 159,
    image: "/src/assets/rice-papad.jpg",
    description: "Traditional rice papad.",
    ingredients: ["Rice Flour", "Spices"],
  },
  {
    id: 24,
    name: "Potato Chips",
    category: "papad",
    price: 149,
    image: "/src/assets/masala-papad.jpg",
    description: "Crispy hand-cut potato chips.",
    ingredients: ["Potato", "Oil", "Salt"],
    isPopular: true,
  },

  // Dehydrated Powders
  {
    id: 25,
    name: "Aawla Powder",
    category: "powder",
    price: 299,
    image: "/placeholder.svg",
    description: "Dehydrated amla powder.",
    ingredients: ["Dried Amla"],
  },
  {
    id: 26,
    name: "Aritha Powder",
    category: "powder",
    price: 249,
    image: "/placeholder.svg",
    description: "Natural hair cleanser powder.",
    ingredients: ["Dried Aritha"],
  },
  {
    id: 27,
    name: "Shikakai Powder",
    category: "powder",
    price: 269,
    image: "/placeholder.svg",
    description: "Natural hair care powder.",
    ingredients: ["Dried Shikakai"],
  },
  {
    id: 28,
    name: "Jamun Powder",
    category: "powder",
    price: 319,
    image: "/placeholder.svg",
    description: "Dehydrated jamun powder.",
    ingredients: ["Dried Jamun"],
  },
  {
    id: 29,
    name: "Beetroot Powder",
    category: "powder",
    price: 289,
    image: "/placeholder.svg",
    description: "Dehydrated beetroot powder.",
    ingredients: ["Dried Beetroot"],
  },
  {
    id: 30,
    name: "Dana Methi Powder",
    category: "powder",
    price: 249,
    image: "/placeholder.svg",
    description: "Fenugreek seed powder.",
    ingredients: ["Dried Fenugreek Seeds"],
  },
  {
    id: 31,
    name: "Mint Powder",
    category: "powder",
    price: 279,
    image: "/placeholder.svg",
    description: "Dehydrated mint powder.",
    ingredients: ["Dried Mint Leaves"],
  },

  // Namkeen
  {
    id: 32,
    name: "Big Bhakarwadi",
    category: "namkeen",
    price: 299,
    image: "/placeholder.svg",
    description: "Large spiral snack with spicy filling.",
    ingredients: ["Wheat Flour", "Spices", "Oil"],
  },
  {
    id: 33,
    name: "Jain Bhakarwadi",
    category: "namkeen",
    price: 289,
    image: "/placeholder.svg",
    description: "Jain-friendly spiral snack.",
    ingredients: ["Wheat Flour", "Jain Spices", "Oil"],
  },
  {
    id: 34,
    name: "Alsi Puri",
    category: "namkeen",
    price: 249,
    image: "/placeholder.svg",
    description: "Flaxseed crackers.",
    ingredients: ["Flaxseed", "Flour", "Spices"],
  },
  {
    id: 35,
    name: "Butter Chakoli",
    category: "namkeen",
    price: 269,
    image: "/placeholder.svg",
    description: "Butter-flavored spiral snack.",
    ingredients: ["Wheat Flour", "Butter", "Spices"],
  },
  {
    id: 36,
    name: "Mix Dal Chakoli",
    category: "namkeen",
    price: 259,
    image: "/placeholder.svg",
    description: "Mixed lentil spiral snack.",
    ingredients: ["Mixed Lentils", "Spices", "Oil"],
  },

  // Special Items
  {
    id: 37,
    name: "Wheat Kurodi",
    category: "special",
    price: 179,
    image: "/placeholder.svg",
    description: "Traditional wheat-based crunchy snack.",
    ingredients: ["Wheat Flour", "Spices"],
    isPopular: true,
  },
  {
    id: 38,
    name: "Wheat Sevai",
    category: "special",
    price: 169,
    image: "/placeholder.svg",
    description: "Traditional wheat vermicelli.",
    ingredients: ["Wheat Flour"],
  },
];

const ProductShowcase = () => {
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [showAllProducts, setShowAllProducts] = useState(false);
  
  const { ref, inView } = useInView({
    triggerOnce: false,
    threshold: 0.1,
  });

  const popularProducts = products.filter(product => product.isPopular);
  const displayedProducts = showAllProducts ? 
    products.filter(product => activeCategory === "all" || product.category === activeCategory) : 
    popularProducts;

  const categories = ["all", "aachar", "papad", "powder", "namkeen", "special"];

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

        {showAllProducts && (
          <div className="mb-10">
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
          </div>
        )}

        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          {displayedProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
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
