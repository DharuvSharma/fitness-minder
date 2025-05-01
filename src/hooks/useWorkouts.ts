
import { useState, useEffect } from 'react';
import { workoutService } from '@/services/workoutService';
import { Workout, WorkoutFormData } from '@/types';
import { toast } from 'sonner';
import { notificationService } from '@/services/notificationService';

export const useWorkouts = (days = 30) => {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchWorkouts = async () => {
    try {
      setIsLoading(true);
      const data = await workoutService.getWorkoutsByDateRange(days);
      setWorkouts(data);
      return data;
    } catch (error) {
      console.error('Error fetching workouts:', error);
      toast.error('Failed to load workout data. Please try again.');
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  const addWorkout = async (workoutData: WorkoutFormData) => {
    try {
      // Make sure we have a completed field or default to false
      const workoutWithCompletion = {
        ...workoutData,
        completed: workoutData.completed !== undefined ? workoutData.completed : false,
      };
      
      const newWorkout = await workoutService.addWorkout(workoutWithCompletion);
      
      // Refresh workouts after adding
      await fetchWorkouts();
      toast.success('Workout added successfully!');
      
      // Show notification
      notificationService.showLocalNotification(
        'New Workout Added', 
        `You've added a new ${workoutData.type} workout to your schedule.`,
        'workout'
      );
      
      return newWorkout;
    } catch (error) {
      console.error('Failed to add workout:', error);
      toast.error('Could not add workout. Please try again.');
      throw error;
    }
  };

  const updateWorkout = async (id: string, workoutData: Partial<Workout>) => {
    try {
      const updatedWorkout = await workoutService.updateWorkout(id, workoutData);
      await fetchWorkouts(); // Refresh the list after update
      toast.success('Workout updated successfully!');
      return updatedWorkout;
    } catch (error) {
      console.error('Failed to update workout:', error);
      toast.error('Could not update workout. Please try again.');
      throw error;
    }
  };

  const deleteWorkout = async (id: string) => {
    try {
      await workoutService.deleteWorkout(id);
      await fetchWorkouts(); // Refresh the list after deletion
      toast.success('Workout deleted successfully!');
      return true;
    } catch (error) {
      console.error('Failed to delete workout:', error);
      toast.error('Could not delete workout. Please try again.');
      throw error;
    }
  };

  useEffect(() => {
    fetchWorkouts();
  }, [days]);

  return {
    workouts,
    isLoading,
    fetchWorkouts,
    addWorkout,
    updateWorkout,
    deleteWorkout
  };
};
