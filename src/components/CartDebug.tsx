import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';

const CartDebug: React.FC = () => {
  const { items, isLoading, error } = useSelector((state: RootState) => state.cart);
  const { user, token } = useSelector((state: RootState) => state.auth);

  return (
    <div className="fixed bottom-4 right-4 bg-black text-white p-4 rounded-lg text-xs max-w-sm z-50">
      <h3 className="font-bold mb-2">Cart Debug Info</h3>
      <div className="space-y-1">
        <p><strong>User:</strong> {user ? user.name : 'Not logged in'}</p>
        <p><strong>Token:</strong> {token ? 'Present' : 'Missing'}</p>
        <p><strong>Cart Items:</strong> {items.length}</p>
        <p><strong>Loading:</strong> {isLoading ? 'Yes' : 'No'}</p>
        <p><strong>Error:</strong> {error || 'None'}</p>
        {items.length > 0 && (
          <div>
            <p><strong>Items:</strong></p>
            {items.map((item, index) => (
              <p key={index} className="ml-2">
                {item.product.name} (Qty: {item.quantity})
              </p>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CartDebug;
