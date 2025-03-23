
import axios from 'axios';
import { toast } from 'sonner';
import { jwtDecode } from 'jwt-decode';

// Create an axios instance with default config
const api = axios.create({
  // Use relative URL for deployment flexibility
  baseURL: '/api', 
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Request interceptor for adding auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for handling common errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle network errors
    if (!error.response) {
      console.error('Network Error:', error);
      toast.error('Network Error. Please check your connection or the server status.');
      return Promise.reject(error);
    }
    
    // Handle specific HTTP status codes
    try {
      switch (error.response.status) {
        case 401:
          // Clear auth data and redirect to login
          localStorage.removeItem('auth_token');
          localStorage.removeItem('user');
          window.location.href = '/login';
          toast.error('Your session has expired. Please login again.');
          break;
        case 403:
          toast.error('You do not have permission to perform this action.');
          break;
        case 404:
          toast.error('Resource not found.');
          break;
        case 500:
          toast.error('Server error. Please try again later.');
          break;
        default:
          // Handle other errors
          const message = error.response?.data?.message || 'Something went wrong';
          toast.error(message);
      }
    } catch (e) {
      console.error('Error in error handling:', e);
      toast.error('An unexpected error occurred');
    }
    
    return Promise.reject(error);
  }
);

// Function to check if JWT token is expired
const isTokenExpired = (token: string) => {
  try {
    const decoded: any = jwtDecode(token);
    return decoded.exp * 1000 < Date.now();
  } catch (error) {
    return true;
  }
};

// Auth related functions
export const authService = {
  login: async (credentials: { email: string; password: string }) => {
    try {
      const response = await api.post('/auth/login', credentials);
      const { token, id, name, email } = response.data;
      
      // Store token and user data
      localStorage.setItem('auth_token', token);
      
      const user = { id, name, email };
      return user;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },
  
  register: async (userData: { name: string; email: string; password: string }) => {
    try {
      const response = await api.post('/auth/register', userData);
      return response.data;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  },
  
  logout: () => {
    localStorage.removeItem('auth_token');
    window.location.href = '/login';
  },
  
  getCurrentUserData: async () => {
    try {
      const response = await api.get('/user/me');
      return response.data;
    } catch (error) {
      console.error('Error getting current user data:', error);
      throw error;
    }
  },
  
  getCurrentUser: () => {
    const token = localStorage.getItem('auth_token');
    if (!token) {
      return null;
    }
    
    // Check if token is expired
    if (isTokenExpired(token)) {
      localStorage.removeItem('auth_token');
      return null;
    }
    
    try {
      // Instead of parsing local storage, we'll fetch from API
      return { isAuthenticated: true };
    } catch (error) {
      localStorage.removeItem('auth_token');
      return null;
    }
  },
  
  isAuthenticated: () => {
    const token = localStorage.getItem('auth_token');
    return !!token && !isTokenExpired(token);
  },
  
  isTokenExpired: () => {
    const token = localStorage.getItem('auth_token');
    if (!token) return true;
    return isTokenExpired(token);
  }
};

export default api;
