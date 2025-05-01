
import apiClient from './apiClient';
import { toast } from 'sonner';
import { ProgressData } from '@/types';

/**
 * Service for managing fitness progress data
 */
export const progressService = {
  /**
   * Get progress data for a specific category
   */
  getProgress: async (category: string = 'weight'): Promise<ProgressData[]> => {
    try {
      const response = await apiClient.get(`/progress?category=${category}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching progress data:', error);
      throw error;
    }
  },
  
  /**
   * Add new progress data
   */
  addProgressData: async (progressData: Partial<ProgressData>): Promise<ProgressData> => {
    try {
      const response = await apiClient.post('/progress', progressData);
      toast.success('Progress data added successfully!');
      return response.data;
    } catch (error) {
      console.error('Error adding progress data:', error);
      throw error;
    }
  }
};

export default progressService;
