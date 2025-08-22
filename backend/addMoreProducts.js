import mongoose from 'mongoose';
import Product from './models/Product.js';
import dotenv from 'dotenv';

dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ecommerce');

// Additional products with unique images
const ADDITIONAL_PRODUCTS = [
  // More Electronics
  {
    name: 'Dell XPS 13 Laptop',
    description: 'Ultra-portable laptop with Intel Core i7, 16GB RAM, and stunning InfinityEdge display',
    price: 1299.99,
    originalPrice: 1499.99,
    category: 'electronics',
    brand: 'Dell',
    images: [
      'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1542393545-10f5cde2c810?w=600&h=600&fit=crop'
    ],
    stock: 75,
    rating: 4.6,
    numReviews: 892,
    featured: false,
    sellerId: 'seller1',
    sellerName: 'TechStore Pro'
  },
  {
    name: 'AirPods Pro 2nd Generation',
    description: 'Wireless earbuds with active noise cancellation and spatial audio',
    price: 249.99,
    originalPrice: 279.99,
    category: 'electronics',
    brand: 'Apple',
    images: [
      'https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600&h=600&fit=crop'
    ],
    stock: 200,
    rating: 4.7,
    numReviews: 3456,
    featured: true,
    sellerId: 'seller1',
    sellerName: 'TechStore Pro'
  },

  // More Fashion
  {
    name: 'Champion Reverse Weave Hoodie',
    description: 'Classic pullover hoodie with iconic Champion logo and comfortable fit',
    price: 79.99,
    originalPrice: 99.99,
    category: 'fashion',
    brand: 'Champion',
    images: [
      'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&h=600&fit=crop'
    ],
    stock: 150,
    rating: 4.3,
    numReviews: 1234,
    featured: false,
    sellerId: 'seller2',
    sellerName: 'Fashion Hub'
  },
  {
    name: 'Ray-Ban Aviator Sunglasses',
    description: 'Classic aviator sunglasses with gold frame and green lenses',
    price: 154.99,
    originalPrice: 179.99,
    category: 'fashion',
    brand: 'Ray-Ban',
    images: [
      'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1473496169904-658ba7c44d8a?w=600&h=600&fit=crop'
    ],
    stock: 100,
    rating: 4.8,
    numReviews: 2567,
    featured: true,
    sellerId: 'seller2',
    sellerName: 'Fashion Hub'
  },

  // More Beauty
  {
    name: 'Neutrogena Hydro Boost Water Gel',
    description: 'Oil-free moisturizer with hyaluronic acid for 72-hour hydration',
    price: 19.99,
    originalPrice: 24.99,
    category: 'beauty',
    brand: 'Neutrogena',
    images: [
      'https://images.unsplash.com/photo-1570194065650-d99fb4bedf0a?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=600&h=600&fit=crop'
    ],
    stock: 280,
    rating: 4.4,
    numReviews: 5678,
    featured: false,
    sellerId: 'seller3',
    sellerName: 'Beauty World'
  },
  {
    name: 'Olay Regenerist Micro-Sculpting Cream',
    description: 'Anti-aging moisturizer with amino-peptides and niacinamide',
    price: 28.99,
    originalPrice: 34.99,
    category: 'beauty',
    brand: 'Olay',
    images: [
      'https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1570194065650-d99fb4bedf0a?w=600&h=600&fit=crop'
    ],
    stock: 190,
    rating: 4.5,
    numReviews: 3421,
    featured: true,
    sellerId: 'seller3',
    sellerName: 'Beauty World'
  },

  // Home & Kitchen
  {
    name: 'Instant Pot Duo 7-in-1 Pressure Cooker',
    description: 'Multi-use programmable pressure cooker, slow cooker, rice cooker, and more',
    price: 99.99,
    originalPrice: 129.99,
    category: 'home-decor',
    brand: 'Instant Pot',
    images: [
      'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&h=600&fit=crop'
    ],
    stock: 120,
    rating: 4.6,
    numReviews: 8901,
    featured: true,
    sellerId: 'seller1',
    sellerName: 'TechStore Pro'
  },
  {
    name: 'KitchenAid Stand Mixer',
    description: 'Professional 5-quart stand mixer with 10 speeds and multiple attachments',
    price: 379.99,
    originalPrice: 429.99,
    category: 'home-decor',
    brand: 'KitchenAid',
    images: [
      'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&h=600&fit=crop'
    ],
    stock: 60,
    rating: 4.9,
    numReviews: 4567,
    featured: true,
    sellerId: 'seller1',
    sellerName: 'TechStore Pro'
  },

  // Sports & Fitness
  {
    name: 'Yeti Rambler 20oz Tumbler',
    description: 'Insulated stainless steel tumbler that keeps drinks hot or cold',
    price: 39.99,
    originalPrice: 44.99,
    category: 'sports',
    brand: 'Yeti',
    images: [
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&h=600&fit=crop'
    ],
    stock: 300,
    rating: 4.7,
    numReviews: 2345,
    featured: false,
    sellerId: 'seller2',
    sellerName: 'Fashion Hub'
  },
  {
    name: 'Fitbit Charge 5 Fitness Tracker',
    description: 'Advanced fitness tracker with built-in GPS, heart rate monitoring, and 7-day battery',
    price: 179.99,
    originalPrice: 199.99,
    category: 'sports',
    brand: 'Fitbit',
    images: [
      'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&h=600&fit=crop'
    ],
    stock: 150,
    rating: 4.4,
    numReviews: 6789,
    featured: true,
    sellerId: 'seller1',
    sellerName: 'TechStore Pro'
  }
];

const addProducts = async () => {
  try {
    console.log('🚀 Adding more products to database...');

    // Add products
    const createdProducts = await Product.insertMany(ADDITIONAL_PRODUCTS);
    console.log(`✅ Added ${createdProducts.length} more products`);

    // Get total count
    const totalProducts = await Product.countDocuments();
    console.log(`📊 Total products in database: ${totalProducts}`);

    console.log('🎉 Successfully expanded product catalog!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error adding products:', error);
    process.exit(1);
  }
};

addProducts();
