import React from 'react';
import { ChevronDown } from 'lucide-react';

interface SortOption {
  value: string;
  label: string;
}

interface ProductSortProps {
  sortBy: string;
  onSortChange: (sortBy: string) => void;
  totalProducts: number;
}

const sortOptions: SortOption[] = [
  { value: 'relevance', label: 'Relevance' },
  { value: 'price-low-high', label: 'Price: Low to High' },
  { value: 'price-high-low', label: 'Price: High to Low' },
  { value: 'rating', label: 'Customer Rating' },
  { value: 'newest', label: 'Newest First' },
  { value: 'name-a-z', label: 'Name: A to Z' },
  { value: 'name-z-a', label: 'Name: Z to A' },
];

const ProductSort: React.FC<ProductSortProps> = ({
  sortBy,
  onSortChange,
  totalProducts,
}) => {
  return (
    <div className="flex items-center justify-between bg-white p-4 rounded-lg shadow-sm border mb-6">
      <div className="text-sm text-gray-600">
        Showing {totalProducts} products
      </div>
      
      <div className="flex items-center space-x-4">
        <span className="text-sm text-gray-600">Sort by:</span>
        <div className="relative">
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
            className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer"
          >
            {sortOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
        </div>
      </div>
    </div>
  );
};

export default ProductSort;
