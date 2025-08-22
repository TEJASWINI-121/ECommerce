import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { RootState } from '../store/store';

interface DeliveryRouteProps {
  children: React.ReactNode;
}

const DeliveryRoute: React.FC<DeliveryRouteProps> = ({ children }) => {
  const { user } = useSelector((state: RootState) => state.auth);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role !== 'delivery') {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default DeliveryRoute;
