import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
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
  Settings
} from 'lucide-react';
import { RootState, AppDispatch } from '../../store/store';
import { logout } from '../../store/slices/authSlice';
import { getDashboardStats, updateOrderStatus } from '../../store/slices/dashboardSlice';

const AdminDashboard: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);
  const { stats, recentOrders, topProducts, topSellers, isLoading } = useSelector((state: RootState) => state.dashboard);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    dispatch(getDashboardStats());
  }, [dispatch]);

  const handleLogout = () => {
    dispatch(logout());
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered':
        return 'text-green-600 bg-green-100';
      case 'shipped':
        return 'text-blue-600 bg-blue-100';
      case 'processing':
        return 'text-yellow-600 bg-yellow-100';
      default:
        return 'text-gray-600 bg-gray-100';
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
    <div className="min-h-screen bg-gray-50">
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
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
              <span className="text-green-500">+8%</span>
              <span className="text-gray-500 ml-1">from last month</span>
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
              <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
              <span className="text-green-500">+12%</span>
              <span className="text-gray-500 ml-1">from last month</span>
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
              <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
              <span className="text-green-500">+5%</span>
              <span className="text-gray-500 ml-1">from last month</span>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Orders</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalOrders}</p>
              </div>
              <div className="p-3 bg-orange-100 rounded-full">
                <ShoppingCart className="h-6 w-6 text-orange-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
              <span className="text-green-500">+15%</span>
              <span className="text-gray-500 ml-1">from last month</span>
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
              <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
              <span className="text-green-500">+23%</span>
              <span className="text-gray-500 ml-1">from last month</span>
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
                        <div className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(order.status)}`}>
                          {order.status}
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