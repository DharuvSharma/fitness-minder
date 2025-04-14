
import React from 'react';
import { Activity } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import WorkoutCard from '@/components/WorkoutCard';
import { Workout } from '@/types';

interface RecentWorkoutsProps {
  workouts: Workout[];
  isLoading: boolean;
  onUpdate: () => void;
  onAddWorkout: () => void;
}

const RecentWorkouts: React.FC<RecentWorkoutsProps> = ({ 
  workouts, 
  isLoading, 
  onUpdate, 
  onAddWorkout 
}) => {
  const navigate = useNavigate();
  
  return (
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
        ) : workouts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {workouts.slice(0, 4).map((workout, index) => (
              <WorkoutCard
                key={workout.id}
                {...workout}
                className="animate-scale-in hover:shadow-md transition-all"
                style={{ animationDelay: `${index * 50}ms` }}
                onUpdate={onUpdate}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No recent workouts found.</p>
            <Button 
              variant="link" 
              onClick={onAddWorkout}
              className="mt-2 text-indigo-600 dark:text-indigo-400"
            >
              Add your first workout
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RecentWorkouts;
