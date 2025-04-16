import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Calendar as CalendarIcon, 
  Filter, 
  Search,
  ChevronDown,
  Trash2,
  Edit,
  Clock,
  BarChart3
} from 'lucide-react';
import { format, subDays, isAfter, parseISO } from 'date-fns';
import { useWorkouts } from '@/hooks/useWorkouts';
import { Workout, WorkoutType } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import EditWorkoutForm from '@/components/EditWorkoutForm';

const WorkoutHistory: React.FC = () => {
  const navigate = useNavigate();
  const { workouts, isLoading, deleteWorkout, updateWorkout } = useWorkouts(90); // Get 90 days of history
  const [filteredWorkouts, setFilteredWorkouts] = useState<Workout[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState<Date | undefined>(undefined);
  const [date, setDate] = React.useState<Date>();
  const [isEditWorkoutOpen, setIsEditWorkoutOpen] = useState(false);
  const [currentWorkout, setCurrentWorkout] = useState<Workout | null>(null);
  const [dateRange, setDateRange] = useState<number>(90);

  // Apply filters to workouts
  useEffect(() => {
    let result = [...workouts];
    
    // Apply search filter
    if (searchTerm) {
      result = result.filter(
        workout => workout.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Apply type filter
    if (typeFilter !== 'all') {
      result = result.filter(workout => workout.type === typeFilter);
    }
    
    // Apply date filter
    if (dateFilter) {
      const filterDate = format(dateFilter, 'yyyy-MM-dd');
      result = result.filter(workout => workout.date === filterDate);
    }

    // Apply date range filter
    if (dateRange) {
      const rangeDate = subDays(new Date(), dateRange);
      result = result.filter(workout => {
        const workoutDate = parseISO(workout.date);
        return isAfter(workoutDate, rangeDate);
      });
    }
    
    setFilteredWorkouts(result);
  }, [workouts, searchTerm, typeFilter, dateFilter, dateRange]);

  const handleDeleteWorkout = async (id: string) => {
    await deleteWorkout(id);
  };

  const handleEditWorkout = (workout: Workout) => {
    setCurrentWorkout(workout);
    setIsEditWorkoutOpen(true);
  };

  const handleEditSubmit = async (data: Partial<Workout>) => {
    if (currentWorkout) {
      await updateWorkout(currentWorkout.id, data);
      setIsEditWorkoutOpen(false);
      setCurrentWorkout(null);
    }
  };

  const resetFilters = () => {
    setSearchTerm('');
    setTypeFilter('all');
    setDateFilter(undefined);
    setDate(undefined);
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
              View and manage your past workouts
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
              onClick={() => navigate('/workouts')}
            >
              Add New Workout
            </Button>
          </div>
        </header>
        
        {/* Filters */}
        <Card className="mb-6">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">
              Filter Workouts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Search workouts..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <div className="flex flex-col md:flex-row gap-4">
                <Select 
                  value={typeFilter} 
                  onValueChange={setTypeFilter}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Workout Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="strength">Strength</SelectItem>
                    <SelectItem value="cardio">Cardio</SelectItem>
                    <SelectItem value="hiit">HIIT</SelectItem>
                    <SelectItem value="flexibility">Flexibility</SelectItem>
                    <SelectItem value="balance">Balance</SelectItem>
                  </SelectContent>
                </Select>
                
                <Select 
                  value={dateRange.toString()} 
                  onValueChange={(value) => setDateRange(Number(value))}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Date Range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="7">Last 7 Days</SelectItem>
                    <SelectItem value="30">Last 30 Days</SelectItem>
                    <SelectItem value="90">Last 90 Days</SelectItem>
                    <SelectItem value="365">Last Year</SelectItem>
                  </SelectContent>
                </Select>
                
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-[180px] justify-start text-left font-normal">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date ? format(date, 'PPP') : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={(newDate) => {
                        setDate(newDate);
                        setDateFilter(newDate);
                      }}
                      initialFocus
                      className="p-3 pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
                
                <Button variant="outline" onClick={resetFilters}>
                  Reset Filters
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Workout History Table */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>
              Your Workouts ({filteredWorkouts.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                <p className="mt-4 text-muted-foreground">Loading your workout history...</p>
              </div>
            ) : filteredWorkouts.length === 0 ? (
              <div className="text-center py-8">
                <BarChart3 className="mx-auto h-12 w-12 text-muted-foreground" />
                <p className="mt-4 text-lg">No workouts found</p>
                <p className="text-muted-foreground">Try adjusting your filters or add some workouts</p>
                <Button 
                  className="mt-4 bg-indigo-600 hover:bg-indigo-700"
                  onClick={() => navigate('/workouts')}
                >
                  Add Your First Workout
                </Button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Title</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead><Clock className="h-4 w-4" /></TableHead>
                      <TableHead>Calories</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredWorkouts.map((workout) => (
                      <TableRow key={workout.id}>
                        <TableCell>{format(new Date(workout.date), 'MMM d, yyyy')}</TableCell>
                        <TableCell className="font-medium">{workout.title}</TableCell>
                        <TableCell className="capitalize">{workout.type}</TableCell>
                        <TableCell>{workout.duration} min</TableCell>
                        <TableCell>{workout.calories}</TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            workout.completed 
                              ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' 
                              : 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400'
                          }`}>
                            {workout.completed ? 'Completed' : 'Planned'}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleEditWorkout(workout)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <Trash2 className="h-4 w-4 text-red-500" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    This will permanently delete the workout "{workout.title}". 
                                    This action cannot be undone.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction 
                                    className="bg-red-600 hover:bg-red-700"
                                    onClick={() => handleDeleteWorkout(workout.id)}
                                  >
                                    Delete
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      
      {/* Edit Workout Form */}
      {currentWorkout && (
        <EditWorkoutForm
          open={isEditWorkoutOpen}
          onOpenChange={setIsEditWorkoutOpen}
          workout={currentWorkout}
          onSave={handleEditSubmit}
        />
      )}
    </div>
  );
};

export default WorkoutHistory;
