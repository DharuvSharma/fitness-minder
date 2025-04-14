
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Workouts from './pages/Workouts';
import Login from './pages/Login';
import { ThemeProvider } from '@/components/ThemeProvider';
import WorkoutHistory from './pages/WorkoutHistory';
import WorkoutCalendarView from './pages/WorkoutCalendarView';
import Progress from './pages/Progress';
import { Toaster } from '@/components/ui/sonner';

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
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/profile" element={
            <PrivateRoute>
              <div>Profile Page</div>
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
        </Routes>
      </Router>
      <Toaster />
    </ThemeProvider>
  );
}

export default App;
