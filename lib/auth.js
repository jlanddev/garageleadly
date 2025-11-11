// Simple localStorage-based auth (no database needed)

export const auth = {
  // Login
  login: (email, password) => {
    const users = JSON.parse(localStorage.getItem('garageleadly_users') || '[]');
    const user = users.find(u => u.email === email && u.password === password);

    if (user) {
      localStorage.setItem('garageleadly_current_user', JSON.stringify(user));
      return { success: true, user };
    }

    return { success: false, error: 'Invalid email or password' };
  },

  // Signup
  signup: (userData) => {
    const users = JSON.parse(localStorage.getItem('garageleadly_users') || '[]');

    // Check if user already exists
    if (users.find(u => u.email === userData.email)) {
      return { success: false, error: 'Email already registered' };
    }

    // Create new user
    const newUser = {
      id: Date.now().toString(),
      ...userData,
      status: 'active',
      createdAt: new Date().toISOString(),
    };

    users.push(newUser);
    localStorage.setItem('garageleadly_users', JSON.stringify(users));
    localStorage.setItem('garageleadly_current_user', JSON.stringify(newUser));

    return { success: true, user: newUser };
  },

  // Get current user
  getCurrentUser: () => {
    const user = localStorage.getItem('garageleadly_current_user');
    return user ? JSON.parse(user) : null;
  },

  // Logout
  logout: () => {
    localStorage.removeItem('garageleadly_current_user');
  },

  // Check if logged in
  isAuthenticated: () => {
    return !!localStorage.getItem('garageleadly_current_user');
  },
};

// Mock lead data for demo
export const getMockLeads = (userId) => {
  return [
    {
      id: '1',
      name: 'Michael Rodriguez',
      phone: '(832) 555-1847',
      email: 'mrodriguez@gmail.com',
      address: '2847 Oak Valley Dr',
      zip: '77084',
      county: 'Harris County',
      issue_description: 'Garage door won\'t close - sensor keeps beeping',
      price_charged: 4500,
      created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'completed',
      job_value: 38500,
    },
    {
      id: '2',
      name: 'Sarah Thompson',
      phone: '(281) 555-2934',
      email: 'sarah.t@yahoo.com',
      address: '156 Maple Ridge Ln',
      zip: '77479',
      county: 'Fort Bend County',
      issue_description: 'Spring broke this morning, door stuck halfway',
      price_charged: 4200,
      created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'scheduled',
      job_value: null,
    },
    {
      id: '3',
      name: 'James Wilson',
      phone: '(713) 555-8923',
      email: 'jwilson@hotmail.com',
      address: '8934 Pine Forest Ct',
      zip: '77082',
      county: 'Harris County',
      issue_description: 'Opener motor making loud grinding noise',
      price_charged: 4500,
      created_at: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
      status: 'called',
      job_value: null,
    },
    {
      id: '4',
      name: 'Lisa Martinez',
      phone: '(346) 555-7621',
      email: 'lmartinez@gmail.com',
      address: '4521 Westheimer Rd',
      zip: '77027',
      county: 'Harris County',
      issue_description: 'Door panel dented, needs replacement',
      price_charged: 4500,
      created_at: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
      status: 'new',
      job_value: null,
    },
  ];
};
