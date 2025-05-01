
import React from 'react';

interface LoadingSpinnerProps {
  message?: string;
  size?: 'small' | 'medium' | 'large';
  fullScreen?: boolean;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  message = "Loading...", 
  size = 'medium',
  fullScreen = true 
}) => {
  const sizeClass = {
    small: 'h-6 w-6 border-2',
    medium: 'h-12 w-12 border-t-2 border-b-2',
    large: 'h-16 w-16 border-4'
  };

  const containerClass = fullScreen 
    ? "flex flex-col items-center justify-center h-screen" 
    : "flex flex-col items-center justify-center py-8";

  return (
    <div className={containerClass}>
      <div className={`animate-spin rounded-full ${sizeClass[size]} border-primary`}></div>
      {message && <p className="mt-4 text-muted-foreground">{message}</p>}
    </div>
  );
};

export default LoadingSpinner;
