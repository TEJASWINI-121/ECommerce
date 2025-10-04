// Simple Cart System - Works immediately without complex API logic
import { toast } from 'react-toastify';

export interface SimpleCartItem {
  _id: string;
  name: string;
  price: number;
  images: string[];
  quantity: number;
  stock: number;
  brand?: string;
  category?: string;
}

// Get current user ID for cart isolation
const getCurrentUserId = (): string => {
  try {
    const user = localStorage.getItem('currentUser');
    if (user) {
      const userData = JSON.parse(user);
      return userData._id || 'guest';
    }
    return 'guest';
  } catch {
    return 'guest';
  }
};

// Get cart key for current user
const getCartKey = (): string => {
  const userId = getCurrentUserId();
  return `simple_cart_${userId}`;
};

// Get cart items from localStorage
export const getSimpleCart = (): SimpleCartItem[] => {
  try {
    const cartKey = getCartKey();
    const cart = localStorage.getItem(cartKey);
    return cart ? JSON.parse(cart) : [];
  } catch (error) {
    console.error('Error getting cart:', error);
    return [];
  }
};

// Save cart items to localStorage
export const saveSimpleCart = (items: SimpleCartItem[]): void => {
  try {
    const cartKey = getCartKey();
    localStorage.setItem(cartKey, JSON.stringify(items));
    console.log('✅ Cart saved:', items.length, 'items');
  } catch (error) {
    console.error('Error saving cart:', error);
  }
};

// Add item to cart
export const addToSimpleCart = (product: any, quantity: number = 1): boolean => {
  try {
    console.log('🛒 Adding to cart:', product.name, 'Quantity:', quantity);

    const currentCart = getSimpleCart();
    const existingItemIndex = currentCart.findIndex(item => item._id === product._id);

    if (existingItemIndex >= 0) {
      // Update quantity if item exists
      currentCart[existingItemIndex].quantity += quantity;
      console.log('📦 Updated quantity for:', product.name);
    } else {
      // Add new item
      const cartItem: SimpleCartItem = {
        _id: product._id,
        name: product.name,
        price: product.price,
        images: product.images || [],
        quantity: quantity,
        stock: product.stock || 0,
        brand: product.brand,
        category: product.category
      };
      currentCart.push(cartItem);
      console.log('✨ Added new item:', product.name);
    }

    saveSimpleCart(currentCart);
    toast.success(`${product.name} added to cart!`);
    return true;
  } catch (error) {
    console.error('Error adding to cart:', error);
    toast.error('Failed to add item to cart');
    return false;
  }
};

// Remove item from cart
export const removeFromSimpleCart = (productId: string): boolean => {
  try {
    const currentCart = getSimpleCart();
    const updatedCart = currentCart.filter(item => item._id !== productId);
    saveSimpleCart(updatedCart);
    toast.success('Item removed from cart');
    return true;
  } catch (error) {
    console.error('Error removing from cart:', error);
    toast.error('Failed to remove item');
    return false;
  }
};

// Update item quantity
export const updateSimpleCartQuantity = (productId: string, quantity: number): boolean => {
  try {
    const currentCart = getSimpleCart();
    const itemIndex = currentCart.findIndex(item => item._id === productId);
    
    if (itemIndex >= 0) {
      if (quantity <= 0) {
        // Remove item if quantity is 0 or less
        return removeFromSimpleCart(productId);
      } else {
        currentCart[itemIndex].quantity = quantity;
        saveSimpleCart(currentCart);
        return true;
      }
    }
    return false;
  } catch (error) {
    console.error('Error updating quantity:', error);
    return false;
  }
};

// Clear cart
export const clearSimpleCart = (): void => {
  try {
    const cartKey = getCartKey();
    localStorage.removeItem(cartKey);
    console.log('🗑️ Cart cleared');
  } catch (error) {
    console.error('Error clearing cart:', error);
  }
};

// Get cart total
export const getSimpleCartTotal = (): number => {
  const cart = getSimpleCart();
  return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
};

// Get cart item count
export const getSimpleCartCount = (): number => {
  const cart = getSimpleCart();
  return cart.reduce((count, item) => count + item.quantity, 0);
};

// Simple Wishlist System
const getWishlistKey = (): string => {
  const userId = getCurrentUserId();
  return `simple_wishlist_${userId}`;
};

export const getSimpleWishlist = (): any[] => {
  try {
    const wishlistKey = getWishlistKey();
    const wishlist = localStorage.getItem(wishlistKey);
    return wishlist ? JSON.parse(wishlist) : [];
  } catch (error) {
    console.error('Error getting wishlist:', error);
    return [];
  }
};

export const addToSimpleWishlist = (product: any): boolean => {
  try {
    const currentWishlist = getSimpleWishlist();
    const exists = currentWishlist.some(item => item._id === product._id);
    
    if (!exists) {
      currentWishlist.push(product);
      const wishlistKey = getWishlistKey();
      localStorage.setItem(wishlistKey, JSON.stringify(currentWishlist));
      toast.success(`${product.name} added to wishlist!`);
      return true;
    } else {
      toast.info('Item already in wishlist');
      return false;
    }
  } catch (error) {
    console.error('Error adding to wishlist:', error);
    toast.error('Failed to add to wishlist');
    return false;
  }
};

export const removeFromSimpleWishlist = (productId: string): boolean => {
  try {
    const currentWishlist = getSimpleWishlist();
    const updatedWishlist = currentWishlist.filter(item => item._id !== productId);
    const wishlistKey = getWishlistKey();
    localStorage.setItem(wishlistKey, JSON.stringify(updatedWishlist));
    toast.success('Removed from wishlist');
    return true;
  } catch (error) {
    console.error('Error removing from wishlist:', error);
    toast.error('Failed to remove from wishlist');
    return false;
  }
};

export const isInSimpleWishlist = (productId: string): boolean => {
  const wishlist = getSimpleWishlist();
  return wishlist.some(item => item._id === productId);
};
