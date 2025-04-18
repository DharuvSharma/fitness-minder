
import React from 'react';

interface LoadingSpinnerProps {
  fullScreen?: boolean;
  size?: 'small' | 'medium' | 'large';
  message?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  fullScreen = true, 
  size = 'medium',
  message = 'Loading...' 
}) => {
  const getSize = () => {
    switch(size) {
      case 'small': return 'h-5 w-5';
      case 'large': return 'h-12 w-12';
      default: return 'h-8 w-8';
    }
  };
  
  const spinner = (
    <div className="flex flex-col items-center justify-center">
      <div className={`${getSize()} animate-spin rounded-full border-4 border-gray-200 border-t-indigo-600`}></div>
      {message && <p className="mt-3 text-sm text-gray-600 dark:text-gray-300">{message}</p>}
    </div>
  );
  
  if (fullScreen) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white/75 dark:bg-gray-900/75 z-50">
        {spinner}
      </div>
    );
  }
  
  return spinner;
};

export default LoadingSpinner;
