
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWorkouts } from '@/hooks/useWorkouts';
import { Workout } from '@/types';
import DailyQuote from '@/components/DailyQuote';
import DashboardStats from '@/features/Dashboard/DashboardStats';
import WorkoutAnalytics from '@/components/WorkoutAnalytics';
import WorkoutReminder from '@/components/WorkoutReminder';
import AchievementTracker from '@/components/AchievementTracker';
import RecentWorkouts from '@/features/Dashboard/RecentWorkouts';
import { goalService } from '@/services/goalService';
import { useEffect as useEffectHook } from 'react';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { workouts, isLoading, addWorkout, updateWorkout } = useWorkouts(7); // Load workouts for the last 7 days
  const [goals, setGoals] = useState([]);
  const [isAddingWorkout, setIsAddingWorkout] = useState(false);

  useEffect(() => {
    // Fetch goals when component mounts
    const fetchGoals = async () => {
      try {
        const fetchedGoals = await goalService.getGoals();
        setGoals(fetchedGoals);
      } catch (error) {
        console.error("Failed to fetch goals:", error);
      }
    };
    
    fetchGoals();
  }, []);

  const handleAddWorkout = () => {
    setIsAddingWorkout(true);
  };

  const handleSaveWorkout = async (workoutData: any) => {
    await addWorkout(workoutData);
    setIsAddingWorkout(false);
  };

  const handleUpdateWorkout = async (id: string, workoutData: Partial<Workout>) => {
    await updateWorkout(id, workoutData);
  };

  const handleCancelAddWorkout = () => {
    setIsAddingWorkout(false);
  };

  const handleViewHistory = () => {
    navigate('/workout-history');
  };

  const handleViewCalendar = () => {
    navigate('/workout-calendar');
  };

  const handleCreateGoal = () => {
    navigate('/goals');
  };

  return (
    <div className="min-h-screen bg-fitness-lightgray pb-20 md:pb-0">
      <div className="fitness-container pt-4 animate-fade-in">
        <header className="mb-6">
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Your fitness journey at a glance
          </p>
        </header>

        <DailyQuote className="mb-6" />

        <DashboardStats workouts={workouts} goals={goals} />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <WorkoutAnalytics workouts={workouts} />
          <WorkoutReminder />
          <AchievementTracker goals={goals} onCreateGoal={handleCreateGoal} />
        </div>

        <RecentWorkouts
          workouts={workouts}
          isLoading={isLoading}
          onUpdate={() => {
            return new Promise<Workout[]>((resolve) => {
              resolve(workouts);
            });
          }}
          onAddWorkout={handleAddWorkout}
          onViewHistory={handleViewHistory}
          onViewCalendar={handleViewCalendar}
        />
      </div>
    </div>
  );
};

export default Dashboard;
