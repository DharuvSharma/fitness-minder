
import React from 'react';
import { Circle, CheckCircle, XCircle, AlertCircle, Edit, Trash, ChevronRight } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Goal, GoalStatus, GoalType } from '@/types';
import { formatDistance } from 'date-fns';

interface GoalCardProps {
  goal: Goal;
  onEdit?: (goal: Goal) => void;
  onDelete?: (goalId: string) => void;
  onToggleStatus?: (goal: Goal) => void;
}

const GoalCard: React.FC<GoalCardProps> = ({ goal, onEdit, onDelete, onToggleStatus }) => {
  // Status icons mapping
  const statusIcons: Record<GoalStatus, React.ReactNode> = {
    'completed': <CheckCircle className="h-5 w-5 text-green-500" />,
    'in-progress': <Circle className="h-5 w-5 text-blue-500" />,
    'missed': <XCircle className="h-5 w-5 text-red-500" />,
    'not-started': <AlertCircle className="h-5 w-5 text-gray-500" />
  };

  // Color mapping for goal types
  const typeColors: Record<GoalType, string> = {
    'weight': 'bg-purple-100 text-purple-800',
    'workout': 'bg-blue-100 text-blue-800',
    'steps': 'bg-green-100 text-green-800',
    'distance': 'bg-yellow-100 text-yellow-800',
    'calories': 'bg-orange-100 text-orange-800',
    'custom': 'bg-gray-100 text-gray-800',
    'strength': 'bg-red-100 text-red-800',
    'endurance': 'bg-teal-100 text-teal-800',
    'habit': 'bg-indigo-100 text-indigo-800'
  };

  // Emoji mapping for goal types
  const typeEmojis: Record<GoalType, string> = {
    'weight': '⚖️',
    'workout': '🏋️',
    'steps': '👣',
    'distance': '🏃',
    'calories': '🔥',
    'custom': '🎯',
    'strength': '💪',
    'endurance': '⏱️',
    'habit': '📅'
  };

  const formattedDeadline = goal.deadline ? new Date(goal.deadline) : null;
  const timeToDeadline = formattedDeadline ? 
    formatDistance(formattedDeadline, new Date(), { addSuffix: true }) : 
    null;
  
  const handleEdit = () => onEdit && onEdit(goal);
  const handleDelete = () => onDelete && onDelete(goal.id);
  const handleStatusToggle = () => onToggleStatus && onToggleStatus(goal);

  return (
    <Card className="overflow-hidden transition-all hover:shadow-md">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <span className={`inline-block px-2 py-1 text-xs rounded-full ${typeColors[goal.type]}`}>
              {typeEmojis[goal.type]} {goal.type.charAt(0).toUpperCase() + goal.type.slice(1)}
            </span>
            <CardTitle className="mt-2 text-lg">{goal.title}</CardTitle>
            <CardDescription className="text-sm text-gray-500">
              {goal.description || "No description provided"}
            </CardDescription>
          </div>
          <div>{statusIcons[goal.status]}</div>
        </div>
      </CardHeader>
      
      <CardContent className="pb-2">
        <div className="mb-4">
          <div className="flex justify-between items-center text-sm mb-1">
            <span>Progress</span>
            <span className="font-medium">{goal.current} / {goal.target}</span>
          </div>
          <Progress value={goal.progress} className="h-2" />
          <div className="text-right text-xs text-gray-500 mt-1">
            {goal.progress}% complete
          </div>
        </div>
        
        {timeToDeadline && (
          <div className="text-sm text-gray-500">
            {new Date(goal.deadline as string) < new Date() ? 
              <span className="text-red-500">Deadline passed {timeToDeadline}</span> : 
              <span>Due {timeToDeadline}</span>}
          </div>
        )}
      </CardContent>
      
      <CardFooter className="flex justify-between pt-2">
        <div className="flex space-x-2">
          {onEdit && (
            <Button variant="outline" size="sm" onClick={handleEdit}>
              <Edit className="h-4 w-4 mr-1" /> Edit
            </Button>
          )}
          {onDelete && (
            <Button variant="outline" size="sm" className="text-red-500" onClick={handleDelete}>
              <Trash className="h-4 w-4 mr-1" /> Delete
            </Button>
          )}
        </div>
        
        {onToggleStatus && (
          <Button size="sm" variant="ghost" className="text-blue-500" onClick={handleStatusToggle}>
            Update <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default GoalCard;
