import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface DBProduct {
  id: string;
  name: string;
  category: string;
  price: number;
  image: string;
  description?: string;
  ingredients?: string[];
  isPopular?: boolean;
  altText?: string;
  weight?: string;
  isAvailable?: boolean;
}

function mapRow(row: any): DBProduct {
  return {
    id: row.id,
    name: row.name,
    category: row.category,
    price: Number(row.price),
    image: row.image_url || "/placeholder.svg",
    description: row.description ?? undefined,
    ingredients: row.ingredients ?? undefined,
    isPopular: !!row.is_popular,
    altText: row.alt_text ?? undefined,
    weight: row.weight ?? undefined,
    isAvailable: row.is_available !== false,
  };
}

/**
 * Fetch all available products from Supabase.
 * Falls back to an empty list on error so the UI can show a friendly message.
 */
export function useAllProducts(_unused?: any[]) {
  const [products, setProducts] = useState<DBProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);
      const { data, error: err } = await supabase
        .from("products")
        .select("*")
        .eq("is_available", true)
        .order("created_at", { ascending: true });

      if (cancelled) return;

      if (err) {
        console.error("Failed to load products:", err);
        setError("Could not load products. Please try again.");
        setProducts([]);
      } else {
        setProducts((data ?? []).map(mapRow));
      }
      setLoading(false);
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const categories = Array.from(new Set(products.map((p) => p.category)));

  return { products, categories, loading, error };
}
