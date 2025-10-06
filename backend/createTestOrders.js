import mongoose from 'mongoose';
import Order from './models/Order.js';
import User from './models/User.js';
import Product from './models/Product.js';
import dotenv from 'dotenv';

dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ecommerce', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function createTestOrders() {
  try {
    console.log('🔧 Creating test orders...\n');
    
    // Get some users and products
    const users = await User.find({}).limit(5);
    const products = await Product.find({}).limit(10);
    
    if (users.length === 0) {
      console.log('❌ No users found. Please create some users first.');
      process.exit(1);
    }
    
    if (products.length === 0) {
      console.log('❌ No products found. Please seed products first.');
      process.exit(1);
    }
    
    // Check if orders already exist
    const existingOrders = await Order.countDocuments();
    if (existingOrders > 0) {
      console.log(`✅ ${existingOrders} orders already exist!`);
      process.exit(0);
    }
    
    // Create test orders
    const testOrders = [
      {
        orderItems: [
          {
            name: products[0]?.name || 'Test Product 1',
            quantity: 2,
            price: products[0]?.price || 99.99,
            product: products[0]?._id,
            image: products[0]?.images?.[0] || 'https://via.placeholder.com/300x300'
          }
        ],
        user: users[0]._id,
        shippingAddress: {
          address: '123 Test Street',
          city: 'Test City',
          postalCode: '12345',
          country: 'Test Country'
        },
        paymentMethod: 'PayPal',
        itemsPrice: (products[0]?.price || 99.99) * 2,
        taxPrice: 15.99,
        shippingPrice: 10.00,
        totalPrice: (products[0]?.price || 99.99) * 2 + 15.99 + 10.00,
        orderStatus: 'pending',
        isPaid: false,
        isDelivered: false
      },
      {
        orderItems: [
          {
            name: products[1]?.name || 'Test Product 2',
            quantity: 1,
            price: products[1]?.price || 149.99,
            product: products[1]?._id,
            image: products[1]?.images?.[0] || 'https://via.placeholder.com/300x300'
          },
          {
            name: products[2]?.name || 'Test Product 3',
            quantity: 1,
            price: products[2]?.price || 79.99,
            product: products[2]?._id,
            image: products[2]?.images?.[0] || 'https://via.placeholder.com/300x300'
          }
        ],
        user: users[1]?._id || users[0]._id,
        shippingAddress: {
          address: '456 Another Street',
          city: 'Another City',
          postalCode: '54321',
          country: 'Another Country'
        },
        paymentMethod: 'Credit Card',
        itemsPrice: (products[1]?.price || 149.99) + (products[2]?.price || 79.99),
        taxPrice: 22.99,
        shippingPrice: 15.00,
        totalPrice: (products[1]?.price || 149.99) + (products[2]?.price || 79.99) + 22.99 + 15.00,
        orderStatus: 'shipped',
        isPaid: true,
        isDelivered: false
      },
      {
        orderItems: [
          {
            name: products[3]?.name || 'Test Product 4',
            quantity: 3,
            price: products[3]?.price || 49.99,
            product: products[3]?._id,
            image: products[3]?.images?.[0] || 'https://via.placeholder.com/300x300'
          }
        ],
        user: users[2]?._id || users[0]._id,
        shippingAddress: {
          address: '789 Final Street',
          city: 'Final City',
          postalCode: '98765',
          country: 'Final Country'
        },
        paymentMethod: 'Stripe',
        itemsPrice: (products[3]?.price || 49.99) * 3,
        taxPrice: 22.49,
        shippingPrice: 12.00,
        totalPrice: (products[3]?.price || 49.99) * 3 + 22.49 + 12.00,
        orderStatus: 'delivered',
        isPaid: true,
        isDelivered: true,
        deliveredAt: new Date()
      }
    ];
    
    // Create orders
    for (const orderData of testOrders) {
      const order = new Order(orderData);
      await order.save();
    }
    
    console.log('🎉 Test orders created successfully!');
    console.log(`📦 Created ${testOrders.length} test orders`);
    console.log('\nYou can now view these orders in the admin panel!');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating test orders:', error);
    process.exit(1);
  }
}

createTestOrders();
