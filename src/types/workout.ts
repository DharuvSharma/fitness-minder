
export type WorkoutType = 'strength' | 'cardio' | 'hiit' | 'flexibility' | 'balance' | 'sport' | 'other';

export interface Workout {
  id: string;
  title: string;
  type: WorkoutType;
  duration: number;
  calories: number;
  exercises: number;
  date: string;
  completed: boolean;
  notes?: string;
}

export type WorkoutFormData = Omit<Workout, 'id' | 'completed'>;
