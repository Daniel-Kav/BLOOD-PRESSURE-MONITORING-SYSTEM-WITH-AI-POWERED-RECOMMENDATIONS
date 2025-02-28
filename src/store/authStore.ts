import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import { User } from '@supabase/supabase-js';

interface AuthState {
  user: User | null;
  session: any | null;
  loading: boolean;
  error: string | null;
  profile: any | null;
  
  initialize: () => Promise<void>;
  signUp: (email: string, password: string) => Promise<{ error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  getProfile: () => Promise<any>;
  updateProfile: (updates: any) => Promise<{ error: any }>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  session: null,
  loading: true,
  error: null,
  profile: null,

  initialize: async () => {
    try {
      set({ loading: true });
      
      // Check for active session
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session) {
        const { data: { user } } = await supabase.auth.getUser();
        set({ user, session });
        
        // Get user profile
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user?.id)
          .single();
          
        set({ profile });
      }
    } catch (error) {
      console.error('Error initializing auth:', error);
    } finally {
      set({ loading: false });
    }
    
    // Set up auth state change listener
    supabase.auth.onAuthStateChange(async (event, session) => {
      set({ user: session?.user || null, session });
      
      if (event === 'SIGNED_IN' && session?.user) {
        // Get user profile
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();
          
        set({ profile });
      }
      
      if (event === 'SIGNED_OUT') {
        set({ profile: null });
      }
    });
  },

  signUp: async (email, password) => {
    try {
      set({ loading: true, error: null });
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });
      
      if (error) {
        set({ error: error.message });
        return { error };
      }
      
      // Create initial profile
      if (data.user) {
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            id: data.user.id,
            email,
          });
          
        if (profileError) {
          set({ error: profileError.message });
          return { error: profileError };
        }
      }
      
      return { error: null };
    } catch (error: any) {
      set({ error: error.message });
      return { error };
    } finally {
      set({ loading: false });
    }
  },

  signIn: async (email, password) => {
    try {
      set({ loading: true, error: null });
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        set({ error: error.message });
        return { error };
      }
      
      set({ user: data.user, session: data.session });
      
      // Get user profile
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', data.user?.id)
        .single();
        
      set({ profile });
      
      return { error: null };
    } catch (error: any) {
      set({ error: error.message });
      return { error };
    } finally {
      set({ loading: false });
    }
  },

  signOut: async () => {
    try {
      set({ loading: true });
      await supabase.auth.signOut();
      set({ user: null, session: null, profile: null });
    } catch (error: any) {
      set({ error: error.message });
    } finally {
      set({ loading: false });
    }
  },

  getProfile: async () => {
    try {
      const { user } = get();
      
      if (!user) return null;
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
        
      if (error) {
        throw error;
      }
      
      set({ profile: data });
      return data;
    } catch (error) {
      console.error('Error fetching profile:', error);
      return null;
    }
  },

  updateProfile: async (updates) => {
    try {
      const { user } = get();
      
      if (!user) {
        return { error: 'User not authenticated' };
      }
      
      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id)
        .select()
        .single();
        
      if (error) {
        return { error };
      }
      
      set({ profile: data });
      return { error: null };
    } catch (error: any) {
      return { error };
    }
  },
}));