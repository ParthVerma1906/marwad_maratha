
import React from 'react';
import { Upload } from "lucide-react";
import { Product, ProductFormData } from "./types/product";
import { getImageUrl } from "@/utils/imageAssets";

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
    image: product?.image || "/placeholder.svg",
    description: product?.description || "",
    isPopular: product?.isPopular || false
  });

  const triggerFileInput = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const imageUrl = URL.createObjectURL(file);
        // Store as a blob URL temporarily - in a real app, you'd upload this to a server
        setFormData({...formData, image: imageUrl});
      }
    };
    input.click();
  };

  // Function to handle form submission with proper image processing
  const handleSave = () => {
    // In a real application, we would upload the image to a server here
    // For now, we'll just pass the data to the parent component
    onSave(formData);
  };

  // Fix image preview URL if it's a src/assets path
  const imagePreviewUrl = formData.image.startsWith('/src/assets/') 
    ? `/images/${formData.image.split('/').pop()}` 
    : formData.image;

  return (
    <div id="product-edit-form" className={`bg-muted/30 p-4 rounded-lg border ${!isNew ? "border-blue-300 shadow-md" : "border-muted"}`}>
      <h4 className="font-medium mb-3">{isNew ? "Add New Product" : `Edit Product: ${product?.name}`}</h4>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <div 
            onClick={triggerFileInput}
            className="mb-2 w-full h-32 border border-dashed border-muted rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-muted/20"
          >
            {formData.image && formData.image !== '/placeholder.svg' ? (
              <div className="relative w-full h-full">
                <img 
                  src={imagePreviewUrl} 
                  alt="Product preview" 
                  className="w-full h-full object-contain p-2"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    console.error("Product image failed to load:", target.src);
                    target.onerror = null;
                    target.src = '/placeholder.svg';
                  }}
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
      
      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Description</label>
          <textarea
            value={formData.description || ""}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
            className="w-full px-3 py-2 border border-muted rounded-lg"
            placeholder="Product description"
            rows={3}
          />
        </div>
        
        <div className="flex items-center">
          <label className="inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={formData.isPopular || false}
              onChange={(e) => setFormData({...formData, isPopular: e.target.checked})}
              className="sr-only peer"
            />
            <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-saffron/50 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-saffron"></div>
            <span className="ml-3 text-sm font-medium">Mark as Popular</span>
          </label>
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
