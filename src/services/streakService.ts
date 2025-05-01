
import apiClient from './apiClient';

/**
 * Service for managing user activity streaks
 */
export const streakService = {
  /**
   * Get the current user's streak information
   */
  getUserStreak: async () => {
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
