import mongoose from 'mongoose';
import User from './models/User.js';
import dotenv from 'dotenv';

dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ecommerce', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function createTestUser() {
  try {
    console.log('🔧 Creating test user...\n');
    
    // Check if test user already exists
    const existingUser = await User.findOne({ email: 'test@example.com' });
    
    if (existingUser) {
      console.log('✅ Test user already exists!');
      console.log('📧 Email: test@example.com');
      console.log('🔑 Password: password123');
      process.exit(0);
    }
    
    // Create test user
    const testUser = new User({
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123',
      role: 'user',
      phoneNumber: '+1234567890',
      address: {
        street: '123 Test Street',
        city: 'Test City',
        postalCode: '12345',
        country: 'Test Country'
      }
    });
    
    await testUser.save();
    
    console.log('🎉 Test user created successfully!');
    console.log('📧 Email: test@example.com');
    console.log('🔑 Password: password123');
    console.log('\nYou can now login with these credentials to test the cart functionality!');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating test user:', error);
    process.exit(1);
  }
}

createTestUser();
