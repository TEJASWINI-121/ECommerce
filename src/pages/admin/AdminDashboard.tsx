import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  Package,
  Users,
  ShoppingCart,
  DollarSign,
  TrendingUp,
  Eye,
  LogOut,
  UserCheck,
  Truck,
  Store,
  BarChart3,
  Settings,
  CheckCircle,
  RefreshCw,
  ShoppingBag,
  BarChart2,
  Calendar,
  Clock
} from 'lucide-react';
import { RootState } from '../../store/store';
import { logout } from '../../store/slices/authSlice';
import { updateSimpleOrderStatus } from '../../utils/simpleOrders';
import { addRegisteredUser } from '../../utils/userStorage';
import { useAdminDashboard } from '../../hooks/useDashboardData';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state: RootState) => state.auth);
  const [activeTab, setActiveTab] = useState('overview');
  const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null);

  // Use the custom hook for admin dashboard data
  const { 
    stats, 
    recentOrders, 
    topProducts, 
    topSellers, 
    loading, 
    error, 
    refreshData 
  } = useAdminDashboard();

  useEffect(() => {
    // Redirect if not logged in or not an admin
    if (!user || user.role !== 'admin') {
      navigate('/');
    }
    
    // Store user in localStorage for accurate counts
    if (user) {
      addRegisteredUser(user);
    }
  }, [user, navigate]);

  const handleLogout = () => {
    dispatch(logout());
  };

  const handleOrderStatusChange = async (orderId: string, newStatus: string) => {
    try {
      setUpdatingOrderId(orderId);
      
      // Update in local storage for offline mode
      await updateSimpleOrderStatus(orderId, newStatus);
      
      // Refresh dashboard data after update
      refreshData();
      
      // Show success notification
      const notification = document.getElementById('notification');
      if (notification) {
        notification.classList.remove('hidden');
        setTimeout(() => {
          notification.classList.add('hidden');
        }, 3000);
      }
    } catch (error) {
      console.error('Failed to update order status:', error);
    } finally {
      setUpdatingOrderId(null);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'processing':
        return 'bg-purple-100 text-purple-800';
      case 'shipped':
        return 'bg-blue-100 text-blue-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'sellers', label: 'Sellers', icon: Store },
    { id: 'delivery', label: 'Delivery', icon: Truck },
    { id: 'reports', label: 'Reports', icon: TrendingUp }
  ];

  return (
    <div className="min-h-screen bg-gray-50 relative">
      {/* Success Notification */}
      <div id="notification" className="hidden fixed top-4 right-4 bg-green-100 border-l-4 border-green-500 text-green-700 p-4 shadow-md rounded z-50 flex items-center">
        <CheckCircle className="h-5 w-5 mr-2" />
        <span>Order status updated successfully!</span>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
              <p className="text-gray-600 mt-2">Welcome back, {user?.name}! Here's what's happening with your store.</p>
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

        {/* Enhanced Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Users</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalUsers.toLocaleString()}</p>
                <div className="mt-2 text-xs text-gray-500">
                  <div className="flex justify-between">
                    <span>Customers:</span>
                    <span>{(stats.totalUsers - stats.totalSellers - stats.totalDeliveryAgents).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Sellers:</span>
                    <span>{stats.totalSellers.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Delivery:</span>
                    <span>{stats.totalDeliveryAgents.toLocaleString()}</span>
                  </div>
                </div>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Sellers</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalSellers}</p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <Store className="h-6 w-6 text-green-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <span className="text-gray-500">Active sellers</span>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Delivery Agents</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalDeliveryAgents}</p>
              </div>
              <div className="p-3 bg-yellow-100 rounded-full">
                <Truck className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <span className="text-gray-500">Active agents</span>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Orders</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalOrders}</p>
                <div className="mt-2 text-xs text-gray-500">
                  <div className="flex justify-between">
                    <span>Pending:</span>
                    <span>{stats.pendingOrders}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipped:</span>
                    <span>{stats.shippedOrders}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Delivered:</span>
                    <span>{stats.deliveredOrders}</span>
                  </div>
                </div>
              </div>
              <div className="p-3 bg-orange-100 rounded-full">
                <ShoppingCart className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold text-gray-900">${stats.totalRevenue.toFixed(2)}</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-full">
                <DollarSign className="h-6 w-6 text-purple-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <span className="text-gray-500">All time revenue</span>
            </div>
          </div>
        </div>

        {/* Content based on active tab */}
        {activeTab === 'overview' && (
          <>
            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <Link
                to="/admin/products"
                className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-blue-100 rounded-full">
                    <Package className="h-8 w-8 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">Products</h3>
                    <p className="text-gray-600">{stats.totalProducts} items</p>
                  </div>
                </div>
              </Link>

              <Link
                to="/admin/orders"
                className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-green-100 rounded-full">
                    <ShoppingCart className="h-8 w-8 text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">Orders</h3>
                    <p className="text-gray-600">{stats.pendingOrders} pending</p>
                  </div>
                </div>
              </Link>

              <Link
                to="/admin/users"
                className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-orange-100 rounded-full">
                    <Users className="h-8 w-8 text-orange-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">Users</h3>
                    <p className="text-gray-600">{stats.totalUsers} registered</p>
                  </div>
                </div>
              </Link>

              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-purple-100 rounded-full">
                    <Settings className="h-8 w-8 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">Settings</h3>
                    <p className="text-gray-600">System config</p>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Overview Content */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Recent Orders */}
            <div className="bg-white rounded-lg shadow-md">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-800">Recent Orders</h2>
                  <Link
                    to="/admin/orders"
                    className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center"
                  >
                    View All
                    <Eye className="h-4 w-4 ml-1" />
                  </Link>
                </div>
              </div>
              <div className="divide-y divide-gray-200">
                {recentOrders.slice(0, 5).map((order) => (
                  <div key={order._id} className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900">{order.userName || 'Customer'}</p>
                        <p className="text-sm text-gray-600">Order #{order.orderId || order._id} • {order.sellerName || 'Seller'}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-gray-900">${order.total?.toFixed(2) || '0.00'}</p>
                        <div className="flex items-center space-x-2">
                          <div className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(order.status)}`}>
                            {order.status}
                          </div>
                          <div className="relative inline-block">
                            <select 
                              value={order.status}
                              disabled={updatingOrderId === order._id}
                              onChange={(e) => handleOrderStatusChange(order._id, e.target.value)}
                              className="text-xs border border-gray-300 rounded px-2 py-1 pr-8 focus:outline-none focus:ring-1 focus:ring-blue-500 appearance-none bg-white"
                            >
                              <option value="pending">Pending</option>
                              <option value="processing">Processing</option>
                              <option value="shipped">Shipped</option>
                              <option value="delivered">Delivered</option>
                              <option value="cancelled">Cancelled</option>
                            </select>
                            {updatingOrderId === order._id && (
                              <RefreshCw className="h-3 w-3 text-blue-500 animate-spin absolute right-2 top-1/2 transform -translate-y-1/2" />
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                {recentOrders.length === 0 && (
                  <div className="p-6 text-center text-gray-500">
                    No recent orders found
                  </div>
                )}
              </div>
            </div>

            {/* Top Sellers */}
            <div className="bg-white rounded-lg shadow-md">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-800">Top Sellers</h2>
                  <button className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center">
                    View All
                    <Eye className="h-4 w-4 ml-1" />
                  </button>
                </div>
              </div>
              <div className="divide-y divide-gray-200">
                {topSellers.slice(0, 5).map((seller) => (
                  <div key={seller._id} className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900">{seller.name}</p>
                        <p className="text-sm text-gray-600">{seller.productCount} products • {seller.orderCount} orders</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-gray-900">${seller.revenue?.toFixed(2) || '0.00'}</p>
                        <p className="text-sm text-gray-600">Revenue</p>
                      </div>
                    </div>
                  </div>
                ))}
                {topSellers.length === 0 && (
                  <div className="p-6 text-center text-gray-500">
                    No seller data available
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Users Tab Content */}
        {activeTab === 'users' && (
          <div className="bg-white rounded-lg shadow-md">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800">User Management</h2>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <UserCheck className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900">Regular Users</h3>
                  <p className="text-3xl font-bold text-blue-600">{stats.totalUsers - stats.totalSellers - stats.totalDeliveryAgents}</p>
                  <p className="text-sm text-gray-500">Active customers</p>
                </div>
                <div className="text-center">
                  <Store className="h-12 w-12 text-green-600 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900">Sellers</h3>
                  <p className="text-3xl font-bold text-green-600">{stats.totalSellers}</p>
                  <p className="text-sm text-gray-500">Active sellers</p>
                </div>
                <div className="text-center">
                  <Truck className="h-12 w-12 text-yellow-600 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900">Delivery Agents</h3>
                  <p className="text-3xl font-bold text-yellow-600">{stats.totalDeliveryAgents}</p>
                  <p className="text-sm text-gray-500">Active agents</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Reports Tab Content */}
        {activeTab === 'reports' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Sales Analytics</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">This Month</span>
                  <span className="font-semibold">${(stats.totalRevenue * 0.3).toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Last Month</span>
                  <span className="font-semibold">${(stats.totalRevenue * 0.25).toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Growth Rate</span>
                  <span className="font-semibold text-green-600">+{((stats.totalRevenue * 0.3 - stats.totalRevenue * 0.25) / (stats.totalRevenue * 0.25) * 100).toFixed(1)}%</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Status</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Pending</span>
                  <span className="font-semibold text-yellow-600">{stats.pendingOrders}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Shipped</span>
                  <span className="font-semibold text-blue-600">{stats.shippedOrders}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Delivered</span>
                  <span className="font-semibold text-green-600">{stats.deliveredOrders}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;