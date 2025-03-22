
import React, { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import Navbar from '@/components/Navbar';
import ProgressChart, { ProgressDataPoint } from '@/components/ProgressChart';
import { Button } from '@/components/ui/button';
import { workoutService } from '@/services/workoutService';
import { format, subDays } from 'date-fns';

const Progress: React.FC = () => {
  const [workoutData, setWorkoutData] = useState<ProgressDataPoint[]>([]);
  const [calorieData, setCalorieData] = useState<ProgressDataPoint[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchWorkoutData = async () => {
      try {
        setIsLoading(true);
        
        // Fetch workouts from API
        const workouts = await workoutService.getWorkouts();
        
        // Filter to completed workouts only
        const completedWorkouts = workouts.filter(w => w.completed);
        
        // Group workouts by date
        const workoutsByDate = completedWorkouts.reduce((acc, workout) => {
          const date = workout.date.substring(0, 10); // YYYY-MM-DD format
          
          if (!acc[date]) {
            acc[date] = {
              workouts: 0,
              calories: 0,
            };
          }
          
          acc[date].workouts += 1;
          acc[date].calories += workout.calories;
          
          return acc;
        }, {} as Record<string, { workouts: number, calories: number }>);
        
        // Create chart data for last 14 days
        const workoutChartData: ProgressDataPoint[] = [];
        const calorieChartData: ProgressDataPoint[] = [];
        
        // Generate last 14 days
        for (let i = 14; i >= 0; i--) {
          const date = format(subDays(new Date(), i), 'yyyy-MM-dd');
          const formattedDate = format(subDays(new Date(), i), 'MMM dd');
          
          workoutChartData.push({
            date: formattedDate,
            value: workoutsByDate[date]?.workouts || 0,
          });
          
          calorieChartData.push({
            date: formattedDate,
            value: workoutsByDate[date]?.calories || 0,
          });
        }
        
        setWorkoutData(workoutChartData);
        setCalorieData(calorieChartData);
      } catch (error) {
        console.error('Failed to load progress data:', error);
        toast({
          title: "Error loading progress data",
          description: "Could not fetch your progress data. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchWorkoutData();
  }, [toast]);

  return (
    <div className="min-h-screen bg-fitness-lightgray pb-20 md:pb-0 md:pt-20">
      <Navbar />
      
      <div className="fitness-container pt-4 animate-fade-in">
        <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Your Progress</h1>
            <p className="text-muted-foreground">
              Track your fitness journey over time
            </p>
          </div>
          
          <div className="flex gap-2">
            <Button variant="outline">Last 7 Days</Button>
            <Button>Last 30 Days</Button>
          </div>
        </header>
        
        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Loading your progress data...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <ProgressChart 
              data={workoutData}
              title="Workout Frequency"
              metric="Workouts"
              color="#61DAFB"
            />
            
            <ProgressChart 
              data={calorieData}
              title="Calories Burned"
              metric="Calories"
              color="#FF6B6B"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Progress;
