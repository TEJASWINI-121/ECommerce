import express from 'express';

const router = express.Router();

// @desc    Health check endpoint
// @route   GET /api/health
// @access  Public
router.get('/', (req, res) => {
  res.status(200).json({
    status: 'OK',
    message: 'ShopEase Backend is running',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development'
  });
});

export default router;
