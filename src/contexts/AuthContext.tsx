
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authService } from '@/services/apiService';
import { toast } from 'sonner';

/**
 * Interface defining the structure of a user object.
 * Contains basic information about an authenticated user.
 */
interface User {
  id: string;    // Unique identifier for the user
  name: string;  // User's display name
  email: string; // User's email address
}

/**
 * Interface defining the shape of the authentication context.
 * Contains all authentication-related state and functions.
 */
interface AuthContextType {
  user: User | null;                                                                   // Current user info or null if not logged in
  isAuthenticated: boolean;                                                            // Whether a user is currently authenticated
  isLoading: boolean;                                                                  // Whether authentication operations are in progress
  login: (credentials: { email: string; password: string }) => Promise<void>;          // Login function
  register: (userData: { name: string; email: string; password: string }) => Promise<void>; // Registration function
  logout: () => void;                                                                  // Logout function
  refreshUser: () => Promise<void>;                                                    // Function to refresh user data
}

/**
 * Create the Authentication Context.
 * Initially undefined, will be populated by AuthProvider.
 */
const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * AuthProvider component that wraps the application and provides authentication state.
 * 
 * This component:
 * 1. Manages authentication state (user, loading)
 * 2. Provides login, register, and logout functionality
 * 3. Handles token validation and expiration
 * 4. Refreshes user data when needed
 * 
 * @param children The components to be wrapped with authentication context
 */
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);       // State to store the current user
  const [isLoading, setIsLoading] = useState<boolean>(true); // State for loading status

  /**
   * Function to fetch user data with the stored token.
   * 
   * This function:
   * 1. Checks if a valid token exists
   * 2. If yes, fetches current user data from the API
   * 3. If no or error, clears the user state
   */
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

  /**
   * Effect hook to check authentication status on component mount.
   * 
   * This effect:
   * 1. Runs once when the component mounts
   * 2. Checks if the user is logged in
   * 3. Sets up an interval to periodically check token expiration
   */
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

  /**
   * Function to handle user login.
   * 
   * This function:
   * 1. Sets loading state
   * 2. Calls the login API service
   * 3. Updates user state on success
   * 
   * @param credentials The user's login credentials (email, password)
   */
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

  /**
   * Function to handle user registration.
   * 
   * This function:
   * 1. Sets loading state
   * 2. Calls the register API service
   * 
   * @param userData The user registration data (name, email, password)
   */
  const register = async (userData: { name: string; email: string; password: string }) => {
    setIsLoading(true);
    try {
      // Call the register API service
      await authService.register(userData);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Function to handle user logout.
   * 
   * This function:
   * 1. Calls the logout service to clear tokens
   * 2. Clears user state
   */
  const logout = () => {
    authService.logout();
    setUser(null);
  };

  /**
   * Provide the authentication context to children components.
   * 
   * Makes all auth state and functions available to the component tree.
   */
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

/**
 * Custom hook to use the authentication context.
 * 
 * This hook:
 * 1. Provides easy access to auth context
 * 2. Ensures context is used within an AuthProvider
 * 
 * @returns The authentication context
 * @throws Error if used outside of AuthProvider
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
