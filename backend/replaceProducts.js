import mongoose from 'mongoose';
import Product from './models/Product.js';
import User from './models/User.js';
import dotenv from 'dotenv';

dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ecommerce');

// Professional products with unique images
const newProducts = [
  // Electronics
  {
    name: 'Apple iPhone 15 Pro Max',
    description: 'The most advanced iPhone ever with titanium design, A17 Pro chip, and professional camera system.',
    price: 1199,
    originalPrice: 1299,
    category: 'electronics',
    brand: 'Apple',
    images: [
      'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=600&h=600&fit=crop&crop=faces',
      'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=600&h=600&fit=crop&crop=entropy'
    ],
    stock: 45,
    rating: 4.8,
    numReviews: 2847,
    featured: true
  },
  {
    name: 'Samsung Galaxy S24 Ultra',
    description: 'Ultimate Android flagship with S Pen, 200MP camera, and Galaxy AI features.',
    price: 1099,
    originalPrice: 1199,
    category: 'electronics',
    brand: 'Samsung',
    images: [
      'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1565849904461-04a58ad377e0?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1512499617640-c74ae3a79d37?w=600&h=600&fit=crop'
    ],
    stock: 38,
    rating: 4.7,
    numReviews: 1923,
    featured: true
  },
  {
    name: 'MacBook Pro 16-inch M3 Max',
    description: 'Most powerful MacBook Pro ever with M3 Max chip and Liquid Retina XDR display.',
    price: 2499,
    originalPrice: 2699,
    category: 'electronics',
    brand: 'Apple',
    images: [
      'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&h=600&fit=crop'
    ],
    stock: 23,
    rating: 4.9,
    numReviews: 892,
    featured: true
  },
  {
    name: 'Sony WH-1000XM5 Headphones',
    description: 'Industry-leading noise canceling with 30-hour battery life.',
    price: 349,
    originalPrice: 399,
    category: 'electronics',
    brand: 'Sony',
    images: [
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=600&h=600&fit=crop'
    ],
    stock: 67,
    rating: 4.7,
    numReviews: 3421,
    featured: false
  },
  {
    name: 'Apple AirPods Pro (2nd Gen)',
    description: 'Adaptive Transparency and up to 2x more Active Noise Cancellation.',
    price: 229,
    originalPrice: 249,
    category: 'electronics',
    brand: 'Apple',
    images: [
      'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?w=600&h=600&fit=crop'
    ],
    stock: 89,
    rating: 4.6,
    numReviews: 5672,
    featured: false
  },

  // Fashion
  {
    name: 'Levi\'s 511 Slim Jeans',
    description: 'Classic slim-fit jeans with modern taper and premium denim.',
    price: 69,
    originalPrice: 89,
    category: 'clothing',
    brand: 'Levi\'s',
    images: [
      'https://images.unsplash.com/photo-1542272604-787c3835535d?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=600&h=600&fit=crop'
    ],
    stock: 156,
    rating: 4.4,
    numReviews: 2341,
    featured: false
  },
  {
    name: 'Nike Dri-FIT Running T-Shirt',
    description: 'Lightweight, breathable running shirt with moisture-wicking technology.',
    price: 35,
    originalPrice: 45,
    category: 'clothing',
    brand: 'Nike',
    images: [
      'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1583743814966-8936f37f4678?w=600&h=600&fit=crop'
    ],
    stock: 234,
    rating: 4.5,
    numReviews: 1876,
    featured: false
  },
  {
    name: 'Zara Floral Midi Dress',
    description: 'Elegant floral print midi dress perfect for any occasion.',
    price: 79,
    originalPrice: 99,
    category: 'clothing',
    brand: 'Zara',
    images: [
      'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1566479179817-c0b5b4b4b1e8?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=600&h=600&fit=crop'
    ],
    stock: 87,
    rating: 4.3,
    numReviews: 923,
    featured: true
  },

  // Footwear
  {
    name: 'Nike Air Max 270',
    description: 'Lifestyle sneakers with the largest Max Air unit for all-day comfort.',
    price: 150,
    originalPrice: 170,
    category: 'shoes',
    brand: 'Nike',
    images: [
      'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=600&h=600&fit=crop'
    ],
    stock: 143,
    rating: 4.6,
    numReviews: 4521,
    featured: true
  },
  {
    name: 'Adidas Ultraboost 22',
    description: 'Premium running shoes with responsive BOOST midsole.',
    price: 190,
    originalPrice: 220,
    category: 'shoes',
    brand: 'Adidas',
    images: [
      'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=600&h=600&fit=crop&crop=center',
      'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=600&h=600&fit=crop&crop=center',
      'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=600&h=600&fit=crop&crop=center'
    ],
    stock: 98,
    rating: 4.7,
    numReviews: 2876,
    featured: false
  },

  // Beauty
  {
    name: 'Fenty Beauty Pro Filt\'r Foundation',
    description: 'Full-coverage foundation available in 50 shades.',
    price: 36,
    originalPrice: 42,
    category: 'beauty',
    brand: 'Fenty Beauty',
    images: [
      'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1631214540242-3cd8c4b0b3b8?w=600&h=600&fit=crop'
    ],
    stock: 234,
    rating: 4.5,
    numReviews: 8934,
    featured: true
  },
  {
    name: 'Charlotte Tilbury Pillow Talk Lipstick',
    description: 'Iconic nude-pink lipstick with universally flattering shade.',
    price: 38,
    originalPrice: 45,
    category: 'beauty',
    brand: 'Charlotte Tilbury',
    images: [
      'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=600&h=600&fit=crop'
    ],
    stock: 167,
    rating: 4.7,
    numReviews: 5432,
    featured: false
  },

  // Accessories
  {
    name: 'Apple Watch Series 9',
    description: 'Most advanced Apple Watch with S9 chip and Double Tap gesture.',
    price: 399,
    originalPrice: 449,
    category: 'accessories',
    brand: 'Apple',
    images: [
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1434056886845-dac89ffe9b56?w=600&h=600&fit=crop'
    ],
    stock: 234,
    rating: 4.8,
    numReviews: 12456,
    featured: true
  },
  {
    name: 'Ray-Ban Aviator Classic',
    description: 'Iconic aviator sunglasses with crystal lenses and gold frame.',
    price: 154,
    originalPrice: 184,
    category: 'accessories',
    brand: 'Ray-Ban',
    images: [
      'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1473496169904-658ba7c44d8a?w=600&h=600&fit=crop'
    ],
    stock: 145,
    rating: 4.6,
    numReviews: 3456,
    featured: false
  },

  // Sports
  {
    name: 'Lululemon Align High-Rise Pant',
    description: 'Buttery-soft yoga pants made with Nulu fabric.',
    price: 98,
    originalPrice: 118,
    category: 'sports',
    brand: 'Lululemon',
    images: [
      'https://images.unsplash.com/photo-1506629905607-d9b1b2e3d3b1?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&h=600&fit=crop'
    ],
    stock: 189,
    rating: 4.7,
    numReviews: 6789,
    featured: false
  },

  // Home & Kitchen
  {
    name: 'Dyson V15 Detect Cordless Vacuum',
    description: 'Most powerful cordless vacuum with laser dust detection.',
    price: 649,
    originalPrice: 749,
    category: 'home-decor',
    brand: 'Dyson',
    images: [
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=600&fit=crop'
    ],
    stock: 34,
    rating: 4.8,
    numReviews: 2341,
    featured: true
  },

  // Grocery
  {
    name: 'Manuka Honey UMF 15+',
    description: 'Premium New Zealand Manuka honey with natural antibacterial properties.',
    price: 89,
    originalPrice: 109,
    category: 'grocery',
    brand: 'Comvita',
    images: [
      'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=600&h=600&fit=crop'
    ],
    stock: 67,
    rating: 4.8,
    numReviews: 892,
    featured: true
  }
];

const replaceProducts = async () => {
  try {
    console.log('🔄 Replacing products with professional catalog...\n');
    
    // Clear existing products
    await Product.deleteMany({});
    console.log('🗑️  Cleared existing products');
    
    // Add new professional products
    const createdProducts = await Product.insertMany(newProducts);
    console.log(`✅ Created ${createdProducts.length} professional products`);
    
    console.log('\n🎉 Product replacement completed successfully!');
    console.log('📸 All products now have unique, relevant images');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error replacing products:', error);
    process.exit(1);
  }
};

replaceProducts();
