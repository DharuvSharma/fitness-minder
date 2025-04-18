
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';

const Index = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  
  const handleNavigation = (path: string) => {
    navigate(path);
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
      <div className="text-center max-w-3xl px-4 py-16 animate-fade-in">
        <span className="text-sm text-[#61DAFB] mb-4 block">
          Track. Progress. Achieve.
        </span>
        <h1 className="text-5xl font-bold mb-6">
          Your Personalized <br />
          <span className="text-[#61DAFB]">Fitness Journey</span>
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 mb-10 max-w-xl mx-auto">
          Track workouts, visualize progress, and achieve your fitness goals 
          with our elegantly designed platform.
        </p>
        <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
          <Button 
            onClick={() => handleNavigation(isAuthenticated ? '/dashboard' : '/login')}
            className="bg-[#61DAFB] hover:bg-[#4ecca3] text-white px-8 py-3"
          >
            {isAuthenticated ? 'Go to Dashboard' : 'Get Started'}
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
          {!isAuthenticated && (
            <Button 
              variant="outline"
              onClick={() => handleNavigation('/register')}
              className="border-[#61DAFB] text-[#61DAFB] hover:bg-gray-100 dark:hover:bg-gray-700 px-8 py-3"
            >
              Create Account
            </Button>
          )}
          <Button 
            variant="outline"
            onClick={() => handleNavigation('/about')}
            className="border-black text-black dark:border-white dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 px-8 py-3"
          >
            Learn More
          </Button>
        </div>
        
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
            <div className="w-12 h-12 bg-[#61DAFB]/20 text-[#61DAFB] rounded-full flex items-center justify-center mb-4 mx-auto">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <h3 className="text-lg font-medium mb-2">Track Workouts</h3>
            <p className="text-gray-500 dark:text-gray-400">Record and manage your exercise routines with detailed metrics.</p>
          </div>
          
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
            <div className="w-12 h-12 bg-[#61DAFB]/20 text-[#61DAFB] rounded-full flex items-center justify-center mb-4 mx-auto">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium mb-2">Visualize Progress</h3>
            <p className="text-gray-500 dark:text-gray-400">See your improvements over time with intuitive charts and analytics.</p>
          </div>
          
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
            <div className="w-12 h-12 bg-[#61DAFB]/20 text-[#61DAFB] rounded-full flex items-center justify-center mb-4 mx-auto">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium mb-2">Achieve Goals</h3>
            <p className="text-gray-500 dark:text-gray-400">Set and monitor personalized fitness goals to stay motivated.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
