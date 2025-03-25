import axios from 'axios';
import { toast } from 'sonner';
import { jwtDecode } from 'jwt-decode';

/**
 * Create an axios instance with default configuration.
 */
const api = axios.create({
  baseURL: 'http://localhost:8080/api', 
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  }
});

/**
 * Request interceptor for adding authentication token.
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
 */
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (!error.response) {
      console.error('Network Error:', error);
      toast.error('Network error, please try again later.');
      return Promise.reject(error);
    }
    
    try {
      switch (error.response.status) {
        case 401:
          localStorage.removeItem('auth_token');
          window.location.href = '/register';
          toast.error('Your session has expired. Please register again.');
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
 */
const isTokenExpired = (token: string) => {
  try {
    const decoded: any = jwtDecode(token);
    return decoded.exp * 1000 < Date.now();
  } catch (error) {
    return true;
  }
};

// --- Authentication Service ---
export const authService = {
  /**
   * Registers a new user.
   */
  register: async (userData: { name: string; email: string; password: string }) => {
    try {
      const response = await api.post('/auth/register', userData);
      toast.success('Registration successful!');
      return response.data;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  },
  
  /**
   * Logs out the current user.
   */
  logout: () => {
    localStorage.removeItem('auth_token');
    window.location.href = '/';
  },
  
  /**
   * Fetches current user data from the API.
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
   */
  isAuthenticated: () => {
    const token = localStorage.getItem('auth_token');
    return !!token && !isTokenExpired(token);
  },
  
  /**
   * Checks if the current token is expired.
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
