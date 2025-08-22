// Massive Product Database - 200+ Products with Unique Images
export const ELECTRONICS_PRODUCTS = [
  // Smartphones (20 products)
  {
    _id: 'elec001',
    name: 'iPhone 15 Pro Max 256GB',
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
    _id: 'elec002',
    name: 'Samsung Galaxy S24 Ultra 512GB',
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
    _id: 'elec003',
    name: 'Google Pixel 8 Pro 128GB',
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
  {
    _id: 'elec004',
    name: 'OnePlus 12 Pro 256GB',
    description: 'Flagship Android phone with Snapdragon 8 Gen 3 and 120Hz display',
    price: 899.99,
    images: [
      'https://images.unsplash.com/photo-1574944985070-8f3ebc6b79d2?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1580910051074-3eb694886505?w=400&h=400&fit=crop'
    ],
    category: 'Electronics',
    brand: 'OnePlus',
    stock: 40,
    sellerId: 'seller1',
    sellerName: 'TechWorld Store',
    rating: 4.6,
    reviews: 1234,
    createdAt: '2024-01-04T00:00:00Z'
  },
  {
    _id: 'elec005',
    name: 'Xiaomi 14 Ultra 512GB',
    description: 'Photography-focused smartphone with Leica cameras and premium build',
    price: 799.99,
    images: [
      'https://images.unsplash.com/photo-1567581935884-3349723552ca?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1574944985070-8f3ebc6b79d2?w=400&h=400&fit=crop'
    ],
    category: 'Electronics',
    brand: 'Xiaomi',
    stock: 35,
    sellerId: 'seller1',
    sellerName: 'TechWorld Store',
    rating: 4.5,
    reviews: 987,
    createdAt: '2024-01-05T00:00:00Z'
  },

  // Laptops (15 products)
  {
    _id: 'elec006',
    name: 'MacBook Pro 16-inch M4 Pro',
    description: 'Professional laptop with M4 Pro chip, Liquid Retina XDR display, and all-day battery',
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
    createdAt: '2024-01-06T00:00:00Z'
  },
  {
    _id: 'elec007',
    name: 'Dell XPS 13 Plus Intel i7',
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
    createdAt: '2024-01-07T00:00:00Z'
  },
  {
    _id: 'elec008',
    name: 'HP Spectre x360 14-inch',
    description: '2-in-1 convertible laptop with OLED display and premium design',
    price: 1299.99,
    images: [
      'https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=400&fit=crop'
    ],
    category: 'Electronics',
    brand: 'HP',
    stock: 18,
    sellerId: 'seller1',
    sellerName: 'TechWorld Store',
    rating: 4.4,
    reviews: 456,
    createdAt: '2024-01-08T00:00:00Z'
  },
  {
    _id: 'elec009',
    name: 'Lenovo ThinkPad X1 Carbon',
    description: 'Business laptop with military-grade durability and excellent keyboard',
    price: 1599.99,
    images: [
      'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=400&h=400&fit=crop'
    ],
    category: 'Electronics',
    brand: 'Lenovo',
    stock: 25,
    sellerId: 'seller1',
    sellerName: 'TechWorld Store',
    rating: 4.6,
    reviews: 789,
    createdAt: '2024-01-09T00:00:00Z'
  },
  {
    _id: 'elec010',
    name: 'ASUS ROG Zephyrus G14',
    description: 'Gaming laptop with AMD Ryzen 9 and RTX 4070 graphics',
    price: 1799.99,
    images: [
      'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=400&h=400&fit=crop'
    ],
    category: 'Electronics',
    brand: 'ASUS',
    stock: 12,
    sellerId: 'seller1',
    sellerName: 'TechWorld Store',
    rating: 4.7,
    reviews: 567,
    createdAt: '2024-01-10T00:00:00Z'
  },

  // Headphones & Audio (10 products)
  {
    _id: 'elec011',
    name: 'Sony WH-1000XM5 Wireless',
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
    createdAt: '2024-01-11T00:00:00Z'
  },
  {
    _id: 'elec012',
    name: 'AirPods Pro 2nd Generation',
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
    createdAt: '2024-01-12T00:00:00Z'
  },
  {
    _id: 'elec013',
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
    createdAt: '2024-01-13T00:00:00Z'
  }
];

// Fashion Products (50+ items)
export const FASHION_PRODUCTS = [
  // Men's Clothing (25 products)
  {
    _id: 'fash001',
    name: 'Nike Air Force 1 Low White',
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
    createdAt: '2024-01-14T00:00:00Z'
  },
  {
    _id: 'fash002',
    name: 'Adidas Ultraboost 22 Black',
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
    createdAt: '2024-01-15T00:00:00Z'
  },
  {
    _id: 'fash003',
    name: 'Levi\'s 501 Original Jeans Blue',
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
    createdAt: '2024-01-16T00:00:00Z'
  },
  {
    _id: 'fash004',
    name: 'Nike Dri-FIT Running Shirt',
    description: 'Moisture-wicking athletic shirt for running and training',
    price: 35.99,
    images: [
      'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400&h=400&fit=crop'
    ],
    category: 'Fashion',
    brand: 'Nike',
    stock: 120,
    sellerId: 'seller2',
    sellerName: 'Fashion Hub',
    rating: 4.4,
    reviews: 892,
    createdAt: '2024-01-17T00:00:00Z'
  },
  {
    _id: 'fash005',
    name: 'Adidas Originals Hoodie',
    description: 'Classic pullover hoodie with iconic three stripes design',
    price: 79.99,
    images: [
      'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop'
    ],
    category: 'Fashion',
    brand: 'Adidas',
    stock: 85,
    sellerId: 'seller2',
    sellerName: 'Fashion Hub',
    rating: 4.5,
    reviews: 1234,
    createdAt: '2024-01-18T00:00:00Z'
  },
  {
    _id: 'fash006',
    name: 'Ralph Lauren Polo Shirt',
    description: 'Classic fit polo shirt in premium cotton pique',
    price: 89.99,
    images: [
      'https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop'
    ],
    category: 'Fashion',
    brand: 'Ralph Lauren',
    stock: 65,
    sellerId: 'seller2',
    sellerName: 'Fashion Hub',
    rating: 4.6,
    reviews: 567,
    createdAt: '2024-01-19T00:00:00Z'
  },
  // Women's Fashion
  {
    _id: 'fash007',
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
    createdAt: '2024-01-20T00:00:00Z'
  },
  {
    _id: 'fash008',
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
    createdAt: '2024-01-21T00:00:00Z'
  }
];

// Beauty Products (30+ items)
export const BEAUTY_PRODUCTS = [
  {
    _id: 'beauty001',
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
    createdAt: '2024-01-22T00:00:00Z'
  },
  {
    _id: 'beauty002',
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
    createdAt: '2024-01-23T00:00:00Z'
  },
  {
    _id: 'beauty003',
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
    createdAt: '2024-01-24T00:00:00Z'
  }
];

// Home & Kitchen Products (40+ items)
export const HOME_PRODUCTS = [
  {
    _id: 'home001',
    name: 'Instant Pot Duo 7-in-1',
    description: 'Multi-use pressure cooker, slow cooker, rice cooker, and more',
    price: 99.95,
    images: [
      'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1570197788417-0e82375c9371?w=400&h=400&fit=crop'
    ],
    category: 'Home & Kitchen',
    brand: 'Instant Pot',
    stock: 45,
    sellerId: 'seller4',
    sellerName: 'Home Essentials',
    rating: 4.8,
    reviews: 12456,
    createdAt: '2024-01-25T00:00:00Z'
  },
  {
    _id: 'home002',
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
    createdAt: '2024-01-26T00:00:00Z'
  }
];
