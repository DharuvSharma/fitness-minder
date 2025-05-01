
export * from './goal';
export * from './workout';
export * from './progress';

export interface User {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  preferences?: UserPreferences;
}

export interface UserPreferences {
  theme?: 'light' | 'dark' | 'system';
  notifications?: boolean;
  weekStartsOn?: 0 | 1 | 2 | 3 | 4 | 5 | 6; // 0 is Sunday, 1 is Monday, etc.
  measurementUnit?: 'imperial' | 'metric';
}

export interface Streak {
  current: number;
  longest: number;
  lastActive: string;
}
