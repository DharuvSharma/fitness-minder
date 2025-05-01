
import apiClient from './apiClient';
import { toast } from 'sonner';
import { Workout, WorkoutFormData } from '@/types';

/**
 * Service for managing workout data
 */
export const workoutService = {
  /**
   * Get all workouts for the authenticated user
   */
  getWorkouts: async (): Promise<Workout[]> => {
    try {
      const response = await apiClient.get('/workouts');
      return response.data;
    } catch (error) {
      console.error('Error fetching workouts:', error);
      throw error;
    }
  },
  
  /**
   * Get workouts within a specified date range
   */
  getWorkoutsByDateRange: async (days: number): Promise<Workout[]> => {
    try {
      const response = await apiClient.get(`/workouts/range?days=${days}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching workouts by date range:', error);
      throw error;
    }
  },
  
  /**
   * Get a specific workout by ID
   */
  getWorkoutById: async (id: string): Promise<Workout> => {
    try {
      const response = await apiClient.get(`/workouts/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching workout details:', error);
      throw error;
    }
  },
  
  /**
   * Create a new workout
   */
  createWorkout: async (workout: WorkoutFormData): Promise<Workout> => {
    try {
      const response = await apiClient.post('/workouts', workout);
      toast.success('Workout added successfully!');
      return response.data;
    } catch (error) {
      console.error('Error creating workout:', error);
      throw error;
    }
  },
  
  /**
   * Update an existing workout
   */
  updateWorkout: async (id: string, workout: Partial<Workout>): Promise<Workout> => {
    try {
      const response = await apiClient.put(`/workouts/${id}`, workout);
      toast.success('Workout updated successfully!');
      return response.data;
    } catch (error) {
      console.error('Error updating workout:', error);
      throw error;
    }
  },
  
  /**
   * Delete a workout
   */
  deleteWorkout: async (id: string): Promise<boolean> => {
    try {
      await apiClient.delete(`/workouts/${id}`);
      toast.success('Workout deleted successfully!');
      return true;
    } catch (error) {
      console.error('Error deleting workout:', error);
      throw error;
    }
  },
  
  /**
   * Toggle the completion status of a workout
   */
  toggleWorkoutCompletion: async (id: string): Promise<Workout> => {
    try {
      const response = await apiClient.put(`/workouts/${id}/toggle-completion`);
      return response.data;
    } catch (error) {
      console.error('Error toggling workout completion:', error);
      throw error;
    }
  },

  /**
   * Add a new workout (alias for createWorkout for compatibility)
   */
  addWorkout: async (workout: WorkoutFormData): Promise<Workout> => {
    return workoutService.createWorkout(workout);
  }
};

export default workoutService;
