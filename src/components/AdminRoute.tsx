import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { RootState } from '../store/store';

interface AdminRouteProps {
  children: React.ReactNode;
}

const AdminRoute: React.FC<AdminRouteProps> = ({ children }) => {
  const { user } = useSelector((state: RootState) => state.auth);

  return user && user.role === 'admin' ? <>{children}</> : <Navigate to="/login" replace />;
};

export default AdminRoute;