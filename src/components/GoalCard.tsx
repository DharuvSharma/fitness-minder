
import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { Target, CheckCircle, Circle, Trash2, Calendar, Edit, X, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { GoalStatus, GoalType, Goal } from '@/types/goal';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

export interface GoalCardProps extends Omit<Goal, 'createdAt'> {
  onComplete: () => void;
  onDelete: () => void;
  onProgressUpdate: (value: number) => void;
  className?: string;
  style?: React.CSSProperties;
}

const statusIcons: Record<GoalStatus, React.ReactNode> = {
  'completed': <CheckCircle className="w-5 h-5 text-green-500" />,
  'in-progress': <Target className="w-5 h-5 text-fitness-accent" />,
  'not-started': <Circle className="w-5 h-5 text-muted-foreground" />,
};

const typeColors: Record<GoalType, string> = {
  weight: 'bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-300',
  strength: 'bg-purple-50 text-purple-600 dark:bg-purple-900/30 dark:text-purple-300',
  endurance: 'bg-orange-50 text-orange-600 dark:bg-orange-900/30 dark:text-orange-300',
  habit: 'bg-green-50 text-green-600 dark:bg-green-900/30 dark:text-green-300',
  custom: 'bg-gray-50 text-gray-600 dark:bg-gray-900/30 dark:text-gray-300',
};

const typeLabels: Record<GoalType, string> = {
  weight: 'Weight',
  strength: 'Strength',
  endurance: 'Endurance',
  habit: 'Habit',
  custom: 'Custom',
};

const GoalCard: React.FC<GoalCardProps> = ({
  id,
  title,
  description,
  target,
  current,
  type,
  status,
  deadline,
  progress,
  onComplete,
  onDelete,
  onProgressUpdate,
  className,
  style,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [currentValue, setCurrentValue] = useState(current);
  
  const formattedDeadline = deadline 
    ? new Date(deadline).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      })
    : null;
  
  const handleSaveProgress = () => {
    onProgressUpdate(Number(currentValue));
    setIsEditing(false);
  };

  const isCompleted = status === 'completed';
  
  return (
    <Card 
      className={cn(
        "overflow-hidden transition-all hover:shadow-md",
        isCompleted && "opacity-80",
        className
      )}
      style={style}
    >
      <div className={cn(
        "h-1.5",
        progress >= 100 ? "bg-green-500" : "bg-fitness-accent"
      )} 
      style={{ width: `${progress}%` }}
      />
      
      <CardContent className="p-5">
        <div className="flex items-start justify-between mb-3">
          <div>
            <span className={cn(
              "text-xs py-1 px-2 rounded-full inline-block mb-2",
              typeColors[type]
            )}>
              {typeLabels[type]}
            </span>
            <h3 className="text-lg font-medium leading-tight">{title}</h3>
          </div>
          <div className="flex items-center gap-2">
            {statusIcons[status]}
            <button 
              onClick={onDelete} 
              className="text-muted-foreground hover:text-destructive transition-colors"
              aria-label="Delete goal"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>
        
        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{description}</p>
        
        <div className="mb-4">
          <div className="flex justify-between items-center mb-1.5">
            <span className="text-xs text-muted-foreground">Progress</span>
            <span className="text-xs font-medium">{progress}%</span>
          </div>
          <Progress value={progress} className="h-1.5" />
        </div>
        
        <div className="flex justify-between items-center mb-4">
          {!isEditing ? (
            <>
              <div className="flex flex-col">
                <span className="text-xs text-muted-foreground">Current</span>
                <span className="text-sm font-medium">{current}</span>
              </div>
              
              <div className="h-8 border-r border-border/50" />
              
              <div className="flex flex-col">
                <span className="text-xs text-muted-foreground">Target</span>
                <span className="text-sm font-medium">{target}</span>
              </div>
            </>
          ) : (
            <div className="flex items-center w-full gap-2">
              <div className="flex-1">
                <span className="text-xs text-muted-foreground">Current Value</span>
                <Input 
                  type="number" 
                  value={currentValue} 
                  onChange={(e) => setCurrentValue(Number(e.target.value))}
                  className="h-8 mt-1"
                />
              </div>
              <Button size="sm" onClick={handleSaveProgress} className="mt-5">
                <Save size={16} />
              </Button>
              <Button 
                size="sm" 
                variant="ghost" 
                onClick={() => {
                  setCurrentValue(current);
                  setIsEditing(false);
                }}
                className="mt-5"
              >
                <X size={16} />
              </Button>
            </div>
          )}
        </div>
        
        <div className="flex items-center justify-between">
          {formattedDeadline && (
            <div className="flex items-center text-xs text-muted-foreground">
              <Calendar size={14} className="mr-1" />
              <span>{formattedDeadline}</span>
            </div>
          )}
          
          <div className="flex gap-2">
            {!isEditing && !isCompleted && (
              <Button 
                size="sm" 
                variant="outline" 
                onClick={() => setIsEditing(true)}
                className="h-8 text-xs"
              >
                <Edit size={14} className="mr-1" />
                Update
              </Button>
            )}
            
            {!isCompleted && (
              <Button 
                size="sm" 
                onClick={onComplete} 
                className="h-8 text-xs"
              >
                <CheckCircle size={14} className="mr-1" />
                Complete
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default GoalCard;
