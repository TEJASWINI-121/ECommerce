import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { 
  User, 
  ShoppingBag, 
  Heart, 
  ShoppingCart, 
  Package, 
  CreditCard,
  MapPin,
  Settings,
  LogOut
} from 'lucide-react';
import { RootState, AppDispatch } from '../store/store';
import { logout } from '../store/slices/authSlice';

const UserDashboard: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);
  const { items: cartItems } = useSelector((state: RootState) => state.cart);
  const [activeTab, setActiveTab] = useState('overview');

  // Mock data for demonstration
  const mockOrders = [
    {
      id: '1',
      date: '2024-01-15',
      status: 'Delivered',
      total: 89.99,
      items: 3
    },
    {
      id: '2',
      date: '2024-01-10',
      status: 'Shipped',
      total: 156.50,
      items: 2
    },
    {
      id: '3',
      date: '2024-01-05',
      status: 'Processing',
      total: 45.00,
      items: 1
    }
  ];

  const mockWishlist = [
    {
      id: '1',
      name: 'Premium Skincare Set',
      price: 129.99,
      image: 'https://via.placeholder.com/100x100'
    },
    {
      id: '2',
      name: 'Organic Face Cream',
      price: 45.00,
      image: 'https://via.placeholder.com/100x100'
    }
  ];

  const handleLogout = () => {
    dispatch(logout());
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: User },
    { id: 'orders', label: 'Orders', icon: Package },
    { id: 'wishlist', label: 'Wishlist', icon: Heart },
    { id: 'profile', label: 'Profile', icon: Settings }
  ];

  const renderOverview = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Total Orders</p>
            <p className="text-2xl font-bold text-gray-900">{mockOrders.length}</p>
          </div>
          <ShoppingBag className="h-8 w-8 text-blue-600" />
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Cart Items</p>
            <p className="text-2xl font-bold text-gray-900">{cartItems.length}</p>
          </div>
          <ShoppingCart className="h-8 w-8 text-green-600" />
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Wishlist</p>
            <p className="text-2xl font-bold text-gray-900">{mockWishlist.length}</p>
          </div>
          <Heart className="h-8 w-8 text-red-600" />
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Total Spent</p>
            <p className="text-2xl font-bold text-gray-900">
              ${mockOrders.reduce((sum, order) => sum + order.total, 0).toFixed(2)}
            </p>
          </div>
          <CreditCard className="h-8 w-8 text-purple-600" />
        </div>
      </div>
    </div>
  );

  const renderOrders = () => (
    <div className="bg-white rounded-lg shadow-md">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-medium text-gray-900">Recent Orders</h3>
      </div>
      <div className="divide-y divide-gray-200">
        {mockOrders.map((order) => (
          <div key={order.id} className="px-6 py-4 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-900">Order #{order.id}</p>
              <p className="text-sm text-gray-500">{order.date} • {order.items} items</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900">${order.total}</p>
              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                order.status === 'Delivered' ? 'bg-green-100 text-green-800' :
                order.status === 'Shipped' ? 'bg-blue-100 text-blue-800' :
                'bg-yellow-100 text-yellow-800'
              }`}>
                {order.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderWishlist = () => (
    <div className="bg-white rounded-lg shadow-md">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-medium text-gray-900">Wishlist</h3>
      </div>
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {mockWishlist.map((item) => (
            <div key={item.id} className="border border-gray-200 rounded-lg p-4">
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-32 object-cover rounded-lg mb-3"
              />
              <h4 className="font-medium text-gray-900 mb-1">{item.name}</h4>
              <p className="text-lg font-bold text-blue-600">${item.price}</p>
              <button className="mt-2 w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors">
                Add to Cart
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderProfile = () => (
    <div className="bg-white rounded-lg shadow-md">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-medium text-gray-900">Profile Information</h3>
      </div>
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
            <input
              type="text"
              value={user?.name || ''}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              readOnly
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <input
              type="email"
              value={user?.email || ''}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              readOnly
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
            <input
              type="text"
              value={user?.role || ''}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 capitalize"
              readOnly
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Member Since</label>
            <input
              type="text"
              value="January 2024"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              readOnly
            />
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Welcome back, {user?.name}!</h1>
              <p className="text-gray-600">Manage your account and track your orders</p>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="mb-8">
          <nav className="flex space-x-8">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                    activeTab === tab.id
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <Icon className="h-4 w-4 mr-2" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Content */}
        <div>
          {activeTab === 'overview' && renderOverview()}
          {activeTab === 'orders' && renderOrders()}
          {activeTab === 'wishlist' && renderWishlist()}
          {activeTab === 'profile' && renderProfile()}
        </div>

        {/* Quick Actions */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            to="/cart"
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center">
              <ShoppingCart className="h-8 w-8 text-blue-600 mr-4" />
              <div>
                <h3 className="font-medium text-gray-900">View Cart</h3>
                <p className="text-sm text-gray-500">{cartItems.length} items</p>
              </div>
            </div>
          </Link>
          
          <Link
            to="/products"
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center">
              <ShoppingBag className="h-8 w-8 text-green-600 mr-4" />
              <div>
                <h3 className="font-medium text-gray-900">Shop Now</h3>
                <p className="text-sm text-gray-500">Browse products</p>
              </div>
            </div>
          </Link>
          
          <Link
            to="/orders"
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center">
              <Package className="h-8 w-8 text-purple-600 mr-4" />
              <div>
                <h3 className="font-medium text-gray-900">Order History</h3>
                <p className="text-sm text-gray-500">Track your orders</p>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
