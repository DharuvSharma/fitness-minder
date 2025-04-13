
import React from 'react';
import { Trophy, Target, Bell, Award } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { Goal, goalService } from '@/services/goalService';
import { Button } from '@/components/ui/button';

interface AchievementTrackerProps {
  goals: Goal[];
  className?: string;
  onCreateGoal?: () => void;
}

const AchievementTracker: React.FC<AchievementTrackerProps> = ({ 
  goals, 
  className,
  onCreateGoal 
}) => {
  // Filter to show only in-progress goals
  const activeGoals = goals.filter(goal => goal.status === 'in-progress');
  
  return (
    <div className={cn("glass-card rounded-xl p-5", className)}>
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold text-lg flex items-center">
          <Target className="w-5 h-5 mr-2 text-[#61DAFB]" />
          Goals & Achievements
        </h3>
        <Button 
          size="sm"
          onClick={onCreateGoal}
          className="bg-[#61DAFB] hover:bg-[#61DAFB]/80 text-white"
        >
          Add Goal
        </Button>
      </div>
      
      {activeGoals.length > 0 ? (
        <div className="space-y-4">
          {activeGoals.map((goal) => (
            <div key={goal.id} className="bg-white/50 p-3 rounded-lg">
              <div className="flex justify-between items-start mb-1">
                <div className="flex items-start">
                  {goal.type === 'strength' && <Trophy className="w-4 h-4 text-blue-500 mt-1 mr-2" />}
                  {goal.type === 'endurance' && <Award className="w-4 h-4 text-green-500 mt-1 mr-2" />}
                  {goal.type === 'habit' && <Bell className="w-4 h-4 text-purple-500 mt-1 mr-2" />}
                  <div>
                    <h4 className="font-medium text-sm">{goal.title}</h4>
                    <p className="text-xs text-gray-500">{goal.description}</p>
                  </div>
                </div>
                <span className="text-xs font-semibold bg-gray-100 px-2 py-1 rounded-full">
                  {goal.current}/{goal.target}
                </span>
              </div>
              <Progress value={goal.progress} className="h-2 mt-2" />
              <div className="flex justify-between mt-1">
                <span className="text-xs text-gray-500">Progress: {goal.progress}%</span>
                {goal.deadline && (
                  <span className="text-xs text-gray-500">
                    Due: {new Date(goal.deadline).toLocaleDateString()}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-6">
          <p className="text-gray-500 mb-3">No active goals found</p>
          <p className="text-sm text-gray-400">Set goals to track your fitness journey</p>
        </div>
      )}
    </div>
  );
};

export default AchievementTracker;
