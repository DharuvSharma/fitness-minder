
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  TrendingUp, 
  Trophy,
  Activity,
  Plus,
  User
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import ProgressChart from '@/components/ProgressChart';
import AdvancedAnalytics from '@/components/AdvancedAnalytics';
import AchievementTracker from '@/components/AchievementTracker';
import WorkoutAnalytics from '@/components/WorkoutAnalytics';
import UserProfile from '@/components/UserProfile';
import AddWorkoutForm from '@/components/AddWorkoutForm';
import AddGoalDialog from '@/components/AddGoalDialog';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { toast } from 'sonner';
import { notificationService } from '@/services/notificationService';
import { useWorkouts } from '@/hooks/useWorkouts';
import { useGoals } from '@/hooks/useGoals';
import DashboardStats from '@/features/Dashboard/DashboardStats';
import RecentWorkouts from '@/features/Dashboard/RecentWorkouts';

const Dashboard = () => {
  const navigate = useNavigate();
  const { workouts, isLoading, fetchWorkouts, addWorkout } = useWorkouts(30);
  const { goals, fetchGoals, addGoal } = useGoals();
  const [isAddWorkoutOpen, setIsAddWorkoutOpen] = useState(false);
  const [isAddGoalOpen, setIsAddGoalOpen] = useState(false);
  const [progressData, setProgressData] = useState([
    { date: '01/01', value: 120 },
    { date: '01/08', value: 150 },
    { date: '01/15', value: 170 },
    { date: '01/22', value: 180 },
    { date: '01/29', value: 220 },
    { date: '02/05', value: 240 },
    { date: '02/12', value: 250 },
  ]);
  
  useEffect(() => {
    // Show welcome notification
    setTimeout(() => {
      notificationService.showLocalNotification(
        'Welcome to FitnessMinder', 
        'Track your workouts, set goals, and monitor your progress!',
        'system'
      );
    }, 2000);
  }, []);
  
  const handleWorkoutSubmit = async (workoutData) => {
    await addWorkout(workoutData);
    setIsAddWorkoutOpen(false);
  };
  
  const handleGoalSubmit = async (goalData) => {
    await addGoal(goalData);
    setIsAddGoalOpen(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 pb-20 md:pb-0 md:pt-20">
      <Navbar />
      
      <div className="container mx-auto px-4 pt-6 animate-fade-in">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-blue-500 dark:from-indigo-400 dark:to-blue-300">
              Fitness Dashboard
            </h1>
            <p className="text-muted-foreground mt-1">
              Welcome back! Here's an overview of your fitness journey.
            </p>
          </div>
          
          <div className="flex gap-3">
            <Button 
              variant="outline"
              onClick={() => setIsAddGoalOpen(true)}
              className="flex items-center gap-2 border-indigo-200 hover:border-indigo-300 hover:bg-indigo-50 dark:border-indigo-800 dark:hover:border-indigo-700 dark:hover:bg-indigo-900/30"
            >
              <Trophy className="h-4 w-4 text-amber-500" />
              <span>Add Goal</span>
            </Button>
            
            <Button 
              className="bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-600 dark:hover:bg-indigo-700"
              onClick={() => setIsAddWorkoutOpen(true)}
            >
              <Plus className="h-4 w-4 mr-2" />
              New Workout
            </Button>
          </div>
        </header>
        
        {/* Quick Stats Cards */}
        <DashboardStats workouts={workouts} goals={goals} />
        
        <Tabs defaultValue="overview" className="mb-6">
          <TabsList className="mb-6 p-1 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg">
            <TabsTrigger 
              value="overview" 
              className="data-[state=active]:bg-white data-[state=active]:text-indigo-600 data-[state=active]:shadow dark:data-[state=active]:bg-gray-700 dark:data-[state=active]:text-indigo-400"
            >
              Overview
            </TabsTrigger>
            <TabsTrigger 
              value="analytics" 
              className="data-[state=active]:bg-white data-[state=active]:text-indigo-600 data-[state=active]:shadow dark:data-[state=active]:bg-gray-700 dark:data-[state=active]:text-indigo-400"
            >
              Analytics
            </TabsTrigger>
            <TabsTrigger 
              value="profile" 
              className="data-[state=active]:bg-white data-[state=active]:text-indigo-600 data-[state=active]:shadow dark:data-[state=active]:bg-gray-700 dark:data-[state=active]:text-indigo-400"
            >
              Profile
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="animate-fade-in space-y-6">
            {/* First Row - Analytics */}
            <Card className="border-none shadow-md bg-white/80 backdrop-blur-sm dark:bg-gray-800/50">
              <CardContent className="p-4">
                <AdvancedAnalytics 
                  workouts={workouts} 
                  dateRange="the last 30 days" 
                />
              </CardContent>
            </Card>
            
            {/* Second Row - Progress Chart and Goals */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="md:col-span-2 border-none shadow-md bg-white/80 backdrop-blur-sm dark:bg-gray-800/50">
                <CardHeader className="p-4 pb-0">
                  <CardTitle className="text-xl font-semibold">Workout Intensity</CardTitle>
                  <CardDescription>Your progress over time</CardDescription>
                </CardHeader>
                <CardContent className="p-4">
                  <ProgressChart 
                    data={progressData}
                    title="Workout Intensity"
                    metric="Intensity Level"
                    color="#6366f1"
                  />
                </CardContent>
              </Card>
              
              <Card className="md:col-span-1 border-none shadow-md bg-white/80 backdrop-blur-sm dark:bg-gray-800/50">
                <CardHeader className="p-4 pb-0">
                  <CardTitle className="text-xl font-semibold flex items-center">
                    <Trophy className="w-5 h-5 mr-2 text-amber-500" />
                    Goals & Achievements
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                  <AchievementTracker 
                    goals={goals} 
                    onCreateGoal={() => setIsAddGoalOpen(true)}
                  />
                </CardContent>
              </Card>
            </div>
            
            {/* Third Row - Recent Workouts */}
            <RecentWorkouts 
              workouts={workouts} 
              isLoading={isLoading} 
              onUpdate={fetchWorkouts} 
              onAddWorkout={() => setIsAddWorkoutOpen(true)} 
            />
          </TabsContent>
          
          <TabsContent value="analytics" className="animate-fade-in space-y-6">
            {/* Workout Analytics by Type */}
            <Card className="border-none shadow-md bg-white/80 backdrop-blur-sm dark:bg-gray-800/50">
              <CardHeader className="p-4 pb-0">
                <CardTitle className="text-xl font-semibold">Workout Analytics</CardTitle>
                <CardDescription>Breakdown by workout type</CardDescription>
              </CardHeader>
              <CardContent className="p-4">
                <WorkoutAnalytics workouts={workouts} period="week" />
              </CardContent>
            </Card>
            
            {/* Visualize progress over time */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="border-none shadow-md bg-white/80 backdrop-blur-sm dark:bg-gray-800/50">
                <CardHeader className="p-4 pb-0">
                  <CardTitle className="text-lg font-semibold">Calories Burned</CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                  <ProgressChart 
                    data={progressData}
                    title="Calories Burned"
                    metric="Calories"
                    color="#ef4444"
                  />
                </CardContent>
              </Card>
              
              <Card className="border-none shadow-md bg-white/80 backdrop-blur-sm dark:bg-gray-800/50">
                <CardHeader className="p-4 pb-0">
                  <CardTitle className="text-lg font-semibold">Workout Frequency</CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                  <ProgressChart 
                    data={[
                      { date: '01/01', value: 2 },
                      { date: '01/08', value: 3 },
                      { date: '01/15', value: 2 },
                      { date: '01/22', value: 4 },
                      { date: '01/29', value: 3 },
                      { date: '02/05', value: 5 },
                      { date: '02/12', value: 4 },
                    ]}
                    title="Workout Frequency"
                    metric="Workouts per Week"
                    color="#8b5cf6"
                  />
                </CardContent>
              </Card>
            </div>
            
            {/* Workout Summary Table */}
            <Card className="border-none shadow-md bg-white/80 backdrop-blur-sm dark:bg-gray-800/50">
              <CardHeader className="p-4 pb-0">
                <CardTitle className="text-xl font-semibold">Workout Summary</CardTitle>
                <CardDescription>Last 7 workouts</CardDescription>
              </CardHeader>
              <CardContent className="p-4">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Duration</TableHead>
                      <TableHead>Calories</TableHead>
                      <TableHead className="text-right">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {workouts.slice(0, 7).map((workout) => (
                      <TableRow key={workout.id}>
                        <TableCell>{new Date(workout.date).toLocaleDateString()}</TableCell>
                        <TableCell className="capitalize">{workout.type}</TableCell>
                        <TableCell>{workout.duration} min</TableCell>
                        <TableCell>{workout.calories}</TableCell>
                        <TableCell className="text-right">
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            workout.completed 
                              ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' 
                              : 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400'
                          }`}>
                            {workout.completed ? 'Completed' : 'Planned'}
                          </span>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="profile" className="animate-fade-in">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="border-none shadow-md bg-white/80 backdrop-blur-sm dark:bg-gray-800/50">
                <CardContent className="p-4">
                  <UserProfile />
                </CardContent>
              </Card>
              
              <Card className="border-none shadow-md bg-white/80 backdrop-blur-sm dark:bg-gray-800/50">
                <CardHeader className="p-4 pb-2">
                  <CardTitle className="text-xl font-semibold flex items-center">
                    <User className="h-5 w-5 mr-2 text-indigo-500" />
                    Account Settings
                  </CardTitle>
                  <CardDescription>
                    Manage your account settings, preferences, and data.
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-4 pt-2">
                  <div className="space-y-3">
                    <Button variant="outline" className="w-full justify-start hover:bg-indigo-50 dark:hover:bg-indigo-900/30" onClick={() => navigate('/profile')}>
                      Edit Profile
                    </Button>
                    <Button variant="outline" className="w-full justify-start hover:bg-indigo-50 dark:hover:bg-indigo-900/30">
                      Connect Fitness Devices
                    </Button>
                    <Button variant="outline" className="w-full justify-start hover:bg-indigo-50 dark:hover:bg-indigo-900/30">
                      Privacy Settings
                    </Button>
                    <Button variant="outline" className="w-full justify-start hover:bg-indigo-50 dark:hover:bg-indigo-900/30">
                      Export Data
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
      
      {/* Add Workout Form Dialog */}
      <AddWorkoutForm
        open={isAddWorkoutOpen}
        onOpenChange={setIsAddWorkoutOpen}
        onSave={handleWorkoutSubmit}
      />
      
      {/* Add Goal Dialog */}
      <AddGoalDialog
        open={isAddGoalOpen}
        onOpenChange={setIsAddGoalOpen}
        onSave={handleGoalSubmit}
      />
    </div>
  );
};

export default Dashboard;
