import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { getCartFromStorage, saveCartToStorage, clearCart } from '../../utils/localStorage';

const API_URL = 'http://localhost:8000/api/users';

interface CartItem {
  product: {
    _id: string;
    name: string;
    price: number;
    images: string[];
    stock: number;
  };
  quantity: number;
}

interface CartState {
  items: CartItem[];
  isLoading: boolean;
  isError: boolean;
  message: string;
}

// Helper functions are now imported from localStorage.ts
// Remove duplicate functions since we're using the imported ones

const initialState: CartState = {
  items: [], // Will be loaded when user logs in
  isLoading: false,
  isError: false,
  message: '',
};

// Get cart items
export const getCart = createAsyncThunk(
  'cart/getCart',
  async (_, thunkAPI) => {
    try {
      const state: any = thunkAPI.getState();
      const token = state.auth.user?.token;

      console.log('🛒 GetCart Debug:', {
        hasToken: !!token,
        token: token ? `${token.substring(0, 10)}...` : 'No token',
        apiUrl: API_URL
      });

      if (!token) {
        console.log('📦 No token available, using localStorage cart');
        // Return localStorage cart if no token
        return getCartFromStorage();
      }

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      console.log('📡 Making get cart API request to:', `${API_URL}/cart`);
      const response = await axios.get(`${API_URL}/cart`, config);
      console.log('✅ Get cart API response:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('❌ Get cart API error, falling back to localStorage:', error.response?.data || error.message);
      // Fallback to localStorage if API fails
      return getCartFromStorage();
    }
  }
);

// Add to cart
export const addToCart = createAsyncThunk(
  'cart/addToCart',
  async ({ productId, quantity, product }: { productId: string; quantity: number; product?: any }, thunkAPI) => {
    try {
      const state: any = thunkAPI.getState();
      const token = state.auth.user?.token;

      console.log('🛒 AddToCart Debug:', {
        productId,
        quantity,
        hasToken: !!token,
        token: token ? `${token.substring(0, 10)}...` : 'No token',
        apiUrl: API_URL
      });

      const isMockToken = token && token.startsWith('mock-token-');

      if (!token || isMockToken) {
        console.log('📦 No valid token available (mock or missing), using localStorage cart');
        // Handle localStorage cart when no token or mock token
        const currentCart = getCartFromStorage();
        const existingItemIndex = currentCart.findIndex(item => item.product._id === productId);

        if (existingItemIndex >= 0) {
          currentCart[existingItemIndex].quantity += quantity;
        } else if (product) {
          currentCart.push({ product, quantity });
        }

        saveCartToStorage(currentCart);
        console.log('💾 Cart saved to localStorage:', currentCart);
        return currentCart;
      }

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      };

      console.log('📡 Making cart API request to:', `${API_URL}/cart`);
      const response = await axios.post(`${API_URL}/cart`, { productId, quantity }, config);
      console.log('✅ Cart API response:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('❌ Cart API error, falling back to localStorage:', error.response?.data || error.message);
      // Fallback to localStorage if API fails
      try {
        const currentCart = getCartFromStorage();
        const existingItemIndex = currentCart.findIndex(item => item.product._id === productId);

        if (existingItemIndex >= 0) {
          currentCart[existingItemIndex].quantity += quantity;
        } else if (product) {
          currentCart.push({ product, quantity });
        }

        saveCartToStorage(currentCart);
        console.log('💾 Fallback: Cart saved to localStorage:', currentCart);
        return currentCart;
      } catch (fallbackError) {
        console.error('❌ Fallback cart operation failed:', fallbackError);
        return thunkAPI.rejectWithValue('Failed to add item to cart');
      }
    }
  }
);

// Update cart item quantity
export const updateCartItem = createAsyncThunk(
  'cart/updateCartItem',
  async ({ productId, quantity }: { productId: string; quantity: number }, thunkAPI) => {
    try {
      const state: any = thunkAPI.getState();
      const token = state.auth.user?.token;

      if (!token) {
        console.log('📦 No token available, updating localStorage cart');
        // Handle localStorage cart when no token
        const currentCart = getCartFromStorage();
        const existingItemIndex = currentCart.findIndex(item => item.product._id === productId);

        if (existingItemIndex >= 0) {
          currentCart[existingItemIndex].quantity = quantity;
          saveCartToStorage(currentCart);
        }

        return currentCart;
      }

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      };

      const response = await axios.post(`${API_URL}/cart`, { productId, quantity }, config);
      return response.data;
    } catch (error: any) {
      console.error('❌ Update cart API error, falling back to localStorage');
      // Fallback to localStorage if API fails
      const currentCart = getCartFromStorage();
      const existingItemIndex = currentCart.findIndex(item => item.product._id === productId);

      if (existingItemIndex >= 0) {
        currentCart[existingItemIndex].quantity = quantity;
        saveCartToStorage(currentCart);
      }

      return currentCart;
    }
  }
);

// Remove from cart
export const removeFromCart = createAsyncThunk(
  'cart/removeFromCart',
  async (productId: string, thunkAPI) => {
    try {
      const state: any = thunkAPI.getState();
      const token = state.auth.user?.token;

      if (!token) {
        console.log('📦 No token available, removing from localStorage cart');
        // Handle localStorage cart when no token
        const currentCart = getCartFromStorage();
        const updatedCart = currentCart.filter(item => item.product._id !== productId);
        saveCartToStorage(updatedCart);
        return updatedCart;
      }

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const response = await axios.delete(`${API_URL}/cart/${productId}`, config);
      return response.data;
    } catch (error: any) {
      console.error('❌ Remove cart API error, falling back to localStorage');
      // Fallback to localStorage if API fails
      const currentCart = getCartFromStorage();
      const updatedCart = currentCart.filter(item => item.product._id !== productId);
      saveCartToStorage(updatedCart);
      return updatedCart;
    }
  }
);

// Clear cart
export const clearCart = createAsyncThunk(
  'cart/clearCart',
  async (_, thunkAPI) => {
    try {
      const state: any = thunkAPI.getState();
      const token = state.auth.user?.token;
      
      if (!token) {
        return thunkAPI.rejectWithValue('No token available');
      }

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      await axios.delete(`${API_URL}/cart`, config);
      return [];
    } catch (error: any) {
      const message = error.response?.data?.message || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false;
      state.isError = false;
      state.message = '';
    },
    loadUserCart: (state) => {
      // Load cart from localStorage for current user
      state.items = getCartFromStorage();
    },
    clearUserCart: (state) => {
      // Clear cart when user logs out
      state.items = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getCart.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getCart.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload;
        saveCartToStorage(action.payload);
      })
      .addCase(getCart.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload as string;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.items = action.payload;
        // Save to localStorage using the imported function
        const { saveCartToStorage: saveCart } = require('../../utils/localStorage');
        saveCart(action.payload);
      })
      .addCase(updateCartItem.fulfilled, (state, action) => {
        state.items = action.payload;
        const { saveCartToStorage: saveCart } = require('../../utils/localStorage');
        saveCart(action.payload);
      })
      .addCase(removeFromCart.fulfilled, (state, action) => {
        state.items = action.payload;
        const { saveCartToStorage: saveCart } = require('../../utils/localStorage');
        saveCart(action.payload);
      })
      .addCase(clearCart.fulfilled, (state) => {
        state.items = [];
        const { saveCartToStorage: saveCart } = require('../../utils/localStorage');
        saveCart([]);
      });
  },
});

export const { reset, loadUserCart, clearUserCart } = cartSlice.actions;
export default cartSlice.reducer;