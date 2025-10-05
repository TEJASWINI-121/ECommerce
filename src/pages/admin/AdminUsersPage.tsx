import React, { useState, useEffect } from 'react';
import { Users, Shield, User, Trash2, Edit, Search, Filter, RefreshCw, ArrowLeft, Phone, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import { API_BASE_URL } from '../../utils/simpleMockData';

interface ApiUser {
  _id: string;
  name: string;
  email: string;
  role: 'user' | 'admin' | 'seller' | 'delivery';
  createdAt: string;
  phoneNumber?: string;
  address?: {
    street?: string;
    city?: string;
    postalCode?: string;
    country?: string;
  };
}

const AdminUsersPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [users, setUsers] = useState<ApiUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchUsers = async () => {
    try {
      setLoading(true);

      // Try to get users from API first
      try {
        // Get current user token
        const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
        const token = currentUser.token;
        
        const response = await axios.get(`${API_BASE_URL}/users`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        const apiUsers = response.data.users || response.data || [];
        console.log('✅ Users from API:', apiUsers.length);
        
        if (apiUsers.length > 0) {
          setUsers(apiUsers);
          return;
        }
      } catch (apiError) {
        console.log('API users failed, trying localStorage');
      }

      // Fallback to localStorage
      try {
        const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
        console.log('✅ Users from localStorage:', registeredUsers.length);
        
        if (registeredUsers.length > 0) {
          setUsers(registeredUsers);
          return;
        }
      } catch (localError) {
        console.error('Error reading users from localStorage:', localError);
      }

      // Fallback to mock data if no localStorage users
      const mockUsers = [
        {
          _id: '1',
          name: 'John Doe',
          email: 'john@example.com',
          role: 'user',
          createdAt: '2024-01-10T08:00:00Z',
          phoneNumber: '+1234567890',
          address: { city: 'New York', country: 'USA' }
        },
        {
          _id: '2',
          name: 'Jane Smith',
          email: 'jane@example.com',
          role: 'admin',
          createdAt: '2024-01-08T10:20:00Z',
          phoneNumber: '+1234567891',
          address: { city: 'Los Angeles', country: 'USA' }
        },
        {
          _id: '3',
          name: 'Mike Johnson',
          email: 'mike@example.com',
          role: 'user',
          createdAt: '2024-01-05T10:20:00Z',
          phoneNumber: '+1234567892',
          address: { city: 'Chicago', country: 'USA' }
        },
        {
          _id: '4',
          name: 'Sarah Wilson',
          email: 'sarah@example.com',
          role: 'seller',
          createdAt: '2024-01-03T10:20:00Z',
          phoneNumber: '+1234567893',
          address: { city: 'Miami', country: 'USA' }
        },
        {
          _id: '5',
          name: 'Admin User',
          email: 'admin@example.com',
          role: 'admin',
          createdAt: '2023-12-01T10:20:00Z',
          phoneNumber: '+1234567894',
          address: { city: 'San Francisco', country: 'USA' }
        }
      ];

      setUsers(mockUsers);
      console.log('Using mock users data');
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchUsers();
    setRefreshing(false);
  };

  const handleDeleteUser = async (userId: string) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
        const token = currentUser.token || localStorage.getItem('token');

        await axios.delete(`${API_BASE_URL}/users/${userId}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          timeout: 8000
        });

        toast.success('User deleted successfully');
        fetchUsers(); // Refresh the list
      } catch (error: any) {
        console.error('Error deleting user:', error);
        toast.error('Failed to delete user');
      }
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Filter users based on search and role filter
  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === '' || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const stats = {
    totalUsers: filteredUsers.length,
    adminUsers: filteredUsers.filter(user => user.role === 'admin').length,
    regularUsers: filteredUsers.filter(user => user.role === 'user').length,
    sellerUsers: filteredUsers.filter(user => user.role === 'seller').length,
    deliveryUsers: filteredUsers.filter(user => user.role === 'delivery').length
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'text-purple-600 bg-purple-100';
      case 'seller': return 'text-green-600 bg-green-100';
      case 'delivery': return 'text-orange-600 bg-orange-100';
      default: return 'text-blue-600 bg-blue-100';
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin': return <Shield className="h-4 w-4" />;
      case 'seller': return <Users className="h-4 w-4" />;
      case 'delivery': return <User className="h-4 w-4" />;
      default: return <User className="h-4 w-4" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading users...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <button
              onClick={() => navigate('/admin')}
              className="mr-4 p-2 text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <div className="flex items-center space-x-3">
              <Users className="h-8 w-8 text-blue-600" />
              <div>
                <h1 className="text-3xl font-bold text-gray-800">Users Management</h1>
                <p className="text-gray-600">Manage user accounts and permissions</p>
              </div>
            </div>
          </div>
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Filter className="h-4 w-4 text-gray-400" />
                <select
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">All Roles</option>
                  <option value="user">Users</option>
                  <option value="admin">Admins</option>
                  <option value="seller">Sellers</option>
                  <option value="delivery">Delivery</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Users Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
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
              <div className="p-2 bg-green-100 rounded-lg">
                <Users className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Sellers</p>
                <p className="text-2xl font-bold text-gray-900">{stats.sellerUsers}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="p-2 bg-orange-100 rounded-lg">
                <User className="h-6 w-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Delivery</p>
                <p className="text-2xl font-bold text-gray-900">{stats.deliveryUsers}</p>
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
                    Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Location
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Joined
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredUsers.map((user) => (
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
                    <td className="px-6 py-4 whitespace-nowrap">
                      {user.phoneNumber ? (
                        <div className="flex items-center text-sm text-gray-900">
                          <Phone className="h-4 w-4 text-gray-400 mr-2" />
                          {user.phoneNumber}
                        </div>
                      ) : (
                        <span className="text-sm text-gray-400">No phone</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {user.address?.city ? (
                        <div className="flex items-center text-sm text-gray-900">
                          <MapPin className="h-4 w-4 text-gray-400 mr-2" />
                          {user.address.city}, {user.address.country}
                        </div>
                      ) : (
                        <span className="text-sm text-gray-400">No address</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
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