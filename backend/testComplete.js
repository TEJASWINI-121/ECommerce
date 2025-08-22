import axios from 'axios';

const testCompleteSystem = async () => {
  try {
    console.log('🧪 Testing complete optimized system...\n');
    
    // Test 1: Backend health
    console.log('1. Testing backend health...');
    const healthResponse = await axios.get('http://localhost:8000');
    console.log('✅ Backend:', healthResponse.data.message);
    
    // Test 2: Products API (optimized)
    console.log('\n2. Testing optimized products API...');
    const start = Date.now();
    const productsResponse = await axios.get('http://localhost:8000/api/products?limit=10');
    const loadTime = Date.now() - start;
    console.log(`✅ Products loaded in ${loadTime}ms`);
    console.log(`📦 Found ${productsResponse.data.products.length} products`);
    console.log(`📄 Total pages: ${productsResponse.data.pages}`);
    
    // Test 3: Login
    console.log('\n3. Testing login...');
    const loginResponse = await axios.post('http://localhost:8000/api/auth/login', {
      email: 'test@example.com',
      password: 'password123'
    });
    console.log('✅ Login successful');
    console.log('👤 User:', loginResponse.data.name);
    
    const token = loginResponse.data.token;
    
    // Test 4: Cart operations
    console.log('\n4. Testing cart operations...');
    
    // Get cart
    const cartStart = Date.now();
    const cartResponse = await axios.get('http://localhost:8000/api/users/cart', {
      headers: { Authorization: `Bearer ${token}` }
    });
    const cartLoadTime = Date.now() - cartStart;
    console.log(`✅ Cart loaded in ${cartLoadTime}ms`);
    console.log(`🛒 Cart items: ${cartResponse.data.length}`);
    
    // Add to cart
    const product = productsResponse.data.products[0];
    const addStart = Date.now();
    const addResponse = await axios.post('http://localhost:8000/api/users/cart', {
      productId: product._id,
      quantity: 1
    }, {
      headers: { 
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    const addTime = Date.now() - addStart;
    console.log(`✅ Added to cart in ${addTime}ms`);
    console.log(`🛒 Updated cart items: ${addResponse.data.length}`);
    
    if (addResponse.data.length > 0) {
      console.log(`📦 Added: ${addResponse.data[addResponse.data.length - 1].product.name}`);
    }
    
    console.log('\n🎉 ALL TESTS PASSED!');
    console.log('\n📊 PERFORMANCE SUMMARY:');
    console.log(`⚡ Products API: ${loadTime}ms`);
    console.log(`⚡ Cart Load: ${cartLoadTime}ms`);
    console.log(`⚡ Add to Cart: ${addTime}ms`);
    
    if (loadTime < 1000 && cartLoadTime < 1000 && addTime < 1000) {
      console.log('🚀 EXCELLENT PERFORMANCE - All operations under 1 second!');
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
  }
};

testCompleteSystem();
