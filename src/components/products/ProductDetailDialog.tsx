
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Image } from "lucide-react";

interface ProductDetailDialogProps {
  product: {
    id: number;
    name: string;
    category: string;
    price: number;
    image: string;
    description?: string;
    ingredients?: string[];
    isPopular?: boolean;
  } | null;
  isOpen: boolean;
  onClose: () => void;
}

const ProductDetailDialog = ({ product, isOpen, onClose }: ProductDetailDialogProps) => {
  if (!product) return null;

  // Image handling with support for base64 images
  const rawUrl = product.image;
  let imageUrl = rawUrl;
  
  // Base64 images start with data:image/
  if (rawUrl.startsWith("data:image/")) {
    imageUrl = rawUrl;
  } else if (!rawUrl || rawUrl === "/placeholder.svg") {
    imageUrl = "/placeholder.svg";
  } else if (rawUrl.startsWith("/src/assets/")) {
    imageUrl = `/images/${rawUrl.split("/").pop()}`;
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-3xl overflow-hidden">
        <DialogTitle className="text-xl font-heritage">{product.name}</DialogTitle>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
          <div className="bg-muted/30 rounded-lg overflow-hidden flex items-center justify-center h-[250px] md:h-[300px]">
            {imageUrl ? (
              <img 
                src={imageUrl} 
                alt={product.name} 
                className="w-full h-full object-contain"
                onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                  const target = e.currentTarget;
                  target.onerror = null;
                  target.src = "/placeholder.svg";
                }}
              />
            ) : (
              <div className="flex flex-col items-center justify-center text-muted-foreground">
                <Image size={48} />
                <span className="mt-2 text-sm">No image available</span>
              </div>
            )}
          </div>
          
          <div className="space-y-4">
            <div>
              <span className="text-sm text-muted-foreground">Category</span>
              <p className="capitalize font-medium">{product.category}</p>
            </div>
            
            <div>
              <span className="text-sm text-muted-foreground">Price</span>
              <p className="text-maroon font-bold text-xl">₹{product.price}</p>
            </div>
            
            {product.description && (
              <div>
                <span className="text-sm text-muted-foreground">Description</span>
                <p>{product.description}</p>
              </div>
            )}
            
            {product.ingredients && product.ingredients.length > 0 && (
              <div>
                <span className="text-sm text-muted-foreground">Ingredients</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {product.ingredients.map((ingredient, index) => (
                    <span
                      key={index}
                      className="bg-muted/50 text-xs px-2 py-1 rounded"
                    >
                      {ingredient}
                    </span>
                  ))}
                </div>
              </div>
            )}
            
            {product.isPopular && (
              <div className="inline-block bg-saffron text-white text-xs font-bold px-2 py-1 rounded">
                Popular
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProductDetailDialog;
