
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { ThemeProvider } from '@/components/ThemeProvider';
import { Toaster } from '@/components/ui/sonner';
import { AuthProvider } from '@/context/AuthContext';
import { ProtectedRoute, PublicRoute } from '@/components/AuthRoutes';
import Navigation from '@/components/Navigation';
import { ThemeToggle } from '@/components/ui/theme-toggle';

// Public pages
import Login from './pages/Login';
import Register from './pages/Register';
import Index from './pages/Index';

// Protected pages
import Dashboard from './pages/Dashboard';
import Workouts from './pages/Workouts';
import WorkoutHistory from './pages/WorkoutHistory';
import WorkoutCalendarView from './pages/WorkoutCalendarView';
import Progress from './pages/Progress';
import Goals from './pages/Goals';
import Profile from './pages/Profile';

function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="fitness-theme">
      <AuthProvider>
        <Router>
          <div className="relative min-h-screen bg-background text-foreground pb-16 md:pb-0 md:pt-16">
            <div className="fixed top-4 right-4 z-50">
              <ThemeToggle />
            </div>
            
            <Routes>
              {/* Public Routes */}
              <Route element={<PublicRoute />}>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
              </Route>
              
              <Route path="/" element={<Index />} />
              
              {/* Protected Routes */}
              <Route element={<ProtectedRoute />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/workouts" element={<Workouts />} />
                <Route path="/workout-history" element={<WorkoutHistory />} />
                <Route path="/workout-calendar" element={<WorkoutCalendarView />} />
                <Route path="/progress" element={<Progress />} />
                <Route path="/goals" element={<Goals />} />
                <Route path="/profile" element={<Profile />} />
                
                {/* Additional Routes */}
                <Route path="/about" element={
                  <div className="container pt-6">
                    <h1 className="text-3xl font-bold">About FitnessMinder</h1>
                    <p className="mt-4">Your comprehensive fitness tracking solution.</p>
                  </div>
                } />
                <Route path="/notifications" element={
                  <div className="container pt-6">
                    <h1 className="text-3xl font-bold">Notifications</h1>
                    <p className="mt-4">You have no new notifications.</p>
                  </div>
                } />
                <Route path="/settings" element={
                  <div className="container pt-6">
                    <h1 className="text-3xl font-bold">Settings</h1>
                    <p className="mt-4">Configure your application settings here.</p>
                  </div>
                } />
              </Route>
              
              {/* 404 Route */}
              <Route path="*" element={
                <div className="flex flex-col items-center justify-center h-screen">
                  <h1 className="text-4xl font-bold mb-4">404 - Page Not Found</h1>
                  <p className="mb-8">The page you're looking for doesn't exist.</p>
                  <a href="/" className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">
                    Go Home
                  </a>
                </div>
              } />
            </Routes>
            
            <Navigation />
          </div>
        </Router>
        <Toaster />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
