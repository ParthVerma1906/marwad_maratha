
import { Upload } from "lucide-react";
import { Product, ProductFormData } from "./types/product";

interface ProductFormProps {
  product?: Product;
  onSave: (data: ProductFormData) => void;
  onCancel?: () => void;
  isNew?: boolean;
}

const ProductForm = ({ product, onSave, onCancel, isNew = false }: ProductFormProps) => {
  const categories = ["aachar", "papad", "powder", "millets", "namkeen", "special"];
  
  const [formData, setFormData] = React.useState<ProductFormData>({
    name: product?.name || "",
    category: product?.category || "aachar",
    price: product?.price || 0,
    image: product?.image || "/placeholder.svg"
  });

  const triggerFileInput = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const imageUrl = URL.createObjectURL(file);
        setFormData({...formData, image: imageUrl});
      }
    };
    input.click();
  };

  return (
    <div className="bg-muted/30 p-4 rounded-lg border border-muted">
      <h4 className="font-medium mb-3">{isNew ? "Add New Product" : "Edit Product"}</h4>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <div 
            onClick={triggerFileInput}
            className="mb-2 w-full h-32 border border-dashed border-muted rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-muted/20"
          >
            {formData.image && formData.image !== '/placeholder.svg' ? (
              <div className="relative w-full h-full">
                <img 
                  src={formData.image} 
                  alt="Product preview" 
                  className="w-full h-full object-contain p-2" 
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 hover:opacity-100 transition-opacity">
                  <Upload size={24} className="text-white" />
                </div>
              </div>
            ) : (
              <>
                <Upload size={24} className="text-muted-foreground mb-2" />
                <span className="text-xs text-muted-foreground">Click to upload image</span>
              </>
            )}
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Name</label>
          <input 
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            className="w-full px-3 py-2 border border-muted rounded-lg"
            placeholder="Product name"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Category</label>
          <select
            value={formData.category}
            onChange={(e) => setFormData({...formData, category: e.target.value})}
            className="w-full px-3 py-2 border border-muted rounded-lg"
          >
            {categories.map(category => (
              <option key={category} value={category}>
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Price (₹)</label>
          <input 
            type="number"
            value={formData.price}
            onChange={(e) => setFormData({...formData, price: parseFloat(e.target.value) || 0})}
            className="w-full px-3 py-2 border border-muted rounded-lg"
            placeholder="0"
            min="0"
          />
        </div>
      </div>
      <div className="mt-4 flex justify-end gap-2">
        {onCancel && (
          <button
            onClick={onCancel}
            className="px-4 py-2 border border-muted rounded-lg"
          >
            Cancel
          </button>
        )}
        <button
          onClick={() => onSave(formData)}
          className="px-4 py-2 bg-maroon text-white rounded-lg flex items-center gap-2"
        >
          {isNew ? "Add Product" : "Update Product"}
        </button>
      </div>
    </div>
  );
};

export default ProductForm;
