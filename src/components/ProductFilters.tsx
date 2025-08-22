import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Filter, X } from 'lucide-react';

interface FilterProps {
  categories: string[];
  brands: string[];
  priceRange: [number, number];
  onCategoryChange: (categories: string[]) => void;
  onBrandChange: (brands: string[]) => void;
  onPriceChange: (range: [number, number]) => void;
  onRatingChange: (rating: number) => void;
  selectedCategories: string[];
  selectedBrands: string[];
  selectedRating: number;
  onClearFilters: () => void;
}

const ProductFilters: React.FC<FilterProps> = ({
  categories,
  brands,
  priceRange,
  onCategoryChange,
  onBrandChange,
  onPriceChange,
  onRatingChange,
  selectedCategories,
  selectedBrands,
  selectedRating,
  onClearFilters,
}) => {
  const [showCategories, setShowCategories] = useState(true);
  const [showBrands, setShowBrands] = useState(true);
  const [showPrice, setShowPrice] = useState(true);
  const [showRating, setShowRating] = useState(true);
  const [localPriceRange, setLocalPriceRange] = useState(priceRange);

  const handleCategoryToggle = (category: string) => {
    const newCategories = selectedCategories.includes(category)
      ? selectedCategories.filter(c => c !== category)
      : [...selectedCategories, category];
    onCategoryChange(newCategories);
  };

  const handleBrandToggle = (brand: string) => {
    const newBrands = selectedBrands.includes(brand)
      ? selectedBrands.filter(b => b !== brand)
      : [...selectedBrands, brand];
    onBrandChange(newBrands);
  };

  const handlePriceChange = (index: number, value: number) => {
    const newRange: [number, number] = [...localPriceRange];
    newRange[index] = value;
    setLocalPriceRange(newRange);
    onPriceChange(newRange);
  };

  const formatCategoryName = (category: string) => {
    return category.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  const hasActiveFilters = selectedCategories.length > 0 || selectedBrands.length > 0 || selectedRating > 0;

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6 sticky top-4">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <Filter className="h-5 w-5 text-gray-600" />
          <h3 className="text-lg font-semibold text-gray-800">Filters</h3>
        </div>
        {hasActiveFilters && (
          <button
            onClick={onClearFilters}
            className="flex items-center space-x-1 text-sm text-red-600 hover:text-red-700"
          >
            <X className="h-4 w-4" />
            <span>Clear All</span>
          </button>
        )}
      </div>

      {/* Categories */}
      <div className="mb-6">
        <button
          onClick={() => setShowCategories(!showCategories)}
          className="flex items-center justify-between w-full text-left font-medium text-gray-800 mb-3"
        >
          <span>Categories</span>
          {showCategories ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </button>
        {showCategories && (
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {categories.map(category => (
              <label key={category} className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedCategories.includes(category)}
                  onChange={() => handleCategoryToggle(category)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">{formatCategoryName(category)}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Brands */}
      <div className="mb-6">
        <button
          onClick={() => setShowBrands(!showBrands)}
          className="flex items-center justify-between w-full text-left font-medium text-gray-800 mb-3"
        >
          <span>Brands</span>
          {showBrands ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </button>
        {showBrands && (
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {brands.map(brand => (
              <label key={brand} className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedBrands.includes(brand)}
                  onChange={() => handleBrandToggle(brand)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">{brand}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Price Range */}
      <div className="mb-6">
        <button
          onClick={() => setShowPrice(!showPrice)}
          className="flex items-center justify-between w-full text-left font-medium text-gray-800 mb-3"
        >
          <span>Price Range</span>
          {showPrice ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </button>
        {showPrice && (
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <input
                type="number"
                value={localPriceRange[0]}
                onChange={(e) => handlePriceChange(0, Number(e.target.value))}
                className="w-20 px-2 py-1 border border-gray-300 rounded text-sm"
                placeholder="Min"
              />
              <span className="text-gray-500">to</span>
              <input
                type="number"
                value={localPriceRange[1]}
                onChange={(e) => handlePriceChange(1, Number(e.target.value))}
                className="w-20 px-2 py-1 border border-gray-300 rounded text-sm"
                placeholder="Max"
              />
            </div>
            <div className="space-y-1">
              <input
                type="range"
                min="0"
                max="3000"
                value={localPriceRange[0]}
                onChange={(e) => handlePriceChange(0, Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <input
                type="range"
                min="0"
                max="3000"
                value={localPriceRange[1]}
                onChange={(e) => handlePriceChange(1, Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
            </div>
            <div className="text-sm text-gray-600">
              ${localPriceRange[0]} - ${localPriceRange[1]}
            </div>
          </div>
        )}
      </div>

      {/* Rating */}
      <div className="mb-6">
        <button
          onClick={() => setShowRating(!showRating)}
          className="flex items-center justify-between w-full text-left font-medium text-gray-800 mb-3"
        >
          <span>Customer Rating</span>
          {showRating ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </button>
        {showRating && (
          <div className="space-y-2">
            {[4, 3, 2, 1].map(rating => (
              <label key={rating} className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  name="rating"
                  checked={selectedRating === rating}
                  onChange={() => onRatingChange(rating)}
                  className="text-blue-600 focus:ring-blue-500"
                />
                <div className="flex items-center space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <span
                      key={i}
                      className={`text-sm ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`}
                    >
                      ★
                    </span>
                  ))}
                  <span className="text-sm text-gray-600">& Up</span>
                </div>
              </label>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductFilters;
