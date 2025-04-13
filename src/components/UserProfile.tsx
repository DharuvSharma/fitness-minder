
import React, { useState } from 'react';
import { User, Settings, LogOut, Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { notificationService } from '@/services/notificationService';
import { toast } from 'sonner';
import { registerForPushNotifications } from '@/services/notificationService';

interface UserProfileProps {
  className?: string;
}

const UserProfile: React.FC<UserProfileProps> = ({ className }) => {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [syncEnabled, setSyncEnabled] = useState(true);
  
  const handleNotificationChange = async (checked: boolean) => {
    setNotificationsEnabled(checked);
    
    if (checked) {
      // Ask for permission and register for notifications
      const registered = await registerForPushNotifications();
      
      if (registered) {
        await notificationService.subscribeToWorkoutReminders({
          enabled: true,
          frequency: 'daily',
          time: '09:00'
        });
        
        await notificationService.subscribeToGoalUpdates(true);
        
        // Show a test notification
        notificationService.showLocalNotification(
          'Notifications Enabled', 
          'You will now receive workout reminders and goal updates.',
          'system'
        );
      } else {
        toast.error('Could not enable notifications. Please check your browser settings.');
        setNotificationsEnabled(false);
      }
    } else {
      // Disable notifications
      await notificationService.subscribeToWorkoutReminders({
        enabled: false,
        frequency: 'daily'
      });
      
      await notificationService.subscribeToGoalUpdates(false);
      toast('Notifications disabled');
    }
  };
  
  const handleSyncChange = (checked: boolean) => {
    setSyncEnabled(checked);
    if (checked) {
      toast.success('Cloud sync enabled');
    } else {
      toast.info('Cloud sync disabled - your data will be stored locally only');
    }
  };
  
  const handleLogout = () => {
    // This would be replaced with actual logout logic
    toast.info('Logging out...');
    setTimeout(() => {
      window.location.href = '/login';
    }, 1500);
  };

  return (
    <div className={`bg-white rounded-xl shadow-sm p-6 ${className}`}>
      <div className="flex items-center mb-6">
        <Avatar className="h-16 w-16 mr-4">
          <AvatarImage src="https://github.com/shadcn.png" alt="User" />
          <AvatarFallback>
            <User className="h-8 w-8" />
          </AvatarFallback>
        </Avatar>
        <div>
          <h2 className="text-xl font-bold">John Doe</h2>
          <p className="text-gray-500 text-sm">Fitness Enthusiast</p>
        </div>
      </div>
      
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Bell className="h-5 w-5 mr-3 text-gray-600" />
            <div>
              <h3 className="font-medium">Notifications</h3>
              <p className="text-sm text-gray-500">Get workout reminders and updates</p>
            </div>
          </div>
          <Switch 
            checked={notificationsEnabled} 
            onCheckedChange={handleNotificationChange} 
          />
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Settings className="h-5 w-5 mr-3 text-gray-600" />
            <div>
              <h3 className="font-medium">Cloud Sync</h3>
              <p className="text-sm text-gray-500">Sync data across devices</p>
            </div>
          </div>
          <Switch 
            checked={syncEnabled} 
            onCheckedChange={handleSyncChange} 
          />
        </div>
        
        <Button 
          variant="outline" 
          className="w-full mt-4 flex items-center justify-center"
          onClick={handleLogout}
        >
          <LogOut className="h-4 w-4 mr-2" />
          Sign Out
        </Button>
      </div>
    </div>
  );
};

export default UserProfile;
