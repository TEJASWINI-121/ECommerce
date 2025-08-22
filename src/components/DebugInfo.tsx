import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../store/store';
import { MOCK_PRODUCTS } from '../utils/mockData';
import { getCurrentUser, getCartFromStorage, getWishlistFromStorage } from '../utils/localStorage';
import { register, login } from '../store/slices/authSlice';
import { addToCart } from '../store/slices/cartSlice';
import { runCompleteApiTest } from '../utils/apiTest';
import { addToSimpleCart, getSimpleCartCount, addToSimpleWishlist, getSimpleWishlist } from '../utils/simpleCart';

const DebugInfo: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [testResults, setTestResults] = useState<string[]>([]);
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);
  const { items } = useSelector((state: RootState) => state.cart);
  const { products } = useSelector((state: RootState) => state.products);

  const currentUser = getCurrentUser();
  const cartFromStorage = getCartFromStorage();
  const wishlistFromStorage = getWishlistFromStorage();

  const testApiConnection = async () => {
    setTestResults(['🔄 Testing API connection...']);

    try {
      const results = await runCompleteApiTest();
      const messages: string[] = [];

      messages.push('🔗 Connection Results:');
      results.connection.forEach(conn => {
        messages.push(`${conn.status === 'success' ? '✅' : '❌'} ${conn.endpoint}: ${conn.status}`);
      });

      if (results.workingEndpoint) {
        messages.push(`🎯 Working endpoint: ${results.workingEndpoint}`);

        messages.push('🔐 Auth Results:');
        results.auth.forEach(auth => {
          messages.push(`${auth.status === 'success' ? '✅' : '❌'} ${auth.endpoint}: ${auth.status}`);
        });
      }

      setTestResults(messages);
    } catch (error: any) {
      setTestResults([`❌ API test failed: ${error.message}`]);
    }
  };

  const testCompleteFlow = async () => {
    const results: string[] = [];
    setTestResults(['🔄 Starting complete e-commerce test...']);

    try {
      // Test 1: Register new user
      results.push('1. Testing user registration...');
      const testEmail = `test${Date.now()}@example.com`;
      const registerResult = await dispatch(register({
        name: 'Test User',
        email: testEmail,
        password: 'test123',
        role: 'user'
      })).unwrap();
      results.push(`✅ Registration successful: ${registerResult.name}`);
      results.push(`📧 Email: ${registerResult.email}`);
      results.push(`🆔 ID: ${registerResult._id}`);

      // Test 2: Check localStorage
      results.push('2. Checking localStorage...');
      const allUsers = JSON.parse(localStorage.getItem('allUsers') || '[]');
      const currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');
      results.push(`👥 Total users in localStorage: ${allUsers.length}`);
      results.push(`👤 Current user: ${currentUser ? currentUser.email : 'None'}`);

      // Test 3: Add product to cart
      results.push('3. Testing add to cart...');
      const testProduct = MOCK_PRODUCTS[0];
      if (testProduct) {
        const success = addToSimpleCart(testProduct);
        if (success) {
          const cartCount = getSimpleCartCount();
          results.push(`✅ Add to cart successful: ${cartCount} items`);
        } else {
          results.push(`❌ Add to cart failed`);
        }
      }

      // Test 4: Add to wishlist
      results.push('4. Testing add to wishlist...');
      if (testProduct) {
        const success = addToSimpleWishlist(testProduct);
        if (success) {
          const wishlist = getSimpleWishlist();
          results.push(`✅ Add to wishlist successful: ${wishlist.length} items`);
        } else {
          results.push(`❌ Add to wishlist failed`);
        }
      }

      results.push('🎉 All tests completed!');
    } catch (error: any) {
      results.push(`❌ Test failed: ${error.message || error}`);
      console.error('Test error:', error);
    }

    setTestResults(results);
  };

  if (process.env.NODE_ENV === 'production') {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-red-500 text-white px-3 py-2 rounded-lg shadow-lg hover:bg-red-600 transition-colors"
      >
        Debug {isOpen ? '▼' : '▲'}
      </button>
      
      {isOpen && (
        <div className="absolute bottom-12 right-0 bg-white border border-gray-300 rounded-lg shadow-xl p-4 w-96 max-h-96 overflow-y-auto">
          <h3 className="font-bold text-lg mb-3">Debug Information</h3>
          
          <div className="space-y-3 text-sm">
            <div>
              <strong>Products Count:</strong>
              <div className="ml-2">
                <div>MOCK_PRODUCTS: {MOCK_PRODUCTS.length}</div>
                <div>Redux products: {products.length}</div>
              </div>
            </div>

            <div>
              <strong>User State:</strong>
              <div className="ml-2">
                <div>Redux user: {user ? user.name : 'None'}</div>
                <div>Redux token: {user?.token ? `${user.token.substring(0, 15)}...` : 'None'}</div>
                <div>localStorage user: {currentUser ? currentUser.name : 'None'}</div>
                <div>localStorage token: {currentUser?.token ? `${currentUser.token.substring(0, 15)}...` : 'None'}</div>
              </div>
            </div>

            <div>
              <strong>Cart State:</strong>
              <div className="ml-2">
                <div>Redux cart items: {items.length}</div>
                <div>localStorage cart: {cartFromStorage.length}</div>
              </div>
            </div>

            <div>
              <strong>Wishlist:</strong>
              <div className="ml-2">
                <div>localStorage wishlist: {wishlistFromStorage.length}</div>
              </div>
            </div>

            <div>
              <strong>Categories:</strong>
              <div className="ml-2">
                {Array.from(new Set(MOCK_PRODUCTS.map(p => p.category))).map(cat => (
                  <div key={cat}>
                    {cat}: {MOCK_PRODUCTS.filter(p => p.category === cat).length}
                  </div>
                ))}
              </div>
            </div>

            <div>
              <strong>LocalStorage Keys:</strong>
              <div className="ml-2 max-h-20 overflow-y-auto">
                {Object.keys(localStorage).map(key => (
                  <div key={key} className="text-xs">{key}</div>
                ))}
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-gray-200 space-y-2">
              <button
                onClick={testApiConnection}
                className="w-full bg-blue-500 text-white px-3 py-2 rounded text-sm hover:bg-blue-600 transition-colors"
              >
                🔗 Test API Connection
              </button>

              <button
                onClick={testCompleteFlow}
                className="w-full bg-green-500 text-white px-3 py-2 rounded text-sm hover:bg-green-600 transition-colors"
              >
                🧪 Test Complete Flow
              </button>

              {testResults.length > 0 && (
                <div className="mt-2 p-2 bg-gray-100 rounded text-xs max-h-32 overflow-y-auto">
                  {testResults.map((result, index) => (
                    <div key={index} className="mb-1">{result}</div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DebugInfo;
