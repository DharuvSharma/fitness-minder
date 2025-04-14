
import React, { useState, useEffect, lazy, Suspense } from 'react';
import { Plus, Search, Filter, Calendar, ChevronDown } from 'lucide-react';
import WorkoutCard from '@/components/WorkoutCard';
import AddWorkoutForm from '@/components/AddWorkoutForm';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Navbar from '@/components/Navbar';
import { workoutService } from '@/services/workoutService';
import { Workout, WorkoutFormData } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { toast } from 'sonner';
import DailyQuote from '@/components/DailyQuote';
import WorkoutTimer from '@/components/WorkoutTimer';
import WorkoutReminder from '@/components/WorkoutReminder';

// Lazy load the EditWorkoutForm component
const EditWorkoutForm = lazy(() => import('@/components/EditWorkoutForm'));

const Workouts: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [isAddWorkoutOpen, setIsAddWorkoutOpen] = useState(false);
  const [isEditWorkoutOpen, setIsEditWorkoutOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedWorkout, setSelectedWorkout] = useState<Workout | null>(null);
  const [showTimer, setShowTimer] = useState(false);
  const [showReminders, setShowReminders] = useState(false);
  const { toast: uiToast } = useToast();

  // Load workouts on component mount
  useEffect(() => {
    const fetchWorkouts = async () => {
      try {
        setIsLoading(true);
        const loadedWorkouts = await workoutService.getWorkouts();
        // Ensure workouts is always an array
        setWorkouts(Array.isArray(loadedWorkouts) ? loadedWorkouts : []);
      } catch (error) {
        console.error('Failed to load workouts:', error);
        toast.error("Could not fetch your workouts. Please try again.");
        setWorkouts([]); // Set to empty array on error
      } finally {
        setIsLoading(false);
      }
    };

    fetchWorkouts();
  }, []);

  // Filter workouts based on search term - ensure we're working with an array
  const filteredWorkouts = Array.isArray(workouts) 
    ? workouts.filter(workout => 
        workout.title.toLowerCase().includes(searchTerm.toLowerCase()))
    : [];
  
  // Group workouts by upcoming and completed - ensure we're working with arrays
  const upcomingWorkouts = Array.isArray(filteredWorkouts)
    ? filteredWorkouts.filter(workout => !workout.completed)
    : [];
    
  const completedWorkouts = Array.isArray(filteredWorkouts)
    ? filteredWorkouts.filter(workout => workout.completed)
    : [];

  // Handler for adding a new workout
  const handleAddWorkout = async (workoutData: WorkoutFormData) => {
    try {
      const newWorkout = await workoutService.addWorkout({
        ...workoutData,
        completed: false,
      });
      
      // Update state with the new workout
      setWorkouts(prev => Array.isArray(prev) ? [newWorkout, ...prev] : [newWorkout]);
      
      toast.success(`"${newWorkout.title}" has been added to your workouts.`);
    } catch (error) {
      console.error('Failed to add workout:', error);
      toast.error("Could not save your workout. Please try again.");
    }
  };

  // Handler for refreshing the workout list
  const handleWorkoutUpdate = async () => {
    try {
      const refreshedWorkouts = await workoutService.getWorkouts();
      setWorkouts(Array.isArray(refreshedWorkouts) ? refreshedWorkouts : []);
    } catch (error) {
      console.error('Failed to refresh workouts:', error);
      toast.error("Failed to update workouts. Please try again.");
    }
  };

  const handleEditWorkout = (workout: Workout) => {
    setSelectedWorkout(workout);
    setIsEditWorkoutOpen(true);
  };

  const handleSaveEdit = async (updatedWorkout: Partial<Workout>) => {
    if (!selectedWorkout) return;
    
    try {
      await workoutService.updateWorkout(selectedWorkout.id, updatedWorkout);
      await handleWorkoutUpdate();
      setIsEditWorkoutOpen(false);
      toast.success('Workout updated successfully');
    } catch (error) {
      console.error('Failed to update workout:', error);
      toast.error('Failed to update workout');
    }
  };

  const handleDeleteWorkout = async (id: string) => {
    try {
      await workoutService.deleteWorkout(id);
      await handleWorkoutUpdate();
      toast.success('Workout deleted successfully');
    } catch (error) {
      console.error('Failed to delete workout:', error);
      toast.error('Failed to delete workout');
    }
  };

  const handleToggleComplete = async (id: string, completed: boolean) => {
    try {
      await workoutService.updateWorkout(id, { completed });
      await handleWorkoutUpdate();
      toast.success(`Workout marked as ${completed ? 'completed' : 'incomplete'}`);
    } catch (error) {
      console.error('Failed to update workout completion status:', error);
      toast.error('Failed to update workout status');
    }
  };

  const handleStartWorkout = (workout: Workout) => {
    setSelectedWorkout(workout);
    setShowTimer(true);
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
        
        {/* Daily Quote */}
        <DailyQuote className="mb-6" />
        
        {/* Timer if active */}
        {showTimer && selectedWorkout && (
          <div className="mb-6">
            <WorkoutTimer 
              initialTime={selectedWorkout.duration * 60} 
              workoutName={selectedWorkout.title} 
              onComplete={() => {
                setShowTimer(false);
                handleToggleComplete(selectedWorkout.id, true);
              }} 
            />
            <div className="text-center mt-2">
              <button 
                onClick={() => setShowTimer(false)} 
                className="text-sm text-muted-foreground underline"
              >
                Hide Timer
              </button>
            </div>
          </div>
        )}
        
        {/* Search and filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
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
            
            <Button 
              variant={showReminders ? "default" : "outline"}
              className="flex items-center gap-2"
              onClick={() => setShowReminders(!showReminders)}
            >
              <BellRing className="h-4 w-4" />
              <span>Reminders</span>
            </Button>
          </div>
        </div>
        
        {/* Reminders Panel */}
        {showReminders && (
          <div className="mb-6 animate-fade-in">
            <WorkoutReminder />
          </div>
        )}
        
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
                    workout={workout} 
                    className="animate-scale-in"
                    style={{ animationDelay: `${index * 50}ms` }}
                    onEdit={handleEditWorkout}
                    onDelete={handleDeleteWorkout}
                    onComplete={handleToggleComplete}
                    startButton={!workout.completed && (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="bg-green-50 border-green-200 text-green-700 hover:bg-green-100"
                        onClick={() => handleStartWorkout(workout)}
                      >
                        <Play className="h-4 w-4 mr-2" />
                        Start
                      </Button>
                    )}
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
                    workout={workout} 
                    className="animate-scale-in" 
                    style={{ animationDelay: `${index * 50}ms` }}
                    onUpdate={handleWorkoutUpdate}
                    onEdit={handleEditWorkout}
                    onDelete={handleDeleteWorkout}
                    onComplete={handleToggleComplete}
                    startButton={
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="bg-green-50 border-green-200 text-green-700 hover:bg-green-100"
                        onClick={() => handleStartWorkout(workout)}
                      >
                        <Play className="h-4 w-4 mr-2" />
                        Start
                      </Button>
                    }
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
                    workout={workout} 
                    className="animate-scale-in" 
                    style={{ animationDelay: `${index * 50}ms` }}
                    onUpdate={handleWorkoutUpdate}
                    onEdit={handleEditWorkout}
                    onDelete={handleDeleteWorkout}
                    onComplete={handleToggleComplete}
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
      
      {/* Edit Workout Form Dialog - Lazy loaded */}
      {isEditWorkoutOpen && selectedWorkout && (
        <Suspense fallback={<div>Loading...</div>}>
          <EditWorkoutForm 
            workout={selectedWorkout}
            open={isEditWorkoutOpen}
            onOpenChange={setIsEditWorkoutOpen}
            onSave={handleSaveEdit}
          />
        </Suspense>
      )}
    </div>
  );
};

export default Workouts;
