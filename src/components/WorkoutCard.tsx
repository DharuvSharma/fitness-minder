
import React from 'react';
import { cn } from '@/lib/utils';
import { Clock, Flame, Activity, ChevronRight } from 'lucide-react';

export type WorkoutType = 'strength' | 'cardio' | 'flexibility' | 'hiit';

export interface WorkoutCardProps {
  id: string;
  title: string;
  type: WorkoutType;
  duration: number; // in minutes
  calories: number;
  exercises: number;
  date: string;
  completed?: boolean;
  className?: string;
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
  title,
  type,
  duration,
  calories,
  exercises,
  date,
  completed = false,
  className,
}) => {
  const formattedDate = new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });

  return (
    <div 
      className={cn(
        "glass-card relative overflow-hidden rounded-2xl p-5 hover-lift",
        className
      )}
    >
      {completed && (
        <div className="absolute top-3 right-3">
          <div className="w-2.5 h-2.5 rounded-full bg-fitness-mint"></div>
        </div>
      )}
      
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
          <span>View Details</span>
          <ChevronRight className="w-4 h-4 ml-1" />
        </button>
      </div>
    </div>
  );
};

export default WorkoutCard;
