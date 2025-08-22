import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle, Package, Truck, Home } from 'lucide-react';

const OrderSuccessPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        <div className="mb-6">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Order Placed Successfully!</h1>
          <p className="text-gray-600">
            Thank you for your purchase. Your order has been confirmed and will be processed shortly.
          </p>
        </div>

        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center">
              <Package className="h-5 w-5 text-blue-600 mr-2" />
              <span className="text-sm font-medium">Order Number</span>
            </div>
            <span className="text-sm font-mono text-gray-800">#ORD-{Date.now().toString().slice(-6)}</span>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Truck className="h-5 w-5 text-blue-600 mr-2" />
              <span className="text-sm font-medium">Estimated Delivery</span>
            </div>
            <span className="text-sm text-gray-800">3-5 business days</span>
          </div>
        </div>

        <div className="space-y-3">
          <Link
            to="/orders"
            className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors font-medium block"
          >
            View Order Details
          </Link>
          
          <Link
            to="/"
            className="w-full bg-gray-100 text-gray-700 py-3 px-6 rounded-lg hover:bg-gray-200 transition-colors font-medium flex items-center justify-center"
          >
            <Home className="h-5 w-5 mr-2" />
            Continue Shopping
          </Link>
        </div>

        <p className="text-xs text-gray-500 mt-6">
          You will receive an email confirmation shortly with your order details and tracking information.
        </p>
      </div>
    </div>
  );
};

export default OrderSuccessPage;
