// Legacy compatibility wrapper. Re-exports the Supabase-backed hook so any
// remaining imports keep working. New code should import useAllProducts directly.
import { useAllProducts } from "./useAllProducts";

export default function useProducts(_initial?: any[]) {
  const { products, categories } = useAllProducts();
  return { products, allCategories: categories };
}
