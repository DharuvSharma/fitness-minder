
import React from 'react';
import { cn } from '@/lib/utils';
import { Clock, Flame, Activity, ChevronRight, Check } from 'lucide-react';
import { format } from 'date-fns';

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
}

const typeConfig: Record<WorkoutType, { color: string, label: string }> = {
  strength: { color: 'bg-blue-50 text-blue-600', label: 'Strength' },
  cardio: { color: 'bg-red-50 text-red-600', label: 'Cardio' },
  flexibility: { color: 'bg-purple-50 text-purple-600', label: 'Flexibility' },
  hiit: { color: 'bg-orange-50 text-orange-600', label: 'HIIT' },
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
  ...props
}) => {
  const formattedDate = new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
  
  const workoutConfig = typeConfig[type];

  return (
    <div 
      className={cn(
        "bg-white rounded-xl shadow-sm p-5 hover:shadow-md transition-shadow",
        className
      )}
      {...props}
    >
      <div className="relative">
        <div className="absolute top-0 right-0">
          <div className={cn(
            "w-6 h-6 rounded-full flex items-center justify-center",
            completed ? "bg-green-500" : "bg-gray-200"
          )}>
            {completed && <Check className="w-3.5 h-3.5 text-white" />}
          </div>
        </div>
        
        <div className="mb-4">
          <span className={cn(
            "inline-block px-2.5 py-0.5 text-xs font-medium rounded-full mb-2",
            workoutConfig.color
          )}>
            {workoutConfig.label}
          </span>
          <h3 className="text-lg font-medium mb-1">{title}</h3>
          <p className="text-xs text-muted-foreground">{formattedDate}</p>
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
          <button className="flex items-center text-xs font-medium text-blue-500 hover:text-blue-700 transition-colors">
            <span>{completed ? "View Details" : "Start Workout"}</span>
            <ChevronRight className="w-4 h-4 ml-1" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default WorkoutCard;
