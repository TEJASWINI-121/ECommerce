import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { MOCK_PRODUCTS, MockProduct, API_BASE_URL } from '../../utils/simpleMockData';

const API_URL = `${import.meta.env.VITE_API_URL}/products`;

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
  relatedProducts: Product[];
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
  relatedProducts: [],
  isLoading: false,
  isError: false,
  message: '',
  page: 1,
  pages: 1,
  count: 0,
};

// Helper function to handle localStorage cache only in development
const getCache = (key: string) => {
  if (process.env.NODE_ENV !== 'production') {
    const cached = localStorage.getItem(key);
    if (cached) {
      const data = JSON.parse(cached);
      if (data && (data.products?.length > 0 || Array.isArray(data))) {
        console.log(`Using cached data for ${key}`);
        return data;
      }
    }
  }
  return null;
};

const setCache = (key: string, data: any) => {
  if (process.env.NODE_ENV !== 'production') {
    localStorage.setItem(key, JSON.stringify(data));
  }
};

// ----------------------- Thunks ----------------------- //

// Get products
export const getProducts = createAsyncThunk(
  'products/getProducts',
  async (
    params: { pageNumber?: number; keyword?: string; category?: string; sortBy?: string; pageSize?: number } = {},
    thunkAPI
  ) => {
    try {
      const queryParams = new URLSearchParams();
      if (params.pageNumber) queryParams.append('pageNumber', params.pageNumber.toString());
      if (params.keyword) queryParams.append('keyword', params.keyword);
      if (params.category) queryParams.append('category', params.category);
      if (params.sortBy) queryParams.append('sortBy', params.sortBy);
      if (params.pageSize) queryParams.append('pageSize', params.pageSize.toString());

      const cacheKey = `products_${queryParams.toString()}`;
      const cachedData = getCache(cacheKey);
      if (cachedData) return cachedData;

      try {
        const response = await axios.get(`${API_URL}?${queryParams}`);
        setCache(cacheKey, response.data);
        return response.data;
      } catch (apiError) {
        console.log('API failed, using mock products');
        // Fallback to mock products
        let filteredProducts = [...MOCK_PRODUCTS];

        if (params.keyword) {
          const keyword = params.keyword.toLowerCase();
          filteredProducts = filteredProducts.filter(
            product =>
              product.name.toLowerCase().includes(keyword) ||
              product.description.toLowerCase().includes(keyword) ||
              product.brand.toLowerCase().includes(keyword) ||
              product.category.toLowerCase().includes(keyword)
          );
        }

        if (params.category) {
          filteredProducts = filteredProducts.filter(
            product => product.category.toLowerCase() === params.category?.toLowerCase()
          );
        }

        // Pagination
        const page = params.pageNumber || 1;
        const limit = 12;
        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + limit;
        const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

        const result = {
          products: paginatedProducts,
          page,
          pages: Math.ceil(filteredProducts.length / limit),
          count: filteredProducts.length,
        };

        setCache(cacheKey, result);
        return result;
      }
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.message || 'Failed to fetch products');
    }
  }
);

// Get single product
export const getProduct = createAsyncThunk('products/getProduct', async (id: string, thunkAPI) => {
  try {
    const cacheKey = `product_${id}`;
    const cachedData = getCache(cacheKey);
    if (cachedData) return cachedData;

    try {
      const response = await axios.get(`${API_URL}/${id}`);
      setCache(cacheKey, response.data);
      return response.data;
    } catch (apiError) {
      // Fallback to mock products
      const mockProduct = MOCK_PRODUCTS.find(product => product._id === id);
      if (mockProduct) {
        setCache(cacheKey, mockProduct);
        return mockProduct;
      }
      return thunkAPI.rejectWithValue('Product not found');
    }
  } catch (error: any) {
    return thunkAPI.rejectWithValue(error.message || 'Failed to fetch product');
  }
});

// Get top products
export const getTopProducts = createAsyncThunk('products/getTopProducts', async (_, thunkAPI) => {
  try {
    const cacheKey = 'top_products';
    const cachedData = getCache(cacheKey);
    if (cachedData) return cachedData;

    try {
      const response = await axios.get(`${API_URL}/top`);
      setCache(cacheKey, response.data);
      return response.data;
    } catch (apiError) {
      console.log('API failed, using mock top products');
      const topProducts = [...MOCK_PRODUCTS].sort((a, b) => b.rating - a.rating).slice(0, 8);
      setCache(cacheKey, topProducts);
      return topProducts;
    }
  } catch (error: any) {
    return thunkAPI.rejectWithValue(error.message || 'Failed to fetch top products');
  }
});

// Get related products
export const getRelatedProducts = createAsyncThunk(
  'products/getRelatedProducts',
  async (params: { productId: string; category: string; limit?: number }, thunkAPI) => {
    try {
      const { productId, category, limit = 4 } = params;
      const response = await axios.get(`${API_URL}?category=${category}&limit=${limit}`);
      const filteredProducts = response.data.products.filter((product: Product) => product._id !== productId);
      return filteredProducts.slice(0, limit);
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.message || 'Failed to fetch related products');
    }
  }
);

// ----------------------- Slice ----------------------- //

export const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    reset: state => {
      state.isLoading = false;
      state.isError = false;
      state.message = '';
    },
  },
  extraReducers: builder => {
    builder
      .addCase(getProducts.pending, state => {
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
      .addCase(getProduct.pending, state => {
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
      })
      .addCase(getRelatedProducts.fulfilled, (state, action) => {
        state.relatedProducts = action.payload;
      });
  },
});

export const { reset } = productSlice.actions;
export default productSlice.reducer;
