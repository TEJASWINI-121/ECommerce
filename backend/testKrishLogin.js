import axios from 'axios';

const testKrishLogin = async () => {
  try {
    console.log('🧪 Testing Krish login...\n');
    
    // Test login with krish@gmail.com
    console.log('1. Testing login with krish@gmail.com...');
    const loginResponse = await axios.post('http://localhost:8000/api/auth/login', {
      email: 'krish@gmail.com',
      password: 'krish123'
    });
    
    console.log('✅ Login successful done!');
    console.log('👤 User:', loginResponse.data.name);
    console.log('📧 Email:', loginResponse.data.email);
    console.log('🔑 Token:', loginResponse.data.token ? 'Present' : 'Missing');
    console.log('🎫 Token preview:', loginResponse.data.token.substring(0, 30) + '...');
    
    const token = loginResponse.data.token;
    
    // Test cart access
    console.log('\n2. Testing cart access...');
    const cartResponse = await axios.get('http://localhost:8000/api/users/cart', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    
    console.log('✅ Cart access successful!');
    console.log('🛒 Cart items:', cartResponse.data.length);
    
    // Test add to cart
    console.log('\n3. Testing add to cart...');
    const productsResponse = await axios.get('http://localhost:8000/api/products?limit=1');
    const product = productsResponse.data.products[0];
    
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
    console.log('📦 Added product:', addToCartResponse.data[addToCartResponse.data.length - 1].product.name);
    
    console.log('\n🎉 ALL TESTS PASSED!');
    console.log('\n📋 KRISH LOGIN CREDENTIALS:');
    console.log('Email: krish@gmail.com');
    console.log('Password: krish123');
    console.log('\n💡 Frontend should now work with these credentials!');
    
  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
  }
};

testKrishLogin();
