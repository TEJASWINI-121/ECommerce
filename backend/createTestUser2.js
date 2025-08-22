import mongoose from 'mongoose';
import User from './models/User.js';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ecommerce');

async function createTestUser() {
  try {
    console.log('🔧 Creating test user for cart testing...\n');
    
    // Check if test user already exists
    const existingUser = await User.findOne({ email: 'test@shopease.com' });
    
    if (existingUser) {
      console.log('✅ Test user already exists!');
      console.log('📧 Email: test@shopease.com');
      console.log('🔑 Password: test123');
      process.exit(0);
    }
    
    // Hash password manually
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('test123', salt);
    
    // Create test user directly
    const testUser = await User.create({
      name: 'Test User',
      email: 'test@shopease.com',
      password: hashedPassword,
      role: 'user',
      phoneNumber: '+1234567890',
      address: {
        street: '123 Test Street',
        city: 'Test City',
        postalCode: '12345',
        country: 'USA'
      },
      cart: []
    });
    
    console.log('🎉 Test user created successfully!');
    console.log('📧 Email: test@shopease.com');
    console.log('🔑 Password: test123');
    console.log('🛒 Cart is ready for testing!');
    console.log('\nYou can now login and test the cart functionality!');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating test user:', error);
    process.exit(1);
  }
}

createTestUser();
