
import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@/components/ThemeProvider';
import { Toaster } from '@/components/ui/sonner';
import { AuthProvider } from '@/context/AuthContext';
import { ProtectedRoute, PublicRoute } from '@/components/AuthRoutes';
import Navigation from '@/components/Navigation';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import LoadingSpinner from '@/components/LoadingSpinner';

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

// Additional pages
const About = () => (
  <div className="container pt-6">
    <h1 className="text-3xl font-bold">About FitnessMinder</h1>
    <p className="mt-4">Your comprehensive fitness tracking solution designed to help you achieve your health and fitness goals.</p>
    <div className="mt-6">
      <h2 className="text-xl font-semibold mb-2">Our Mission</h2>
      <p>FitnessMinder is built to make fitness tracking simple, informative, and motivating. We believe that a well-designed fitness companion can make all the difference in your journey.</p>
    </div>
    <div className="mt-6">
      <h2 className="text-xl font-semibold mb-2">Features</h2>
      <ul className="list-disc pl-5 space-y-2">
        <li>Track workouts with detailed metrics</li>
        <li>Monitor progress with beautiful charts and analytics</li>
        <li>Set and achieve personalized fitness goals</li>
        <li>Calendar view for planning your fitness routine</li>
        <li>Comprehensive history tracking</li>
      </ul>
    </div>
  </div>
);

const Notifications = () => (
  <div className="container pt-6">
    <h1 className="text-3xl font-bold">Notifications</h1>
    <p className="mt-4">You have no new notifications.</p>
  </div>
);

const Settings = () => (
  <div className="container pt-6">
    <h1 className="text-3xl font-bold">Settings</h1>
    <p className="mt-4">Configure your application settings here.</p>
    <div className="grid gap-6 mt-6">
      <div className="border rounded-lg p-4">
        <h2 className="font-medium mb-2">Account Settings</h2>
        <p className="text-sm text-muted-foreground">Manage your account details and preferences</p>
      </div>
      
      <div className="border rounded-lg p-4">
        <h2 className="font-medium mb-2">Notification Preferences</h2>
        <p className="text-sm text-muted-foreground">Control when and how you receive notifications</p>
      </div>
      
      <div className="border rounded-lg p-4">
        <h2 className="font-medium mb-2">App Appearance</h2>
        <p className="text-sm text-muted-foreground">Customize how the app looks</p>
        <div className="mt-4">
          <ThemeToggle />
        </div>
      </div>
    </div>
  </div>
);

const NotFound = () => (
  <div className="flex flex-col items-center justify-center h-screen">
    <h1 className="text-4xl font-bold mb-4">404 - Page Not Found</h1>
    <p className="mb-8">The page you're looking for doesn't exist.</p>
    <a href="/" className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">
      Go Home
    </a>
  </div>
);

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
              <Route path="/about" element={<About />} />
              
              {/* Protected Routes */}
              <Route element={<ProtectedRoute />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/workouts" element={<Workouts />} />
                <Route path="/workout-history" element={<WorkoutHistory />} />
                <Route path="/workout-calendar" element={<WorkoutCalendarView />} />
                <Route path="/progress" element={<Progress />} />
                <Route path="/goals" element={<Goals />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/notifications" element={<Notifications />} />
                <Route path="/settings" element={<Settings />} />
              </Route>
              
              {/* 404 Route */}
              <Route path="*" element={<NotFound />} />
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
