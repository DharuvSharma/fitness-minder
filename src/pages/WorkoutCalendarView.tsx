
import React, { useState } from 'react';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import enUS from 'date-fns/locale/en-US';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { useWorkouts } from '@/hooks/useWorkouts';
import { Workout, Exercise } from '@/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import AddWorkoutForm from '@/components/AddWorkoutForm';
import LoadingSpinner from '@/components/LoadingSpinner';
import { Dumbbell, Clock, Flame, Check, Info } from 'lucide-react';

const locales = {
  'en-US': enUS,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

const WorkoutCalendarView = () => {
  const { workouts, isLoading, addWorkout } = useWorkouts(90); // Get 90 days of workouts for calendar view
  const [selectedWorkout, setSelectedWorkout] = useState<Workout | null>(null);
  const [isWorkoutDetailsOpen, setIsWorkoutDetailsOpen] = useState(false);
  const [isAddWorkoutOpen, setIsAddWorkoutOpen] = useState(false);
  
  if (isLoading) {
    return <LoadingSpinner message="Loading workout calendar..." />;
  }
  
  // Format workouts for the calendar
  const calendarEvents = workouts.map(workout => ({
    id: workout.id,
    title: workout.title,
    start: new Date(workout.date),
    end: new Date(workout.date),
    allDay: true,
    resource: workout,
  }));
  
  // Handle event selection
  const handleSelectEvent = (event: any) => {
    setSelectedWorkout(event.resource);
    setIsWorkoutDetailsOpen(true);
  };
  
  // Handle date selection
  const handleSelectSlot = (slotInfo: any) => {
    // We could open the add workout form here pre-populated with the selected date
    console.log('Slot selected:', slotInfo);
  };
  
  // Handler for adding a workout
  const handleAddWorkout = (workoutData: any) => {
    addWorkout({
      ...workoutData,
      completed: false,
    });
    setIsAddWorkoutOpen(false);
  };

  // Function to render workout type badge based on type
  const renderWorkoutTypeBadge = (type: string) => {
    const colorMap: Record<string, string> = {
      'cardio': 'bg-blue-100 text-blue-800',
      'strength': 'bg-red-100 text-red-800',
      'flexibility': 'bg-purple-100 text-purple-800',
      'hiit': 'bg-orange-100 text-orange-800',
      'balance': 'bg-green-100 text-green-800',
      'sport': 'bg-yellow-100 text-yellow-800',
      'custom': 'bg-gray-100 text-gray-800',
      'other': 'bg-teal-100 text-teal-800'
    };
    
    return (
      <Badge className={`${colorMap[type] || colorMap.other}`}>
        {type.charAt(0).toUpperCase() + type.slice(1)}
      </Badge>
    );
  };
  
  // Format exercises for display
  const formatExercises = (exercises: string | Exercise[] | undefined) => {
    if (!exercises) return <p className="text-muted-foreground">No exercises recorded</p>;
    
    if (typeof exercises === 'string') {
      return <p>{exercises}</p>;
    }
    
    return (
      <ul className="list-disc pl-5 space-y-1">
        {exercises.map((exercise, index) => (
          <li key={index} className="text-sm">
            <span className="font-medium">{exercise.name}</span>
            {exercise.sets && exercise.reps && ` - ${exercise.sets} sets × ${exercise.reps} reps`}
            {exercise.weight && ` @ ${exercise.weight} lbs`}
          </li>
        ))}
      </ul>
    );
  };

  // Custom calendar event styling
  const eventStyleGetter = (event: any) => {
    const workout: Workout = event.resource;
    const isCompleted = workout.completed;
    
    let backgroundColor;
    switch(workout.type) {
      case 'cardio': backgroundColor = '#60a5fa'; break; // blue-400
      case 'strength': backgroundColor = '#f87171'; break; // red-400
      case 'flexibility': backgroundColor = '#c084fc'; break; // purple-400
      case 'hiit': backgroundColor = '#fb923c'; break; // orange-400
      case 'balance': backgroundColor = '#4ade80'; break; // green-400
      case 'sport': backgroundColor = '#facc15'; break; // yellow-400
      default: backgroundColor = '#94a3b8'; // gray-400
    }
    
    return {
      style: {
        backgroundColor,
        opacity: isCompleted ? 0.7 : 1,
        borderRadius: '4px',
        border: 'none',
        color: 'white'
      }
    };
  };

  return (
    <div className="container py-6 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Workout Calendar</h1>
        <Button onClick={() => setIsAddWorkoutOpen(true)}>
          Add Workout
        </Button>
      </div>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 h-[700px]">
        <Calendar
          localizer={localizer}
          events={calendarEvents}
          startAccessor="start"
          endAccessor="end"
          onSelectEvent={handleSelectEvent}
          onSelectSlot={handleSelectSlot}
          selectable={true}
          eventPropGetter={eventStyleGetter}
          toolbar={true}
          views={['month', 'week', 'agenda']}
          defaultView="month"
        />
      </div>
      
      {/* Workout Details Dialog */}
      <Dialog open={isWorkoutDetailsOpen} onOpenChange={setIsWorkoutDetailsOpen}>
        <DialogContent className="max-w-md">
          {selectedWorkout && (
            <>
              <DialogHeader>
                <DialogTitle className="text-xl">{selectedWorkout.title}</DialogTitle>
                <DialogDescription className="flex items-center gap-2 mt-2">
                  <span className="text-sm">
                    {format(new Date(selectedWorkout.date), 'EEEE, MMMM d, yyyy')}
                  </span>
                  {renderWorkoutTypeBadge(selectedWorkout.type)}
                </DialogDescription>
              </DialogHeader>
              
              <div className="grid grid-cols-3 gap-4 py-4">
                <div className="text-center">
                  <div className="flex flex-col items-center">
                    <Clock className="h-5 w-5 text-gray-500 mb-1" />
                    <p className="text-sm text-muted-foreground">Duration</p>
                    <p className="font-semibold">{selectedWorkout.duration} mins</p>
                  </div>
                </div>
                
                <div className="text-center">
                  <div className="flex flex-col items-center">
                    <Flame className="h-5 w-5 text-orange-500 mb-1" />
                    <p className="text-sm text-muted-foreground">Calories</p>
                    <p className="font-semibold">{selectedWorkout.calories}</p>
                  </div>
                </div>
                
                <div className="text-center">
                  <div className="flex flex-col items-center">
                    <Dumbbell className="h-5 w-5 text-blue-500 mb-1" />
                    <p className="text-sm text-muted-foreground">Status</p>
                    <p className="font-semibold">{selectedWorkout.completed ? 'Completed' : 'Planned'}</p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-3">
                {selectedWorkout.notes && (
                  <div>
                    <h3 className="text-sm font-medium">Notes:</h3>
                    <p className="text-sm text-gray-600">{selectedWorkout.notes}</p>
                  </div>
                )}
                
                <div>
                  <h3 className="text-sm font-medium mb-2">Exercises:</h3>
                  {formatExercises(selectedWorkout.exercises)}
                </div>
              </div>
              
              <DialogFooter className="mt-4">
                <Button variant="outline" onClick={() => setIsWorkoutDetailsOpen(false)}>
                  Close
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
      
      {/* Add Workout Dialog */}
      <AddWorkoutForm
        open={isAddWorkoutOpen}
        onOpenChange={setIsAddWorkoutOpen}
        onSave={handleAddWorkout}
      />
    </div>
  );
};

export default WorkoutCalendarView;
