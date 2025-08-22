import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { store } from './store/store';
import Header from './components/Header';
import Footer from './components/Footer';
import DebugInfo from './components/DebugInfo';
import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';
import ProductPage from './pages/ProductPage';
import FastCartPage from './pages/FastCartPage';
import WishlistPage from './pages/WishlistPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage';
import CheckoutPage from './pages/CheckoutPage';
import OrderSuccessPage from './pages/OrderSuccessPage';
import OrderPage from './pages/OrderPage';
import OrderHistoryPage from './pages/OrderHistoryPage';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminProductsPage from './pages/admin/AdminProductsPage';
import AdminOrdersPage from './pages/admin/AdminOrdersPage';
import AdminUsersPage from './pages/admin/AdminUsersPage';
import PrivateRoute from './components/PrivateRoute';
import DebugPanel from './components/DebugPanel';
import AdminRoute from './components/AdminRoute';
import SellerRoute from './components/SellerRoute';
import DeliveryRoute from './components/DeliveryRoute';
import RoleBasedRedirect from './components/RoleBasedRedirect';
import UserDashboard from './pages/UserDashboard';
import SellerDashboard from './pages/SellerDashboard';
import DeliveryDashboard from './pages/DeliveryDashboard';

function App() {
  return (
    <Provider store={store}>
      <Router>
        <div className="min-h-screen bg-gray-50 flex flex-col">
          <Header />
          <main className="flex-1">
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
              <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
              <Route path="/admin/products" element={<AdminRoute><AdminProductsPage /></AdminRoute>} />
              <Route path="/admin/orders" element={<AdminRoute><AdminOrdersPage /></AdminRoute>} />
              <Route path="/admin/users" element={<AdminRoute><AdminUsersPage /></AdminRoute>} />
            </Routes>
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
    </Provider>
  );
}

export default App;