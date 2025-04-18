import axios from 'axios';
import { toast } from 'sonner';

/**
 * Create an axios instance with default configuration.
 */
const api = axios.create({
  baseURL: '/api', // Use relative path for production compatibility
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Track rate limit status
let isRateLimited = false;
let rateLimitRetryTime = 0;

/**
 * Response interceptor for handling common errors.
 */
api.interceptors.response.use(
  (response) => {
    // Process rate limit headers if present
    const remainingRequests = response.headers['x-rate-limit-remaining'];
    if (remainingRequests && parseInt(remainingRequests) < 5) {
      console.warn(`Rate limit warning: ${remainingRequests} requests remaining`);
    }
    return response;
  },
  (error) => {
    if (!error.response) {
      console.error('Network Error:', error);
      toast.error('Network error, please try again later.');
      return Promise.reject(error);
    }
    
    try {
      // Handle rate limiting errors
      if (error.response.status === 429) {
        const retryAfter = error.response.headers['x-rate-limit-retry-after-seconds'];
        const waitTime = retryAfter ? parseInt(retryAfter) : 60;
        
        isRateLimited = true;
        rateLimitRetryTime = Date.now() + (waitTime * 1000);
        
        toast.error(`Rate limit exceeded. Please try again in ${waitTime} seconds.`);
        
        // Set a timeout to reset the rate limit flag
        setTimeout(() => {
          isRateLimited = false;
        }, waitTime * 1000);
        
        return Promise.reject(error);
      }
      
      switch (error.response.status) {
        case 401:
          toast.error('Authentication required. Please log in again.');
          // Redirect to login page if necessary
          window.location.href = '/login';
          break;
        case 403:
          toast.error('You do not have permission to access this resource.');
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

// Add a request interceptor to check rate limit status before making requests
api.interceptors.request.use(
  (config) => {
    if (isRateLimited) {
      const waitTimeMs = rateLimitRetryTime - Date.now();
      if (waitTimeMs > 0) {
        // If still rate limited, reject the request
        const waitTimeSec = Math.ceil(waitTimeMs / 1000);
        toast.error(`Rate limit active. Please wait ${waitTimeSec} seconds.`);
        return Promise.reject(new Error('Rate limited'));
      } else {
        // If rate limit time passed, reset the flag
        isRateLimited = false;
      }
    }

    // Add auth token from localStorage if available
    const token = localStorage.getItem('fitness_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

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

// Auth API functions
export const authApi = {
  login: async (credentials) => {
    try {
      const response = await axios.post('/api/auth/login', credentials);
      const { token, user } = response.data;
      
      // Store token and user data
      localStorage.setItem('fitness_token', token);
      localStorage.setItem('fitness_user', JSON.stringify(user));
      
      return { token, user };
    } catch (error) {
      console.error('Login failed:', error);
      const message = error.response?.data?.message || 'Login failed';
      toast.error(message);
      throw error;
    }
  },
  
  register: async (userData) => {
    try {
      const response = await axios.post('/api/auth/register', userData);
      toast.success('Registration successful! Please log in.');
      return response.data;
    } catch (error) {
      console.error('Registration failed:', error);
      const message = error.response?.data?.message || 'Registration failed';
      toast.error(message);
      throw error;
    }
  },
  
  logout: () => {
    localStorage.removeItem('fitness_token');
    localStorage.removeItem('fitness_user');
    window.location.href = '/login';
  },
  
  getCurrentUser: () => {
    const user = localStorage.getItem('fitness_user');
    return user ? JSON.parse(user) : null;
  }
};

export default api;
