
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Image, Upload, XCircle, Check, Pencil, Trash2 } from "lucide-react";
import { syncProductData, initializeProducts } from "@/utils/adminSync";

const ProductsTab = () => {
  const { toast } = useToast();
  const [products, setProducts] = useState([]);
  const [allProducts, setAllProducts] = useState([
    { id: 1, name: "Aam Aachar", category: "aachar", price: 299, image: "/src/assets/mango-pickle.jpg" },
    { id: 2, name: "Lassan Aachar", category: "aachar", price: 249, image: "/src/assets/garlic-pickle.jpg" },
    { id: 3, name: "Rice Papad", category: "papad", price: 159, image: "/src/assets/rice-papad.jpg" },
    { id: 4, name: "Hari Mirch Kuta", category: "aachar", price: 229, image: "/src/assets/mirchi-pickle.jpg" },
    { id: 5, name: "Nimbu Khatta", category: "aachar", price: 249, image: "/placeholder.svg" },
    { id: 6, name: "Ker Sangari", category: "aachar", price: 299, image: "/placeholder.svg" },
    { id: 7, name: "Moong Lassan Papad", category: "papad", price: 199, image: "/placeholder.svg" },
    { id: 8, name: "Potato Chips", category: "papad", price: 149, image: "/src/assets/masala-papad.jpg" },
    { id: 9, name: "Aawla Powder", category: "powder", price: 299, image: "/placeholder.svg" },
    { id: 10, name: "Wheat Kurodi", category: "special", price: 179, image: "/placeholder.svg" },
    { id: 11, name: "Alsi Puri", category: "namkeen", price: 249, image: "/placeholder.svg" },
    { id: 12, name: "Mint Powder", category: "powder", price: 279, image: "/placeholder.svg" },
  ]);
  
  const [editingProduct, setEditingProduct] = useState(null);
  const [newProduct, setNewProduct] = useState({
    name: "",
    category: "aachar",
    price: 0,
    image: "/placeholder.svg"
  });
  
  const [filter, setFilter] = useState("all");
  const [fileInput, setFileInput] = useState(null);

  useEffect(() => {
    // Initialize with default products or load from storage
    const storedProducts = localStorage.getItem("adminProducts");
    if (storedProducts) {
      try {
        const parsedProducts = JSON.parse(storedProducts);
        setAllProducts(parsedProducts);
        setProducts(parsedProducts);
      } catch (error) {
        console.error("Error parsing stored products", error);
        initializeProducts(allProducts);
      }
    } else {
      initializeProducts(allProducts);
    }
  }, []);

  const handleFilter = (category) => {
    setFilter(category);
    if (category === 'all') {
      setProducts(allProducts);
    } else {
      setProducts(allProducts.filter(p => p.category === category));
    }
  };

  const handleEdit = (product) => {
    setEditingProduct({ ...product });
  };

  const handleUpdate = () => {
    if (!editingProduct) return;
    
    // Update the products list
    const updatedProducts = allProducts.map(p => 
      p.id === editingProduct.id ? editingProduct : p
    );
    
    setAllProducts(updatedProducts);
    
    // Apply current filter
    if (filter !== 'all') {
      setProducts(updatedProducts.filter(p => p.category === filter));
    } else {
      setProducts(updatedProducts);
    }

    // Sync with other components
    syncProductData(updatedProducts);
    
    toast({
      title: "Product updated",
      description: `${editingProduct.name} has been updated successfully.`,
    });
    
    setEditingProduct(null);
  };

  const handleDelete = (id) => {
    // Update the products list
    const updatedProducts = allProducts.filter(p => p.id !== id);
    setAllProducts(updatedProducts);
    
    // Apply current filter
    if (filter !== 'all') {
      setProducts(updatedProducts.filter(p => p.category === filter));
    } else {
      setProducts(updatedProducts);
    }

    // Sync with other components
    syncProductData(updatedProducts);
    
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

    // Create and add the new product
    const id = Math.max(...allProducts.map(p => p.id), 0) + 1;
    const productToAdd = { id, ...newProduct };
    const updatedProducts = [...allProducts, productToAdd];
    
    setAllProducts(updatedProducts);
    
    // Apply current filter
    if (filter !== 'all' && newProduct.category !== filter) {
      // Don't need to update displayed products if filtered to a different category
    } else {
      setProducts(filter === 'all' ? updatedProducts : updatedProducts.filter(p => p.category === filter));
    }

    // Sync with other components
    syncProductData(updatedProducts);
    
    toast({
      title: "Product added",
      description: `${newProduct.name} has been added successfully.`,
    });
    
    setNewProduct({
      name: "",
      category: "aachar",
      price: 0,
      image: "/placeholder.svg"
    });
  };

  const handleFileChange = (event, isNewProduct = false) => {
    const file = event.target.files[0];
    if (!file) return;

    // In a real app, this would upload to a server
    // For now we'll just create a temporary URL
    const imageUrl = URL.createObjectURL(file);
    
    if (isNewProduct) {
      setNewProduct({...newProduct, image: imageUrl});
    } else if (editingProduct) {
      setEditingProduct({...editingProduct, image: imageUrl});
    }
    
    toast({
      title: "Image selected",
      description: "Image will be updated when you save the product.",
    });
  };

  const triggerFileInput = (isNewProduct = false) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => handleFileChange(e, isNewProduct);
    setFileInput(input);
    input.click();
  };

  const categories = ["aachar", "papad", "powder", "millets", "namkeen", "special"];

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-xl font-heritage font-bold mb-4">Manage Products</h3>
        
        <div className="mb-6">
          <div className="flex flex-wrap gap-2 mb-4">
            <button 
              onClick={() => handleFilter('all')}
              className={`px-3 py-1 rounded-full text-sm ${
                filter === 'all' 
                  ? 'bg-maroon text-white' 
                  : 'bg-muted hover:bg-muted/80'
              }`}
            >
              All
            </button>
            {categories.map(category => (
              <button 
                key={category}
                onClick={() => handleFilter(category)}
                className={`px-3 py-1 rounded-full text-sm capitalize ${
                  filter === category 
                    ? 'bg-maroon text-white' 
                    : 'bg-muted hover:bg-muted/80'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
        
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
                        onClick={() => handleEdit(product)}
                        className="p-1 text-blue-600 hover:text-blue-800"
                        title="Edit product"
                      >
                        <Pencil size={18} />
                      </button>
                      <button 
                        onClick={() => handleDelete(product.id)}
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
      </div>

      {editingProduct && (
        <div className="bg-muted/30 p-4 rounded-lg border border-muted">
          <h4 className="font-medium mb-3">Edit Product</h4>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <div 
                onClick={() => triggerFileInput(false)}
                className="mb-2 w-full h-32 border border-dashed border-muted rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-muted/20"
              >
                {editingProduct.image ? (
                  <div className="relative w-full h-full">
                    <img 
                      src={editingProduct.image} 
                      alt="Product preview" 
                      className="w-full h-full object-contain p-2"
                      onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                        const target = e.currentTarget;
                        target.onerror = null;
                        target.src = "/placeholder.svg";
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
              <label className="block text-xs text-center text-muted-foreground">
                Click to change image
              </label>
            </div>
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
                onChange={(e) => setEditingProduct({...editingProduct, price: parseFloat(e.target.value) || 0})}
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
              className="px-4 py-2 bg-maroon text-white rounded-lg flex items-center gap-2"
            >
              <Check size={16} />
              Update Product
            </button>
          </div>
        </div>
      )}

      <div className="bg-muted/30 p-4 rounded-lg border border-muted">
        <h4 className="font-medium mb-3">Add New Product</h4>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <div 
              onClick={() => triggerFileInput(true)}
              className="mb-2 w-full h-32 border border-dashed border-muted rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-muted/20"
            >
              {newProduct.image && newProduct.image !== '/placeholder.svg' ? (
                <div className="relative w-full h-full">
                  <img 
                    src={newProduct.image} 
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
            <label className="block text-xs text-center text-muted-foreground">
              Product Image
            </label>
          </div>
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
              onChange={(e) => setNewProduct({...newProduct, price: parseFloat(e.target.value) || 0})}
              className="w-full px-3 py-2 border border-muted rounded-lg"
              placeholder="0"
              min="0"
            />
          </div>
        </div>
        <div className="mt-4">
          <button
            onClick={handleAddProduct}
            className="px-4 py-2 bg-maroon text-white rounded-lg flex items-center gap-2"
          >
            <Upload size={16} />
            Add Product
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductsTab;
