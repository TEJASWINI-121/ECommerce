import React from 'react';
import { Users, Shield, User, Trash2, Edit } from 'lucide-react';

const AdminUsersPage: React.FC = () => {
  // Mock data - in a real app, this would come from your API
  const users = [
    {
      _id: '1',
      name: 'John Doe',
      email: 'john@example.com',
      role: 'user',
      createdAt: '2024-01-10T08:00:00Z',
      lastLogin: '2024-01-15T14:30:00Z'
    },
    {
      _id: '2',
      name: 'Jane Smith',
      email: 'jane@example.com',
      role: 'user',
      createdAt: '2024-01-08T10:20:00Z',
      lastLogin: '2024-01-14T16:45:00Z'
    },
    {
      _id: '3',
      name: 'Admin User',
      email: 'admin@example.com',
      role: 'admin',
      createdAt: '2023-12-01T12:00:00Z',
      lastLogin: '2024-01-15T09:15:00Z'
    },
    {
      _id: '4',
      name: 'Bob Johnson',
      email: 'bob@example.com',
      role: 'user',
      createdAt: '2024-01-05T15:30:00Z',
      lastLogin: '2024-01-13T11:20:00Z'
    }
  ];

  const stats = {
    totalUsers: users.length,
    adminUsers: users.filter(user => user.role === 'admin').length,
    regularUsers: users.filter(user => user.role === 'user').length,
    newUsersThisWeek: 2
  };

  const getRoleColor = (role: string) => {
    return role === 'admin' 
      ? 'text-purple-600 bg-purple-100' 
      : 'text-blue-600 bg-blue-100';
  };

  const getRoleIcon = (role: string) => {
    return role === 'admin' ? <Shield className="h-4 w-4" /> : <User className="h-4 w-4" />;
  };

  const handleDeleteUser = (userId: string) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      console.log('Deleting user:', userId);
      // This would typically make an API call to delete the user
    }
  };

  const handleToggleRole = (userId: string, currentRole: string) => {
    const newRole = currentRole === 'admin' ? 'user' : 'admin';
    console.log(`Changing user ${userId} role to ${newRole}`);
    // This would typically make an API call to update the user role
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center space-x-3 mb-8">
          <Users className="h-8 w-8 text-blue-600" />
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Users Management</h1>
            <p className="text-gray-600">Manage user accounts and permissions</p>
          </div>
        </div>

        {/* Users Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Users</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalUsers}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Shield className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Admin Users</p>
                <p className="text-2xl font-bold text-gray-900">{stats.adminUsers}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <User className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Regular Users</p>
                <p className="text-2xl font-bold text-gray-900">{stats.regularUsers}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Users className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">New This Week</p>
                <p className="text-2xl font-bold text-gray-900">{stats.newUsersThisWeek}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800">All Users</h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Joined
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Last Login
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users.map((user) => (
                  <tr key={user._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                          <User className="h-6 w-6 text-gray-600" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {user.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {user.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className={`inline-flex items-center space-x-1 px-2 py-1 text-xs font-medium rounded-full ${getRoleColor(user.role)}`}>
                        {getRoleIcon(user.role)}
                        <span className="capitalize">{user.role}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(user.lastLogin).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleToggleRole(user._id, user.role)}
                          className="text-blue-600 hover:text-blue-900 flex items-center space-x-1"
                          title={`Change to ${user.role === 'admin' ? 'user' : 'admin'}`}
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteUser(user._id)}
                          className="text-red-600 hover:text-red-900"
                          title="Delete user"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex justify-end space-x-4">
          <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
            Export Users
          </button>
          <button className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors">
            Add New User
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminUsersPage;