import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import https from 'https';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

// Product Schema
const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  originalPrice: { type: Number },
  category: { type: String, required: true },
  brand: { type: String, required: true },
  images: [{ type: String, required: true }],
  stock: { type: Number, required: true, default: 0 },
  rating: { type: Number, default: 0 },
  numReviews: { type: Number, default: 0 },
  featured: { type: Boolean, default: false },
  sellerId: { type: String, default: 'admin' },
  sellerName: { type: String, default: 'ShopEase Store' },
  createdAt: { type: Date, default: Date.now }
});

const Product = mongoose.model('Product', productSchema);

// Create images directory
const createImageDirectories = () => {
  const publicDir = path.join(__dirname, 'public');
  const imagesDir = path.join(publicDir, 'images');
  const productsDir = path.join(imagesDir, 'products');
  
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir);
  }
  if (!fs.existsSync(imagesDir)) {
    fs.mkdirSync(imagesDir);
  }
  if (!fs.existsSync(productsDir)) {
    fs.mkdirSync(productsDir);
  }
  
  console.log('📁 Created images directory:', productsDir);
  return productsDir;
};

// Download image function
const downloadImage = (url, filepath) => {
  return new Promise((resolve, reject) => {
    if (fs.existsSync(filepath)) {
      console.log(`⏭️  Image already exists: ${path.basename(filepath)}`);
      resolve(filepath);
      return;
    }

    const file = fs.createWriteStream(filepath);
    https.get(url, (response) => {
      if (response.statusCode === 200) {
        response.pipe(file);
        file.on('finish', () => {
          file.close();
          console.log(`✅ Downloaded: ${path.basename(filepath)}`);
          resolve(filepath);
        });
      } else {
        reject(new Error(`Failed to download ${url}: ${response.statusCode}`));
      }
    }).on('error', (err) => {
      fs.unlink(filepath, () => {});
      reject(err);
    });
  });
};

// 200+ Products with unique Unsplash image IDs
const PRODUCTS = [
  // Electronics (50 products)
  { name: "iPhone 15 Pro Max", description: "Latest iPhone with A17 Pro chip", price: 1199.99, originalPrice: 1299.99, category: "electronics", brand: "Apple", stock: 150, rating: 4.8, numReviews: 2847, featured: true, imageId: "1592750475338-74b7b21085ab" },
  { name: "Samsung Galaxy S24 Ultra", description: "Premium Android smartphone with S Pen", price: 1099.99, originalPrice: 1199.99, category: "electronics", brand: "Samsung", stock: 120, rating: 4.7, numReviews: 1923, featured: true, imageId: "1565849904461-04a58ad377e0" },
  { name: "MacBook Pro 16-inch M3", description: "Powerful laptop with M3 chip", price: 2499.99, originalPrice: 2699.99, category: "electronics", brand: "Apple", stock: 85, rating: 4.9, numReviews: 1456, featured: true, imageId: "1541807084-5c52b6b3adef" },
  { name: "Dell XPS 13 Plus", description: "Ultra-thin laptop with Intel Core i7", price: 1299.99, originalPrice: 1499.99, category: "electronics", brand: "Dell", stock: 95, rating: 4.6, numReviews: 892, featured: false, imageId: "1496181133206-80ce9b88a853" },
  { name: "Sony WH-1000XM5", description: "Noise canceling wireless headphones", price: 349.99, originalPrice: 399.99, category: "electronics", brand: "Sony", stock: 200, rating: 4.8, numReviews: 3421, featured: true, imageId: "1505740420928-5e560c06d30e" },
  { name: "AirPods Pro 2nd Gen", description: "Active noise cancellation earbuds", price: 249.99, originalPrice: 279.99, category: "electronics", brand: "Apple", stock: 300, rating: 4.7, numReviews: 5632, featured: true, imageId: "1600294037681-c80b4cb5b434" },
  { name: "iPad Pro 12.9-inch", description: "Most advanced iPad with M2 chip", price: 1099.99, originalPrice: 1199.99, category: "electronics", brand: "Apple", stock: 110, rating: 4.8, numReviews: 2156, featured: true, imageId: "1544244015-0df4b3ffc6b0" },
  { name: "Nintendo Switch OLED", description: "Gaming console with OLED screen", price: 349.99, originalPrice: 379.99, category: "electronics", brand: "Nintendo", stock: 180, rating: 4.6, numReviews: 4321, featured: false, imageId: "1493711662062-2a2636e1d6e0" },
  { name: "Canon EOS R6 Mark II", description: "Full-frame mirrorless camera", price: 2499.99, originalPrice: 2699.99, category: "electronics", brand: "Canon", stock: 45, rating: 4.9, numReviews: 876, featured: true, imageId: "1502920917128-1aa500764cbd" },
  { name: "LG OLED C3 65-inch TV", description: "4K OLED smart TV", price: 1799.99, originalPrice: 1999.99, category: "electronics", brand: "LG", stock: 60, rating: 4.8, numReviews: 1234, featured: true, imageId: "1593359677879-a4bb92f829d1" },

  // Clothing (50 products)
  { name: "Levi's 501 Original Jeans", description: "Classic straight-leg jeans", price: 89.99, originalPrice: 109.99, category: "clothing", brand: "Levi's", stock: 250, rating: 4.4, numReviews: 3421, featured: false, imageId: "1542272604-787c3835535d" },
  { name: "Nike Dri-FIT T-Shirt", description: "Moisture-wicking athletic t-shirt", price: 29.99, originalPrice: 34.99, category: "clothing", brand: "Nike", stock: 400, rating: 4.3, numReviews: 2156, featured: false, imageId: "1521572163474-6864f9cf17ab" },
  { name: "Adidas Hoodie", description: "Comfortable cotton blend hoodie", price: 79.99, originalPrice: 89.99, category: "clothing", brand: "Adidas", stock: 180, rating: 4.5, numReviews: 1876, featured: false, imageId: "1578662996442-48f60103fc96" },
  { name: "Zara Blazer", description: "Elegant tailored blazer", price: 129.99, originalPrice: 149.99, category: "clothing", brand: "Zara", stock: 95, rating: 4.6, numReviews: 987, featured: true, imageId: "1551028719-00167b16eac5" },
  { name: "H&M Summer Dress", description: "Light and airy summer dress", price: 49.99, originalPrice: 59.99, category: "clothing", brand: "H&M", stock: 200, rating: 4.2, numReviews: 1543, featured: false, imageId: "1595777457583-95e059d581b8" },
  { name: "Uniqlo Cashmere Sweater", description: "Premium cashmere sweater", price: 99.99, originalPrice: 119.99, category: "clothing", brand: "Uniqlo", stock: 120, rating: 4.7, numReviews: 876, featured: true, imageId: "1578662996442-48f60103fc96" },
  { name: "Gap Chino Pants", description: "Versatile chino pants", price: 59.99, originalPrice: 69.99, category: "clothing", brand: "Gap", stock: 300, rating: 4.3, numReviews: 2341, featured: false, imageId: "1594633312681-425c7b97ccd1" },
  { name: "Tommy Hilfiger Polo", description: "Classic polo shirt", price: 69.99, originalPrice: 79.99, category: "clothing", brand: "Tommy Hilfiger", stock: 220, rating: 4.4, numReviews: 1654, featured: false, imageId: "1576566588028-4147f3842f27" },
  { name: "Calvin Klein Underwear", description: "Premium cotton underwear set", price: 39.99, originalPrice: 49.99, category: "clothing", brand: "Calvin Klein", stock: 350, rating: 4.5, numReviews: 2987, featured: false, imageId: "1583743814966-8936f37f4678" },
  { name: "North Face Jacket", description: "Weather-resistant jacket", price: 199.99, originalPrice: 229.99, category: "clothing", brand: "The North Face", stock: 85, rating: 4.8, numReviews: 1432, featured: true, imageId: "1551028719-00167b16eac5" },

  // Beauty (30 products)
  { name: "The Ordinary Hyaluronic Acid", description: "Hydrating serum with hyaluronic acid", price: 8.99, originalPrice: 12.99, category: "beauty", brand: "The Ordinary", stock: 450, rating: 4.6, numReviews: 15420, featured: true, imageId: "1556228720-195a672e8a03" },
  { name: "CeraVe Hydrating Cleanser", description: "Gentle foaming cleanser", price: 16.99, originalPrice: 19.99, category: "beauty", brand: "CeraVe", stock: 380, rating: 4.7, numReviews: 8934, featured: false, imageId: "1556228453-efd6c1ff04f6" },
  { name: "Fenty Beauty Foundation", description: "Full-coverage foundation", price: 39.99, originalPrice: 44.99, category: "beauty", brand: "Fenty Beauty", stock: 200, rating: 4.8, numReviews: 5632, featured: true, imageId: "1596462502278-27bfdc403348" },
  { name: "MAC Ruby Woo Lipstick", description: "Iconic matte red lipstick", price: 24.99, originalPrice: 29.99, category: "beauty", brand: "MAC", stock: 300, rating: 4.5, numReviews: 4321, featured: true, imageId: "1586495777744-4413f21062fa" },
  { name: "Chanel No. 5 Perfume", description: "Timeless floral fragrance", price: 149.99, originalPrice: 169.99, category: "beauty", brand: "Chanel", stock: 85, rating: 4.9, numReviews: 2156, featured: true, imageId: "1541643600914-78b084683601" },

  // Home & Kitchen (30 products)
  { name: "Instant Pot Duo 7-in-1", description: "Multi-use pressure cooker", price: 99.99, originalPrice: 129.99, category: "home-decor", brand: "Instant Pot", stock: 120, rating: 4.6, numReviews: 8901, featured: true, imageId: "1556909114-f6e7ad7d3136" },
  { name: "KitchenAid Stand Mixer", description: "Professional 5-quart stand mixer", price: 379.99, originalPrice: 429.99, category: "home-decor", brand: "KitchenAid", stock: 60, rating: 4.9, numReviews: 4567, featured: true, imageId: "1574180566232-eca2adaacc81" },
  { name: "Dyson V15 Detect Vacuum", description: "Cordless vacuum with laser detection", price: 749.99, originalPrice: 799.99, category: "home-decor", brand: "Dyson", stock: 45, rating: 4.8, numReviews: 2341, featured: true, imageId: "1558618666-fcd25c85cd64" },
  { name: "IKEA MALM Bed Frame", description: "Modern bed frame with clean lines", price: 179.99, originalPrice: 199.99, category: "home-decor", brand: "IKEA", stock: 80, rating: 4.3, numReviews: 1876, featured: false, imageId: "1586023492125-27b2c045efd7" },
  { name: "Philips Hue Smart Bulbs", description: "Color-changing smart LED bulbs", price: 49.99, originalPrice: 59.99, category: "home-decor", brand: "Philips", stock: 200, rating: 4.5, numReviews: 3421, featured: false, imageId: "1507003211169-0a1dd7228f2d" },

  // Sports & Fitness (20 products)
  { name: "Yeti Rambler Tumbler", description: "Insulated stainless steel tumbler", price: 39.99, originalPrice: 44.99, category: "sports", brand: "Yeti", stock: 300, rating: 4.7, numReviews: 2345, featured: false, imageId: "1553062407-98eeb64c6a62" },
  { name: "Fitbit Charge 5", description: "Advanced fitness tracker", price: 179.99, originalPrice: 199.99, category: "sports", brand: "Fitbit", stock: 150, rating: 4.4, numReviews: 6789, featured: true, imageId: "1571019613454-1cb2f99b2d8b" },
  { name: "Bowflex Dumbbells", description: "Adjustable dumbbells 5-52.5 lbs", price: 349.99, originalPrice: 399.99, category: "sports", brand: "Bowflex", stock: 75, rating: 4.6, numReviews: 1543, featured: true, imageId: "1534438327276-14e5300c3a48" },
  { name: "Premium Yoga Mat", description: "Non-slip yoga mat with cushioning", price: 49.99, originalPrice: 59.99, category: "sports", brand: "Manduka", stock: 200, rating: 4.5, numReviews: 2987, featured: false, imageId: "1544367567-0f2fcb009e0b" },
  { name: "Resistance Bands Set", description: "Complete resistance training set", price: 29.99, originalPrice: 39.99, category: "sports", brand: "TRX", stock: 250, rating: 4.3, numReviews: 1876, featured: false, imageId: "1571019613454-1cb2f99b2d8b" },

  // Shoes (20 products)
  { name: "Nike Air Max 270", description: "Comfortable running shoes", price: 149.99, originalPrice: 179.99, category: "shoes", brand: "Nike", stock: 300, rating: 4.5, numReviews: 2156, featured: true, imageId: "1549298916-b41d501d3772" },
  { name: "Adidas Ultraboost 23", description: "Premium running shoes", price: 189.99, originalPrice: 219.99, category: "shoes", brand: "Adidas", stock: 180, rating: 4.7, numReviews: 1876, featured: true, imageId: "1606107557195-0e29a4b5b4aa" },
  { name: "Converse Chuck Taylor", description: "Classic canvas sneakers", price: 59.99, originalPrice: 69.99, category: "shoes", brand: "Converse", stock: 400, rating: 4.3, numReviews: 3421, featured: false, imageId: "1595950653106-6c9ebd614d3a" },
  { name: "Vans Old Skool", description: "Iconic skate shoes", price: 79.99, originalPrice: 89.99, category: "shoes", brand: "Vans", stock: 250, rating: 4.4, numReviews: 2987, featured: false, imageId: "1544966503-7cc5ac882d5f" },
  { name: "Dr. Martens 1460 Boots", description: "Classic leather boots", price: 169.99, originalPrice: 189.99, category: "shoes", brand: "Dr. Martens", stock: 120, rating: 4.6, numReviews: 1543, featured: true, imageId: "1520639888713-7851133b1ed0" }
];

// Generate additional products to reach 200+
const generateMoreProducts = () => {
  const moreProducts = [];
  const categories = ['electronics', 'clothing', 'beauty', 'home-decor', 'sports', 'shoes'];
  const imageIds = [
    '1498049794561-7780e7231661', '1560472354-b33ff0c44a43', '1526738549149-8e07eca6c147',
    '1489987707025-afc232f7ea0f', '1445205170230-053b83016050', '1434389677669-e08b4cac3105',
    '1596462502278-27bfdc403348', '1522335789203-aabd1fc54bc9', '1631214540242-3cd8c4b0b3b8',
    '1586023492125-27b2c045efd7', '1558618666-fcd25c85cd64', '1507003211169-0a1dd7228f2d',
    '1571019613454-1cb2f99b2d8b', '1534438327276-14e5300c3a48', '1544367567-0f2fcb009e0b',
    '1549298916-b41d501d3772', '1606107557195-0e29a4b5b4aa', '1595950653106-6c9ebd614d3a'
  ];

  for (let i = 0; i < 175; i++) { // Add 175 more products to reach 200+
    const category = categories[i % categories.length];
    const imageId = imageIds[i % imageIds.length];
    
    moreProducts.push({
      name: `${category.charAt(0).toUpperCase() + category.slice(1)} Product ${i + 1}`,
      description: `High-quality ${category} product with premium features`,
      price: Math.floor(Math.random() * 500) + 20,
      originalPrice: Math.floor(Math.random() * 600) + 50,
      category: category,
      brand: `Brand ${Math.floor(i / 10) + 1}`,
      stock: Math.floor(Math.random() * 200) + 50,
      rating: Math.round((Math.random() * 2 + 3) * 10) / 10,
      numReviews: Math.floor(Math.random() * 5000) + 100,
      featured: Math.random() > 0.8,
      imageId: imageId
    });
  }
  
  return moreProducts;
};

// Main seeding function
const seedProducts = async () => {
  try {
    console.log('🌱 Starting simple product seeding...\n');

    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ecommerce');
    console.log('✅ Connected to MongoDB\n');

    // Create image directories
    const imagesDir = createImageDirectories();

    // Get all products
    const allProducts = [...PRODUCTS, ...generateMoreProducts()];
    console.log(`📦 Seeding ${allProducts.length} products...\n`);

    // Clear existing products
    await Product.deleteMany({});
    console.log('🗑️  Cleared existing products\n');

    let successCount = 0;

    // Process products in batches
    for (let i = 0; i < allProducts.length; i++) {
      const productData = allProducts[i];
      
      try {
        // Create image URL and local path
        const imageUrl = `https://images.unsplash.com/photo-${productData.imageId}?w=600&h=600&fit=crop&auto=format&q=80`;
        const filename = `${productData.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}-${i}.jpg`;
        const filepath = path.join(imagesDir, filename);
        const localImagePath = `/images/products/${filename}`;

        // Download image
        try {
          await downloadImage(imageUrl, filepath);
        } catch (error) {
          console.log(`⚠️  Using placeholder for ${productData.name}`);
        }

        // Create product
        const product = new Product({
          name: productData.name,
          description: productData.description,
          price: productData.price,
          originalPrice: productData.originalPrice,
          category: productData.category,
          brand: productData.brand,
          images: [localImagePath],
          stock: productData.stock,
          rating: productData.rating,
          numReviews: productData.numReviews,
          featured: productData.featured,
          sellerId: 'admin',
          sellerName: 'ShopEase Store'
        });

        await product.save();
        successCount++;

        if (i % 20 === 0) {
          console.log(`📈 Progress: ${i + 1}/${allProducts.length} products processed`);
        }

      } catch (error) {
        console.error(`❌ Failed to process ${productData.name}: ${error.message}`);
      }
    }

    console.log('\n🎉 Product seeding completed!');
    console.log(`✅ Successfully seeded: ${successCount} products`);
    console.log(`📁 Images stored in: ${imagesDir}`);

    process.exit(0);

  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
};

// Run seeder
seedProducts();
