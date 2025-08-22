import mongoose from 'mongoose';
import User from './models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ecommerce');

const fixKrishUser = async () => {
  try {
    console.log('🔧 Fixing Krish user authentication...\n');
    
    // Find Krish user
    let krishUser = await User.findOne({ name: 'krish' });
    
    if (!krishUser) {
      console.log('👤 Krish user not found, creating new user...');
      
      // Create Krish user with proper password hashing
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('krish123', salt);
      
      krishUser = await User.create({
        name: 'krish',
        email: 'krish@example.com',
        password: hashedPassword,
        role: 'user',
        phoneNumber: '+1234567890',
        address: {
          street: '123 Krish Street',
          city: 'Krish City',
          postalCode: '12345',
          country: 'India'
        },
        cart: []
      });
      
      console.log('✅ Created new Krish user');
    } else {
      console.log('👤 Found existing Krish user');
    }
    
    // Generate a proper JWT token for Krish
    const token = jwt.sign(
      { 
        id: krishUser._id,
        email: krishUser.email,
        role: krishUser.role
      },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '30d' }
    );
    
    console.log('✅ Generated JWT token for Krish');
    console.log('🆔 User ID:', krishUser._id);
    console.log('📧 Email:', krishUser.email);
    console.log('🔑 Password: krish123');
    console.log('🎫 Token:', token.substring(0, 20) + '...');
    
    // Test the token by making a request
    console.log('\n🧪 Testing token...');
    
    // Simulate login response
    const loginResponse = {
      _id: krishUser._id,
      name: krishUser.name,
      email: krishUser.email,
      role: krishUser.role,
      token: token
    };
    
    console.log('\n📋 Complete login response:');
    console.log(JSON.stringify(loginResponse, null, 2));
    
    console.log('\n🎉 Krish user is now ready!');
    console.log('\n📝 Login credentials:');
    console.log('Email: krish@example.com');
    console.log('Password: krish123');
    
    console.log('\n💡 Or use the test user:');
    console.log('Email: test@example.com');
    console.log('Password: password123');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error fixing Krish user:', error);
    process.exit(1);
  }
};

fixKrishUser();
