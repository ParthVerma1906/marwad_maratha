
import React from 'react';
import { ProductFormData } from "./types/product";

interface ProductFormFieldsProps {
  formData: ProductFormData;
  onFieldChange: (field: string, value: any) => void;
  categories: string[];
}

const ProductFormFields = ({ formData, onFieldChange, categories }: ProductFormFieldsProps) => {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Name</label>
          <input 
            type="text"
            value={formData.name}
            onChange={(e) => onFieldChange("name", e.target.value)}
            className="w-full px-3 py-2 border border-muted rounded-lg"
            placeholder="Product name"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Category</label>
          <select
            value={formData.category}
            onChange={(e) => onFieldChange("category", e.target.value)}
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
            onChange={(e) => onFieldChange("price", parseFloat(e.target.value) || 0)}
            className="w-full px-3 py-2 border border-muted rounded-lg"
            placeholder="0"
            min="0"
          />
        </div>
      </div>
      
      <div className="mt-4">
        <label className="block text-sm font-medium mb-1">Description</label>
        <textarea
          value={formData.description || ""}
          onChange={(e) => onFieldChange("description", e.target.value)}
          className="w-full px-3 py-2 border border-muted rounded-lg"
          placeholder="Product description"
          rows={3}
        />
      </div>
      
      <div className="mt-4">
        <label className="inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={formData.isPopular || false}
            onChange={(e) => onFieldChange("isPopular", e.target.checked)}
            className="sr-only peer"
          />
          <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-saffron/50 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-saffron"></div>
          <span className="ml-3 text-sm font-medium">Mark as Popular</span>
        </label>
      </div>
    </>
  );
};

export default ProductFormFields;
