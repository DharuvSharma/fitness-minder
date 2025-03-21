
import React from 'react';
import { cn } from '@/lib/utils';
import { Target, CheckCircle, Circle } from 'lucide-react';

export type GoalStatus = 'in-progress' | 'completed' | 'not-started';
export type GoalType = 'weight' | 'strength' | 'endurance' | 'habit' | 'custom';

export interface GoalCardProps {
  id: string;
  title: string;
  description: string;
  target: string | number;
  current: string | number;
  type: GoalType;
  status: GoalStatus;
  deadline?: string;
  progress?: number; // 0-100
  className?: string;
}

const statusIcons: Record<GoalStatus, React.ReactNode> = {
  'completed': <CheckCircle className="w-5 h-5 text-fitness-mint" />,
  'in-progress': <Target className="w-5 h-5 text-fitness-accent" />,
  'not-started': <Circle className="w-5 h-5 text-muted-foreground" />,
};

const typeColors: Record<GoalType, string> = {
  weight: 'bg-blue-50 text-blue-600 border-blue-100',
  strength: 'bg-purple-50 text-purple-600 border-purple-100',
  endurance: 'bg-orange-50 text-orange-600 border-orange-100',
  habit: 'bg-green-50 text-green-600 border-green-100',
  custom: 'bg-gray-50 text-gray-600 border-gray-100',
};

const typeLabels: Record<GoalType, string> = {
  weight: 'Weight',
  strength: 'Strength',
  endurance: 'Endurance',
  habit: 'Habit',
  custom: 'Custom',
};

const GoalCard: React.FC<GoalCardProps> = ({
  title,
  description,
  target,
  current,
  type,
  status,
  deadline,
  progress = 0,
  className,
}) => {
  const formattedDeadline = deadline 
    ? new Date(deadline).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      })
    : null;

  return (
    <div 
      className={cn(
        "glass-card rounded-2xl p-5 hover-lift",
        className
      )}
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <span className={cn(
            "badge-pill text-xs inline-block mb-2 border",
            typeColors[type]
          )}>
            {typeLabels[type]}
          </span>
          <h3 className="text-lg font-medium text-foreground leading-tight">{title}</h3>
          <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{description}</p>
        </div>
        <div>
          {statusIcons[status]}
        </div>
      </div>
      
      <div className="mb-4">
        <div className="flex justify-between items-center mb-1.5">
          <span className="text-xs text-muted-foreground">Progress</span>
          <span className="text-xs font-medium">{progress}%</span>
        </div>
        <div className="w-full bg-muted rounded-full h-1.5">
          <div 
            className="bg-fitness-accent h-1.5 rounded-full transition-all duration-500 ease-in-out" 
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
      
      <div className="flex justify-between items-center">
        <div className="flex flex-col">
          <span className="text-xs text-muted-foreground">Current</span>
          <span className="text-sm font-medium">{current}</span>
        </div>
        
        <div className="h-6 border-r border-border/50"></div>
        
        <div className="flex flex-col">
          <span className="text-xs text-muted-foreground">Target</span>
          <span className="text-sm font-medium">{target}</span>
        </div>
        
        {formattedDeadline && (
          <>
            <div className="h-6 border-r border-border/50"></div>
            <div className="flex flex-col">
              <span className="text-xs text-muted-foreground">Deadline</span>
              <span className="text-sm font-medium">{formattedDeadline}</span>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default GoalCard;
