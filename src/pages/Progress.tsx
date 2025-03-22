
import React, { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import Navbar from '@/components/Navbar';
import ProgressChart, { ProgressDataPoint } from '@/components/ProgressChart';
import { Button } from '@/components/ui/button';
import { workoutService } from '@/services/workoutService';
import { goalService, Goal } from '@/services/goalService';
import { format, subDays, isAfter, parseISO } from 'date-fns';
import GoalCard from '@/components/GoalCard';
import AdvancedAnalytics from '@/components/AdvancedAnalytics';
import AddGoalDialog from '@/components/AddGoalDialog';
import { Calendar, TrendingUp, Target } from 'lucide-react';

const Progress: React.FC = () => {
  const [workoutData, setWorkoutData] = useState<ProgressDataPoint[]>([]);
  const [calorieData, setCalorieData] = useState<ProgressDataPoint[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [dateRange, setDateRange] = useState<'7days' | '30days'>('7days');
  const [filteredWorkouts, setFilteredWorkouts] = useState<any[]>([]);
  const { toast } = useToast();

  // Fetch workout data and goals
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        
        // Fetch workouts and goals concurrently
        const [workouts, fetchedGoals] = await Promise.all([
          workoutService.getWorkouts(),
          goalService.getGoals()
        ]);
        
        // Filter to completed workouts only
        const completedWorkouts = workouts.filter(w => w.completed);
        
        // Apply date filtering based on selected range
        const daysToFilter = dateRange === '7days' ? 7 : 30;
        const dateThreshold = subDays(new Date(), daysToFilter);
        
        const filteredWorkouts = completedWorkouts.filter(workout => {
          const workoutDate = parseISO(workout.date);
          return isAfter(workoutDate, dateThreshold);
        });
        
        setFilteredWorkouts(filteredWorkouts);
        
        // Group workouts by date
        const workoutsByDate = filteredWorkouts.reduce((acc, workout) => {
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
        
        // Create chart data for selected range
        const workoutChartData: ProgressDataPoint[] = [];
        const calorieChartData: ProgressDataPoint[] = [];
        
        // Generate date points based on selected range
        for (let i = daysToFilter; i >= 0; i--) {
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
        setGoals(fetchedGoals);
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
    
    fetchData();
  }, [toast, dateRange]);

  // Handle refreshing goals after a goal is added
  const handleGoalAdded = async () => {
    try {
      const fetchedGoals = await goalService.getGoals();
      setGoals(fetchedGoals);
    } catch (error) {
      console.error('Failed to refresh goals:', error);
      toast({
        title: "Error refreshing goals",
        description: "Could not update your goals list. Please refresh the page.",
        variant: "destructive",
      });
    }
  };

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
          
          <div className="flex items-center gap-3">
            <div className="flex gap-2">
              <Button 
                variant={dateRange === '7days' ? 'default' : 'outline'}
                onClick={() => setDateRange('7days')}
                size="sm"
              >
                <Calendar className="w-4 h-4 mr-1" />
                Last 7 Days
              </Button>
              <Button 
                variant={dateRange === '30days' ? 'default' : 'outline'}
                onClick={() => setDateRange('30days')}
                size="sm"
              >
                <Calendar className="w-4 h-4 mr-1" />
                Last 30 Days
              </Button>
            </div>
            <AddGoalDialog onGoalAdded={handleGoalAdded} />
          </div>
        </header>
        
        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Loading your progress data...</p>
          </div>
        ) : (
          <>
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
            
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2 text-fitness-accent" />
                  Advanced Analytics
                </h2>
              </div>
              <AdvancedAnalytics 
                workouts={filteredWorkouts} 
                dateRange={dateRange === '7days' ? 'the last 7 days' : 'the last 30 days'} 
              />
            </div>
            
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold flex items-center">
                  <Target className="w-5 h-5 mr-2 text-fitness-accent" />
                  Fitness Goals
                </h2>
              </div>
              
              {goals.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {goals.map(goal => (
                    <GoalCard 
                      key={goal.id}
                      id={goal.id}
                      title={goal.title}
                      description={goal.description}
                      target={goal.target}
                      current={goal.current}
                      type={goal.type}
                      status={goal.status}
                      progress={goal.progress}
                      deadline={goal.deadline}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 glass-card rounded-2xl">
                  <p className="text-muted-foreground">You haven't set any goals yet.</p>
                  <p className="text-sm text-muted-foreground mt-2">Click "Add New Goal" to start tracking your progress.</p>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Progress;
