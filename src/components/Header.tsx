import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Search, ShoppingCart, User, Menu, X, LogOut, Package, Heart } from 'lucide-react';
import { RootState, AppDispatch } from '../store/store';
import { logout } from '../store/slices/authSlice';
import { loadUserCart, clearUserCart } from '../store/slices/cartSlice';
import { getSimpleCartCount } from '../utils/simpleCart';
import SearchBar from './SearchBar';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  
  const { user } = useSelector((state: RootState) => state.auth);
  const { items } = useSelector((state: RootState) => state.cart);
  const [simpleCartCount, setSimpleCartCount] = useState(0);

  const cartItemsCount = items.reduce((acc, item) => acc + item.quantity, 0);

  // Update simple cart count
  useEffect(() => {
    const updateCartCount = () => {
      const count = getSimpleCartCount();
      setSimpleCartCount(count);
    };

    updateCartCount();

    // Listen for storage changes
    const handleStorageChange = () => {
      updateCartCount();
    };

    window.addEventListener('storage', handleStorageChange);

    // Also update on interval for same-tab changes
    const interval = setInterval(updateCartCount, 1000);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, [user]);

  // Load user's cart when they log in
  useEffect(() => {
    if (user) {
      dispatch(loadUserCart());
    } else {
      dispatch(clearUserCart());
    }
  }, [user, dispatch]);

  const handleSearch = (query: string) => {
    if (query.trim()) {
      navigate(`/products?search=${encodeURIComponent(query)}`);
    } else {
      navigate('/products');
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
    setIsUserMenuOpen(false);
  };

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <Package className="h-8 w-8 text-blue-600" />
            <span className="text-xl font-bold text-gray-800">ShopEase</span>
          </Link>

          {/* Search Bar - Desktop */}
          <div className="hidden md:block flex-1 max-w-2xl mx-8">
            <SearchBar onSearch={handleSearch} />
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link
              to="/products"
              className="text-gray-700 hover:text-blue-600 transition-colors font-medium"
            >
              Products
            </Link>
            {/* Wishlist */}
            {user && (
              <Link
                to="/wishlist"
                className="relative p-2 text-gray-600 hover:text-red-500 transition-colors"
              >
                <Heart className="h-6 w-6" />
              </Link>
            )}

            {/* Cart */}
            <Link
              to="/cart"
              className="relative p-2 text-gray-600 hover:text-blue-600 transition-colors"
            >
              <ShoppingCart className="h-6 w-6" />
              {(simpleCartCount > 0 || cartItemsCount > 0) && (
                <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {simpleCartCount || cartItemsCount}
                </span>
              )}
            </Link>

            {user ? (
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center space-x-1 text-gray-700 hover:text-blue-600 transition-colors"
                >
                  <User className="h-6 w-6" />
                  <span className="hidden lg:block">{user.name}</span>
                </button>

                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                    {/* Dashboard Link based on role */}
                    {user.role === 'user' && (
                      <Link
                        to="/user/dashboard"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        Dashboard
                      </Link>
                    )}
                    {user.role === 'admin' && (
                      <Link
                        to="/admin/dashboard"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        Admin Dashboard
                      </Link>
                    )}
                    {user.role === 'seller' && (
                      <Link
                        to="/seller/dashboard"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        Seller Dashboard
                      </Link>
                    )}
                    {user.role === 'delivery' && (
                      <Link
                        to="/delivery/dashboard"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        Delivery Dashboard
                      </Link>
                    )}

                    {/* Common links for users */}
                    {(user.role === 'user' || user.role === 'admin') && (
                      <>
                        <Link
                          to="/profile"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          Profile
                        </Link>
                        <Link
                          to="/orders"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          Order History
                        </Link>
                      </>
                    )}

                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <LogOut className="inline h-4 w-4 mr-2" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/login"
                  className="text-gray-600 hover:text-blue-600 transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Register
                </Link>
              </div>
            )}
          </nav>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 text-gray-600 hover:text-blue-600 transition-colors"
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-200">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <form onSubmit={handleSearch} className="relative mb-4">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </form>

              <Link
                to="/cart"
                className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                <ShoppingCart className="h-5 w-5" />
                <span>Cart ({cartItemsCount})</span>
              </Link>

              {user ? (
                <>
                  <Link
                    to="/profile"
                    className="block text-gray-600 hover:text-blue-600 py-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Profile
                  </Link>
                  <Link
                    to="/orders"
                    className="block text-gray-600 hover:text-blue-600 py-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Order History
                  </Link>
                  {user.role === 'admin' && (
                    <Link
                      to="/admin/dashboard"
                      className="block text-gray-600 hover:text-blue-600 py-2"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Admin Dashboard
                    </Link>
                  )}
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left text-gray-600 hover:text-blue-600 py-2"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="block text-gray-600 hover:text-blue-600 py-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="block bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-center"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Register
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;