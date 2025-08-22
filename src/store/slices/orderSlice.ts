import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { MOCK_ORDERS, MockOrder } from '../../utils/mockData';

const API_URL = 'http://localhost:8000/api/orders';

// Helper functions for localStorage
const saveOrderToStorage = (order: any) => {
  const existingOrders = JSON.parse(localStorage.getItem('userOrders') || '[]');
  existingOrders.push(order);
  localStorage.setItem('userOrders', JSON.stringify(existingOrders));
};

const getOrdersFromStorage = () => {
  return JSON.parse(localStorage.getItem('userOrders') || '[]');
};

interface OrderItem {
  product: string;
  name: string;
  quantity: number;
  image: string;
  price: number;
}

interface Order {
  _id: string;
  user: string;
  orderItems: OrderItem[];
  shippingAddress: {
    address: string;
    city: string;
    postalCode: string;
    country: string;
  };
  paymentMethod: string;
  itemsPrice: number;
  taxPrice: number;
  shippingPrice: number;
  totalPrice: number;
  isPaid: boolean;
  paidAt?: string;
  isDelivered: boolean;
  deliveredAt?: string;
  orderStatus: string;
  createdAt: string;
}

interface OrderState {
  orders: Order[];
  order: Order | null;
  isLoading: boolean;
  isError: boolean;
  message: string;
}



const initialState: OrderState = {
  orders: getOrdersFromStorage(),
  order: null,
  isLoading: false,
  isError: false,
  message: '',
};

// Create order
export const createOrder = createAsyncThunk(
  'orders/createOrder',
  async (orderData: any, thunkAPI) => {
    try {
      const state: any = thunkAPI.getState();
      const token = state.auth.user?.token;
      const user = state.auth.user;

      console.log('🛒 Creating order:', { orderData, hasUser: !!user, hasToken: !!token });

      if (!user) {
        return thunkAPI.rejectWithValue('Please login to place order');
      }

      const isMockToken = token && token.startsWith('mock-token-');

      if (!token || isMockToken) {
        console.log('📦 No valid token, creating order locally');
        // Create order locally when no valid token
        const localOrder = {
          _id: `order_${Date.now()}`,
          user: user._id,
          orderItems: orderData.orderItems,
          shippingAddress: orderData.shippingAddress,
          paymentMethod: orderData.paymentMethod,
          itemsPrice: orderData.itemsPrice,
          taxPrice: orderData.taxPrice,
          shippingPrice: orderData.shippingPrice,
          totalPrice: orderData.totalPrice,
          isPaid: false,
          isDelivered: false,
          createdAt: new Date().toISOString(),
          status: 'pending'
        };

        saveOrderToStorage(localOrder);
        console.log('💾 Order saved locally:', localOrder);
        return localOrder;
      }

      try {
        console.log('🔄 Attempting MongoDB order creation...');
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        };

        const response = await axios.post(API_URL, orderData, config);
        console.log('✅ MongoDB order created successfully:', response.data);
        saveOrderToStorage(response.data);
        return response.data;
      } catch (apiError: any) {
        console.log('❌ MongoDB order creation failed, creating locally:', apiError.response?.data || apiError.message);

        // Create order locally
        const newOrder = {
          _id: `order_${Date.now()}`,
          orderId: `ORD-${Date.now()}`,
          userId: user._id,
          userName: user.name,
          sellerId: orderData.orderItems[0]?.sellerId || 'seller1',
          sellerName: orderData.orderItems[0]?.sellerName || 'Store',
          items: orderData.orderItems.map((item: any) => ({
            productId: item.product._id,
            productName: item.product.name,
            quantity: item.quantity,
            price: item.product.price
          })),
          total: orderData.totalPrice,
          status: 'pending',
          shippingAddress: `${orderData.shippingAddress.address}, ${orderData.shippingAddress.city}, ${orderData.shippingAddress.postalCode}`,
          paymentMethod: orderData.paymentMethod,
          isPaid: false,
          isDelivered: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };

        // Save to localStorage
        const existingOrders = JSON.parse(localStorage.getItem('userOrders') || '[]');
        existingOrders.push(newOrder);
        localStorage.setItem('userOrders', JSON.stringify(existingOrders));

        // Clear cart after successful order
        localStorage.removeItem('cart');

        return newOrder;
      }
    } catch (error: any) {
      const message = error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Get user orders
export const getMyOrders = createAsyncThunk(
  'orders/getMyOrders',
  async (_, thunkAPI) => {
    try {
      const state: any = thunkAPI.getState();
      const token = state.auth.user?.token;
      const user = state.auth.user;

      if (!user) {
        return thunkAPI.rejectWithValue('Please login to view orders');
      }

      try {
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };

        const response = await axios.get(`${API_URL}/myorders`, config);
        return response.data;
      } catch (apiError) {
        console.log('API failed, using local orders');

        // Get orders from localStorage and mock data
        const localOrders = getOrdersFromStorage();
        const mockUserOrders = MOCK_ORDERS.filter(order => order.userId === user._id);

        // Combine and sort by date
        const allOrders = [...localOrders, ...mockUserOrders]
          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

        return allOrders;
      }
    } catch (error: any) {
      const message = error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Get single order
export const getOrder = createAsyncThunk(
  'orders/getOrder',
  async (id: string, thunkAPI) => {
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

      const response = await axios.get(`${API_URL}/${id}`, config);
      return response.data;
    } catch (error: any) {
      const message = error.response?.data?.message || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const orderSlice = createSlice({
  name: 'orders',
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
      .addCase(createOrder.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.isLoading = false;
        state.order = action.payload;
        saveOrderToStorage(action.payload);
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload as string;
      })
      .addCase(getMyOrders.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getMyOrders.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orders = action.payload;
        saveOrdersToStorage(action.payload);
      })
      .addCase(getMyOrders.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload as string;
      })
      .addCase(getOrder.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getOrder.fulfilled, (state, action) => {
        state.isLoading = false;
        state.order = action.payload;
        saveOrderToStorage(action.payload);
      })
      .addCase(getOrder.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload as string;
      });
  },
});

export const { reset } = orderSlice.actions;
export default orderSlice.reducer;