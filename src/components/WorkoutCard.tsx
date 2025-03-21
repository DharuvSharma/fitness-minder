
import React from 'react';
import { cn } from '@/lib/utils';
import { Clock, Flame, Activity, ChevronRight, Check } from 'lucide-react';
import { workoutService } from '@/services/workoutService';
import { useToast } from '@/hooks/use-toast';

export type WorkoutType = 'strength' | 'cardio' | 'flexibility' | 'hiit';

export interface WorkoutCardProps extends React.HTMLAttributes<HTMLDivElement> {
  id: string;
  title: string;
  type: WorkoutType;
  duration: number; // in minutes
  calories: number;
  exercises: number;
  date: string;
  completed?: boolean;
  className?: string;
  style?: React.CSSProperties;
  onUpdate?: () => void; // Callback to refresh workout list after changes
}

const typeColors: Record<WorkoutType, string> = {
  strength: 'bg-blue-50 text-blue-600 border-blue-100',
  cardio: 'bg-red-50 text-red-600 border-red-100',
  flexibility: 'bg-purple-50 text-purple-600 border-purple-100',
  hiit: 'bg-orange-50 text-orange-600 border-orange-100',
};

const typeLabels: Record<WorkoutType, string> = {
  strength: 'Strength',
  cardio: 'Cardio',
  flexibility: 'Flexibility',
  hiit: 'HIIT',
};

const WorkoutCard: React.FC<WorkoutCardProps> = ({
  id,
  title,
  type,
  duration,
  calories,
  exercises,
  date,
  completed = false,
  className,
  style,
  onClick,
  onUpdate,
  ...props
}) => {
  const { toast } = useToast();
  const formattedDate = new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });

  const handleToggleComplete = async (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent the card's onClick from firing
    
    try {
      const updatedWorkout = await workoutService.toggleWorkoutCompletion(id);
      if (updatedWorkout) {
        toast({
          title: updatedWorkout.completed ? "Workout completed" : "Workout marked as incomplete",
          description: `${title} has been ${updatedWorkout.completed ? 'marked as complete' : 'marked as incomplete'}.`,
        });
        
        if (onUpdate) {
          onUpdate();
        }
      }
    } catch (error) {
      console.error('Error toggling workout completion:', error);
      toast({
        title: "Error",
        description: "Failed to update workout status. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div 
      className={cn(
        "glass-card relative overflow-hidden rounded-2xl p-5 hover-lift cursor-pointer",
        className
      )}
      style={style}
      onClick={onClick}
      {...props}
    >
      <div className="absolute top-3 right-3">
        <button
          className={cn(
            "w-6 h-6 rounded-full flex items-center justify-center transition-colors",
            completed ? "bg-fitness-mint" : "bg-gray-200 hover:bg-gray-300"
          )}
          onClick={handleToggleComplete}
          aria-label={completed ? "Mark as incomplete" : "Mark as complete"}
        >
          {completed && <Check className="w-3.5 h-3.5 text-white" />}
        </button>
      </div>
      
      <div className="flex items-start justify-between mb-4">
        <div>
          <span className={cn(
            "badge-pill text-xs inline-block mb-2 border",
            typeColors[type]
          )}>
            {typeLabels[type]}
          </span>
          <h3 className="text-lg font-medium text-foreground leading-tight">{title}</h3>
          <p className="text-xs text-muted-foreground mt-1">{formattedDate}</p>
        </div>
      </div>
      
      <div className="grid grid-cols-3 gap-2 mb-4">
        <div className="flex flex-col">
          <div className="flex items-center text-muted-foreground mb-1">
            <Clock className="w-3.5 h-3.5 mr-1.5" />
            <span className="text-xs">Time</span>
          </div>
          <span className="text-sm font-medium">{duration} min</span>
        </div>
        
        <div className="flex flex-col">
          <div className="flex items-center text-muted-foreground mb-1">
            <Flame className="w-3.5 h-3.5 mr-1.5" />
            <span className="text-xs">Calories</span>
          </div>
          <span className="text-sm font-medium">{calories}</span>
        </div>
        
        <div className="flex flex-col">
          <div className="flex items-center text-muted-foreground mb-1">
            <Activity className="w-3.5 h-3.5 mr-1.5" />
            <span className="text-xs">Exercises</span>
          </div>
          <span className="text-sm font-medium">{exercises}</span>
        </div>
      </div>
      
      <div className="flex justify-end">
        <button className="flex items-center text-xs font-medium text-fitness-accent transition-colors hover:text-fitness-black">
          <span>{completed ? "View Details" : "Start Workout"}</span>
          <ChevronRight className="w-4 h-4 ml-1" />
        </button>
      </div>
    </div>
  );
};

export default WorkoutCard;
