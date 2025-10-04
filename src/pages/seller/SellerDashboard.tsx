import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { RootState } from '../../store/store';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Package, DollarSign, ShoppingBag, Users, Truck, CheckCircle, RefreshCw, AlertCircle } from 'lucide-react';
import { updateSimpleOrderStatus } from '../../utils/simpleOrders';
import { useSellerDashboard } from '../../hooks/useDashboardData';

const SellerDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state: RootState) => state.auth);
  const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null);
  
  // Use the custom hook for seller dashboard data
  const { 
    stats, 
    products, 
    orders, 
    loading, 
    error, 
    refreshData 
  } = useSellerDashboard(user?._id || '');
  
  useEffect(() => {
    // Redirect if not logged in or not a seller
    if (!user) {
      navigate('/login');
    } else if (user.role !== 'seller') {
      navigate('/');
    }
  }, [user, navigate]);

  // Handle order status change
  const handleOrderStatusChange = async (orderId: string, newStatus: string) => {
    try {
      setUpdatingOrderId(orderId);
      
      // In a real app, this would call an API endpoint
      await updateSimpleOrderStatus(orderId, newStatus);
      
      // Update local state
      setOrders(orders.map(order => 
        order._id === orderId ? { ...order, status: newStatus } : order
      ));
      
      // Show success notification
      alert(`Order ${orderId} status updated to ${newStatus}`);
    } catch (err) {
      console.error('Failed to update order status:', err);
      alert('Failed to update order status');
    } finally {
      setUpdatingOrderId(null);
    }
  };

  // Calculate dashboard metrics
  const totalProducts = products.length;
  const totalRevenue = orders.reduce((sum, order) => sum + order.totalPrice, 0);
  const pendingOrders = orders.filter(order => !order.isDelivered).length;
  const shippedOrders = orders.filter(order => order.status === 'shipped').length;
  const readyToShipOrders = orders.filter(order => order.status === 'ready_to_ship').length;
  
  // Prepare chart data - products by category
  const productsByCategory = products.reduce((acc, product) => {
    acc[product.category] = (acc[product.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  const chartData = Object.keys(productsByCategory).map(category => ({
    name: category,
    products: productsByCategory[category]
  }));

  if (loading) return <div className="flex justify-center items-center h-screen">Loading...</div>;
  if (error) return <div className="text-red-500 text-center p-4">{error}</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Seller Dashboard</h1>
        <div className="flex space-x-4">
          <button
            onClick={() => navigate('/seller/products')}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
          >
            <Package className="h-5 w-5 mr-2" />
            Manage Products
          </button>
        </div>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6 flex items-center">
          <div className="rounded-full bg-blue-100 p-3 mr-4">
            <Package className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <p className="text-gray-500">Total Products</p>
            <p className="text-2xl font-bold">{totalProducts}</p>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6 flex items-center">
          <div className="rounded-full bg-green-100 p-3 mr-4">
            <DollarSign className="h-6 w-6 text-green-600" />
          </div>
          <div>
            <p className="text-gray-500">Total Revenue</p>
            <p className="text-2xl font-bold">${totalRevenue.toFixed(2)}</p>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6 flex items-center">
          <div className="rounded-full bg-yellow-100 p-3 mr-4">
            <ShoppingBag className="h-6 w-6 text-yellow-600" />
          </div>
          <div>
            <p className="text-gray-500">Pending Orders</p>
            <p className="text-2xl font-bold">{pendingOrders}</p>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6 flex items-center">
          <div className="rounded-full bg-purple-100 p-3 mr-4">
            <Users className="h-6 w-6 text-purple-600" />
          </div>
          <div>
            <p className="text-gray-500">Customers</p>
            <p className="text-2xl font-bold">{orders.length}</p>
          </div>
        </div>
      </div>
      
      {/* Charts */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Products by Category</h2>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="products" fill="#4f46e5" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      
      {/* Recent Products */}
      <div className="bg-white rounded-lg shadow overflow-hidden mb-8">
        <div className="px-6 py-4 border-b">
          <h2 className="text-xl font-semibold">Recent Products</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date Added</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {products.slice(0, 5).map((product) => (
                <tr key={product._id}>
                  <td className="px-6 py-4 whitespace-nowrap">{product.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{product.category}</td>
                  <td className="px-6 py-4 whitespace-nowrap">${product.price.toFixed(2)}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{product.stock}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{new Date(product.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Orders Management */}
      <div className="bg-white rounded-lg shadow overflow-hidden mb-8">
        <div className="px-6 py-4 border-b">
          <h2 className="text-xl font-semibold">Recent Orders</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {orders.slice(0, 5).map((order) => (
                <tr key={order._id}>
                  <td className="px-6 py-4 whitespace-nowrap">{order._id}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{new Date(order.createdAt).toLocaleDateString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{order.customerName || 'Customer'}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{order.productName || 'Product'}</td>
                  <td className="px-6 py-4 whitespace-nowrap">${order.totalPrice.toFixed(2)}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                      ${order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                        order.status === 'ready_to_ship' ? 'bg-blue-100 text-blue-800' : 
                        order.status === 'shipped' ? 'bg-purple-100 text-purple-800' : 
                        order.status === 'delivered' ? 'bg-green-100 text-green-800' : 
                        'bg-gray-100 text-gray-800'}`}>
                      {order.status ? order.status.replace('_', ' ').toUpperCase() : (order.isDelivered ? 'Delivered' : 'Pending')}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {!order.isDelivered && (
                      <div className="flex space-x-2">
                        {order.status !== 'ready_to_ship' && (
                          <button
                            onClick={() => handleOrderStatusChange(order._id, 'ready_to_ship')}
                            disabled={updatingOrderId === order._id}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-2 py-1 rounded text-xs flex items-center"
                          >
                            {updatingOrderId === order._id ? (
                              <RefreshCw className="h-3 w-3 mr-1 animate-spin" />
                            ) : (
                              <Package className="h-3 w-3 mr-1" />
                            )}
                            Ready to Ship
                          </button>
                        )}
                        
                        {order.status !== 'shipped' && order.status === 'ready_to_ship' && (
                          <button
                            onClick={() => handleOrderStatusChange(order._id, 'shipped')}
                            disabled={updatingOrderId === order._id}
                            className="bg-purple-600 hover:bg-purple-700 text-white px-2 py-1 rounded text-xs flex items-center"
                          >
                            {updatingOrderId === order._id ? (
                              <RefreshCw className="h-3 w-3 mr-1 animate-spin" />
                            ) : (
                              <Truck className="h-3 w-3 mr-1" />
                            )}
                            Ship
                          </button>
                        )}
                      </div>
                    )}
                    
                    {order.isDelivered && (
                      <span className="text-green-600 flex items-center text-xs">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Delivered
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Action Buttons */}
      <div className="flex flex-wrap gap-4">
        <button 
          onClick={() => navigate('/seller/products')}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors"
        >
          Manage Products
        </button>
        <button 
          onClick={() => navigate('/seller/orders')}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md transition-colors"
        >
          View Orders
        </button>
      </div>
    </div>
  );
};

export default SellerDashboard;