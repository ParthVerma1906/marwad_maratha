import React from "react";
import ProductCard from "./ProductCard";

interface ProductGridProps {
  products: any[];
}

const ProductGrid = ({ products }: ProductGridProps) => {
  if (!products || products.length === 0) {
    return (
      <div className="col-span-full text-center py-8 text-muted-foreground font-medium">
        No products available in this category.
      </div>
    );
  }
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 sm:gap-6 lg:gap-8">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
};

export default ProductGrid;
