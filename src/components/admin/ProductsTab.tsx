
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";

const ProductsTab = () => {
  const { toast } = useToast();
  const [products, setProducts] = useState([
    { id: 1, name: "Aam Aachar", category: "aachar", price: 299 },
    { id: 2, name: "Lassan Aachar", category: "aachar", price: 249 },
    { id: 3, name: "Rice Papad", category: "papad", price: 159 },
  ]);
  
  const [editingProduct, setEditingProduct] = useState<null | {
    id: number;
    name: string;
    category: string;
    price: number;
  }>(null);
  
  const [newProduct, setNewProduct] = useState({
    name: "",
    category: "aachar",
    price: 0
  });

  const handleEdit = (product: any) => {
    setEditingProduct({ ...product });
  };

  const handleUpdate = () => {
    if (!editingProduct) return;
    
    // In a real app, this would make an API call
    setProducts(products.map(p => 
      p.id === editingProduct.id ? editingProduct : p
    ));
    
    toast({
      title: "Product updated",
      description: `${editingProduct.name} has been updated successfully.`,
    });
    
    setEditingProduct(null);
  };

  const handleDelete = (id: number) => {
    // In a real app, this would make an API call
    setProducts(products.filter(p => p.id !== id));
    
    toast({
      title: "Product deleted",
      description: "The product has been removed successfully.",
    });
  };

  const handleAddProduct = () => {
    if (!newProduct.name || newProduct.price <= 0) {
      toast({
        variant: "destructive",
        title: "Invalid product",
        description: "Please provide a name and valid price.",
      });
      return;
    }

    // In a real app, this would make an API call
    const id = Math.max(...products.map(p => p.id), 0) + 1;
    setProducts([...products, { id, ...newProduct }]);
    
    toast({
      title: "Product added",
      description: `${newProduct.name} has been added successfully.`,
    });
    
    setNewProduct({
      name: "",
      category: "aachar",
      price: 0
    });
  };

  const categories = ["aachar", "papad", "powder", "millets", "namkeen", "special"];

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-xl font-heritage font-bold mb-4">Manage Products</h3>
        
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-muted">
                <th className="p-3 text-left">ID</th>
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
                  <td className="p-3">{product.name}</td>
                  <td className="p-3 capitalize">{product.category}</td>
                  <td className="p-3">₹{product.price}</td>
                  <td className="p-3">
                    <div className="flex gap-2">
                      <button 
                        onClick={() => handleEdit(product)}
                        className="p-1 text-blue-600 hover:text-blue-800"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="18" 
                          height="18"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                        </svg>
                      </button>
                      <button 
                        onClick={() => handleDelete(product.id)}
                        className="p-1 text-red-600 hover:text-red-800"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="18" 
                          height="18"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M3 6h18" />
                          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
                          <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                          <line x1="10" y1="11" x2="10" y2="17" />
                          <line x1="14" y1="11" x2="14" y2="17" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {editingProduct && (
        <div className="bg-muted/30 p-4 rounded-lg border border-muted">
          <h4 className="font-medium mb-3">Edit Product</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Name</label>
              <input 
                type="text"
                value={editingProduct.name}
                onChange={(e) => setEditingProduct({...editingProduct, name: e.target.value})}
                className="w-full px-3 py-2 border border-muted rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Category</label>
              <select
                value={editingProduct.category}
                onChange={(e) => setEditingProduct({...editingProduct, category: e.target.value})}
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
                value={editingProduct.price}
                onChange={(e) => setEditingProduct({...editingProduct, price: parseFloat(e.target.value)})}
                className="w-full px-3 py-2 border border-muted rounded-lg"
              />
            </div>
          </div>
          <div className="mt-4 flex justify-end gap-2">
            <button
              onClick={() => setEditingProduct(null)}
              className="px-4 py-2 border border-muted rounded-lg"
            >
              Cancel
            </button>
            <button
              onClick={handleUpdate}
              className="px-4 py-2 bg-maroon text-white rounded-lg"
            >
              Update Product
            </button>
          </div>
        </div>
      )}

      <div className="bg-muted/30 p-4 rounded-lg border border-muted">
        <h4 className="font-medium mb-3">Add New Product</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Name</label>
            <input 
              type="text"
              value={newProduct.name}
              onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
              className="w-full px-3 py-2 border border-muted rounded-lg"
              placeholder="Product name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Category</label>
            <select
              value={newProduct.category}
              onChange={(e) => setNewProduct({...newProduct, category: e.target.value})}
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
              value={newProduct.price}
              onChange={(e) => setNewProduct({...newProduct, price: parseFloat(e.target.value)})}
              className="w-full px-3 py-2 border border-muted rounded-lg"
              placeholder="0"
            />
          </div>
        </div>
        <div className="mt-4">
          <button
            onClick={handleAddProduct}
            className="px-4 py-2 bg-maroon text-white rounded-lg"
          >
            Add Product
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductsTab;
