
import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  Home,
  Dumbbell, 
  Calendar, 
  BarChart2, 
  Target, 
  User,
  LogIn
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

const MobileNavigation = () => {
  const location = useLocation();
  const { isAuthenticated } = useAuth();
  
  // Show navigation only on these paths
  const hideNavigationPaths = ['/login', '/register', '/forgot-password'];
  const shouldShowNavigation = !hideNavigationPaths.includes(location.pathname);
  
  if (!shouldShowNavigation) {
    return null;
  }
  
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 md:hidden z-40">
      <div className="flex justify-around items-center h-16 px-2">
        {isAuthenticated ? (
          // Authenticated Navigation
          <>
            <NavLink 
              to="/dashboard" 
              className={({ isActive }) => 
                `flex flex-col items-center justify-center p-2 rounded-lg transition-colors ${
                  isActive 
                    ? 'text-[#61DAFB]' 
                    : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                }`
              }
            >
              <Home className="h-5 w-5" />
              <span className="text-xs mt-1">Home</span>
            </NavLink>
            
            <NavLink 
              to="/workouts" 
              className={({ isActive }) => 
                `flex flex-col items-center justify-center p-2 rounded-lg transition-colors ${
                  isActive 
                    ? 'text-[#61DAFB]' 
                    : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                }`
              }
            >
              <Dumbbell className="h-5 w-5" />
              <span className="text-xs mt-1">Workouts</span>
            </NavLink>
            
            <NavLink 
              to="/progress" 
              className={({ isActive }) => 
                `flex flex-col items-center justify-center p-2 rounded-lg transition-colors ${
                  isActive 
                    ? 'text-[#61DAFB]' 
                    : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                }`
              }
            >
              <BarChart2 className="h-5 w-5" />
              <span className="text-xs mt-1">Progress</span>
            </NavLink>
            
            <NavLink 
              to="/goals" 
              className={({ isActive }) => 
                `flex flex-col items-center justify-center p-2 rounded-lg transition-colors ${
                  isActive 
                    ? 'text-[#61DAFB]' 
                    : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                }`
              }
            >
              <Target className="h-5 w-5" />
              <span className="text-xs mt-1">Goals</span>
            </NavLink>
            
            <NavLink 
              to="/profile" 
              className={({ isActive }) => 
                `flex flex-col items-center justify-center p-2 rounded-lg transition-colors ${
                  isActive 
                    ? 'text-[#61DAFB]' 
                    : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                }`
              }
            >
              <User className="h-5 w-5" />
              <span className="text-xs mt-1">Profile</span>
            </NavLink>
          </>
        ) : (
          // Unauthenticated Navigation
          <>
            <NavLink 
              to="/" 
              className={({ isActive }) => 
                `flex flex-col items-center justify-center p-2 rounded-lg transition-colors ${
                  isActive 
                    ? 'text-[#61DAFB]' 
                    : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                }`
              }
            >
              <Home className="h-5 w-5" />
              <span className="text-xs mt-1">Home</span>
            </NavLink>
            
            <NavLink 
              to="/about" 
              className={({ isActive }) => 
                `flex flex-col items-center justify-center p-2 rounded-lg transition-colors ${
                  isActive 
                    ? 'text-[#61DAFB]' 
                    : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                }`
              }
            >
              <Calendar className="h-5 w-5" />
              <span className="text-xs mt-1">About</span>
            </NavLink>
            
            <NavLink 
              to="/login" 
              className={({ isActive }) => 
                `flex flex-col items-center justify-center p-2 rounded-lg transition-colors ${
                  isActive 
                    ? 'text-[#61DAFB]' 
                    : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                }`
              }
            >
              <LogIn className="h-5 w-5" />
              <span className="text-xs mt-1">Login</span>
            </NavLink>
          </>
        )}
      </div>
    </div>
  );
};

export default MobileNavigation;
