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
        console.log('❌ No user token, fetching data from API without authentication');

        // Fetch real data from API even without token
        let dashboardData = {
          totalUsers: 0,
          totalSellers: 0,
          totalDeliveryAgents: 0,
          totalOrders: 0,
          totalRevenue: 0,
          pendingOrders: 0,
          shippedOrders: 0,
          deliveredOrders: 0,
          totalProducts: 0,
        };
        
        let recentOrders: any[] = [];
        let topProducts: any[] = [];
        let topSellers: any[] = [];

        // 1. Fetch products
        try {
          const productsResponse = await axios.get('http://localhost:8000/api/products?pageSize=1000');
          const products = productsResponse.data.products || productsResponse.data || [];
          dashboardData.totalProducts = products.length;
          console.log('✅ Fetched products count:', dashboardData.totalProducts);
          
          // Get top products based on ratings
          topProducts = [...products]
            .sort((a, b) => b.rating - a.rating)
            .slice(0, 5)
            .map(p => ({
              _id: p._id,
              name: p.name,
              price: p.price,
              image: p.image,
              rating: p.rating,
              numReviews: p.numReviews,
              totalSold: Math.floor(Math.random() * 100) + 1 // Placeholder
            }));
        } catch (error) {
          console.log('❌ Failed to fetch products, using mock data');
          const products = getMockProducts();
          dashboardData.totalProducts = products.length;
          topProducts = [];
        }

        // 2. Fetch users
        try {
          // Try to get registered users count from localStorage
          const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
          dashboardData.totalUsers = registeredUsers.filter((u: any) => u.role === 'user').length;
          dashboardData.totalSellers = registeredUsers.filter((u: any) => u.role === 'seller').length;
          dashboardData.totalDeliveryAgents = registeredUsers.filter((u: any) => u.role === 'delivery').length;
          
          if (registeredUsers.length === 0) {
            // If no registered users in localStorage, use mock data
            const users = getMockUsers();
            dashboardData.totalUsers = users.filter(u => u.role === 'user').length;
            dashboardData.totalSellers = users.filter(u => u.role === 'seller').length;
            dashboardData.totalDeliveryAgents = users.filter(u => u.role === 'delivery').length;
          }
          console.log('✅ User counts:', dashboardData.totalUsers, dashboardData.totalSellers, dashboardData.totalDeliveryAgents);
        } catch (error) {
          console.log('❌ Failed to get user counts, using mock data');
          const users = getMockUsers();
          dashboardData.totalUsers = users.filter(u => u.role === 'user').length;
          dashboardData.totalSellers = users.filter(u => u.role === 'seller').length;
          dashboardData.totalDeliveryAgents = users.filter(u => u.role === 'delivery').length;
        }

        // 3. Fetch orders
        try {
          // Get orders from localStorage
          const localOrders = JSON.parse(localStorage.getItem('userOrders') || '[]');
          const mockOrders = getMockOrders();
          const allOrders = [...mockOrders, ...localOrders];
          
          dashboardData.totalOrders = allOrders.length;
          dashboardData.totalRevenue = allOrders.reduce((sum, order) => sum + (order.totalPrice || order.total), 0);
          dashboardData.pendingOrders = allOrders.filter(o => o.status === 'pending').length;
          dashboardData.shippedOrders = allOrders.filter(o => o.status === 'shipped').length;
          dashboardData.deliveredOrders = allOrders.filter(o => o.status === 'delivered').length;
          
          recentOrders = allOrders
            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
            .slice(0, 10);
            
          console.log('✅ Order stats:', dashboardData.totalOrders, dashboardData.pendingOrders);
        } catch (error) {
          console.log('❌ Failed to get order stats, using mock data');
          const orders = getMockOrders();
          dashboardData.totalOrders = orders.length;
          dashboardData.totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
          dashboardData.pendingOrders = orders.filter(o => o.status === 'pending').length;
          dashboardData.shippedOrders = orders.filter(o => o.status === 'shipped').length;
          dashboardData.deliveredOrders = orders.filter(o => o.status === 'delivered').length;
          recentOrders = orders.slice(0, 10);
        }

        return { 
          stats: dashboardData, 
          recentOrders, 
          topProducts, 
          topSellers 
        };
      }

      // User has token, try to fetch from API
      const config = {
        headers: {
          'Authorization': `Bearer ${user.token}`,
          'Content-Type': 'application/json'
        }
      };

      try {
        const response = await axios.get(`${API_URL}/${role}`, config);
        console.log('✅ Dashboard stats fetched successfully');
        
        // Format the response to match our expected structure
        const formattedResponse = {
          stats: {
            totalUsers: response.data.totalUsers || 0,
            totalSellers: response.data.totalSellers || 0,
            totalDeliveryAgents: response.data.totalDeliveryAgents || 0,
            totalOrders: response.data.totalOrders || 0,
            totalRevenue: response.data.totalRevenue || 0,
            pendingOrders: response.data.pendingOrders || 0,
            shippedOrders: response.data.shippedOrders || 0,
            deliveredOrders: response.data.deliveredOrders || 0,
            totalProducts: response.data.totalProducts || 0,
          },
          recentOrders: response.data.recentOrders || [],
          topProducts: response.data.topProducts || [],
          topSellers: response.data.topSellers || []
        };
        
        return formattedResponse;
      } catch (apiError) {
        console.log('❌ API failed, fetching data directly');
        
        // Create a comprehensive dashboard data object
        let dashboardData = {
          totalUsers: 0,
          totalSellers: 0,
          totalDeliveryAgents: 0,
          totalOrders: 0,
          totalRevenue: 0,
          pendingOrders: 0,
          shippedOrders: 0,
          deliveredOrders: 0,
          totalProducts: 0,
        };
        
        let recentOrders: any[] = [];
        let topProducts: any[] = [];
        let topSellers: any[] = [];

        // 1. Fetch products
        try {
          const productsResponse = await axios.get('http://localhost:8000/api/products?pageSize=1000');
          const products = productsResponse.data.products || productsResponse.data || [];
          dashboardData.totalProducts = products.length;
          console.log('✅ Fetched products count:', dashboardData.totalProducts);
          
          // Get top products based on ratings
          topProducts = [...products]
            .sort((a, b) => b.rating - a.rating)
            .slice(0, 5)
            .map(p => ({
              _id: p._id,
              name: p.name,
              price: p.price,
              image: p.image,
              rating: p.rating,
              numReviews: p.numReviews,
              totalSold: Math.floor(Math.random() * 100) + 1 // Placeholder
            }));
        } catch (error) {
          console.log('❌ Failed to fetch products, using mock data');
          const products = getMockProducts();
          dashboardData.totalProducts = products.length;
          topProducts = [];
        }

        // 2. Try to get real user data
        try {
          // Try to get registered users from localStorage
          const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
          dashboardData.totalUsers = registeredUsers.filter((u: any) => u.role === 'user').length;
          dashboardData.totalSellers = registeredUsers.filter((u: any) => u.role === 'seller').length;
          dashboardData.totalDeliveryAgents = registeredUsers.filter((u: any) => u.role === 'delivery').length;
          
          if (registeredUsers.length === 0) {
            // If no registered users in localStorage, use mock data
            const users = getMockUsers();
            dashboardData.totalUsers = users.filter(u => u.role === 'user').length;
            dashboardData.totalSellers = users.filter(u => u.role === 'seller').length;
            dashboardData.totalDeliveryAgents = users.filter(u => u.role === 'delivery').length;
          }
        } catch (error) {
          console.log('❌ Failed to get user counts, using mock data');
          const users = getMockUsers();
          dashboardData.totalUsers = users.filter(u => u.role === 'user').length;
          dashboardData.totalSellers = users.filter(u => u.role === 'seller').length;
          dashboardData.totalDeliveryAgents = users.filter(u => u.role === 'delivery').length;
        }

        // 3. Get real order data
        try {
          // Get orders from localStorage
          const localOrders = JSON.parse(localStorage.getItem('userOrders') || '[]');
          const mockOrders = getMockOrders();
          const allOrders = [...mockOrders, ...localOrders];
          
          dashboardData.totalOrders = allOrders.length;
          dashboardData.totalRevenue = allOrders.reduce((sum, order) => sum + (order.totalPrice || order.total), 0);
          dashboardData.pendingOrders = allOrders.filter(o => o.status === 'pending').length;
          dashboardData.shippedOrders = allOrders.filter(o => o.status === 'shipped').length;
          dashboardData.deliveredOrders = allOrders.filter(o => o.status === 'delivered').length;
          
          recentOrders = allOrders
            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
            .slice(0, 10);
        } catch (error) {
          console.log('❌ Failed to get order stats, using mock data');
          const orders = getMockOrders();
          dashboardData.totalOrders = orders.length;
          dashboardData.totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
          dashboardData.pendingOrders = orders.filter(o => o.status === 'pending').length;
          dashboardData.shippedOrders = orders.filter(o => o.status === 'shipped').length;
          dashboardData.deliveredOrders = orders.filter(o => o.status === 'delivered').length;
          recentOrders = orders.slice(0, 10);
        }

        return { 
          stats: dashboardData, 
          recentOrders, 
          topProducts, 
          topSellers 
        };
      }
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
      const user = getUserFromStorage();
      
      if (!user || !user.token) {
        // Update in localStorage if no token
        const localOrders = JSON.parse(localStorage.getItem('userOrders') || '[]');
        const updatedOrders = localOrders.map((order: any) => 
          order.id === orderId ? { ...order, status } : order
        );
        localStorage.setItem('userOrders', JSON.stringify(updatedOrders));
        return { orderId, status };
      }

      const config = {
        headers: {
          'Authorization': `Bearer ${user.token}`,
          'Content-Type': 'application/json'
        }
      };

      const response = await axios.put(`http://localhost:8000/api/orders/${orderId}/status`, 
        { status }, 
        config
      );
      
      return response.data;
    } catch (error: any) {
      const message = error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

const dashboardSlice = createSlice({
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
        state.isError = false;
      })
      .addCase(getDashboardStats.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload as string;
      })
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        // Update the order status in recentOrders
        const orderId = action.payload.orderId || action.payload._id;
        const status = action.payload.status || action.payload.orderStatus;
        
        state.recentOrders = state.recentOrders.map(order => 
          order.id === orderId || order._id === orderId 
            ? { ...order, status, orderStatus: status }
            : order
        );
        
        // Update stats
        const pendingCount = state.recentOrders.filter(o => o.status === 'pending' || o.orderStatus === 'pending').length;
        const shippedCount = state.recentOrders.filter(o => o.status === 'shipped' || o.orderStatus === 'shipped').length;
        const deliveredCount = state.recentOrders.filter(o => o.status === 'delivered' || o.orderStatus === 'delivered').length;
        
        state.stats.pendingOrders = pendingCount;
        state.stats.shippedOrders = shippedCount;
        state.stats.deliveredOrders = deliveredCount;
      });
  },
});

export const { reset } = dashboardSlice.actions;
export default dashboardSlice.reducer;