
import React from 'react';

interface ProductFormActionsProps {
  onSave: () => void;
  onCancel?: () => void;
  isNew: boolean;
}

const ProductFormActions = ({ onSave, onCancel, isNew }: ProductFormActionsProps) => {
  return (
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
        onClick={onSave}
        className="px-4 py-2 bg-maroon text-white rounded-lg"
        type="button"
      >
        {isNew ? "Add Product" : "Update Product"}
      </button>
    </div>
  );
};

export default ProductFormActions;
