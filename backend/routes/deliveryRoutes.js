import express from 'express';
import { protect, delivery } from '../middleware/authMiddleware.js';
import { getDeliveryStats } from '../controllers/dashboardController.js';
import { getOrders, updateOrderStatus } from '../controllers/orderController.js';

const router = express.Router();

// Get delivery dashboard stats
router.route('/stats').get(protect, delivery, getDeliveryStats);

// Get orders assigned to delivery agent
router.route('/orders').get(protect, delivery, getOrders);

// Update order status (picked up, in transit, delivered)
router.route('/order/update-status').put(protect, delivery, updateOrderStatus);

export default router;