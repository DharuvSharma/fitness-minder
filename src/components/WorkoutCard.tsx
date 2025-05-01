
import React from 'react';
import { format } from 'date-fns';
import { Dumbbell, Calendar, Clock, Flame, Check, MoreVertical, Running, Yoga, Users, Activity } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { Workout, WorkoutType, Exercise } from '@/types';

interface WorkoutCardProps {
  workout: Workout;
  showActions?: boolean;
  onEdit?: (workout: Workout) => void;
  onDelete?: (id: string) => void;
  onToggleCompletion?: (id: string) => void;
}

const WorkoutCard: React.FC<WorkoutCardProps> = ({ 
  workout, 
  showActions = true,
  onEdit,
  onDelete,
  onToggleCompletion
}) => {
  const formattedDate = format(new Date(workout.date), 'MMM dd, yyyy');
  
  // Type icon mapping based on workout type
  const renderWorkoutTypeIcon = (type: WorkoutType) => {
    switch (type) {
      case 'cardio':
        return <Running className="h-4 w-4" />;
      case 'strength':
        return <Dumbbell className="h-4 w-4" />;
      case 'flexibility':
        return <Yoga className="h-4 w-4" />;
      case 'hiit':
        return <Activity className="h-4 w-4" />;
      case 'balance':
        return <Users className="h-4 w-4" />;
      default:
        return <Dumbbell className="h-4 w-4" />;
    }
  };
  
  // Type color mapping based on workout type
  const getWorkoutTypeColor = (type: WorkoutType): string => {
    const colorMap: Record<string, string> = {
      'cardio': 'bg-blue-100 text-blue-800',
      'strength': 'bg-red-100 text-red-800',
      'flexibility': 'bg-purple-100 text-purple-800',
      'hiit': 'bg-orange-100 text-orange-800',
      'balance': 'bg-green-100 text-green-800',
      'sport': 'bg-yellow-100 text-yellow-800',
      'custom': 'bg-gray-100 text-gray-800',
      'other': 'bg-teal-100 text-teal-800'
    };
    return colorMap[type] || colorMap['other'];
  };

  const handleEdit = () => {
    if (onEdit) onEdit(workout);
  };
  
  const handleDelete = () => {
    if (onDelete) onDelete(workout.id);
  };
  
  const handleToggleCompletion = () => {
    if (onToggleCompletion) onToggleCompletion(workout.id);
  };

  // Format exercises for display if they exist
  const renderExercises = () => {
    if (!workout.exercises) return null;
    
    // If exercises is a string, just display it
    if (typeof workout.exercises === 'string') {
      return workout.exercises;
    }
    
    // If it's an array of Exercise objects, format them nicely
    return (
      <ul className="list-disc pl-5 mt-2 text-sm">
        {workout.exercises.map((exercise, index) => (
          <li key={index}>
            {exercise.name} 
            {exercise.sets && exercise.reps && ` - ${exercise.sets} sets × ${exercise.reps} reps`}
            {exercise.weight && ` @ ${exercise.weight} lbs`}
          </li>
        ))}
      </ul>
    );
  };

  return (
    <Card className={`overflow-hidden transition-all hover:shadow-md ${workout.completed ? 'border-l-4 border-l-green-500' : ''}`}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <Badge className={`mb-2 ${getWorkoutTypeColor(workout.type)}`}>
              <span className="flex items-center">
                {renderWorkoutTypeIcon(workout.type)} 
                <span className="ml-1">{workout.type.charAt(0).toUpperCase() + workout.type.slice(1)}</span>
              </span>
            </Badge>
            <CardTitle className="text-lg">{workout.title}</CardTitle>
            <CardDescription className="text-sm text-gray-500 flex items-center">
              <Calendar className="h-3 w-3 mr-1" /> {formattedDate}
            </CardDescription>
          </div>
          
          {showActions && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={handleEdit}>Edit</DropdownMenuItem>
                <DropdownMenuItem onClick={handleToggleCompletion}>
                  {workout.completed ? "Mark as Incomplete" : "Mark as Complete"}
                </DropdownMenuItem>
                <DropdownMenuItem className="text-red-500" onClick={handleDelete}>Delete</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="pb-2">
        <div className="flex items-center space-x-4 text-sm">
          <div className="flex items-center">
            <Clock className="h-4 w-4 mr-1 text-gray-500" /> 
            <span>{workout.duration} min</span>
          </div>
          <div className="flex items-center">
            <Flame className="h-4 w-4 mr-1 text-orange-500" /> 
            <span>{workout.calories} cal</span>
          </div>
          {workout.completed && (
            <div className="flex items-center text-green-500">
              <Check className="h-4 w-4 mr-1" /> 
              <span>Completed</span>
            </div>
          )}
        </div>
        
        {workout.notes && (
          <div className="mt-3">
            <p className="text-sm text-gray-600">{workout.notes}</p>
          </div>
        )}
        
        {workout.exercises && (
          <div className="mt-2">
            <h4 className="text-sm font-medium">Exercises:</h4>
            <div className="text-sm text-gray-600">
              {renderExercises()}
            </div>
          </div>
        )}
      </CardContent>
      
      <CardFooter className="pt-2 flex justify-between">
        <Button 
          variant="ghost" 
          size="sm" 
          className={workout.completed ? "text-green-600" : "text-blue-600"}
          onClick={handleToggleCompletion}
        >
          {workout.completed ? (
            <>
              <Check className="h-4 w-4 mr-1" /> Completed
            </>
          ) : (
            "Mark Complete"
          )}
        </Button>
        
        {onEdit && (
          <Button variant="outline" size="sm" onClick={handleEdit}>
            Edit Details
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default WorkoutCard;
