import React, { useState, useRef, useEffect } from 'react';
import { Search, X, Clock, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({ 
  onSearch, 
  placeholder = "Search for products, brands and more..." 
}) => {
  const [query, setQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const searchRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Popular search suggestions
  const popularSearches = [
    'iPhone 15 Pro',
    'MacBook Pro',
    'Nike Air Max',
    'Samsung Galaxy',
    'AirPods Pro',
    'Levi\'s Jeans',
    'Fenty Beauty',
    'Apple Watch',
    'Sony Headphones',
    'Zara Dress'
  ];

  useEffect(() => {
    // Load recent searches from localStorage
    const saved = localStorage.getItem('recentSearches');
    if (saved) {
      setRecentSearches(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (searchQuery: string) => {
    if (searchQuery.trim()) {
      // Add to recent searches
      const updatedRecent = [searchQuery, ...recentSearches.filter(s => s !== searchQuery)].slice(0, 5);
      setRecentSearches(updatedRecent);
      localStorage.setItem('recentSearches', JSON.stringify(updatedRecent));
      
      onSearch(searchQuery);
      setQuery(searchQuery);
      setShowSuggestions(false);
      
      // Navigate to products page with search
      navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch(query);
  };

  const clearSearch = () => {
    setQuery('');
    onSearch('');
    setShowSuggestions(false);
  };

  const removeRecentSearch = (searchToRemove: string) => {
    const updated = recentSearches.filter(s => s !== searchToRemove);
    setRecentSearches(updated);
    localStorage.setItem('recentSearches', JSON.stringify(updated));
  };

  return (
    <div ref={searchRef} className="relative flex-1 max-w-2xl">
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setShowSuggestions(true)}
            placeholder={placeholder}
            className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
          />
          {query && (
            <button
              type="button"
              onClick={clearSearch}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 hover:text-gray-600"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </form>

      {/* Search Suggestions Dropdown */}
      {showSuggestions && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
          {/* Recent Searches */}
          {recentSearches.length > 0 && (
            <div className="p-4 border-b border-gray-100">
              <div className="flex items-center space-x-2 mb-3">
                <Clock className="h-4 w-4 text-gray-400" />
                <span className="text-sm font-medium text-gray-700">Recent Searches</span>
              </div>
              <div className="space-y-2">
                {recentSearches.map((search, index) => (
                  <div key={index} className="flex items-center justify-between group">
                    <button
                      onClick={() => handleSearch(search)}
                      className="flex-1 text-left text-sm text-gray-600 hover:text-blue-600 py-1"
                    >
                      {search}
                    </button>
                    <button
                      onClick={() => removeRecentSearch(search)}
                      className="opacity-0 group-hover:opacity-100 p-1 hover:bg-gray-100 rounded"
                    >
                      <X className="h-3 w-3 text-gray-400" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Popular Searches */}
          <div className="p-4">
            <div className="flex items-center space-x-2 mb-3">
              <TrendingUp className="h-4 w-4 text-gray-400" />
              <span className="text-sm font-medium text-gray-700">Popular Searches</span>
            </div>
            <div className="space-y-2">
              {popularSearches
                .filter(search => search.toLowerCase().includes(query.toLowerCase()))
                .slice(0, 8)
                .map((search, index) => (
                  <button
                    key={index}
                    onClick={() => handleSearch(search)}
                    className="block w-full text-left text-sm text-gray-600 hover:text-blue-600 hover:bg-gray-50 py-2 px-2 rounded"
                  >
                    {search}
                  </button>
                ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchBar;
