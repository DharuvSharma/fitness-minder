
import React from 'react';
import { Navigate } from 'react-router-dom';

const SignIn = () => {
  // Redirects to the Login component
  return <Navigate to="/login" replace />;
};

export default SignIn;
