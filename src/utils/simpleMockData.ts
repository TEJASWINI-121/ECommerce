// Simple mock data for immediate functionality
export interface MockProduct {
  _id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  category: string;
  brand: string;
  images: string[];
  stock: number;
  rating: number;
  numReviews: number;
  featured: boolean;
  sellerId: string;
  sellerName: string;
  createdAt: string;
}

export const SIMPLE_MOCK_PRODUCTS: MockProduct[] = [
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
    sellerId: 'seller1',
    sellerName: 'TechStore Pro',
    createdAt: new Date().toISOString()
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
    sellerId: 'seller1',
    sellerName: 'TechStore Pro',
    createdAt: new Date().toISOString()
  },
  {
    _id: 'prod3',
    name: 'MacBook Pro 16-inch M3',
    description: 'Powerful laptop with M3 chip, 18GB RAM, and stunning Liquid Retina XDR display',
    price: 2499.99,
    originalPrice: 2699.99,
    category: 'electronics',
    brand: 'Apple',
    images: [
      'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=600&h=600&fit=crop'
    ],
    stock: 85,
    rating: 4.9,
    numReviews: 1456,
    featured: true,
    sellerId: 'seller1',
    sellerName: 'TechStore Pro',
    createdAt: new Date().toISOString()
  },
  {
    _id: 'prod4',
    name: 'Nike Air Max 270',
    description: 'Comfortable running shoes with Max Air unit and breathable mesh upper',
    price: 149.99,
    originalPrice: 179.99,
    category: 'clothing',
    brand: 'Nike',
    images: [
      'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=600&h=600&fit=crop'
    ],
    stock: 300,
    rating: 4.5,
    numReviews: 2156,
    featured: true,
    sellerId: 'seller2',
    sellerName: 'Fashion Hub',
    createdAt: new Date().toISOString()
  },
  {
    _id: 'prod5',
    name: 'Levi\'s 501 Original Jeans',
    description: 'Classic straight-leg jeans with authentic fit and timeless style',
    price: 89.99,
    originalPrice: 109.99,
    category: 'clothing',
    brand: 'Levi\'s',
    images: [
      'https://images.unsplash.com/photo-1542272604-787c3835535d?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=600&h=600&fit=crop'
    ],
    stock: 250,
    rating: 4.4,
    numReviews: 3421,
    featured: false,
    sellerId: 'seller2',
    sellerName: 'Fashion Hub',
    createdAt: new Date().toISOString()
  },
  {
    _id: 'prod6',
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
    sellerId: 'seller3',
    sellerName: 'Beauty World',
    createdAt: new Date().toISOString()
  },
  {
    _id: 'prod7',
    name: 'CeraVe Hydrating Cleanser',
    description: 'Gentle foaming cleanser with ceramides and hyaluronic acid for all skin types',
    price: 16.99,
    originalPrice: 19.99,
    category: 'beauty',
    brand: 'CeraVe',
    images: [
      'https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=600&h=600&fit=crop'
    ],
    stock: 380,
    rating: 4.7,
    numReviews: 8934,
    featured: false,
    sellerId: 'seller3',
    sellerName: 'Beauty World',
    createdAt: new Date().toISOString()
  },
  {
    _id: 'prod8',
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
    sellerId: 'seller1',
    sellerName: 'TechStore Pro',
    createdAt: new Date().toISOString()
  },
  {
    _id: 'prod9',
    name: 'KitchenAid Stand Mixer',
    description: 'Professional 5-quart stand mixer with 10 speeds and multiple attachments',
    price: 379.99,
    originalPrice: 429.99,
    category: 'home-decor',
    brand: 'KitchenAid',
    images: [
      'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&h=600&fit=crop'
    ],
    stock: 60,
    rating: 4.9,
    numReviews: 4567,
    featured: true,
    sellerId: 'seller1',
    sellerName: 'TechStore Pro',
    createdAt: new Date().toISOString()
  },
  {
    _id: 'prod10',
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
    sellerId: 'seller2',
    sellerName: 'Fashion Hub',
    createdAt: new Date().toISOString()
  },
  {
    _id: 'prod11',
    name: 'Fitbit Charge 5 Fitness Tracker',
    description: 'Advanced fitness tracker with built-in GPS, heart rate monitoring, and 7-day battery',
    price: 179.99,
    originalPrice: 199.99,
    category: 'sports',
    brand: 'Fitbit',
    images: [
      'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=600&h=600&fit=crop'
    ],
    stock: 150,
    rating: 4.4,
    numReviews: 6789,
    featured: true,
    sellerId: 'seller1',
    sellerName: 'TechStore Pro',
    createdAt: new Date().toISOString()
  }
];

export const MOCK_PRODUCTS = SIMPLE_MOCK_PRODUCTS;

// API configuration
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';
