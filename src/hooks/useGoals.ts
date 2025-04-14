
import { useState, useEffect } from 'react';
import { goalService } from '@/services/goalService';
import { Goal, GoalFormData } from '@/types';
import { toast } from 'sonner';
import { notificationService } from '@/services/notificationService';

export const useGoals = () => {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchGoals = async () => {
    try {
      setIsLoading(true);
      const data = await goalService.getGoals();
      setGoals(data);
      return data;
    } catch (error) {
      console.error('Error fetching goals:', error);
      toast.error('Failed to load goal data. Please try again.');
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  const addGoal = async (goalData: GoalFormData) => {
    try {
      const newGoal = await goalService.addGoal(goalData);
      
      // Refresh goals after adding
      await fetchGoals();
      
      toast.success('Goal added successfully!');
      
      // Show notification
      notificationService.showLocalNotification(
        'New Goal Created', 
        `Keep up the good work! Your new fitness goal has been set.`,
        'goal'
      );
      
      return newGoal;
    } catch (error) {
      console.error('Failed to add goal:', error);
      toast.error('Could not add goal. Please try again.');
      throw error;
    }
  };

  const updateGoal = async (id: string, goalData: Partial<Goal>) => {
    try {
      const updatedGoal = await goalService.updateGoal(id, goalData);
      await fetchGoals(); // Refresh the list after update
      toast.success('Goal updated successfully!');
      return updatedGoal;
    } catch (error) {
      console.error('Failed to update goal:', error);
      toast.error('Could not update goal. Please try again.');
      throw error;
    }
  };

  const deleteGoal = async (id: string) => {
    try {
      await goalService.deleteGoal(id);
      await fetchGoals(); // Refresh the list after deletion
      toast.success('Goal deleted successfully!');
      return true;
    } catch (error) {
      console.error('Failed to delete goal:', error);
      toast.error('Could not delete goal. Please try again.');
      throw error;
    }
  };

  useEffect(() => {
    fetchGoals();
  }, []);

  return {
    goals,
    isLoading,
    fetchGoals,
    addGoal,
    updateGoal,
    deleteGoal
  };
};
