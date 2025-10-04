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

// Get related products
export const getRelatedProducts = createAsyncThunk(
  'products/getRelatedProducts',
  async (params: { productId: string, category: string, limit?: number }, thunkAPI) => {
    try {
      const { productId, category, limit = 4 } = params;
      const response = await axios.get(`${API_URL}?category=${category}&limit=${limit}`);
      
      // Filter out the current product
      const filteredProducts = response.data.products.filter(
        (product: Product) => product._id !== productId
      );
      
      return filteredProducts.slice(0, limit);
    } catch (error: any) {
      const message = error.response?.data?.message || error.message || 'Failed to fetch related products';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Get products
export const getProducts = createAsyncThunk(
  'products/getProducts',
  async (params: { pageNumber?: number; keyword?: string; category?: string; sortBy?: string; pageSize?: number } = {}, thunkAPI) => {
    try {
      const queryParams = new URLSearchParams();

      if (params.pageNumber) queryParams.append('pageNumber', params.pageNumber.toString());
      if (params.keyword) queryParams.append('keyword', params.keyword);
      if (params.category) queryParams.append('category', params.category);
      if (params.sortBy) queryParams.append('sortBy', params.sortBy);
      if (params.pageSize) queryParams.append('pageSize', params.pageSize.toString());
      
      // Create a cache key based on the query parameters
      const cacheKey = `products_${queryParams.toString()}`;
      
      // Check if we have cached data in localStorage
      const cachedData = localStorage.getItem(cacheKey);
      
      if (cachedData) {
        console.log('Using cached product data');
        return JSON.parse(cachedData);
      }
      
      try {
        const response = await axios.get(`${API_BASE_URL}/products?${queryParams}`);
        
        // Cache the response in localStorage
        localStorage.setItem(cacheKey, JSON.stringify(response.data));
        
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
      // Check if we have cached data in localStorage
      const cacheKey = `product_${id}`;
      const cachedData = localStorage.getItem(cacheKey);
      
      if (cachedData) {
        console.log('Using cached product data for ID:', id);
        return JSON.parse(cachedData);
      }
      
      try {
        const response = await axios.get(`${API_URL}/${id}`);

        // Cache the response in localStorage
        localStorage.setItem(cacheKey, JSON.stringify(response.data));

        return response.data;
      } catch (apiError) {
        console.log('API failed for product ID:', id, 'Error:', apiError.response?.status);

        // If it's a 404, try to find the product in the products list
        if (apiError.response?.status === 404) {
          try {
            // Try to get all products and find the one we need
            const allProductsResponse = await axios.get(`${API_URL}?pageSize=1000`);
            const allProducts = allProductsResponse.data.products || allProductsResponse.data || [];
            const foundProduct = allProducts.find((product: any) => product._id === id);

            if (foundProduct) {
              // Cache the found product
              localStorage.setItem(cacheKey, JSON.stringify(foundProduct));
              return foundProduct;
            }
          } catch (fallbackError) {
            console.log('Fallback search also failed:', fallbackError);
          }
        }

        // Last resort: try mock products
        const mockProduct = MOCK_PRODUCTS.find(product => product._id === id);
        if (mockProduct) {
          localStorage.setItem(cacheKey, JSON.stringify(mockProduct));
          return mockProduct;
        }

        return thunkAPI.rejectWithValue('Product not found');
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
      // Check if we have cached data in localStorage
      const cacheKey = 'top_products';
      const cachedData = localStorage.getItem(cacheKey);
      
      if (cachedData) {
        console.log('Using cached top products data');
        return JSON.parse(cachedData);
      }
      
      try {
        const response = await axios.get(`${API_URL}/top`);
        
        // Cache the response in localStorage
        localStorage.setItem(cacheKey, JSON.stringify(response.data));
        
        return response.data;
      } catch (apiError) {
        console.log('API failed, using mock top products');
        // Return top rated products from mock data
        const topProducts = [...MOCK_PRODUCTS]
          .sort((a, b) => b.rating - a.rating)
          .slice(0, 8);
          
        // Cache the mock top products in localStorage
        localStorage.setItem(cacheKey, JSON.stringify(topProducts));
        
        return topProducts;
      }
    } catch (error: any) {
      const message = error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// initialState is already defined above

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
      // Add cases for getRelatedProducts
      .addCase(getRelatedProducts.pending, (state) => {
        // We don't set isLoading to true here to avoid affecting the main product display
      })
      .addCase(getRelatedProducts.fulfilled, (state, action) => {
        state.relatedProducts = action.payload;
      })
      .addCase(getRelatedProducts.rejected, (state, action) => {
        // We don't set isError to true here to avoid affecting the main product display
        console.error('Failed to fetch related products:', action.payload);
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