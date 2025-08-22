import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import https from 'https';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

// Product Schema (assuming you have this)
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
  const imagesDir = path.join(__dirname, 'public', 'images', 'products');
  if (!fs.existsSync(imagesDir)) {
    fs.mkdirSync(imagesDir, { recursive: true });
    console.log('📁 Created images directory:', imagesDir);
  }
  return imagesDir;
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

// Generate unique Unsplash URLs for different product types
const getProductImages = (productName, category, index) => {
  const productType = productName.toLowerCase();
  const baseUrl = 'https://images.unsplash.com';
  
  // Create unique image IDs based on product type and index
  const imageIds = {
    // Electronics
    iphone: ['1592750475338-74b7b21085ab', '1511707171634-5f897ff02aa9', '1556656793-08538906a9f8'],
    samsung: ['1565849904461-04a58ad377e0', '1512499617640-c74ae3a79d37', '1574944985070-8f3ebc6b79d2'],
    laptop: ['1541807084-5c52b6b3adef', '1496181133206-80ce9b88a853', '1517336714731-489689fd1ca8'],
    headphones: ['1505740420928-5e560c06d30e', '1484704849700-f032a568e944', '1583394838336-acd977736f90'],
    camera: ['1502920917128-1aa500764cbd', '1606983340126-1e6d2b3c0c3d', '1502920917128-1aa500764cbd'],
    
    // Clothing
    tshirt: ['1521572163474-6864f9cf17ab', '1576566588028-4147f3842f27', '1583743814966-8936f37f4678'],
    jeans: ['1542272604-787c3835535d', '1594633312681-425c7b97ccd1', '1541099649105-f69ad21f3246'],
    dress: ['1595777457583-95e059d581b8', '1566479179817-c0b5b4b4b1e8', '1515372039744-b8f02a3ae446'],
    jacket: ['1551028719-00167b16eac5', '1594633312681-425c7b97ccd1', '1507003211169-0a1dd7228f2d'],
    
    // Shoes
    sneakers: ['1549298916-b41d501d3772', '1606107557195-0e29a4b5b4aa', '1595950653106-6c9ebd614d3a'],
    boots: ['1544966503-7cc5ac882d5f', '1520639888713-7851133b1ed0', '1608256246200-53e635b5b65f'],
    sandals: ['1603487742131-4160ec999306', '1594223274512-ad4803739b7c', '1515347619252-60a4bf4fff4f'],
    
    // Beauty
    lipstick: ['1586495777744-4413f21062fa', '1596462502278-27bfdc403348', '1522335789203-aabd1fc54bc9'],
    skincare: ['1556228720-195a672e8a03', '1571781926291-c477ebfd024b', '1556228453-efd6c1ff04f6'],
    perfume: ['1541643600914-78b084683601', '1588405748880-12d1d2a59d32', '1594736797933-d0401ba2fe65'],
    
    // Home & Kitchen
    furniture: ['1586023492125-27b2c045efd7', '1558618666-fcd25c85cd64', '1507003211169-0a1dd7228f2d'],
    kitchen: ['1556909114-f6e7ad7d3136', '1585515656973-c0e8e4b0e8b8', '1574180566232-eca2adaacc81'],
    decor: ['1578662996442-48f60103fc96', '1586023492125-27b2c045efd7', '1558618666-fcd25c85cd64'],
    
    // Sports
    fitness: ['1571019613454-1cb2f99b2d8b', '1534438327276-14e5300c3a48', '1544367567-0f2fcb009e0b'],
    sports: ['1551698618-1dfe5d97d256', '1546519638-68e109498ffc', '1602143407151-7111542de6e8'],
    
    // Books
    books: ['1481627834876-b7833e8f006f', '1507003211169-0a1dd7228f2d', '1481627834876-b7833e8f006f'],
    
    // Toys
    toys: ['1558877385-f0b2c2ce6ba8', '1566479179817-c0b5b4b4b1e8', '1558877385-f0b2c2ce6ba8']
  };

  // Determine image set based on product type
  let selectedImages = [];
  
  if (productType.includes('iphone') || productType.includes('apple')) {
    selectedImages = imageIds.iphone;
  } else if (productType.includes('samsung') || productType.includes('galaxy')) {
    selectedImages = imageIds.samsung;
  } else if (productType.includes('laptop') || productType.includes('macbook')) {
    selectedImages = imageIds.laptop;
  } else if (productType.includes('headphone') || productType.includes('airpods')) {
    selectedImages = imageIds.headphones;
  } else if (productType.includes('camera')) {
    selectedImages = imageIds.camera;
  } else if (productType.includes('t-shirt') || productType.includes('shirt')) {
    selectedImages = imageIds.tshirt;
  } else if (productType.includes('jeans') || productType.includes('pants')) {
    selectedImages = imageIds.jeans;
  } else if (productType.includes('dress')) {
    selectedImages = imageIds.dress;
  } else if (productType.includes('jacket') || productType.includes('coat')) {
    selectedImages = imageIds.jacket;
  } else if (productType.includes('sneaker') || productType.includes('running')) {
    selectedImages = imageIds.sneakers;
  } else if (productType.includes('boot')) {
    selectedImages = imageIds.boots;
  } else if (productType.includes('sandal')) {
    selectedImages = imageIds.sandals;
  } else if (productType.includes('lipstick') || productType.includes('makeup')) {
    selectedImages = imageIds.lipstick;
  } else if (productType.includes('cream') || productType.includes('serum') || productType.includes('cleanser')) {
    selectedImages = imageIds.skincare;
  } else if (productType.includes('perfume') || productType.includes('fragrance')) {
    selectedImages = imageIds.perfume;
  } else if (productType.includes('chair') || productType.includes('table') || productType.includes('sofa')) {
    selectedImages = imageIds.furniture;
  } else if (productType.includes('pot') || productType.includes('pan') || productType.includes('kitchen')) {
    selectedImages = imageIds.kitchen;
  } else if (productType.includes('lamp') || productType.includes('vase') || productType.includes('decor')) {
    selectedImages = imageIds.decor;
  } else if (productType.includes('dumbbell') || productType.includes('weight') || productType.includes('fitness')) {
    selectedImages = imageIds.fitness;
  } else if (productType.includes('ball') || productType.includes('racket') || productType.includes('sport')) {
    selectedImages = imageIds.sports;
  } else if (productType.includes('book')) {
    selectedImages = imageIds.books;
  } else if (productType.includes('toy') || productType.includes('game')) {
    selectedImages = imageIds.toys;
  } else {
    // Fallback based on category
    const categoryImages = {
      electronics: imageIds.laptop,
      clothing: imageIds.tshirt,
      shoes: imageIds.sneakers,
      beauty: imageIds.skincare,
      'home-decor': imageIds.furniture,
      sports: imageIds.fitness,
      books: imageIds.books,
      toys: imageIds.toys
    };
    selectedImages = categoryImages[category] || imageIds.laptop;
  }

  // Create unique URLs by adding index-based parameters
  return selectedImages.map((id, i) => 
    `${baseUrl}/photo-${id}?w=600&h=600&fit=crop&crop=center&auto=format&q=80&seed=${index + i}`
  );
};

// Main seeding function
const seedProducts = async () => {
  try {
    console.log('🌱 Starting product seeding process...\n');

    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ecommerce');
    console.log('✅ Connected to MongoDB\n');

    // Create image directories
    const imagesDir = createImageDirectories();

    // Import product data
    const { getAllProducts } = await import('./productData.js');
    const allProducts = getAllProducts();

    console.log(`📦 Seeding ${allProducts.length} products...\n`);

    // Clear existing products
    await Product.deleteMany({});
    console.log('🗑️  Cleared existing products\n');

    let successCount = 0;
    let failCount = 0;

    // Process each product
    for (let i = 0; i < allProducts.length; i++) {
      const productData = allProducts[i];

      try {
        console.log(`\n📱 Processing ${i + 1}/${allProducts.length}: ${productData.name}`);

        // Get product-specific images
        const imageUrls = getProductImages(productData.name, productData.category, i);
        const localImagePaths = [];

        // Download images
        for (let j = 0; j < imageUrls.length; j++) {
          const filename = `${productData.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}-${i}-${j}.jpg`;
          const filepath = path.join(imagesDir, filename);

          try {
            await downloadImage(imageUrls[j], filepath);
            localImagePaths.push(`/images/products/${filename}`);
          } catch (error) {
            console.log(`  ⚠️  Failed to download image ${j + 1}: ${error.message}`);
            // Use placeholder as fallback
            localImagePaths.push(`https://via.placeholder.com/600x600/f3f4f6/9ca3af?text=${encodeURIComponent(productData.name.split(' ')[0])}`);
          }
        }

        // Create product with local image paths
        const product = new Product({
          ...productData,
          images: localImagePaths,
          sellerId: 'admin',
          sellerName: 'ShopEase Store'
        });

        await product.save();
        successCount++;
        console.log(`  ✅ Product saved successfully`);

        // Add small delay to avoid overwhelming the image service
        if (i % 10 === 0 && i > 0) {
          console.log(`  ⏸️  Pausing for 2 seconds...`);
          await new Promise(resolve => setTimeout(resolve, 2000));
        }

      } catch (error) {
        failCount++;
        console.error(`  ❌ Failed to process product: ${error.message}`);
      }
    }

    console.log('\n🎉 Product seeding completed!');
    console.log(`✅ Successfully seeded: ${successCount} products`);
    console.log(`❌ Failed to seed: ${failCount} products`);
    console.log(`📁 Images stored in: ${imagesDir}`);

    process.exit(0);

  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
};

// Run seeder if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  seedProducts();
}

// Export functions for use in other files
export { Product, createImageDirectories, downloadImage, getProductImages, seedProducts };
