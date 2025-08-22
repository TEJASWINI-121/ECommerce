import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Package, CheckCircle, Clock, MapPin } from 'lucide-react';
import { RootState, AppDispatch } from '../store/store';
import { getOrder } from '../store/slices/orderSlice';
import Loader from '../components/Loader';

const OrderPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch<AppDispatch>();
  
  const { order, isLoading } = useSelector((state: RootState) => state.orders);

  useEffect(() => {
    if (id) {
      dispatch(getOrder(id));
    }
  }, [dispatch, id]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader size="lg" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Order Not Found</h2>
          <Link
            to="/orders"
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to Orders
          </Link>
        </div>
      </div>
    );
  }

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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'delivered':
        return <CheckCircle className="h-5 w-5" />;
      case 'shipped':
      case 'processing':
        return <Package className="h-5 w-5" />;
      default:
        return <Clock className="h-5 w-5" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Order Details</h1>
              <p className="text-gray-600 mt-1">Order ID: {order._id}</p>
              <p className="text-sm text-gray-500 mt-1">
                Placed on {new Date(order.createdAt).toLocaleDateString()}
              </p>
            </div>
            <div className="mt-4 md:mt-0">
              <div className={`inline-flex items-center space-x-2 px-4 py-2 rounded-full font-medium ${getStatusColor(order.orderStatus)}`}>
                {getStatusIcon(order.orderStatus)}
                <span className="capitalize">{order.orderStatus}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Order Items */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">Order Items</h2>
              <div className="space-y-4">
                {order.orderItems.map((item, index) => (
                  <div key={index} className="flex items-center space-x-4 p-4 border rounded-lg">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded"
                    />
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-800">{item.name}</h3>
                      <p className="text-gray-600">Quantity: {item.quantity}</p>
                      <p className="text-gray-600">${item.price.toFixed(2)} each</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-gray-800">
                        ${(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Order Info */}
          <div className="space-y-6">
            {/* Order Summary */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>Items Price</span>
                  <span>${order.itemsPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>${order.shippingPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax</span>
                  <span>${order.taxPrice.toFixed(2)}</span>
                </div>
                <hr />
                <div className="flex justify-between text-lg font-semibold">
                  <span>Total</span>
                  <span>${order.totalPrice.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Shipping Address */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center space-x-2 mb-4">
                <MapPin className="h-5 w-5 text-blue-600" />
                <h2 className="text-xl font-semibold">Shipping Address</h2>
              </div>
              <div className="text-gray-700">
                <p>{order.shippingAddress.address}</p>
                <p>{order.shippingAddress.city}, {order.shippingAddress.postalCode}</p>
                <p>{order.shippingAddress.country}</p>
              </div>
            </div>

            {/* Payment Information */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">Payment Information</h2>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Payment Method</span>
                  <span>{order.paymentMethod}</span>
                </div>
                <div className="flex justify-between">
                  <span>Payment Status</span>
                  <span className={`font-medium ${order.isPaid ? 'text-green-600' : 'text-red-600'}`}>
                    {order.isPaid ? 'Paid' : 'Not Paid'}
                  </span>
                </div>
                {order.isPaid && order.paidAt && (
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Paid At</span>
                    <span>{new Date(order.paidAt).toLocaleDateString()}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Delivery Information */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">Delivery Information</h2>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Delivery Status</span>
                  <span className={`font-medium ${order.isDelivered ? 'text-green-600' : 'text-orange-600'}`}>
                    {order.isDelivered ? 'Delivered' : 'Not Delivered'}
                  </span>
                </div>
                {order.isDelivered && order.deliveredAt && (
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Delivered At</span>
                    <span>{new Date(order.deliveredAt).toLocaleDateString()}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderPage;