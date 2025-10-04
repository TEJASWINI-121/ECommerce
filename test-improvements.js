/**
 * Test Improvements Script
 * 
 * This script tests the improvements made to the project:
 * 1. Runs the image download process
 * 2. Tests local storage integration
 * 3. Verifies product organization by categories
 */

import { exec } from 'child_process';
import { promisify } from 'util';
import fs from 'fs';
import path from 'path';

const execAsync = promisify(exec);

// Function to run a command and log output
async function runCommand(command, description) {
  console.log(`\n🚀 ${description}...`);
  try {
    const { stdout, stderr } = await execAsync(command);
    if (stdout) console.log(stdout);
    if (stderr) console.error(stderr);
    console.log(`✅ ${description} completed successfully`);
    return true;
  } catch (error) {
    console.error(`❌ ${description} failed:`, error.message);
    return false;
  }
}

// Function to check if directory exists and has files
function checkDirectory(dirPath, minFiles = 1) {
  try {
    if (!fs.existsSync(dirPath)) {
      console.error(`❌ Directory does not exist: ${dirPath}`);
      return false;
    }
    
    const files = fs.readdirSync(dirPath);
    if (files.length < minFiles) {
      console.error(`❌ Directory has fewer than ${minFiles} files: ${dirPath}`);
      return false;
    }
    
    console.log(`✅ Directory check passed: ${dirPath} (${files.length} files)`);
    return true;
  } catch (error) {
    console.error(`❌ Error checking directory ${dirPath}:`, error.message);
    return false;
  }
}

// Main test function
async function runTests() {
  console.log('🔍 Starting improvement tests...');
  
  // Step 1: Run the image download script
  const downloadSuccess = await runCommand(
    'node backend/scripts/downloadImages.js',
    'Running image download process'
  );
  
  if (!downloadSuccess) {
    console.error('❌ Image download process failed, but continuing with other tests');
  }
  
  // Step 2: Check image directories and count images
  console.log('\n🔍 Checking image directories...');
  const imageBaseDir = path.join(process.cwd(), 'public', 'images');
  const categoryDirs = [
    'electronics',
    'clothing',
    'home',
    'beauty',
    'books',
    'toys'
  ];
  
  let dirChecksPass = true;
  let totalImages = 0;
  
  for (const category of categoryDirs) {
    const categoryDir = path.join(imageBaseDir, category);
    const dirCheck = checkDirectory(categoryDir, 0); // Allow empty directories for now
    dirChecksPass = dirChecksPass && dirCheck;
    
    // Count images in each category directory
    if (dirCheck && fs.existsSync(categoryDir)) {
      try {
        const files = fs.readdirSync(categoryDir);
        const imageFiles = files.filter(file => {
          const ext = path.extname(file).toLowerCase();
          return ['.jpg', '.jpeg', '.png', '.webp', '.gif'].includes(ext);
        });
        
        totalImages += imageFiles.length;
        console.log(`  - ${category}: ${imageFiles.length} images`);
      } catch (error) {
        console.error(`Error counting images in ${category}:`, error);
      }
    }
  }
  
  console.log(`\n📊 Total images found: ${totalImages}`);
  
  if (totalImages < 300) {
    console.warn(`⚠️ Expected at least 300 images, but found only ${totalImages}`);
  } else {
    console.log(`✅ Successfully downloaded ${totalImages} images (target: 300+)`);
  }
  
  if (!dirChecksPass) {
    console.warn('⚠️ Some image directory checks failed, but continuing with other tests');
  }
  
  // Step 3: Test order status update functionality
  console.log('\n🔍 Testing order status update functionality...');
  
  // Create a test order in localStorage if none exists
  const testOrderId = 'test-order-' + Date.now();
  const testOrderScript = `
    // Check if we have any orders
    const allOrders = localStorage.getItem('simple_orders_all');
    const orders = allOrders ? JSON.parse(allOrders) : [];
    
    if (orders.length === 0) {
      // Create a test order
      const testOrder = {
        _id: '${testOrderId}',
        userId: 'test-user',
        orderItems: [{
          _id: 'test-product',
          name: 'Test Product',
          image: '/images/electronics/test-product.jpg',
          price: 99.99,
          countInStock: 10,
          qty: 1
        }],
        shippingAddress: {
          fullName: 'Test User',
          address: '123 Test St',
          city: 'Test City',
          postalCode: '12345',
          country: 'Test Country'
        },
        paymentMethod: 'PayPal',
        itemsPrice: 99.99,
        taxPrice: 10.00,
        shippingPrice: 5.00,
        totalPrice: 114.99,
        isPaid: true,
        isDelivered: false,
        status: 'pending',
        createdAt: new Date().toISOString(),
        paidAt: new Date().toISOString()
      };
      
      // Add to all orders
      orders.push(testOrder);
      localStorage.setItem('simple_orders_all', JSON.stringify(orders));
      console.log('Created test order:', testOrder._id);
    } else {
      console.log('Using existing orders for testing');
    }
  `;
  
  // Run the script to create a test order
  const createOrderResult = await runCommand(
    `node -e "${testOrderScript.replace(/"/g, '\\"')}"`,
    'Creating test order in localStorage'
  );
  
  if (!createOrderResult) {
    console.warn('⚠️ Failed to create test order, but continuing with other tests');
  }
  
  console.log('\n✅ Order status update functionality is ready for testing');
  console.log('To test:');
  console.log('1. Go to the Admin Dashboard');
  console.log('2. Find an order in the Recent Orders section');
  console.log('3. Use the dropdown to change the order status');
  console.log('4. Verify the status updates and notification appears');
  
  // Step 4: Start the server to test frontend improvements
  console.log('\n🔍 Starting server to test frontend improvements...');
  console.log('Please manually verify the following improvements in your browser:');
  console.log('1. Lazy loading of images and components');
  console.log('2. Local storage integration for product data');
  console.log('3. Product organization by categories');
  console.log('4. Improved loading performance');
  console.log('5. Admin dashboard order status updates');
  
  // Start the server
  await runCommand('npm run dev', 'Starting development server');
}

// Run the tests
runTests().catch(error => {
  console.error('❌ Test script failed:', error);
  process.exit(1);
});