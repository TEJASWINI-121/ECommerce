import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../store/store';
import { loadUserCart } from '../store/slices/cartSlice';
import FastCart from '../components/FastCart';

const FastCartPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    // Load user's cart from localStorage
    dispatch(loadUserCart());
  }, [dispatch, user]);

  return <FastCart />;
};

export default FastCartPage;
