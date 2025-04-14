import React from 'react';
import { Activity } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import WorkoutCard from '@/components/WorkoutCard';
import { Workout } from '@/types';
import { motion } from 'framer-motion';
import { Skeleton } from '@/components/ui/skeleton';

interface RecentWorkoutsProps {
  workouts: Workout[];
  isLoading: boolean;
  onUpdate: () => void;
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
  
  // Animation variants for staggered animation
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };
  
  return (
    <Card className="border-none shadow-md bg-white/80 backdrop-blur-sm dark:bg-gray-800/50">
      <CardHeader className="p-4 pb-0">
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl font-semibold flex items-center">
            <Activity className="w-5 h-5 mr-2 text-indigo-500" />
            Recent Workouts
          </CardTitle>
          {onViewHistory && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={onViewHistory}
              className="ml-auto"
            >
              <ListFilter className="h-4 w-4 mr-2" />
              View History
            </Button>
          )}
          {onViewCalendar && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={onViewCalendar}
              className="ml-2"
            >
              <Calendar className="h-4 w-4 mr-2" />
              Calendar
            </Button>
          )}
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-32 rounded-lg" />
            ))}
          </div>
        ) : workouts.length > 0 ? (
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
            variants={container}
            initial="hidden"
            animate="show"
          >
            {workouts.slice(0, 4).map((workout) => (
              <motion.div key={workout.id} variants={item}>
                <WorkoutCard
                  {...workout}
                  onUpdate={onUpdate}
                />
              </motion.div>
            ))}
          </motion.div>
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
