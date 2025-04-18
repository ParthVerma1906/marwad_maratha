
import { useState } from "react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";

type Product = {
  id: number;
  name: string;
  category: string;
  price: number;
  image: string;
  description: string;
  ingredients?: string[]; // Make ingredients optional
  isPopular?: boolean;
};

type ProductCardProps = {
  product: Product;
};

const ProductCard = ({ product }: ProductCardProps) => {
  const [isRotated, setIsRotated] = useState(false);

  return (
    <motion.div
      className="relative h-[400px] w-full"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ scale: 1.02 }}
    >
      <motion.div
        className="w-full h-full rounded-xl overflow-hidden shadow-lg relative cursor-pointer"
        animate={{ rotateY: isRotated ? 180 : 0 }}
        transition={{ duration: 0.6 }}
        onClick={() => setIsRotated(!isRotated)}
      >
        {/* Front Side */}
        <motion.div
          className={`w-full h-full absolute inset-0 ${
            isRotated ? "pointer-events-none opacity-0" : "opacity-100"
          }`}
          style={{
            backfaceVisibility: "hidden",
            transition: "opacity 0.6s",
          }}
        >
          <div className="relative h-full flex flex-col">
            <div className="h-[60%] relative overflow-hidden bg-muted">
              <div className="absolute inset-0 bg-gradient-to-b from-spiceYellow/40 to-turmeric/10 z-10"></div>
              {product.isPopular && (
                <div className="absolute top-2 left-2 z-20">
                  <Badge variant="secondary" className="bg-saffron text-white">
                    Best Seller
                  </Badge>
                </div>
              )}
              {/* Product image */}
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-turmeric/30 to-spiceYellow/20">
                <div className="text-6xl">
                  {product.category === "aachar" ? "🥒" : 
                   product.category === "papad" ? "🍘" :
                   product.category === "special" ? "🍲" : "✨"}
                </div>
              </div>
            </div>

            <div className="bg-white p-4 flex-1 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start">
                  <h3 className="font-heritage text-xl font-semibold">{product.name}</h3>
                  <span className="text-xs inline-block px-2 py-1 bg-saffron/10 text-saffron rounded-full">
                    {product.category.charAt(0).toUpperCase() + product.category.slice(1)}
                  </span>
                </div>

                <p className="mt-2 text-sm line-clamp-2">{product.description}</p>
              </div>

              <div className="mt-4 flex justify-between items-center">
                <span className="font-heritage text-lg font-bold">₹{product.price}</span>
                <button className="bg-maroon hover:bg-maroon/90 text-white rounded-full py-1 px-4 text-sm">
                  Add to Cart
                </button>
              </div>
            </div>
            
            <div className="absolute top-2 right-2 bg-white/80 backdrop-blur-sm p-1 rounded-full z-20">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M7 10h10" />
                <path d="M7 14h10" />
                <circle cx="12" cy="12" r="10" />
              </svg>
            </div>
          </div>
        </motion.div>

        {/* Back Side */}
        <motion.div
          className={`w-full h-full absolute inset-0 bg-white ${
            isRotated ? "opacity-100" : "pointer-events-none opacity-0"
          }`}
          style={{
            backfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
            transition: "opacity 0.6s",
          }}
        >
          <div className="p-6 flex flex-col h-full">
            <h3 className="font-heritage text-xl font-semibold mb-2">{product.name}</h3>

            <div className="mb-4">
              <h4 className="text-sm font-medium mb-1">Description:</h4>
              <p className="text-sm text-muted-foreground">{product.description}</p>
            </div>

            <div className="mb-4 flex-1">
              <h4 className="text-sm font-medium mb-1">Ingredients:</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                {product.ingredients && product.ingredients.length > 0 ? (
                  product.ingredients.map((ingredient, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <span className="w-1 h-1 rounded-full bg-saffron"></span>
                      {ingredient}
                    </li>
                  ))
                ) : (
                  <li className="flex items-center gap-2">
                    <span className="w-1 h-1 rounded-full bg-saffron"></span>
                    Ingredients information not available
                  </li>
                )}
              </ul>
            </div>

            <div className="mt-auto pt-4 border-t flex justify-between items-center">
              <span className="font-heritage text-lg font-bold">₹{product.price}</span>
              <motion.button
                className="bg-maroon hover:bg-maroon/90 text-white rounded-full py-1 px-4 text-sm"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Add to Cart
              </motion.button>
            </div>
            
            <div className="absolute top-2 right-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M18 6 6 18" />
                <path d="m6 6 12 12" />
              </svg>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default ProductCard;
