
import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Image } from "lucide-react";
import { useCart } from "@/hooks/useCart";
import ProductDetailDialog from "./ProductDetailDialog";

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
  const [showDialog, setShowDialog] = useState(false);
  const { addToCart } = useCart();

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product, 1);
  };

  const handleCardClick = () => {
    setShowDialog(true);
  };

  // Always get correct image url with support for base64 images
  const rawUrl = product.image;
  let imageUrl = rawUrl;
  
  // Handle base64 images
  if (rawUrl.startsWith("data:image/")) {
    imageUrl = rawUrl;
  } 
  // Use placeholder as last fallback
  else if (!rawUrl || rawUrl === "/placeholder.svg") {
    imageUrl = "/placeholder.svg";
  } 
  // Handle src/assets paths
  else if (rawUrl.startsWith("/src/assets/")) {
    imageUrl = `/images/${rawUrl.split("/").pop()}`;
  }

  // Add a state so placeholder isn't shown over and over on repeated failures
  const [imgSrc, setImgSrc] = useState(imageUrl);

  return (
    <>
      <motion.div
        className="relative group cursor-pointer"
        variants={itemVariants}
        onClick={handleCardClick}
      >
        <div className="bg-white rounded-xl overflow-hidden shadow-md relative transition-all h-full indian-border">
          {/* Product Image */}
          <div className="h-48 overflow-hidden relative">
            <img
              src={imgSrc}
              alt={product.name}
              className="w-full h-full object-cover transition-transform group-hover:scale-105"
              onError={() => {
                setImgSrc("/placeholder.svg");
                console.log(`Image failed to load: ${imgSrc}, falling back to placeholder`);
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

      <ProductDetailDialog 
        product={product}
        isOpen={showDialog}
        onClose={() => setShowDialog(false)}
      />
    </>
  );
};

export default ProductCard;
