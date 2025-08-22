import React, { memo, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Star, ShoppingCart } from 'lucide-react';
import { toast } from 'react-toastify';
import { RootState, AppDispatch } from '../store/store';
import { addToCart } from '../store/slices/cartSlice';
import { Product } from '../types';

interface FastProductListProps {
  products: Product[];
  isLoading: boolean;
}

const FastProductCard = memo(({ product }: { product: Product }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);

  const handleAddToCart = useCallback(async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!user) {
      toast.error('Please login to add items to cart');
      navigate('/login');
      return;
    }

    if (product.stock > 0) {
      try {
        await dispatch(addToCart({ productId: product._id, quantity: 1 })).unwrap();
        toast.success('Added to cart!');
      } catch (error: any) {
        toast.error(error || 'Failed to add to cart');
      }
    } else {
      toast.error('Product is out of stock');
    }
  }, [dispatch, product._id, product.stock, user, navigate]);

  const handleProductClick = useCallback(() => {
    navigate(`/product/${product._id}`);
  }, [navigate, product._id]);

  return (
    <div 
      className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
      onClick={handleProductClick}
    >
      <div className="relative">
        <img
          src={product.images[0]}
          alt={product.name}
          className="w-full h-48 object-cover"
          loading="lazy"
        />
        {product.originalPrice > product.price && (
          <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded text-sm font-medium">
            {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
          </div>
        )}
        {product.featured && (
          <div className="absolute top-2 right-2 bg-blue-500 text-white px-2 py-1 rounded text-sm font-medium">
            Featured
          </div>
        )}
      </div>
      
      <div className="p-4">
        <div className="mb-2">
          <h3 className="font-semibold text-gray-800 line-clamp-2 mb-1">{product.name}</h3>
          <p className="text-sm text-gray-600">{product.brand}</p>
        </div>
        
        <div className="flex items-center mb-2">
          <div className="flex items-center">
            <Star className="h-4 w-4 text-yellow-400 fill-current" />
            <span className="text-sm text-gray-600 ml-1">
              {product.rating} ({product.numReviews})
            </span>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-lg font-bold text-blue-600">${product.price}</span>
            {product.originalPrice > product.price && (
              <span className="text-sm text-gray-500 line-through">${product.originalPrice}</span>
            )}
          </div>
          
          <button
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            <ShoppingCart className="h-4 w-4" />
          </button>
        </div>
        
        {product.stock < 10 && product.stock > 0 && (
          <p className="text-sm text-orange-600 mt-2">Only {product.stock} left!</p>
        )}
        {product.stock === 0 && (
          <p className="text-sm text-red-600 mt-2">Out of stock</p>
        )}
      </div>
    </div>
  );
});

FastProductCard.displayName = 'FastProductCard';

const FastProductList: React.FC<FastProductListProps> = memo(({ products, isLoading }) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, index) => (
          <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
            <div className="w-full h-48 bg-gray-300"></div>
            <div className="p-4">
              <div className="h-4 bg-gray-300 rounded mb-2"></div>
              <div className="h-3 bg-gray-300 rounded mb-2 w-2/3"></div>
              <div className="h-3 bg-gray-300 rounded mb-2 w-1/2"></div>
              <div className="flex justify-between items-center">
                <div className="h-4 bg-gray-300 rounded w-1/3"></div>
                <div className="h-8 w-8 bg-gray-300 rounded"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-xl font-semibold text-gray-800 mb-2">No products found</h3>
        <p className="text-gray-600">Try adjusting your search or filters</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {products.map((product) => (
        <FastProductCard key={product._id} product={product} />
      ))}
    </div>
  );
});

FastProductList.displayName = 'FastProductList';

export default FastProductList;
