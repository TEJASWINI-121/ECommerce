import React, { useEffect, useState, useCallback, Suspense } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams, Link } from 'react-router-dom';
import {
  ChevronLeft,
  ChevronRight,
  Filter,
  Smartphone,
  Shirt,
  ShoppingBag,
  Home,
  Sparkles,
  Dumbbell,
  Apple
} from 'lucide-react';
import { RootState, AppDispatch } from '../store/store';
import { getProducts, getTopProducts } from '../store/slices/productSlice';
import ProductCard from '../components/ProductCard';
import Loader from '../components/Loader';
import { useInView } from 'react-intersection-observer';
import { PRODUCT_CATEGORIES, getCategoryDisplayName, sortProductsInCategory } from '../utils/categoryManager';


const categories = [
  { value: '', label: 'All Categories', icon: ShoppingBag },
  { value: 'electronics', label: 'Electronics', icon: Smartphone },
  { value: 'clothing', label: 'Fashion & Clothing', icon: Shirt },
  { value: 'beauty', label: 'Beauty & Personal Care', icon: Sparkles },
  { value: 'home-decor', label: 'Home & Kitchen', icon: Home },
  { value: 'sports', label: 'Sports & Fitness', icon: Dumbbell },
];

const promotionalBanners = [
  {
    id: 1,
    title: 'Mega Electronics Sale',
    subtitle: 'Up to 70% OFF on Smartphones & Laptops',
    description: 'Limited time offer - Ends Jan 31st',
    image: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800&h=400&fit=crop',
    bgColor: 'bg-gradient-to-r from-blue-600 to-purple-600',
    textColor: 'text-white',
    buttonText: 'Shop Electronics',
    category: 'Electronics'
  },
  {
    id: 2,
    title: 'Fashion Week Special',
    subtitle: 'New Arrivals - Trending Styles',
    description: 'Free shipping on orders above $50',
    image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=400&fit=crop',
    bgColor: 'bg-gradient-to-r from-pink-500 to-rose-500',
    textColor: 'text-white',
    buttonText: 'Explore Fashion',
    category: 'Fashion'
  },
  {
    id: 3,
    title: 'Beauty Bonanza',
    subtitle: 'Premium Skincare & Makeup',
    description: 'Buy 2 Get 1 Free on selected items',
    image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=800&h=400&fit=crop',
    bgColor: 'bg-gradient-to-r from-purple-500 to-pink-500',
    textColor: 'text-white',
    buttonText: 'Shop Beauty',
    category: 'Beauty'
  }
];

const flashDeals = [
  { id: 1, discount: '50%', timeLeft: '2h 30m', category: 'Electronics' },
  { id: 2, discount: '40%', timeLeft: '5h 15m', category: 'Fashion' },
  { id: 3, discount: '60%', timeLeft: '1h 45m', category: 'Beauty' },
  { id: 4, discount: '35%', timeLeft: '8h 20m', category: 'Home & Kitchen' }
];

const HomePage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '');
  const [currentPage, setCurrentPage] = useState(Number(searchParams.get('page')) || 1);
  const [showFilters, setShowFilters] = useState(false);
  const [currentBanner, setCurrentBanner] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  const dispatch = useDispatch<AppDispatch>();
  const { products, topProducts, isLoading, page, pages, count } = useSelector((state: RootState) => state.products);
  
  // Organize products by categories
  const organizedProducts = React.useMemo(() => {
    if (!products.length) return [];
    
    // If a category is selected, just return the filtered products
    if (selectedCategory) {
      return sortProductsInCategory(products, 'popularity');
    }
    
    // Otherwise, group products by category for better organization
    const productsByCategory: any[] = [];
    
    // Create category headers and product groups
    PRODUCT_CATEGORIES.forEach(category => {
      const categoryProducts = products.filter(p => p.category.toLowerCase() === category.toLowerCase());
      
      if (categoryProducts.length > 0) {
        // Add category header
        productsByCategory.push({
          isHeader: true,
          category,
          displayName: getCategoryDisplayName(category)
        });
        
        // Add sorted products
        const sortedProducts = sortProductsInCategory(categoryProducts, 'popularity');
        productsByCategory.push(...sortedProducts);
      }
    });
    
    return productsByCategory;
  }, [products, selectedCategory]);

  // Auto-rotate banners
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBanner((prev) => (prev + 1) % promotionalBanners.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const keyword = searchParams.get('keyword') || '';
  
  // Use intersection observer for lazy loading
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: false
  });

  // Load top products on initial render
  useEffect(() => {
    dispatch(getTopProducts());
  }, [dispatch]);
  
  // Load products when category changes or on initial load
  useEffect(() => {
    dispatch(getProducts({ pageNumber: 1, keyword, category: selectedCategory }));
    setCurrentPage(1);
  }, [dispatch, selectedCategory, keyword]);
  
  // Load more products when user scrolls to the bottom and there are more pages
  useEffect(() => {
    if (inView && currentPage < pages) {
      dispatch(getProducts({ pageNumber: currentPage + 1, keyword, category: selectedCategory }));
      setCurrentPage(prev => prev + 1);
    }
    
    // Update hasMore state based on pagination info
    if (currentPage >= pages) {
      setHasMore(false);
    } else {
      setHasMore(true);
    }
  }, [inView, dispatch, currentPage, pages, keyword, selectedCategory]);

  useEffect(() => {
    dispatch(getProducts({
      pageNumber: currentPage,
      keyword: keyword,
      category: selectedCategory
    }));
  }, [dispatch, currentPage, keyword, selectedCategory]);

  // Update URL params when page or category changes
  useEffect(() => {
    const params = new URLSearchParams();
    if (keyword) params.set('keyword', keyword);
    if (selectedCategory) params.set('category', selectedCategory);
    if (currentPage > 1) params.set('page', currentPage.toString());
    setSearchParams(params);
  }, [keyword, selectedCategory, currentPage, setSearchParams]);

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setCurrentPage(1);
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };



  if (isLoading && products.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader size="lg" />
          <p className="mt-4 text-gray-600">Loading products...</p>
        </div>
      </div>
    );
  }

  // If no products and not loading, show fallback
  if (!isLoading && products.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">No Products Found</h2>
          <p className="text-gray-600 mb-6">We're having trouble loading products. Please try refreshing the page.</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Refresh Page
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Promotional Banner Carousel */}
      {!keyword && !selectedCategory && currentPage === 1 && (
        <section className="relative h-96 overflow-hidden">
          {promotionalBanners.map((banner, index) => (
            <div
              key={banner.id}
              className={`absolute inset-0 transition-transform duration-500 ease-in-out ${
                index === currentBanner ? 'translate-x-0' :
                index < currentBanner ? '-translate-x-full' : 'translate-x-full'
              }`}
            >
              <div className={`${banner.bgColor} h-full flex items-center`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                  <div className={banner.textColor}>
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">
                      {banner.title}
                    </h1>
                    <p className="text-xl md:text-2xl mb-2 opacity-90">
                      {banner.subtitle}
                    </p>
                    <p className="text-lg mb-6 opacity-80">
                      {banner.description}
                    </p>
                    <Link
                      to={`/products?category=${banner.category}`}
                      className="inline-block bg-white text-gray-800 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
                    >
                      {banner.buttonText}
                    </Link>
                  </div>
                  <div className="hidden lg:block">
                    <img
                      src={banner.image}
                      alt={banner.title}
                      className="w-full h-64 object-cover rounded-lg shadow-lg"
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Banner Navigation Dots */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
            {promotionalBanners.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentBanner(index)}
                className={`w-3 h-3 rounded-full transition-colors ${
                  index === currentBanner ? 'bg-white' : 'bg-white/50'
                }`}
              />
            ))}
          </div>
        </section>
      )}

      {/* Flash Deals Section */}
      {!keyword && !selectedCategory && currentPage === 1 && (
        <section className="py-8 bg-red-50 border-y-2 border-red-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-red-600 flex items-center">
                <Sparkles className="h-6 w-6 mr-2" />
                Flash Deals
              </h2>
              <div className="text-sm text-red-600 font-medium">
                Limited Time Offers!
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {flashDeals.map((deal) => (
                <Link
                  key={deal.id}
                  to={`/products?category=${deal.category}`}
                  className="bg-white rounded-lg p-4 text-center hover:shadow-lg transition-shadow border-2 border-red-200"
                >
                  <div className="text-2xl font-bold text-red-600 mb-1">
                    {deal.discount} OFF
                  </div>
                  <div className="text-sm text-gray-600 mb-2">{deal.category}</div>
                  <div className="text-xs text-red-500 font-medium">
                    Ends in {deal.timeLeft}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Category Navigation */}
      {!keyword && !selectedCategory && currentPage === 1 && (
        <section className="py-12 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-center mb-8 text-gray-800">
              Shop by Category
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {categories.slice(1).map((category) => {
                const IconComponent = category.icon;
                return (
                  <Link
                    key={category.value}
                    to={`/products?category=${category.value}`}
                    className="group flex flex-col items-center p-6 bg-gray-50 rounded-lg hover:bg-blue-50 hover:shadow-md transition-all duration-200"
                  >
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-3 group-hover:bg-blue-200 transition-colors">
                      <IconComponent className="h-8 w-8 text-blue-600" />
                    </div>
                    <span className="text-sm font-medium text-gray-700 group-hover:text-blue-600 transition-colors text-center">
                      {category.label}
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Top Products Carousel */}
      {!keyword && !selectedCategory && currentPage === 1 && topProducts.length > 0 && (
        <section className="py-12 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-gray-800">
                🔥 Top Rated Products
              </h2>
              <Link to="/products" className="text-blue-600 hover:text-blue-700 font-medium">
                View All →
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {topProducts.slice(0, 10).map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Electronics Section */}
      {!keyword && !selectedCategory && currentPage === 1 && (
        <section className="py-12 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-gray-800">
                📱 Electronics & Gadgets
              </h2>
              <Link to="/products?category=Electronics" className="text-blue-600 hover:text-blue-700 font-medium">
                View All →
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {products.filter(p => p.category === 'Electronics').slice(0, 10).map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Fashion Section */}
      {!keyword && !selectedCategory && currentPage === 1 && (
        <section className="py-12 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-gray-800">
                👗 Fashion & Style
              </h2>
              <Link to="/products?category=Fashion" className="text-blue-600 hover:text-blue-700 font-medium">
                View All →
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {products.filter(p => p.category === 'Fashion').slice(0, 10).map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Beauty Section */}
      {!keyword && !selectedCategory && currentPage === 1 && (
        <section className="py-12 bg-pink-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-gray-800">
                💄 Beauty & Personal Care
              </h2>
              <Link to="/products?category=Beauty" className="text-blue-600 hover:text-blue-700 font-medium">
                View All →
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {products.filter(p => p.category === 'Beauty').slice(0, 10).map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Main Products Section */}
      <section id="products" className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-800 mb-2">
                {keyword ? `Search results for "${keyword}"` : 'All Products'}
              </h2>
              <p className="text-gray-600">
                Showing {products.length} of {count} products
              </p>
            </div>
            
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="md:hidden flex items-center space-x-2 bg-white px-4 py-2 rounded-lg shadow-md mt-4"
            >
              <Filter className="h-5 w-5" />
              <span>Filters</span>
            </button>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Filters Sidebar */}
            <div className={`lg:w-64 ${showFilters ? 'block' : 'hidden lg:block'}`}>
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold mb-4">Categories</h3>
                <div className="space-y-2">
                  {categories.map((category) => (
                    <button
                      key={category.value}
                      onClick={() => handleCategoryChange(category.value)}
                      className={`block w-full text-left px-3 py-2 rounded-md transition-colors ${
                        selectedCategory === category.value
                          ? 'bg-blue-100 text-blue-700 font-medium'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      {category.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Products Grid */}
            <div className="flex-1">
              {isLoading ? (
                <div className="flex justify-center py-12">
                  <Loader size="lg" />
                </div>
              ) : products.length > 0 ? (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
                    {selectedCategory ? (
                      // Regular product grid for selected category
                      organizedProducts.map((product, index) => (
                        <div key={product._id}>
                          <ProductCard product={product} />
                          {/* Add intersection observer reference to the last product */}
                          {index === organizedProducts.length - 4 && <div ref={ref} />}
                        </div>
                      ))
                    ) : (
                      // Organized by category sections
                      organizedProducts.map((item, index) => {
                        if (item.isHeader) {
                          // Category header
                          return (
                            <div key={`header-${item.category}`} className="col-span-full mt-8 mb-4">
                              <h3 className="text-xl font-bold text-gray-800 flex items-center">
                                {item.displayName}
                                <Link to={`/products?category=${item.category}`} className="ml-auto text-sm text-blue-500 hover:underline">
                                  View All →
                                </Link>
                              </h3>
                              <div className="h-1 w-20 bg-blue-500 mt-2"></div>
                            </div>
                          );
                        } else {
                          // Product card
                          return (
                            <div key={item._id}>
                              <ProductCard product={item} />
                              {index === organizedProducts.length - 4 && <div ref={ref} />}
                            </div>
                          );
                        }
                      })
                    )}
                  </div>

                  {/* Loading indicator for infinite scroll */}
                  {isLoading && products.length > 0 && (
                    <div className="flex justify-center mt-8">
                      <Loader size="lg" />
                    </div>
                  )}
                  
                  {/* Show message when all products are loaded */}
                  {!isLoading && currentPage >= pages && products.length > 0 && (
                    <div className="text-center mt-8 text-gray-600">
                      No more products to load
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-12">
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">
                    No products found
                  </h3>
                  <p className="text-gray-600">
                    Try adjusting your search or filter criteria.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;