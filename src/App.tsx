import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { Auth } from 'aws-amplify';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import ForgotPassword from './pages/ForgotPassword';
import ForgotPasswordSubmit from './pages/ForgotPasswordSubmit';
import VerifyEmail from './pages/VerifyEmail';
import Dashboard from './pages/Dashboard';
import Workouts from './pages/Workouts';
import Profile from './pages/Profile';
import { Authenticator } from '@aws-amplify/ui-react';
import { Amplify } from 'aws-amplify';
import awsExports from './aws-exports';
import { ThemeProvider } from '@/components/ThemeProvider';
import WorkoutHistory from './pages/WorkoutHistory';
import WorkoutCalendarView from './pages/WorkoutCalendarView';

Amplify.configure(awsExports);

interface AuthState {
  isAuthenticated: boolean | null;
  loading: boolean;
}

function App() {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: null,
    loading: true,
  });

  useEffect(() => {
    checkAuthState();
  }, []);

  const checkAuthState = async () => {
    try {
      await Auth.currentSession();
      setAuthState({ isAuthenticated: true, loading: false });
    } catch (error) {
      setAuthState({ isAuthenticated: false, loading: false });
    }
  };

  const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
    if (authState.loading) {
      return <div>Loading...</div>;
    }

    return authState.isAuthenticated ? (
      children
    ) : (
      <Navigate to="/signin" replace />
    );
  };

  return (
    <ThemeProvider defaultTheme="system" storageKey="fitness-theme">
      <Router>
        <Routes>
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/forgot-password-submit" element={<ForgotPasswordSubmit />} />
          <Route path="/verify-email" element={<VerifyEmail />} />
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
          
          {/* Add the new routes inside the existing Routes component */}
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
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
