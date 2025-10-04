import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';
import { toast } from 'react-toastify';
import { RootState, AppDispatch } from '../store/store';
import { getCart, addToCart, removeFromCart } from '../store/slices/cartSlice';
import { getSimpleCart, updateSimpleCartQuantity, removeFromSimpleCart, SimpleCartItem } from '../utils/simpleCart';

const CartPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const { items: reduxItems, isLoading } = useSelector((state: RootState) => state.cart);
  const { user } = useSelector((state: RootState) => state.auth);
  const [guestCartItems, setGuestCartItems] = useState<SimpleCartItem[]>([]);

  useEffect(() => {
    if (user) {
      dispatch(getCart());
    } else {
      // Load guest cart from localStorage
      setGuestCartItems(getSimpleCart());
    }
  }, [dispatch, user]);

  // Use Redux cart for logged-in users, simple cart for guests
  const items = user ? reduxItems : guestCartItems.map(item => ({
    product: {
      _id: item._id,
      name: item.name,
      price: item.price,
      images: item.images,
      stock: item.stock
    },
    quantity: item.quantity
  }));

  const updateQuantity = async (productId: string, quantity: number) => {
    try {
      if (user) {
        await dispatch(addToCart({ productId, quantity })).unwrap();
      } else {
        // Update guest cart
        updateSimpleCartQuantity(productId, quantity);
        setGuestCartItems(getSimpleCart());
      }
    } catch (error) {
      toast.error('Failed to update cart');
    }
  };

  const removeItem = async (productId: string) => {
    try {
      if (user) {
        await dispatch(removeFromCart(productId)).unwrap();
      } else {
        // Remove from guest cart
        removeFromSimpleCart(productId);
        setGuestCartItems(getSimpleCart());
      }
      toast.success('Item removed from cart');
    } catch (error) {
      toast.error('Failed to remove item');
    }
  };

  const subtotal = items.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const tax = subtotal * 0.08; // 8% tax
  const shipping = subtotal > 50 ? 0 : 10; // Free shipping over $50
  const total = subtotal + tax + shipping;

  // Remove login requirement - cart should work for guests too

  if (items.length === 0 && !isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <ShoppingBag className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Your cart is empty</h2>
            <p className="text-gray-600 mb-6">Looks like you haven't added any items to your cart yet.</p>
            <Link
              to="/"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Start Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Shopping Cart</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md">
              <div className="p-6">
                <h2 className="text-xl font-semibold mb-4">Cart Items ({items.length})</h2>
                <div className="space-y-4">
                  {items.map((item) => (
                    <div key={item.product._id} className="flex items-center space-x-4 p-4 border rounded-lg">
                      <img
                        src={item.product.images[0]}
                        alt={item.product.name}
                        className="w-20 h-20 object-cover rounded-lg"
                      />
                      
                      <div className="flex-1">
                        <Link
                          to={`/product/${item.product._id}`}
                          className="text-lg font-semibold text-gray-800 hover:text-blue-600"
                        >
                          {item.product.name}
                        </Link>
                        <p className="text-gray-600">
                          ${item.product.price.toFixed(2)} each
                        </p>
                        <p className="text-sm text-gray-500">
                          In Stock: {item.product.stock}
                        </p>
                      </div>

                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => updateQuantity(item.product._id, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                          className="p-1 rounded-md border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                        <span className="px-3 py-1 font-medium">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.product._id, item.quantity + 1)}
                          disabled={item.quantity >= item.product.stock}
                          className="p-1 rounded-md border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>

                      <div className="text-right">
                        <p className="text-lg font-semibold text-gray-800">
                          ${(item.product.price * item.quantity).toFixed(2)}
                        </p>
                        <button
                          onClick={() => removeItem(item.product._id)}
                          className="mt-2 text-red-600 hover:text-red-800 transition-colors"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
              <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>Subtotal ({items.length} items)</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>{shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</span>
                </div>
                
                <div className="flex justify-between">
                  <span>Tax</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                
                <hr className="my-4" />
                
                <div className="flex justify-between text-lg font-semibold">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>

              {shipping > 0 && (
                <p className="text-sm text-blue-600 mt-3">
                  Add ${(50 - subtotal).toFixed(2)} more for free shipping!
                </p>
              )}

              <button
                onClick={() => navigate('/checkout')}
                className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors mt-6 font-medium"
              >
                Proceed to Checkout
              </button>

              <Link
                to="/"
                className="block text-center text-blue-600 hover:text-blue-700 mt-4 transition-colors"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;