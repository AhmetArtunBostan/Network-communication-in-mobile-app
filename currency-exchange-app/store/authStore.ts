import { create } from 'zustand';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '../config';

interface User {
  id: string;
  name: string;
  email: string;
  balance: Record<string, number>;
}

interface AuthState {
  token: string | null;
  user: User | null;
  isLoading: boolean;
  error: string | null;
  checkAuth: () => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  user: null,
  isLoading: false,
  error: null,

  checkAuth: async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (token) {
        // Configure axios defaults
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        
        // Get user data
        const response = await axios.get(`${API_URL}/api/auth/user`);
        set({ token, user: response.data, isLoading: false });
      }
    } catch (error) {
      console.error('Check auth error:', error);
      await AsyncStorage.removeItem('token');
      set({ token: null, user: null, isLoading: false });
    }
  },

  login: async (email: string, password: string) => {
    try {
      set({ isLoading: true, error: null });
      console.log('Making login request to:', `${API_URL}/api/auth/login`);
      
      const response = await axios.post(`${API_URL}/api/auth/login`, {
        email,
        password
      });
      
      console.log('Login response received');
      const { token, user } = response.data;
      
      await AsyncStorage.setItem('token', token);
      console.log('Token saved to AsyncStorage');
      
      // Configure axios defaults
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      set({ token, user, isLoading: false });
      console.log('Auth store updated with user data');
    } catch (error: any) {
      console.error('Login error in store:', error.response?.data || error.message);
      set({
        error: error.response?.data?.message || 'Login failed',
        isLoading: false,
        token: null,
        user: null
      });
      throw error;
    }
  },

  register: async (name: string, email: string, password: string) => {
    try {
      set({ isLoading: true, error: null });
      
      const response = await axios.post(`${API_URL}/api/auth/register`, {
        name,
        email,
        password
      });
      
      const { token, user } = response.data;
      
      await AsyncStorage.setItem('token', token);
      
      // Configure axios defaults
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      set({ token, user, isLoading: false });
    } catch (error: any) {
      console.error('Register error:', error);
      set({
        error: error.response?.data?.message || 'Registration failed',
        isLoading: false,
        token: null,
        user: null
      });
      throw error;
    }
  },

  logout: async () => {
    try {
      await AsyncStorage.removeItem('token');
      delete axios.defaults.headers.common['Authorization'];
      set({ token: null, user: null, isLoading: false, error: null });
    } catch (error) {
      console.error('Logout error:', error);
    }
  },
}));
