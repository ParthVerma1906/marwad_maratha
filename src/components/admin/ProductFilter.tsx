
import { Button } from "@/components/ui/button";

interface ProductFilterProps {
  currentFilter: string;
  onFilterChange: (category: string) => void;
}

const ProductFilter = ({ currentFilter, onFilterChange }: ProductFilterProps) => {
  const categories = ["aachar", "papad", "powder", "millets", "namkeen", "special"];

  return (
    <div className="flex flex-wrap gap-2 mb-4">
      <button 
        onClick={() => onFilterChange('all')}
        className={`px-3 py-1 rounded-full text-sm ${
          currentFilter === 'all' 
            ? 'bg-maroon text-white' 
            : 'bg-muted hover:bg-muted/80'
        }`}
      >
        All
      </button>
      {categories.map(category => (
        <button 
          key={category}
          onClick={() => onFilterChange(category)}
          className={`px-3 py-1 rounded-full text-sm capitalize ${
            currentFilter === category 
              ? 'bg-maroon text-white' 
              : 'bg-muted hover:bg-muted/80'
          }`}
        >
          {category}
        </button>
      ))}
    </div>
  );
};

export default ProductFilter;
