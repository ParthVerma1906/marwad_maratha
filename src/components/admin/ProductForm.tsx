
import React, { useState, useRef } from 'react';
import { Upload } from "lucide-react";
import { Product, ProductFormData } from "./types/product";
import { useToast } from "@/components/ui/use-toast";

interface ProductFormProps {
  product?: Product;
  onSave: (data: ProductFormData) => void;
  onCancel?: () => void;
  isNew?: boolean;
}

const ProductForm = ({ product, onSave, onCancel, isNew = false }: ProductFormProps) => {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const categories = ["aachar", "papad", "powder", "millets", "namkeen", "special"];
  
  const [formData, setFormData] = React.useState<ProductFormData>({
    name: product?.name || "",
    category: product?.category || "aachar",
    price: product?.price || 0,
    image: product?.image || "/placeholder.svg",
    description: product?.description || "",
    isPopular: product?.isPopular || false,
  });

  // Track if the image has been changed from its initial value
  const [imageChanged, setImageChanged] = useState(false);

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check file size (2MB limit)
      if (file.size > 2 * 1024 * 1024) {
        toast({
          variant: "destructive",
          title: "File too large",
          description: "Image must be less than 2MB"
        });
        return;
      }
      
      // Convert to base64 for persistent storage
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          const base64String = event.target.result.toString();
          setFormData({...formData, image: base64String});
          setImageChanged(true);
          toast({
            title: "Image updated",
            description: "Image will be saved when you update the product"
          });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle form submission with proper image processing
  const handleSave = () => {
    // Create a copy to avoid modifying the state directly
    const dataToSave = {...formData};
    
    // If image wasn't changed and it's an existing product, keep the original image
    if (!imageChanged && product && !isNew) {
      dataToSave.image = product.image;
    }
    
    onSave(dataToSave);
    
    // Reset form if it's a new product
    if (isNew) {
      setFormData({
        name: "",
        category: "aachar",
        price: 0,
        image: "/placeholder.svg",
        description: "",
        isPopular: false
      });
      setImageChanged(false);
    }
  };

  // Get image preview URL with consistent handling
  const getImagePreviewUrl = () => {
    const imageUrl = formData.image;
    
    if (!imageUrl || imageUrl === "/placeholder.svg") {
      return "/placeholder.svg";
    } else if (imageUrl.startsWith('data:image/')) {
      return imageUrl; // It's already a base64 image
    } else if (imageUrl.startsWith('/src/assets/')) {
      return `/images/${imageUrl.split('/').pop()}`;
    }
    return imageUrl;
  };

  return (
    <div 
      id="product-edit-form" 
      className={`bg-muted/30 p-4 rounded-lg border transition-all duration-300 ${!isNew ? "border-blue-300 shadow-md" : "border-muted"}`}
    >
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
                  src={getImagePreviewUrl()} 
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
          
          {/* Hidden file input */}
          <input 
            type="file"
            ref={fileInputRef}
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />
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
            type="button"
          >
            Cancel
          </button>
        )}
        <button
          onClick={handleSave}
          className="px-4 py-2 bg-maroon text-white rounded-lg"
          type="button"
        >
          {isNew ? "Add Product" : "Update Product"}
        </button>
      </div>
    </div>
  );
};

export default ProductForm;
