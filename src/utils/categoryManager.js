/**
 * Category Manager Utility
 * 
 * This utility helps organize products by categories similar to Flipkart/Amazon
 * It provides functions to sort products within categories and maintain proper order
 */

// Main product categories with their display order
export const PRODUCT_CATEGORIES = [
  'electronics',
  'clothing',
  'home',
  'beauty',
  'sports',
  'grocery',
  'furniture'
];

// Sub-categories for each main category
export const SUB_CATEGORIES = {
  electronics: [
    'smartphones',
    'laptops',
    'tablets',
    'cameras',
    'audio',
    'accessories',
    'televisions',
    'gaming'
  ],
  clothing: [
    'men',
    'women',
    'kids',
    'shoes',
    'activewear',
    'accessories',
    'watches',
    'jewelry'
  ],
  home: [
    'kitchen',
    'bedding',
    'bath',
    'decor',
    'appliances',
    'storage',
    'lighting',
    'garden'
  ],
  // Add more sub-categories for other main categories
};

// Get category display name (formatted for UI)
export const getCategoryDisplayName = (category) => {
  if (!category) return '';
  
  // Capitalize first letter of each word
  return category
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

// Sort products within a category based on various factors
export const sortProductsInCategory = (products, sortBy = 'popularity') => {
  if (!products || !Array.isArray(products)) return [];
  
  const sortedProducts = [...products];
  
  switch (sortBy) {
    case 'popularity':
      // Sort by number of reviews and rating
      return sortedProducts.sort((a, b) => {
        // First prioritize featured products
        if (a.featured && !b.featured) return -1;
        if (!a.featured && b.featured) return 1;
        
        // Then by number of reviews
        if (a.numReviews !== b.numReviews) {
          return b.numReviews - a.numReviews;
        }
        
        // Then by rating
        return b.rating - a.rating;
      });
      
    case 'price_low':
      // Sort by price (low to high)
      return sortedProducts.sort((a, b) => a.price - b.price);
      
    case 'price_high':
      // Sort by price (high to low)
      return sortedProducts.sort((a, b) => b.price - a.price);
      
    case 'newest':
      // Sort by creation date
      return sortedProducts.sort((a, b) => {
        return new Date(b.createdAt) - new Date(a.createdAt);
      });
      
    case 'rating':
      // Sort by rating
      return sortedProducts.sort((a, b) => b.rating - a.rating);
      
    case 'name':
      // Sort alphabetically by name
      return sortedProducts.sort((a, b) => a.name.localeCompare(b.name));
      
    default:
      return sortedProducts;
  }
};

// Group products by categories
export const groupProductsByCategory = (products) => {
  if (!products || !Array.isArray(products)) return {};
  
  const groupedProducts = {};
  
  // Initialize categories with empty arrays
  PRODUCT_CATEGORIES.forEach(category => {
    groupedProducts[category] = [];
  });
  
  // Group products by their category
  products.forEach(product => {
    const category = product.category.toLowerCase();
    
    // If category exists in our predefined list
    if (groupedProducts[category]) {
      groupedProducts[category].push(product);
    } else {
      // For products with categories not in our predefined list
      // Add them to a misc category
      if (!groupedProducts['misc']) {
        groupedProducts['misc'] = [];
      }
      groupedProducts['misc'].push(product);
    }
  });
  
  return groupedProducts;
};

// Get featured products for each category (for homepage)
export const getFeaturedProductsByCategory = (products, limit = 4) => {
  const groupedProducts = groupProductsByCategory(products);
  const featuredByCategory = {};
  
  // For each category, get the top products
  Object.keys(groupedProducts).forEach(category => {
    const categoryProducts = groupedProducts[category];
    
    // Sort by featured flag, then by rating and reviews
    const sortedProducts = sortProductsInCategory(categoryProducts, 'popularity');
    
    // Take the top N products
    featuredByCategory[category] = sortedProducts.slice(0, limit);
  });
  
  return featuredByCategory;
};

// Get recommended products based on a product
export const getRecommendedProducts = (product, allProducts, limit = 8) => {
  if (!product || !allProducts || !Array.isArray(allProducts)) return [];
  
  // Get products in the same category
  const sameCategory = allProducts.filter(p => 
    p.category === product.category && p._id !== product._id
  );
  
  // Get products from the same brand
  const sameBrand = allProducts.filter(p => 
    p.brand === product.brand && p._id !== product._id && p.category !== product.category
  );
  
  // Sort by rating
  const sortedSameCategory = sortProductsInCategory(sameCategory, 'rating');
  const sortedSameBrand = sortProductsInCategory(sameBrand, 'rating');
  
  // Combine the results, prioritizing same category
  const recommended = [
    ...sortedSameCategory.slice(0, Math.ceil(limit * 0.75)),
    ...sortedSameBrand.slice(0, Math.floor(limit * 0.25))
  ];
  
  // If we don't have enough products, add more from other categories
  if (recommended.length < limit) {
    const otherProducts = allProducts.filter(p => 
      p._id !== product._id && 
      p.category !== product.category && 
      p.brand !== product.brand
    );
    
    const sortedOthers = sortProductsInCategory(otherProducts, 'rating');
    recommended.push(...sortedOthers.slice(0, limit - recommended.length));
  }
  
  return recommended.slice(0, limit);
};

export default {
  PRODUCT_CATEGORIES,
  SUB_CATEGORIES,
  getCategoryDisplayName,
  sortProductsInCategory,
  groupProductsByCategory,
  getFeaturedProductsByCategory,
  getRecommendedProducts
};