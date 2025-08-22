import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { RootState } from '../store/store';

const RoleBasedRedirect: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Redirect based on user role
  switch (user.role) {
    case 'admin':
      return <Navigate to="/admin/dashboard" replace />;
    case 'seller':
      return <Navigate to="/seller/dashboard" replace />;
    case 'delivery':
      return <Navigate to="/delivery/dashboard" replace />;
    case 'user':
    default:
      return <Navigate to="/" replace />; // Regular users go to homepage
  }
};

export default RoleBasedRedirect;
