import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';
import Product from './models/Product.js';
import Order from './models/Order.js';

dotenv.config();

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

// Quick 60 products - exactly what you need
const quickProducts = [
  // Electronics (8 products)
  { name: 'Apple iPhone 15 Pro', description: 'Latest smartphone with advanced camera system', price: 999, category: 'electronics', brand: 'Apple', stock: 50 },
  { name: 'Samsung Galaxy S24', description: 'Premium Android smartphone with AI features', price: 899, category: 'electronics', brand: 'Samsung', stock: 45 },
  { name: 'Sony WH-1000XM5', description: 'Noise-canceling wireless headphones', price: 399, category: 'electronics', brand: 'Sony', stock: 60 },
  { name: 'MacBook Air M2', description: 'Lightweight laptop with M2 chip', price: 1199, category: 'electronics', brand: 'Apple', stock: 30 },
  { name: 'iPad Pro 12.9"', description: 'Professional tablet with M2 chip', price: 1099, category: 'electronics', brand: 'Apple', stock: 25 },
  { name: 'Dell XPS 13', description: 'Ultra-portable Windows laptop', price: 1299, category: 'electronics', brand: 'Dell', stock: 20 },
  { name: 'LG OLED TV 55"', description: '4K OLED Smart TV with HDR', price: 1499, category: 'electronics', brand: 'LG', stock: 15 },
  { name: 'AirPods Pro 2nd Gen', description: 'Wireless earbuds with active noise cancellation', price: 249, category: 'electronics', brand: 'Apple', stock: 80 },

  // Clothing (8 products)
  { name: 'Nike Classic Cotton T-Shirt', description: 'Comfortable everyday cotton tee', price: 29, category: 'clothing', brand: 'Nike', stock: 100 },
  { name: 'Levis Denim Jacket', description: 'Vintage-style denim jacket', price: 89, category: 'clothing', brand: 'Levis', stock: 40 },
  { name: 'Adidas Wool Sweater', description: 'Cozy merino wool pullover', price: 79, category: 'clothing', brand: 'Adidas', stock: 35 },
  { name: 'Zara Slim Fit Jeans', description: 'Modern slim-fit denim jeans', price: 69, category: 'clothing', brand: 'Zara', stock: 75 },
  { name: 'H&M Summer Dress', description: 'Flowy summer dress in floral print', price: 59, category: 'clothing', brand: 'H&M', stock: 50 },
  { name: 'Uniqlo Hoodie Sweatshirt', description: 'Comfortable cotton blend hoodie', price: 49, category: 'clothing', brand: 'Uniqlo', stock: 90 },
  { name: 'Calvin Klein Formal Blazer', description: 'Professional tailored blazer', price: 149, category: 'clothing', brand: 'Calvin Klein', stock: 25 },
  { name: 'Nike Yoga Leggings', description: 'High-waisted athletic leggings', price: 39, category: 'clothing', brand: 'Nike', stock: 85 },

  // Shoes (8 products)
  { name: 'Nike Running Sneakers', description: 'Lightweight running shoes with cushioning', price: 129, category: 'shoes', brand: 'Nike', stock: 60 },
  { name: 'Adidas Casual Loafers', description: 'Comfortable leather loafers', price: 89, category: 'shoes', brand: 'Adidas', stock: 40 },
  { name: 'Converse High-Top Sneakers', description: 'Classic canvas high-top sneakers', price: 79, category: 'shoes', brand: 'Converse', stock: 55 },
  { name: 'Puma Dress Shoes', description: 'Formal leather oxford shoes', price: 159, category: 'shoes', brand: 'Puma', stock: 30 },
  { name: 'Vans Hiking Boots', description: 'Waterproof hiking boots', price: 199, category: 'shoes', brand: 'Vans', stock: 25 },
  { name: 'New Balance Sandals', description: 'Comfortable summer sandals', price: 49, category: 'shoes', brand: 'New Balance', stock: 70 },
  { name: 'Reebok Winter Boots', description: 'Insulated winter boots', price: 179, category: 'shoes', brand: 'Reebok', stock: 35 },
  { name: 'Nike Athletic Trainers', description: 'Cross-training athletic shoes', price: 109, category: 'shoes', brand: 'Nike', stock: 50 },

  // Accessories (8 products)
  { name: 'Rolex Leather Wallet', description: 'Genuine leather bifold wallet', price: 49, category: 'accessories', brand: 'Rolex', stock: 80 },
  { name: 'Ray-Ban Sunglasses', description: 'UV protection designer sunglasses', price: 149, category: 'accessories', brand: 'Ray-Ban', stock: 45 },
  { name: 'Casio Watch', description: 'Stainless steel analog watch', price: 299, category: 'accessories', brand: 'Casio', stock: 30 },
  { name: 'Oakley Backpack', description: 'Durable travel backpack', price: 79, category: 'accessories', brand: 'Oakley', stock: 60 },
  { name: 'Coach Belt', description: 'Genuine leather dress belt', price: 39, category: 'accessories', brand: 'Coach', stock: 90 },
  { name: 'Michael Kors Handbag', description: 'Designer leather handbag', price: 199, category: 'accessories', brand: 'Michael Kors', stock: 25 },
  { name: 'Rolex Scarf', description: 'Soft cashmere winter scarf', price: 69, category: 'accessories', brand: 'Rolex', stock: 40 },
  { name: 'Casio Hat', description: 'Adjustable baseball cap', price: 29, category: 'accessories', brand: 'Casio', stock: 75 },

  // Home Decor (8 products)
  { name: 'IKEA Table Lamp', description: 'Modern LED table lamp', price: 89, category: 'home-decor', brand: 'IKEA', stock: 35 },
  { name: 'West Elm Throw Pillow', description: 'Decorative cotton throw pillow', price: 29, category: 'home-decor', brand: 'West Elm', stock: 100 },
  { name: 'Pottery Barn Wall Art', description: 'Framed canvas wall art', price: 79, category: 'home-decor', brand: 'Pottery Barn', stock: 50 },
  { name: 'CB2 Vase', description: 'Ceramic decorative vase', price: 49, category: 'home-decor', brand: 'CB2', stock: 60 },
  { name: 'Article Candle Set', description: 'Scented soy candle collection', price: 39, category: 'home-decor', brand: 'Article', stock: 80 },
  { name: 'Wayfair Mirror', description: 'Round decorative wall mirror', price: 129, category: 'home-decor', brand: 'Wayfair', stock: 25 },
  { name: 'IKEA Plant Pot', description: 'Ceramic plant pot with drainage', price: 25, category: 'home-decor', brand: 'IKEA', stock: 90 },
  { name: 'West Elm Curtains', description: 'Blackout window curtains', price: 59, category: 'home-decor', brand: 'West Elm', stock: 45 },

  // Beauty (8 products)
  { name: 'LOreal Foundation', description: 'Full coverage liquid foundation', price: 45, category: 'beauty', brand: 'LOreal', stock: 70 },
  { name: 'MAC Lipstick', description: 'Long-lasting matte lipstick', price: 25, category: 'beauty', brand: 'MAC', stock: 120 },
  { name: 'Clinique Moisturizer', description: 'Hydrating daily face moisturizer', price: 35, category: 'beauty', brand: 'Clinique', stock: 85 },
  { name: 'Maybelline Eyeshadow Palette', description: '12-color eyeshadow palette', price: 55, category: 'beauty', brand: 'Maybelline', stock: 40 },
  { name: 'Estee Lauder Perfume', description: 'Floral fragrance eau de parfum', price: 89, category: 'beauty', brand: 'Estee Lauder', stock: 30 },
  { name: 'NARS Cleanser', description: 'Gentle foaming face cleanser', price: 29, category: 'beauty', brand: 'NARS', stock: 95 },
  { name: 'LOreal Mascara', description: 'Volumizing waterproof mascara', price: 22, category: 'beauty', brand: 'LOreal', stock: 110 },
  { name: 'MAC Serum', description: 'Anti-aging vitamin C serum', price: 65, category: 'beauty', brand: 'MAC', stock: 50 },

  // Sports (8 products)
  { name: 'Nike Yoga Mat', description: 'Non-slip exercise yoga mat', price: 39, category: 'sports', brand: 'Nike', stock: 75 },
  { name: 'Adidas Dumbbells', description: 'Adjustable weight dumbbells', price: 149, category: 'sports', brand: 'Adidas', stock: 30 },
  { name: 'Under Armour Water Bottle', description: 'Insulated stainless steel bottle', price: 29, category: 'sports', brand: 'Under Armour', stock: 100 },
  { name: 'Puma Resistance Bands', description: 'Set of exercise resistance bands', price: 25, category: 'sports', brand: 'Puma', stock: 85 },
  { name: 'Wilson Tennis Racket', description: 'Professional tennis racket', price: 199, category: 'sports', brand: 'Wilson', stock: 20 },
  { name: 'Spalding Basketball', description: 'Official size basketball', price: 49, category: 'sports', brand: 'Spalding', stock: 60 },
  { name: 'Nike Fitness Tracker', description: 'Waterproof fitness activity tracker', price: 129, category: 'sports', brand: 'Nike', stock: 45 },
  { name: 'Adidas Protein Powder', description: 'Whey protein powder supplement', price: 59, category: 'sports', brand: 'Adidas', stock: 55 },

  // Grocery (8 products)
  { name: 'Organic Valley Honey', description: 'Pure organic wildflower honey', price: 12, category: 'grocery', brand: 'Organic Valley', stock: 150 },
  { name: 'Whole Foods Olive Oil', description: 'Extra virgin olive oil', price: 18, category: 'grocery', brand: 'Whole Foods', stock: 120 },
  { name: 'Trader Joes Quinoa', description: 'Organic quinoa grain', price: 8, category: 'grocery', brand: 'Trader Joes', stock: 200 },
  { name: 'Kirkland Almond Butter', description: 'Natural almond butter', price: 15, category: 'grocery', brand: 'Kirkland', stock: 80 },
  { name: 'Great Value Green Tea', description: 'Organic green tea bags', price: 10, category: 'grocery', brand: 'Great Value', stock: 180 },
  { name: 'Organic Valley Dark Chocolate', description: '70% cacao dark chocolate bar', price: 6, category: 'grocery', brand: 'Organic Valley', stock: 250 },
  { name: 'Whole Foods Coconut Oil', description: 'Organic virgin coconut oil', price: 14, category: 'grocery', brand: 'Whole Foods', stock: 100 },
  { name: 'Trader Joes Protein Bars', description: 'Plant-based protein bars pack', price: 24, category: 'grocery', brand: 'Trader Joes', stock: 90 }
];

const users = [
  {
    name: 'Admin User',
    email: 'admin@example.com',
    password: 'admin123',
    role: 'admin',
  },
  {
    name: 'John Doe',
    email: 'john@example.com',
    password: 'user123',
    role: 'user',
  },
  {
    name: 'Jane Smith',
    email: 'jane@example.com',
    password: 'user123',
    role: 'user',
  }
];

const quickSeed = async () => {
  try {
    await connectDB();

    console.log('🗑️  Clearing existing data...');
    await Order.deleteMany();
    await Product.deleteMany();
    await User.deleteMany();

    console.log('👥 Creating users...');
    const createdUsers = await User.insertMany(users);

    console.log('📦 Creating products...');
    const getRelevantImages = (product, index) => {
      // Create specific search terms for each product type
      let searchTerms = [];

      if (product.category === 'electronics') {
        if (product.name.includes('iPhone')) searchTerms = ['iphone', 'smartphone', 'mobile-phone'];
        else if (product.name.includes('MacBook')) searchTerms = ['macbook', 'laptop', 'apple-laptop'];
        else if (product.name.includes('Galaxy')) searchTerms = ['samsung-galaxy', 'android-phone', 'smartphone'];
        else if (product.name.includes('iPad')) searchTerms = ['ipad', 'tablet', 'apple-tablet'];
        else if (product.name.includes('Headphones') || product.name.includes('WH-1000XM5')) searchTerms = ['headphones', 'wireless-headphones', 'sony-headphones'];
        else if (product.name.includes('XPS')) searchTerms = ['dell-laptop', 'laptop', 'computer'];
        else if (product.name.includes('TV')) searchTerms = ['tv', 'television', 'oled-tv'];
        else if (product.name.includes('AirPods')) searchTerms = ['airpods', 'earbuds', 'wireless-earbuds'];
      } else if (product.category === 'clothing') {
        if (product.name.includes('T-Shirt')) searchTerms = ['t-shirt', 'tshirt', 'cotton-shirt'];
        else if (product.name.includes('Jacket')) searchTerms = ['denim-jacket', 'jacket', 'clothing'];
        else if (product.name.includes('Sweater')) searchTerms = ['sweater', 'pullover', 'wool-sweater'];
        else if (product.name.includes('Jeans')) searchTerms = ['jeans', 'denim', 'pants'];
        else if (product.name.includes('Dress')) searchTerms = ['dress', 'summer-dress', 'womens-dress'];
        else if (product.name.includes('Hoodie')) searchTerms = ['hoodie', 'sweatshirt', 'casual-wear'];
        else if (product.name.includes('Blazer')) searchTerms = ['blazer', 'formal-wear', 'business-attire'];
        else if (product.name.includes('Leggings')) searchTerms = ['leggings', 'yoga-pants', 'activewear'];
      } else if (product.category === 'shoes') {
        if (product.name.includes('Running')) searchTerms = ['running-shoes', 'sneakers', 'athletic-shoes'];
        else if (product.name.includes('Loafers')) searchTerms = ['loafers', 'dress-shoes', 'leather-shoes'];
        else if (product.name.includes('High-Top')) searchTerms = ['high-top-sneakers', 'converse', 'canvas-shoes'];
        else if (product.name.includes('Dress Shoes')) searchTerms = ['dress-shoes', 'oxford-shoes', 'formal-shoes'];
        else if (product.name.includes('Hiking')) searchTerms = ['hiking-boots', 'boots', 'outdoor-shoes'];
        else if (product.name.includes('Sandals')) searchTerms = ['sandals', 'summer-shoes', 'casual-sandals'];
        else if (product.name.includes('Winter')) searchTerms = ['winter-boots', 'boots', 'warm-boots'];
        else if (product.name.includes('Trainers')) searchTerms = ['trainers', 'athletic-shoes', 'gym-shoes'];
      } else if (product.category === 'accessories') {
        if (product.name.includes('Wallet')) searchTerms = ['leather-wallet', 'wallet', 'mens-wallet'];
        else if (product.name.includes('Sunglasses')) searchTerms = ['sunglasses', 'rayban', 'eyewear'];
        else if (product.name.includes('Watch')) searchTerms = ['watch', 'wristwatch', 'timepiece'];
        else if (product.name.includes('Backpack')) searchTerms = ['backpack', 'travel-bag', 'rucksack'];
        else if (product.name.includes('Belt')) searchTerms = ['leather-belt', 'belt', 'mens-belt'];
        else if (product.name.includes('Handbag')) searchTerms = ['handbag', 'purse', 'womens-bag'];
        else if (product.name.includes('Scarf')) searchTerms = ['scarf', 'winter-scarf', 'cashmere-scarf'];
        else if (product.name.includes('Hat')) searchTerms = ['baseball-cap', 'hat', 'cap'];
      } else if (product.category === 'home-decor') {
        if (product.name.includes('Lamp')) searchTerms = ['table-lamp', 'lamp', 'lighting'];
        else if (product.name.includes('Pillow')) searchTerms = ['throw-pillow', 'cushion', 'home-decor'];
        else if (product.name.includes('Wall Art')) searchTerms = ['wall-art', 'canvas-art', 'home-decoration'];
        else if (product.name.includes('Vase')) searchTerms = ['vase', 'ceramic-vase', 'home-decor'];
        else if (product.name.includes('Candle')) searchTerms = ['candles', 'scented-candles', 'home-fragrance'];
        else if (product.name.includes('Mirror')) searchTerms = ['mirror', 'wall-mirror', 'home-decor'];
        else if (product.name.includes('Plant Pot')) searchTerms = ['plant-pot', 'planter', 'ceramic-pot'];
        else if (product.name.includes('Curtains')) searchTerms = ['curtains', 'window-curtains', 'home-textiles'];
      } else if (product.category === 'beauty') {
        if (product.name.includes('Foundation')) searchTerms = ['foundation', 'makeup', 'cosmetics'];
        else if (product.name.includes('Lipstick')) searchTerms = ['lipstick', 'makeup', 'beauty'];
        else if (product.name.includes('Moisturizer')) searchTerms = ['moisturizer', 'skincare', 'face-cream'];
        else if (product.name.includes('Eyeshadow')) searchTerms = ['eyeshadow', 'makeup-palette', 'cosmetics'];
        else if (product.name.includes('Perfume')) searchTerms = ['perfume', 'fragrance', 'beauty'];
        else if (product.name.includes('Cleanser')) searchTerms = ['face-cleanser', 'skincare', 'facial-cleanser'];
        else if (product.name.includes('Mascara')) searchTerms = ['mascara', 'makeup', 'eyelashes'];
        else if (product.name.includes('Serum')) searchTerms = ['face-serum', 'skincare', 'vitamin-c-serum'];
      } else if (product.category === 'sports') {
        if (product.name.includes('Yoga Mat')) searchTerms = ['yoga-mat', 'exercise-mat', 'fitness'];
        else if (product.name.includes('Dumbbells')) searchTerms = ['dumbbells', 'weights', 'fitness-equipment'];
        else if (product.name.includes('Water Bottle')) searchTerms = ['water-bottle', 'sports-bottle', 'fitness'];
        else if (product.name.includes('Resistance Bands')) searchTerms = ['resistance-bands', 'exercise-bands', 'fitness'];
        else if (product.name.includes('Tennis Racket')) searchTerms = ['tennis-racket', 'tennis', 'sports-equipment'];
        else if (product.name.includes('Basketball')) searchTerms = ['basketball', 'sports-ball', 'basketball-ball'];
        else if (product.name.includes('Fitness Tracker')) searchTerms = ['fitness-tracker', 'smartwatch', 'wearable'];
        else if (product.name.includes('Protein Powder')) searchTerms = ['protein-powder', 'supplement', 'fitness-nutrition'];
      } else if (product.category === 'grocery') {
        if (product.name.includes('Honey')) searchTerms = ['honey', 'organic-honey', 'natural-honey'];
        else if (product.name.includes('Olive Oil')) searchTerms = ['olive-oil', 'cooking-oil', 'extra-virgin-olive-oil'];
        else if (product.name.includes('Quinoa')) searchTerms = ['quinoa', 'grain', 'healthy-food'];
        else if (product.name.includes('Almond Butter')) searchTerms = ['almond-butter', 'nut-butter', 'healthy-spread'];
        else if (product.name.includes('Green Tea')) searchTerms = ['green-tea', 'tea-bags', 'herbal-tea'];
        else if (product.name.includes('Dark Chocolate')) searchTerms = ['dark-chocolate', 'chocolate-bar', 'organic-chocolate'];
        else if (product.name.includes('Coconut Oil')) searchTerms = ['coconut-oil', 'organic-oil', 'cooking-oil'];
        else if (product.name.includes('Protein Bars')) searchTerms = ['protein-bars', 'energy-bars', 'healthy-snacks'];
      }

      // Fallback to category if no specific terms found
      if (searchTerms.length === 0) {
        searchTerms = [product.category, product.category.replace('-', ''), 'product'];
      }

      // Generate unique timestamps for each image
      const timestamp = Date.now() + index * 1000;

      return [
        `https://source.unsplash.com/600x600/?${searchTerms[0]}&sig=${timestamp}`,
        `https://source.unsplash.com/600x600/?${searchTerms[1] || searchTerms[0]}&sig=${timestamp + 100}`,
        `https://source.unsplash.com/600x600/?${searchTerms[2] || searchTerms[0]}&sig=${timestamp + 200}`
      ];
    };

    const productsToCreate = quickProducts.map((product, index) => {
      const discountPercent = Math.floor(Math.random() * 30) + 10;
      const originalPrice = Math.floor(product.price * (1 + discountPercent / 100));

      return {
        ...product,
        originalPrice,
        images: getRelevantImages(product, index),
        rating: (Math.random() * 1.5 + 3.5).toFixed(1),
        numReviews: Math.floor(Math.random() * 100) + 10,
        featured: Math.random() > 0.85,
        specifications: new Map([
          ['Brand', product.brand],
          ['Category', product.category.charAt(0).toUpperCase() + product.category.slice(1)],
          ['Material', 'Premium Quality'],
          ['Warranty', product.category === 'electronics' ? '2 Years' : '1 Year'],
          ['Color', 'Multiple Options Available']
        ])
      };
    });

    const createdProducts = await Product.insertMany(productsToCreate);

    console.log('✅ Quick Seed Complete!');
    console.log(`📊 Summary:`);
    console.log(`   Users: ${createdUsers.length}`);
    console.log(`   Products: ${createdProducts.length}`);
    console.log('🚀 Ready to use!');
    
    process.exit(0);
  } catch (error) {
    console.error(`❌ Error: ${error.message}`);
    process.exit(1);
  }
};

quickSeed();
