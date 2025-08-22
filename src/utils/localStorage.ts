// Comprehensive localStorage management system for e-commerce

// User Management
export const saveUserToStorage = (user: any) => {
  try {
    console.log('💾 Saving user to localStorage:', user.email);

    // Save current user
    localStorage.setItem('currentUser', JSON.stringify(user));

    // Also save to users list if not exists
    const users = getUsersFromStorage();
    const existingUserIndex = users.findIndex(u => u._id === user._id || u.email === user.email);

    if (existingUserIndex >= 0) {
      users[existingUserIndex] = user;
      console.log('📝 Updated existing user in allUsers');
    } else {
      users.push(user);
      console.log('➕ Added new user to allUsers');
    }

    localStorage.setItem('allUsers', JSON.stringify(users));
    console.log('✅ User saved successfully. Total users:', users.length);
  } catch (error) {
    console.error('❌ Error saving user to localStorage:', error);
  }
};

export const getCurrentUser = () => {
  try {
    const user = localStorage.getItem('currentUser');
    return user ? JSON.parse(user) : null;
  } catch (error) {
    console.error('Error getting current user from localStorage:', error);
    return null;
  }
};

export const getUsersFromStorage = () => {
  try {
    const users = localStorage.getItem('allUsers');
    return users ? JSON.parse(users) : [];
  } catch (error) {
    console.error('Error getting users from localStorage:', error);
    return [];
  }
};

export const removeCurrentUser = () => {
  try {
    localStorage.removeItem('currentUser');
  } catch (error) {
    console.error('Error removing current user from localStorage:', error);
  }
};

// Cart Management
export const saveCartToStorage = (cartItems: any[]) => {
  try {
    const currentUser = getCurrentUser();
    const cartKey = currentUser ? `cart_${currentUser._id}` : 'cart_guest';
    localStorage.setItem(cartKey, JSON.stringify(cartItems));
  } catch (error) {
    console.error('Error saving cart to localStorage:', error);
  }
};

export const getCartFromStorage = () => {
  try {
    const currentUser = getCurrentUser();
    const cartKey = currentUser ? `cart_${currentUser._id}` : 'cart_guest';
    const cart = localStorage.getItem(cartKey);
    return cart ? JSON.parse(cart) : [];
  } catch (error) {
    console.error('Error getting cart from localStorage:', error);
    return [];
  }
};

export const clearCart = () => {
  try {
    const currentUser = getCurrentUser();
    const cartKey = currentUser ? `cart_${currentUser._id}` : 'cart_guest';
    localStorage.removeItem(cartKey);
  } catch (error) {
    console.error('Error clearing cart from localStorage:', error);
  }
};

// Orders Management
export const saveOrderToStorage = (order: any) => {
  try {
    const currentUser = getCurrentUser();
    if (!currentUser) return;
    
    const orders = getOrdersFromStorage();
    orders.unshift(order); // Add to beginning of array
    localStorage.setItem('userOrders', JSON.stringify(orders));
    
    // Also save to user-specific orders
    const userOrderKey = `orders_${currentUser._id}`;
    const userOrders = getUserOrdersFromStorage(currentUser._id);
    userOrders.unshift(order);
    localStorage.setItem(userOrderKey, JSON.stringify(userOrders));
  } catch (error) {
    console.error('Error saving order to localStorage:', error);
  }
};

export const getOrdersFromStorage = () => {
  try {
    const orders = localStorage.getItem('userOrders');
    return orders ? JSON.parse(orders) : [];
  } catch (error) {
    console.error('Error getting orders from localStorage:', error);
    return [];
  }
};

export const getUserOrdersFromStorage = (userId: string) => {
  try {
    const userOrderKey = `orders_${userId}`;
    const orders = localStorage.getItem(userOrderKey);
    return orders ? JSON.parse(orders) : [];
  } catch (error) {
    console.error('Error getting user orders from localStorage:', error);
    return [];
  }
};

// Wishlist Management
export const saveWishlistToStorage = (wishlistItems: any[]) => {
  try {
    const currentUser = getCurrentUser();
    if (!currentUser) return;
    
    const wishlistKey = `wishlist_${currentUser._id}`;
    localStorage.setItem(wishlistKey, JSON.stringify(wishlistItems));
  } catch (error) {
    console.error('Error saving wishlist to localStorage:', error);
  }
};

export const getWishlistFromStorage = () => {
  try {
    const currentUser = getCurrentUser();
    if (!currentUser) return [];
    
    const wishlistKey = `wishlist_${currentUser._id}`;
    const wishlist = localStorage.getItem(wishlistKey);
    return wishlist ? JSON.parse(wishlist) : [];
  } catch (error) {
    console.error('Error getting wishlist from localStorage:', error);
    return [];
  }
};

export const addToWishlist = (product: any) => {
  try {
    const wishlist = getWishlistFromStorage();
    const existingIndex = wishlist.findIndex((item: any) => item._id === product._id);
    
    if (existingIndex === -1) {
      wishlist.push(product);
      saveWishlistToStorage(wishlist);
      return true; // Added
    }
    return false; // Already exists
  } catch (error) {
    console.error('Error adding to wishlist:', error);
    return false;
  }
};

export const removeFromWishlist = (productId: string) => {
  try {
    const wishlist = getWishlistFromStorage();
    const updatedWishlist = wishlist.filter((item: any) => item._id !== productId);
    saveWishlistToStorage(updatedWishlist);
    return true;
  } catch (error) {
    console.error('Error removing from wishlist:', error);
    return false;
  }
};

// Recently Viewed Products
export const addToRecentlyViewed = (product: any) => {
  try {
    const currentUser = getCurrentUser();
    const recentKey = currentUser ? `recent_${currentUser._id}` : 'recent_guest';
    
    let recentlyViewed = localStorage.getItem(recentKey);
    let recent = recentlyViewed ? JSON.parse(recentlyViewed) : [];
    
    // Remove if already exists
    recent = recent.filter((item: any) => item._id !== product._id);
    
    // Add to beginning
    recent.unshift(product);
    
    // Keep only last 20 items
    recent = recent.slice(0, 20);
    
    localStorage.setItem(recentKey, JSON.stringify(recent));
  } catch (error) {
    console.error('Error adding to recently viewed:', error);
  }
};

export const getRecentlyViewed = () => {
  try {
    const currentUser = getCurrentUser();
    const recentKey = currentUser ? `recent_${currentUser._id}` : 'recent_guest';
    
    const recentlyViewed = localStorage.getItem(recentKey);
    return recentlyViewed ? JSON.parse(recentlyViewed) : [];
  } catch (error) {
    console.error('Error getting recently viewed:', error);
    return [];
  }
};

// Search History
export const addToSearchHistory = (searchTerm: string) => {
  try {
    const currentUser = getCurrentUser();
    const searchKey = currentUser ? `search_${currentUser._id}` : 'search_guest';
    
    let searchHistory = localStorage.getItem(searchKey);
    let searches = searchHistory ? JSON.parse(searchHistory) : [];
    
    // Remove if already exists
    searches = searches.filter((term: string) => term.toLowerCase() !== searchTerm.toLowerCase());
    
    // Add to beginning
    searches.unshift(searchTerm);
    
    // Keep only last 10 searches
    searches = searches.slice(0, 10);
    
    localStorage.setItem(searchKey, JSON.stringify(searches));
  } catch (error) {
    console.error('Error adding to search history:', error);
  }
};

export const getSearchHistory = () => {
  try {
    const currentUser = getCurrentUser();
    const searchKey = currentUser ? `search_${currentUser._id}` : 'search_guest';
    
    const searchHistory = localStorage.getItem(searchKey);
    return searchHistory ? JSON.parse(searchHistory) : [];
  } catch (error) {
    console.error('Error getting search history:', error);
    return [];
  }
};

// User Preferences
export const saveUserPreferences = (preferences: any) => {
  try {
    const currentUser = getCurrentUser();
    if (!currentUser) return;
    
    const prefKey = `preferences_${currentUser._id}`;
    localStorage.setItem(prefKey, JSON.stringify(preferences));
  } catch (error) {
    console.error('Error saving user preferences:', error);
  }
};

export const getUserPreferences = () => {
  try {
    const currentUser = getCurrentUser();
    if (!currentUser) return {};
    
    const prefKey = `preferences_${currentUser._id}`;
    const preferences = localStorage.getItem(prefKey);
    return preferences ? JSON.parse(preferences) : {};
  } catch (error) {
    console.error('Error getting user preferences:', error);
    return {};
  }
};

// Clear all user data (for logout)
export const clearAllUserData = () => {
  try {
    const currentUser = getCurrentUser();
    if (currentUser) {
      // Clear user-specific data
      localStorage.removeItem(`cart_${currentUser._id}`);
      localStorage.removeItem(`wishlist_${currentUser._id}`);
      localStorage.removeItem(`recent_${currentUser._id}`);
      localStorage.removeItem(`search_${currentUser._id}`);
      localStorage.removeItem(`preferences_${currentUser._id}`);
    }
    
    // Clear current user
    removeCurrentUser();
  } catch (error) {
    console.error('Error clearing user data:', error);
  }
};
