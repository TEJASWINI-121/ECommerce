import express from 'express';
import {
  addOrderItems,
  getOrderById,
  updateOrderToPaid,
  updateOrderToDelivered,
  getMyOrders,
  getOrders,
  updateOrderStatus,
} from '../controllers/orderController.js';
import { protect, admin, seller, delivery } from '../middleware/authMiddleware.js';
import { mockProtect, mockAdmin } from '../middleware/mockAuthMiddleware.js';

const router = express.Router();

router.route('/').post(mockProtect, addOrderItems).get(mockProtect, mockAdmin, getOrders);
router.route('/myorders').get(protect, getMyOrders);
router.route('/:id').get(protect, getOrderById);
router.route('/:id/pay').put(protect, updateOrderToPaid);
router.route('/:id/deliver').put(protect, updateOrderToDelivered);
router.route('/:id/status').put(protect, updateOrderStatus);
router.route('/seller').get(protect, seller, getOrders);
router.route('/delivery').get(protect, delivery, getOrders);

export default router;