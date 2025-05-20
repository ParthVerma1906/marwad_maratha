
import { useState, useEffect } from "react";

/**
 * Robustly get ALL products, always current from localStorage (or fallback)
 */
export function useAllProducts(defaultProducts: any[]) {
  const [products, setProducts] = useState<any[]>([]);

  useEffect(() => {
    function loadProducts() {
      const stored = localStorage.getItem("adminProducts");
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          setProducts(parsed);
        } catch {
          setProducts(defaultProducts);
        }
      } else {
        setProducts(defaultProducts);
      }
    }
    loadProducts();
    // Listen for updates by admin
    const listener = () => loadProducts();
    window.addEventListener("productsUpdated", listener);

    return () => {
      window.removeEventListener("productsUpdated", listener);
    };
    // eslint-disable-next-line
  }, []);

  // Compute unique categories from the products
  const categories = Array.from(new Set(products.map(p => p.category)));
  
  return { products, categories };
}
