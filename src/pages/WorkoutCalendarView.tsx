import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import { format, parseISO } from 'date-fns';
import { 
  ListFilter, 
  Plus, 
  Calendar as CalendarIcon,
  List
} from 'lucide-react';
import { Workout } from '@/types';
import { useWorkouts } from '@/hooks/useWorkouts';
import { Button } from '@/components/ui/button';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AddWorkoutForm from '@/components/AddWorkoutForm';
import EditWorkoutForm from '@/components/EditWorkoutForm';
import 'react-big-calendar/lib/css/react-big-calendar.css';

// Set up the localizer for the calendar
const localizer = momentLocalizer(moment);

const WorkoutCalendarView: React.FC = () => {
  const navigate = useNavigate();
  const { workouts, isLoading, addWorkout, updateWorkout } = useWorkouts(90); // 90 days of history
  const [events, setEvents] = useState<any[]>([]);
  const [isAddWorkoutOpen, setIsAddWorkoutOpen] = useState(false);
  const [isEditWorkoutOpen, setIsEditWorkoutOpen] = useState(false);
  const [selectedWorkout, setSelectedWorkout] = useState<Workout | null>(null);
  const [isWorkoutDetailsOpen, setIsWorkoutDetailsOpen] = useState(false);
  
  // Transform workouts to calendar events
  useEffect(() => {
    if (workouts) {
      const mappedEvents = workouts.map(workout => ({
        id: workout.id,
        title: workout.title,
        start: new Date(workout.date),
        end: new Date(workout.date),
        workout: workout, // Store the full workout object for reference
        status: workout.completed ? 'completed' : 'planned'
      }));
      setEvents(mappedEvents);
    }
  }, [workouts]);

  const handleSelectEvent = (event: any) => {
    setSelectedWorkout(event.workout);
    setIsWorkoutDetailsOpen(true);
  };

  const handleSelectSlot = ({ start }: { start: Date }) => {
    setIsAddWorkoutOpen(true);
  };

  const handleAddWorkout = async (data: any) => {
    await addWorkout(data);
    setIsAddWorkoutOpen(false);
  };

  const handleEditWorkout = () => {
    setIsWorkoutDetailsOpen(false);
    setIsEditWorkoutOpen(true);
  };

  const handleEditSubmit = async (data: Partial<Workout>) => {
    if (selectedWorkout) {
      await updateWorkout(selectedWorkout.id, data);
      setIsEditWorkoutOpen(false);
      setSelectedWorkout(null);
    }
  };

  // Custom event component to style events differently based on their status
  const EventComponent = ({ event }: { event: any }) => {
    const isCompleted = event.status === 'completed';
    
    return (
      <div 
        className={`p-1 text-xs rounded truncate ${
          isCompleted 
            ? 'bg-green-200 text-green-800 dark:bg-green-900 dark:text-green-300' 
            : 'bg-amber-200 text-amber-800 dark:bg-amber-900 dark:text-amber-300'
        }`}
      >
        {event.title}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 pb-20 md:pb-0">
      <div className="container mx-auto px-4 pt-6 animate-fade-in">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-50">
              Workout Calendar
            </h1>
            <p className="text-muted-foreground">
              View and schedule your workouts by date
            </p>
          </div>
          
          <div className="flex gap-3">
            <Button 
              variant="outline" 
              className="flex items-center gap-2"
              onClick={() => navigate('/workout-history')}
            >
              <List className="h-4 w-4" />
              <span>List View</span>
            </Button>
            <Button 
              className="bg-indigo-600 hover:bg-indigo-700"
              onClick={() => setIsAddWorkoutOpen(true)}
            >
              <Plus className="h-4 w-4 mr-2" />
              New Workout
            </Button>
          </div>
        </header>
        
        <Card className="mb-6">
          <CardContent className="py-4">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="text-sm font-medium">Legend:</span>
              <div className="flex items-center">
                <span className="inline-block w-3 h-3 rounded-full bg-green-200 dark:bg-green-900 mr-1"></span> 
                <span className="text-xs">Completed</span>
              </div>
              <div className="flex items-center">
                <span className="inline-block w-3 h-3 rounded-full bg-amber-200 dark:bg-amber-900 mr-1"></span> 
                <span className="text-xs">Planned</span>
              </div>
            </div>
            <p className="text-xs text-muted-foreground">
              Click on a date to add a workout or click on an event to view details. Drag and drop events to reschedule.
            </p>
          </CardContent>
        </Card>
        
        <Card className="h-[600px] mb-8">
          <CardContent className="p-4 h-full">
            {isLoading ? (
              <div className="h-full flex items-center justify-center">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                <p className="ml-3">Loading calendar...</p>
              </div>
            ) : (
              <div className="h-full calendar-container">
                <Calendar
                  localizer={localizer}
                  events={events}
                  startAccessor="start"
                  endAccessor="end"
                  style={{ height: '100%' }}
                  views={['month', 'week', 'day']}
                  defaultView="month"
                  onSelectEvent={handleSelectEvent}
                  onSelectSlot={handleSelectSlot}
                  selectable
                  components={{
                    event: EventComponent
                  }}
                  eventPropGetter={(event) => {
                    return {
                      className: event.status === 'completed' ? 'completed-event' : 'planned-event'
                    };
                  }}
                  className="bg-white dark:bg-gray-800 rounded-lg p-4"
                />
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      
      {/* Add Workout Form */}
      <AddWorkoutForm
        open={isAddWorkoutOpen}
        onOpenChange={setIsAddWorkoutOpen}
        onSave={handleAddWorkout}
      />
      
      {/* Edit Workout Form */}
      {selectedWorkout && (
        <EditWorkoutForm
          open={isEditWorkoutOpen}
          onOpenChange={setIsEditWorkoutOpen}
          workout={selectedWorkout}
          onSave={handleEditSubmit}
        />
      )}
      
      {/* Workout Details Dialog */}
      {selectedWorkout && (
        <Dialog open={isWorkoutDetailsOpen} onOpenChange={setIsWorkoutDetailsOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle className="text-xl">{selectedWorkout.title}</DialogTitle>
              <DialogDescription>
                {format(parseISO(selectedWorkout.date), 'EEEE, MMMM d, yyyy')}
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid grid-cols-2 gap-4 py-4">
              <div>
                <p className="text-sm font-medium">Type</p>
                <p className="capitalize">{selectedWorkout.type}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Duration</p>
                <p>{selectedWorkout.duration} minutes</p>
              </div>
              <div>
                <p className="text-sm font-medium">Calories</p>
                <p>{selectedWorkout.calories}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Exercises</p>
                <p>{selectedWorkout.exercises}</p>
              </div>
              <div className="col-span-2">
                <p className="text-sm font-medium">Status</p>
                <p>
                  <span className={`inline-block px-2 py-1 rounded-full text-xs ${
                    selectedWorkout.completed 
                      ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' 
                      : 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400'
                  }`}>
                    {selectedWorkout.completed ? 'Completed' : 'Planned'}
                  </span>
                </p>
              </div>
              {selectedWorkout.notes && (
                <div className="col-span-2">
                  <p className="text-sm font-medium">Notes</p>
                  <p className="text-sm">{selectedWorkout.notes}</p>
                </div>
              )}
            </div>
            
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setIsWorkoutDetailsOpen(false)}>
                Close
              </Button>
              <Button 
                className="bg-indigo-600 hover:bg-indigo-700"
                onClick={handleEditWorkout}
              >
                Edit Workout
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default WorkoutCalendarView;
