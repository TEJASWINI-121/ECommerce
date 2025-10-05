import express from 'express';
import { getAdminStats } from '../controllers/adminController.js';

const router = express.Router();

// Public admin stats endpoint (for demo purposes)
router.route('/stats').get(getAdminStats);

export default router;
