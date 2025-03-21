
import React from 'react';
import { Dumbbell, Target, BarChart2, Plus, Calendar } from 'lucide-react';
import WorkoutCard, { WorkoutType } from '@/components/WorkoutCard';
import GoalCard, { GoalType, GoalStatus } from '@/components/GoalCard';
import ProgressChart from '@/components/ProgressChart';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/Navbar';

// Mock data for dashboard
const recentWorkouts = [
  {
    id: '1',
    title: 'Upper Body Strength',
    type: 'strength' as WorkoutType,
    duration: 45,
    calories: 320,
    exercises: 8,
    date: '2023-06-10',
    completed: true,
  },
  {
    id: '2',
    title: '5K Morning Run',
    type: 'cardio' as WorkoutType,
    duration: 28,
    calories: 250,
    exercises: 1,
    date: '2023-06-08',
    completed: true,
  },
];

const upcomingWorkouts = [
  {
    id: '3',
    title: 'HIIT Circuit',
    type: 'hiit' as WorkoutType,
    duration: 30,
    calories: 400,
    exercises: 6,
    date: '2023-06-12',
    completed: false,
  },
];

const goals = [
  {
    id: '1',
    title: 'Lose Weight',
    description: 'Reduce body weight through consistent training and proper nutrition',
    target: '70 kg',
    current: '75 kg',
    type: 'weight' as GoalType,
    status: 'in-progress' as GoalStatus,
    deadline: '2023-09-01',
    progress: 50,
  },
  {
    id: '2',
    title: 'Run 10K',
    description: 'Build endurance to complete a 10K run',
    target: '10 km',
    current: '7 km',
    type: 'endurance' as GoalType,
    status: 'in-progress' as GoalStatus,
    deadline: '2023-07-15',
    progress: 70,
  },
];

const progressData = [
  { date: 'May 1', value: 75 },
  { date: 'May 5', value: 74 },
  { date: 'May 10', value: 74 },
  { date: 'May 15', value: 73 },
  { date: 'May 20', value: 72 },
  { date: 'May 25', value: 72 },
  { date: 'June 1', value: 71 },
  { date: 'June 5', value: 71 },
  { date: 'June 10', value: 70 },
];

const strengthData = [
  { date: 'May 1', value: 60 },
  { date: 'May 5', value: 62 },
  { date: 'May 10', value: 65 },
  { date: 'May 15', value: 65 },
  { date: 'May 20', value: 68 },
  { date: 'May 25', value: 70 },
  { date: 'June 1', value: 70 },
  { date: 'June 5', value: 72 },
  { date: 'June 10', value: 75 },
];

const Dashboard: React.FC = () => {
  return (
    <div className="min-h-screen bg-fitness-lightgray pb-20 md:pb-0 md:pt-20">
      <Navbar />
      
      <div className="fitness-container pt-4 animate-fade-in">
        <header className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back! Here's an overview of your fitness journey.
          </p>
        </header>
        
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Workouts Stat */}
          <div className="glass-card p-5 rounded-2xl animate-slide-up">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-fitness-accent/10 mr-3">
                <Dumbbell className="h-5 w-5 text-fitness-accent" />
              </div>
              <span className="text-sm text-muted-foreground">Total Workouts</span>
            </div>
            <div className="flex items-baseline">
              <span className="stat-value">42</span>
              <span className="ml-2 text-xs text-green-500">+3 this week</span>
            </div>
          </div>
          
          {/* Active Goals Stat */}
          <div className="glass-card p-5 rounded-2xl animate-slide-up" style={{ animationDelay: '100ms' }}>
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-fitness-mint/10 mr-3">
                <Target className="h-5 w-5 text-fitness-mint" />
              </div>
              <span className="text-sm text-muted-foreground">Active Goals</span>
            </div>
            <div className="flex items-baseline">
              <span className="stat-value">5</span>
              <span className="ml-2 text-xs text-green-500">2 close to completion</span>
            </div>
          </div>
          
          {/* Streak Stat */}
          <div className="glass-card p-5 rounded-2xl animate-slide-up" style={{ animationDelay: '200ms' }}>
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-blue-50 mr-3">
                <Calendar className="h-5 w-5 text-blue-500" />
              </div>
              <span className="text-sm text-muted-foreground">Current Streak</span>
            </div>
            <div className="flex items-baseline">
              <span className="stat-value">7 days</span>
              <span className="ml-2 text-xs text-green-500">Best: 14 days</span>
            </div>
          </div>
        </div>
        
        {/* Recent Workouts Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-5">
            <h2 className="section-title">Recent Workouts</h2>
            <Button size="sm" variant="outline" className="text-sm">
              <Plus className="h-4 w-4 mr-1" />
              Add Workout
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentWorkouts.map((workout) => (
              <WorkoutCard key={workout.id} {...workout} className="animate-scale-in" />
            ))}
            
            {upcomingWorkouts.map((workout) => (
              <WorkoutCard key={workout.id} {...workout} className="animate-scale-in" style={{ animationDelay: '100ms' }} />
            ))}
          </div>
        </div>
        
        {/* Progress Charts Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-5">
            <h2 className="section-title">Your Progress</h2>
            <Button size="sm" variant="outline" className="text-sm">
              <BarChart2 className="h-4 w-4 mr-1" />
              View All
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ProgressChart 
              data={progressData} 
              title="Weight Progress" 
              metric="Weight (kg)" 
              color="#61DAFB"
            />
            <ProgressChart 
              data={strengthData} 
              title="Strength Progress" 
              metric="Bench Press (kg)" 
              color="#4ECCA3"
            />
          </div>
        </div>
        
        {/* Current Goals Section */}
        <div>
          <div className="flex items-center justify-between mb-5">
            <h2 className="section-title">Current Goals</h2>
            <Button size="sm" variant="outline" className="text-sm">
              <Plus className="h-4 w-4 mr-1" />
              Add Goal
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {goals.map((goal, index) => (
              <GoalCard key={goal.id} {...goal} className="animate-scale-in" style={{ animationDelay: `${index * 100}ms` }} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
