import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { 
  Truck, 
  MapPin, 
  Clock, 
  CheckCircle, 
  Package, 
  Navigation,
  Phone,
  LogOut,
  AlertCircle
} from 'lucide-react';
import { RootState, AppDispatch } from '../store/store';
import { logout } from '../store/slices/authSlice';

const DeliveryDashboard: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);
  const [activeTab, setActiveTab] = useState('pending');

  // Mock delivery data
  const mockDeliveries = [
    {
      id: '1',
      orderId: 'ORD-001',
      customer: {
        name: 'John Doe',
        phone: '+1 234-567-8900',
        address: '123 Main St, New York, NY 10001'
      },
      items: [
        { name: 'Premium Face Cream', quantity: 2 },
        { name: 'Organic Serum', quantity: 1 }
      ],
      status: 'Pending',
      priority: 'High',
      estimatedTime: '2:30 PM',
      distance: '2.5 km'
    },
    {
      id: '2',
      orderId: 'ORD-002',
      customer: {
        name: 'Jane Smith',
        phone: '+1 234-567-8901',
        address: '456 Oak Ave, Brooklyn, NY 11201'
      },
      items: [
        { name: 'Anti-Aging Moisturizer', quantity: 1 }
      ],
      status: 'Out for Delivery',
      priority: 'Medium',
      estimatedTime: '3:15 PM',
      distance: '4.2 km'
    },
    {
      id: '3',
      orderId: 'ORD-003',
      customer: {
        name: 'Mike Johnson',
        phone: '+1 234-567-8902',
        address: '789 Pine St, Queens, NY 11375'
      },
      items: [
        { name: 'Vitamin C Serum', quantity: 3 }
      ],
      status: 'Delivered',
      priority: 'Low',
      estimatedTime: '1:45 PM',
      distance: '1.8 km',
      deliveredAt: '1:42 PM'
    }
  ];

  const handleLogout = () => {
    dispatch(logout());
  };

  const handleStatusUpdate = (deliveryId: string, newStatus: string) => {
    // In a real app, this would update the backend
    console.log(`Updating delivery ${deliveryId} to ${newStatus}`);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'Out for Delivery':
        return 'bg-blue-100 text-blue-800';
      case 'Delivered':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High':
        return 'text-red-600';
      case 'Medium':
        return 'text-yellow-600';
      case 'Low':
        return 'text-green-600';
      default:
        return 'text-gray-600';
    }
  };

  const filteredDeliveries = mockDeliveries.filter(delivery => {
    if (activeTab === 'pending') return delivery.status === 'Pending';
    if (activeTab === 'active') return delivery.status === 'Out for Delivery';
    if (activeTab === 'completed') return delivery.status === 'Delivered';
    return true;
  });

  const stats = {
    pending: mockDeliveries.filter(d => d.status === 'Pending').length,
    active: mockDeliveries.filter(d => d.status === 'Out for Delivery').length,
    completed: mockDeliveries.filter(d => d.status === 'Delivered').length,
    total: mockDeliveries.length
  };

  const renderDeliveryCard = (delivery: any) => (
    <div key={delivery.id} className="bg-white rounded-lg shadow-md p-6 mb-4">
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="flex items-center mb-2">
            <h3 className="text-lg font-semibold text-gray-900 mr-3">
              Order #{delivery.orderId}
            </h3>
            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(delivery.status)}`}>
              {delivery.status}
            </span>
            <span className={`ml-2 text-sm font-medium ${getPriorityColor(delivery.priority)}`}>
              {delivery.priority} Priority
            </span>
          </div>
          <p className="text-gray-600 mb-1">{delivery.customer.name}</p>
          <p className="text-sm text-gray-500 flex items-center">
            <MapPin className="h-4 w-4 mr-1" />
            {delivery.customer.address}
          </p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-500 flex items-center justify-end mb-1">
            <Clock className="h-4 w-4 mr-1" />
            {delivery.status === 'Delivered' ? `Delivered at ${delivery.deliveredAt}` : `ETA: ${delivery.estimatedTime}`}
          </p>
          <p className="text-sm text-gray-500">{delivery.distance}</p>
        </div>
      </div>

      <div className="mb-4">
        <h4 className="text-sm font-medium text-gray-700 mb-2">Items:</h4>
        <div className="space-y-1">
          {delivery.items.map((item: any, index: number) => (
            <p key={index} className="text-sm text-gray-600">
              • {item.name} × {item.quantity}
            </p>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <button className="flex items-center px-3 py-1 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors">
            <Phone className="h-4 w-4 mr-1" />
            Call
          </button>
          <button className="flex items-center px-3 py-1 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors">
            <Navigation className="h-4 w-4 mr-1" />
            Navigate
          </button>
        </div>

        <div className="flex space-x-2">
          {delivery.status === 'Pending' && (
            <button
              onClick={() => handleStatusUpdate(delivery.id, 'Out for Delivery')}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Start Delivery
            </button>
          )}
          {delivery.status === 'Out for Delivery' && (
            <button
              onClick={() => handleStatusUpdate(delivery.id, 'Delivered')}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Mark Delivered
            </button>
          )}
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
              <h1 className="text-3xl font-bold text-gray-900">Delivery Dashboard</h1>
              <p className="text-gray-600">Welcome back, {user?.name}!</p>
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

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
              </div>
              <AlertCircle className="h-8 w-8 text-yellow-600" />
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active</p>
                <p className="text-2xl font-bold text-blue-600">{stats.active}</p>
              </div>
              <Truck className="h-8 w-8 text-blue-600" />
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-green-600">{stats.completed}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Today</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <Package className="h-8 w-8 text-gray-600" />
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="mb-8">
          <nav className="flex space-x-8">
            {[
              { id: 'pending', label: 'Pending', count: stats.pending },
              { id: 'active', label: 'Active', count: stats.active },
              { id: 'completed', label: 'Completed', count: stats.completed }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                  activeTab === tab.id
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab.label}
                {tab.count > 0 && (
                  <span className="ml-2 bg-gray-200 text-gray-700 text-xs px-2 py-1 rounded-full">
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </div>

        {/* Deliveries List */}
        <div>
          {filteredDeliveries.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No {activeTab} deliveries
              </h3>
              <p className="text-gray-500">
                {activeTab === 'pending' && 'All deliveries are either active or completed.'}
                {activeTab === 'active' && 'No deliveries are currently out for delivery.'}
                {activeTab === 'completed' && 'No deliveries have been completed today.'}
              </p>
            </div>
          ) : (
            <div>
              {filteredDeliveries.map(renderDeliveryCard)}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="mt-8 bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button className="flex items-center justify-center px-4 py-3 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors">
              <MapPin className="h-5 w-5 mr-2" />
              View Route Map
            </button>
            <button className="flex items-center justify-center px-4 py-3 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors">
              <Clock className="h-5 w-5 mr-2" />
              Update Availability
            </button>
            <button className="flex items-center justify-center px-4 py-3 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors">
              <Package className="h-5 w-5 mr-2" />
              Report Issue
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeliveryDashboard;
