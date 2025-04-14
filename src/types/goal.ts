
export type GoalType = 'weight' | 'strength' | 'endurance' | 'habit' | 'custom';
export type GoalStatus = 'in-progress' | 'completed' | 'not-started';

export interface Goal {
  id: string;
  title: string;
  description: string;
  target: number;
  current: number;
  type: GoalType;
  status: GoalStatus;
  deadline?: string;
  createdAt: string;
  progress: number; // 0-100
}

export type GoalFormData = Omit<Goal, 'id' | 'status' | 'progress' | 'createdAt'>;
