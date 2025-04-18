import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { format, parseISO } from 'date-fns';
import { 
  ListFilter, 
  Plus, 
  Search, 
  Calendar as CalendarIcon,
  List,
  ArrowUpDown
} from 'lucide-react';
import { Workout } from '@/types';
import { useWorkouts } from '@/hooks/useWorkouts';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import WorkoutCard from '@/components/WorkoutCard';
import AddWorkoutForm from '@/components/AddWorkoutForm';
import EditWorkoutForm from '@/components/EditWorkoutForm';

const WorkoutHistory: React.FC = () => {
  const navigate = useNavigate();
  const { workouts, isLoading, addWorkout, updateWorkout, deleteWorkout } = useWorkouts(60);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [filter, setFilter] = useState<'all' | 'completed' | 'planned'>('all');
  const [isAddWorkoutOpen, setIsAddWorkoutOpen] = useState(false);
  const [isEditWorkoutOpen, setIsEditWorkoutOpen] = useState(false);
  const [selectedWorkout, setSelectedWorkout] = useState<Workout | null>(null);
  
  const sortedWorkouts = [...workouts].sort((a, b) => {
    const dateA = new Date(a.date).getTime();
    const dateB = new Date(b.date).getTime();
    return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
  });
  
  const filteredWorkouts = sortedWorkouts.filter(workout => {
    const searchTerm = searchQuery.toLowerCase();
    const titleMatch = workout.title.toLowerCase().includes(searchTerm);
    const typeMatch = workout.type.toLowerCase().includes(searchTerm);
    
    let filterMatch = true;
    if (filter === 'completed') {
      filterMatch = workout.completed;
    } else if (filter === 'planned') {
      filterMatch = !workout.completed;
    }
    
    return filterMatch && (titleMatch || typeMatch);
  });
  
  const handleAddWorkout = async (data: any) => {
    await addWorkout(data);
    setIsAddWorkoutOpen(false);
  };
  
  const handleEditWorkout = (workout: Workout) => {
    setSelectedWorkout(workout);
    setIsEditWorkoutOpen(true);
  };
  
  const handleEditSubmit = async (data: Partial<Workout>) => {
    if (selectedWorkout) {
      await updateWorkout(selectedWorkout.id, data);
      setIsEditWorkoutOpen(false);
      setSelectedWorkout(null);
    }
  };
  
  const handleDeleteWorkout = async (id: string) => {
    await deleteWorkout(id);
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 pb-20 md:pb-0">
      <div className="container mx-auto px-4 pt-6 animate-fade-in">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-50">
              Workout History
            </h1>
            <p className="text-muted-foreground">
              Review and manage your past workout activities
            </p>
          </div>
          
          <div className="flex gap-3">
            <Button 
              variant="outline" 
              className="flex items-center gap-2"
              onClick={() => navigate('/workout-calendar')}
            >
              <CalendarIcon className="h-4 w-4" />
              <span>Calendar View</span>
            </Button>
            <Button 
              className="bg-indigo-600 hover:bg-indigo-700"
              onClick={() => setIsAddWorkoutOpen(true)}
            >
              <Plus className="h-4 w-4 mr-2" />
              New Workout
            </Button>
          </div>
        </header>
        
        <Card className="mb-6">
          <CardHeader className="pb-0">
            <CardTitle>Filter & Sort</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
              <div className="flex items-center space-x-2">
                <Search className="h-4 w-4" />
                <Input
                  type="search"
                  placeholder="Search workouts..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              <Select value={filter} onValueChange={(value: 'all' | 'completed' | 'planned') => setFilter(value)}>
                <SelectTrigger className="w-full">
                  <ListFilter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Filter by Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Workouts</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="planned">Planned</SelectItem>
                </SelectContent>
              </Select>
              
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              >
                <ArrowUpDown className="h-4 w-4 mr-2" />
                Sort by Date ({sortOrder === 'asc' ? 'Asc' : 'Desc'})
              </Button>
            </div>
          </CardContent>
        </Card>
        
        <Tabs defaultValue="list" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="list" className="flex items-center gap-2">
              <List className="h-4 w-4" />
              List View
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="list" className="space-y-4">
            {isLoading ? (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                <p className="ml-3">Loading workouts...</p>
              </div>
            ) : filteredWorkouts.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No workouts found.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredWorkouts.map((workout) => (
                  <WorkoutCard 
                    key={workout.id} 
                    workout={workout} 
                    onEdit={() => handleEditWorkout(workout)}
                    onDelete={() => handleDeleteWorkout(workout.id)}
                  />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
      
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
          onSave={handleEditSubmit}
        />
      )}
    </div>
  );
};

export default WorkoutHistory;
