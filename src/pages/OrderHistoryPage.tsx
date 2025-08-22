import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Package, Eye } from 'lucide-react';
import { RootState, AppDispatch } from '../store/store';
import { getMyOrders } from '../store/slices/orderSlice';
import Loader from '../components/Loader';

const OrderHistoryPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  
  const { orders, isLoading } = useSelector((state: RootState) => state.orders);

  useEffect(() => {
    dispatch(getMyOrders());
  }, [dispatch]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered':
        return 'text-green-600 bg-green-100';
      case 'shipped':
        return 'text-blue-600 bg-blue-100';
      case 'processing':
        return 'text-yellow-600 bg-yellow-100';
      case 'cancelled':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center space-x-3 mb-8">
          <Package className="h-8 w-8 text-blue-600" />
          <h1 className="text-3xl font-bold text-gray-800">Order History</h1>
        </div>

        {orders.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">No Orders Yet</h2>
            <p className="text-gray-600 mb-6">You haven't placed any orders yet.</p>
            <Link
              to="/"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div key={order._id} className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-1">
                        Order #{order._id}
                      </h3>
                      <p className="text-sm text-gray-600">
                        Placed on {new Date(order.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                    <div className="flex items-center space-x-4 mt-4 lg:mt-0">
                      <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.orderStatus)}`}>
                        <span className="capitalize">{order.orderStatus}</span>
                      </div>
                      <Link
                        to={`/order/${order._id}`}
                        className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        <Eye className="h-4 w-4" />
                        <span>View Details</span>
                      </Link>
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-sm font-medium text-gray-700">
                        {order.orderItems.length} item{order.orderItems.length !== 1 ? 's' : ''}
                      </span>
                      <span className="text-lg font-bold text-gray-900">
                        ${order.totalPrice.toFixed(2)}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                      {order.orderItems.slice(0, 4).map((item, index) => (
                        <div key={index} className="flex items-center space-x-3">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-12 h-12 object-cover rounded"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-800 truncate">
                              {item.name}
                            </p>
                            <p className="text-xs text-gray-600">
                              Qty: {item.quantity}
                            </p>
                          </div>
                        </div>
                      ))}
                      {order.orderItems.length > 4 && (
                        <div className="flex items-center justify-center">
                          <span className="text-sm text-gray-500">
                            +{order.orderItems.length - 4} more items
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderHistoryPage;