
import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';

const SignIn = () => {
  // Log for debugging purposes
  useEffect(() => {
    console.log("SignIn component mounted, redirecting to /login");
  }, []);

  // Redirects to the Login component
  return <Navigate to="/login" replace />;
};

export default SignIn;

