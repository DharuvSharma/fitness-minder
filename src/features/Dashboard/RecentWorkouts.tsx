
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowRight, 
  RefreshCcw, 
  ListFilter, 
  Calendar 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import WorkoutCard from '@/components/WorkoutCard';
import { Workout } from '@/types';

interface RecentWorkoutsProps {
  workouts: Workout[];
  isLoading: boolean;
  onUpdate: () => Promise<Workout[]>;
  onAddWorkout: () => void;
  onViewHistory?: () => void;
  onViewCalendar?: () => void;
}

const RecentWorkouts: React.FC<RecentWorkoutsProps> = ({ 
  workouts, 
  isLoading, 
  onUpdate, 
  onAddWorkout,
  onViewHistory,
  onViewCalendar
}) => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState<'all' | 'completed' | 'planned'>('all');
  
  const filteredWorkouts = workouts.filter(workout => {
    if (filter === 'all') return true;
    if (filter === 'completed') return workout.completed;
    if (filter === 'planned') return !workout.completed;
    return true;
  }).slice(0, 5); // Show only the 5 most recent workouts
  
  const handleViewHistory = () => {
    if (onViewHistory) {
      onViewHistory();
    } else {
      navigate('/workout-history');
    }
  };
  
  const handleViewCalendar = () => {
    if (onViewCalendar) {
      onViewCalendar();
    } else {
      navigate('/workout-calendar');
    }
  };
  
  return (
    <Card className="border-none shadow-md bg-white/80 backdrop-blur-sm dark:bg-gray-800/50">
      <CardHeader className="p-4 pb-0">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl font-semibold">Recent Workouts</CardTitle>
            <CardDescription>Your most recent workout activities</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Select value={filter} onValueChange={(value: 'all' | 'completed' | 'planned') => setFilter(value)}>
              <SelectTrigger className="w-[140px] h-8">
                <ListFilter className="h-3.5 w-3.5 mr-2" />
                <SelectValue placeholder="Filter" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Workouts</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="planned">Planned</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="sm" onClick={() => onUpdate()}>
              <RefreshCcw className="h-3.5 w-3.5 mr-1" />
              Refresh
            </Button>
            <Button variant="outline" size="sm" onClick={handleViewCalendar}>
              <Calendar className="h-3.5 w-3.5 mr-1" />
              Calendar
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        {isLoading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
            <p className="mt-4 text-muted-foreground">Loading your workouts...</p>
          </div>
        ) : filteredWorkouts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No workouts found</p>
            <Button className="mt-4 bg-indigo-600 hover:bg-indigo-700" onClick={onAddWorkout}>
              Add Your First Workout
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
            {filteredWorkouts.map((workout) => (
              <WorkoutCard 
                key={workout.id} 
                workout={workout} 
              />
            ))}
          </div>
        )}
      </CardContent>
      <CardFooter className="p-4 pt-0 flex justify-between">
        <Button 
          variant="link" 
          className="px-0 text-indigo-600" 
          onClick={handleViewHistory}
        >
          View All Workouts
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
        <Button 
          variant="outline" 
          className="bg-indigo-50 border-indigo-200 text-indigo-700 hover:bg-indigo-100 dark:bg-indigo-900/20 dark:border-indigo-800 dark:text-indigo-400"
          onClick={onAddWorkout}
        >
          Add New Workout
        </Button>
      </CardFooter>
    </Card>
  );
};

export default RecentWorkouts;
