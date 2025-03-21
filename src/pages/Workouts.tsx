
import React, { useState } from 'react';
import { Plus, Search, Filter, Calendar, ChevronDown } from 'lucide-react';
import WorkoutCard, { WorkoutType } from '@/components/WorkoutCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Navbar from '@/components/Navbar';

// Mock data for workouts
const workouts = [
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
  {
    id: '4',
    title: 'Lower Body Focus',
    type: 'strength' as WorkoutType,
    duration: 50,
    calories: 380,
    exercises: 7,
    date: '2023-06-05',
    completed: true,
  },
  {
    id: '5',
    title: 'Yoga and Stretching',
    type: 'flexibility' as WorkoutType,
    duration: 35,
    calories: 150,
    exercises: 12,
    date: '2023-06-07',
    completed: true,
  },
  {
    id: '6',
    title: 'Outdoor Cycling',
    type: 'cardio' as WorkoutType,
    duration: 60,
    calories: 450,
    exercises: 1,
    date: '2023-06-04',
    completed: true,
  },
  {
    id: '7',
    title: 'Full Body Workout',
    type: 'strength' as WorkoutType,
    duration: 55,
    calories: 420,
    exercises: 10,
    date: '2023-06-01',
    completed: true,
  },
  {
    id: '8',
    title: 'Sprint Intervals',
    type: 'hiit' as WorkoutType,
    duration: 25,
    calories: 320,
    exercises: 4,
    date: '2023-06-14',
    completed: false,
  },
];

const Workouts: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');

  // Filter workouts based on search term
  const filteredWorkouts = workouts.filter(workout => 
    workout.title.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Group workouts by upcoming and completed
  const upcomingWorkouts = filteredWorkouts.filter(workout => !workout.completed);
  const completedWorkouts = filteredWorkouts.filter(workout => workout.completed);

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
          
          <Button className="bg-fitness-accent hover:bg-fitness-accent/90">
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
              {filteredWorkouts.length > 0 ? (
                filteredWorkouts.map((workout, index) => (
                  <WorkoutCard 
                    key={workout.id} 
                    {...workout} 
                    className="animate-scale-in" 
                    style={{ animationDelay: `${index * 50}ms` }} 
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
              {upcomingWorkouts.length > 0 ? (
                upcomingWorkouts.map((workout, index) => (
                  <WorkoutCard 
                    key={workout.id} 
                    {...workout} 
                    className="animate-scale-in" 
                    style={{ animationDelay: `${index * 50}ms` }} 
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
              {completedWorkouts.length > 0 ? (
                completedWorkouts.map((workout, index) => (
                  <WorkoutCard 
                    key={workout.id} 
                    {...workout} 
                    className="animate-scale-in" 
                    style={{ animationDelay: `${index * 50}ms` }} 
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
    </div>
  );
};

export default Workouts;
