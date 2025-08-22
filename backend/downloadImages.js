import mongoose from 'mongoose';
import path from 'path';
import { fileURLToPath } from 'url';
import Product from './models/Product.js';
import { createImageDirectories, downloadImage, getProductImageUrls } from './imageManager.js';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ecommerce', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Function to create a safe filename
const createSafeFilename = (productName, index) => {
  return productName
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '') + `-${index}.jpg`;
};

// Function to download images for a single product
const downloadProductImages = async (product) => {
  try {
    console.log(`Processing: ${product.name}`);
    
    const imageUrls = getProductImageUrls(product.name, product.category, product.brand);
    const downloadedImages = [];
    
    for (let i = 0; i < imageUrls.length; i++) {
      const filename = createSafeFilename(product.name, i + 1);
      const filepath = path.join(__dirname, 'public', 'images', product.category, filename);
      
      try {
        await downloadImage(imageUrls[i], filepath);
        const imageUrl = `/api/images/${product.category}/${filename}`;
        downloadedImages.push(imageUrl);
        console.log(`  ✓ Downloaded image ${i + 1}/3`);
      } catch (error) {
        console.log(`  ✗ Failed to download image ${i + 1}: ${error.message}`);
        // Use a fallback placeholder if download fails
        downloadedImages.push(`https://via.placeholder.com/600x600/f3f4f6/9ca3af?text=${encodeURIComponent(product.name.split(' ')[0])}`);
      }
    }
    
    // Update product with new image URLs
    product.images = downloadedImages;
    await product.save();
    
    console.log(`  ✓ Updated database for ${product.name}\n`);
    return true;
  } catch (error) {
    console.error(`Error processing ${product.name}:`, error.message);
    return false;
  }
};

// Main function to download all images
const downloadAllImages = async () => {
  try {
    console.log('Starting image download process...\n');
    
    // Create directory structure
    createImageDirectories();
    
    // Get all products from database
    const products = await Product.find({});
    console.log(`Found ${products.length} products to process\n`);
    
    let successCount = 0;
    let failCount = 0;
    
    // Process products in batches to avoid overwhelming the server
    const batchSize = 5;
    for (let i = 0; i < products.length; i += batchSize) {
      const batch = products.slice(i, i + batchSize);
      
      console.log(`Processing batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(products.length / batchSize)}`);
      
      const promises = batch.map(product => downloadProductImages(product));
      const results = await Promise.all(promises);
      
      results.forEach(success => {
        if (success) successCount++;
        else failCount++;
      });
      
      // Add a small delay between batches
      if (i + batchSize < products.length) {
        console.log('Waiting 2 seconds before next batch...\n');
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    }
    
    console.log('\n=== DOWNLOAD COMPLETE ===');
    console.log(`✓ Successfully processed: ${successCount} products`);
    console.log(`✗ Failed to process: ${failCount} products`);
    console.log(`Total products: ${products.length}`);
    
    process.exit(0);
  } catch (error) {
    console.error('Error in downloadAllImages:', error);
    process.exit(1);
  }
};

// Run the download process
downloadAllImages();
