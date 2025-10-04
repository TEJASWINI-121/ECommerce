import express from 'express';
import { protect, seller } from '../middleware/authMiddleware.js';
import { getSellerStats } from '../controllers/dashboardController.js';
import { getOrders, updateOrderStatus } from '../controllers/orderController.js';

const router = express.Router();

// Get seller dashboard stats
router.route('/stats').get(protect, seller, getSellerStats);

// Get seller's products
router.route('/products').get(protect, seller, (req, res) => {
  // This would be implemented in a productController
  res.json({ message: 'Seller products endpoint' });
});

// Get orders for seller's products
router.route('/orders').get(protect, seller, getOrders);

// Update order status (ready to ship, shipped)
router.route('/order/update-status').put(protect, seller, updateOrderStatus);

export default router;