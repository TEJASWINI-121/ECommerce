import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ThemeProvider } from './contexts/ThemeContext';

import { store } from './store/store';
import Header from './components/Header';
import Footer from './components/Footer';
import DebugInfo from './components/DebugInfo';
import DebugPanel from './components/DebugPanel';
import PrivateRoute from './components/PrivateRoute';
import AdminRoute from './components/AdminRoute';
import SellerRoute from './components/SellerRoute';
import DeliveryRoute from './components/DeliveryRoute';
import RoleBasedRedirect from './components/RoleBasedRedirect';
import Loader from './components/Loader';

// Lazy load pages to improve initial loading performance
const HomePage = lazy(() => import('./pages/HomePage'));
const ProductsPage = lazy(() => import('./pages/ProductsPage'));
const ProductPage = lazy(() => import('./pages/ProductPage'));
const FastCartPage = lazy(() => import('./pages/FastCartPage'));
const WishlistPage = lazy(() => import('./pages/WishlistPage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const RegisterPage = lazy(() => import('./pages/RegisterPage'));
const ProfilePage = lazy(() => import('./pages/ProfilePage'));
const CheckoutPage = lazy(() => import('./pages/CheckoutPage'));
const OrderSuccessPage = lazy(() => import('./pages/OrderSuccessPage'));
const OrderPage = lazy(() => import('./pages/OrderPage'));
const OrderHistoryPage = lazy(() => import('./pages/OrderHistoryPage'));
const UserDashboard = lazy(() => import('./pages/UserDashboard'));
const SellerDashboard = lazy(() => import('./pages/SellerDashboard'));
const DeliveryDashboard = lazy(() => import('./pages/DeliveryDashboard'));

// Lazy load admin pages
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));
const EnhancedAdminDashboard = lazy(() => import('./pages/admin/EnhancedAdminDashboard'));
const AdminProducts = lazy(() => import('./pages/admin/AdminProducts'));
const AdminProductsPage = lazy(() => import('./pages/admin/AdminProductsPage'));
const AddProductPage = lazy(() => import('./pages/admin/AddProductPage'));
const AdminOrdersPage = lazy(() => import('./pages/admin/AdminOrdersPage'));
const AdminUsersPage = lazy(() => import('./pages/admin/AdminUsersPage'));

function App() {
  return (
    <Provider store={store}>
      <ThemeProvider>
        <Router>
          <div className="min-h-screen bg-gray-50 dark:bg-gray-900 dark:text-white flex flex-col transition-colors">
          <Header />
          <main className="flex-1">
            <Suspense fallback={<div className="flex justify-center items-center h-full"><Loader /></div>}>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/products" element={<ProductsPage />} />
                <Route path="/product/:id" element={<ProductPage />} />
                <Route path="/cart" element={<FastCartPage />} />
                <Route path="/wishlist" element={<WishlistPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/profile" element={<PrivateRoute><ProfilePage /></PrivateRoute>} />
                <Route path="/checkout" element={<CheckoutPage />} />
                <Route path="/order-success" element={<OrderSuccessPage />} />
                <Route path="/order/:id" element={<PrivateRoute><OrderPage /></PrivateRoute>} />
                <Route path="/order-history" element={<PrivateRoute><OrderHistoryPage /></PrivateRoute>} />

                {/* Role-based redirects */}
                <Route path="/dashboard" element={<PrivateRoute><RoleBasedRedirect /></PrivateRoute>} />

                {/* User Dashboard */}
                <Route path="/user-dashboard" element={<PrivateRoute><UserDashboard /></PrivateRoute>} />

                {/* Seller Dashboard */}
                <Route path="/seller-dashboard" element={<SellerRoute><SellerDashboard /></SellerRoute>} />

                {/* Delivery Dashboard */}
                <Route path="/delivery-dashboard" element={<DeliveryRoute><DeliveryDashboard /></DeliveryRoute>} />

                {/* Admin Routes */}
                <Route path="/admin" element={<AdminRoute><EnhancedAdminDashboard /></AdminRoute>} />
                <Route path="/admin/dashboard" element={<AdminRoute><EnhancedAdminDashboard /></AdminRoute>} />
                <Route path="/admin/products" element={<AdminRoute><AdminProducts /></AdminRoute>} />
                <Route path="/admin/products/add" element={<AdminRoute><AddProductPage /></AdminRoute>} />
                <Route path="/admin/products-old" element={<AdminRoute><AdminProductsPage /></AdminRoute>} />
                <Route path="/admin/orders" element={<AdminRoute><AdminOrdersPage /></AdminRoute>} />
                <Route path="/admin/users" element={<AdminRoute><AdminUsersPage /></AdminRoute>} />
              </Routes>
            </Suspense>
          </main>
          <Footer />
          <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
          />
          <DebugInfo />
          <DebugPanel />
          </div>
        </Router>
      </ThemeProvider>
    </Provider>
  );
}

export default App;