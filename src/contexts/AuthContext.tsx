
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authService } from '@/services/apiService';
import { toast } from 'sonner';

/**
 * Interface defining the structure of a user object.
 * Contains basic information about an authenticated user.
 */
interface User {
  id: string;
  name: string;
  email: string;
}

/**
 * Interface defining the shape of the authentication context.
 * Login removed, but maintaining overall structure for register and logout.
 */
interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  register: (userData: { name: string; email: string; password: string }) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

/**
 * Create the Authentication Context.
 */
const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * AuthProvider component that wraps the application and provides authentication state.
 * Login functionality removed, but maintaining state management for the app.
 */
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  /**
   * Function to fetch user data with the stored token.
   */
  const refreshUser = async () => {
    if (!authService.isAuthenticated()) {
      setUser(null);
      setIsLoading(false);
      return;
    }
    
    try {
      const userData = await authService.getCurrentUserData();
      setUser(userData);
    } catch (error) {
      console.error('Error fetching user data:', error);
      authService.logout();
      setUser(null);
      toast.error('Your session has expired. Please register again.');
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Effect hook to check authentication status on component mount.
   */
  useEffect(() => {
    refreshUser();
    
    const tokenCheckInterval = setInterval(() => {
      if (authService.isAuthenticated() && authService.isTokenExpired()) {
        toast.error('Your session has expired. Please register again.');
        authService.logout();
        setUser(null);
      }
    }, 60000);

    return () => clearInterval(tokenCheckInterval);
  }, []);

  /**
   * Function to handle user registration.
   */
  const register = async (userData: { name: string; email: string; password: string }) => {
    setIsLoading(true);
    try {
      await authService.register(userData);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Function to handle user logout.
   */
  const logout = () => {
    authService.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
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
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
