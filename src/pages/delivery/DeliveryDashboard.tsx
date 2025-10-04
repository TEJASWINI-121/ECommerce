import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { RootState } from '../../store/store';
import { Truck, Package, CheckCircle, Clock, MapPin, AlertTriangle } from 'lucide-react';
import { useDeliveryDashboard } from '../../hooks/useDashboardData';

interface Order {
  _id: string;
  user: {
    name: string;
  };
  shippingAddress: {
    address: string;
    city: string;
    postalCode: string;
    country: string;
  };
  totalPrice: number;
  isPaid: boolean;
  isDelivered: boolean;
  deliveredAt: string | null;
  createdAt: string;
  status: string;
  productName?: string;
  sellerName?: string;
}

const DeliveryDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state: RootState) => state.auth);
  const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null);
  
  // Use the custom hook for delivery dashboard data
  const { 
    orders, 
    loading, 
    error, 
    refreshData 
  } = useDeliveryDashboard(user?._id || '');

  useEffect(() => {
    // Redirect if not logged in or not a delivery person
    if (!user) {
      navigate('/login');
    } else if (user.role !== 'delivery') {
      navigate('/');
    }
  }, [user, navigate]);

  // Calculate dashboard metrics
  const assignedDeliveries = orders.filter(order => order.status === 'assigned').length;
  const pickedUpDeliveries = orders.filter(order => order.status === 'picked_up').length;
  const inTransitDeliveries = orders.filter(order => order.status === 'in_transit').length;
  const completedDeliveries = orders.filter(order => order.status === 'delivered' || order.isDelivered).length;
  const todayDeliveries = orders.filter(order => {
    const today = new Date().toISOString().split('T')[0];
    return order.isPaid && !order.isDelivered && order.createdAt.split('T')[0] === today;
  }).length;

  const updateOrderStatus = async (orderId: string, status: string) => {
    try {
      setUpdatingOrderId(orderId);
      
      // In a real app, this would be a PUT request to update the order status
      await axios.put(`${API_BASE_URL}/delivery/orders/${orderId}/status`, { status }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      // Refresh data after successful update
      refreshData();
      setUpdatingOrderId(null);
    } catch (err) {
      console.error('Error updating order status:', err);
      setUpdatingOrderId(null);
    }
  };

  const markAsPickedUp = (orderId: string) => updateOrderStatus(orderId, 'picked_up');
  const markAsInTransit = (orderId: string) => updateOrderStatus(orderId, 'in_transit');
  const markAsDelivered = (orderId: string) => updateOrderStatus(orderId, 'delivered');

  if (loading) return <div className="flex justify-center items-center h-screen">Loading...</div>;
  if (error) return <div className="text-red-500 text-center p-4">{error}</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Delivery Dashboard</h1>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6 flex items-center">
          <div className="rounded-full bg-yellow-100 p-3 mr-4">
            <Clock className="h-6 w-6 text-yellow-600" />
          </div>
          <div>
            <p className="text-gray-500">Assigned</p>
            <p className="text-2xl font-bold">{assignedDeliveries}</p>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6 flex items-center">
          <div className="rounded-full bg-blue-100 p-3 mr-4">
            <Package className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <p className="text-gray-500">Picked Up</p>
            <p className="text-2xl font-bold">{pickedUpDeliveries}</p>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6 flex items-center">
          <div className="rounded-full bg-purple-100 p-3 mr-4">
            <Truck className="h-6 w-6 text-purple-600" />
          </div>
          <div>
            <p className="text-gray-500">In Transit</p>
            <p className="text-2xl font-bold">{inTransitDeliveries}</p>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6 flex items-center">
          <div className="rounded-full bg-green-100 p-3 mr-4">
            <CheckCircle className="h-6 w-6 text-green-600" />
          </div>
          <div>
            <p className="text-gray-500">Delivered</p>
            <p className="text-2xl font-bold">{completedDeliveries}</p>
          </div>
        </div>
      </div>
      
      {/* Active Deliveries */}
      <div className="bg-white rounded-lg shadow overflow-hidden mb-8">
        <div className="px-6 py-4 border-b">
          <h2 className="text-xl font-semibold">Active Deliveries</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Seller</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Address</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {orders
                .filter(order => !order.isDelivered)
                .map((order) => (
                  <tr key={order._id}>
                    <td className="px-6 py-4 whitespace-nowrap">{order._id.substring(0, 8)}...</td>
                    <td className="px-6 py-4 whitespace-nowrap">{order.user?.name || 'Customer'}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{order.productName || 'Product'}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{order.sellerName || 'Seller'}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {order.shippingAddress?.address}, {order.shippingAddress?.city}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">${order.totalPrice.toFixed(2)}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        order.status === 'assigned' ? 'bg-yellow-100 text-yellow-800' :
                        order.status === 'picked_up' ? 'bg-blue-100 text-blue-800' :
                        order.status === 'in_transit' ? 'bg-purple-100 text-purple-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {order.status === 'assigned' ? 'Assigned' :
                         order.status === 'picked_up' ? 'Picked Up' :
                         order.status === 'in_transit' ? 'In Transit' :
                         'Delivered'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {updatingOrderId === order._id ? (
                        <span className="text-gray-500">Updating...</span>
                      ) : order.status === 'assigned' ? (
                        <button
                          onClick={() => markAsPickedUp(order._id)}
                          className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-md text-sm transition-colors"
                        >
                          Mark Picked Up
                        </button>
                      ) : order.status === 'picked_up' ? (
                        <button
                          onClick={() => markAsInTransit(order._id)}
                          className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-1 rounded-md text-sm transition-colors"
                        >
                          Mark In Transit
                        </button>
                      ) : order.status === 'in_transit' ? (
                        <button
                          onClick={() => markAsDelivered(order._id)}
                          className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-md text-sm transition-colors"
                        >
                          Mark Delivered
                        </button>
                      ) : (
                        <span className="text-green-600 font-medium">Completed</span>
                      )}
                    </td>
                  </tr>
                ))}
              {orders.filter(order => !order.isDelivered).length === 0 && (
                <tr>
                  <td colSpan={8} className="px-6 py-4 text-center text-gray-500">
                    No active deliveries
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Recent Completed Deliveries */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b">
          <h2 className="text-xl font-semibold">Recent Completed Deliveries</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Seller</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Address</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Delivered Date</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {orders
                .filter(order => order.isDelivered || order.status === 'delivered')
                .slice(0, 5)
                .map((order) => (
                  <tr key={order._id}>
                    <td className="px-6 py-4 whitespace-nowrap">{order._id.substring(0, 8)}...</td>
                    <td className="px-6 py-4 whitespace-nowrap">{order.user?.name || 'Customer'}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{order.productName || 'Product'}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{order.sellerName || 'Seller'}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {order.shippingAddress?.address}, {order.shippingAddress?.city}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">${order.totalPrice.toFixed(2)}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {order.deliveredAt ? new Date(order.deliveredAt).toLocaleDateString() : 'N/A'}
                    </td>
                  </tr>
                ))}
              {orders.filter(order => order.isDelivered || order.status === 'delivered').length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-4 text-center text-gray-500">
                    No completed deliveries
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DeliveryDashboard;