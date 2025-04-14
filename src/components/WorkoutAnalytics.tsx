import React from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend
} from 'recharts';
import { cn } from '@/lib/utils';
import { Workout } from '@/types';

interface WorkoutAnalyticsProps {
  workouts: Workout[];
  className?: string;
  period?: 'week' | 'month' | 'year';
}

const WorkoutAnalytics: React.FC<WorkoutAnalyticsProps> = ({ 
  workouts, 
  className,
  period = 'week' 
}) => {
  // Function to process workout data for analytics
  const processWorkoutData = (workouts: Workout[], period: 'week' | 'month' | 'year') => {
    if (!workouts || workouts.length === 0) {
      return [];
    }

    const now = new Date();
    let startDate = new Date();
    let format: (date: Date) => string;
    
    // Set start date and format based on period
    if (period === 'week') {
      startDate.setDate(now.getDate() - 7);
      format = (date) => date.toLocaleDateString('en-US', { weekday: 'short' });
    } else if (period === 'month') {
      startDate.setDate(now.getDate() - 30);
      format = (date) => `${date.getMonth() + 1}/${date.getDate()}`;
    } else {
      startDate.setFullYear(now.getFullYear() - 1);
      format = (date) => date.toLocaleDateString('en-US', { month: 'short' });
    }
    
    // Filter workouts in the selected period
    const filteredWorkouts = workouts.filter(workout => {
      const workoutDate = new Date(workout.date);
      return workoutDate >= startDate && workoutDate <= now;
    });
    
    // Group by workout type
    const workoutsByType: { [key: string]: any[] } = {
      strength: [],
      cardio: [],
      hiit: [],
      flexibility: []
    };
    
    filteredWorkouts.forEach(workout => {
      if (workout.type in workoutsByType) {
        workoutsByType[workout.type].push(workout);
      }
    });
    
    // Create data points for the chart
    let dataPoints: any[] = [];
    
    if (period === 'week') {
      // For week, show each day
      for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(now.getDate() - i);
        const dateStr = format(date);
        
        const dateData: any = { name: dateStr };
        
        Object.keys(workoutsByType).forEach(type => {
          const workoutsOnDay = workoutsByType[type].filter(w => {
            const wDate = new Date(w.date);
            return wDate.getDate() === date.getDate() && 
                   wDate.getMonth() === date.getMonth() &&
                   wDate.getFullYear() === date.getFullYear();
          });
          
          const duration = workoutsOnDay.reduce((sum, w) => sum + w.duration, 0);
          dateData[type] = duration;
        });
        
        dataPoints.push(dateData);
      }
    } else if (period === 'month') {
      // For month, group by week
      for (let i = 0; i < 4; i++) {
        const weekStart = new Date();
        weekStart.setDate(now.getDate() - (i + 1) * 7);
        const weekEnd = new Date();
        weekEnd.setDate(now.getDate() - i * 7);
        
        const weekLabel = `W${4-i}`;
        
        const weekData: any = { name: weekLabel };
        
        Object.keys(workoutsByType).forEach(type => {
          const workoutsInWeek = workoutsByType[type].filter(w => {
            const wDate = new Date(w.date);
            return wDate >= weekStart && wDate < weekEnd;
          });
          
          const duration = workoutsInWeek.reduce((sum, w) => sum + w.duration, 0);
          weekData[type] = duration;
        });
        
        dataPoints.push(weekData);
      }
      // Reverse to show chronological order
      dataPoints = dataPoints.reverse();
    }
    
    return dataPoints;
  };

  const data = processWorkoutData(workouts, period);
  
  // Color mapping for workout types
  const colors = {
    strength: '#3b82f6', // blue
    cardio: '#ef4444',   // red
    hiit: '#f97316',     // orange
    flexibility: '#8b5cf6' // purple
  };

  return (
    <div className={cn("glass-card rounded-xl p-5", className)}>
      <h3 className="font-semibold text-lg mb-4">Workout Duration by Type</h3>
      
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis label={{ value: 'Minutes', angle: -90, position: 'insideLeft' }} />
            <Tooltip />
            <Legend />
            <Bar dataKey="strength" name="Strength" fill={colors.strength} />
            <Bar dataKey="cardio" name="Cardio" fill={colors.cardio} />
            <Bar dataKey="hiit" name="HIIT" fill={colors.hiit} />
            <Bar dataKey="flexibility" name="Flexibility" fill={colors.flexibility} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default WorkoutAnalytics;
