import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Dumbbell, Plus, ArrowRight, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useWorkouts } from '@/hooks/useWorkouts';
import WorkoutCard from '@/components/WorkoutCard';
import AddWorkoutForm from '@/components/AddWorkoutForm';
import EditWorkoutForm from '@/components/EditWorkoutForm';

const Workouts: React.FC = () => {
  const navigate = useNavigate();
  const { workouts, isLoading, addWorkout } = useWorkouts(30); // Load workouts for the last 30 days
  const [isAddWorkoutOpen, setIsAddWorkoutOpen] = useState(false);
  const [isEditWorkoutOpen, setIsEditWorkoutOpen] = useState(false);
  const [selectedWorkout, setSelectedWorkout] = useState(null);

  const handleAddWorkout = async (data: any) => {
    await addWorkout(data);
    setIsAddWorkoutOpen(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 pb-20 md:pb-0">
      <div className="container mx-auto px-4 pt-6 animate-fade-in">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-50">
              Workouts
            </h1>
            <p className="text-muted-foreground">
              Explore and manage your workout routines
            </p>
          </div>
          <Button 
            className="bg-indigo-600 hover:bg-indigo-700"
            onClick={() => setIsAddWorkoutOpen(true)}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Workout
          </Button>
        </header>
        
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="all">All Workouts</TabsTrigger>
            <TabsTrigger value="strength">Strength</TabsTrigger>
            <TabsTrigger value="cardio">Cardio</TabsTrigger>
            <TabsTrigger value="hiit">HIIT</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="space-y-4">
            {isLoading ? (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
                <p className="mt-4 text-muted-foreground">Loading workouts...</p>
              </div>
            ) : workouts.length === 0 ? (
              <Card className="w-full">
                <CardHeader>
                  <CardTitle>No Workouts Found</CardTitle>
                  <CardDescription>Add your first workout to start tracking your fitness journey.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-6">
                    <Button onClick={() => setIsAddWorkoutOpen(true)}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add New Workout
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {workouts.map((workout) => (
                  <WorkoutCard 
                    key={workout.id} 
                    workout={workout} 
                  />
                ))}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="strength">
            <p>Strength workouts will be displayed here.</p>
          </TabsContent>
          
          <TabsContent value="cardio">
            <p>Cardio workouts will be displayed here.</p>
          </TabsContent>
          
          <TabsContent value="hiit">
            <p>HIIT workouts will be displayed here.</p>
          </TabsContent>
        </Tabs>
        
        {/* Add Workout Form */}
        <AddWorkoutForm
          open={isAddWorkoutOpen}
          onOpenChange={setIsAddWorkoutOpen}
          onSave={handleAddWorkout}
        />
        
        {/* Edit Workout Form */}
        {selectedWorkout && (
          <EditWorkoutForm
            open={isEditWorkoutOpen}
            onOpenChange={setIsEditWorkoutOpen}
            workout={selectedWorkout}
            onSave={() => {}} // Add your edit save logic here
          />
        )}
      </div>
    </div>
  );
};

export default Workouts;
