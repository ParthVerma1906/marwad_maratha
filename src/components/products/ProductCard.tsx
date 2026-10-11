import { useState } from "react";
import { motion } from "framer-motion";
import { Plus } from "lucide-react";
import { useCart } from "@/hooks/useCart";
import ProductDetailDialog from "./ProductDetailDialog";

interface ProductProps {
  product: {
    id: string | number;
    name: string;
    category: string;
    price: number;
    image: string;
    description?: string;
    ingredients?: string[];
    isPopular?: boolean;
    altText?: string;
    weight?: string;
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

  const rawUrl = product.image;
  let imageUrl = rawUrl;
  if (rawUrl.startsWith("data:image/")) {
    imageUrl = rawUrl;
  } else if (!rawUrl || rawUrl === "/placeholder.svg") {
    imageUrl = "/placeholder.svg";
  } else if (rawUrl.startsWith("/src/assets/")) {
    imageUrl = `/images/${rawUrl.split("/").pop()}`;
  }

  const [imgSrc, setImgSrc] = useState(imageUrl);

  return (
    <>
      <motion.div
        className="relative group cursor-pointer"
        variants={itemVariants}
        onClick={() => setShowDialog(true)}
      >
        <div className="bg-white max-[480px]:rounded-lg rounded-xl overflow-hidden shadow-md relative transition-all h-full indian-border">
          <div className="relative overflow-hidden" style={{ aspectRatio: '1 / 1' }}>
            <img
              src={imgSrc}
              alt={(product as any).altText || `${product.name} - Marwad Maratha Homemade Pickle`}
              className="w-full h-full object-cover transition-transform group-hover:scale-105"
              width={400}
              height={400}
              loading="lazy"
              onError={() => {
                setImgSrc("/placeholder.svg");
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-start p-4">
              <span className="text-white text-sm font-medium capitalize">
                {product.category}
              </span>
            </div>
            {product.isPopular && (
              <div className="absolute top-2 right-2 bg-saffron text-white text-[10px] md:text-xs font-bold px-2 py-1 rounded">
                Popular
              </div>
            )}
          </div>

          <div className="max-[480px]:p-3 p-3 md:p-4">
            <div className="flex justify-between items-start gap-2">
              <h3 className="font-heritage font-medium max-[480px]:text-[0.95rem] text-base md:text-lg leading-tight">
                {product.name}
              </h3>
              <span className="text-maroon font-bold max-[480px]:text-sm text-sm md:text-base whitespace-nowrap">₹{product.price}</span>
            </div>

            <div className="mt-3 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
              <button
                onClick={handleAddToCart}
                className="bg-maroon text-white rounded-full hover:bg-maroon/90 transition-colors min-h-[44px] w-full sm:w-auto sm:min-w-[44px] sm:px-4 flex items-center justify-center gap-2 font-medium text-sm"
              >
                <Plus size={16} />
                <span className="sm:hidden">Add to Cart</span>
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowDetails(!showDetails);
                }}
                className="text-sm text-muted-foreground underline-offset-4 hover:underline min-h-[44px] sm:min-h-0"
              >
                {showDetails ? "Hide details" : "View details"}
              </button>
            </div>

            {showDetails && (
              <div className="mt-4 border-t border-dashed border-muted pt-3 space-y-2">
                {product.description && (
                  <p className="text-sm text-muted-foreground">{product.description}</p>
                )}
                {product.ingredients && product.ingredients.length > 0 && (
                  <div>
                    <p className="text-xs font-medium text-muted-foreground mb-1">Ingredients:</p>
                    <div className="flex flex-wrap gap-1">
                      {product.ingredients.map((ingredient, index) => (
                        <span key={index} className="bg-muted/50 text-xs px-2 py-0.5 rounded">
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
