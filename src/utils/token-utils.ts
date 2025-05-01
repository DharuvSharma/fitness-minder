
/**
 * Utility functions for handling JWT tokens
 */

// Token storage keys
const TOKEN_KEY = 'fitness_token';
const USER_KEY = 'fitness_user';

// Get the stored token
export const getToken = (): string | null => {
  return localStorage.getItem(TOKEN_KEY);
};

// Set token in storage
export const setToken = (token: string): void => {
  localStorage.setItem(TOKEN_KEY, token);
};

// Remove token from storage
export const removeToken = (): void => {
  localStorage.removeItem(TOKEN_KEY);
};

// Get the stored user data
export const getUser = (): any | null => {
  const userJson = localStorage.getItem(USER_KEY);
  return userJson ? JSON.parse(userJson) : null;
};

// Set user data in storage
export const setUser = (user: any): void => {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
};

// Remove user data from storage
export const removeUser = (): void => {
  localStorage.removeItem(USER_KEY);
};

// Check if user is authenticated
export const isAuthenticated = (): boolean => {
  return !!getToken();
};

// Clear all auth data
export const clearAuthData = (): void => {
  removeToken();
  removeUser();
};
