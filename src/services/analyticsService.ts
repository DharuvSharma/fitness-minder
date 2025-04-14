
import { Workout } from '@/types';
import { subDays, parseISO, isAfter } from 'date-fns';

export interface WorkoutAnalytics {
  totalWorkouts: number;
  totalDuration: number;
  totalCalories: number;
  avgDuration: number;
  avgCalories: number;
  mostFrequentType: string;
  frequencyByType: Record<string, number>;
  caloriesByType: Record<string, number>;
  workoutTrend: 'up' | 'down' | 'neutral';
  calorieTrend: 'up' | 'down' | 'neutral';
  trendPercentage: number;
}

export interface DateRangeParams {
  days: number;
  compareWithPrevious?: boolean;
}

export const analyticsService = {
  /**
   * Get filtered workouts based on date range
   */
  getFilteredWorkouts: (workouts: Workout[], days: number): Workout[] => {
    const dateThreshold = subDays(new Date(), days);
    
    return workouts.filter(workout => {
      const workoutDate = parseISO(workout.date);
      return isAfter(workoutDate, dateThreshold);
    });
  },
  
  /**
   * Get analytics for a specific date range
   */
  getAnalytics: (workouts: Workout[], { days, compareWithPrevious = false }: DateRangeParams): WorkoutAnalytics => {
    // Filter completed workouts for current period
    const completedWorkouts = workouts.filter(w => w.completed);
    const filteredWorkouts = analyticsService.getFilteredWorkouts(completedWorkouts, days);
    
    // Calculate basic metrics
    const totalWorkouts = filteredWorkouts.length;
    const totalDuration = filteredWorkouts.reduce((sum, w) => sum + w.duration, 0);
    const totalCalories = filteredWorkouts.reduce((sum, w) => sum + w.calories, 0);
    
    // Calculate averages
    const avgDuration = totalWorkouts > 0 ? Math.round(totalDuration / totalWorkouts) : 0;
    const avgCalories = totalWorkouts > 0 ? Math.round(totalCalories / totalWorkouts) : 0;
    
    // Count by workout type
    const workoutsByType = filteredWorkouts.reduce((acc, workout) => {
      acc[workout.type] = (acc[workout.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    // Calculate calories by type
    const caloriesByType = filteredWorkouts.reduce((acc, workout) => {
      acc[workout.type] = (acc[workout.type] || 0) + workout.calories;
      return acc;
    }, {} as Record<string, number>);
    
    // Get most frequent workout type
    let mostFrequentType = "none";
    let maxCount = 0;
    
    for (const [type, count] of Object.entries(workoutsByType)) {
      if (count > maxCount) {
        maxCount = count;
        mostFrequentType = type;
      }
    }
    
    // Calculate trends if needed
    let workoutTrend: 'up' | 'down' | 'neutral' = 'neutral';
    let calorieTrend: 'up' | 'down' | 'neutral' = 'neutral';
    let trendPercentage = 0;
    
    if (compareWithPrevious) {
      // Get previous period
      const previousStartDate = subDays(new Date(), days * 2);
      const previousEndDate = subDays(new Date(), days);
      
      const previousPeriodWorkouts = completedWorkouts.filter(workout => {
        const workoutDate = parseISO(workout.date);
        return isAfter(workoutDate, previousStartDate) && !isAfter(workoutDate, previousEndDate);
      });
      
      const previousWorkoutsCount = previousPeriodWorkouts.length;
      const previousCalories = previousPeriodWorkouts.reduce((sum, w) => sum + w.calories, 0);
      
      // Calculate workout trend
      if (previousWorkoutsCount > 0) {
        const workoutDiff = totalWorkouts - previousWorkoutsCount;
        trendPercentage = Math.round((workoutDiff / previousWorkoutsCount) * 100);
        
        if (workoutDiff > 0) {
          workoutTrend = 'up';
        } else if (workoutDiff < 0) {
          workoutTrend = 'down';
        }
      }
      
      // Calculate calorie trend
      if (previousCalories > 0) {
        const calorieDiff = totalCalories - previousCalories;
        
        if (calorieDiff > 0) {
          calorieTrend = 'up';
        } else if (calorieDiff < 0) {
          calorieTrend = 'down';
        }
      }
    }
    
    return {
      totalWorkouts,
      totalDuration,
      totalCalories,
      avgDuration,
      avgCalories,
      mostFrequentType,
      frequencyByType: workoutsByType,
      caloriesByType,
      workoutTrend,
      calorieTrend,
      trendPercentage,
    };
  }
};
