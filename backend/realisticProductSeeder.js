import mongoose from 'mongoose';
import Product from './models/Product.js';
import dotenv from 'dotenv';

dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ecommerce');

// Realistic product data with proper names, descriptions, and working images
const realisticProducts = [
  // Electronics
  {
    name: "iPhone 15 Pro Max 256GB",
    description: "The most advanced iPhone ever with titanium design, A17 Pro chip, and professional camera system. Features 6.7-inch Super Retina XDR display.",
    price: 1199,
    originalPrice: 1299,
    category: "electronics",
    brand: "Apple",
    images: [
      "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500&h=500&fit=crop&auto=format&q=80",
      "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=500&h=500&fit=crop&auto=format&q=80"
    ],
    stock: 45,
    rating: 4.8,
    numReviews: 2847,
    featured: true
  },
  {
    name: "Samsung Galaxy S24 Ultra 512GB",
    description: "Premium Android smartphone with S Pen, 200MP camera, and AI-powered features. 6.8-inch Dynamic AMOLED display.",
    price: 1099,
    originalPrice: 1199,
    category: "electronics",
    brand: "Samsung",
    images: [
      "https://images.unsplash.com/photo-1605236453806-6ff36851218e?w=500&h=500&fit=crop&auto=format&q=80",
      "https://images.unsplash.com/photo-1574944985070-8f3ebc6b79d2?w=500&h=500&fit=crop&auto=format&q=80"
    ],
    stock: 32,
    rating: 4.7,
    numReviews: 1923,
    featured: true
  },
  {
    name: "MacBook Pro 14-inch M3 Chip",
    description: "Supercharged by M3 chip for incredible performance. 14-inch Liquid Retina XDR display, up to 22 hours battery life.",
    price: 1999,
    originalPrice: 2199,
    category: "electronics",
    brand: "Apple",
    images: [
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500&h=500&fit=crop&auto=format&q=80",
      "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=500&h=500&fit=crop&auto=format&q=80"
    ],
    stock: 18,
    rating: 4.9,
    numReviews: 1456,
    featured: true
  },
  {
    name: "Sony WH-1000XM5 Wireless Headphones",
    description: "Industry-leading noise canceling with premium sound quality. 30-hour battery life and crystal-clear hands-free calling.",
    price: 349,
    originalPrice: 399,
    category: "electronics",
    brand: "Sony",
    images: [
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&h=500&fit=crop&auto=format&q=80",
      "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=500&h=500&fit=crop&auto=format&q=80"
    ],
    stock: 67,
    rating: 4.6,
    numReviews: 3421,
    featured: false
  },
  {
    name: "iPad Pro 12.9-inch M2 Chip",
    description: "The ultimate iPad experience with M2 chip, Liquid Retina XDR display, and all-day battery life. Perfect for creativity and productivity.",
    price: 1099,
    originalPrice: 1199,
    category: "electronics",
    brand: "Apple",
    images: [
      "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=500&h=500&fit=crop&auto=format&q=80",
      "https://images.unsplash.com/photo-1561154464-82e9adf32764?w=500&h=500&fit=crop&auto=format&q=80"
    ],
    stock: 29,
    rating: 4.8,
    numReviews: 987,
    featured: true
  },

  // Clothing
  {
    name: "Nike Air Force 1 '07 White",
    description: "The classic basketball shoe that's been a street style staple for decades. Premium leather upper with iconic design.",
    price: 110,
    originalPrice: 130,
    category: "shoes",
    brand: "Nike",
    images: [
      "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=500&h=500&fit=crop&auto=format&q=80",
      "https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=500&h=500&fit=crop&auto=format&q=80"
    ],
    stock: 156,
    rating: 4.7,
    numReviews: 5643,
    featured: true
  },
  {
    name: "Levi's 501 Original Fit Jeans",
    description: "The original blue jean since 1873. Straight fit through the seat and thigh with a classic straight leg. Made with premium denim.",
    price: 89,
    originalPrice: 109,
    category: "clothing",
    brand: "Levis",
    images: [
      "https://images.unsplash.com/photo-1542272604-787c3835535d?w=500&h=500&fit=crop&auto=format&q=80",
      "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=500&h=500&fit=crop&auto=format&q=80"
    ],
    stock: 234,
    rating: 4.5,
    numReviews: 8921,
    featured: false
  },
  {
    name: "Adidas Ultraboost 22 Running Shoes",
    description: "Premium running shoes with responsive BOOST midsole and Primeknit upper. Designed for comfort and performance.",
    price: 180,
    originalPrice: 200,
    category: "shoes",
    brand: "Adidas",
    images: [
      "https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?w=500&h=500&fit=crop&auto=format&q=80",
      "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=500&h=500&fit=crop&auto=format&q=80"
    ],
    stock: 89,
    rating: 4.6,
    numReviews: 2134,
    featured: true
  },
  {
    name: "Champion Reverse Weave Hoodie",
    description: "Classic heavyweight hoodie with reverse weave construction to resist shrinkage. Comfortable cotton blend with iconic logo.",
    price: 65,
    originalPrice: 80,
    category: "clothing",
    brand: "Champion",
    images: [
      "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=500&h=500&fit=crop&auto=format&q=80",
      "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=500&h=500&fit=crop&auto=format&q=80"
    ],
    stock: 145,
    rating: 4.4,
    numReviews: 1876,
    featured: false
  },
  {
    name: "Zara Structured Blazer",
    description: "Modern tailored blazer with structured shoulders and clean lines. Perfect for professional and casual styling.",
    price: 129,
    originalPrice: 159,
    category: "clothing",
    brand: "Zara",
    images: [
      "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=500&h=500&fit=crop&auto=format&q=80",
      "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500&h=500&fit=crop&auto=format&q=80"
    ],
    stock: 67,
    rating: 4.3,
    numReviews: 543,
    featured: false
  },

  // Accessories
  {
    name: "Ray-Ban Aviator Classic Sunglasses",
    description: "Iconic aviator sunglasses with crystal lenses and gold-tone frame. Timeless style with 100% UV protection.",
    price: 154,
    originalPrice: 180,
    category: "accessories",
    brand: "Ray-Ban",
    images: [
      "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=500&h=500&fit=crop&auto=format&q=80",
      "https://images.unsplash.com/photo-1473496169904-658ba7c44d8a?w=500&h=500&fit=crop&auto=format&q=80"
    ],
    stock: 78,
    rating: 4.7,
    numReviews: 2341,
    featured: true
  },
  {
    name: "Apple Watch Series 9 GPS 45mm",
    description: "Advanced health and fitness tracking with bright Always-On Retina display. Features ECG app and blood oxygen monitoring.",
    price: 429,
    originalPrice: 479,
    category: "accessories",
    brand: "Apple",
    images: [
      "https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=500&h=500&fit=crop&auto=format&q=80",
      "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=500&h=500&fit=crop&auto=format&q=80"
    ],
    stock: 43,
    rating: 4.8,
    numReviews: 1654,
    featured: true
  },

  // Home Decor
  {
    name: "IKEA FRIHETEN Corner Sofa-Bed",
    description: "Practical corner sofa-bed with storage. Converts to a comfortable double bed. Includes storage space under the seat.",
    price: 549,
    originalPrice: 649,
    category: "home-decor",
    brand: "IKEA",
    images: [
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=500&h=500&fit=crop&auto=format&q=80",
      "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=500&h=500&fit=crop&auto=format&q=80"
    ],
    stock: 12,
    rating: 4.2,
    numReviews: 876,
    featured: false
  },
  {
    name: "West Elm Mid-Century Dining Table",
    description: "Solid wood dining table with mid-century modern design. Seats 6 comfortably with expandable leaf option.",
    price: 899,
    originalPrice: 1099,
    category: "home-decor",
    brand: "West Elm",
    images: [
      "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=500&h=500&fit=crop&auto=format&q=80",
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&h=500&fit=crop&auto=format&q=80"
    ],
    stock: 8,
    rating: 4.6,
    numReviews: 234,
    featured: true
  },

  // Beauty
  {
    name: "Fenty Beauty Pro Filt'r Foundation",
    description: "Full-coverage foundation with 50 shades for all skin tones. Long-wearing, sweat and humidity resistant formula.",
    price: 38,
    originalPrice: 42,
    category: "beauty",
    brand: "Fenty Beauty",
    images: [
      "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=500&h=500&fit=crop&auto=format&q=80",
      "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=500&h=500&fit=crop&auto=format&q=80"
    ],
    stock: 234,
    rating: 4.5,
    numReviews: 4567,
    featured: true
  },
  {
    name: "The Ordinary Niacinamide 10% + Zinc 1%",
    description: "High-strength vitamin and mineral blemish formula. Reduces appearance of blemishes and congestion.",
    price: 7,
    originalPrice: 9,
    category: "beauty",
    brand: "The Ordinary",
    images: [
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=500&h=500&fit=crop&auto=format&q=80",
      "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=500&h=500&fit=crop&auto=format&q=80"
    ],
    stock: 456,
    rating: 4.3,
    numReviews: 8934,
    featured: false
  }
];

// Generate more products programmatically to reach 200+
const generateMoreProducts = () => {
  const additionalProducts = [];
  const categories = ['electronics', 'clothing', 'shoes', 'accessories', 'home-decor', 'beauty', 'sports', 'grocery'];

  const productTemplates = {
    electronics: [
      { name: "Gaming Laptop RTX 4070", price: 1299, brand: "ASUS" },
      { name: "Wireless Gaming Mouse", price: 79, brand: "Logitech" },
      { name: "4K Webcam Pro", price: 199, brand: "Logitech" },
      { name: "Mechanical Keyboard RGB", price: 149, brand: "Corsair" },
      { name: "Bluetooth Speaker Portable", price: 89, brand: "JBL" },
      { name: "Smart TV 55 inch 4K", price: 699, brand: "Samsung" },
      { name: "Wireless Earbuds Pro", price: 179, brand: "Sony" },
      { name: "External SSD 1TB", price: 129, brand: "Samsung" },
      { name: "USB-C Hub Multiport", price: 49, brand: "Anker" },
      { name: "Power Bank 20000mAh", price: 39, brand: "Anker" }
    ],
    clothing: [
      { name: "Cotton T-Shirt Premium", price: 29, brand: "Uniqlo" },
      { name: "Denim Jacket Classic", price: 89, brand: "Levis" },
      { name: "Wool Sweater Crew", price: 79, brand: "Gap" },
      { name: "Chino Pants Slim", price: 59, brand: "J.Crew" },
      { name: "Polo Shirt Classic", price: 45, brand: "Ralph Lauren" },
      { name: "Hoodie Pullover", price: 69, brand: "Nike" },
      { name: "Dress Shirt Oxford", price: 55, brand: "Brooks Brothers" },
      { name: "Cargo Shorts", price: 39, brand: "Patagonia" },
      { name: "Track Pants", price: 49, brand: "Adidas" },
      { name: "Cardigan Knit", price: 85, brand: "Banana Republic" }
    ],
    shoes: [
      { name: "Running Shoes Max", price: 140, brand: "Nike" },
      { name: "Casual Sneakers", price: 85, brand: "Vans" },
      { name: "Dress Shoes Oxford", price: 159, brand: "Cole Haan" },
      { name: "Hiking Boots Waterproof", price: 189, brand: "Timberland" },
      { name: "Basketball Shoes High", price: 120, brand: "Jordan" },
      { name: "Sandals Comfort", price: 45, brand: "Birkenstock" },
      { name: "Loafers Leather", price: 129, brand: "Sperry" },
      { name: "Boots Chelsea", price: 179, brand: "Dr. Martens" },
      { name: "Tennis Shoes Court", price: 95, brand: "Adidas" },
      { name: "Flip Flops Beach", price: 25, brand: "Havaianas" }
    ],
    accessories: [
      { name: "Leather Wallet Bifold", price: 49, brand: "Fossil" },
      { name: "Backpack Travel", price: 89, brand: "Herschel" },
      { name: "Sunglasses Polarized", price: 129, brand: "Oakley" },
      { name: "Watch Smartwatch", price: 299, brand: "Garmin" },
      { name: "Belt Leather Classic", price: 39, brand: "Coach" },
      { name: "Hat Baseball Cap", price: 25, brand: "New Era" },
      { name: "Scarf Wool Winter", price: 45, brand: "Acne Studios" },
      { name: "Gloves Leather", price: 59, brand: "The North Face" },
      { name: "Jewelry Necklace", price: 79, brand: "Pandora" },
      { name: "Phone Case Protective", price: 29, brand: "OtterBox" }
    ],
    'home-decor': [
      { name: "Table Lamp Modern", price: 89, brand: "IKEA" },
      { name: "Throw Pillow Set", price: 39, brand: "West Elm" },
      { name: "Wall Art Canvas", price: 69, brand: "Urban Outfitters" },
      { name: "Rug Area 5x7", price: 199, brand: "Rugs USA" },
      { name: "Curtains Blackout", price: 49, brand: "IKEA" },
      { name: "Mirror Wall Decorative", price: 79, brand: "Target" },
      { name: "Plant Pot Ceramic", price: 29, brand: "CB2" },
      { name: "Candle Set Scented", price: 45, brand: "Bath & Body Works" },
      { name: "Clock Wall Modern", price: 59, brand: "West Elm" },
      { name: "Vase Glass Decorative", price: 35, brand: "Pottery Barn" }
    ],
    beauty: [
      { name: "Moisturizer Face Daily", price: 25, brand: "CeraVe" },
      { name: "Lipstick Matte Liquid", price: 22, brand: "MAC" },
      { name: "Serum Vitamin C", price: 18, brand: "The Ordinary" },
      { name: "Mascara Waterproof", price: 24, brand: "Maybelline" },
      { name: "Cleanser Foam Gentle", price: 16, brand: "Neutrogena" },
      { name: "Eyeshadow Palette", price: 45, brand: "Urban Decay" },
      { name: "Sunscreen SPF 50", price: 19, brand: "La Roche-Posay" },
      { name: "Perfume Eau de Parfum", price: 89, brand: "Chanel" },
      { name: "Hair Oil Treatment", price: 32, brand: "Olaplex" },
      { name: "Nail Polish Set", price: 28, brand: "OPI" }
    ],
    sports: [
      { name: "Yoga Mat Premium", price: 49, brand: "Lululemon" },
      { name: "Dumbbells Set 20lb", price: 89, brand: "Bowflex" },
      { name: "Water Bottle Insulated", price: 35, brand: "Hydro Flask" },
      { name: "Resistance Bands Set", price: 25, brand: "TRX" },
      { name: "Tennis Racket Pro", price: 199, brand: "Wilson" },
      { name: "Basketball Official", price: 29, brand: "Spalding" },
      { name: "Golf Balls Dozen", price: 39, brand: "Titleist" },
      { name: "Fitness Tracker", price: 149, brand: "Fitbit" },
      { name: "Protein Powder 2lb", price: 45, brand: "Optimum Nutrition" },
      { name: "Jump Rope Speed", price: 19, brand: "Crossrope" }
    ],
    grocery: [
      { name: "Organic Almonds 1lb", price: 12, brand: "Whole Foods" },
      { name: "Olive Oil Extra Virgin", price: 18, brand: "California Olive Ranch" },
      { name: "Protein Bars Box 12", price: 24, brand: "KIND" },
      { name: "Green Tea Bags 100ct", price: 8, brand: "Bigelow" },
      { name: "Honey Raw Organic", price: 15, brand: "Nature Nate's" },
      { name: "Quinoa Organic 2lb", price: 11, brand: "Bob's Red Mill" },
      { name: "Dark Chocolate 70%", price: 6, brand: "Lindt" },
      { name: "Coconut Oil Virgin", price: 14, brand: "Nutiva" },
      { name: "Granola Clusters", price: 9, brand: "Bear Naked" },
      { name: "Sparkling Water 12pk", price: 5, brand: "LaCroix" }
    ]
  };

  const images = {
    electronics: [
      "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=500&h=500&fit=crop&auto=format&q=80",
      "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=500&h=500&fit=crop&auto=format&q=80",
      "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=500&h=500&fit=crop&auto=format&q=80"
    ],
    clothing: [
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&h=500&fit=crop&auto=format&q=80",
      "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=500&h=500&fit=crop&auto=format&q=80",
      "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=500&h=500&fit=crop&auto=format&q=80"
    ],
    shoes: [
      "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=500&h=500&fit=crop&auto=format&q=80",
      "https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=500&h=500&fit=crop&auto=format&q=80",
      "https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?w=500&h=500&fit=crop&auto=format&q=80"
    ],
    accessories: [
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&h=500&fit=crop&auto=format&q=80",
      "https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=500&h=500&fit=crop&auto=format&q=80",
      "https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?w=500&h=500&fit=crop&auto=format&q=80"
    ],
    'home-decor': [
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=500&h=500&fit=crop&auto=format&q=80",
      "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=500&h=500&fit=crop&auto=format&q=80",
      "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=500&h=500&fit=crop&auto=format&q=80"
    ],
    beauty: [
      "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=500&h=500&fit=crop&auto=format&q=80",
      "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=500&h=500&fit=crop&auto=format&q=80",
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=500&h=500&fit=crop&auto=format&q=80"
    ],
    sports: [
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=500&h=500&fit=crop&auto=format&q=80",
      "https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=500&h=500&fit=crop&auto=format&q=80",
      "https://images.unsplash.com/photo-1517963879433-6ad2b056d712?w=500&h=500&fit=crop&auto=format&q=80"
    ],
    grocery: [
      "https://images.unsplash.com/photo-1542838132-92c53300491e?w=500&h=500&fit=crop&auto=format&q=80",
      "https://images.unsplash.com/photo-1506617564039-2f3b650b7010?w=500&h=500&fit=crop&auto=format&q=80",
      "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=500&h=500&fit=crop&auto=format&q=80"
    ]
  };

  // Generate 200+ products
  for (let i = 0; i < 200; i++) {
    const category = categories[i % categories.length];
    const templates = productTemplates[category];
    const template = templates[i % templates.length];
    const categoryImages = images[category];

    const basePrice = Math.max(5, template.price + Math.floor(Math.random() * 50) - 25);
    const product = {
      name: `${template.name} ${Math.floor(Math.random() * 100) + 1}`,
      description: `High-quality ${category} from ${template.brand}. Premium materials and excellent craftsmanship for everyday use.`,
      price: basePrice,
      originalPrice: basePrice + Math.floor(Math.random() * 50) + 10,
      category: category,
      brand: template.brand,
      images: [
        categoryImages[Math.floor(Math.random() * categoryImages.length)],
        categoryImages[Math.floor(Math.random() * categoryImages.length)]
      ],
      stock: Math.floor(Math.random() * 200) + 10,
      rating: (Math.random() * 2 + 3).toFixed(1),
      numReviews: Math.floor(Math.random() * 5000) + 100,
      featured: Math.random() > 0.8,
      createdAt: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000)
    };

    additionalProducts.push(product);
  }

  return additionalProducts;
};

const seedRealisticProducts = async () => {
  try {
    console.log('🌱 Starting realistic product seeding...');
    
    // Clear existing products
    await Product.deleteMany({});
    console.log('🗑️  Cleared existing products');
    
    // Generate additional products
    const additionalProducts = generateMoreProducts();
    const allProducts = [...realisticProducts, ...additionalProducts];

    // Add timestamps to products
    const productsWithTimestamps = allProducts.map(product => ({
      ...product,
      createdAt: product.createdAt || new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000)
    }));

    // Insert all products
    await Product.insertMany(productsWithTimestamps);
    
    console.log(`✅ Successfully seeded ${allProducts.length} realistic products!`);
    console.log('📊 Product distribution:');

    const categories = [...new Set(allProducts.map(p => p.category))];
    categories.forEach(category => {
      const count = allProducts.filter(p => p.category === category).length;
      console.log(`   ${category}: ${count} products`);
    });
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding products:', error);
    process.exit(1);
  }
};

seedRealisticProducts();
