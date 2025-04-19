
import { useState } from "react";
import { motion } from "framer-motion";
import { Plus } from "lucide-react";
import { useCart } from "@/hooks/useCart";

interface ProductProps {
  product: {
    id: number;
    name: string;
    category: string;
    price: number;
    image: string;
    description?: string;
    ingredients?: string[];
    isPopular?: boolean;
  };
}

const ProductCard = ({ product }: ProductProps) => {
  const [showDetails, setShowDetails] = useState(false);
  const { addToCart } = useCart();
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product, 1);
  };

  return (
    <motion.div
      className="relative group"
      variants={itemVariants}
      onClick={() => setShowDetails(!showDetails)}
    >
      <div className="bg-white rounded-xl overflow-hidden shadow-md relative transition-all h-full indian-border">
        {/* Product Image */}
        <div className="h-48 overflow-hidden relative">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover transition-transform group-hover:scale-105"
            onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
              const target = e.currentTarget;
              target.onerror = null;
              target.src = "/placeholder.svg";
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-start p-4">
            <span className="text-white text-sm font-medium capitalize">
              {product.category}
            </span>
          </div>
          
          {product.isPopular && (
            <div className="absolute top-3 right-3 bg-saffron text-white text-xs font-bold px-2 py-1 rounded">
              Popular
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="p-4">
          <div className="flex justify-between items-start">
            <h3 className="font-heritage font-medium text-lg">
              {product.name}
            </h3>
            <span className="text-maroon font-bold">₹{product.price}</span>
          </div>
          
          <div className="mt-3 flex justify-between items-center">
            <button
              onClick={(e) => handleAddToCart(e)}
              className="bg-maroon text-white rounded-full p-2 hover:bg-maroon/90 transition-colors"
            >
              <Plus size={16} />
            </button>
            
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowDetails(!showDetails);
              }}
              className="text-sm text-muted-foreground underline-offset-4 hover:underline"
            >
              {showDetails ? "Hide details" : "View details"}
            </button>
          </div>
          
          {showDetails && (
            <div className="mt-4 border-t border-dashed border-muted pt-3 space-y-2">
              {product.description && (
                <p className="text-sm text-muted-foreground">
                  {product.description}
                </p>
              )}
              
              {product.ingredients && product.ingredients.length > 0 && (
                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-1">
                    Ingredients:
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {product.ingredients.map((ingredient, index) => (
                      <span
                        key={index}
                        className="bg-muted/50 text-xs px-2 py-0.5 rounded"
                      >
                        {ingredient}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
