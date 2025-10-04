import fs from 'fs';
import path from 'path';
import http from 'http';
import https from 'https';
import { promisify } from 'util';
import Product from '../models/Product.js';

const mkdirAsync = promisify(fs.mkdir);

// Define product categories
const CATEGORIES = [
  'electronics',
  'clothing',
  'home',
  'beauty',
  'books',
  'toys',
  'sports',
  'grocery',
  'furniture',
  'automotive'
];

// Create image directories for each category
export const createImageDirectories = async () => {
  try {
    const baseDir = path.join(process.cwd(), 'public', 'images');
    
    // Create base images directory if it doesn't exist
    if (!fs.existsSync(baseDir)) {
      await mkdirAsync(baseDir, { recursive: true });
    }
    
    // Create category subdirectories
    for (const category of CATEGORIES) {
      const categoryDir = path.join(baseDir, category);
      if (!fs.existsSync(categoryDir)) {
        await mkdirAsync(categoryDir, { recursive: true });
      }
    }
    
    console.log('Image directories created successfully');
    return true;
  } catch (error) {
    console.error('Error creating image directories:', error);
    return false;
  }
};

// Download image from URL and save to local file system
export const downloadImage = (url, filePath) => {
  return new Promise((resolve, reject) => {
    // Determine if we need http or https
    const client = url.startsWith('https') ? https : http;
    
    const file = fs.createWriteStream(filePath);
    
    client.get(url, (response) => {
      // Check if response is successful
      if (response.statusCode !== 200) {
        reject(new Error(`Failed to download image: ${response.statusCode}`));
        return;
      }
      
      // Pipe the image data to file
      response.pipe(file);
      
      file.on('finish', () => {
        file.close();
        resolve(filePath);
      });
    }).on('error', (err) => {
      // Clean up file on error
      fs.unlink(filePath, () => {});
      reject(err);
    });
  });
};

// Get safe filename from product name
export const getSafeFilename = (productName, index = 0) => {
  return `${productName.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_${index}.jpg`;
};

// Download all images for a product
export const downloadProductImages = async (product) => {
  try {
    const category = product.category.toLowerCase();
    const baseDir = path.join(process.cwd(), 'public', 'images', category);
    
    // Create category directory if it doesn't exist
    if (!fs.existsSync(baseDir)) {
      await mkdirAsync(baseDir, { recursive: true });
    }
    
    const newImageUrls = [];
    
    // Download each image
    for (let i = 0; i < product.images.length; i++) {
      const imageUrl = product.images[i];
      const filename = getSafeFilename(product.name, i);
      const filePath = path.join(baseDir, filename);
      
      // Skip if file already exists
      if (fs.existsSync(filePath)) {
        const localUrl = `/images/${category}/${filename}`;
        newImageUrls.push(localUrl);
        continue;
      }
      
      try {
        await downloadImage(imageUrl, filePath);
        const localUrl = `/images/${category}/${filename}`;
        newImageUrls.push(localUrl);
        console.log(`Downloaded image for ${product.name}: ${localUrl}`);
      } catch (error) {
        console.error(`Error downloading image ${imageUrl}:`, error);
        // Keep original URL if download fails
        newImageUrls.push(imageUrl);
      }
    }
    
    return newImageUrls;
  } catch (error) {
    console.error(`Error processing images for product ${product._id}:`, error);
    return product.images; // Return original images on error
  }
};

// Update product with local image URLs
export const updateProductImages = async (productId, newImageUrls) => {
  try {
    await Product.findByIdAndUpdate(productId, { images: newImageUrls });
    return true;
  } catch (error) {
    console.error(`Error updating product ${productId} images:`, error);
    return false;
  }
};

// Main function to download all product images
export const downloadAllProductImages = async () => {
  try {
    // Create image directories
    await createImageDirectories();
    
    // Get all products
    const products = await Product.find({});
    console.log(`Found ${products.length} products to process`);
    
    // Process products in batches to avoid overwhelming the server
    const batchSize = 10;
    for (let i = 0; i < products.length; i += batchSize) {
      const batch = products.slice(i, i + batchSize);
      
      // Process batch in parallel
      await Promise.all(batch.map(async (product) => {
        const newImageUrls = await downloadProductImages(product);
        await updateProductImages(product._id, newImageUrls);
      }));
      
      console.log(`Processed batch ${i / batchSize + 1}/${Math.ceil(products.length / batchSize)}`);
      
      // Add a small delay between batches
      if (i + batchSize < products.length) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }
    
    console.log('All product images downloaded and updated successfully');
    return true;
  } catch (error) {
    console.error('Error downloading all product images:', error);
    return false;
  }
};

export default {
  createImageDirectories,
  downloadImage,
  getSafeFilename,
  downloadProductImages,
  updateProductImages,
  downloadAllProductImages
};