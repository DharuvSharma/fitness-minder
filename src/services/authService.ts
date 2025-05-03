
import apiClient from './apiClient';
import { setToken, setUser, clearAuthData, getUser } from '@/utils/token-utils';
import { toast } from 'sonner';

interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterData {
  name: string;
  email: string;
  password: string;
}

interface AuthResponse {
  token: string;
  user: any;
}

/**
 * Authentication service for handling user login, registration, and session management
 */
export const authService = {
  /**
   * Log in a user
   */
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    try {
      const response = await apiClient.post('/auth/login', credentials);
      const { token, user } = response.data;
      
      // Store authentication data
      setToken(token);
      setUser(user);
      
      return { token, user };
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  },
  
  /**
   * Register a new user
   */
  register: async (userData: RegisterData): Promise<any> => {
    try {
      const response = await apiClient.post('/auth/register', userData);
      return response.data;
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    }
  },
  
  /**
   * Log out the current user
   */
  logout: () => {
    clearAuthData();
  },
  
  /**
   * Get the current authenticated user
   */
  getCurrentUser: () => {
    return getUser();
  },

  /**
   * Check if the user's authentication is still valid
   */
  checkAuthStatus: async () => {
    try {
      const response = await apiClient.get('/auth/status');
      return response.data;
    } catch (error) {
      console.error('Error checking auth status:', error);
      return null;
    }
  },
  
  /**
   * Check if the user is authenticated
   */
  isAuthenticated: () => {
    return !!getUser();
  }
};

export default authService;
