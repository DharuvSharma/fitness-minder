import React, { useState, useEffect } from 'react';
import { Plus, Search, Filter, Calendar, ChevronDown } from 'lucide-react';
import WorkoutCard, { WorkoutType } from '@/components/WorkoutCard';
import AddWorkoutForm from '@/components/AddWorkoutForm';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Navbar from '@/components/Navbar';
import { workoutService, Workout } from '@/services/workoutService';
import { useToast } from '@/hooks/use-toast';

const Workouts: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [isAddWorkoutOpen, setIsAddWorkoutOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  // Load workouts on component mount
  useEffect(() => {
    const fetchWorkouts = async () => {
      try {
        setIsLoading(true);
        const loadedWorkouts = await workoutService.getWorkouts();
        setWorkouts(loadedWorkouts);
      } catch (error) {
        console.error('Failed to load workouts:', error);
        toast({
          title: "Error loading workouts",
          description: "Could not fetch your workouts. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchWorkouts();
  }, [toast]);

  // Filter workouts based on search term
  const filteredWorkouts = workouts.filter(workout => 
    workout.title.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Group workouts by upcoming and completed
  const upcomingWorkouts = filteredWorkouts.filter(workout => !workout.completed);
  const completedWorkouts = filteredWorkouts.filter(workout => workout.completed);

  // Handler for adding a new workout
  const handleAddWorkout = async (workoutData: Omit<Workout, 'id' | 'completed'>) => {
    try {
      const newWorkout = await workoutService.addWorkout({
        ...workoutData,
        completed: false,
      });
      
      setWorkouts(prev => [newWorkout, ...prev]);
      
      toast({
        title: "Workout added",
        description: `"${newWorkout.title}" has been added to your workouts.`,
      });
    } catch (error) {
      console.error('Failed to add workout:', error);
      toast({
        title: "Error adding workout",
        description: "Could not save your workout. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Handler for refreshing the workout list
  const handleWorkoutUpdate = async () => {
    try {
      const refreshedWorkouts = await workoutService.getWorkouts();
      setWorkouts(refreshedWorkouts);
    } catch (error) {
      console.error('Failed to refresh workouts:', error);
    }
  };

  return (
    <div className="min-h-screen bg-fitness-lightgray pb-20 md:pb-0 md:pt-20">
      <Navbar />
      
      <div className="fitness-container pt-4 animate-fade-in">
        <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Workouts</h1>
            <p className="text-muted-foreground">
              Manage and track your workout routines.
            </p>
          </div>
          
          <Button 
            className="bg-fitness-accent hover:bg-fitness-accent/90"
            onClick={() => setIsAddWorkoutOpen(true)}
          >
            <Plus className="h-5 w-5 mr-2" />
            New Workout
          </Button>
        </header>
        
        {/* Search and filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search workouts..." 
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex gap-3">
            <Button variant="outline" className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              <span>Filter</span>
              <ChevronDown className="h-4 w-4" />
            </Button>
            
            <Button variant="outline" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>Date</span>
              <ChevronDown className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        {/* Tabs for workout status */}
        <Tabs defaultValue="all" className="mb-6">
          <TabsList className="mb-6">
            <TabsTrigger value="all">All Workouts</TabsTrigger>
            <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="animate-fade-in">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {isLoading ? (
                <div className="col-span-3 text-center py-12">
                  <p className="text-muted-foreground">Loading workouts...</p>
                </div>
              ) : filteredWorkouts.length > 0 ? (
                filteredWorkouts.map((workout, index) => (
                  <WorkoutCard 
                    key={workout.id} 
                    {...workout} 
                    className="animate-scale-in" 
                    style={{ animationDelay: `${index * 50}ms` }}
                    onUpdate={handleWorkoutUpdate}
                  />
                ))
              ) : (
                <div className="col-span-3 text-center py-12">
                  <p className="text-muted-foreground">No workouts found. Try adjusting your search.</p>
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="upcoming" className="animate-fade-in">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {isLoading ? (
                <div className="col-span-3 text-center py-12">
                  <p className="text-muted-foreground">Loading workouts...</p>
                </div>
              ) : upcomingWorkouts.length > 0 ? (
                upcomingWorkouts.map((workout, index) => (
                  <WorkoutCard 
                    key={workout.id} 
                    {...workout} 
                    className="animate-scale-in" 
                    style={{ animationDelay: `${index * 50}ms` }}
                    onUpdate={handleWorkoutUpdate}
                  />
                ))
              ) : (
                <div className="col-span-3 text-center py-12">
                  <p className="text-muted-foreground">No upcoming workouts found.</p>
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="completed" className="animate-fade-in">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {isLoading ? (
                <div className="col-span-3 text-center py-12">
                  <p className="text-muted-foreground">Loading workouts...</p>
                </div>
              ) : completedWorkouts.length > 0 ? (
                completedWorkouts.map((workout, index) => (
                  <WorkoutCard 
                    key={workout.id} 
                    {...workout} 
                    className="animate-scale-in" 
                    style={{ animationDelay: `${index * 50}ms` }}
                    onUpdate={handleWorkoutUpdate}
                  />
                ))
              ) : (
                <div className="col-span-3 text-center py-12">
                  <p className="text-muted-foreground">No completed workouts found.</p>
                </div>
              )}
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
    </div>
  );
};

export default Workouts;
