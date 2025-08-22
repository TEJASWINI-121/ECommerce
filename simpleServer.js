import express from 'express';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const app = express();
const PORT = 8000;

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Mock data
const MOCK_USERS = [
  {
    _id: 'admin123',
    name: 'Admin User',
    email: 'admin@example.com',
    password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // admin123
    role: 'admin'
  },
  {
    _id: 'user123',
    name: 'Regular User',
    email: 'user@example.com',
    password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // user123
    role: 'user'
  },
  {
    _id: 'seller123',
    name: 'Seller User',
    email: 'seller@example.com',
    password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // seller123
    role: 'seller'
  },
  {
    _id: 'delivery123',
    name: 'Delivery User',
    email: 'delivery@example.com',
    password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // delivery123
    role: 'delivery'
  }
];

const MOCK_PRODUCTS = [
  {
    _id: 'prod1',
    name: 'iPhone 15 Pro Max',
    description: 'Latest iPhone with A17 Pro chip, titanium design, and advanced camera system',
    price: 1199.99,
    originalPrice: 1299.99,
    category: 'electronics',
    brand: 'Apple',
    images: [
      'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&h=600&fit=crop'
    ],
    stock: 150,
    rating: 4.8,
    numReviews: 2847,
    featured: true,
    sellerId: 'seller123',
    sellerName: 'TechStore Pro'
  },
  {
    _id: 'prod2',
    name: 'Samsung Galaxy S24 Ultra',
    description: 'Premium Android smartphone with S Pen, 200MP camera, and AI features',
    price: 1099.99,
    originalPrice: 1199.99,
    category: 'electronics',
    brand: 'Samsung',
    images: [
      'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1574944985070-8f3ebc6b79d2?w=600&h=600&fit=crop'
    ],
    stock: 120,
    rating: 4.7,
    numReviews: 1923,
    featured: true,
    sellerId: 'seller123',
    sellerName: 'TechStore Pro'
  },
  {
    _id: 'prod3',
    name: 'Nike Air Max 270',
    description: 'Comfortable running shoes with Max Air unit and breathable mesh upper',
    price: 149.99,
    originalPrice: 179.99,
    category: 'fashion',
    brand: 'Nike',
    images: [
      'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=600&h=600&fit=crop'
    ],
    stock: 300,
    rating: 4.5,
    numReviews: 2156,
    featured: true,
    sellerId: 'seller123',
    sellerName: 'Fashion Hub'
  },
  {
    _id: 'prod4',
    name: 'The Ordinary Hyaluronic Acid',
    description: 'Multiple types of hyaluronic acid and vitamin B5 for intense hydration',
    price: 8.99,
    originalPrice: 12.99,
    category: 'beauty',
    brand: 'The Ordinary',
    images: [
      'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=600&h=600&fit=crop'
    ],
    stock: 450,
    rating: 4.6,
    numReviews: 15420,
    featured: true,
    sellerId: 'seller123',
    sellerName: 'Beauty World'
  },
  {
    _id: 'prod5',
    name: 'Instant Pot Duo 7-in-1',
    description: 'Multi-use programmable pressure cooker, slow cooker, rice cooker, and more',
    price: 99.99,
    originalPrice: 129.99,
    category: 'home-decor',
    brand: 'Instant Pot',
    images: [
      'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1585515656973-c0e8e4b0e8b8?w=600&h=600&fit=crop'
    ],
    stock: 120,
    rating: 4.6,
    numReviews: 8901,
    featured: true,
    sellerId: 'seller123',
    sellerName: 'TechStore Pro'
  },
  {
    _id: 'prod6',
    name: 'Yeti Rambler 20oz Tumbler',
    description: 'Insulated stainless steel tumbler that keeps drinks hot or cold',
    price: 39.99,
    originalPrice: 44.99,
    category: 'sports',
    brand: 'Yeti',
    images: [
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=600&h=600&fit=crop'
    ],
    stock: 300,
    rating: 4.7,
    numReviews: 2345,
    featured: false,
    sellerId: 'seller123',
    sellerName: 'Fashion Hub'
  }
];

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, 'your-secret-key', { expiresIn: '30d' });
};

// Auth middleware
const protect = (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, 'your-secret-key');
      req.user = MOCK_USERS.find(user => user._id === decoded.id);
      next();
    } catch (error) {
      res.status(401).json({ message: 'Not authorized' });
    }
  } else {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'Simple E-commerce API is running!' });
});

// Auth routes
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password, role = 'user' } = req.body;
    
    // Check if user exists
    const userExists = MOCK_USERS.find(user => user.email === email);
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const newUser = {
      _id: `user_${Date.now()}`,
      name,
      email,
      password: hashedPassword,
      role
    };

    MOCK_USERS.push(newUser);

    res.status(201).json({
      _id: newUser._id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      token: generateToken(newUser._id)
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Find user
    const user = MOCK_USERS.find(user => user.email === email);
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id)
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Product routes
app.get('/api/products', (req, res) => {
  const { category, search, page = 1, limit = 12 } = req.query;
  let filteredProducts = [...MOCK_PRODUCTS];

  if (category && category !== 'all') {
    filteredProducts = filteredProducts.filter(product => product.category === category);
  }

  if (search) {
    filteredProducts = filteredProducts.filter(product =>
      product.name.toLowerCase().includes(search.toLowerCase()) ||
      product.description.toLowerCase().includes(search.toLowerCase())
    );
  }

  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + parseInt(limit);
  const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

  res.json({
    products: paginatedProducts,
    totalProducts: filteredProducts.length,
    totalPages: Math.ceil(filteredProducts.length / limit),
    currentPage: parseInt(page)
  });
});

app.get('/api/products/:id', (req, res) => {
  const product = MOCK_PRODUCTS.find(p => p._id === req.params.id);
  if (product) {
    res.json(product);
  } else {
    res.status(404).json({ message: 'Product not found' });
  }
});

// User routes
app.get('/api/users/cart', protect, (req, res) => {
  res.json([]);
});

app.post('/api/users/cart', protect, (req, res) => {
  res.json({ message: 'Added to cart' });
});

app.get('/api/users/wishlist', protect, (req, res) => {
  res.json([]);
});

app.post('/api/users/wishlist', protect, (req, res) => {
  res.json({ message: 'Added to wishlist' });
});

// Order routes
app.post('/api/orders', protect, (req, res) => {
  const order = {
    _id: `order_${Date.now()}`,
    user: req.user._id,
    orderItems: req.body.orderItems || [],
    shippingAddress: req.body.shippingAddress,
    paymentMethod: req.body.paymentMethod,
    totalPrice: req.body.totalPrice || 0,
    status: 'pending',
    createdAt: new Date().toISOString()
  };
  
  res.status(201).json(order);
});

app.listen(PORT, () => {
  console.log(`Simple server running on port ${PORT}`);
});
