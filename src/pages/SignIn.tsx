
import React from 'react';
import { Navigate } from 'react-router-dom';
import Login from './Login';

const SignIn = () => {
  // For now, just redirect to the Login page
  return <Navigate to="/login" />;
};

export default SignIn;
