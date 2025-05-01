
export interface Goal {
  id: string;
  title: string;
  description?: string;
  target: number;
  current: number;
  type: GoalType;
  status: GoalStatus;
  progress: number;
  deadline?: string;
}

export type GoalType = 'weight' | 'workout' | 'steps' | 'distance' | 'calories' | 'custom' | 'strength' | 'endurance' | 'habit';
export type GoalStatus = 'in-progress' | 'completed' | 'missed' | 'not-started';

export interface GoalFormData {
  title: string;
  description?: string;
  type: GoalType;
  target: number;
  current?: number;
  deadline?: string;
}
