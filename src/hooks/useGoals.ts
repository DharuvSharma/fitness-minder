
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

  useEffect(() => {
    fetchGoals();
  }, []);

  return {
    goals,
    isLoading,
    fetchGoals,
    addGoal
  };
};
