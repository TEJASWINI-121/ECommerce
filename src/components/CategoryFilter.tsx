import React from 'react';
import { PRODUCT_CATEGORIES, getCategoryDisplayName } from '../utils/categoryManager';

interface CategoryFilterProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

const CategoryFilter: React.FC<CategoryFilterProps> = ({ selectedCategory, onCategoryChange }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-6">
      <h3 className="text-lg font-semibold mb-3">Categories</h3>
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => onCategoryChange('')}
          className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${selectedCategory === '' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
        >
          All
        </button>
        
        {PRODUCT_CATEGORIES.map((category) => (
          <button
            key={category}
            onClick={() => onCategoryChange(category)}
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${selectedCategory === category ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
          >
            {getCategoryDisplayName(category)}
          </button>
        ))}
      </div>
    </div>
  );
};

export default CategoryFilter;