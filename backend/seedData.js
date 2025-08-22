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

const categories = [
  'electronics', 'clothing', 'shoes', 'accessories',
  'home-decor', 'beauty', 'sports', 'grocery'
];

const brands = {
  electronics: ['Apple', 'Samsung', 'Sony', 'LG', 'HP', 'Dell', 'Lenovo'],
  clothing: ['Nike', 'Adidas', 'Zara', 'H&M', 'Uniqlo', 'Levis', 'Calvin Klein'],
  shoes: ['Nike', 'Adidas', 'Puma', 'Converse', 'Vans', 'New Balance', 'Reebok'],
  accessories: ['Rolex', 'Casio', 'Ray-Ban', 'Oakley', 'Coach', 'Michael Kors'],
  'home-decor': ['IKEA', 'West Elm', 'Pottery Barn', 'CB2', 'Article', 'Wayfair'],
  beauty: ['LOreal', 'Maybelline', 'MAC', 'Clinique', 'Estee Lauder', 'NARS'],
  sports: ['Nike', 'Adidas', 'Under Armour', 'Puma', 'Wilson', 'Spalding'],
  grocery: ['Organic Valley', 'Whole Foods', 'Trader Joes', 'Kirkland', 'Great Value']
};

// Realistic product data for each category
const productTemplates = {
  electronics: [
    { name: 'iPhone 15 Pro', desc: 'Latest smartphone with advanced camera system', price: 999, stock: 50 },
    { name: 'MacBook Air M2', desc: 'Lightweight laptop with M2 chip', price: 1199, stock: 30 },
    { name: 'Samsung Galaxy S24', desc: 'Premium Android smartphone', price: 899, stock: 45 },
    { name: 'iPad Pro 12.9"', desc: 'Professional tablet with M2 chip', price: 1099, stock: 25 },
    { name: 'Sony WH-1000XM5', desc: 'Noise-canceling wireless headphones', price: 399, stock: 60 },
    { name: 'Dell XPS 13', desc: 'Ultra-portable Windows laptop', price: 1299, stock: 20 },
    { name: 'LG OLED TV 55"', desc: '4K OLED Smart TV with HDR', price: 1499, stock: 15 },
    { name: 'AirPods Pro 2nd Gen', desc: 'Wireless earbuds with active noise cancellation', price: 249, stock: 80 }
  ],
  clothing: [
    { name: 'Classic Cotton T-Shirt', desc: 'Comfortable everyday cotton tee', price: 29, stock: 100 },
    { name: 'Denim Jacket', desc: 'Vintage-style denim jacket', price: 89, stock: 40 },
    { name: 'Wool Sweater', desc: 'Cozy merino wool pullover', price: 79, stock: 35 },
    { name: 'Slim Fit Jeans', desc: 'Modern slim-fit denim jeans', price: 69, stock: 75 },
    { name: 'Summer Dress', desc: 'Flowy summer dress in floral print', price: 59, stock: 50 },
    { name: 'Hoodie Sweatshirt', desc: 'Comfortable cotton blend hoodie', price: 49, stock: 90 },
    { name: 'Formal Blazer', desc: 'Professional tailored blazer', price: 149, stock: 25 },
    { name: 'Yoga Leggings', desc: 'High-waisted athletic leggings', price: 39, stock: 85 }
  ],
  shoes: [
    { name: 'Running Sneakers', desc: 'Lightweight running shoes with cushioning', price: 129, stock: 60 },
    { name: 'Casual Loafers', desc: 'Comfortable leather loafers', price: 89, stock: 40 },
    { name: 'High-Top Sneakers', desc: 'Classic canvas high-top sneakers', price: 79, stock: 55 },
    { name: 'Dress Shoes', desc: 'Formal leather oxford shoes', price: 159, stock: 30 },
    { name: 'Hiking Boots', desc: 'Waterproof hiking boots', price: 199, stock: 25 },
    { name: 'Sandals', desc: 'Comfortable summer sandals', price: 49, stock: 70 },
    { name: 'Winter Boots', desc: 'Insulated winter boots', price: 179, stock: 35 },
    { name: 'Athletic Trainers', desc: 'Cross-training athletic shoes', price: 109, stock: 50 }
  ],
  accessories: [
    { name: 'Leather Wallet', desc: 'Genuine leather bifold wallet', price: 49, stock: 80 },
    { name: 'Sunglasses', desc: 'UV protection designer sunglasses', price: 149, stock: 45 },
    { name: 'Watch', desc: 'Stainless steel analog watch', price: 299, stock: 30 },
    { name: 'Backpack', desc: 'Durable travel backpack', price: 79, stock: 60 },
    { name: 'Belt', desc: 'Genuine leather dress belt', price: 39, stock: 90 },
    { name: 'Handbag', desc: 'Designer leather handbag', price: 199, stock: 25 },
    { name: 'Scarf', desc: 'Soft cashmere winter scarf', price: 69, stock: 40 },
    { name: 'Hat', desc: 'Adjustable baseball cap', price: 29, stock: 75 }
  ],
  'home-decor': [
    { name: 'Table Lamp', desc: 'Modern LED table lamp', price: 89, stock: 35 },
    { name: 'Throw Pillow', desc: 'Decorative cotton throw pillow', price: 29, stock: 100 },
    { name: 'Wall Art', desc: 'Framed canvas wall art', price: 79, stock: 50 },
    { name: 'Vase', desc: 'Ceramic decorative vase', price: 49, stock: 60 },
    { name: 'Candle Set', desc: 'Scented soy candle collection', price: 39, stock: 80 },
    { name: 'Mirror', desc: 'Round decorative wall mirror', price: 129, stock: 25 },
    { name: 'Plant Pot', desc: 'Ceramic plant pot with drainage', price: 25, stock: 90 },
    { name: 'Curtains', desc: 'Blackout window curtains', price: 59, stock: 45 }
  ],
  beauty: [
    { name: 'Foundation', desc: 'Full coverage liquid foundation', price: 45, stock: 70 },
    { name: 'Lipstick', desc: 'Long-lasting matte lipstick', price: 25, stock: 120 },
    { name: 'Moisturizer', desc: 'Hydrating daily face moisturizer', price: 35, stock: 85 },
    { name: 'Eyeshadow Palette', desc: '12-color eyeshadow palette', price: 55, stock: 40 },
    { name: 'Perfume', desc: 'Floral fragrance eau de parfum', price: 89, stock: 30 },
    { name: 'Cleanser', desc: 'Gentle foaming face cleanser', price: 29, stock: 95 },
    { name: 'Mascara', desc: 'Volumizing waterproof mascara', price: 22, stock: 110 },
    { name: 'Serum', desc: 'Anti-aging vitamin C serum', price: 65, stock: 50 }
  ],
  sports: [
    { name: 'Yoga Mat', desc: 'Non-slip exercise yoga mat', price: 39, stock: 75 },
    { name: 'Dumbbells', desc: 'Adjustable weight dumbbells', price: 149, stock: 30 },
    { name: 'Water Bottle', desc: 'Insulated stainless steel bottle', price: 29, stock: 100 },
    { name: 'Resistance Bands', desc: 'Set of exercise resistance bands', price: 25, stock: 85 },
    { name: 'Tennis Racket', desc: 'Professional tennis racket', price: 199, stock: 20 },
    { name: 'Basketball', desc: 'Official size basketball', price: 49, stock: 60 },
    { name: 'Fitness Tracker', desc: 'Waterproof fitness activity tracker', price: 129, stock: 45 },
    { name: 'Protein Powder', desc: 'Whey protein powder supplement', price: 59, stock: 55 }
  ],
  grocery: [
    { name: 'Organic Honey', desc: 'Pure organic wildflower honey', price: 12, stock: 150 },
    { name: 'Olive Oil', desc: 'Extra virgin olive oil', price: 18, stock: 120 },
    { name: 'Quinoa', desc: 'Organic quinoa grain', price: 8, stock: 200 },
    { name: 'Almond Butter', desc: 'Natural almond butter', price: 15, stock: 80 },
    { name: 'Green Tea', desc: 'Organic green tea bags', price: 10, stock: 180 },
    { name: 'Dark Chocolate', desc: '70% cacao dark chocolate bar', price: 6, stock: 250 },
    { name: 'Coconut Oil', desc: 'Organic virgin coconut oil', price: 14, stock: 100 },
    { name: 'Protein Bars', desc: 'Plant-based protein bars pack', price: 24, stock: 90 }
  ]
};

const generateProducts = () => {
  const products = [];

  // Create exactly 60 products (more than 50+ as requested)
  // 8 products per category to ensure good distribution
  categories.forEach(category => {
    const templates = productTemplates[category];
    const brandList = brands[category];

    // Take first 8 products from each category
    for (let i = 0; i < Math.min(8, templates.length); i++) {
      const template = templates[i];
      const brand = brandList[i % brandList.length]; // Cycle through brands

      const discountPercent = Math.floor(Math.random() * 30) + 10; // 10-40% discount
      const originalPrice = Math.floor(template.price * (1 + discountPercent / 100));

      // Generate relevant placeholder images with proper product representation
      const getProductImages = (productName, category, brand, index) => {
        // Create descriptive placeholder images that represent the actual product
        const productType = productName.toLowerCase();
        let imageText = '';
        let bgColor = 'f8f9fa';
        let textColor = '6c757d';

        // Determine appropriate image text and colors based on product
        if (productType.includes('iphone')) {
          imageText = 'iPhone';
          bgColor = '000000';
          textColor = 'ffffff';
        } else if (productType.includes('macbook')) {
          imageText = 'MacBook';
          bgColor = 'c0c0c0';
          textColor = '000000';
        } else if (productType.includes('galaxy')) {
          imageText = 'Galaxy';
          bgColor = '1f2937';
          textColor = 'ffffff';
        } else if (productType.includes('ipad')) {
          imageText = 'iPad';
          bgColor = 'ffffff';
          textColor = '000000';
        } else if (productType.includes('headphones') || productType.includes('wh-1000xm5')) {
          imageText = 'Headphones';
          bgColor = '374151';
          textColor = 'ffffff';
        } else if (productType.includes('airpods')) {
          imageText = 'AirPods';
          bgColor = 'ffffff';
          textColor = '000000';
        } else if (productType.includes('tv')) {
          imageText = 'OLED TV';
          bgColor = '000000';
          textColor = 'ffffff';
        } else if (productType.includes('laptop') || productType.includes('xps')) {
          imageText = 'Laptop';
          bgColor = '1f2937';
          textColor = 'ffffff';
        } else if (productType.includes('t-shirt')) {
          imageText = 'T-Shirt';
          bgColor = '3b82f6';
          textColor = 'ffffff';
        } else if (productType.includes('jeans')) {
          imageText = 'Jeans';
          bgColor = '1e40af';
          textColor = 'ffffff';
        } else if (productType.includes('dress')) {
          imageText = 'Dress';
          bgColor = 'ec4899';
          textColor = 'ffffff';
        } else if (productType.includes('sneakers') || productType.includes('running')) {
          imageText = 'Sneakers';
          bgColor = '059669';
          textColor = 'ffffff';
        } else if (productType.includes('boots')) {
          imageText = 'Boots';
          bgColor = '92400e';
          textColor = 'ffffff';
        } else if (productType.includes('sunglasses')) {
          imageText = 'Sunglasses';
          bgColor = '000000';
          textColor = 'ffffff';
        } else if (productType.includes('watch')) {
          imageText = 'Watch';
          bgColor = 'c0c0c0';
          textColor = '000000';
        } else if (productType.includes('lipstick')) {
          imageText = 'Lipstick';
          bgColor = 'dc2626';
          textColor = 'ffffff';
        } else if (productType.includes('mascara')) {
          imageText = 'Mascara';
          bgColor = '000000';
          textColor = 'ffffff';
        } else if (productType.includes('foundation')) {
          imageText = 'Foundation';
          bgColor = 'f59e0b';
          textColor = 'ffffff';
        } else if (productType.includes('yoga mat')) {
          imageText = 'Yoga Mat';
          bgColor = '7c3aed';
          textColor = 'ffffff';
        } else if (productType.includes('dumbbells')) {
          imageText = 'Dumbbells';
          bgColor = '374151';
          textColor = 'ffffff';
        } else {
          // Fallback based on category
          if (category === 'electronics') {
            imageText = 'Electronics';
            bgColor = '1f2937';
            textColor = 'ffffff';
          } else if (category === 'clothing') {
            imageText = 'Clothing';
            bgColor = '3b82f6';
            textColor = 'ffffff';
          } else if (category === 'shoes') {
            imageText = 'Shoes';
            bgColor = '059669';
            textColor = 'ffffff';
          } else if (category === 'beauty') {
            imageText = 'Beauty';
            bgColor = 'ec4899';
            textColor = 'ffffff';
          } else if (category === 'sports') {
            imageText = 'Sports';
            bgColor = 'dc2626';
            textColor = 'ffffff';
          } else {
            imageText = brand;
            bgColor = '6b7280';
            textColor = 'ffffff';
          }
        }

        // Create three variations of the same product image
        return [
          `https://via.placeholder.com/600x600/${bgColor}/${textColor}?text=${encodeURIComponent(imageText)}`,
          `https://via.placeholder.com/600x600/${bgColor}/${textColor}?text=${encodeURIComponent(imageText + ' - View 2')}`,
          `https://via.placeholder.com/600x600/${bgColor}/${textColor}?text=${encodeURIComponent(imageText + ' - View 3')}`
        ];
      };

      const product = {
        name: `${brand} ${template.name}`,
        description: `${template.desc}. Premium quality from ${brand} with excellent craftsmanship and attention to detail. Perfect for those who appreciate quality and style.`,
        price: template.price,
        originalPrice: originalPrice,
        category: category,
        brand: brand,
        images: getProductImages(`${brand} ${template.name}`, category, brand, products.length),
        stock: template.stock + Math.floor(Math.random() * 30) + 20, // Ensure good stock levels (40-70+ items)
        rating: (Math.random() * 1.5 + 3.5).toFixed(1), // 3.5 to 5.0
        numReviews: Math.floor(Math.random() * 150) + 10,
        featured: Math.random() > 0.85, // 15% chance of being featured
        specifications: new Map([
          ['Brand', brand],
          ['Category', category.charAt(0).toUpperCase() + category.slice(1)],
          ['Material', 'Premium Quality'],
          ['Warranty', category === 'electronics' ? '2 Years' : '1 Year'],
          ['Color', 'Multiple Options Available'],
          ['Size', category === 'clothing' || category === 'shoes' ? 'S, M, L, XL' : 'Standard']
        ])
      };

      products.push(product);
    }
  });

  console.log(`Generated ${products.length} products`);
  return products;
};

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

const importData = async () => {
  try {
    await connectDB();

    console.log('Clearing existing data...');
    await Order.deleteMany();
    await Product.deleteMany();
    await User.deleteMany();

    console.log('Creating users...');
    const createdUsers = await User.insertMany(users);
    console.log(`Created ${createdUsers.length} users`);

    console.log('Generating products...');
    const products = generateProducts();

    console.log(`Creating ${products.length} products...`);

    // Create products in batches for better performance
    const batchSize = 50;
    const createdProducts = [];

    for (let i = 0; i < products.length; i += batchSize) {
      const batch = products.slice(i, i + batchSize);
      const createdBatch = await Product.insertMany(batch);
      createdProducts.push(...createdBatch);

      console.log(`Created ${Math.min(i + batchSize, products.length)} of ${products.length} products...`);
    }

    console.log('✅ Data Import Complete!');
    console.log(`📊 Summary:`);
    console.log(`   Users: ${createdUsers.length}`);
    console.log(`   Products: ${createdProducts.length}`);
    console.log(`   Categories: ${categories.length}`);
    console.log('🚀 You can now start the application!');

    process.exit();
  } catch (error) {
    console.error(`❌ Error: ${error.message}`);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await connectDB();

    console.log('Destroying all data...');
    await Order.deleteMany();
    await Product.deleteMany();
    await User.deleteMany();

    console.log('🗑️  All data destroyed!');
    process.exit();
  } catch (error) {
    console.error(`❌ Error: ${error.message}`);
    process.exit(1);
  }
};

if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
}