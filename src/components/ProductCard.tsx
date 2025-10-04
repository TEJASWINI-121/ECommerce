import React, { memo, useCallback, useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Star, Heart, ShoppingCart } from 'lucide-react';
import { toast } from 'react-toastify';
import { useInView } from 'react-intersection-observer';
import { RootState, AppDispatch } from '../store/store';
import { addToCart } from '../store/slices/cartSlice';
import { addToWishlist, removeFromWishlist, getWishlist } from '../store/slices/wishlistSlice';
import { addToRecentlyViewed } from '../utils/localStorage';
import {
  addToSimpleCart,
  addToSimpleWishlist,
  removeFromSimpleWishlist,
  isInSimpleWishlist
} from '../utils/simpleCart';

interface Product {
  _id: string;
  name: string;
  price: number;
  originalPrice?: number;
  images: string[];
  rating: number;
  numReviews: number;
  brand: string;
  category: string;
  stock: number;
}

interface ProductCardProps {
  product: Product;
  viewMode?: 'grid' | 'list';
}

const ProductCard: React.FC<ProductCardProps> = ({ product, viewMode = 'grid' }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1
  });

  const discountPercentage = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  // Check if product is in wishlist
  useEffect(() => {
    setIsInWishlist(isInSimpleWishlist(product._id));
  }, [product._id]);

  const handleWishlistToggle = useCallback(async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // Use both localStorage and Redux for consistency
    try {
      if (isInWishlist) {
        const success = removeFromSimpleWishlist(product._id);
        if (success) {
          setIsInWishlist(false);
          dispatch(removeFromWishlist(product._id));
        }
      } else {
        const success = addToSimpleWishlist(product);
        if (success) {
          setIsInWishlist(true);
          dispatch(addToWishlist(product));
        }
      }
    } catch (error) {
      console.error('Wishlist error:', error);
      toast.error('Failed to update wishlist');
    }
  }, [isInWishlist, product, dispatch]);

  const handleProductClick = useCallback(() => {
    addToRecentlyViewed(product);
  }, [product]);

  const handleAddToCart = useCallback(async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (product.stock > 0) {
      try {
        // Use Redux cart system for consistency
        await dispatch(addToCart({
          productId: product._id,
          quantity: 1,
          product: product
        })).unwrap();
        toast.success('Added to cart!');
      } catch (error: any) {
        console.error('Cart error:', error);
        // Fallback to simple cart if Redux fails
        const success = addToSimpleCart(product);
        if (success) {
          toast.success('Added to cart!');
        } else {
          toast.error('Failed to add to cart');
        }
      }
    } else {
      toast.error('Product is out of stock');
    }
  }, [product, dispatch]);

  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 group overflow-hidden transform hover:-translate-y-1 border border-gray-100">
      <div className="relative overflow-hidden">
        <Link to={`/product/${product._id}`} onClick={handleProductClick}>
          <div ref={ref} className="relative w-full h-64">
            {inView ? (
              <>
                {!imageLoaded && (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                    <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                  </div>
                )}
                <img
                  src={product.images[0]}
                  alt={product.name}
                  className={`w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
                  loading="lazy"
                  onLoad={() => setImageLoaded(true)}
                  onError={(e) => {
                    // Fallback to a placeholder image if the original fails to load
                    const target = e.target as HTMLImageElement;
                    target.src = `https://via.placeholder.com/600x600/f3f4f6/9ca3af?text=${encodeURIComponent(product.name.split(' ')[0])}`;
                  }}
                />
              </>
            ) : (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                <div className="w-32 h-32 bg-gray-200 animate-pulse rounded"></div>
              </div>
            )}
          </div>
        </Link>

        {discountPercentage > 0 && (
          <span className="absolute top-3 left-3 bg-gradient-to-r from-red-500 to-pink-500 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
            -{discountPercentage}% OFF
          </span>
        )}

        {/* New Badge */}
        <span className="absolute top-3 right-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-2 py-1 rounded-full text-xs font-bold shadow-lg">
          NEW
        </span>

        <button
          onClick={handleWishlistToggle}
          className="absolute top-12 right-3 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-white hover:scale-110"
        >
          <Heart className={`h-4 w-4 transition-colors ${
            isInWishlist ? 'text-red-500 fill-red-500' : 'text-gray-400 hover:text-red-500'
          }`} />
        </button>

        {/* Stock Status */}
        {product.stock === 0 && (
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center">
            <span className="text-white font-semibold bg-red-500 px-4 py-2 rounded-lg shadow-lg">Out of Stock</span>
          </div>
        )}

        {/* Quick View Overlay */}
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <Link
            to={`/product/${product._id}`}
            className="bg-white text-gray-800 px-4 py-2 rounded-lg font-medium shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 hover:bg-gray-50"
          >
            Quick View
          </Link>
        </div>
      </div>

      <div className="p-4">
        <div className="text-sm text-gray-500 mb-1">
          {product.brand} • {product.category.replace('-', ' ').toUpperCase()}
        </div>
        
        <Link
          to={`/product/${product._id}`}
          className="block hover:text-blue-600 transition-colors"
        >
          <h3 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-2">
            {product.name}
          </h3>
        </Link>

        <div className="flex items-center mb-2">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-4 w-4 ${
                  i < Math.floor(product.rating)
                    ? 'text-yellow-400 fill-current'
                    : 'text-gray-300'
                }`}
              />
            ))}
          </div>
          <span className="ml-2 text-sm text-gray-600">
            {product.rating} ({product.numReviews})
          </span>
        </div>

        <div className="flex items-center justify-between mb-4">
          <div className="flex flex-col">
            <div className="flex items-center space-x-2">
              <span className="text-2xl font-bold text-blue-600">
                ${product.price.toFixed(2)}
              </span>
              {product.originalPrice && (
                <span className="text-sm text-gray-500 line-through">
                  ${product.originalPrice.toFixed(2)}
                </span>
              )}
            </div>
            {discountPercentage > 0 && (
              <span className="text-sm text-green-600 font-medium">
                Save ${(product.originalPrice! - product.price).toFixed(2)}
              </span>
            )}
          </div>
        </div>

        {/* Add to Cart Button */}
        <div className="mt-4">
          {product.stock > 0 ? (
            <button
              onClick={handleAddToCart}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 px-4 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 flex items-center justify-center space-x-2 font-medium shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              <ShoppingCart className="h-4 w-4" />
              <span>Add to Cart</span>
            </button>
          ) : (
            <button
              disabled
              className="w-full bg-gray-400 text-white py-3 px-4 rounded-lg cursor-not-allowed flex items-center justify-center space-x-2 font-medium opacity-60"
            >
              <span>Out of Stock</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default memo(ProductCard);