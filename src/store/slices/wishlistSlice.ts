import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { toast } from 'react-toastify';

const API_URL = 'http://localhost:8000/api/users';

// Get user from localStorage
const getUserFromStorage = () => {
  try {
    const user = localStorage.getItem('currentUser');
    return user ? JSON.parse(user) : null;
  } catch {
    return null;
  }
};

// Add to wishlist
export const addToWishlist = createAsyncThunk(
  'wishlist/addToWishlist',
  async (productId: string, thunkAPI) => {
    try {
      const user = getUserFromStorage();
      if (!user || !user.token) {
        return thunkAPI.rejectWithValue('No authentication token');
      }

      console.log('🔄 Adding to wishlist via API:', productId);

      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
          'Content-Type': 'application/json',
        },
      };

      const response = await axios.post(
        `${API_URL}/wishlist`,
        { productId },
        config
      );

      console.log('✅ Added to wishlist successfully');
      toast.success('Added to wishlist!');
      return response.data;
    } catch (error: any) {
      console.error('❌ Failed to add to wishlist:', error.response?.data || error.message);
      const message = error.response?.data?.message || 'Failed to add to wishlist';
      toast.error(message);
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Remove from wishlist
export const removeFromWishlist = createAsyncThunk(
  'wishlist/removeFromWishlist',
  async (productId: string, thunkAPI) => {
    try {
      const user = getUserFromStorage();
      if (!user || !user.token) {
        return thunkAPI.rejectWithValue('No authentication token');
      }

      console.log('🔄 Removing from wishlist via API:', productId);

      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const response = await axios.delete(
        `${API_URL}/wishlist/${productId}`,
        config
      );

      console.log('✅ Removed from wishlist successfully');
      toast.success('Removed from wishlist!');
      return response.data;
    } catch (error: any) {
      console.error('❌ Failed to remove from wishlist:', error.response?.data || error.message);
      const message = error.response?.data?.message || 'Failed to remove from wishlist';
      toast.error(message);
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Get wishlist
export const getWishlist = createAsyncThunk(
  'wishlist/getWishlist',
  async (_, thunkAPI) => {
    try {
      const user = getUserFromStorage();
      if (!user || !user.token) {
        return thunkAPI.rejectWithValue('No authentication token');
      }

      console.log('🔄 Fetching wishlist from API');

      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const response = await axios.get(`${API_URL}/wishlist`, config);

      console.log('✅ Wishlist fetched successfully:', response.data.length, 'items');
      return response.data;
    } catch (error: any) {
      console.error('❌ Failed to fetch wishlist:', error.response?.data || error.message);
      const message = error.response?.data?.message || 'Failed to fetch wishlist';
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
        state.items = action.payload;
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
        state.items = action.payload;
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
