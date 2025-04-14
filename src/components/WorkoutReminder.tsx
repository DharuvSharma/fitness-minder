
import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { BellRing, Clock } from 'lucide-react';
import { toast } from 'sonner';
import { notificationService, registerForPushNotifications } from '@/services/notificationService';

type Day = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';

const days: { value: Day; label: string }[] = [
  { value: 'monday', label: 'Monday' },
  { value: 'tuesday', label: 'Tuesday' },
  { value: 'wednesday', label: 'Wednesday' },
  { value: 'thursday', label: 'Thursday' },
  { value: 'friday', label: 'Friday' },
  { value: 'saturday', label: 'Saturday' },
  { value: 'sunday', label: 'Sunday' },
];

const WorkoutReminder: React.FC = () => {
  const [enabled, setEnabled] = useState(false);
  const [frequency, setFrequency] = useState<'daily' | 'custom'>('daily');
  const [time, setTime] = useState('08:00');
  const [selectedDays, setSelectedDays] = useState<Day[]>(['monday', 'wednesday', 'friday']);
  const [notificationPermission, setNotificationPermission] = useState(
    'Notification' in window ? Notification.permission : 'denied'
  );

  const handlePermissionRequest = async () => {
    const granted = await registerForPushNotifications();
    if (granted) {
      setNotificationPermission('granted');
    }
  };

  const handleSavePreferences = async () => {
    try {
      if (notificationPermission !== 'granted') {
        toast.error('You need to allow notifications first');
        return;
      }

      await notificationService.subscribeToWorkoutReminders({
        enabled,
        frequency,
        time,
        days: selectedDays,
      });

      // Schedule a test notification for 5 seconds from now
      if (enabled) {
        notificationService.scheduleNotification(
          'Workout Reminder Test', 
          `This is a test notification for your ${frequency} workout reminder${frequency === 'daily' ? ' at ' + time : ''}`,
          0.08, // 5 seconds in minutes
          'workout'
        );
      }
    } catch (error) {
      console.error('Error saving workout reminder preferences:', error);
      toast.error('Failed to save reminder settings');
    }
  };

  const toggleDay = (day: Day) => {
    setSelectedDays(prev => 
      prev.includes(day) 
        ? prev.filter(d => d !== day) 
        : [...prev, day]
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BellRing className="h-5 w-5" />
          Workout Reminders
        </CardTitle>
        <CardDescription>
          Get notifications to remind you about your scheduled workouts
        </CardDescription>
      </CardHeader>
      <CardContent>
        {notificationPermission !== 'granted' ? (
          <div className="mb-6 p-4 bg-amber-50 dark:bg-amber-950/30 rounded-md">
            <p className="text-amber-800 dark:text-amber-400 text-sm mb-3">
              Browser notifications are currently disabled. Enable them to get workout reminders.
            </p>
            <Button onClick={handlePermissionRequest} variant="outline" size="sm">
              Enable Notifications
            </Button>
          </div>
        ) : null}

        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <Label htmlFor="reminder-toggle" className="flex flex-col gap-1">
              <span>Enable reminders</span>
              <span className="font-normal text-muted-foreground text-xs">
                Receive notifications for your workouts
              </span>
            </Label>
            <Switch
              id="reminder-toggle"
              checked={enabled}
              onCheckedChange={setEnabled}
            />
          </div>

          <div className="space-y-3">
            <Label htmlFor="frequency">Reminder Frequency</Label>
            <Select
              value={frequency}
              onValueChange={(value) => setFrequency(value as 'daily' | 'custom')}
              disabled={!enabled}
            >
              <SelectTrigger id="frequency">
                <SelectValue placeholder="Select frequency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="daily">Daily (same time)</SelectItem>
                <SelectItem value="custom">Custom days</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-3">
            <Label htmlFor="time">Reminder Time</Label>
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <Input
                id="time"
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                disabled={!enabled}
              />
            </div>
          </div>

          {frequency === 'custom' && (
            <div className="space-y-3">
              <Label>Days of the Week</Label>
              <div className="flex flex-wrap gap-2">
                {days.map((day) => (
                  <Button
                    key={day.value}
                    variant={selectedDays.includes(day.value) ? "default" : "outline"}
                    size="sm"
                    onClick={() => toggleDay(day.value)}
                    disabled={!enabled}
                    className="flex-1 min-w-[80px]"
                  >
                    {day.label.slice(0, 3)}
                  </Button>
                ))}
              </div>
            </div>
          )}

          <Button 
            onClick={handleSavePreferences} 
            disabled={!enabled || notificationPermission !== 'granted'}
            className="w-full"
          >
            Save Reminder Settings
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default WorkoutReminder;
