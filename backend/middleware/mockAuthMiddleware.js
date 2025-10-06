// Mock authentication middleware for development
export const mockProtect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];

      // Check if it's a mock token
      if (token.startsWith('mock-')) {
        // Handle mock tokens with valid MongoDB ObjectIds
        const mockUsers = {
          'mock-admin-token': { _id: '68e148ad94f84faabd3e821e', name: 'Admin User', email: 'admin@example.com', role: 'admin' },
          'mock-user-token': { _id: '68e148ad94f84faabd3e821f', name: 'John Doe', email: 'user@example.com', role: 'user' },
          'mock-seller-token': { _id: '68e148ad94f84faabd3e8220', name: 'Seller Smith', email: 'seller@example.com', role: 'seller' },
          'mock-delivery-token': { _id: '68e148ad94f84faabd3e8221', name: 'Delivery Agent', email: 'delivery@example.com', role: 'delivery' }
        };

        req.user = mockUsers[token];
        if (req.user) {
          next();
          return;
        }
      }

      // If not a mock token, try JWT verification
      const jwt = await import('jsonwebtoken');
      const decoded = jwt.default.verify(token, process.env.JWT_SECRET);
      
      // Get user from the token
      const User = (await import('../models/User.js')).default;
      req.user = await User.findById(decoded.id).select('-password');
      next();
    } catch (error) {
      console.error('Auth error:', error);
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};

export const mockAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(401).json({ message: 'Not authorized as an admin' });
  }
};
