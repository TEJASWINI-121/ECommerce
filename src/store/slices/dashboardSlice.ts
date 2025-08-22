import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { MOCK_ORDERS, MOCK_PRODUCTS, MOCK_USERS, getMockOrders, getMockProducts, getMockUsers } from '../../utils/mockData';

const API_URL = 'http://localhost:8000/api/dashboard';

interface DashboardStats {
  totalUsers: number;
  totalSellers: number;
  totalDeliveryAgents: number;
  totalOrders: number;
  totalRevenue: number;
  pendingOrders: number;
  shippedOrders: number;
  deliveredOrders: number;
  totalProducts: number;
}

interface DashboardState {
  stats: DashboardStats;
  recentOrders: any[];
  topProducts: any[];
  topSellers: any[];
  isLoading: boolean;
  isError: boolean;
  message: string;
}

const initialState: DashboardState = {
  stats: {
    totalUsers: 0,
    totalSellers: 0,
    totalDeliveryAgents: 0,
    totalOrders: 0,
    totalRevenue: 0,
    pendingOrders: 0,
    shippedOrders: 0,
    deliveredOrders: 0,
    totalProducts: 0,
  },
  recentOrders: [],
  topProducts: [],
  topSellers: [],
  isLoading: false,
  isError: false,
  message: '',
};

// Get user from localStorage
const getUserFromStorage = () => {
  try {
    const user = localStorage.getItem('currentUser');
    return user ? JSON.parse(user) : null;
  } catch {
    return null;
  }
};

// Get dashboard statistics
export const getDashboardStats = createAsyncThunk(
  'dashboard/getStats',
  async (role: string = 'admin', thunkAPI) => {
    try {
      const user = getUserFromStorage();

      if (!user || !user.token) {
        console.log('❌ No user token, using mock data');
        // Fallback to mock data
        const users = getMockUsers();
        const products = getMockProducts();
        const orders = getMockOrders();
        const localOrders = JSON.parse(localStorage.getItem('userOrders') || '[]');

        const allOrders = [...orders, ...localOrders];

        const stats = {
          totalUsers: users.filter(u => u.role === 'user').length,
          totalSellers: users.filter(u => u.role === 'seller').length,
          totalDeliveryAgents: users.filter(u => u.role === 'delivery').length,
          totalOrders: allOrders.length,
          totalRevenue: allOrders.reduce((sum, order) => sum + order.total, 0),
          pendingOrders: allOrders.filter(o => o.status === 'pending').length,
          shippedOrders: allOrders.filter(o => o.status === 'shipped').length,
          deliveredOrders: allOrders.filter(o => o.status === 'delivered').length,
          totalProducts: products.length,
        };

        const recentOrders = allOrders
          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
          .slice(0, 10);

        return { stats, recentOrders, topProducts: [], topSellers: [] };
      }

      console.log('🔄 Fetching dashboard stats from API for role:', role);

      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const response = await axios.get(`${API_URL}/${role}`, config);

      console.log('✅ Dashboard stats fetched successfully');
      return response.data;
    } catch (error: any) {
      const message = error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Update order status
export const updateOrderStatus = createAsyncThunk(
  'dashboard/updateOrderStatus',
  async ({ orderId, status }: { orderId: string; status: string }, thunkAPI) => {
    try {
      // Update in localStorage
      const localOrders = JSON.parse(localStorage.getItem('userOrders') || '[]');
      const updatedOrders = localOrders.map((order: any) => 
        order._id === orderId ? { ...order, status, updatedAt: new Date().toISOString() } : order
      );
      localStorage.setItem('userOrders', JSON.stringify(updatedOrders));
      
      return { orderId, status };
    } catch (error: any) {
      const message = error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false;
      state.isError = false;
      state.message = '';
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getDashboardStats.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getDashboardStats.fulfilled, (state, action) => {
        state.isLoading = false;
        state.stats = action.payload.stats;
        state.recentOrders = action.payload.recentOrders;
        state.topProducts = action.payload.topProducts;
        state.topSellers = action.payload.topSellers;
      })
      .addCase(getDashboardStats.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload as string;
      })
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        // Update the order status in recent orders
        state.recentOrders = state.recentOrders.map(order =>
          order._id === action.payload.orderId
            ? { ...order, status: action.payload.status }
            : order
        );
      });
  },
});

export const { reset } = dashboardSlice.actions;
export default dashboardSlice.reducer;
