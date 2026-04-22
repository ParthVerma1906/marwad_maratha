import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Image } from "lucide-react";

interface ProductDetailDialogProps {
  product: {
    id: string | number;
    name: string;
    category: string;
    price: number;
    image: string;
    description?: string;
    ingredients?: string[];
    isPopular?: boolean;
    weight?: string;
  } | null;
  isOpen: boolean;
  onClose: () => void;
}

const ProductDetailDialog = ({ product, isOpen, onClose }: ProductDetailDialogProps) => {
  if (!product) return null;

  const getImageUrl = (rawUrl: string) => {
    if (!rawUrl || rawUrl === "/placeholder.svg") return "/placeholder.svg";
    if (rawUrl.startsWith("data:image/")) return rawUrl;
    if (rawUrl.startsWith("/src/assets/")) return `/images/${rawUrl.split("/").pop()}`;
    return rawUrl;
  };

  const imageUrl = getImageUrl(product.image);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-[95vw] md:max-w-3xl overflow-hidden p-4 md:p-6">
        <DialogTitle className="text-lg md:text-xl font-heritage">{product.name}</DialogTitle>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mt-3 md:mt-4">
          <div className="bg-muted/30 rounded-lg overflow-hidden flex items-center justify-center h-[200px] md:h-[300px]">
            {imageUrl && imageUrl !== "/placeholder.svg" ? (
              <img 
                src={imageUrl} 
                alt={product.name} 
                className="w-full h-full object-contain"
                onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = "/placeholder.svg";
                }}
              />
            ) : (
              <div className="flex flex-col items-center justify-center text-muted-foreground">
                <Image size={48} />
                <span className="mt-2 text-sm">No image available</span>
              </div>
            )}
          </div>
          
          <div className="space-y-3 md:space-y-4">
            <div>
              <span className="text-xs md:text-sm text-muted-foreground">Category</span>
              <p className="capitalize font-medium text-sm md:text-base">{product.category}</p>
            </div>
            <div>
              <span className="text-xs md:text-sm text-muted-foreground">Price</span>
              <p className="text-maroon font-bold text-lg md:text-xl">₹{product.price}</p>
            </div>
            {product.description && (
              <div>
                <span className="text-xs md:text-sm text-muted-foreground">Description</span>
                <p className="text-sm">{product.description}</p>
              </div>
            )}
            {product.ingredients && product.ingredients.length > 0 && (
              <div>
                <span className="text-xs md:text-sm text-muted-foreground">Ingredients</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {product.ingredients.map((ingredient, index) => (
                    <span key={index} className="bg-muted/50 text-xs px-2 py-1 rounded">{ingredient}</span>
                  ))}
                </div>
              </div>
            )}
            {product.isPopular && (
              <div className="inline-block bg-saffron text-white text-xs font-bold px-2 py-1 rounded">Popular</div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProductDetailDialog;
