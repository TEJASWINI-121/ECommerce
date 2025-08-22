import React, { memo, useCallback, useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';
import { toast } from 'react-toastify';
import { RootState, AppDispatch } from '../store/store';
import { updateCartItem, removeFromCart } from '../store/slices/cartSlice';
import {
  getSimpleCart,
  updateSimpleCartQuantity,
  removeFromSimpleCart,
  clearSimpleCart,
  getSimpleCartTotal
} from '../utils/simpleCart';

const FastCart: React.FC = memo(() => {
  const dispatch = useDispatch<AppDispatch>();
  const { items, isLoading } = useSelector((state: RootState) => state.cart);
  const [simpleCartItems, setSimpleCartItems] = useState(getSimpleCart());

  // Update simple cart items when component mounts or storage changes
  useEffect(() => {
    const updateCartItems = () => {
      setSimpleCartItems(getSimpleCart());
    };

    updateCartItems();

    // Listen for storage changes
    window.addEventListener('storage', updateCartItems);

    // Also update on interval for same-tab changes
    const interval = setInterval(updateCartItems, 1000);

    return () => {
      window.removeEventListener('storage', updateCartItems);
      clearInterval(interval);
    };
  }, []);

  const handleUpdateQuantity = useCallback(async (productId: string, quantity: number) => {
    if (quantity < 1) return;

    console.log('🔄 Updating quantity:', productId, quantity);

    // Update simple cart first
    const success = updateSimpleCartQuantity(productId, quantity);
    if (success) {
      setSimpleCartItems(getSimpleCart());

      // Also try to update Redux state
      try {
        dispatch(updateCartItem({ productId, quantity }));
      } catch (error) {
        console.log('Redux update failed, but localStorage worked:', error);
      }
    } else {
      toast.error('Failed to update quantity');
    }
  }, [dispatch]);

  const handleRemoveItem = useCallback(async (productId: string) => {
    console.log('🗑️ Removing item:', productId);

    // Remove from simple cart first
    const success = removeFromSimpleCart(productId);
    if (success) {
      setSimpleCartItems(getSimpleCart());

      // Also try to update Redux state
      try {
        dispatch(removeFromCart(productId));
      } catch (error) {
        console.log('Redux update failed, but localStorage worked:', error);
      }
    }
  }, [dispatch]);

  // Use simple cart for calculations
  const subtotal = simpleCartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const displayItems = simpleCartItems.length > 0 ? simpleCartItems : items;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (displayItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <ShoppingBag className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Your cart is empty</h2>
          <p className="text-gray-600 mb-6">Add some amazing products to get started!</p>
          <Link
            to="/"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Shopping Cart</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {displayItems.map((item) => {
              // Handle both simple cart items and redux cart items
              const isSimpleItem = !item.product;
              const productData = isSimpleItem ? item : item.product;
              const quantity = isSimpleItem ? item.quantity : item.quantity;

              return (
                <div key={productData._id} className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex items-center space-x-4">
                    <img
                      src={productData.images[0]}
                      alt={productData.name}
                      className="w-20 h-20 object-cover rounded-lg"
                      loading="lazy"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = `https://via.placeholder.com/80x80/f3f4f6/9ca3af?text=${encodeURIComponent(productData.name.split(' ')[0])}`;
                      }}
                    />

                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-800">{productData.name}</h3>
                      <p className="text-sm text-gray-600">{productData.brand}</p>
                      <p className="text-lg font-bold text-blue-600">${productData.price}</p>
                    </div>
                  
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleUpdateQuantity(productData._id, quantity - 1)}
                        className="p-1 rounded-full hover:bg-gray-100 transition-colors"
                        disabled={quantity <= 1}
                      >
                        <Minus className="h-4 w-4" />
                      </button>

                      <span className="w-8 text-center font-medium">{quantity}</span>

                      <button
                        onClick={() => handleUpdateQuantity(productData._id, quantity + 1)}
                        className="p-1 rounded-full hover:bg-gray-100 transition-colors"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>

                    <button
                      onClick={() => handleRemoveItem(productData._id)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
          
          {/* Order Summary */}
          <div className="bg-white rounded-lg shadow-md p-6 h-fit">
            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
            
            <div className="space-y-2 mb-4">
              <div className="flex justify-between">
                <span>Subtotal ({displayItems.length} items)</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>Free</span>
              </div>
              <div className="flex justify-between">
                <span>Tax</span>
                <span>${(subtotal * 0.08).toFixed(2)}</span>
              </div>
              <div className="border-t pt-2">
                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>${(subtotal * 1.08).toFixed(2)}</span>
                </div>
              </div>
            </div>
            
            <Link
              to="/checkout"
              className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors font-medium text-center block"
            >
              Proceed to Checkout
            </Link>
            
            <Link
              to="/"
              className="w-full bg-gray-100 text-gray-700 py-3 px-6 rounded-lg hover:bg-gray-200 transition-colors font-medium text-center block mt-3"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
});

FastCart.displayName = 'FastCart';

export default FastCart;
