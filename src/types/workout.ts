
export interface Workout {
  id: string;
  title: string;
  type: WorkoutType;
  duration: number;
  intensity: WorkoutIntensity;
  calories: number;
  notes?: string;
  date: string;
  completed: boolean;
  exercises?: Exercise[] | string; // Updated to allow string
}

export type WorkoutType = 'cardio' | 'strength' | 'flexibility' | 'hiit' | 'custom' | 'balance' | 'sport' | 'other';
export type WorkoutIntensity = 'low' | 'medium' | 'high';

export interface Exercise {
  id: string;
  name: string;
  sets?: number;
  reps?: number;
  weight?: number;
  duration?: number;
  distance?: number;
}

export interface WorkoutFormData {
  title: string;
  type: WorkoutType;
  duration: number;
  intensity: WorkoutIntensity;
  calories: number;
  notes?: string;
  date: string;
  exercises?: Exercise[] | string; // Updated to allow string
  completed?: boolean;
}
