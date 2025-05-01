
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
  exercises?: Exercise[];
}

export type WorkoutType = 'cardio' | 'strength' | 'flexibility' | 'hiit' | 'custom';
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
  exercises?: Exercise[];
}
