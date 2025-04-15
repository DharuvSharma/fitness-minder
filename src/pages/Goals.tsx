
import React, { useState } from 'react';
import { useGoals } from '@/hooks/useGoals';
import { Goal } from '@/types';
import GoalCard from '@/components/GoalCard';
import AddGoalDialog from '@/components/AddGoalDialog';
import { Button } from '@/components/ui/button';
import { Plus, Target } from 'lucide-react';
import { toast } from 'sonner';
import { Progress } from '@/components/ui/progress';

const Goals = () => {
  const { goals, isLoading, updateGoal, deleteGoal, fetchGoals } = useGoals();
  const [isAddingGoal, setIsAddingGoal] = useState(false);

  const handleCompleteGoal = async (id: string) => {
    try {
      await updateGoal(id, { status: 'completed', progress: 100 });
      toast.success('Goal marked as completed!');
    } catch (error) {
      console.error('Failed to complete goal:', error);
      toast.error('Failed to update goal status');
    }
  };

  const handleDeleteGoal = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this goal?')) {
      try {
        await deleteGoal(id);
        toast.success('Goal deleted successfully');
      } catch (error) {
        console.error('Failed to delete goal:', error);
        toast.error('Failed to delete goal');
      }
    }
  };

  const handleGoalProgressUpdate = async (id: string, current: number | string) => {
    try {
      await updateGoal(id, { current: Number(current) });
      toast.success('Goal progress updated!');
    } catch (error) {
      console.error('Failed to update goal progress:', error);
      toast.error('Failed to update goal progress');
    }
  };

  // Stats calculation
  const completedGoals = goals.filter(goal => goal.status === 'completed').length;
  const inProgressGoals = goals.filter(goal => goal.status === 'in-progress').length;
  const totalGoals = goals.length;
  const completionRate = totalGoals > 0 ? (completedGoals / totalGoals) * 100 : 0;

  if (isLoading) {
    return (
      <div className="container py-8 px-4 md:px-8">
        <h1 className="text-3xl font-bold mb-8">Goals</h1>
        <div className="flex flex-col gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-40 bg-muted rounded-2xl animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container py-6 px-4 md:px-8 pb-20 md:pb-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl md:text-3xl font-bold">Your Fitness Goals</h1>
        <Button 
          onClick={() => setIsAddingGoal(true)}
          className="flex items-center gap-2"
        >
          <Plus size={18} />
          <span className="hidden sm:inline">Add Goal</span>
        </Button>
      </div>

      {goals.length > 0 && (
        <div className="mb-8 p-4 bg-background/60 backdrop-blur-sm border rounded-xl">
          <h2 className="text-lg font-semibold mb-2 flex items-center gap-2">
            <Target size={18} />
            Goal Progress Overview
          </h2>

          <div className="grid grid-cols-3 gap-4 mb-4 text-center">
            <div className="rounded-lg p-2">
              <p className="text-2xl font-bold text-fitness-mint">{completedGoals}</p>
              <p className="text-xs text-muted-foreground">Completed</p>
            </div>
            <div className="rounded-lg p-2">
              <p className="text-2xl font-bold text-fitness-accent">{inProgressGoals}</p>
              <p className="text-xs text-muted-foreground">In Progress</p>
            </div>
            <div className="rounded-lg p-2">
              <p className="text-2xl font-bold">{totalGoals}</p>
              <p className="text-xs text-muted-foreground">Total Goals</p>
            </div>
          </div>

          <div className="mb-1">
            <div className="flex justify-between text-xs mb-1">
              <span>Completion Rate</span>
              <span className="font-medium">{Math.round(completionRate)}%</span>
            </div>
            <Progress value={completionRate} className="h-2" />
          </div>
        </div>
      )}

      {goals.length === 0 ? (
        <div className="text-center py-16 border border-dashed rounded-xl bg-muted/50">
          <Target className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-xl font-medium mb-2">No goals yet</h3>
          <p className="text-muted-foreground mb-6">Track your fitness journey by setting some goals</p>
          <Button onClick={() => setIsAddingGoal(true)}>Add Your First Goal</Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {goals.map((goal) => (
            <GoalCard
              key={goal.id}
              {...goal}
              onComplete={() => handleCompleteGoal(goal.id)}
              onDelete={() => handleDeleteGoal(goal.id)}
              onProgressUpdate={(value) => handleGoalProgressUpdate(goal.id, value)}
            />
          ))}
        </div>
      )}

      <AddGoalDialog
        open={isAddingGoal}
        onOpenChange={setIsAddingGoal}
        onGoalAdded={fetchGoals}
      />
    </div>
  );
};

export default Goals;
