
import React from 'react';
import { format } from 'date-fns';
import { 
  ActivityIcon, 
  ClockIcon, 
  FlameIcon, 
  CheckCircleIcon,
  EditIcon,
  Trash2Icon
} from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
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
import { Workout, WorkoutType } from '@/types';

interface WorkoutCardProps {
  workout: Workout;
  onEdit?: (workout: Workout) => void;
  onDelete?: (id: string) => void;
  onComplete?: (id: string, completed: boolean) => void;
  onUpdate?: () => Promise<void>;
  startButton?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

const WorkoutCard: React.FC<WorkoutCardProps> = ({ 
  workout, 
  onEdit, 
  onDelete,
  onComplete,
  onUpdate,
  startButton,
  className = '',
  style
}) => {
  const { id, title, type, duration, calories, date, completed, notes } = workout;
  
  // Get background color based on workout type
  const getTypeColor = (type: WorkoutType) => {
    switch (type) {
      case 'strength':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
      case 'cardio':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
      case 'hiit':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300';
      case 'flexibility':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
      case 'balance':
        return 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
    }
  };

  const handleCompleteToggle = () => {
    if (onComplete) {
      onComplete(id, !completed);
    }
  };

  return (
    <Card 
      className={`border-l-4 transition-all ${
        completed ? 'border-l-green-500' : 'border-l-amber-500'
      } hover:shadow-md ${className}`}
      style={style}
    >
      <CardHeader className="p-4 pb-0">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-semibold text-lg tracking-tight">{title}</h3>
            <p className="text-sm text-muted-foreground">{format(new Date(date), 'EEEE, MMMM d, yyyy')}</p>
          </div>
          <div className="flex flex-col items-end">
            <span className={`px-2 py-1 rounded-full text-xs capitalize ${getTypeColor(type)}`}>
              {type}
            </span>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-4 pt-2">
        <div className="flex flex-wrap gap-3 mt-1">
          <div className="flex items-center text-sm">
            <ClockIcon className="h-4 w-4 mr-1 text-muted-foreground" />
            <span>{duration} min</span>
          </div>
          <div className="flex items-center text-sm">
            <FlameIcon className="h-4 w-4 mr-1 text-red-500" />
            <span>{calories} cal</span>
          </div>
          <div className="flex items-center text-sm">
            <ActivityIcon className="h-4 w-4 mr-1 text-indigo-500" />
            <span>{workout.exercises || '—'}</span>
          </div>
        </div>
        
        {notes && (
          <div className="mt-3 text-sm text-muted-foreground">
            <p>{notes}</p>
          </div>
        )}
      </CardContent>
      
      <CardFooter className="p-3 pt-0 flex justify-between">
        <div className="flex gap-2">
          {startButton}
          
          {!startButton && (
            <Button
              variant="outline"
              size="sm"
              className={`${
                completed 
                  ? 'bg-green-50 border-green-200 text-green-700 hover:bg-green-100 dark:bg-green-900/20 dark:border-green-800 dark:text-green-400' 
                  : 'bg-amber-50 border-amber-200 text-amber-700 hover:bg-amber-100 dark:bg-amber-900/20 dark:border-amber-800 dark:text-amber-400'
              }`}
              onClick={handleCompleteToggle}
            >
              <CheckCircleIcon className="h-4 w-4 mr-2" />
              {completed ? 'Completed' : 'Mark Complete'}
            </Button>
          )}
        </div>
        
        <div className="flex gap-2">
          {onEdit && (
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => onEdit(workout)}
            >
              <EditIcon className="h-4 w-4" />
            </Button>
          )}
          
          {onDelete && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="ghost" size="sm">
                  <Trash2Icon className="h-4 w-4 text-red-500" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete Workout</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to delete this workout? This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction 
                    className="bg-red-600 text-white hover:bg-red-700"
                    onClick={() => onDelete(id)}
                  >
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </div>
      </CardFooter>
    </Card>
  );
};

export default WorkoutCard;
