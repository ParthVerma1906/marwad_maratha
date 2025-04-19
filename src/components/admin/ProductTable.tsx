
import { Image, Pencil, Trash2 } from "lucide-react";
import type { Product } from "./types/product";

interface ProductTableProps {
  products: Product[];
  onEdit: (product: Product) => void;
  onDelete: (id: number) => void;
}

const ProductTable = ({ products, onEdit, onDelete }: ProductTableProps) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-muted">
            <th className="p-3 text-left">ID</th>
            <th className="p-3 text-left">Image</th>
            <th className="p-3 text-left">Name</th>
            <th className="p-3 text-left">Category</th>
            <th className="p-3 text-left">Price (₹)</th>
            <th className="p-3 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map(product => (
            <tr key={product.id} className="border-b border-muted hover:bg-muted/30">
              <td className="p-3">{product.id}</td>
              <td className="p-3">
                <div className="w-12 h-12 bg-muted/30 rounded overflow-hidden flex items-center justify-center">
                  {product.image ? (
                    <img 
                      src={product.image} 
                      alt={product.name} 
                      className="w-full h-full object-cover"
                      onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                        const target = e.currentTarget;
                        target.onerror = null;
                        target.src = "/placeholder.svg";
                      }}
                    />
                  ) : (
                    <Image size={20} className="text-muted-foreground" />
                  )}
                </div>
              </td>
              <td className="p-3">{product.name}</td>
              <td className="p-3 capitalize">{product.category}</td>
              <td className="p-3">₹{product.price}</td>
              <td className="p-3">
                <div className="flex gap-2">
                  <button 
                    onClick={() => onEdit(product)}
                    className="p-1 text-blue-600 hover:text-blue-800"
                    title="Edit product"
                  >
                    <Pencil size={18} />
                  </button>
                  <button 
                    onClick={() => onDelete(product.id)}
                    className="p-1 text-red-600 hover:text-red-800"
                    title="Delete product"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProductTable;
