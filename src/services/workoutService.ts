
import { WorkoutType } from '@/components/WorkoutCard';
import api from './apiService';

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

// Mock data for initial workouts (used only when API fails or for development)
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

// Get workouts from localStorage as fallback
const getStoredWorkouts = (): Workout[] => {
  try {
    const storedWorkouts = localStorage.getItem('workouts');
    if (storedWorkouts) {
      const parsed = JSON.parse(storedWorkouts);
      return Array.isArray(parsed) ? parsed : initialWorkouts;
    }
    // Initialize with mock data if nothing in localStorage
    localStorage.setItem('workouts', JSON.stringify(initialWorkouts));
    return initialWorkouts;
  } catch (error) {
    console.error('Error parsing workouts from localStorage:', error);
    return initialWorkouts;
  }
};

export const workoutService = {
  getWorkouts: async (): Promise<Workout[]> => {
    try {
      const response = await api.get('/workouts');
      const data = response.data;
      // Ensure we're returning an array
      return Array.isArray(data) ? data : [];
    } catch (error) {
      console.error('Error fetching workouts from API:', error);
      // Fallback to local storage if API fails
      return getStoredWorkouts();
    }
  },
  
  addWorkout: async (workout: Omit<Workout, 'id'>): Promise<Workout> => {
    try {
      const response = await api.post('/workouts', workout);
      return response.data;
    } catch (error) {
      console.error('Error adding workout via API:', error);
      // Fallback to local storage
      const workouts = getStoredWorkouts();
      const newWorkout = {
        ...workout,
        id: Date.now().toString(), // Simple ID generation
      };
      
      workouts.unshift(newWorkout); // Add to beginning of array
      localStorage.setItem('workouts', JSON.stringify(workouts));
      return newWorkout;
    }
  },
  
  updateWorkout: async (id: string, updates: Partial<Workout>): Promise<Workout> => {
    try {
      const response = await api.put(`/workouts/${id}`, updates);
      return response.data;
    } catch (error) {
      console.error('Error updating workout via API:', error);
      // Fallback to local storage
      const workouts = getStoredWorkouts();
      const index = workouts.findIndex(w => w.id === id);
      
      if (index === -1) throw new Error('Workout not found');
      
      const updatedWorkout = { ...workouts[index], ...updates };
      workouts[index] = updatedWorkout;
      localStorage.setItem('workouts', JSON.stringify(workouts));
      return updatedWorkout;
    }
  },
  
  deleteWorkout: async (id: string): Promise<boolean> => {
    try {
      await api.delete(`/workouts/${id}`);
      return true;
    } catch (error) {
      console.error('Error deleting workout via API:', error);
      // Fallback to local storage
      const workouts = getStoredWorkouts();
      const filteredWorkouts = workouts.filter(w => w.id !== id);
      
      if (filteredWorkouts.length === workouts.length) return false;
      
      localStorage.setItem('workouts', JSON.stringify(filteredWorkouts));
      return true;
    }
  },
  
  toggleWorkoutCompletion: async (id: string): Promise<Workout> => {
    try {
      const workout = await workoutService.getWorkoutById(id);
      if (!workout) throw new Error('Workout not found');
      
      return await workoutService.updateWorkout(id, { completed: !workout.completed });
    } catch (error) {
      console.error('Error toggling workout completion:', error);
      throw error;
    }
  },
  
  getWorkoutById: async (id: string): Promise<Workout> => {
    try {
      const response = await api.get(`/workouts/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching workout by ID from API:', error);
      // Fallback to local storage
      const workouts = getStoredWorkouts();
      const workout = workouts.find(w => w.id === id);
      if (!workout) throw new Error('Workout not found');
      return workout;
    }
  }
};
