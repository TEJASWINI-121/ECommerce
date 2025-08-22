import mongoose from 'mongoose';
import User from './models/User.js';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ecommerce');

const checkUsers = async () => {
  try {
    console.log('👥 Checking all users...\n');
    
    const users = await User.find({}).select('name email role createdAt');
    
    console.log(`Found ${users.length} users:\n`);
    
    users.forEach((user, index) => {
      console.log(`${index + 1}. Name: ${user.name}`);
      console.log(`   Email: ${user.email}`);
      console.log(`   Role: ${user.role}`);
      console.log(`   Created: ${user.createdAt}`);
      console.log('');
    });
    
    // Find Krish specifically
    const krishUser = await User.findOne({ name: 'krish' });
    
    if (krishUser) {
      console.log('🔍 Krish user details:');
      console.log('Name:', krishUser.name);
      console.log('Email:', krishUser.email);
      console.log('Role:', krishUser.role);
      console.log('Has password:', !!krishUser.password);
      console.log('Password length:', krishUser.password ? krishUser.password.length : 0);
      
      // Update Krish user with correct password
      console.log('\n🔧 Updating Krish user password...');
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('krish123', salt);
      
      await User.updateOne(
        { _id: krishUser._id },
        { password: hashedPassword }
      );
      
      console.log('✅ Updated Krish password to: krish123');
      console.log('📧 Email:', krishUser.email);
      
      // Test password
      const testPassword = await bcrypt.compare('krish123', hashedPassword);
      console.log('🔐 Password test:', testPassword ? 'PASS' : 'FAIL');
    }
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
};

checkUsers();
