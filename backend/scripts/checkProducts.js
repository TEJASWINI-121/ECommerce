import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from '../models/Product.js';

// Load environment variables
dotenv.config();

// Connect to MongoDB
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/ecommerce', {
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

// Check products
const checkProducts = async () => {
  try {
    // Connect to database
    await connectDB();
    
    // Count total products
    const totalProducts = await Product.countDocuments();
    console.log(`Total products in database: ${totalProducts}`);
    
    // Count products by category
    const categories = ['electronics', 'clothing', 'home', 'beauty', 'sports', 'grocery', 'fashion', 'home-decor', 'accessories', 'shoes'];
    
    for (const category of categories) {
      const count = await Product.countDocuments({ category });
      console.log(`${category}: ${count} products`);
    }
    
    // Check for unique images
    const products = await Product.find().select('images');
    const allImages = products.flatMap(product => product.images);
    const uniqueImages = new Set(allImages);
    
    console.log(`\nImage statistics:`);
    console.log(`Total images: ${allImages.length}`);
    console.log(`Unique images: ${uniqueImages.size}`);
    console.log(`Duplicate images: ${allImages.length - uniqueImages.size}`);
    
    // Disconnect from database
    await mongoose.disconnect();
    console.log('Database connection closed');
    
    return true;
  } catch (error) {
    console.error(`Error: ${error.message}`);
    // Ensure database connection is closed
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
    }
    return false;
  }
};

// Run the function
checkProducts().then(result => {
  console.log(`Script completed with result: ${result}`);
  process.exit(0);
});