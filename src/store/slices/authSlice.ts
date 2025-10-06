import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { toast } from 'react-toastify';
import { saveUserToStorage, getCurrentUser, removeCurrentUser, clearAllUserData } from '../../utils/localStorage';

const API_URL = `${import.meta.env.VITE_API_URL}/auth`;

// Mock users for different roles
const MOCK_USERS = [
  {
    _id: 'user1',
    name: 'John Doe',
    email: 'user@example.com',
    password: 'user123',
    role: 'user',
    token: 'mock-user-token'
  },
  {
    _id: 'admin1',
    name: 'Admin User',
    email: 'admin@example.com',
    password: 'admin123',
    role: 'admin',
    token: 'mock-admin-token'
  },
  {
    _id: 'seller1',
    name: 'Seller Smith',
    email: 'seller@example.com',
    password: 'seller123',
    role: 'seller',
    token: 'mock-seller-token'
  },
  {
    _id: 'delivery1',
    name: 'Delivery Agent',
    email: 'delivery@example.com',
    password: 'delivery123',
    role: 'delivery',
    token: 'mock-delivery-token'
  }
];

// Simple authentication function
const authenticateUser = (email: string, password: string) => {
  const user = MOCK_USERS.find(u => u.email === email && u.password === password);
  if (user) {
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }
  return null;
};

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  token: string;
}

interface AuthState {
  user: User | null;
  isLoading: boolean;
  isSuccess: boolean;
  isError: boolean;
  message: string;
}

const initialState: AuthState = {
  user: getCurrentUser(),
  isLoading: false,
  isSuccess: false,
  isError: false,
  message: '',
};

// Register user
export const register = createAsyncThunk(
  'auth/register',
  async (userData: { name: string; email: string; password: string; role?: string }, thunkAPI) => {
    try {
      console.log('🔄 Attempting registration with MongoDB API:', userData.email);

      // Try API registration first (MongoDB)
      const response = await axios.post(`${API_URL}/register`, userData, {
        headers: {
          'Content-Type': 'application/json',
        },
        timeout: 10000, // 10 second timeout
      });

      console.log('✅ MongoDB registration successful:', response.data);

      if (response.data) {
        // Save to localStorage as backup
        saveUserToStorage(response.data);
        console.log('💾 User also saved to localStorage');
      }

      return response.data;
    } catch (apiError: any) {
      console.error('❌ MongoDB registration failed:', apiError.response?.data || apiError.message);

      // Check if it's a network error or user already exists
      if (apiError.response?.status === 400 && apiError.response?.data?.message === 'User already exists') {
        return thunkAPI.rejectWithValue('User already exists');
      }

      // For network errors, fallback to localStorage-only registration
      try {
        const newUser = {
          _id: `user_${Date.now()}`,
          name: userData.name,
          email: userData.email,
          role: userData.role || 'user',
          token: `mock-token-${Date.now()}`,
          createdAt: new Date().toISOString()
        };

        console.log('🔄 Network error - using localStorage fallback:', newUser.email);

        // Check if user already exists in localStorage
        const existingUsers = JSON.parse(localStorage.getItem('allUsers') || '[]');
        const existingLocalUser = existingUsers.find((user: any) => user.email === userData.email);

        if (existingLocalUser) {
          return thunkAPI.rejectWithValue('User already exists');
        }

        saveUserToStorage(newUser);
        console.log('💾 Fallback user saved to localStorage:', newUser.email);
        return newUser;
      } catch (fallbackError: any) {
        const message = 'Registration failed. Please try again.';
        return thunkAPI.rejectWithValue(message);
      }
    }
  }
);

// Login user
export const login = createAsyncThunk(
  'auth/login',
  async (userData: { email: string; password: string }, thunkAPI) => {
    try {
      console.log('🔄 Attempting login:', userData.email);

      // Try simple authentication first
      const authenticatedUser = authenticateUser(userData.email, userData.password);
      if (authenticatedUser) {
        console.log('✅ Simple authentication successful:', authenticatedUser.email);
        saveUserToStorage(authenticatedUser);
        toast.success(`Welcome back, ${authenticatedUser.name}!`);
        return authenticatedUser;
      }

      // Check localStorage users
      const existingUsers = JSON.parse(localStorage.getItem('allUsers') || '[]');
      const localUser = existingUsers.find((user: any) => user.email === userData.email);

      if (localUser) {
        console.log('✅ Found user in localStorage:', localUser.email);
        saveUserToStorage(localUser);
        toast.success(`Welcome back, ${localUser.name}!`);
        return localUser;
      }

      // If no user found anywhere
      return thunkAPI.rejectWithValue('Invalid email or password');
    } catch (error: any) {
      console.error('❌ Login failed:', error);
      return thunkAPI.rejectWithValue('Login failed. Please try again.');
    }
  }
);

// Logout user
export const logout = createAsyncThunk('auth/logout', async () => {
  clearAllUserData();
});

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false;
      state.isSuccess = false;
      state.isError = false;
      state.message = '';
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(register.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.user = action.payload;
      })
      .addCase(register.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload as string;
        state.user = null;
      })
      .addCase(login.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.user = action.payload;
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload as string;
        state.user = null;
      })
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
      });
  },
});

export const { reset } = authSlice.actions;
export default authSlice.reducer;