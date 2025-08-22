import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, ShoppingCart, Trash2, ArrowLeft } from 'lucide-react';
import { toast } from 'react-toastify';
import { RootState, AppDispatch } from '../store/store';
import { addToCart } from '../store/slices/cartSlice';
import { getWishlistFromStorage, removeFromWishlist, saveWishlistToStorage } from '../utils/localStorage';

interface WishlistItem {
  _id: string;
  name: string;
  price: number;
  images: string[];
  rating: number;
  reviews: number;
  brand: string;
  category: string;
  stock: number;
  sellerId: string;
  sellerName: string;
}

const WishlistPage: React.FC = () => {
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { user } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    // Load wishlist from localStorage
    const wishlist = getWishlistFromStorage();
    setWishlistItems(wishlist);
  }, [user, navigate]);

  const handleRemoveFromWishlist = (productId: string) => {
    const success = removeFromWishlist(productId);
    if (success) {
      setWishlistItems(prev => prev.filter(item => item._id !== productId));
      toast.success('Removed from wishlist');
    }
  };

  const handleAddToCart = async (product: WishlistItem) => {
    if (!user) {
      navigate('/login');
      return;
    }

    if (product.stock > 0) {
      try {
        await dispatch(addToCart({
          productId: product._id,
          quantity: 1,
          product: {
            _id: product._id,
            name: product.name,
            price: product.price,
            images: product.images,
            stock: product.stock,
            brand: product.brand
          }
        })).unwrap();
        toast.success('Added to cart!');
      } catch (error) {
        toast.error('Failed to add to cart');
      }
    } else {
      toast.error('Product is out of stock');
    }
  };

  const handleMoveToCart = async (product: WishlistItem) => {
    await handleAddToCart(product);
    handleRemoveFromWishlist(product._id);
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate(-1)}
              className="p-2 rounded-full bg-white shadow-md hover:shadow-lg transition-shadow"
            >
              <ArrowLeft className="h-5 w-5 text-gray-600" />
            </button>
            <div>
              <h1 className="text-3xl font-bold text-gray-800">My Wishlist</h1>
              <p className="text-gray-600 mt-1">
                {wishlistItems.length} {wishlistItems.length === 1 ? 'item' : 'items'}
              </p>
            </div>
          </div>
          <Heart className="h-8 w-8 text-red-500 fill-red-500" />
        </div>

        {wishlistItems.length === 0 ? (
          /* Empty Wishlist */
          <div className="text-center py-16">
            <div className="bg-white rounded-lg shadow-md p-12 max-w-md mx-auto">
              <Heart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h2 className="text-2xl font-semibold text-gray-800 mb-2">Your wishlist is empty</h2>
              <p className="text-gray-600 mb-6">
                Save items you love by clicking the heart icon on any product
              </p>
              <Link
                to="/products"
                className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
              >
                Start Shopping
              </Link>
            </div>
          </div>
        ) : (
          /* Wishlist Items */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {wishlistItems.map((item) => (
              <div key={item._id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow group">
                <div className="relative">
                  <Link to={`/product/${item._id}`}>
                    <img
                      src={item.images[0]}
                      alt={item.name}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = `https://via.placeholder.com/400x400/f3f4f6/9ca3af?text=${encodeURIComponent(item.name.split(' ')[0])}`;
                      }}
                    />
                  </Link>
                  
                  {/* Remove from Wishlist Button */}
                  <button
                    onClick={() => handleRemoveFromWishlist(item._id)}
                    className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-white hover:scale-110 transition-all duration-300"
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </button>

                  {/* Stock Status */}
                  {item.stock === 0 && (
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center">
                      <span className="text-white font-semibold bg-red-500 px-4 py-2 rounded-lg shadow-lg">Out of Stock</span>
                    </div>
                  )}
                </div>

                <div className="p-4">
                  <Link to={`/product/${item._id}`}>
                    <h3 className="font-semibold text-gray-800 mb-2 line-clamp-2 hover:text-blue-600 transition-colors">
                      {item.name}
                    </h3>
                  </Link>
                  
                  <div className="flex items-center space-x-1 mb-2">
                    {[...Array(5)].map((_, i) => (
                      <div
                        key={i}
                        className={`h-4 w-4 ${
                          i < Math.floor(item.rating) ? 'text-yellow-400' : 'text-gray-300'
                        }`}
                      >
                        ⭐
                      </div>
                    ))}
                    <span className="text-sm text-gray-600 ml-2">
                      ({item.reviews})
                    </span>
                  </div>

                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <span className="text-2xl font-bold text-gray-900">
                        ${item.price.toFixed(2)}
                      </span>
                      <p className="text-sm text-gray-600">{item.brand}</p>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-2">
                    <button
                      onClick={() => handleMoveToCart(item)}
                      disabled={item.stock === 0}
                      className="w-full flex items-center justify-center space-x-2 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                    >
                      <ShoppingCart className="h-4 w-4" />
                      <span>{item.stock === 0 ? 'Out of Stock' : 'Move to Cart'}</span>
                    </button>
                    
                    <button
                      onClick={() => handleAddToCart(item)}
                      disabled={item.stock === 0}
                      className="w-full border border-blue-600 text-blue-600 py-2 px-4 rounded-lg hover:bg-blue-50 disabled:border-gray-400 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors"
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Continue Shopping */}
        {wishlistItems.length > 0 && (
          <div className="text-center mt-12">
            <Link
              to="/products"
              className="inline-flex items-center px-6 py-3 bg-gray-800 text-white font-medium rounded-lg hover:bg-gray-900 transition-colors"
            >
              Continue Shopping
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default WishlistPage;
