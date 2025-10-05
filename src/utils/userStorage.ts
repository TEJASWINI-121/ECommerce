// Utility for managing user registration in localStorage

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
}

// Add a newly registered user to localStorage
export const addRegisteredUser = (user: User) => {
  try {
    const existingUsers = getRegisteredUsers();
    
    // Check if user already exists
    const userExists = existingUsers.some(u => u.email === user.email);
    if (userExists) return;
    
    // Add user with timestamp
    const newUser = {
      ...user,
      createdAt: user.createdAt || new Date().toISOString()
    };
    
    const updatedUsers = [...existingUsers, newUser];
    localStorage.setItem('registeredUsers', JSON.stringify(updatedUsers));
    
    console.log('✅ User added to localStorage:', newUser.email);
  } catch (error) {
    console.error('Failed to add user to localStorage:', error);
  }
};

// Get all registered users from localStorage
export const getRegisteredUsers = (): User[] => {
  try {
    const users = localStorage.getItem('registeredUsers');
    return users ? JSON.parse(users) : [];
  } catch (error) {
    console.error('Failed to get registered users from localStorage:', error);
    return [];
  }
};

// Update a user in localStorage
export const updateRegisteredUser = (userId: string, updates: Partial<User>) => {
  try {
    const existingUsers = getRegisteredUsers();
    const updatedUsers = existingUsers.map(user => 
      user._id === userId ? { ...user, ...updates } : user
    );
    
    localStorage.setItem('registeredUsers', JSON.stringify(updatedUsers));
    console.log('✅ User updated in localStorage:', userId);
  } catch (error) {
    console.error('Failed to update user in localStorage:', error);
  }
};

// Remove a user from localStorage
export const removeRegisteredUser = (userId: string) => {
  try {
    const existingUsers = getRegisteredUsers();
    const updatedUsers = existingUsers.filter(user => user._id !== userId);
    
    localStorage.setItem('registeredUsers', JSON.stringify(updatedUsers));
    console.log('✅ User removed from localStorage:', userId);
  } catch (error) {
    console.error('Failed to remove user from localStorage:', error);
  }
};

// Get user counts by role
export const getUserCountsByRole = () => {
  try {
    const users = getRegisteredUsers();
    
    return {
      totalUsers: users.filter(u => u.role === 'user').length,
      totalSellers: users.filter(u => u.role === 'seller').length,
      totalDeliveryAgents: users.filter(u => u.role === 'delivery').length,
      totalAdmins: users.filter(u => u.role === 'admin').length,
    };
  } catch (error) {
    console.error('Failed to get user counts by role:', error);
    return {
      totalUsers: 0,
      totalSellers: 0,
      totalDeliveryAgents: 0,
      totalAdmins: 0
    };
  }
};