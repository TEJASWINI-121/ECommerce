import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';

const AuthDebug: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  
  // Get localStorage data
  const localStorageUser = localStorage.getItem('user');
  const parsedUser = localStorageUser ? JSON.parse(localStorageUser) : null;

  return (
    <div className="fixed bottom-4 left-4 bg-red-600 text-white p-4 rounded-lg text-xs max-w-sm z-50">
      <h3 className="font-bold mb-2">Auth Debug Info</h3>
      <div className="space-y-1">
        <p><strong>Redux User:</strong> {user ? user.name : 'None'}</p>
        <p><strong>Redux Token:</strong> {user?.token ? 'Present' : 'Missing'}</p>
        <p><strong>LocalStorage User:</strong> {parsedUser ? parsedUser.name : 'None'}</p>
        <p><strong>LocalStorage Token:</strong> {parsedUser?.token ? 'Present' : 'Missing'}</p>
        <p><strong>User Email:</strong> {user?.email || 'None'}</p>
        {user?.token && (
          <p><strong>Token Preview:</strong> {user.token.substring(0, 20)}...</p>
        )}
        {parsedUser?.token && (
          <p><strong>LS Token Preview:</strong> {parsedUser.token.substring(0, 20)}...</p>
        )}
      </div>
      <button
        onClick={() => {
          localStorage.removeItem('user');
          window.location.reload();
        }}
        className="mt-2 bg-red-800 text-white px-2 py-1 rounded text-xs"
      >
        Clear & Reload
      </button>
    </div>
  );
};

export default AuthDebug;
