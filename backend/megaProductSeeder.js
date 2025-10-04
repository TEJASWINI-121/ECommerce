import mongoose from 'mongoose';
import Product from './models/Product.js';
import dotenv from 'dotenv';

dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ecommerce');

// Comprehensive product data with unique images
const categories = ['electronics', 'clothing', 'shoes', 'accessories', 'home-decor', 'beauty', 'sports', 'grocery'];
const brands = {
  electronics: ['Apple', 'Samsung', 'Sony', 'LG', 'Dell', 'HP', 'Lenovo', 'Asus', 'Microsoft', 'Google', 'OnePlus', 'Xiaomi', 'Huawei', 'Canon', 'Nikon'],
  clothing: ['Nike', 'Adidas', 'Zara', 'H&M', 'Uniqlo', 'Levis', 'Calvin Klein', 'Tommy Hilfiger', 'Ralph Lauren', 'Gap', 'Forever 21', 'Mango', 'Puma', 'Under Armour', 'Champion'],
  shoes: ['Nike', 'Adidas', 'Converse', 'Vans', 'New Balance', 'Puma', 'Reebok', 'Jordan', 'Timberland', 'Dr. Martens', 'Sketchers', 'Fila', 'Asics', 'Brooks', 'Allbirds'],
  accessories: ['Coach', 'Michael Kors', 'Ray-Ban', 'Oakley', 'Fossil', 'Casio', 'Rolex', 'Gucci', 'Louis Vuitton', 'Prada', 'Hermès', 'Chanel', 'Tiffany & Co', 'Pandora', 'Swarovski'],
  'home-decor': ['IKEA', 'West Elm', 'Pottery Barn', 'CB2', 'Article', 'Wayfair', 'Target', 'HomeGoods', 'Crate & Barrel', 'Williams Sonoma', 'Restoration Hardware', 'Urban Outfitters', 'Anthropologie', 'World Market', 'Pier 1'],
  beauty: ['LOreal', 'Maybelline', 'MAC', 'NARS', 'Clinique', 'Estee Lauder', 'Sephora', 'Urban Decay', 'Too Faced', 'Fenty Beauty', 'Rare Beauty', 'Glossier', 'The Ordinary', 'CeraVe', 'Neutrogena'],
  sports: ['Nike', 'Adidas', 'Under Armour', 'Puma', 'Reebok', 'Wilson', 'Spalding', 'Callaway', 'TaylorMade', 'Ping', 'Yonex', 'Head', 'Babolat', 'Dunlop', 'Prince'],
  grocery: ['Whole Foods', 'Organic Valley', 'Trader Joes', 'Kirkland', 'Great Value', 'Simply Organic', 'Annie\'s', 'Kind', 'Clif Bar', 'Nature Valley', 'Quaker', 'Kellogg\'s', 'General Mills', 'Pepsi', 'Coca Cola']
};

// High-quality, working image collections for each category
const imageCollections = {
  electronics: [
    'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500&h=500&fit=crop&auto=format&q=80',
    'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&h=500&fit=crop&auto=format&q=80',
    'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&h=500&fit=crop&auto=format&q=80',
    'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=500&h=500&fit=crop&auto=format&q=80',
    'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=500&h=500&fit=crop&auto=format&q=80',
    'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=500&h=500&fit=crop&auto=format&q=80',
    'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=500&h=500&fit=crop&auto=format&q=80',
    'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=500&h=500&fit=crop&auto=format&q=80',
    'https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=500&h=500&fit=crop&auto=format&q=80',
    'https://images.unsplash.com/photo-1515378791036-0648a814c963?w=500&h=500&fit=crop&auto=format&q=80',
    'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=500&h=500&fit=crop&auto=format&q=80',
    'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500&h=500&fit=crop&auto=format&q=80',
    'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500&h=500&fit=crop&auto=format&q=80',
    'https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=500&h=500&fit=crop&auto=format&q=80',
    'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=500&h=500&fit=crop&auto=format&q=80',
    'https://images.unsplash.com/photo-1512499617640-c74ae3a79d37?w=500&h=500&fit=crop&auto=format&q=80',
    'https://images.unsplash.com/photo-1606983340126-99ab4feaa64a?w=500&h=500&fit=crop&auto=format&q=80',
    'https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=500&h=500&fit=crop&auto=format&q=80',
    'https://images.unsplash.com/photo-1555774698-0b77e0d5fac6?w=500&h=500&fit=crop&auto=format&q=80',
    'https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=500&h=500&fit=crop&auto=format&q=80'
  ],
  clothing: [
    'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&h=600&fit=crop&auto=format&q=80',
    'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=600&h=600&fit=crop&auto=format&q=80',
    'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=600&h=600&fit=crop&auto=format&q=80',
    'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=600&h=600&fit=crop&auto=format&q=80',
    'https://images.unsplash.com/photo-1485230895905-ec40ba36b9bc?w=600&h=600&fit=crop&auto=format&q=80',
    'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&h=600&fit=crop&auto=format&q=80',
    'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=600&h=600&fit=crop&auto=format&q=80',
    'https://images.unsplash.com/photo-1571945153237-4929e783af4a?w=600&h=600&fit=crop&auto=format&q=80',
    'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600&h=600&fit=crop&auto=format&q=80',
    'https://images.unsplash.com/photo-1562157873-818bc0726f68?w=600&h=600&fit=crop&auto=format&q=80',
    'https://images.unsplash.com/photo-1564584217132-2271feaeb3c5?w=600&h=600&fit=crop&auto=format&q=80',
    'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&h=600&fit=crop&auto=format&q=80',
    'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=600&h=600&fit=crop&auto=format&q=80',
    'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=600&h=600&fit=crop&auto=format&q=80',
    'https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=600&h=600&fit=crop&auto=format&q=80',
    'https://images.unsplash.com/photo-1566479179817-c0b2b2b5b5b5?w=600&h=600&fit=crop&auto=format&q=80',
    'https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=600&h=600&fit=crop&auto=format&q=80',
    'https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?w=600&h=600&fit=crop&auto=format&q=80',
    'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&h=600&fit=crop&auto=format&q=80',
    'https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?w=600&h=600&fit=crop&auto=format&q=80'
  ],
  shoes: [
    'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=600&h=600&fit=crop&auto=format&q=80',
    'https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=600&h=600&fit=crop&auto=format&q=80',
    'https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?w=600&h=600&fit=crop&auto=format&q=80',
    'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=600&h=600&fit=crop&auto=format&q=80',
    'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=600&h=600&fit=crop&auto=format&q=80',
    'https://images.unsplash.com/photo-1552346154-21d32810aba3?w=600&h=600&fit=crop&auto=format&q=80',
    'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=600&h=600&fit=crop&auto=format&q=80',
    'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&h=600&fit=crop&auto=format&q=80',
    'https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=600&h=600&fit=crop&auto=format&q=80',
    'https://images.unsplash.com/photo-1584735175315-9d5df23860e6?w=600&h=600&fit=crop&auto=format&q=80',
    'https://images.unsplash.com/photo-1562183241-b937e95585b6?w=600&h=600&fit=crop&auto=format&q=80',
    'https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=600&h=600&fit=crop&auto=format&q=80',
    'https://images.unsplash.com/photo-1556906781-9a412961c28c?w=600&h=600&fit=crop&auto=format&q=80',
    'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=600&h=600&fit=crop&auto=format&q=80',
    'https://images.unsplash.com/photo-1582588678413-dbf45f4823e9?w=600&h=600&fit=crop&auto=format&q=80',
    'https://images.unsplash.com/photo-1605348532760-6753d2c43329?w=600&h=600&fit=crop&auto=format&q=80',
    'https://images.unsplash.com/photo-1597045566677-8cf032ed6634?w=600&h=600&fit=crop&auto=format&q=80',
    'https://images.unsplash.com/photo-1574169208507-84376144848b?w=600&h=600&fit=crop&auto=format&q=80',
    'https://images.unsplash.com/photo-1603808033192-082d6919d3e1?w=600&h=600&fit=crop&auto=format&q=80',
    'https://images.unsplash.com/photo-1581101767113-1677fc2beaa8?w=600&h=600&fit=crop&auto=format&q=80'
  ],
  accessories: [
    'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&h=600&fit=crop&auto=format&q=80',
    'https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=600&h=600&fit=crop&auto=format&q=80',
    'https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?w=600&h=600&fit=crop&auto=format&q=80',
    'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&h=600&fit=crop&auto=format&q=80',
    'https://images.unsplash.com/photo-1506629905607-d405b7a30db9?w=600&h=600&fit=crop&auto=format&q=80',
    'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=600&h=600&fit=crop&auto=format&q=80',
    'https://images.unsplash.com/photo-1608042314453-ae338d80c427?w=600&h=600&fit=crop&auto=format&q=80',
    'https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?w=600&h=600&fit=crop&auto=format&q=80',
    'https://images.unsplash.com/photo-1611930022073-b7a4ba5fcccd?w=600&h=600&fit=crop&auto=format&q=80',
    'https://images.unsplash.com/photo-1588444837495-c6cfeb53ee93?w=600&h=600&fit=crop&auto=format&q=80',
    'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&h=600&fit=crop&auto=format&q=80',
    'https://images.unsplash.com/photo-1602173574767-37ac01994b2a?w=600&h=600&fit=crop&auto=format&q=80',
    'https://images.unsplash.com/photo-1611930022073-b7a4ba5fcccd?w=600&h=600&fit=crop&auto=format&q=80',
    'https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?w=600&h=600&fit=crop&auto=format&q=80',
    'https://images.unsplash.com/photo-1588444837495-c6cfeb53ee93?w=600&h=600&fit=crop&auto=format&q=80',
    'https://images.unsplash.com/photo-1608042314453-ae338d80c427?w=600&h=600&fit=crop&auto=format&q=80',
    'https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?w=600&h=600&fit=crop&auto=format&q=80',
    'https://images.unsplash.com/photo-1602173574767-37ac01994b2a?w=600&h=600&fit=crop&auto=format&q=80',
    'https://images.unsplash.com/photo-1506629905607-d405b7a30db9?w=600&h=600&fit=crop&auto=format&q=80',
    'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&h=600&fit=crop&auto=format&q=80'
  ]
};

// Product name templates for each category
const productTemplates = {
  electronics: [
    'Smartphone Pro Max', 'Wireless Headphones', 'Gaming Laptop', '4K Smart TV', 'Tablet Pro', 'Smartwatch Series',
    'Bluetooth Speaker', 'Digital Camera', 'Gaming Console', 'Wireless Earbuds', 'Power Bank', 'USB-C Hub',
    'Mechanical Keyboard', 'Gaming Mouse', 'Monitor 4K', 'Webcam HD', 'Router WiFi 6', 'External SSD',
    'Drone Camera', 'VR Headset', 'Smart Home Hub', 'Fitness Tracker', 'Portable Charger', 'Car Dash Cam'
  ],
  clothing: [
    'Cotton T-Shirt', 'Denim Jeans', 'Hoodie Sweatshirt', 'Casual Shirt', 'Summer Dress', 'Winter Jacket',
    'Yoga Pants', 'Business Suit', 'Polo Shirt', 'Cardigan Sweater', 'Maxi Dress', 'Blazer Jacket',
    'Tank Top', 'Shorts Casual', 'Formal Pants', 'Evening Gown', 'Track Suit', 'Leather Jacket',
    'Knit Sweater', 'Midi Skirt', 'Crop Top', 'Chinos Pants', 'Bomber Jacket', 'Wrap Dress'
  ],
  shoes: [
    'Running Shoes', 'Casual Sneakers', 'Dress Shoes', 'Hiking Boots', 'High Heels', 'Sandals',
    'Basketball Shoes', 'Loafers', 'Ankle Boots', 'Flip Flops', 'Oxford Shoes', 'Platform Heels',
    'Tennis Shoes', 'Combat Boots', 'Ballet Flats', 'Wedge Sandals', 'Slip-on Shoes', 'Chelsea Boots',
    'Cross Training', 'Moccasins', 'Stiletto Heels', 'Boat Shoes', 'Work Boots', 'Espadrilles'
  ]
};

// Generate unique product data
const generateProducts = () => {
  const products = [];
  let imageIndex = 0;
  
  for (let i = 0; i < 250; i++) {
    const category = categories[i % categories.length];
    const categoryBrands = brands[category];
    const brand = categoryBrands[Math.floor(Math.random() * categoryBrands.length)];
    
    // Get unique images for this category
    const categoryImages = imageCollections[category] || imageCollections.electronics;
    const productImages = [
      categoryImages[imageIndex % categoryImages.length],
      categoryImages[(imageIndex + 1) % categoryImages.length]
    ];
    imageIndex += 2;
    
    // Generate product name
    let productName;
    if (productTemplates[category]) {
      const template = productTemplates[category][i % productTemplates[category].length];
      productName = `${brand} ${template} ${Math.floor(Math.random() * 100) + 1}`;
    } else {
      productName = `${brand} ${category.charAt(0).toUpperCase() + category.slice(1)} Product ${i + 1}`;
    }
    
    const basePrice = Math.floor(Math.random() * 500) + 20;
    const originalPrice = basePrice + Math.floor(Math.random() * 100) + 10;
    
    products.push({
      name: productName,
      description: `High-quality ${category} from ${brand}. Perfect for everyday use with premium materials and excellent craftsmanship.`,
      price: basePrice,
      originalPrice: originalPrice,
      category: category,
      brand: brand,
      stock: Math.floor(Math.random() * 200) + 10,
      rating: (Math.random() * 2 + 3).toFixed(1), // 3.0 to 5.0
      numReviews: Math.floor(Math.random() * 5000) + 100,
      images: productImages,
      featured: Math.random() > 0.8, // 20% chance of being featured
      createdAt: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000) // Random date within last year
    });
  }
  
  return products;
};

const seedProducts = async () => {
  try {
    console.log('🌱 Starting mega product seeding...');
    
    // Clear existing products
    await Product.deleteMany({});
    console.log('🗑️  Cleared existing products');
    
    // Generate and insert products
    const products = generateProducts();
    await Product.insertMany(products);
    
    console.log(`✅ Successfully seeded ${products.length} products!`);
    console.log('📊 Product distribution:');
    
    categories.forEach(category => {
      const count = products.filter(p => p.category === category).length;
      console.log(`   ${category}: ${count} products`);
    });
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding products:', error);
    process.exit(1);
  }
};

seedProducts();
