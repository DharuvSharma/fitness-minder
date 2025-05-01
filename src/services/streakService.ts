
import apiClient from './apiClient';
import { Streak } from '@/types';

/**
 * Service for managing user activity streaks
 */
export const streakService = {
  /**
   * Get the current user's streak information
   */
  getUserStreak: async (): Promise<Streak> => {
    try {
      const response = await apiClient.get('/streaks');
      return response.data;
    } catch (error) {
      console.error('Error fetching user streak:', error);
      throw error;
    }
  }
};

export default streakService;
