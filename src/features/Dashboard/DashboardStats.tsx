
import React from 'react';
import { Dumbbell, CalendarDays, Target, CheckCircle } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Workout, Goal } from '@/types';

interface DashboardStatsProps {
  workouts: Workout[];
  goals: Goal[];
}

const DashboardStats: React.FC<DashboardStatsProps> = ({ workouts, goals }) => {
  // Calculate stats for summary
  const totalWorkouts = workouts.length;
  const completedWorkouts = workouts.filter(w => w.completed).length;
  const totalDuration = workouts.reduce((sum, w) => sum + w.duration, 0);
  const totalGoals = goals.length;
  const completedGoals = goals.filter(g => g.current >= g.target).length;
  
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <Card className="border-none shadow-md bg-white/80 backdrop-blur-sm dark:bg-gray-800/50 hover:shadow-lg transition-shadow">
        <CardHeader className="p-4 pb-2">
          <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">Workouts</CardTitle>
        </CardHeader>
        <CardContent className="p-4 pt-0">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold">{totalWorkouts}</p>
              <p className="text-xs text-muted-foreground">{completedWorkouts} completed</p>
            </div>
            <div className="p-2 bg-indigo-100 rounded-full dark:bg-indigo-900/50">
              <Dumbbell className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card className="border-none shadow-md bg-white/80 backdrop-blur-sm dark:bg-gray-800/50 hover:shadow-lg transition-shadow">
        <CardHeader className="p-4 pb-2">
          <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Duration</CardTitle>
        </CardHeader>
        <CardContent className="p-4 pt-0">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold">{totalDuration} min</p>
              <p className="text-xs text-muted-foreground">This month</p>
            </div>
            <div className="p-2 bg-blue-100 rounded-full dark:bg-blue-900/50">
              <CalendarDays className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card className="border-none shadow-md bg-white/80 backdrop-blur-sm dark:bg-gray-800/50 hover:shadow-lg transition-shadow">
        <CardHeader className="p-4 pb-2">
          <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">Goals</CardTitle>
        </CardHeader>
        <CardContent className="p-4 pt-0">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold">{totalGoals}</p>
              <p className="text-xs text-muted-foreground">{completedGoals} achieved</p>
            </div>
            <div className="p-2 bg-amber-100 rounded-full dark:bg-amber-900/50">
              <Target className="h-5 w-5 text-amber-600 dark:text-amber-400" />
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card className="border-none shadow-md bg-white/80 backdrop-blur-sm dark:bg-gray-800/50 hover:shadow-lg transition-shadow">
        <CardHeader className="p-4 pb-2">
          <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">Streak</CardTitle>
        </CardHeader>
        <CardContent className="p-4 pt-0">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold">7 days</p>
              <p className="text-xs text-muted-foreground">Current streak</p>
            </div>
            <div className="p-2 bg-green-100 rounded-full dark:bg-green-900/50">
              <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardStats;
