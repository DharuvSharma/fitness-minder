
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authService } from '@/services/apiService';
import { toast } from 'sonner';

interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: { email: string; password: string }) => Promise<void>;
  register: (userData: { name: string; email: string; password: string }) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Function to fetch user data with the token
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
      // If we can't get user data with the token, the token might be invalid
      authService.logout();
      setUser(null);
      toast.error('Your session has expired. Please login again.');
    } finally {
      setIsLoading(false);
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

    return () => clearInterval(tokenCheckInterval);
  }, []);

  const login = async (credentials: { email: string; password: string }) => {
    setIsLoading(true);
    try {
      const loggedInUser = await authService.login(credentials);
      setUser(loggedInUser);
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: { name: string; email: string; password: string }) => {
    setIsLoading(true);
    try {
      await authService.register(userData);
    } finally {
      setIsLoading(false);
    }
  };

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

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
