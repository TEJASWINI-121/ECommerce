import express from 'express';
import {
  getAdminStats,
  getSellerStats,
  getDeliveryStats,
  getUserStats
} from '../controllers/dashboardController.js';
import { protect, admin, seller, delivery } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/admin').get(protect, admin, getAdminStats);
router.route('/seller').get(protect, seller, getSellerStats);
router.route('/delivery').get(protect, delivery, getDeliveryStats);
router.route('/user').get(protect, getUserStats);

export default router;
