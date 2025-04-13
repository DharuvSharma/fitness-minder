
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  CalendarDays, 
  TrendingUp, 
  Trophy, 
  BarChart,
  Activity,
  Plus,
  User,
  Dumbbell,
  Target,
  Bell,
  CheckCircle
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import WorkoutCard from '@/components/WorkoutCard';
import ProgressChart from '@/components/ProgressChart';
import AdvancedAnalytics from '@/components/AdvancedAnalytics';
import AchievementTracker from '@/components/AchievementTracker';
import WorkoutAnalytics from '@/components/WorkoutAnalytics';
import UserProfile from '@/components/UserProfile';
import AddWorkoutForm from '@/components/AddWorkoutForm';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { toast } from 'sonner';
import { workoutService, Workout } from '@/services/workoutService';
import { goalService, Goal } from '@/services/goalService';
import { notificationService } from '@/services/notificationService';
import AddGoalDialog from '@/components/AddGoalDialog';

const Dashboard = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [recentWorkouts, setRecentWorkouts] = useState<Workout[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
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
    const fetchData = async () => {
      try {
        setIsLoading(true);
        
        // Fetch workouts for the last 30 days
        const workouts = await workoutService.getWorkoutsByDateRange(30);
        setRecentWorkouts(workouts);
        
        // Fetch user goals
        const userGoals = await goalService.getGoals();
        setGoals(userGoals);
        
        // Show welcome notification
        setTimeout(() => {
          notificationService.showLocalNotification(
            'Welcome to FitnessMinder', 
            'Track your workouts, set goals, and monitor your progress!',
            'system'
          );
        }, 2000);
        
      } catch (error) {
        console.error('Error loading dashboard data:', error);
        toast.error('Failed to load dashboard data. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  const handleWorkoutUpdate = async () => {
    try {
      const workouts = await workoutService.getWorkoutsByDateRange(30);
      setRecentWorkouts(workouts);
    } catch (error) {
      console.error('Error updating workouts:', error);
    }
  };
  
  const handleAddWorkout = async (workoutData: Omit<Workout, 'id' | 'completed'>) => {
    try {
      await workoutService.addWorkout({
        ...workoutData,
        completed: false,
      });
      
      // Refresh workouts after adding
      handleWorkoutUpdate();
      toast.success('Workout added successfully!');
      
      // Show notification
      notificationService.showLocalNotification(
        'New Workout Added', 
        `You've added a new ${workoutData.type} workout to your schedule.`,
        'workout'
      );
    } catch (error) {
      console.error('Failed to add workout:', error);
      toast.error('Could not add workout. Please try again.');
    }
  };
  
  const handleAddGoal = async (goalData: any) => {
    try {
      await goalService.addGoal(goalData);
      
      // Refresh goals after adding
      const updatedGoals = await goalService.getGoals();
      setGoals(updatedGoals);
      
      toast.success('Goal added successfully!');
      
      // Show notification
      notificationService.showLocalNotification(
        'New Goal Created', 
        `Keep up the good work! Your new fitness goal has been set.`,
        'goal'
      );
    } catch (error) {
      console.error('Failed to add goal:', error);
      toast.error('Could not add goal. Please try again.');
    }
  };

  // Calculate stats for summary
  const totalWorkouts = recentWorkouts.length;
  const completedWorkouts = recentWorkouts.filter(w => w.completed).length;
  const totalDuration = recentWorkouts.reduce((sum, w) => sum + w.duration, 0);
  const totalGoals = goals.length;
  const completedGoals = goals.filter(g => g.current >= g.target).length;

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
                  workouts={recentWorkouts} 
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
            <Card className="border-none shadow-md bg-white/80 backdrop-blur-sm dark:bg-gray-800/50">
              <CardHeader className="p-4 pb-0">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-xl font-semibold flex items-center">
                    <Activity className="w-5 h-5 mr-2 text-indigo-500" />
                    Recent Workouts
                  </CardTitle>
                  <Button 
                    variant="ghost" 
                    onClick={() => navigate('/workouts')}
                    className="text-sm text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300"
                  >
                    View All
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-4">
                {isLoading ? (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">Loading workouts...</p>
                  </div>
                ) : recentWorkouts.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {recentWorkouts.slice(0, 4).map((workout, index) => (
                      <WorkoutCard
                        key={workout.id}
                        {...workout}
                        className="animate-scale-in hover:shadow-md transition-all"
                        style={{ animationDelay: `${index * 50}ms` }}
                        onUpdate={handleWorkoutUpdate}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">No recent workouts found.</p>
                    <Button 
                      variant="link" 
                      onClick={() => setIsAddWorkoutOpen(true)}
                      className="mt-2 text-indigo-600 dark:text-indigo-400"
                    >
                      Add your first workout
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="analytics" className="animate-fade-in space-y-6">
            {/* Workout Analytics by Type */}
            <Card className="border-none shadow-md bg-white/80 backdrop-blur-sm dark:bg-gray-800/50">
              <CardHeader className="p-4 pb-0">
                <CardTitle className="text-xl font-semibold">Workout Analytics</CardTitle>
                <CardDescription>Breakdown by workout type</CardDescription>
              </CardHeader>
              <CardContent className="p-4">
                <WorkoutAnalytics workouts={recentWorkouts} period="week" />
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
                    {recentWorkouts.slice(0, 7).map((workout) => (
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
        onSave={handleAddWorkout}
      />
      
      {/* Add Goal Dialog */}
      <AddGoalDialog
        open={isAddGoalOpen}
        onOpenChange={setIsAddGoalOpen}
        onSave={handleAddGoal}
      />
    </div>
  );
};

export default Dashboard;
