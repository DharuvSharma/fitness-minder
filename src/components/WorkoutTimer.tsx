import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, BellRing } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent } from '@/components/ui/card';
import { notificationService, registerForPushNotifications } from '@/services/notificationService';

interface WorkoutTimerProps {
  initialTime?: number; // in seconds
  onComplete?: () => void;
  workoutName?: string;
}

const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

const WorkoutTimer: React.FC<WorkoutTimerProps> = ({
  initialTime = 1800, // 30 minutes default
  onComplete,
  workoutName = 'Workout'
}) => {
  const [timeRemaining, setTimeRemaining] = useState(initialTime);
  const [isActive, setIsActive] = useState(false);
  const [progress, setProgress] = useState(100);
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    setProgress((timeRemaining / initialTime) * 100);
  }, [timeRemaining, initialTime]);

  useEffect(() => {
    if (isActive) {
      intervalRef.current = window.setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            clearInterval(intervalRef.current!);
            setIsActive(false);
            
            notificationService.showLocalNotification(
              'Workout Complete!', 
              `You've completed your ${workoutName} session.`,
              'workout'
            );
            
            if (onComplete) {
              onComplete();
            }
            
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isActive, onComplete, workoutName]);

  const handleStart = () => setIsActive(true);
  const handlePause = () => setIsActive(false);
  const handleReset = () => {
    setIsActive(false);
    setTimeRemaining(initialTime);
    setProgress(100);
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardContent className="pt-6">
        <div className="text-center mb-4">
          <h3 className="text-2xl font-bold">{formatTime(timeRemaining)}</h3>
          <p className="text-sm text-muted-foreground">{workoutName} Timer</p>
        </div>
        
        <Progress
          value={progress}
          className="h-2 mb-6"
          indicatorClassName={`${
            progress > 66 ? 'bg-green-500' :
            progress > 33 ? 'bg-amber-500' : 'bg-red-500'
          }`}
        />
        
        <div className="flex justify-center space-x-2">
          {!isActive ? (
            <Button onClick={handleStart} size="sm" className="bg-green-600 hover:bg-green-700">
              <Play className="h-4 w-4 mr-1" />
              Start
            </Button>
          ) : (
            <Button onClick={handlePause} size="sm" variant="outline">
              <Pause className="h-4 w-4 mr-1" />
              Pause
            </Button>
          )}
          
          <Button onClick={handleReset} size="sm" variant="outline">
            <RotateCcw className="h-4 w-4 mr-1" />
            Reset
          </Button>
          
          <Button 
            onClick={() => {
              if (Notification.permission === 'granted') {
                notificationService.showLocalNotification(
                  'Timer Active', 
                  `${workoutName} timer is running: ${formatTime(timeRemaining)} remaining`,
                  'workout'
                );
              } else {
                registerForPushNotifications();
              }
            }} 
            size="sm" 
            variant="outline"
          >
            <BellRing className="h-4 w-4 mr-1" />
            Alert
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default WorkoutTimer;
