import mongoose from 'mongoose';
import Product from './models/Product.js';
import User from './models/User.js';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ecommerce');

// High-quality products with unique images
const PRODUCTS = [
  // Electronics
  {
    name: 'iPhone 15 Pro Max',
    description: 'Latest iPhone with A17 Pro chip, titanium design, and advanced camera system',
    price: 1199.99,
    originalPrice: 1299.99,
    category: 'electronics',
    brand: 'Apple',
    images: [
      'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1605236453806-6ff36851218e?w=600&h=600&fit=crop'
    ],
    stock: 150,
    rating: 4.8,
    numReviews: 2847,
    featured: true,
    sellerId: 'seller1',
    sellerName: 'TechStore Pro'
  },
  {
    name: 'Samsung Galaxy S24 Ultra',
    description: 'Premium Android smartphone with S Pen, 200MP camera, and AI features',
    price: 1099.99,
    originalPrice: 1199.99,
    category: 'electronics',
    brand: 'Samsung',
    images: [
      'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1574944985070-8f3ebc6b79d2?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=600&h=600&fit=crop'
    ],
    stock: 120,
    rating: 4.7,
    numReviews: 1923,
    featured: true,
    sellerId: 'seller1',
    sellerName: 'TechStore Pro'
  },
  {
    name: 'MacBook Pro 16-inch M3',
    description: 'Professional laptop with M3 chip, 18-hour battery life, and Liquid Retina XDR display',
    price: 2499.99,
    originalPrice: 2699.99,
    category: 'electronics',
    brand: 'Apple',
    images: [
      'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1484788984921-03950022c9ef?w=600&h=600&fit=crop'
    ],
    stock: 85,
    rating: 4.9,
    numReviews: 1456,
    featured: true,
    sellerId: 'seller1',
    sellerName: 'TechStore Pro'
  },
  {
    name: 'Sony WH-1000XM5 Headphones',
    description: 'Industry-leading noise canceling wireless headphones with 30-hour battery',
    price: 349.99,
    originalPrice: 399.99,
    category: 'electronics',
    brand: 'Sony',
    images: [
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=600&h=600&fit=crop'
    ],
    stock: 200,
    rating: 4.6,
    numReviews: 3421,
    featured: false,
    sellerId: 'seller1',
    sellerName: 'TechStore Pro'
  },
  {
    name: 'iPad Pro 12.9-inch M2',
    description: 'Most advanced iPad with M2 chip, Liquid Retina XDR display, and Apple Pencil support',
    price: 1099.99,
    originalPrice: 1199.99,
    category: 'electronics',
    brand: 'Apple',
    images: [
      'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?w=600&h=600&fit=crop'
    ],
    stock: 95,
    rating: 4.8,
    numReviews: 987,
    featured: true,
    sellerId: 'seller1',
    sellerName: 'TechStore Pro'
  },

  // Fashion
  {
    name: 'Nike Air Max 270',
    description: 'Comfortable running shoes with Max Air unit and breathable mesh upper',
    price: 149.99,
    originalPrice: 179.99,
    category: 'fashion',
    brand: 'Nike',
    images: [
      'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=600&h=600&fit=crop'
    ],
    stock: 300,
    rating: 4.5,
    numReviews: 2156,
    featured: true,
    sellerId: 'seller2',
    sellerName: 'Fashion Hub'
  },
  {
    name: 'Levi\'s 501 Original Jeans',
    description: 'Classic straight-leg jeans with authentic fit and timeless style',
    price: 89.99,
    originalPrice: 109.99,
    category: 'fashion',
    brand: 'Levi\'s',
    images: [
      'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1566479179817-c0b5b4b4b1e8?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=600&h=600&fit=crop'
    ],
    stock: 250,
    rating: 4.4,
    numReviews: 1834,
    featured: false,
    sellerId: 'seller2',
    sellerName: 'Fashion Hub'
  },
  {
    name: 'Adidas Ultraboost 22',
    description: 'Premium running shoes with Boost midsole and Primeknit upper',
    price: 189.99,
    originalPrice: 219.99,
    category: 'fashion',
    brand: 'Adidas',
    images: [
      'https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1520639888713-7851133b1ed0?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1608256246200-53e635b5b65f?w=600&h=600&fit=crop'
    ],
    stock: 180,
    rating: 4.7,
    numReviews: 1567,
    featured: true,
    sellerId: 'seller2',
    sellerName: 'Fashion Hub'
  },

  // Beauty
  {
    name: 'The Ordinary Hyaluronic Acid 2% + B5',
    description: 'Multiple types of hyaluronic acid and vitamin B5 for intense hydration',
    price: 8.99,
    originalPrice: 12.99,
    category: 'beauty',
    brand: 'The Ordinary',
    images: [
      'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600&h=600&fit=crop'
    ],
    stock: 450,
    rating: 4.6,
    numReviews: 15420,
    featured: true,
    sellerId: 'seller3',
    sellerName: 'Beauty World'
  },
  {
    name: 'CeraVe Hydrating Cleanser',
    description: 'Gentle, non-foaming cleanser with ceramides and hyaluronic acid',
    price: 15.99,
    originalPrice: 19.99,
    category: 'beauty',
    brand: 'CeraVe',
    images: [
      'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1612817288484-6f916006741a?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600&h=600&fit=crop'
    ],
    stock: 320,
    rating: 4.5,
    numReviews: 8934,
    featured: false,
    sellerId: 'seller3',
    sellerName: 'Beauty World'
  }
];

// Users data
const USERS = [
  {
    name: 'Admin User',
    email: 'admin@example.com',
    password: 'admin123',
    role: 'admin'
  },
  {
    name: 'Regular User',
    email: 'user@example.com',
    password: 'user123',
    role: 'user'
  },
  {
    name: 'Seller User',
    email: 'seller@example.com',
    password: 'seller123',
    role: 'seller'
  },
  {
    name: 'Delivery User',
    email: 'delivery@example.com',
    password: 'delivery123',
    role: 'delivery'
  }
];

const seedDatabase = async () => {
  try {
    console.log('🚀 Starting clean database seeding...');

    // Clear existing data
    console.log('🗑️  Clearing existing data...');
    await Product.deleteMany({});
    await User.deleteMany({});

    // Create users
    console.log('👥 Creating users...');
    const createdUsers = [];
    for (const userData of USERS) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(userData.password, salt);
      
      const user = await User.create({
        ...userData,
        password: hashedPassword
      });
      createdUsers.push(user);
    }
    console.log(`✅ Created ${createdUsers.length} users`);

    // Create products
    console.log('📦 Creating products...');
    const createdProducts = await Product.insertMany(PRODUCTS);
    console.log(`✅ Created ${createdProducts.length} products`);

    console.log('🎉 Clean database seeding completed successfully!');
    console.log('📊 Summary:');
    console.log(`   Users: ${createdUsers.length}`);
    console.log(`   Products: ${createdProducts.length}`);
    console.log('🚀 Database is now clean and ready!');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
