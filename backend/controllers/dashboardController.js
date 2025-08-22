import User from '../models/User.js';
import Product from '../models/Product.js';
import Order from '../models/Order.js';

// @desc    Get admin dashboard stats
// @route   GET /api/dashboard/admin
// @access  Private/Admin
export const getAdminStats = async (req, res) => {
  try {
    // Get counts
    const totalUsers = await User.countDocuments();
    const totalProducts = await Product.countDocuments();
    const totalOrders = await Order.countDocuments();
    
    // Get revenue (sum of all order totals)
    const revenueResult = await Order.aggregate([
      { $group: { _id: null, total: { $sum: '$totalPrice' } } }
    ]);
    const totalRevenue = revenueResult.length > 0 ? revenueResult[0].total : 0;

    // Get recent orders
    const recentOrders = await Order.find()
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .limit(5)
      .lean();

    // Get user registrations by month (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    
    const userGrowth = await User.aggregate([
      { $match: { createdAt: { $gte: sixMonthsAgo } } },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    // Get orders by status
    const ordersByStatus = await Order.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    // Get top selling products
    const topProducts = await Order.aggregate([
      { $unwind: '$orderItems' },
      {
        $group: {
          _id: '$orderItems.product',
          totalSold: { $sum: '$orderItems.quantity' },
          revenue: { $sum: { $multiply: ['$orderItems.price', '$orderItems.quantity'] } }
        }
      },
      { $sort: { totalSold: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: 'products',
          localField: '_id',
          foreignField: '_id',
          as: 'product'
        }
      },
      { $unwind: '$product' }
    ]);

    res.json({
      totalUsers,
      totalProducts,
      totalOrders,
      totalRevenue: Math.round(totalRevenue * 100) / 100,
      recentOrders,
      userGrowth,
      ordersByStatus,
      topProducts
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get seller dashboard stats
// @route   GET /api/dashboard/seller
// @access  Private/Seller
export const getSellerStats = async (req, res) => {
  try {
    const sellerId = req.user._id.toString();
    
    // Get seller's products
    const sellerProducts = await Product.find({ sellerId }).lean();
    const productIds = sellerProducts.map(p => p._id);
    
    // Get orders containing seller's products
    const sellerOrders = await Order.find({
      'orderItems.product': { $in: productIds }
    }).populate('user', 'name email').lean();
    
    // Calculate seller's revenue
    let sellerRevenue = 0;
    let totalItemsSold = 0;
    
    sellerOrders.forEach(order => {
      order.orderItems.forEach(item => {
        if (productIds.some(id => id.toString() === item.product.toString())) {
          sellerRevenue += item.price * item.quantity;
          totalItemsSold += item.quantity;
        }
      });
    });

    // Get recent orders for seller
    const recentOrders = sellerOrders
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 5);

    // Get low stock products
    const lowStockProducts = sellerProducts.filter(p => p.stock < 10);

    // Get orders by status for seller
    const ordersByStatus = {};
    sellerOrders.forEach(order => {
      ordersByStatus[order.status] = (ordersByStatus[order.status] || 0) + 1;
    });

    res.json({
      totalProducts: sellerProducts.length,
      totalOrders: sellerOrders.length,
      totalRevenue: Math.round(sellerRevenue * 100) / 100,
      totalItemsSold,
      recentOrders,
      lowStockProducts,
      ordersByStatus
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get delivery dashboard stats
// @route   GET /api/dashboard/delivery
// @access  Private/Delivery
export const getDeliveryStats = async (req, res) => {
  try {
    // Get all orders
    const allOrders = await Order.find()
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .lean();

    // Get orders by status
    const pendingOrders = allOrders.filter(order => order.status === 'pending');
    const processingOrders = allOrders.filter(order => order.status === 'processing');
    const shippedOrders = allOrders.filter(order => order.status === 'shipped');
    const deliveredOrders = allOrders.filter(order => order.status === 'delivered');

    // Get today's deliveries
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const todayDeliveries = allOrders.filter(order => {
      const orderDate = new Date(order.createdAt);
      return orderDate >= today && orderDate < tomorrow && order.status === 'delivered';
    });

    // Get orders that need to be delivered today (processing/shipped)
    const ordersToDeliver = allOrders.filter(order => 
      order.status === 'processing' || order.status === 'shipped'
    ).slice(0, 10);

    res.json({
      totalOrders: allOrders.length,
      pendingOrders: pendingOrders.length,
      processingOrders: processingOrders.length,
      shippedOrders: shippedOrders.length,
      deliveredOrders: deliveredOrders.length,
      todayDeliveries: todayDeliveries.length,
      ordersToDeliver,
      recentOrders: allOrders.slice(0, 10)
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user dashboard stats
// @route   GET /api/dashboard/user
// @access  Private
export const getUserStats = async (req, res) => {
  try {
    const userId = req.user._id;
    
    // Get user's orders
    const userOrders = await Order.find({ user: userId })
      .sort({ createdAt: -1 })
      .lean();

    // Get user's cart
    const user = await User.findById(userId)
      .populate('cart.product')
      .populate('wishlist')
      .lean();

    // Calculate total spent
    const totalSpent = userOrders.reduce((total, order) => total + order.totalPrice, 0);

    // Get orders by status
    const ordersByStatus = {};
    userOrders.forEach(order => {
      ordersByStatus[order.status] = (ordersByStatus[order.status] || 0) + 1;
    });

    // Get recent orders
    const recentOrders = userOrders.slice(0, 5);

    res.json({
      totalOrders: userOrders.length,
      totalSpent: Math.round(totalSpent * 100) / 100,
      cartItems: user.cart ? user.cart.length : 0,
      wishlistItems: user.wishlist ? user.wishlist.length : 0,
      ordersByStatus,
      recentOrders
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
