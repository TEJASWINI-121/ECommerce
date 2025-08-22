import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { Bug, X, RefreshCw } from 'lucide-react';

const DebugPanel: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useSelector((state: RootState) => state.auth);
  const { items, isLoading, error } = useSelector((state: RootState) => state.cart);
  const { orders } = useSelector((state: RootState) => state.orders);

  // Get localStorage data
  const localStorageUser = localStorage.getItem('user');
  const parsedUser = localStorageUser ? JSON.parse(localStorageUser) : null;

  const localStorageCart = localStorage.getItem('cartItems');
  const parsedCart = localStorageCart ? JSON.parse(localStorageCart) : [];

  const localStorageOrders = localStorage.getItem('userOrders');
  const parsedOrders = localStorageOrders ? JSON.parse(localStorageOrders) : [];

  const handleClearAndReload = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('cartItems');
    localStorage.removeItem('userOrders');
    window.location.reload();
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed top-20 right-4 bg-gray-800 text-white p-2 rounded-full shadow-lg hover:bg-gray-700 transition-colors z-50"
        title="Open Debug Panel"
      >
        <Bug className="h-4 w-4" />
      </button>
    );
  }

  return (
    <div className="fixed top-20 right-4 bg-white border border-gray-300 rounded-lg shadow-xl p-4 max-w-sm z-50">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-bold text-gray-800 flex items-center">
          <Bug className="h-4 w-4 mr-2" />
          Debug Panel
        </h3>
        <button
          onClick={() => setIsOpen(false)}
          className="text-gray-500 hover:text-gray-700"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
      
      <div className="space-y-3">
        {/* Auth Debug */}
        <div className="bg-red-50 border border-red-200 rounded p-3">
          <h4 className="font-semibold text-red-800 mb-2">Authentication</h4>
          <div className="text-xs space-y-1">
            <p><strong>User:</strong> {user ? user.name : 'None'}</p>
            <p><strong>Email:</strong> {user?.email || 'None'}</p>
            <p><strong>Token:</strong> {user?.token ? 'Present' : 'Missing'}</p>
            <p><strong>LocalStorage:</strong> {parsedUser ? 'Present' : 'Missing'}</p>
            {user?.token && (
              <p><strong>Token:</strong> {user.token.substring(0, 15)}...</p>
            )}
          </div>
        </div>

        {/* Cart Debug */}
        <div className="bg-blue-50 border border-blue-200 rounded p-3">
          <h4 className="font-semibold text-blue-800 mb-2">Cart Status</h4>
          <div className="text-xs space-y-1">
            <p><strong>Redux Items:</strong> {items.length}</p>
            <p><strong>LocalStorage Items:</strong> {parsedCart.length}</p>
            <p><strong>Loading:</strong> {isLoading ? 'Yes' : 'No'}</p>
            <p><strong>Error:</strong> {error || 'None'}</p>
            {items.length > 0 && (
              <div>
                <p><strong>Products:</strong></p>
                {items.slice(0, 2).map((item, index) => (
                  <p key={index} className="ml-2 text-xs">
                    • {item.product.name} (Qty: {item.quantity})
                  </p>
                ))}
                {items.length > 2 && (
                  <p className="ml-2 text-xs">... and {items.length - 2} more</p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Orders Debug */}
        <div className="bg-purple-50 border border-purple-200 rounded p-3">
          <h4 className="font-semibold text-purple-800 mb-2">Orders Status</h4>
          <div className="text-xs space-y-1">
            <p><strong>Redux Orders:</strong> {orders.length}</p>
            <p><strong>LocalStorage Orders:</strong> {parsedOrders.length}</p>
            {parsedOrders.length > 0 && (
              <div>
                <p><strong>Recent Orders:</strong></p>
                {parsedOrders.slice(0, 2).map((order: any, index: number) => (
                  <p key={index} className="ml-2 text-xs">
                    • Order #{order._id?.substring(0, 8)}... (${order.totalPrice})
                  </p>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex space-x-2">
          <button
            onClick={handleClearAndReload}
            className="flex-1 bg-red-600 text-white px-3 py-2 rounded text-xs hover:bg-red-700 transition-colors flex items-center justify-center"
          >
            <RefreshCw className="h-3 w-3 mr-1" />
            Clear & Reload
          </button>
        </div>

        {/* Quick Login Info */}
        <div className="bg-green-50 border border-green-200 rounded p-3">
          <h4 className="font-semibold text-green-800 mb-2">Quick Login</h4>
          <div className="text-xs space-y-1">
            <p><strong>Krish:</strong> krish@gmail.com / krish123</p>
            <p><strong>Test:</strong> test@example.com / password123</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DebugPanel;
