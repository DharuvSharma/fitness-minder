
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import { getToken } from '@/utils/token-utils';
import { toast } from 'sonner';

/**
 * Create an API client with consistent configuration
 */
export const createApiClient = (baseConfig: AxiosRequestConfig = {}): AxiosInstance => {
  // Default config
  const defaultConfig: AxiosRequestConfig = {
    baseURL: import.meta.env.PROD ? '/api' : 'http://localhost:8080/api',
    timeout: 10000,
    headers: {
      'Content-Type': 'application/json',
    },
    ...baseConfig
  };

  const instance = axios.create(defaultConfig);

  // Track rate limit status
  let isRateLimited = false;
  let rateLimitRetryTime = 0;

  // Request interceptor
  instance.interceptors.request.use(
    (config) => {
      // Check rate limit status
      if (isRateLimited) {
        const waitTimeMs = rateLimitRetryTime - Date.now();
        if (waitTimeMs > 0) {
          const waitTimeSec = Math.ceil(waitTimeMs / 1000);
          toast.error(`Rate limit active. Please wait ${waitTimeSec} seconds.`);
          return Promise.reject(new Error('Rate limited'));
        } else {
          isRateLimited = false;
        }
      }

      // Add auth token
      const token = getToken();
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      
      return config;
    },
    (error) => Promise.reject(error)
  );

  // Response interceptor
  instance.interceptors.response.use(
    (response: AxiosResponse) => {
      // Process rate limit headers if present
      const remainingRequests = response.headers['x-rate-limit-remaining'];
      if (remainingRequests && parseInt(remainingRequests) < 5) {
        console.warn(`Rate limit warning: ${remainingRequests} requests remaining`);
      }
      return response;
    },
    (error: AxiosError) => {
      if (!error.response) {
        console.error('Network Error:', error);
        toast.error('Network error, please check your connection and try again.');
        return Promise.reject(error);
      }
      
      try {
        // Handle rate limiting errors
        if (error.response.status === 429) {
          const retryAfter = error.response.headers['x-rate-limit-retry-after-seconds'] as string;
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
            // Clear authentication if token is invalid
            localStorage.removeItem('fitness_token');
            localStorage.removeItem('fitness_user');
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
            const errorData = error.response.data as any;
            const message = errorData?.message || 'Something went wrong';
            toast.error(message);
        }
      } catch (e) {
        console.error('Error in error handling:', e);
        toast.error('An unexpected error occurred');
      }
      
      return Promise.reject(error);
    }
  );

  return instance;
};

// Create a default instance
const apiClient = createApiClient();

export default apiClient;
