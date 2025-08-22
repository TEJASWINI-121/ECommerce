import mongoose from 'mongoose';
import User from './models/User.js';
import Product from './models/Product.js';
import dotenv from 'dotenv';

dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ecommerce');

const testCartFunctionality = async () => {
  try {
    console.log('🧪 Testing cart functionality...\n');
    
    // Find test user
    const user = await User.findOne({ email: 'test@shopease.com' });
    if (!user) {
      console.log('❌ Test user not found');
      return;
    }
    
    console.log('✅ Test user found:', user.name);
    console.log('📧 Email:', user.email);
    console.log('🛒 Current cart items:', user.cart.length);
    
    // Get some products
    const products = await Product.find({}).limit(3);
    console.log(`📦 Found ${products.length} products`);
    
    // Clear cart first
    user.cart = [];
    await user.save();
    console.log('🗑️  Cleared cart');
    
    // Add products to cart
    for (const product of products) {
      user.cart.push({
        product: product._id,
        quantity: 1
      });
      console.log(`➕ Added ${product.name} to cart`);
    }
    
    await user.save();
    console.log('💾 Saved cart');
    
    // Test populated cart
    const populatedUser = await User.findById(user._id)
      .populate('cart.product')
      .select('cart');
    
    console.log('\n🛒 POPULATED CART:');
    populatedUser.cart.forEach((item, index) => {
      console.log(`${index + 1}. ${item.product.name} - $${item.product.price} (Qty: ${item.quantity})`);
    });
    
    console.log('\n✅ Cart functionality test completed successfully!');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error testing cart:', error);
    process.exit(1);
  }
};

testCartFunctionality();
