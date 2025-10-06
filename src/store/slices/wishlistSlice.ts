import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { toast } from 'react-toastify';
import { API_BASE_URL } from '../../utils/simpleMockData';

const API_URL = `${import.meta.env.VITE_API_URL}/users`;

// Get user from localStorage
const getUserFromStorage = () => {
  try {
    const user = localStorage.getItem('currentUser');
    return user ? JSON.parse(user) : null;
  } catch {
    return null;
  }
};

// Add to wishlist (localStorage implementation)
export const addToWishlist = createAsyncThunk(
  'wishlist/addToWishlist',
  async (product: any, thunkAPI) => {
    try {
      console.log('🔄 Adding to wishlist:', product.name);

      // Get current wishlist from localStorage
      const existingWishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');

      // Check if product already exists
      const existingIndex = existingWishlist.findIndex((item: any) => item._id === product._id);

      if (existingIndex !== -1) {
        toast.info('Product already in wishlist!');
        return thunkAPI.rejectWithValue('Product already in wishlist');
      }

      // Add product to wishlist
      const updatedWishlist = [...existingWishlist, product];
      localStorage.setItem('wishlist', JSON.stringify(updatedWishlist));

      console.log('✅ Added to wishlist successfully');
      toast.success('Added to wishlist!');
      return product;
    } catch (error: any) {
      console.error('❌ Failed to add to wishlist:', error.message);
      const message = 'Failed to add to wishlist';
      toast.error(message);
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Remove from wishlist (localStorage implementation)
export const removeFromWishlist = createAsyncThunk(
  'wishlist/removeFromWishlist',
  async (productId: string, thunkAPI) => {
    try {
      console.log('🔄 Removing from wishlist:', productId);

      // Get current wishlist from localStorage
      const existingWishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');

      // Remove product from wishlist
      const updatedWishlist = existingWishlist.filter((item: any) => item._id !== productId);
      localStorage.setItem('wishlist', JSON.stringify(updatedWishlist));

      console.log('✅ Removed from wishlist successfully');
      toast.success('Removed from wishlist!');
      return response.data;
    } catch (error: any) {
      console.error('❌ Failed to remove from wishlist:', error.message);
      const message = 'Failed to remove from wishlist';
      toast.error(message);
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Get wishlist (localStorage implementation)
export const getWishlist = createAsyncThunk(
  'wishlist/getWishlist',
  async (_, thunkAPI) => {
    try {
      console.log('🔄 Fetching wishlist from localStorage');

      // Get wishlist from localStorage
      const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');

      console.log('✅ Fetched wishlist successfully:', wishlist.length, 'items');
      return wishlist;
    } catch (error: any) {
      console.error('❌ Failed to fetch wishlist:', error.message);
      const message = 'Failed to fetch wishlist';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

interface WishlistState {
  items: any[];
  isLoading: boolean;
  error: string | null;
}

const initialState: WishlistState = {
  items: [],
  isLoading: false,
  error: null,
};

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState,
  reducers: {
    clearWishlistError: (state) => {
      state.error = null;
    },
    resetWishlist: (state) => {
      state.items = [];
      state.error = null;
      state.isLoading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // Add to wishlist
      .addCase(addToWishlist.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(addToWishlist.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items.push(action.payload);
      })
      .addCase(addToWishlist.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Remove from wishlist
      .addCase(removeFromWishlist.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(removeFromWishlist.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = state.items.filter(item => item._id !== action.payload);
      })
      .addCase(removeFromWishlist.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Get wishlist
      .addCase(getWishlist.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getWishlist.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload;
      })
      .addCase(getWishlist.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearWishlistError, resetWishlist } = wishlistSlice.actions;
export default wishlistSlice.reducer;
