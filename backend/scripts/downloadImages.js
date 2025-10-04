import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import imageManager from '../utils/imageManager.js';
import Product from '../models/Product.js';

// Load environment variables
dotenv.config();

// Get current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Connect to MongoDB
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return true;
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

// Main function to download all images
const downloadAllImages = async () => {
  try {
    // Connect to database
    await connectDB();
    
    console.log('Starting image download process...');
    
    // Create image directories
    await imageManager.createImageDirectories();
    
    // Get all products
    const products = await Product.find({});
    console.log(`Found ${products.length} products to process`);
    
    // Process products in batches to avoid overwhelming the server
    // Increased batch size to handle 300+ images more efficiently
    const batchSize = 10;
    let successCount = 0;
    let errorCount = 0;
    let skippedCount = 0;
    
    for (let i = 0; i < products.length; i += batchSize) {
      const batch = products.slice(i, i + batchSize);
      const currentBatch = Math.floor(i / batchSize) + 1;
      const totalBatches = Math.ceil(products.length / batchSize);
      
      console.log(`Processing batch ${currentBatch}/${totalBatches} (${i+1}-${Math.min(i+batchSize, products.length)} of ${products.length} products)`);
      
      // Process batch with better error handling
      const batchPromises = batch.map(async (product) => {
        try {
          console.log(`Processing product: ${product.name}`);
          
          // Check if product already has local images
          const hasLocalImages = product.images && product.images.some(img => img.includes('/images/'));
          if (hasLocalImages) {
            console.log(`Skipping product ${product.name} - already has local images`);
            skippedCount++;
            return;
          }
          
          const newImageUrls = await imageManager.downloadProductImages(product);
          await imageManager.updateProductImages(product._id, newImageUrls);
          successCount++;
        } catch (error) {
          console.error(`Error processing product ${product.name || product._id}:`, error.message);
          errorCount++;
        }
      });
      
      // Wait for all products in batch to complete
      await Promise.all(batchPromises);
      
      // Add a shorter delay between batches
      if (i + batchSize < products.length) {
        console.log('Waiting before next batch...');
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
      
      // Log progress
      console.log(`Progress: ${Math.round((i + batch.length) / products.length * 100)}% complete`);
      console.log(`Stats: ${successCount} successful, ${errorCount} failed, ${skippedCount} skipped`);
    }
    
    console.log('All product images downloaded and updated successfully');
    
    // Disconnect from database
    await mongoose.disconnect();
    console.log('Database connection closed');
    
    return true;
  } catch (error) {
    console.error('Error downloading all product images:', error);
    
    // Disconnect from database on error
    try {
      await mongoose.disconnect();
      console.log('Database connection closed');
    } catch (disconnectError) {
      console.error('Error disconnecting from database:', disconnectError);
    }
    
    return false;
  }
};

// Run the script
downloadAllImages()
  .then(result => {
    console.log('Script completed with result:', result);
    process.exit(0);
  })
  .catch(error => {
    console.error('Script failed with error:', error);
    process.exit(1);
  });