// API Connection Test Utility
import axios from 'axios';

const API_ENDPOINTS = [
  'http://localhost:8000',
  'http://localhost:5000'
];

export const testApiConnection = async () => {
  const results: any[] = [];
  
  for (const endpoint of API_ENDPOINTS) {
    try {
      console.log(`🔄 Testing connection to ${endpoint}...`);
      const response = await axios.get(endpoint, { timeout: 5000 });
      results.push({
        endpoint,
        status: 'success',
        data: response.data,
        statusCode: response.status
      });
      console.log(`✅ ${endpoint} is working:`, response.data);
    } catch (error: any) {
      results.push({
        endpoint,
        status: 'failed',
        error: error.message,
        code: error.code
      });
      console.log(`❌ ${endpoint} failed:`, error.message);
    }
  }
  
  return results;
};

export const testAuthEndpoints = async (baseUrl: string) => {
  const results: any[] = [];
  
  // Test registration
  try {
    console.log(`🔄 Testing registration at ${baseUrl}/api/auth/register...`);
    const testUser = {
      name: `Test User ${Date.now()}`,
      email: `test${Date.now()}@example.com`,
      password: 'test123'
    };
    
    const response = await axios.post(`${baseUrl}/api/auth/register`, testUser);
    results.push({
      endpoint: 'register',
      status: 'success',
      data: response.data
    });
    console.log('✅ Registration successful:', response.data);
    
    // Test login with the same user
    try {
      console.log(`🔄 Testing login...`);
      const loginResponse = await axios.post(`${baseUrl}/api/auth/login`, {
        email: testUser.email,
        password: testUser.password
      });
      results.push({
        endpoint: 'login',
        status: 'success',
        data: loginResponse.data
      });
      console.log('✅ Login successful:', loginResponse.data);
      
      // Test cart with the token
      if (loginResponse.data.token) {
        try {
          console.log(`🔄 Testing cart...`);
          const cartResponse = await axios.get(`${baseUrl}/api/users/cart`, {
            headers: {
              Authorization: `Bearer ${loginResponse.data.token}`
            }
          });
          results.push({
            endpoint: 'cart',
            status: 'success',
            data: cartResponse.data
          });
          console.log('✅ Cart access successful:', cartResponse.data);
        } catch (cartError: any) {
          results.push({
            endpoint: 'cart',
            status: 'failed',
            error: cartError.response?.data || cartError.message
          });
          console.log('❌ Cart access failed:', cartError.response?.data || cartError.message);
        }
      }
      
    } catch (loginError: any) {
      results.push({
        endpoint: 'login',
        status: 'failed',
        error: loginError.response?.data || loginError.message
      });
      console.log('❌ Login failed:', loginError.response?.data || loginError.message);
    }
    
  } catch (registerError: any) {
    results.push({
      endpoint: 'register',
      status: 'failed',
      error: registerError.response?.data || registerError.message
    });
    console.log('❌ Registration failed:', registerError.response?.data || registerError.message);
  }
  
  return results;
};

export const runCompleteApiTest = async () => {
  console.log('🧪 Starting complete API test...');
  
  // Test basic connections
  const connectionResults = await testApiConnection();
  
  // Find working endpoint
  const workingEndpoint = connectionResults.find(r => r.status === 'success');
  
  if (workingEndpoint) {
    console.log(`🎯 Using working endpoint: ${workingEndpoint.endpoint}`);
    
    // Test auth endpoints
    const authResults = await testAuthEndpoints(workingEndpoint.endpoint);
    
    return {
      connection: connectionResults,
      auth: authResults,
      workingEndpoint: workingEndpoint.endpoint
    };
  } else {
    console.log('❌ No working endpoints found');
    return {
      connection: connectionResults,
      auth: [],
      workingEndpoint: null
    };
  }
};
