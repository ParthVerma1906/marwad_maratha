import React, { useState } from 'react';
import { Product, ProductFormData } from "./types/product";
import ImageUploader from './ImageUploader';
import ProductFormFields from './ProductFormFields';
import ProductFormActions from './ProductFormActions';

interface ProductFormProps {
  product?: Product;
  onSave: (data: ProductFormData) => void;
  onCancel?: () => void;
  isNew?: boolean;
}

const ProductForm = ({ product, onSave, onCancel, isNew = false }: ProductFormProps) => {
  const categories = ["aachar", "papad", "powder", "millets", "namkeen", "special"];
  
  const [formData, setFormData] = useState<ProductFormData>({
    name: product?.name || "",
    category: product?.category || "aachar",
    price: product?.price || 0,
    image: product?.image || "/placeholder.svg",
    description: product?.description || "",
    isPopular: product?.isPopular || false,
  });

  // Track if the image has been changed from its initial value
  const [imageChanged, setImageChanged] = useState(false);

  const handleImageChange = (base64String: string) => {
    setFormData({...formData, image: base64String});
    setImageChanged(true);
  };

  const handleFieldChange = (field: string, value: any) => {
    setFormData({ ...formData, [field]: value });
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

  return (
    <div 
      id="product-edit-form" 
      className={`bg-muted/30 p-4 rounded-lg border transition-all duration-300 ${!isNew ? "border-blue-300 shadow-md" : "border-muted"}`}
    >
      <h4 className="font-medium mb-3">{isNew ? "Add New Product" : `Edit Product: ${product?.name}`}</h4>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <ImageUploader 
            imageUrl={formData.image} 
            onImageChange={handleImageChange}
          />
        </div>
        
        <div className="md:col-span-3">
          <ProductFormFields 
            formData={formData}
            onFieldChange={handleFieldChange}
            categories={categories}
          />
        </div>
      </div>
      
      <ProductFormActions 
        onSave={handleSave}
        onCancel={onCancel}
        isNew={isNew}
      />
    </div>
  );
};

export default ProductForm;
