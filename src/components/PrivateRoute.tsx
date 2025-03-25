
import React from 'react';

interface PrivateRouteProps {
  children: React.ReactNode;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  // Without authentication, we just render children directly
  return <>{children}</>;
};

export default PrivateRoute;
