import { Image, Pencil, Trash2 } from "lucide-react";
import type { Product } from "./types/product";

interface ProductTableProps {
  products: Product[];
  onEdit: (product: Product) => void;
  onDelete: (id: number) => void;
}

const ProductTable = ({ products, onEdit, onDelete }: ProductTableProps) => {
  const handleEdit = (product: Product) => {
    onEdit(product);
    setTimeout(() => {
      const editForm = document.getElementById('product-edit-form');
      if (editForm) {
        editForm.scrollIntoView({ behavior: 'smooth', block: 'start' });
        editForm.classList.add('bg-blue-100');
        setTimeout(() => editForm.classList.remove('bg-blue-100'), 1500);
      }
    }, 100);
  };

  const getImageSrc = (image: string) => {
    if (!image || image === "/placeholder.svg") return "/placeholder.svg";
    if (image.startsWith('data:image/')) return image;
    if (image.startsWith('/src/assets/')) return `/images/${image.split('/').pop()}`;
    return image;
  };

  return (
    <>
      {/* Desktop table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-muted">
              <th className="p-3 text-left text-sm">ID</th>
              <th className="p-3 text-left text-sm">Image</th>
              <th className="p-3 text-left text-sm">Name</th>
              <th className="p-3 text-left text-sm">Category</th>
              <th className="p-3 text-left text-sm">Price (₹)</th>
              <th className="p-3 text-left text-sm">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map(product => (
              <tr key={product.id} className="border-b border-muted hover:bg-muted/30">
                <td className="p-3 text-sm">{product.id}</td>
                <td className="p-3">
                  <div className="w-12 h-12 bg-muted/30 rounded overflow-hidden flex items-center justify-center">
                    {product.image ? (
                      <img src={getImageSrc(product.image)} alt={product.name} className="w-full h-full object-cover"
                        onError={(e: React.SyntheticEvent<HTMLImageElement>) => { e.currentTarget.onerror = null; e.currentTarget.src = "/placeholder.svg"; }} />
                    ) : (
                      <Image size={20} className="text-muted-foreground" />
                    )}
                  </div>
                </td>
                <td className="p-3 text-sm">{product.name}</td>
                <td className="p-3 capitalize text-sm">{product.category}</td>
                <td className="p-3 text-sm">₹{product.price}</td>
                <td className="p-3">
                  <div className="flex gap-2">
                    <button onClick={() => handleEdit(product)} className="p-1.5 text-blue-600 hover:text-blue-800 min-h-[40px] min-w-[40px] flex items-center justify-center" title="Edit">
                      <Pencil size={16} />
                    </button>
                    <button onClick={() => onDelete(product.id)} className="p-1.5 text-red-600 hover:text-red-800 min-h-[40px] min-w-[40px] flex items-center justify-center" title="Delete">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile card layout */}
      <div className="md:hidden space-y-3">
        {products.map(product => (
          <div key={product.id} className="bg-white border border-muted rounded-lg p-3 flex gap-3">
            <div className="w-16 h-16 bg-muted/30 rounded-lg overflow-hidden flex-shrink-0 flex items-center justify-center">
              {product.image ? (
                <img src={getImageSrc(product.image)} alt={product.name} className="w-full h-full object-cover"
                  onError={(e: React.SyntheticEvent<HTMLImageElement>) => { e.currentTarget.onerror = null; e.currentTarget.src = "/placeholder.svg"; }} />
              ) : (
                <Image size={20} className="text-muted-foreground" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-medium text-sm truncate">{product.name}</h4>
              <p className="text-xs text-muted-foreground capitalize">{product.category}</p>
              <p className="text-sm font-bold text-maroon mt-0.5">₹{product.price}</p>
            </div>
            <div className="flex flex-col gap-1 flex-shrink-0">
              <button onClick={() => handleEdit(product)} className="p-2 text-blue-600 hover:bg-blue-50 rounded min-h-[40px] min-w-[40px] flex items-center justify-center">
                <Pencil size={16} />
              </button>
              <button onClick={() => onDelete(product.id)} className="p-2 text-red-600 hover:bg-red-50 rounded min-h-[40px] min-w-[40px] flex items-center justify-center">
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default ProductTable;
