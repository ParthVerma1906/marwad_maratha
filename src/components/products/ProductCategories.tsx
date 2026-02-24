import React from "react";

interface ProductCategoriesProps {
  categories: string[];
  activeCategory: string;
  onSelect: (cat: string) => void;
}

const ProductCategories = ({
  categories,
  activeCategory,
  onSelect,
}: ProductCategoriesProps) => (
  <div className="flex flex-wrap gap-2">
    {categories.map((category) => (
      <button
        key={category}
        onClick={() => onSelect(category)}
        className={`px-3 md:px-4 py-2 rounded-full text-xs md:text-sm font-medium transition-all min-h-[40px] ${
          activeCategory === category
            ? "bg-maroon text-white"
            : "bg-muted hover:bg-muted/80 text-foreground"
        }`}
        aria-pressed={activeCategory === category}
      >
        {category.charAt(0).toUpperCase() + category.slice(1)}
      </button>
    ))}
  </div>
);

export default ProductCategories;
