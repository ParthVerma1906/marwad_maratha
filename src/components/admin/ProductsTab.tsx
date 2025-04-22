import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { syncProductData, initializeProducts } from "@/utils/adminSync";
import ProductFilter from "./ProductFilter";
import ProductTable from "./ProductTable";
import ProductForm from "./ProductForm";
import type { Product } from "./types/product";

// Import the complete product list from ProductShowcase (as initial default list)
import initialProducts from "../products/productData";

// Helper to get full initial product data if needed
const getInitialProducts = () => {
  // fallback default product if import fails
  return initialProducts || [];
};

const ProductsTab = () => {
  const { toast } = useToast();
  const [products, setProducts] = useState<Product[]>([]);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    // Get the latest from localStorage or fallback
    try {
      const storedProducts = localStorage.getItem("adminProducts");
      let loadedProducts: Product[] =
        storedProducts && storedProducts !== "[]" ? JSON.parse(storedProducts) : [];

      if (!loadedProducts.length) {
        // Initialize if missing
        const initialList = getInitialProducts();
        initializeProducts(initialList);
        loadedProducts = initialList;
      }
      setAllProducts(loadedProducts);
      setProducts(loadedProducts);
    } catch (error) {
      setAllProducts([]);
      setProducts([]);
    }

    const listener = () => {
      const storedProducts = localStorage.getItem("adminProducts");
      let loadedProducts: Product[] =
        storedProducts && storedProducts !== "[]" ? JSON.parse(storedProducts) : [];
      setAllProducts(loadedProducts || []);
      setProducts(loadedProducts || []);
    };
    window.addEventListener("productsUpdated", listener);
    return () => {
      window.removeEventListener("productsUpdated", listener);
    };
  }, []);

  const handleFilter = (category: string) => {
    setFilter(category);
    if (category === "all") {
      setProducts(allProducts);
    } else {
      setProducts(allProducts.filter((p) => p.category === category));
    }
  };

  const handleUpdate = (formData: any) => {
    if (!editingProduct) return;
    const updatedProducts = allProducts.map((p) =>
      p.id === editingProduct.id ? { ...editingProduct, ...formData } : p
    );
    setAllProducts(updatedProducts);
    setProducts(filter === "all" ? updatedProducts : updatedProducts.filter((p) => p.category === filter));
    syncProductData(updatedProducts);
    toast({
      title: "Product updated",
      description: `${formData.name} has been updated successfully.`,
    });
    setEditingProduct(null);
  };

  const handleDelete = (id: number) => {
    const updatedProducts = allProducts.filter((p) => p.id !== id);
    setAllProducts(updatedProducts);
    setProducts(filter === "all" ? updatedProducts : updatedProducts.filter((p) => p.category === filter));
    syncProductData(updatedProducts);
    toast({
      title: "Product deleted",
      description: "The product has been removed successfully.",
    });
  };

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
    setAllProducts(updatedProducts);
    setProducts(filter === "all" ? updatedProducts : updatedProducts.filter((p) => p.category === filter));
    syncProductData(updatedProducts);
    toast({
      title: "Product added",
      description: `${formData.name} has been added successfully.`,
    });
  };

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
