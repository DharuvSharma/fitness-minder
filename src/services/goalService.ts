
import api from './apiService';
import { toast } from 'sonner';

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

// Initial mock goals for development
const initialGoals: Goal[] = [
  {
    id: '1',
    title: 'Burn 5000 calories',
    description: 'Reach a total of 5000 calories burned through cardio workouts',
    target: 5000,
    current: 3200,
    type: 'endurance',
    status: 'in-progress',
    deadline: '2023-07-15',
    createdAt: '2023-06-01',
    progress: 64, // (3200/5000) * 100
  },
  {
    id: '2',
    title: 'Complete 20 workouts',
    description: 'Finish at least 20 strength workouts this month',
    target: 20,
    current: 14,
    type: 'strength',
    status: 'in-progress',
    deadline: '2023-07-31',
    createdAt: '2023-06-01',
    progress: 70, // (14/20) * 100
  },
  {
    id: '3',
    title: 'Reach 150 mins activity',
    description: 'Get at least 150 minutes of physical activity weekly',
    target: 150,
    current: 150,
    type: 'habit',
    status: 'completed',
    deadline: '2023-06-25',
    createdAt: '2023-06-01',
    progress: 100, // Completed
  },
];

// Get goals from localStorage as fallback
const getStoredGoals = (): Goal[] => {
  try {
    const storedGoals = localStorage.getItem('goals');
    if (storedGoals) {
      const parsed = JSON.parse(storedGoals);
      return Array.isArray(parsed) ? parsed : initialGoals;
    }
    // Initialize with mock data if nothing in localStorage
    localStorage.setItem('goals', JSON.stringify(initialGoals));
    return initialGoals;
  } catch (error) {
    console.error('Error parsing goals from localStorage:', error);
    return initialGoals;
  }
};

export const goalService = {
  getGoals: async (): Promise<Goal[]> => {
    try {
      const response = await api.get('/goals');
      const data = response.data;
      return Array.isArray(data) ? data : [];
    } catch (error) {
      console.error('Error fetching goals from API:', error);
      // Fallback to local storage if API fails
      return getStoredGoals();
    }
  },
  
  addGoal: async (goal: Omit<Goal, 'id' | 'status' | 'progress' | 'createdAt'>): Promise<Goal> => {
    try {
      const newGoal = {
        ...goal,
        status: goal.current >= goal.target ? 'completed' : 'in-progress',
        progress: goal.target > 0 ? Math.round((goal.current / goal.target) * 100) : 0,
        createdAt: new Date().toISOString().split('T')[0],
      };
      
      const response = await api.post('/goals', newGoal);
      return response.data;
    } catch (error) {
      console.error('Error adding goal via API:', error);
      
      // Fallback to local storage
      const goals = getStoredGoals();
      const newGoal: Goal = {
        ...goal,
        id: Date.now().toString(),
        status: goal.current >= goal.target ? 'completed' : 'in-progress',
        progress: goal.target > 0 ? Math.round((goal.current / goal.target) * 100) : 0,
        createdAt: new Date().toISOString().split('T')[0],
      };
      
      goals.unshift(newGoal);
      localStorage.setItem('goals', JSON.stringify(goals));
      return newGoal;
    }
  },
  
  updateGoal: async (id: string, updates: Partial<Goal>): Promise<Goal> => {
    try {
      // If updating current value, recalculate progress
      if (updates.current !== undefined || updates.target !== undefined) {
        const goals = await goalService.getGoals();
        const goal = goals.find(g => g.id === id);
        if (goal) {
          const target = updates.target ?? goal.target;
          const current = updates.current ?? goal.current;
          updates.progress = target > 0 ? Math.round((current / target) * 100) : 0;
          updates.status = current >= target ? 'completed' : 'in-progress';
        }
      }
      
      const response = await api.put(`/goals/${id}`, updates);
      return response.data;
    } catch (error) {
      console.error('Error updating goal via API:', error);
      
      // Fallback to local storage
      const goals = getStoredGoals();
      const index = goals.findIndex(g => g.id === id);
      
      if (index === -1) throw new Error('Goal not found');
      
      // If updating current value, recalculate progress
      if (updates.current !== undefined || updates.target !== undefined) {
        const target = updates.target ?? goals[index].target;
        const current = updates.current ?? goals[index].current;
        updates.progress = target > 0 ? Math.round((current / target) * 100) : 0;
        updates.status = current >= target ? 'completed' : 'in-progress';
      }
      
      const updatedGoal = { ...goals[index], ...updates };
      goals[index] = updatedGoal;
      localStorage.setItem('goals', JSON.stringify(goals));
      return updatedGoal;
    }
  },
  
  deleteGoal: async (id: string): Promise<boolean> => {
    try {
      await api.delete(`/goals/${id}`);
      return true;
    } catch (error) {
      console.error('Error deleting goal via API:', error);
      
      // Fallback to local storage
      const goals = getStoredGoals();
      const filteredGoals = goals.filter(g => g.id !== id);
      
      if (filteredGoals.length === goals.length) return false;
      
      localStorage.setItem('goals', JSON.stringify(filteredGoals));
      return true;
    }
  },
  
  getGoalById: async (id: string): Promise<Goal> => {
    try {
      const response = await api.get(`/goals/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching goal by ID from API:', error);
      
      // Fallback to local storage
      const goals = getStoredGoals();
      const goal = goals.find(g => g.id === id);
      if (!goal) throw new Error('Goal not found');
      return goal;
    }
  }
};
