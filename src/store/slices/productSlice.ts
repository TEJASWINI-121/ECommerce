import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { MOCK_PRODUCTS, MockProduct, API_BASE_URL } from '../../utils/simpleMockData';

const API_URL = 'http://localhost:8000/api/products';

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  category: string;
  brand: string;
  images: string[];
  stock: number;
  rating: number;
  numReviews: number;
  featured: boolean;
  createdAt: string;
}

interface ProductState {
  products: Product[];
  product: Product | null;
  topProducts: Product[];
  isLoading: boolean;
  isError: boolean;
  message: string;
  page: number;
  pages: number;
  count: number;
}

const initialState: ProductState = {
  products: [],
  product: null,
  topProducts: [],
  isLoading: false,
  isError: false,
  message: '',
  page: 1,
  pages: 1,
  count: 0,
};

// Get products
export const getProducts = createAsyncThunk(
  'products/getProducts',
  async (params: { pageNumber?: number; keyword?: string; category?: string } = {}, thunkAPI) => {
    try {
      const queryParams = new URLSearchParams();

      if (params.pageNumber) queryParams.append('pageNumber', params.pageNumber.toString());
      if (params.keyword) queryParams.append('keyword', params.keyword);
      if (params.category) queryParams.append('category', params.category);

      try {
        const response = await axios.get(`${API_BASE_URL}/products?${queryParams}`);
        return response.data;
      } catch (apiError) {
        console.log('API failed, using mock products');

        // Filter mock products based on params
        let filteredProducts = [...MOCK_PRODUCTS];

        if (params.keyword) {
          const keyword = params.keyword.toLowerCase();
          filteredProducts = filteredProducts.filter(product =>
            product.name.toLowerCase().includes(keyword) ||
            product.description.toLowerCase().includes(keyword) ||
            product.brand.toLowerCase().includes(keyword) ||
            product.category.toLowerCase().includes(keyword)
          );
        }

        if (params.category) {
          filteredProducts = filteredProducts.filter(product =>
            product.category.toLowerCase() === params.category?.toLowerCase()
          );
        }

        // Pagination
        const page = params.pageNumber || 1;
        const limit = 12;
        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + limit;
        const paginatedProducts = filteredProducts.slice(startIndex, endIndex);



        return {
          products: paginatedProducts,
          page,
          pages: Math.ceil(filteredProducts.length / limit),
          count: filteredProducts.length
        };
      }
    } catch (error: any) {
      console.error('Products error:', error.message);
      const message = error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Get single product
export const getProduct = createAsyncThunk(
  'products/getProduct',
  async (id: string, thunkAPI) => {
    try {
      try {
        const response = await axios.get(`${API_URL}/${id}`);
        return response.data;
      } catch (apiError) {
        console.log('API failed, using mock product');
        const mockProduct = MOCK_PRODUCTS.find(product => product._id === id);
        if (mockProduct) {
          return mockProduct;
        } else {
          return thunkAPI.rejectWithValue('Product not found');
        }
      }
    } catch (error: any) {
      const message = error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Get top products
export const getTopProducts = createAsyncThunk(
  'products/getTopProducts',
  async (_, thunkAPI) => {
    try {
      try {
        const response = await axios.get(`${API_URL}/top`);
        return response.data;
      } catch (apiError) {
        console.log('API failed, using mock top products');
        // Return top rated products from mock data
        const topProducts = [...MOCK_PRODUCTS]
          .sort((a, b) => b.rating - a.rating)
          .slice(0, 8);
        return topProducts;
      }
    } catch (error: any) {
      const message = error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const productSlice = createSlice({
  name: 'products',
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
      .addCase(getProducts.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getProducts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.products = action.payload.products;
        state.page = action.payload.page;
        state.pages = action.payload.pages;
        state.count = action.payload.count;
      })
      .addCase(getProducts.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload as string;
      })
      .addCase(getProduct.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getProduct.fulfilled, (state, action) => {
        state.isLoading = false;
        state.product = action.payload;
      })
      .addCase(getProduct.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload as string;
      })
      .addCase(getTopProducts.fulfilled, (state, action) => {
        state.topProducts = action.payload;
      });
  },
});

export const { reset } = productSlice.actions;
export default productSlice.reducer;