
import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Workouts from './pages/Workouts';
import Login from './pages/Login';
import { ThemeProvider } from '@/components/ThemeProvider';
import WorkoutHistory from './pages/WorkoutHistory';
import WorkoutCalendarView from './pages/WorkoutCalendarView';
import Progress from './pages/Progress';
import Goals from './pages/Goals';
import Profile from './pages/Profile';
import { Toaster } from '@/components/ui/sonner';
import Navigation from '@/components/Navigation';
import { ThemeToggle } from '@/components/ui/theme-toggle';

function App() {
  const [authState, setAuthState] = useState({
    isAuthenticated: true, // Set to true for now, will be replaced by actual auth later
    loading: false,
  });

  const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
    if (authState.loading) {
      return <div>Loading...</div>;
    }

    return authState.isAuthenticated ? (
      children
    ) : (
      <Navigate to="/login" replace />
    );
  };

  return (
    <ThemeProvider defaultTheme="system" storageKey="fitness-theme">
      <Router>
        <div className="relative min-h-screen bg-background text-foreground pb-16 md:pb-0 md:pt-16">
          <div className="fixed top-4 right-4 z-50">
            <ThemeToggle />
          </div>
          
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/profile" element={
              <PrivateRoute>
                <Profile />
              </PrivateRoute>
            } />
            <Route path="/" element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            } />
            <Route path="/workouts" element={
              <PrivateRoute>
                <Workouts />
              </PrivateRoute>
            } />
            
            <Route path="/workout-history" element={
              <PrivateRoute>
                <WorkoutHistory />
              </PrivateRoute>
            } />
            <Route path="/workout-calendar" element={
              <PrivateRoute>
                <WorkoutCalendarView />
              </PrivateRoute>
            } />
            <Route path="/progress" element={
              <PrivateRoute>
                <Progress />
              </PrivateRoute>
            } />
            <Route path="/goals" element={
              <PrivateRoute>
                <Goals />
              </PrivateRoute>
            } />
            
            {/* New Routes */}
            <Route path="/about" element={
              <PrivateRoute>
                <div className="container pt-6">
                  <h1 className="text-3xl font-bold">About FitnessMinder</h1>
                  <p className="mt-4">Your comprehensive fitness tracking solution.</p>
                </div>
              </PrivateRoute>
            } />
            <Route path="/notifications" element={
              <PrivateRoute>
                <div className="container pt-6">
                  <h1 className="text-3xl font-bold">Notifications</h1>
                  <p className="mt-4">You have no new notifications.</p>
                </div>
              </PrivateRoute>
            } />
            <Route path="/settings" element={
              <PrivateRoute>
                <div className="container pt-6">
                  <h1 className="text-3xl font-bold">Settings</h1>
                  <p className="mt-4">Configure your application settings here.</p>
                </div>
              </PrivateRoute>
            } />
          </Routes>
          
          <Navigation />
        </div>
      </Router>
      <Toaster />
    </ThemeProvider>
  );
}

export default App;
