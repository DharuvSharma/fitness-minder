
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authService } from '@/services/apiService';
import { toast } from 'sonner';

// Define the User type for authenticated users
interface User {
  id: string;
  name: string;
  email: string;
}

// Define the shape of the authentication context
interface AuthContextType {
  user: User | null; // Current user info or null if not logged in
  isAuthenticated: boolean; // Whether a user is currently authenticated
  isLoading: boolean; // Whether authentication operations are in progress
  login: (credentials: { email: string; password: string }) => Promise<void>; // Login function
  register: (userData: { name: string; email: string; password: string }) => Promise<void>; // Registration function
  logout: () => void; // Logout function
  refreshUser: () => Promise<void>; // Function to refresh user data
}

// Create the context with undefined as initial value
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// AuthProvider component that wraps the application and provides authentication state
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null); // State to store the current user
  const [isLoading, setIsLoading] = useState<boolean>(true); // State for loading status

  // Function to fetch user data with the token
  const refreshUser = async () => {
    // If not authenticated, clear user and stop loading
    if (!authService.isAuthenticated()) {
      setUser(null);
      setIsLoading(false);
      return;
    }
    
    try {
      // Fetch current user data from the API
      const userData = await authService.getCurrentUserData();
      setUser(userData);
    } catch (error) {
      console.error('Error fetching user data:', error);
      // If we can't get user data with the token, the token might be invalid
      authService.logout();
      setUser(null);
      toast.error('Your session has expired. Please login again.');
    } finally {
      setIsLoading(false); // Stop loading regardless of outcome
    }
  };

  useEffect(() => {
    // Check if user is logged in on component mount
    refreshUser();
    
    // Set up an interval to check token expiration
    const tokenCheckInterval = setInterval(() => {
      if (authService.isAuthenticated() && authService.isTokenExpired()) {
        toast.error('Your session has expired. Please login again.');
        authService.logout();
        setUser(null);
      }
    }, 60000); // Check every minute

    // Clean up interval on component unmount
    return () => clearInterval(tokenCheckInterval);
  }, []);

  // Function to handle user login
  const login = async (credentials: { email: string; password: string }) => {
    setIsLoading(true);
    try {
      // Call the login API service
      const loggedInUser = await authService.login(credentials);
      setUser(loggedInUser);
    } finally {
      setIsLoading(false);
    }
  };

  // Function to handle user registration
  const register = async (userData: { name: string; email: string; password: string }) => {
    setIsLoading(true);
    try {
      // Call the register API service
      await authService.register(userData);
    } finally {
      setIsLoading(false);
    }
  };

  // Function to handle user logout
  const logout = () => {
    authService.logout();
    setUser(null);
  };

  // Provide the authentication context to children components
  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user, // Convert user object to boolean
        isLoading,
        login,
        register,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the authentication context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
