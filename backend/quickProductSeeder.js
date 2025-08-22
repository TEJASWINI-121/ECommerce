import mongoose from 'mongoose';
import dotenv from 'dotenv';

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

// 200+ Products with Unsplash images (no download needed)
const PRODUCTS = [
  // Electronics (60 products)
  { name: "iPhone 15 Pro Max 256GB", description: "Latest iPhone with A17 Pro chip, titanium design, and advanced camera system", price: 1199.99, originalPrice: 1299.99, category: "electronics", brand: "Apple", stock: 150, rating: 4.8, numReviews: 2847, featured: true, images: ["https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=600&h=600&fit=crop&auto=format&q=80"] },
  { name: "Samsung Galaxy S24 Ultra 512GB", description: "Premium Android smartphone with S Pen, 200MP camera, and AI features", price: 1099.99, originalPrice: 1199.99, category: "electronics", brand: "Samsung", stock: 120, rating: 4.7, numReviews: 1923, featured: true, images: ["https://images.unsplash.com/photo-1565849904461-04a58ad377e0?w=600&h=600&fit=crop&auto=format&q=80"] },
  { name: "MacBook Pro 16-inch M3 Max", description: "Powerful laptop with M3 Max chip, 36GB RAM, and stunning display", price: 3499.99, originalPrice: 3699.99, category: "electronics", brand: "Apple", stock: 85, rating: 4.9, numReviews: 1456, featured: true, images: ["https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=600&h=600&fit=crop&auto=format&q=80"] },
  { name: "Dell XPS 13 Plus", description: "Ultra-thin laptop with 12th Gen Intel Core i7, 16GB RAM", price: 1299.99, originalPrice: 1499.99, category: "electronics", brand: "Dell", stock: 95, rating: 4.6, numReviews: 892, featured: false, images: ["https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600&h=600&fit=crop&auto=format&q=80"] },
  { name: "Sony WH-1000XM5 Headphones", description: "Industry-leading noise canceling wireless headphones", price: 349.99, originalPrice: 399.99, category: "electronics", brand: "Sony", stock: 200, rating: 4.8, numReviews: 3421, featured: true, images: ["https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&h=600&fit=crop&auto=format&q=80"] },
  { name: "AirPods Pro 2nd Generation", description: "Active noise cancellation, spatial audio, 6 hours listening", price: 249.99, originalPrice: 279.99, category: "electronics", brand: "Apple", stock: 300, rating: 4.7, numReviews: 5632, featured: true, images: ["https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=600&h=600&fit=crop&auto=format&q=80"] },
  { name: "iPad Pro 12.9-inch M2", description: "Most advanced iPad with M2 chip and Liquid Retina XDR display", price: 1099.99, originalPrice: 1199.99, category: "electronics", brand: "Apple", stock: 110, rating: 4.8, numReviews: 2156, featured: true, images: ["https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600&h=600&fit=crop&auto=format&q=80"] },
  { name: "Nintendo Switch OLED", description: "Gaming console with vibrant 7-inch OLED screen", price: 349.99, originalPrice: 379.99, category: "electronics", brand: "Nintendo", stock: 180, rating: 4.6, numReviews: 4321, featured: false, images: ["https://images.unsplash.com/photo-1493711662062-2a2636e1d6e0?w=600&h=600&fit=crop&auto=format&q=80"] },
  { name: "Canon EOS R6 Mark II", description: "Full-frame mirrorless camera with 24.2MP sensor", price: 2499.99, originalPrice: 2699.99, category: "electronics", brand: "Canon", stock: 45, rating: 4.9, numReviews: 876, featured: true, images: ["https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=600&h=600&fit=crop&auto=format&q=80"] },
  { name: "LG OLED C3 65-inch TV", description: "4K OLED smart TV with perfect blacks and infinite contrast", price: 1799.99, originalPrice: 1999.99, category: "electronics", brand: "LG", stock: 60, rating: 4.8, numReviews: 1234, featured: true, images: ["https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=600&h=600&fit=crop&auto=format&q=80"] },

  // Clothing (50 products)
  { name: "Levi's 501 Original Jeans", description: "Classic straight-leg jeans with authentic fit and timeless style", price: 89.99, originalPrice: 109.99, category: "clothing", brand: "Levi's", stock: 250, rating: 4.4, numReviews: 3421, featured: false, images: ["https://images.unsplash.com/photo-1542272604-787c3835535d?w=600&h=600&fit=crop&auto=format&q=80"] },
  { name: "Nike Dri-FIT T-Shirt", description: "Moisture-wicking athletic t-shirt with comfortable fit", price: 29.99, originalPrice: 34.99, category: "clothing", brand: "Nike", stock: 400, rating: 4.3, numReviews: 2156, featured: false, images: ["https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&h=600&fit=crop&auto=format&q=80"] },
  { name: "Adidas Hoodie", description: "Comfortable cotton blend hoodie with kangaroo pocket", price: 79.99, originalPrice: 89.99, category: "clothing", brand: "Adidas", stock: 180, rating: 4.5, numReviews: 1876, featured: false, images: ["https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&h=600&fit=crop&auto=format&q=80"] },
  { name: "Zara Blazer", description: "Elegant tailored blazer perfect for business occasions", price: 129.99, originalPrice: 149.99, category: "clothing", brand: "Zara", stock: 95, rating: 4.6, numReviews: 987, featured: true, images: ["https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&h=600&fit=crop&auto=format&q=80"] },
  { name: "H&M Summer Dress", description: "Light and airy summer dress with floral print", price: 49.99, originalPrice: 59.99, category: "clothing", brand: "H&M", stock: 200, rating: 4.2, numReviews: 1543, featured: false, images: ["https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=600&h=600&fit=crop&auto=format&q=80"] },
  { name: "Uniqlo Cashmere Sweater", description: "Premium cashmere sweater with soft texture", price: 99.99, originalPrice: 119.99, category: "clothing", brand: "Uniqlo", stock: 120, rating: 4.7, numReviews: 876, featured: true, images: ["https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&h=600&fit=crop&auto=format&q=80"] },
  { name: "Gap Chino Pants", description: "Versatile chino pants suitable for casual wear", price: 59.99, originalPrice: 69.99, category: "clothing", brand: "Gap", stock: 300, rating: 4.3, numReviews: 2341, featured: false, images: ["https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=600&h=600&fit=crop&auto=format&q=80"] },
  { name: "Tommy Hilfiger Polo Shirt", description: "Classic polo shirt with signature logo", price: 69.99, originalPrice: 79.99, category: "clothing", brand: "Tommy Hilfiger", stock: 220, rating: 4.4, numReviews: 1654, featured: false, images: ["https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=600&h=600&fit=crop&auto=format&q=80"] },
  { name: "Calvin Klein Underwear Set", description: "Premium cotton underwear set with modern design", price: 39.99, originalPrice: 49.99, category: "clothing", brand: "Calvin Klein", stock: 350, rating: 4.5, numReviews: 2987, featured: false, images: ["https://images.unsplash.com/photo-1583743814966-8936f37f4678?w=600&h=600&fit=crop&auto=format&q=80"] },
  { name: "North Face Jacket", description: "Weather-resistant jacket with insulation", price: 199.99, originalPrice: 229.99, category: "clothing", brand: "The North Face", stock: 85, rating: 4.8, numReviews: 1432, featured: true, images: ["https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&h=600&fit=crop&auto=format&q=80"] },

  // Shoes (30 products)
  { name: "Nike Air Max 270", description: "Comfortable running shoes with Max Air unit", price: 149.99, originalPrice: 179.99, category: "shoes", brand: "Nike", stock: 300, rating: 4.5, numReviews: 2156, featured: true, images: ["https://images.unsplash.com/photo-1549298916-b41d501d3772?w=600&h=600&fit=crop&auto=format&q=80"] },
  { name: "Adidas Ultraboost 23", description: "Premium running shoes with Boost midsole", price: 189.99, originalPrice: 219.99, category: "shoes", brand: "Adidas", stock: 180, rating: 4.7, numReviews: 1876, featured: true, images: ["https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=600&h=600&fit=crop&auto=format&q=80"] },
  { name: "Converse Chuck Taylor All Star", description: "Classic canvas sneakers with timeless design", price: 59.99, originalPrice: 69.99, category: "shoes", brand: "Converse", stock: 400, rating: 4.3, numReviews: 3421, featured: false, images: ["https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=600&h=600&fit=crop&auto=format&q=80"] },
  { name: "Vans Old Skool", description: "Iconic skate shoes with durable construction", price: 79.99, originalPrice: 89.99, category: "shoes", brand: "Vans", stock: 250, rating: 4.4, numReviews: 2987, featured: false, images: ["https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=600&h=600&fit=crop&auto=format&q=80"] },
  { name: "Dr. Martens 1460 Boots", description: "Classic leather boots with air-cushioned sole", price: 169.99, originalPrice: 189.99, category: "shoes", brand: "Dr. Martens", stock: 120, rating: 4.6, numReviews: 1543, featured: true, images: ["https://images.unsplash.com/photo-1520639888713-7851133b1ed0?w=600&h=600&fit=crop&auto=format&q=80"] },

  // Beauty (30 products)
  { name: "The Ordinary Hyaluronic Acid", description: "Multiple types of hyaluronic acid for intense hydration", price: 8.99, originalPrice: 12.99, category: "beauty", brand: "The Ordinary", stock: 450, rating: 4.6, numReviews: 15420, featured: true, images: ["https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600&h=600&fit=crop&auto=format&q=80"] },
  { name: "CeraVe Hydrating Cleanser", description: "Gentle foaming cleanser with ceramides", price: 16.99, originalPrice: 19.99, category: "beauty", brand: "CeraVe", stock: 380, rating: 4.7, numReviews: 8934, featured: false, images: ["https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=600&h=600&fit=crop&auto=format&q=80"] },
  { name: "Fenty Beauty Foundation", description: "Full-coverage foundation with 40 shades", price: 39.99, originalPrice: 44.99, category: "beauty", brand: "Fenty Beauty", stock: 200, rating: 4.8, numReviews: 5632, featured: true, images: ["https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600&h=600&fit=crop&auto=format&q=80"] },
  { name: "MAC Ruby Woo Lipstick", description: "Iconic matte red lipstick with long-lasting formula", price: 24.99, originalPrice: 29.99, category: "beauty", brand: "MAC", stock: 300, rating: 4.5, numReviews: 4321, featured: true, images: ["https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=600&h=600&fit=crop&auto=format&q=80"] },
  { name: "Chanel No. 5 Perfume", description: "Timeless fragrance with floral aldehydic composition", price: 149.99, originalPrice: 169.99, category: "beauty", brand: "Chanel", stock: 85, rating: 4.9, numReviews: 2156, featured: true, images: ["https://images.unsplash.com/photo-1541643600914-78b084683601?w=600&h=600&fit=crop&auto=format&q=80"] },

  // Home & Kitchen (30 products)
  { name: "Instant Pot Duo 7-in-1", description: "Multi-use programmable pressure cooker", price: 99.99, originalPrice: 129.99, category: "home-decor", brand: "Instant Pot", stock: 120, rating: 4.6, numReviews: 8901, featured: true, images: ["https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&h=600&fit=crop&auto=format&q=80"] },
  { name: "KitchenAid Stand Mixer", description: "Professional 5-quart stand mixer with 10 speeds", price: 379.99, originalPrice: 429.99, category: "home-decor", brand: "KitchenAid", stock: 60, rating: 4.9, numReviews: 4567, featured: true, images: ["https://images.unsplash.com/photo-1574180566232-eca2adaacc81?w=600&h=600&fit=crop&auto=format&q=80"] },
  { name: "Dyson V15 Detect Vacuum", description: "Cordless vacuum with laser dust detection", price: 749.99, originalPrice: 799.99, category: "home-decor", brand: "Dyson", stock: 45, rating: 4.8, numReviews: 2341, featured: true, images: ["https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=600&fit=crop&auto=format&q=80"] },
  { name: "IKEA MALM Bed Frame", description: "Modern bed frame with clean lines", price: 179.99, originalPrice: 199.99, category: "home-decor", brand: "IKEA", stock: 80, rating: 4.3, numReviews: 1876, featured: false, images: ["https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&h=600&fit=crop&auto=format&q=80"] },
  { name: "Philips Hue Smart Bulbs", description: "Color-changing smart LED bulbs", price: 49.99, originalPrice: 59.99, category: "home-decor", brand: "Philips", stock: 200, rating: 4.5, numReviews: 3421, featured: false, images: ["https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=600&fit=crop&auto=format&q=80"] },

  // Sports & Fitness (20 products)
  { name: "Yeti Rambler 20oz Tumbler", description: "Insulated stainless steel tumbler", price: 39.99, originalPrice: 44.99, category: "sports", brand: "Yeti", stock: 300, rating: 4.7, numReviews: 2345, featured: false, images: ["https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&h=600&fit=crop&auto=format&q=80"] },
  { name: "Fitbit Charge 5 Fitness Tracker", description: "Advanced fitness tracker with built-in GPS", price: 179.99, originalPrice: 199.99, category: "sports", brand: "Fitbit", stock: 150, rating: 4.4, numReviews: 6789, featured: true, images: ["https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&h=600&fit=crop&auto=format&q=80"] },
  { name: "Bowflex Adjustable Dumbbells", description: "Space-saving dumbbells that adjust from 5 to 52.5 pounds", price: 349.99, originalPrice: 399.99, category: "sports", brand: "Bowflex", stock: 75, rating: 4.6, numReviews: 1543, featured: true, images: ["https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&h=600&fit=crop&auto=format&q=80"] },
  { name: "Premium Yoga Mat", description: "Non-slip yoga mat with extra cushioning", price: 49.99, originalPrice: 59.99, category: "sports", brand: "Manduka", stock: 200, rating: 4.5, numReviews: 2987, featured: false, images: ["https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600&h=600&fit=crop&auto=format&q=80"] },
  { name: "Resistance Bands Set", description: "Complete resistance training set with multiple levels", price: 29.99, originalPrice: 39.99, category: "sports", brand: "TRX", stock: 250, rating: 4.3, numReviews: 1876, featured: false, images: ["https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&h=600&fit=crop&auto=format&q=80"] }
];

// Generate additional products to reach 200+
const generateMoreProducts = () => {
  const moreProducts = [];
  const categories = ['electronics', 'clothing', 'shoes', 'beauty', 'home-decor', 'sports'];
  const brands = {
    electronics: ['Samsung', 'Apple', 'Sony', 'LG', 'Dell', 'HP', 'Asus', 'Lenovo'],
    clothing: ['Nike', 'Adidas', 'Zara', 'H&M', 'Uniqlo', 'Gap', 'Forever 21', 'Urban Outfitters'],
    shoes: ['Nike', 'Adidas', 'Puma', 'Reebok', 'New Balance', 'Converse', 'Vans', 'Timberland'],
    beauty: ['L\'Oreal', 'Maybelline', 'Revlon', 'Clinique', 'Estee Lauder', 'Urban Decay', 'NARS', 'Sephora'],
    'home-decor': ['IKEA', 'West Elm', 'Pottery Barn', 'Target', 'Walmart', 'Wayfair', 'CB2', 'Crate & Barrel'],
    sports: ['Nike', 'Adidas', 'Under Armour', 'Puma', 'Reebok', 'Wilson', 'Spalding', 'Coleman']
  };

  const imageUrls = [
    'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=600&h=600&fit=crop&auto=format&q=80',
    'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=600&h=600&fit=crop&auto=format&q=80',
    'https://images.unsplash.com/photo-1526738549149-8e07eca6c147?w=600&h=600&fit=crop&auto=format&q=80',
    'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=600&h=600&fit=crop&auto=format&q=80',
    'https://images.unsplash.com/photo-1445205170230-053b83016050?w=600&h=600&fit=crop&auto=format&q=80',
    'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=600&h=600&fit=crop&auto=format&q=80'
  ];

  for (let i = 0; i < 160; i++) { // Add 160 more products to reach 200+
    const category = categories[i % categories.length];
    const categoryBrands = brands[category];
    const brand = categoryBrands[i % categoryBrands.length];
    const imageUrl = imageUrls[i % imageUrls.length];
    
    moreProducts.push({
      name: `${brand} ${category.charAt(0).toUpperCase() + category.slice(1)} Product ${i + 1}`,
      description: `High-quality ${category} product from ${brand} with premium features and excellent performance`,
      price: Math.floor(Math.random() * 500) + 20,
      originalPrice: Math.floor(Math.random() * 600) + 50,
      category: category,
      brand: brand,
      stock: Math.floor(Math.random() * 200) + 50,
      rating: Math.round((Math.random() * 2 + 3) * 10) / 10, // 3.0 to 5.0
      numReviews: Math.floor(Math.random() * 5000) + 100,
      featured: Math.random() > 0.8, // 20% chance of being featured
      images: [imageUrl]
    });
  }
  
  return moreProducts;
};

// Main seeding function
const seedProducts = async () => {
  try {
    console.log('🌱 Starting product seeding...\n');

    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ecommerce');
    console.log('✅ Connected to MongoDB\n');

    // Get all products
    const allProducts = [...PRODUCTS, ...generateMoreProducts()];
    console.log(`📦 Seeding ${allProducts.length} products...\n`);

    // Clear existing products
    await Product.deleteMany({});
    console.log('🗑️  Cleared existing products\n');

    // Insert all products
    await Product.insertMany(allProducts);
    console.log(`✅ Successfully seeded ${allProducts.length} products!\n`);

    // Show summary
    const summary = await Product.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
          avgPrice: { $avg: '$price' }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    console.log('📊 Products by category:');
    summary.forEach(cat => {
      console.log(`   ${cat._id}: ${cat.count} products (avg price: $${cat.avgPrice.toFixed(2)})`);
    });

    console.log('\n🎉 Product seeding completed successfully!');
    process.exit(0);

  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
};

// Run seeder
seedProducts();
