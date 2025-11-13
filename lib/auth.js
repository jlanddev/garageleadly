import { supabase } from './supabase';

export const auth = {
  // Login
  login: async (email, password) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        return { success: false, error: error.message };
      }

      // Get contractor profile
      const { data: contractor } = await supabase
        .from('contractors')
        .select('*')
        .eq('email', email)
        .single();

      return { success: true, user: contractor, session: data.session };
    } catch (err) {
      return { success: false, error: 'Login failed' };
    }
  },

  // Signup
  signup: async (userData) => {
    try {
      // Create auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: userData.email,
        password: userData.password,
      });

      if (authError) {
        return { success: false, error: authError.message };
      }

      // Create contractor profile
      const { data: contractor, error: contractorError } = await supabase
        .from('contractors')
        .insert([{
          id: authData.user.id,
          email: userData.email,
          phone: userData.phone,
          name: userData.name,
          company_name: userData.company_name,
          counties: userData.counties || [],
          job_types: userData.job_types || ['residential', 'commercial'],
          daily_lead_cap: userData.daily_lead_cap || 5,
          price_per_lead: userData.price_per_lead || 25.00,
          status: 'active',
        }])
        .select()
        .single();

      if (contractorError) {
        return { success: false, error: 'Failed to create contractor profile' };
      }

      return { success: true, user: contractor };
    } catch (err) {
      return { success: false, error: 'Signup failed' };
    }
  },

  // Get current user
  getCurrentUser: async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) return null;

      const { data: contractor } = await supabase
        .from('contractors')
        .select('*')
        .eq('id', session.user.id)
        .single();

      return contractor;
    } catch (err) {
      return null;
    }
  },

  // Logout
  logout: async () => {
    await supabase.auth.signOut();
  },

  // Check if logged in
  isAuthenticated: async () => {
    const { data: { session } } = await supabase.auth.getSession();
    return !!session;
  },
};

// Get real leads from database
export const getLeads = async (contractorId) => {
  try {
    const { data: leads, error } = await supabase
      .from('leads')
      .select('*')
      .eq('contractor_id', contractorId)
      .order('submitted_at', { ascending: false });

    if (error) {
      console.error('Error fetching leads:', error);
      return [];
    }

    return leads;
  } catch (err) {
    console.error('Error:', err);
    return [];
  }
};
