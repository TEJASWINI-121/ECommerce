// Mock data for multi-role e-commerce system
import { EXTENDED_PRODUCTS, SPORTS_PRODUCTS, BOOKS_PRODUCTS, AUTO_PRODUCTS } from './extendedProducts';
import { ELECTRONICS_PRODUCTS, FASHION_PRODUCTS, BEAUTY_PRODUCTS, HOME_PRODUCTS } from './massiveProducts';
import {
  SPORTS_FITNESS_PRODUCTS,
  MORE_ELECTRONICS,
  MORE_FASHION
} from './additionalProducts';

export interface MockUser {
  _id: string;
  name: string;
  email: string;
  password: string;
  role: 'user' | 'admin' | 'seller' | 'delivery';
  token: string;
  createdAt: string;
  profile?: {
    phone?: string;
    address?: string;
    avatar?: string;
  };
}

export interface MockProduct {
  _id: string;
  name: string;
  description: string;
  price: number;
  images: string[];
  category: string;
  brand: string;
  stock: number;
  sellerId: string;
  sellerName: string;
  rating: number;
  reviews: number;
  createdAt: string;
}

export interface MockOrder {
  _id: string;
  orderId: string;
  userId: string;
  userName: string;
  sellerId: string;
  sellerName: string;
  deliveryAgentId?: string;
  deliveryAgentName?: string;
  items: {
    productId: string;
    productName: string;
    quantity: number;
    price: number;
  }[];
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'out_for_delivery' | 'delivered' | 'cancelled';
  shippingAddress: string;
  createdAt: string;
  updatedAt: string;
}

export interface MockDelivery {
  _id: string;
  orderId: string;
  deliveryAgentId: string;
  status: 'assigned' | 'picked_up' | 'out_for_delivery' | 'delivered';
  estimatedTime: string;
  actualDeliveryTime?: string;
  customerPhone: string;
  deliveryAddress: string;
  notes?: string;
}

// Mock Users
export const MOCK_USERS: MockUser[] = [
  {
    _id: 'user1',
    name: 'John Doe',
    email: 'user@example.com',
    password: 'user123',
    role: 'user',
    token: 'mock-user-token-1',
    createdAt: '2024-01-01T00:00:00Z',
    profile: {
      phone: '+1-234-567-8900',
      address: '123 Main St, New York, NY 10001',
      avatar: 'https://via.placeholder.com/100x100'
    }
  },
  {
    _id: 'admin1',
    name: 'Admin User',
    email: 'admin@example.com',
    password: 'admin123',
    role: 'admin',
    token: 'mock-admin-token-1',
    createdAt: '2024-01-01T00:00:00Z'
  },
  {
    _id: 'seller1',
    name: 'TechWorld Store Owner',
    email: 'seller@example.com',
    password: 'seller123',
    role: 'seller',
    token: 'mock-seller-token-1',
    createdAt: '2024-01-01T00:00:00Z',
    profile: {
      phone: '+1-234-567-8901',
      address: '456 Business Ave, New York, NY 10002'
    }
  },
  {
    _id: 'seller2',
    name: 'Fashion Hub Owner',
    email: 'seller2@example.com',
    password: 'seller123',
    role: 'seller',
    token: 'mock-seller-token-2',
    createdAt: '2024-01-01T00:00:00Z',
    profile: {
      phone: '+1-234-567-8903',
      address: '789 Fashion St, New York, NY 10004'
    }
  },
  {
    _id: 'seller3',
    name: 'Beauty Paradise Owner',
    email: 'seller3@example.com',
    password: 'seller123',
    role: 'seller',
    token: 'mock-seller-token-3',
    createdAt: '2024-01-01T00:00:00Z',
    profile: {
      phone: '+1-234-567-8904',
      address: '321 Beauty Blvd, New York, NY 10005'
    }
  },
  {
    _id: 'seller4',
    name: 'Home Essentials Owner',
    email: 'seller4@example.com',
    password: 'seller123',
    role: 'seller',
    token: 'mock-seller-token-4',
    createdAt: '2024-01-01T00:00:00Z',
    profile: {
      phone: '+1-234-567-8905',
      address: '654 Home Ave, New York, NY 10006'
    }
  },
  {
    _id: 'delivery1',
    name: 'Delivery Agent',
    email: 'delivery@example.com',
    password: 'delivery123',
    role: 'delivery',
    token: 'mock-delivery-token-1',
    createdAt: '2024-01-01T00:00:00Z',
    profile: {
      phone: '+1-234-567-8902',
      address: '789 Delivery St, New York, NY 10003'
    }
  }
];

// Mock Products - Comprehensive E-commerce Database (200+ Products)
export const MOCK_PRODUCTS: MockProduct[] = [
  // Combine all product databases (200+ products total)
  ...ELECTRONICS_PRODUCTS,
  ...FASHION_PRODUCTS,
  ...BEAUTY_PRODUCTS,
  ...HOME_PRODUCTS,
  ...EXTENDED_PRODUCTS,
  ...SPORTS_PRODUCTS,
  ...BOOKS_PRODUCTS,
  ...AUTO_PRODUCTS,
  ...SPORTS_FITNESS_PRODUCTS,
  ...MORE_ELECTRONICS,
  ...MORE_FASHION,

  // Legacy products for compatibility
  {
    _id: 'prod1',
    name: 'iPhone 15 Pro Max',
    description: 'Latest iPhone with A17 Pro chip, titanium design, and advanced camera system',
    price: 1199.99,
    images: [
      'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=400&fit=crop'
    ],
    category: 'Electronics',
    brand: 'Apple',
    stock: 50,
    sellerId: 'seller1',
    sellerName: 'TechWorld Store',
    rating: 4.8,
    reviews: 2847,
    createdAt: '2024-01-01T00:00:00Z'
  },
  {
    _id: 'prod2',
    name: 'Samsung Galaxy S24 Ultra',
    description: 'Premium Android smartphone with S Pen, 200MP camera, and AI features',
    price: 1299.99,
    images: [
      'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1565849904461-04a58ad377e0?w=400&h=400&fit=crop'
    ],
    category: 'Electronics',
    brand: 'Samsung',
    stock: 35,
    sellerId: 'seller1',
    sellerName: 'TechWorld Store',
    rating: 4.7,
    reviews: 1923,
    createdAt: '2024-01-02T00:00:00Z'
  },
  {
    _id: 'prod3',
    name: 'Google Pixel 8 Pro',
    description: 'AI-powered smartphone with exceptional camera and pure Android experience',
    price: 999.99,
    images: [
      'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400&h=400&fit=crop'
    ],
    category: 'Electronics',
    brand: 'Google',
    stock: 28,
    sellerId: 'seller1',
    sellerName: 'TechWorld Store',
    rating: 4.6,
    reviews: 1456,
    createdAt: '2024-01-03T00:00:00Z'
  },

  // Electronics - Laptops
  {
    _id: 'prod4',
    name: 'MacBook Pro 16-inch M3',
    description: 'Professional laptop with M3 chip, Liquid Retina XDR display, and all-day battery',
    price: 2499.99,
    images: [
      'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=400&fit=crop'
    ],
    category: 'Electronics',
    brand: 'Apple',
    stock: 15,
    sellerId: 'seller1',
    sellerName: 'TechWorld Store',
    rating: 4.9,
    reviews: 892,
    createdAt: '2024-01-04T00:00:00Z'
  },
  {
    _id: 'prod5',
    name: 'Dell XPS 13 Plus',
    description: 'Ultra-thin laptop with 12th Gen Intel Core, InfinityEdge display',
    price: 1399.99,
    images: [
      'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=400&h=400&fit=crop'
    ],
    category: 'Electronics',
    brand: 'Dell',
    stock: 22,
    sellerId: 'seller1',
    sellerName: 'TechWorld Store',
    rating: 4.5,
    reviews: 634,
    createdAt: '2024-01-05T00:00:00Z'
  },

  // Fashion - Men's Clothing
  {
    _id: 'prod6',
    name: 'Nike Air Force 1 Low',
    description: 'Classic basketball sneakers with premium leather upper and Air cushioning',
    price: 110.00,
    images: [
      'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=400&h=400&fit=crop'
    ],
    category: 'Fashion',
    brand: 'Nike',
    stock: 75,
    sellerId: 'seller2',
    sellerName: 'Fashion Hub',
    rating: 4.7,
    reviews: 3421,
    createdAt: '2024-01-06T00:00:00Z'
  },
  {
    _id: 'prod7',
    name: 'Adidas Ultraboost 22',
    description: 'Premium running shoes with Boost midsole and Primeknit upper',
    price: 180.00,
    images: [
      'https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=400&fit=crop'
    ],
    category: 'Fashion',
    brand: 'Adidas',
    stock: 42,
    sellerId: 'seller2',
    sellerName: 'Fashion Hub',
    rating: 4.6,
    reviews: 2156,
    createdAt: '2024-01-07T00:00:00Z'
  },
  {
    _id: 'prod8',
    name: 'Levi\'s 501 Original Jeans',
    description: 'Classic straight-fit jeans with button fly and iconic styling',
    price: 89.99,
    images: [
      'https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=400&h=400&fit=crop'
    ],
    category: 'Fashion',
    brand: 'Levi\'s',
    stock: 68,
    sellerId: 'seller2',
    sellerName: 'Fashion Hub',
    rating: 4.4,
    reviews: 1876,
    createdAt: '2024-01-08T00:00:00Z'
  },

  // Fashion - Women's Clothing
  {
    _id: 'prod9',
    name: 'Zara Floral Summer Dress',
    description: 'Elegant floral print dress perfect for summer occasions',
    price: 79.99,
    images: [
      'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=400&fit=crop'
    ],
    category: 'Fashion',
    brand: 'Zara',
    stock: 45,
    sellerId: 'seller2',
    sellerName: 'Fashion Hub',
    rating: 4.3,
    reviews: 892,
    createdAt: '2024-01-09T00:00:00Z'
  },
  {
    _id: 'prod10',
    name: 'H&M Oversized Blazer',
    description: 'Professional oversized blazer in premium fabric',
    price: 99.99,
    images: [
      'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=400&h=400&fit=crop'
    ],
    category: 'Fashion',
    brand: 'H&M',
    stock: 32,
    sellerId: 'seller2',
    sellerName: 'Fashion Hub',
    rating: 4.2,
    reviews: 567,
    createdAt: '2024-01-10T00:00:00Z'
  },

  // Beauty & Personal Care
  {
    _id: 'prod11',
    name: 'The Ordinary Niacinamide 10% + Zinc 1%',
    description: 'High-strength vitamin and mineral blemish formula',
    price: 7.90,
    images: [
      'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop'
    ],
    category: 'Beauty',
    brand: 'The Ordinary',
    stock: 150,
    sellerId: 'seller3',
    sellerName: 'Beauty Paradise',
    rating: 4.6,
    reviews: 4521,
    createdAt: '2024-01-11T00:00:00Z'
  },
  {
    _id: 'prod12',
    name: 'CeraVe Hydrating Cleanser',
    description: 'Gentle daily facial cleanser for normal to dry skin',
    price: 14.99,
    images: [
      'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=400&h=400&fit=crop'
    ],
    category: 'Beauty',
    brand: 'CeraVe',
    stock: 89,
    sellerId: 'seller3',
    sellerName: 'Beauty Paradise',
    rating: 4.5,
    reviews: 2341,
    createdAt: '2024-01-12T00:00:00Z'
  },
  {
    _id: 'prod13',
    name: 'Fenty Beauty Gloss Bomb',
    description: 'Universal lip luminizer with explosive shine',
    price: 19.00,
    images: [
      'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=400&h=400&fit=crop'
    ],
    category: 'Beauty',
    brand: 'Fenty Beauty',
    stock: 76,
    sellerId: 'seller3',
    sellerName: 'Beauty Paradise',
    rating: 4.7,
    reviews: 1876,
    createdAt: '2024-01-13T00:00:00Z'
  },

  // Home & Kitchen
  {
    _id: 'prod14',
    name: 'Instant Pot Duo 7-in-1',
    description: 'Multi-use pressure cooker, slow cooker, rice cooker, and more',
    price: 99.95,
    images: [
      'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=400&fit=crop'
    ],
    category: 'Home & Kitchen',
    brand: 'Instant Pot',
    stock: 45,
    sellerId: 'seller4',
    sellerName: 'Home Essentials',
    rating: 4.8,
    reviews: 12456,
    createdAt: '2024-01-14T00:00:00Z'
  },
  {
    _id: 'prod15',
    name: 'Ninja Professional Blender',
    description: 'High-powered blender for smoothies, shakes, and food prep',
    price: 79.99,
    images: [
      'https://images.unsplash.com/photo-1570197788417-0e82375c9371?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=400&fit=crop'
    ],
    category: 'Home & Kitchen',
    brand: 'Ninja',
    stock: 38,
    sellerId: 'seller4',
    sellerName: 'Home Essentials',
    rating: 4.6,
    reviews: 3421,
    createdAt: '2024-01-15T00:00:00Z'
  },

  // More Electronics - Smartphones
  {
    _id: 'prod16',
    name: 'OnePlus 12 Pro',
    description: 'Flagship Android phone with Snapdragon 8 Gen 3 and 120Hz display',
    price: 899.99,
    images: [
      'https://images.unsplash.com/photo-1565849904461-04a58ad377e0?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400&h=400&fit=crop'
    ],
    category: 'Electronics',
    brand: 'OnePlus',
    stock: 40,
    sellerId: 'seller1',
    sellerName: 'TechWorld Store',
    rating: 4.6,
    reviews: 1234,
    createdAt: '2024-01-16T00:00:00Z'
  },
  {
    _id: 'prod17',
    name: 'Xiaomi 14 Ultra',
    description: 'Photography-focused smartphone with Leica cameras and premium build',
    price: 799.99,
    images: [
      'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1565849904461-04a58ad377e0?w=400&h=400&fit=crop'
    ],
    category: 'Electronics',
    brand: 'Xiaomi',
    stock: 35,
    sellerId: 'seller1',
    sellerName: 'TechWorld Store',
    rating: 4.5,
    reviews: 987,
    createdAt: '2024-01-17T00:00:00Z'
  },

  // Electronics - Tablets
  {
    _id: 'prod18',
    name: 'iPad Pro 12.9-inch M4',
    description: 'Most advanced iPad with M4 chip, Liquid Retina XDR display, and Apple Pencil support',
    price: 1099.99,
    images: [
      'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1561154464-82e9adf32764?w=400&h=400&fit=crop'
    ],
    category: 'Electronics',
    brand: 'Apple',
    stock: 25,
    sellerId: 'seller1',
    sellerName: 'TechWorld Store',
    rating: 4.8,
    reviews: 1567,
    createdAt: '2024-01-18T00:00:00Z'
  },
  {
    _id: 'prod19',
    name: 'Samsung Galaxy Tab S9 Ultra',
    description: 'Premium Android tablet with S Pen, 14.6-inch display, and DeX mode',
    price: 949.99,
    images: [
      'https://images.unsplash.com/photo-1561154464-82e9adf32764?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400&h=400&fit=crop'
    ],
    category: 'Electronics',
    brand: 'Samsung',
    stock: 20,
    sellerId: 'seller1',
    sellerName: 'TechWorld Store',
    rating: 4.6,
    reviews: 892,
    createdAt: '2024-01-19T00:00:00Z'
  },

  // Electronics - Headphones & Audio
  {
    _id: 'prod20',
    name: 'Sony WH-1000XM5',
    description: 'Industry-leading noise canceling wireless headphones with 30-hour battery',
    price: 399.99,
    images: [
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=400&h=400&fit=crop'
    ],
    category: 'Electronics',
    brand: 'Sony',
    stock: 60,
    sellerId: 'seller1',
    sellerName: 'TechWorld Store',
    rating: 4.7,
    reviews: 2341,
    createdAt: '2024-01-20T00:00:00Z'
  },
  {
    _id: 'prod21',
    name: 'AirPods Pro 2nd Gen',
    description: 'Apple wireless earbuds with active noise cancellation and spatial audio',
    price: 249.99,
    images: [
      'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop'
    ],
    category: 'Electronics',
    brand: 'Apple',
    stock: 80,
    sellerId: 'seller1',
    sellerName: 'TechWorld Store',
    rating: 4.6,
    reviews: 3456,
    createdAt: '2024-01-21T00:00:00Z'
  },
  {
    _id: 'prod22',
    name: 'Bose QuietComfort Ultra',
    description: 'Premium noise-canceling headphones with immersive audio experience',
    price: 429.99,
    images: [
      'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop'
    ],
    category: 'Electronics',
    brand: 'Bose',
    stock: 45,
    sellerId: 'seller1',
    sellerName: 'TechWorld Store',
    rating: 4.8,
    reviews: 1789,
    createdAt: '2024-01-22T00:00:00Z'
  },
];

// Mock Orders
export const MOCK_ORDERS: MockOrder[] = [
  {
    _id: 'order1',
    orderId: 'ORD-001',
    userId: 'user1',
    userName: 'John Doe',
    sellerId: 'seller1',
    sellerName: 'Beauty Store Owner',
    deliveryAgentId: 'delivery1',
    deliveryAgentName: 'Delivery Agent',
    items: [
      {
        productId: 'prod1',
        productName: 'Premium Face Cream',
        quantity: 2,
        price: 89.99
      }
    ],
    total: 179.98,
    status: 'shipped',
    shippingAddress: '123 Main St, New York, NY 10001',
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T14:00:00Z'
  },
  {
    _id: 'order2',
    orderId: 'ORD-002',
    userId: 'user1',
    userName: 'John Doe',
    sellerId: 'seller1',
    sellerName: 'Beauty Store Owner',
    items: [
      {
        productId: 'prod2',
        productName: 'Organic Vitamin C Serum',
        quantity: 1,
        price: 65.00
      }
    ],
    total: 65.00,
    status: 'processing',
    shippingAddress: '123 Main St, New York, NY 10001',
    createdAt: '2024-01-14T09:00:00Z',
    updatedAt: '2024-01-14T09:00:00Z'
  }
];

// Mock Deliveries
export const MOCK_DELIVERIES: MockDelivery[] = [
  {
    _id: 'delivery1',
    orderId: 'ORD-001',
    deliveryAgentId: 'delivery1',
    status: 'out_for_delivery',
    estimatedTime: '2:30 PM',
    customerPhone: '+1-234-567-8900',
    deliveryAddress: '123 Main St, New York, NY 10001',
    notes: 'Customer prefers delivery after 2 PM'
  }
];

// Utility functions for localStorage management
export const seedMockData = () => {
  localStorage.setItem('mockUsers', JSON.stringify(MOCK_USERS));
  localStorage.setItem('mockProducts', JSON.stringify(MOCK_PRODUCTS));
  localStorage.setItem('mockOrders', JSON.stringify(MOCK_ORDERS));
  localStorage.setItem('mockDeliveries', JSON.stringify(MOCK_DELIVERIES));
};

export const getMockUsers = (): MockUser[] => {
  const stored = localStorage.getItem('mockUsers');
  return stored ? JSON.parse(stored) : MOCK_USERS;
};

export const getMockProducts = (): MockProduct[] => {
  const stored = localStorage.getItem('mockProducts');
  return stored ? JSON.parse(stored) : MOCK_PRODUCTS;
};

export const getMockOrders = (): MockOrder[] => {
  const stored = localStorage.getItem('mockOrders');
  return stored ? JSON.parse(stored) : MOCK_ORDERS;
};

export const getMockDeliveries = (): MockDelivery[] => {
  const stored = localStorage.getItem('mockDeliveries');
  return stored ? JSON.parse(stored) : MOCK_DELIVERIES;
};

// Initialize mock data on first load
if (!localStorage.getItem('mockDataInitialized')) {
  seedMockData();
  localStorage.setItem('mockDataInitialized', 'true');
}
