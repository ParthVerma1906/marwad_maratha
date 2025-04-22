
import { useState, useEffect } from "react";

// Handles products loading, syncing with localStorage and provides categories
export default function useProducts(initialProducts: any[]) {
  const [products, setProducts] = useState(initialProducts);

  useEffect(() => {
    const stored = localStorage.getItem("adminProducts");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        // Handle older imports where image path might be outdated
        const processed = parsed.map((p: any) => ({
          ...p,
          image: p.image.startsWith("/src/assets/")
            ? `/images/${p.image.split("/").pop()}`
            : p.image,
        }));
        setProducts(processed);
      } catch (err) {
        setProducts(initialProducts);
      }
    } else {
      setProducts(initialProducts);
    }

    // Listen for admin panel updates
    const handleUpdate = () => {
      const updated = localStorage.getItem("adminProducts");
      if (updated) {
        try {
          const parsed = JSON.parse(updated);
          setProducts(parsed);
        } catch (_e) {}
      }
    };
    window.addEventListener("productsUpdated", handleUpdate);

    return () => {
      window.removeEventListener("productsUpdated", handleUpdate);
    };
    // We intentionally leave out initialProducts as dependency to avoid re-initialization loop
    // eslint-disable-next-line
  }, []);

  const allCategories = Array.from(
    new Set(products.map((p) => p.category))
  );
  return { products, allCategories };
}
