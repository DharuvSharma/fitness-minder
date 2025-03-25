
import axios from 'axios';
import { toast } from 'sonner';
import { jwtDecode } from 'jwt-decode';

/**
 * Create an axios instance with default configuration.
 * 
 * This instance:
 * - Has a base URL pointing to the backend API
 * - Sets default timeout and headers
 * - Will be used for all API requests
 */
const api = axios.create({
  // Update baseURL to point to the Spring Boot backend
  baseURL: 'http://localhost:8080/api', 
  timeout: 10000, // Request timeout in milliseconds
  headers: {
    'Content-Type': 'application/json',
  }
});

/**
 * Request interceptor for adding authentication token.
 * 
 * This interceptor:
 * - Runs before each request
 * - Adds the JWT token from localStorage to the Authorization header if available
 */
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

/**
 * Response interceptor for handling common errors.
 * 
 * This interceptor:
 * - Runs after each response or error
 * - Handles common HTTP errors with appropriate messages
 * - Handles authentication errors by redirecting to login
 */
api.interceptors.response.use(
  (response) => response, // Return successful responses unchanged
  (error) => {
    // Handle network errors
    if (!error.response) {
      console.error('Network Error:', error);
      toast.error('Network error, please try again later.');
      return Promise.reject(error);
    }
    
    // Handle specific HTTP status codes
    try {
      switch (error.response.status) {
        case 401:
          // Clear auth data and redirect to login
          localStorage.removeItem('auth_token');
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

/**
 * Function to check if JWT token is expired.
 * 
 * This function:
 * - Decodes the JWT token
 * - Checks if the expiration time is in the past
 * 
 * @param token The JWT token to check
 * @return True if token is expired, false otherwise
 */
const isTokenExpired = (token: string) => {
  try {
    const decoded: any = jwtDecode(token);
    return decoded.exp * 1000 < Date.now(); // Compare expiration timestamp with current time
  } catch (error) {
    return true; // If token can't be decoded, consider it expired
  }
};

// --- Authentication Service ---
export const authService = {
  /**
   * Authenticates a user with email and password.
   * 
   * This function:
   * 1. Sends login credentials to the backend
   * 2. Stores the JWT token on success
   * 3. Returns the user data
   * 
   * @param credentials User credentials (email, password)
   * @return User data on successful login
   */
  login: async (credentials: { email: string; password: string }) => {
    try {
      const response = await api.post('/auth/login', credentials);
      const { token, id, name, email } = response.data;
      
      // Store token in localStorage
      localStorage.setItem('auth_token', token);
      
      const user = { id, name, email };
      return user;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },
  
  /**
   * Registers a new user.
   * 
   * This function:
   * 1. Sends registration data to the backend
   * 2. Shows success message on completion
   * 
   * @param userData User registration data (name, email, password)
   * @return API response data
   */
  register: async (userData: { name: string; email: string; password: string }) => {
    try {
      const response = await api.post('/auth/register', userData);
      toast.success('Registration successful! Please sign in.');
      return response.data;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  },
  
  /**
   * Logs out the current user.
   * 
   * This function:
   * 1. Removes the JWT token from localStorage
   * 2. Redirects to the login page
   */
  logout: () => {
    localStorage.removeItem('auth_token');
    window.location.href = '/login';
  },
  
  /**
   * Fetches current user data from the API.
   * 
   * This function:
   * - Makes an authenticated request to get user information
   * 
   * @return Current user data
   */
  getCurrentUserData: async () => {
    try {
      const response = await api.get('/user/me');
      return response.data;
    } catch (error) {
      console.error('Error getting current user data:', error);
      throw error;
    }
  },
  
  /**
   * Checks if the user is authenticated.
   * 
   * This function:
   * - Verifies that a non-expired token exists
   * 
   * @return True if authenticated, false otherwise
   */
  isAuthenticated: () => {
    const token = localStorage.getItem('auth_token');
    return !!token && !isTokenExpired(token);
  },
  
  /**
   * Checks if the current token is expired.
   * 
   * This function:
   * - Gets the token from localStorage
   * - Checks if it's expired
   * 
   * @return True if token is expired or missing, false otherwise
   */
  isTokenExpired: () => {
    const token = localStorage.getItem('auth_token');
    if (!token) return true;
    return isTokenExpired(token);
  }
};

// Workout API functions
export const workoutApi = {
  getWorkouts: async () => {
    try {
      const response = await api.get('/workouts');
      return response.data;
    } catch (error) {
      console.error('Error fetching workouts:', error);
      throw error;
    }
  },
  
  getWorkoutsByDateRange: async (days: number) => {
    try {
      const response = await api.get(`/workouts/range?days=${days}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching workouts by date range:', error);
      throw error;
    }
  },
  
  getWorkoutById: async (id: string) => {
    try {
      const response = await api.get(`/workouts/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching workout details:', error);
      throw error;
    }
  },
  
  createWorkout: async (workout: any) => {
    try {
      const response = await api.post('/workouts', workout);
      toast.success('Workout added successfully!');
      return response.data;
    } catch (error) {
      console.error('Error creating workout:', error);
      throw error;
    }
  },
  
  updateWorkout: async (id: string, workout: any) => {
    try {
      const response = await api.put(`/workouts/${id}`, workout);
      toast.success('Workout updated successfully!');
      return response.data;
    } catch (error) {
      console.error('Error updating workout:', error);
      throw error;
    }
  },
  
  deleteWorkout: async (id: string) => {
    try {
      await api.delete(`/workouts/${id}`);
      toast.success('Workout deleted successfully!');
      return true;
    } catch (error) {
      console.error('Error deleting workout:', error);
      throw error;
    }
  },
  
  toggleWorkoutCompletion: async (id: string) => {
    try {
      const response = await api.put(`/workouts/${id}/toggle-completion`);
      return response.data;
    } catch (error) {
      console.error('Error toggling workout completion:', error);
      throw error;
    }
  }
};

// Goal API functions
export const goalApi = {
  getGoals: async () => {
    try {
      const response = await api.get('/goals');
      return response.data;
    } catch (error) {
      console.error('Error fetching goals:', error);
      throw error;
    }
  },
  
  getGoalById: async (id: string) => {
    try {
      const response = await api.get(`/goals/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching goal details:', error);
      throw error;
    }
  },
  
  createGoal: async (goal: any) => {
    try {
      const response = await api.post('/goals', goal);
      toast.success('Goal added successfully!');
      return response.data;
    } catch (error) {
      console.error('Error creating goal:', error);
      throw error;
    }
  },
  
  updateGoal: async (id: string, goal: any) => {
    try {
      const response = await api.put(`/goals/${id}`, goal);
      toast.success('Goal updated successfully!');
      return response.data;
    } catch (error) {
      console.error('Error updating goal:', error);
      throw error;
    }
  },
  
  deleteGoal: async (id: string) => {
    try {
      await api.delete(`/goals/${id}`);
      toast.success('Goal deleted successfully!');
      return true;
    } catch (error) {
      console.error('Error deleting goal:', error);
      throw error;
    }
  }
};

// Progress API functions
export const progressApi = {
  getProgress: async (category: string = 'weight') => {
    try {
      const response = await api.get(`/progress?category=${category}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching progress data:', error);
      throw error;
    }
  },
  
  addProgressData: async (progressData: any) => {
    try {
      const response = await api.post('/progress', progressData);
      toast.success('Progress data added successfully!');
      return response.data;
    } catch (error) {
      console.error('Error adding progress data:', error);
      throw error;
    }
  }
};

// Streak API functions
export const streakApi = {
  getUserStreak: async () => {
    try {
      const response = await api.get('/streaks');
      return response.data;
    } catch (error) {
      console.error('Error fetching user streak:', error);
      throw error;
    }
  }
};

export default api;
