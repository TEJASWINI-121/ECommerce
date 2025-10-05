import axios from 'axios';

const testOrderCreation = async () => {
  try {
    console.log('🧪 Testing order creation...\n');
    
    // Step 1: Login
    console.log('1. Logging in...');
    const loginResponse = await axios.post('http://localhost:8000/api/auth/login', {
      email: 'test@example.com',
      password: 'password123'
    });
    
    const token = loginResponse.data.token;
    console.log('✅ Login is successful');
    
    // Step 2: Get a product for the order
    console.log('\n2. Getting product...');
    const productsResponse = await axios.get('http://localhost:8000/api/products?limit=1');
    const product = productsResponse.data.products[0];
    console.log('✅ Product found:', product.name);
    
    // Step 3: Create order
    console.log('\n3. Creating order...');
    const orderData = {
      orderItems: [{
        name: product.name,
        quantity: 2,
        image: product.images[0],
        price: product.price,
        _id: product._id,
      }],
      shippingAddress: {
        address: '123 Test Street',
        city: 'Test City',
        postalCode: '12345',
        country: 'USA'
      },
      paymentMethod: 'Cash on Delivery',
      itemsPrice: product.price * 2,
      taxPrice: product.price * 2 * 0.08,
      shippingPrice: 0,
      totalPrice: product.price * 2 * 1.08,
    };
    
    console.log('📦 Order data:', JSON.stringify(orderData, null, 2));
    
    const orderResponse = await axios.post('http://localhost:8000/api/orders', orderData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    console.log('✅ Order created successfully!');
    console.log('🆔 Order ID:', orderResponse.data._id);
    console.log('💰 Total Price:', orderResponse.data.totalPrice);
    console.log('📦 Items:', orderResponse.data.orderItems.length);
    
    // Step 4: Get the created order
    console.log('\n4. Retrieving order...');
    const getOrderResponse = await axios.get(`http://localhost:8000/api/orders/${orderResponse.data._id}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    
    console.log('✅ Order retrieved successfully!');
    console.log('📋 Order status:', getOrderResponse.data.orderStatus || 'Pending');
    console.log('🚚 Is delivered:', getOrderResponse.data.isDelivered);
    console.log('💳 Is paid:', getOrderResponse.data.isPaid);
    
    console.log('\n🎉 ORDER SYSTEM WORKING PERFECTLY!');
    
  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Headers:', error.response.headers);
    }
  }
};

testOrderCreation();
