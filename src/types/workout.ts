
export type WorkoutType = 'strength' | 'cardio' | 'hiit' | 'flexibility' | 'balance';

export interface Workout {
  id: string;
  title: string;
  type: WorkoutType;
  duration: number;
  calories: number;
  date: string;
  completed: boolean;
  exercises?: string;
  notes?: string;
}

export interface WorkoutFormData {
  title: string;
  type: WorkoutType;
  duration: number;
  calories: number;
  date: string;
  exercises?: string;
  notes?: string;
  completed?: boolean;
}
