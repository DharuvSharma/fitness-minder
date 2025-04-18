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

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { workouts, isLoading, addWorkout, updateWorkout } = useWorkouts(7); // Load workouts for the last 7 days
  const [quote, setQuote] = useState({ text: '', author: '' });
  const [isAddingWorkout, setIsAddingWorkout] = useState(false);

  useEffect(() => {
    fetch('https://type.fit/api/quotes')
      .then(res => res.json())
      .then(data => {
        const randomIndex = Math.floor(Math.random() * data.length);
        setQuote(data[randomIndex]);
      })
      .catch(error => console.error("Failed to fetch quote:", error));
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

  return (
    <div className="min-h-screen bg-fitness-lightgray pb-20 md:pb-0">
      <div className="fitness-container pt-4 animate-fade-in">
        <header className="mb-6">
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Your fitness journey at a glance
          </p>
        </header>

        <DailyQuote quote={quote} />

        <DashboardStats workouts={workouts} isLoading={isLoading} />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <WorkoutAnalytics workouts={workouts} />
          <WorkoutReminder />
          <AchievementTracker workouts={workouts} />
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
