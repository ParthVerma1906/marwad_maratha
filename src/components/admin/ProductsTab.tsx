
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { syncProductData, initializeProducts } from "@/utils/adminSync";
import ProductFilter from "./ProductFilter";
import ProductTable from "./ProductTable";
import ProductForm from "./ProductForm";
import type { Product } from "./types/product";

// Import the initial product list if needed
import initialProducts from "../products/productData";

const ProductsTab = () => {
  const { toast } = useToast();
  const [products, setProducts] = useState<Product[]>([]);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [filter, setFilter] = useState("popular");
  const [loading, setLoading] = useState(true);

  // Load products from localStorage or initialize with defaults
  useEffect(() => {
    try {
      // Get stored products or initialize if missing
      const storedProducts = localStorage.getItem("adminProducts");
      
      let loadedProducts: Product[];
      if (storedProducts && storedProducts !== "[]") {
        loadedProducts = JSON.parse(storedProducts);
        console.log("Loaded products from localStorage:", loadedProducts.length);
      } else {
        // Initialize with defaults if no products found
        loadedProducts = initializeProducts(initialProducts);
        console.log("Initialized products:", loadedProducts.length);
      }
      
      setAllProducts(loadedProducts);
      
      // Apply initial filter
      if (filter === "popular") {
        setProducts(loadedProducts.filter(p => p.isPopular));
      } else {
        setProducts(loadedProducts);
      }
    } catch (error) {
      console.error("Error loading products:", error);
      setAllProducts([]);
      setProducts([]);
      
      // Try to recover by initializing with defaults
      const recoveryProducts = initializeProducts(initialProducts);
      setAllProducts(recoveryProducts);
      setProducts(recoveryProducts);
    } finally {
      setLoading(false);
    }

    // Listen for product updates from other components
    const handleProductsUpdated = () => {
      try {
        const updatedProducts = JSON.parse(localStorage.getItem("adminProducts") || "[]");
        setAllProducts(updatedProducts);
        
        // Maintain current filter
        if (filter === "popular") {
          setProducts(updatedProducts.filter(p => p.isPopular));
        } else {
          setProducts(updatedProducts.filter(p => p.category === filter));
        }
      } catch (error) {
        console.error("Error handling product update event:", error);
      }
    };
    
    window.addEventListener("productsUpdated", handleProductsUpdated);
    return () => {
      window.removeEventListener("productsUpdated", handleProductsUpdated);
    };
  }, []);

  // Handle filter changes
  const handleFilter = (category: string) => {
    setFilter(category);
    if (category === "popular") {
      setProducts(allProducts.filter(p => p.isPopular));
    } else {
      setProducts(allProducts.filter((p) => p.category === category));
    }
  };

  // Update an existing product
  const handleUpdate = (formData: any) => {
    if (!editingProduct) return;
    
    const updatedProducts = allProducts.map((p) =>
      p.id === editingProduct.id ? { ...p, ...formData } : p
    );
    
    // Update state and persist to localStorage
    setAllProducts(updatedProducts);
    if (filter === "popular") {
      setProducts(updatedProducts.filter(p => p.isPopular));
    } else {
      setProducts(updatedProducts.filter((p) => p.category === filter));
    }
    
    // Sync to localStorage and notify other components
    syncProductData(updatedProducts);
    
    toast({
      title: "Product updated",
      description: `${formData.name} has been updated successfully.`,
    });
    
    setEditingProduct(null);
  };

  // Delete a product
  const handleDelete = (id: number) => {
    const updatedProducts = allProducts.filter((p) => p.id !== id);
    
    // Update state and persist
    setAllProducts(updatedProducts);
    if (filter === "popular") {
      setProducts(updatedProducts.filter(p => p.isPopular));
    } else {
      setProducts(updatedProducts.filter((p) => p.category === filter));
    }
    
    // Sync to localStorage
    syncProductData(updatedProducts);
    
    toast({
      title: "Product deleted",
      description: "The product has been removed successfully.",
    });
  };

  // Add a new product
  const handleAddProduct = (formData: any) => {
    if (!formData.name || formData.price <= 0) {
      toast({
        variant: "destructive",
        title: "Invalid product",
        description: "Please provide a name and valid price.",
      });
      return;
    }

    const id = Math.max(...allProducts.map((p) => p.id), 0) + 1;
    const productToAdd = { id, ...formData };
    const updatedProducts = [...allProducts, productToAdd];
    
    // Update state
    setAllProducts(updatedProducts);
    if (filter === "popular") {
      setProducts(updatedProducts.filter(p => p.isPopular));
    } else {
      setProducts(updatedProducts.filter((p) => p.category === filter));
    }
    
    // Sync to localStorage
    syncProductData(updatedProducts);
    
    toast({
      title: "Product added",
      description: `${formData.name} has been added successfully.`,
    });
  };

  if (loading) {
    return <div className="p-4">Loading products...</div>;
  }

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-xl font-heritage font-bold mb-4">Manage Products</h3>
        <ProductFilter currentFilter={filter} onFilterChange={handleFilter} />
        <ProductTable
          products={products}
          onEdit={setEditingProduct}
          onDelete={handleDelete}
        />
      </div>
      
      {editingProduct && (
        <ProductForm
          product={editingProduct}
          onSave={handleUpdate}
          onCancel={() => setEditingProduct(null)}
        />
      )}
      
      <ProductForm onSave={handleAddProduct} isNew />
    </div>
  );
};

export default ProductsTab;
