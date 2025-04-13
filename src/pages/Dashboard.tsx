
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  CalendarDays, 
  TrendingUp, 
  Trophy, 
  BarChart,
  Activity,
  Plus,
  User 
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

  return (
    <div className="min-h-screen bg-fitness-lightgray pb-20 md:pb-0 md:pt-20">
      <Navbar />
      
      <div className="fitness-container pt-4 animate-fade-in">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground">
              Welcome back! Here's an overview of your fitness journey.
            </p>
          </div>
          
          <div className="flex gap-3">
            <Button 
              variant="outline"
              onClick={() => setIsAddGoalOpen(true)}
              className="flex items-center gap-2"
            >
              <Trophy className="h-4 w-4" />
              <span>Add Goal</span>
            </Button>
            
            <Button 
              className="bg-fitness-accent hover:bg-fitness-accent/90"
              onClick={() => setIsAddWorkoutOpen(true)}
            >
              <Plus className="h-4 w-4 mr-2" />
              New Workout
            </Button>
          </div>
        </header>
        
        <Tabs defaultValue="overview" className="mb-6">
          <TabsList className="mb-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="profile">Profile</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="animate-fade-in">
            {/* Quick Stats - First Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <AdvancedAnalytics 
                workouts={recentWorkouts} 
                dateRange="the last 30 days" 
              />
            </div>
            
            {/* Second Row - Progress Chart and Goals */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="md:col-span-2">
                <ProgressChart 
                  data={progressData}
                  title="Workout Intensity"
                  metric="Intensity Level"
                  color="#61DAFB"
                />
              </div>
              
              <div className="md:col-span-1">
                <AchievementTracker 
                  goals={goals} 
                  onCreateGoal={() => setIsAddGoalOpen(true)}
                />
              </div>
            </div>
            
            {/* Third Row - Recent Workouts */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold flex items-center">
                  <Activity className="w-5 h-5 mr-2 text-[#61DAFB]" />
                  Recent Workouts
                </h2>
                <Button 
                  variant="ghost" 
                  onClick={() => navigate('/workouts')}
                  className="text-sm text-[#61DAFB] hover:text-[#61DAFB]/80"
                >
                  View All
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {isLoading ? (
                  <div className="col-span-4 text-center py-8">
                    <p className="text-muted-foreground">Loading workouts...</p>
                  </div>
                ) : recentWorkouts.length > 0 ? (
                  recentWorkouts.slice(0, 4).map((workout, index) => (
                    <WorkoutCard
                      key={workout.id}
                      {...workout}
                      className="animate-scale-in"
                      style={{ animationDelay: `${index * 50}ms` }}
                      onUpdate={handleWorkoutUpdate}
                    />
                  ))
                ) : (
                  <div className="col-span-4 text-center py-8">
                    <p className="text-muted-foreground">No recent workouts found.</p>
                    <Button 
                      variant="link" 
                      onClick={() => setIsAddWorkoutOpen(true)}
                      className="mt-2"
                    >
                      Add your first workout
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="analytics" className="animate-fade-in">
            <div className="grid grid-cols-1 gap-6">
              {/* Workout Analytics by Type */}
              <WorkoutAnalytics workouts={recentWorkouts} period="week" />
              
              {/* Visualize progress over time */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <ProgressChart 
                  data={progressData}
                  title="Calories Burned"
                  metric="Calories"
                  color="#ef4444"
                />
                
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
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="profile" className="animate-fade-in">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <UserProfile />
              
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-xl font-bold mb-4 flex items-center">
                  <User className="h-5 w-5 mr-2 text-[#61DAFB]" />
                  Account Settings
                </h2>
                <p className="text-gray-500 mb-4">
                  Manage your account settings, preferences, and data.
                </p>
                
                <div className="space-y-4">
                  <Button variant="outline" className="w-full justify-start" onClick={() => navigate('/profile')}>
                    Edit Profile
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    Connect Fitness Devices
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    Privacy Settings
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    Export Data
                  </Button>
                </div>
              </div>
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
