import axios from 'axios';

const testLoginAndCart = async () => {
  try {
    console.log('🧪 Testing login and cart functionality...\n');
    
    // Test login
    console.log('1. Testing login...');
    const loginResponse = await axios.post('http://localhost:8000/api/auth/login', {
      email: 'test@example.com',
      password: 'password123'
    });
    
    console.log('✅ Login successful!');
    console.log('👤 User:', loginResponse.data.name);
    console.log('📧 Email:', loginResponse.data.email);
    console.log('🔑 Token:', loginResponse.data.token ? 'Present' : 'Missing');
    
    const token = loginResponse.data.token;
    
    // Test get cart
    console.log('\n2. Testing get cart...');
    const cartResponse = await axios.get('http://localhost:8000/api/users/cart', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    
    console.log('✅ Get cart successful!');
    console.log('🛒 Cart items:', cartResponse.data.length);
    
    // Get a product to add to cart
    console.log('\n3. Getting a product...');
    const productsResponse = await axios.get('http://localhost:8000/api/products?limit=1');
    const product = productsResponse.data.products[0];
    
    console.log('📦 Product:', product.name);
    console.log('💰 Price:', product.price);
    
    // Test add to cart
    console.log('\n4. Testing add to cart...');
    const addToCartResponse = await axios.post('http://localhost:8000/api/users/cart', {
      productId: product._id,
      quantity: 1
    }, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    console.log('✅ Add to cart successful!');
    console.log('🛒 Updated cart items:', addToCartResponse.data.length);
    
    if (addToCartResponse.data.length > 0) {
      console.log('📦 First item:', addToCartResponse.data[0].product.name);
      console.log('🔢 Quantity:', addToCartResponse.data[0].quantity);
    }
    
    console.log('\n🎉 All tests passed! Cart functionality is working correctly.');
    
  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
  }
};

testLoginAndCart();
