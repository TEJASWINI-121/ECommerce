import express from 'express';
import {
  getUserProfile,
  updateUserProfile,
  addToCart,
  getCart,
  removeFromCart,
  clearCart,
  addToWishlist,
  getWishlist,
  removeFromWishlist,
  getUsers,
  deleteUser,
  updateUserRole,
} from '../controllers/userController.js';
import { protect, admin } from '../middleware/authMiddleware.js';
import { mockProtect, mockAdmin } from '../middleware/mockAuthMiddleware.js';

const router = express.Router();

router.route('/').get(mockProtect, mockAdmin, getUsers);
router.route('/profile').get(protect, getUserProfile).put(protect, updateUserProfile);
router.route('/cart')
  .get(protect, getCart)
  .post(protect, addToCart)
  .delete(protect, clearCart);
router.route('/cart/:productId').delete(protect, removeFromCart);
router.route('/wishlist')
  .get(protect, getWishlist)
  .post(protect, addToWishlist);
router.route('/wishlist/:productId').delete(protect, removeFromWishlist);
router.route('/:id').delete(protect, admin, deleteUser);
router.route('/:id/role').put(protect, admin, updateUserRole);

export default router;