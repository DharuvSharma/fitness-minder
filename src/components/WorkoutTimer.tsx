
import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, BellRing } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent } from '@/components/ui/card';
import { notificationService, registerForPushNotifications } from '@/services/notificationService';
import { motion } from 'framer-motion';

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
    <Card className="w-full max-w-md mx-auto overflow-hidden border-none shadow-lg bg-gradient-to-br from-background/80 to-background dark:from-gray-900/90 dark:to-gray-950 backdrop-blur-sm">
      <CardContent className="p-6">
        <div className="text-center mb-6">
          <motion.h3 
            key={timeRemaining}
            initial={{ scale: 0.95, opacity: 0.8 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.2 }}
            className="text-4xl font-bold tracking-tighter mb-1"
          >
            {formatTime(timeRemaining)}
          </motion.h3>
          <p className="text-sm text-muted-foreground">{workoutName} Timer</p>
        </div>
        
        <Progress
          value={progress}
          className="h-3 mb-8 bg-secondary/50"
          indicatorClassName={`${
            progress > 66 ? 'bg-green-500' :
            progress > 33 ? 'bg-amber-500' : 'bg-red-500'
          }`}
        />
        
        <div className="flex justify-center space-x-3">
          {!isActive ? (
            <Button onClick={handleStart} size="lg" className="bg-green-600 hover:bg-green-700 text-white gap-2 rounded-full px-6 shadow-md">
              <Play className="h-5 w-5" />
              Start
            </Button>
          ) : (
            <Button onClick={handlePause} size="lg" variant="outline" className="gap-2 rounded-full px-6 border-2">
              <Pause className="h-5 w-5" />
              Pause
            </Button>
          )}
          
          <Button onClick={handleReset} size="lg" variant="outline" className="gap-2 rounded-full px-6 border-2">
            <RotateCcw className="h-5 w-5" />
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
            size="lg" 
            variant="outline"
            className="gap-2 rounded-full px-6 border-2"
          >
            <BellRing className="h-5 w-5" />
            Alert
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default WorkoutTimer;
