
import apiClient from './apiClient';
import { toast } from 'sonner';
import { Goal, GoalFormData, GoalType, GoalStatus } from '@/types';

/**
 * Service for managing fitness goals
 */
export const goalService = {
  /**
   * Get all goals for the authenticated user
   */
  getGoals: async (): Promise<Goal[]> => {
    try {
      const response = await apiClient.get('/goals');
      return response.data;
    } catch (error) {
      console.error('Error fetching goals:', error);
      throw error;
    }
  },
  
  /**
   * Get a specific goal by ID
   */
  getGoalById: async (id: string): Promise<Goal> => {
    try {
      const response = await apiClient.get(`/goals/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching goal details:', error);
      throw error;
    }
  },
  
  /**
   * Create a new goal
   */
  createGoal: async (goal: GoalFormData): Promise<Goal> => {
    try {
      const response = await apiClient.post('/goals', goal);
      toast.success('Goal added successfully!');
      return response.data;
    } catch (error) {
      console.error('Error creating goal:', error);
      throw error;
    }
  },
  
  /**
   * Update an existing goal
   */
  updateGoal: async (id: string, goal: Partial<Goal>): Promise<Goal> => {
    try {
      const response = await apiClient.put(`/goals/${id}`, goal);
      toast.success('Goal updated successfully!');
      return response.data;
    } catch (error) {
      console.error('Error updating goal:', error);
      throw error;
    }
  },
  
  /**
   * Delete a goal
   */
  deleteGoal: async (id: string): Promise<boolean> => {
    try {
      await apiClient.delete(`/goals/${id}`);
      toast.success('Goal deleted successfully!');
      return true;
    } catch (error) {
      console.error('Error deleting goal:', error);
      throw error;
    }
  },

  /**
   * Add a new goal (alias for createGoal for compatibility)
   */
  addGoal: async (goal: GoalFormData): Promise<Goal> => {
    return goalService.createGoal(goal);
  }
};

// Re-export types for convenience
export type { Goal, GoalFormData, GoalType, GoalStatus };

export default goalService;
