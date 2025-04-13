
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Index = () => {
  const navigate = useNavigate();
  
  const handleNavigation = (path: string) => {
    navigate(path);
  };
  
  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="text-center max-w-3xl px-4">
        <span className="text-sm text-[#61DAFB] mb-4 block">
          Track. Progress. Achieve.
        </span>
        <h1 className="text-5xl font-bold mb-6">
          Your Personalized <br />
          <span className="text-[#61DAFB]">Fitness Journey</span>
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-xl mx-auto">
          Track workouts, visualize progress, and achieve your fitness goals 
          with our elegantly designed platform.
        </p>
        <div className="flex justify-center space-x-4">
          <Button 
            onClick={() => handleNavigation('/dashboard')}
            className="bg-black text-white hover:bg-gray-800 px-8 py-3"
          >
            Get Started
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
          <Button 
            variant="outline"
            onClick={() => handleNavigation('/workouts')}
            className="border-black text-black hover:bg-gray-100 px-8 py-3"
          >
            View Workouts
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Index;
