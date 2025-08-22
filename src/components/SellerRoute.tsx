import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { RootState } from '../store/store';

interface SellerRouteProps {
  children: React.ReactNode;
}

const SellerRoute: React.FC<SellerRouteProps> = ({ children }) => {
  const { user } = useSelector((state: RootState) => state.auth);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role !== 'seller') {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default SellerRoute;
