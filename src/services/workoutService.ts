
import { WorkoutType } from '@/components/WorkoutCard';

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

// Mock data for initial workouts
const initialWorkouts: Workout[] = [
  {
    id: '1',
    title: 'Upper Body Strength',
    type: 'strength',
    duration: 45,
    calories: 320,
    exercises: 8,
    date: '2023-06-10',
    completed: true,
  },
  {
    id: '2',
    title: '5K Morning Run',
    type: 'cardio',
    duration: 28,
    calories: 250,
    exercises: 1,
    date: '2023-06-08',
    completed: true,
  },
  {
    id: '3',
    title: 'HIIT Circuit',
    type: 'hiit',
    duration: 30,
    calories: 400,
    exercises: 6,
    date: '2023-06-12',
    completed: false,
  },
  {
    id: '4',
    title: 'Lower Body Focus',
    type: 'strength',
    duration: 50,
    calories: 380,
    exercises: 7,
    date: '2023-06-05',
    completed: true,
  },
  {
    id: '5',
    title: 'Yoga and Stretching',
    type: 'flexibility',
    duration: 35,
    calories: 150,
    exercises: 12,
    date: '2023-06-07',
    completed: true,
  },
  {
    id: '6',
    title: 'Outdoor Cycling',
    type: 'cardio',
    duration: 60,
    calories: 450,
    exercises: 1,
    date: '2023-06-04',
    completed: true,
  },
  {
    id: '7',
    title: 'Full Body Workout',
    type: 'strength',
    duration: 55,
    calories: 420,
    exercises: 10,
    date: '2023-06-01',
    completed: true,
  },
  {
    id: '8',
    title: 'Sprint Intervals',
    type: 'hiit',
    duration: 25,
    calories: 320,
    exercises: 4,
    date: '2023-06-14',
    completed: false,
  },
];

// Get workouts from localStorage or use initial data
const getStoredWorkouts = (): Workout[] => {
  const storedWorkouts = localStorage.getItem('workouts');
  if (storedWorkouts) {
    return JSON.parse(storedWorkouts);
  }
  // Initialize with mock data if nothing in localStorage
  localStorage.setItem('workouts', JSON.stringify(initialWorkouts));
  return initialWorkouts;
};

// Save workouts to localStorage
const saveWorkouts = (workouts: Workout[]): void => {
  localStorage.setItem('workouts', JSON.stringify(workouts));
};

export const workoutService = {
  getWorkouts: (): Workout[] => {
    return getStoredWorkouts();
  },
  
  addWorkout: (workout: Omit<Workout, 'id'>): Workout => {
    const workouts = getStoredWorkouts();
    const newWorkout = {
      ...workout,
      id: Date.now().toString(), // Simple ID generation
    };
    
    workouts.push(newWorkout);
    saveWorkouts(workouts);
    return newWorkout;
  },
  
  updateWorkout: (id: string, updates: Partial<Workout>): Workout | null => {
    const workouts = getStoredWorkouts();
    const index = workouts.findIndex(w => w.id === id);
    
    if (index === -1) return null;
    
    workouts[index] = { ...workouts[index], ...updates };
    saveWorkouts(workouts);
    return workouts[index];
  },
  
  deleteWorkout: (id: string): boolean => {
    const workouts = getStoredWorkouts();
    const filteredWorkouts = workouts.filter(w => w.id !== id);
    
    if (filteredWorkouts.length === workouts.length) return false;
    
    saveWorkouts(filteredWorkouts);
    return true;
  },
  
  toggleWorkoutCompletion: (id: string): Workout | null => {
    const workouts = getStoredWorkouts();
    const index = workouts.findIndex(w => w.id === id);
    
    if (index === -1) return null;
    
    workouts[index].completed = !workouts[index].completed;
    saveWorkouts(workouts);
    return workouts[index];
  }
};
