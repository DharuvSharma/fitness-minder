
import React from 'react';
import { Dumbbell, Target, Calendar, Plus, BarChart2, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import WorkoutCard, { WorkoutType } from '@/components/WorkoutCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Navbar from '@/components/Navbar';
import { Progress } from '@/components/ui/progress';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent
} from '@/components/ui/chart';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, CartesianGrid, Tooltip } from 'recharts';

// Mock data for dashboard - fixed types to use WorkoutType
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

const weightProgressData = [
  { date: 'May 1', value: 76 },
  { date: 'May 5', value: 75 },
  { date: 'May 10', value: 75 },
  { date: 'May 15', value: 74 },
  { date: 'May 20', value: 73 },
  { date: 'May 25', value: 72 },
  { date: 'June 1', value: 71 },
  { date: 'June 5', value: 70 },
  { date: 'June 10', value: 69 },
];

const strengthProgressData = [
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

const goals = [
  {
    id: '1',
    category: 'Weight',
    title: 'Lose Weight',
    description: 'Reduce body weight through consistent training and proper nutrition',
    current: '75 kg',
    target: '70 kg',
    progress: 50,
    deadline: 'Sep 1, 2023',
  },
  {
    id: '2',
    category: 'Endurance',
    title: 'Run 10K',
    description: 'Build endurance to complete a 10K run',
    current: '7 km',
    target: '10 km',
    progress: 70,
    deadline: 'Jul 15, 2023',
  },
];

const Dashboard: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#f5f5f7]">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pt-6 pb-24 md:pb-6">
        <header className="mb-8">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back! Here's an overview of your fitness journey.
          </p>
        </header>
        
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Workouts Stat */}
          <Card className="bg-white border-none shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center mb-3">
                <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-blue-50 mr-3">
                  <Dumbbell className="h-5 w-5 text-blue-500" />
                </div>
                <span className="text-sm text-muted-foreground">Total Workouts</span>
              </div>
              <div className="flex items-baseline">
                <span className="text-2xl font-semibold">42</span>
                <span className="ml-2 text-xs text-green-500">+3 this week</span>
              </div>
            </CardContent>
          </Card>
          
          {/* Active Goals Stat */}
          <Card className="bg-white border-none shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center mb-3">
                <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-green-50 mr-3">
                  <Target className="h-5 w-5 text-green-500" />
                </div>
                <span className="text-sm text-muted-foreground">Active Goals</span>
              </div>
              <div className="flex items-baseline">
                <span className="text-2xl font-semibold">5</span>
                <span className="ml-2 text-xs text-green-500">2 close to completion</span>
              </div>
            </CardContent>
          </Card>
          
          {/* Streak Stat */}
          <Card className="bg-white border-none shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center mb-3">
                <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-blue-50 mr-3">
                  <Calendar className="h-5 w-5 text-blue-500" />
                </div>
                <span className="text-sm text-muted-foreground">Current Streak</span>
              </div>
              <div className="flex items-baseline">
                <span className="text-2xl font-semibold">7 days</span>
                <span className="ml-2 text-xs text-green-500">Best: 14 days</span>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Recent Workouts Section */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-xl font-semibold">Recent Workouts</h2>
            <Button variant="outline" size="sm" className="gap-1">
              <Plus className="h-4 w-4" />
              Add Workout
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {recentWorkouts.map((workout) => (
              <WorkoutCard key={workout.id} {...workout} />
            ))}
          </div>
        </div>
        
        {/* Progress Charts Section */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-xl font-semibold">Your Progress</h2>
            <Button variant="outline" size="sm" className="gap-1">
              <BarChart2 className="h-4 w-4" />
              View All
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-white border-none shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Weight Progress</CardTitle>
                <p className="text-sm text-muted-foreground">Your weight (kg) over time</p>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] w-full">
                  <ChartContainer config={{ 
                    weight: { color: "#61DAFB" }
                  }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={weightProgressData}
                        margin={{ top: 5, right: 10, left: 10, bottom: 5 }}
                      >
                        <defs>
                          <linearGradient id="weightGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#61DAFB" stopOpacity={0.2}/>
                            <stop offset="95%" stopColor="#61DAFB" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                        <XAxis 
                          dataKey="date"
                          axisLine={false}
                          tickLine={false}
                          tick={{ fontSize: 12 }}
                        />
                        <YAxis 
                          domain={[40, 80]}
                          axisLine={false}
                          tickLine={false}
                          tick={{ fontSize: 12 }}
                        />
                        <Tooltip
                          content={({ active, payload }) => {
                            if (active && payload && payload.length) {
                              return (
                                <ChartTooltipContent
                                  active={active}
                                  payload={payload}
                                />
                              );
                            }
                            return null;
                          }}
                        />
                        <Line
                          type="monotone"
                          dataKey="value"
                          name="weight"
                          stroke="#61DAFB"
                          strokeWidth={2}
                          dot={{ r: 4, strokeWidth: 2 }}
                          activeDot={{ r: 6, strokeWidth: 2 }}
                          fill="url(#weightGradient)"
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-white border-none shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Strength Progress</CardTitle>
                <p className="text-sm text-muted-foreground">Your bench press (kg) over time</p>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] w-full">
                  <ChartContainer config={{
                    strength: { color: "#4ECCA3" }
                  }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={strengthProgressData}
                        margin={{ top: 5, right: 10, left: 10, bottom: 5 }}
                      >
                        <defs>
                          <linearGradient id="strengthGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#4ECCA3" stopOpacity={0.2}/>
                            <stop offset="95%" stopColor="#4ECCA3" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                        <XAxis 
                          dataKey="date"
                          axisLine={false}
                          tickLine={false}
                          tick={{ fontSize: 12 }}
                        />
                        <YAxis 
                          domain={[40, 80]}
                          axisLine={false}
                          tickLine={false}
                          tick={{ fontSize: 12 }}
                        />
                        <Tooltip
                          content={({ active, payload }) => {
                            if (active && payload && payload.length) {
                              return (
                                <ChartTooltipContent
                                  active={active}
                                  payload={payload}
                                />
                              );
                            }
                            return null;
                          }}
                        />
                        <Line
                          type="monotone"
                          dataKey="value"
                          name="strength"
                          stroke="#4ECCA3"
                          strokeWidth={2}
                          dot={{ r: 4, strokeWidth: 2 }}
                          activeDot={{ r: 6, strokeWidth: 2 }}
                          fill="url(#strengthGradient)"
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        
        {/* Current Goals Section */}
        <div>
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-xl font-semibold">Current Goals</h2>
            <Button variant="outline" size="sm" className="gap-1">
              <Plus className="h-4 w-4" />
              Add Goal
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {goals.map((goal) => (
              <Card key={goal.id} className="bg-white border-none shadow-sm overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <span className="inline-block px-2.5 py-0.5 text-xs font-medium rounded-full bg-blue-50 text-blue-600 mb-2">
                        {goal.category}
                      </span>
                      <h3 className="text-lg font-medium">{goal.title}</h3>
                      <p className="text-sm text-muted-foreground mb-4">{goal.description}</p>
                    </div>
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-50">
                      <Target className="h-4 w-4 text-blue-500" />
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <div className="flex justify-between mb-1.5 text-sm">
                      <span>Progress</span>
                      <span className="font-medium">{goal.progress}%</span>
                    </div>
                    <Progress value={goal.progress} className="h-2" />
                  </div>
                  
                  <div className="grid grid-cols-3 gap-2 text-sm">
                    <div>
                      <p className="text-muted-foreground mb-1">Current</p>
                      <p className="font-medium">{goal.current}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground mb-1">Target</p>
                      <p className="font-medium">{goal.target}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground mb-1">Deadline</p>
                      <p className="font-medium">{goal.deadline}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
