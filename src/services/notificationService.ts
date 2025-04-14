
import { toast } from 'sonner';
import api from './apiService';

// Types for notifications
export type NotificationType = 'workout' | 'goal' | 'streak' | 'system';

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: NotificationType;
  isRead: boolean;
  createdAt: string;
  data?: any; // Additional data related to the notification
}

// Service for handling notifications
export const notificationService = {
  // Get all notifications for the current user
  getNotifications: async (): Promise<Notification[]> => {
    try {
      const response = await api.get('/notifications');
      return response.data;
    } catch (error) {
      console.error('Error fetching notifications:', error);
      
      // Return empty array on error
      return [];
    }
  },
  
  // Mark a notification as read
  markAsRead: async (id: string): Promise<boolean> => {
    try {
      await api.put(`/notifications/${id}/read`);
      return true;
    } catch (error) {
      console.error('Error marking notification as read:', error);
      return false;
    }
  },
  
  // Mark all notifications as read
  markAllAsRead: async (): Promise<boolean> => {
    try {
      await api.put('/notifications/read-all');
      return true;
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      return false;
    }
  },
  
  // Delete a notification
  deleteNotification: async (id: string): Promise<boolean> => {
    try {
      await api.delete(`/notifications/${id}`);
      return true;
    } catch (error) {
      console.error('Error deleting notification:', error);
      return false;
    }
  },
  
  // Subscribe to workout reminders
  subscribeToWorkoutReminders: async (preferences: { 
    enabled: boolean, 
    frequency: 'daily' | 'custom',
    time?: string,
    days?: string[]
  }): Promise<boolean> => {
    try {
      await api.post('/notifications/workout-reminders', preferences);
      toast.success('Workout reminder preferences updated');
      return true;
    } catch (error) {
      console.error('Error updating workout reminder preferences:', error);
      toast.error('Failed to update reminder preferences');
      return false;
    }
  },
  
  // Subscribe to goal updates
  subscribeToGoalUpdates: async (enabled: boolean): Promise<boolean> => {
    try {
      await api.post('/notifications/goal-updates', { enabled });
      toast.success('Goal notification preferences updated');
      return true;
    } catch (error) {
      console.error('Error updating goal notification preferences:', error);
      toast.error('Failed to update notification preferences');
      return false;
    }
  },
  
  // Local notification for testing - will show a toast
  showLocalNotification: (title: string, message: string, type: NotificationType = 'system') => {
    switch (type) {
      case 'workout':
        toast(title, {
          description: message,
          icon: '🏋️'
        });
        break;
      case 'goal':
        toast(title, {
          description: message,
          icon: '🎯'
        });
        break;
      case 'streak':
        toast(title, {
          description: message,
          icon: '🔥'
        });
        break;
      default:
        toast(title, {
          description: message
        });
    }
    
    // If browser notifications are supported and permission granted, show a browser notification
    if ('Notification' in window && Notification.permission === 'granted') {
      try {
        new Notification(title, { 
          body: message,
          icon: '/favicon.ico'
        });
      } catch (error) {
        console.error('Error showing browser notification:', error);
      }
    }
  },
  
  // Schedule a notification for a future time
  scheduleNotification: (title: string, message: string, delayMinutes: number, type: NotificationType = 'system') => {
    setTimeout(() => {
      notificationService.showLocalNotification(title, message, type);
    }, delayMinutes * 60 * 1000);
    
    return true;
  }
};

// Push notification registration 
export const registerForPushNotifications = async (): Promise<boolean> => {
  try {
    // Check if the browser supports notifications
    if (!('Notification' in window)) {
      console.log('This browser does not support notifications');
      toast.error('Your browser does not support notifications');
      return false;
    }
    
    // Request permission
    const permission = await Notification.requestPermission();
    
    if (permission === 'granted') {
      // Could integrate with a proper push notification service here
      console.log('Notification permission granted');
      toast.success('Notification permission granted');
      return true;
    } else {
      console.log('Notification permission denied');
      toast.error('Please enable notifications in your browser settings to receive workout reminders');
      return false;
    }
  } catch (error) {
    console.error('Error registering for push notifications:', error);
    toast.error('Failed to set up notifications');
    return false;
  }
};

export default notificationService;
