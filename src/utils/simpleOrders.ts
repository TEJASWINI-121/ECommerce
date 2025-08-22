// Simple Order System - Works immediately without complex API logic
import { toast } from 'react-toastify';
import { getSimpleCart, clearSimpleCart, SimpleCartItem } from './simpleCart';

export interface SimpleOrder {
  _id: string;
  userId: string;
  orderItems: SimpleCartItem[];
  shippingAddress: {
    fullName: string;
    address: string;
    city: string;
    postalCode: string;
    country: string;
    phone?: string;
  };
  paymentMethod: string;
  itemsPrice: number;
  taxPrice: number;
  shippingPrice: number;
  totalPrice: number;
  isPaid: boolean;
  isDelivered: boolean;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: string;
  paidAt?: string;
  deliveredAt?: string;
}

// Get current user ID
const getCurrentUserId = (): string => {
  try {
    const user = localStorage.getItem('currentUser');
    if (user) {
      const userData = JSON.parse(user);
      return userData._id || 'guest';
    }
    return 'guest';
  } catch {
    return 'guest';
  }
};

// Get orders key for current user
const getOrdersKey = (): string => {
  const userId = getCurrentUserId();
  return `simple_orders_${userId}`;
};

// Get all orders key (for admin/seller)
const getAllOrdersKey = (): string => {
  return 'simple_orders_all';
};

// Get user orders from localStorage
export const getSimpleOrders = (): SimpleOrder[] => {
  try {
    const ordersKey = getOrdersKey();
    const orders = localStorage.getItem(ordersKey);
    return orders ? JSON.parse(orders) : [];
  } catch (error) {
    console.error('Error getting orders:', error);
    return [];
  }
};

// Get all orders (for admin/seller)
export const getAllSimpleOrders = (): SimpleOrder[] => {
  try {
    const allOrdersKey = getAllOrdersKey();
    const orders = localStorage.getItem(allOrdersKey);
    return orders ? JSON.parse(orders) : [];
  } catch (error) {
    console.error('Error getting all orders:', error);
    return [];
  }
};

// Save order to localStorage
const saveSimpleOrder = (order: SimpleOrder): void => {
  try {
    // Save to user's orders
    const userOrders = getSimpleOrders();
    userOrders.unshift(order); // Add to beginning
    const ordersKey = getOrdersKey();
    localStorage.setItem(ordersKey, JSON.stringify(userOrders));

    // Save to all orders (for admin/seller)
    const allOrders = getAllSimpleOrders();
    allOrders.unshift(order);
    const allOrdersKey = getAllOrdersKey();
    localStorage.setItem(allOrdersKey, JSON.stringify(allOrders));

    console.log('✅ Order saved:', order._id);
  } catch (error) {
    console.error('Error saving order:', error);
  }
};

// Create order from cart
export const createSimpleOrder = (orderData: {
  shippingAddress: {
    fullName: string;
    address: string;
    city: string;
    postalCode: string;
    country: string;
    phone?: string;
  };
  paymentMethod: string;
}): SimpleOrder | null => {
  try {
    console.log('🛒 Creating order...');
    
    const cartItems = getSimpleCart();
    if (cartItems.length === 0) {
      toast.error('Cart is empty');
      return null;
    }

    const userId = getCurrentUserId();
    if (userId === 'guest') {
      toast.error('Please login to place order');
      return null;
    }

    // Calculate prices
    const itemsPrice = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
    const taxPrice = itemsPrice * 0.1; // 10% tax
    const shippingPrice = itemsPrice > 100 ? 0 : 10; // Free shipping over $100
    const totalPrice = itemsPrice + taxPrice + shippingPrice;

    // Create order
    const order: SimpleOrder = {
      _id: `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userId,
      orderItems: [...cartItems],
      shippingAddress: orderData.shippingAddress,
      paymentMethod: orderData.paymentMethod,
      itemsPrice: Math.round(itemsPrice * 100) / 100,
      taxPrice: Math.round(taxPrice * 100) / 100,
      shippingPrice,
      totalPrice: Math.round(totalPrice * 100) / 100,
      isPaid: false,
      isDelivered: false,
      status: 'pending',
      createdAt: new Date().toISOString()
    };

    // Save order
    saveSimpleOrder(order);

    // Clear cart
    clearSimpleCart();

    console.log('✅ Order created successfully:', order._id);
    toast.success('Order placed successfully!');
    
    return order;
  } catch (error) {
    console.error('Error creating order:', error);
    toast.error('Failed to place order');
    return null;
  }
};

// Update order status
export const updateSimpleOrderStatus = (orderId: string, status: SimpleOrder['status']): boolean => {
  try {
    // Update in user orders
    const userOrders = getSimpleOrders();
    const userOrderIndex = userOrders.findIndex(order => order._id === orderId);
    if (userOrderIndex >= 0) {
      userOrders[userOrderIndex].status = status;
      if (status === 'delivered') {
        userOrders[userOrderIndex].isDelivered = true;
        userOrders[userOrderIndex].deliveredAt = new Date().toISOString();
      }
      const ordersKey = getOrdersKey();
      localStorage.setItem(ordersKey, JSON.stringify(userOrders));
    }

    // Update in all orders
    const allOrders = getAllSimpleOrders();
    const allOrderIndex = allOrders.findIndex(order => order._id === orderId);
    if (allOrderIndex >= 0) {
      allOrders[allOrderIndex].status = status;
      if (status === 'delivered') {
        allOrders[allOrderIndex].isDelivered = true;
        allOrders[allOrderIndex].deliveredAt = new Date().toISOString();
      }
      const allOrdersKey = getAllOrdersKey();
      localStorage.setItem(allOrdersKey, JSON.stringify(allOrders));
    }

    console.log('✅ Order status updated:', orderId, status);
    return true;
  } catch (error) {
    console.error('Error updating order status:', error);
    return false;
  }
};

// Mark order as paid
export const markSimpleOrderAsPaid = (orderId: string): boolean => {
  try {
    // Update in user orders
    const userOrders = getSimpleOrders();
    const userOrderIndex = userOrders.findIndex(order => order._id === orderId);
    if (userOrderIndex >= 0) {
      userOrders[userOrderIndex].isPaid = true;
      userOrders[userOrderIndex].paidAt = new Date().toISOString();
      userOrders[userOrderIndex].status = 'processing';
      const ordersKey = getOrdersKey();
      localStorage.setItem(ordersKey, JSON.stringify(userOrders));
    }

    // Update in all orders
    const allOrders = getAllSimpleOrders();
    const allOrderIndex = allOrders.findIndex(order => order._id === orderId);
    if (allOrderIndex >= 0) {
      allOrders[allOrderIndex].isPaid = true;
      allOrders[allOrderIndex].paidAt = new Date().toISOString();
      allOrders[allOrderIndex].status = 'processing';
      const allOrdersKey = getAllOrdersKey();
      localStorage.setItem(allOrdersKey, JSON.stringify(allOrders));
    }

    console.log('✅ Order marked as paid:', orderId);
    return true;
  } catch (error) {
    console.error('Error marking order as paid:', error);
    return false;
  }
};

// Get order by ID
export const getSimpleOrderById = (orderId: string): SimpleOrder | null => {
  try {
    const orders = getSimpleOrders();
    return orders.find(order => order._id === orderId) || null;
  } catch (error) {
    console.error('Error getting order by ID:', error);
    return null;
  }
};

// Get order statistics
export const getSimpleOrderStats = () => {
  try {
    const orders = getSimpleOrders();
    const totalOrders = orders.length;
    const totalSpent = orders.reduce((total, order) => total + order.totalPrice, 0);
    const pendingOrders = orders.filter(order => order.status === 'pending').length;
    const deliveredOrders = orders.filter(order => order.status === 'delivered').length;

    return {
      totalOrders,
      totalSpent: Math.round(totalSpent * 100) / 100,
      pendingOrders,
      deliveredOrders
    };
  } catch (error) {
    console.error('Error getting order stats:', error);
    return {
      totalOrders: 0,
      totalSpent: 0,
      pendingOrders: 0,
      deliveredOrders: 0
    };
  }
};
