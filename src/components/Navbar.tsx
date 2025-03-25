
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { 
  Home, Dumbbell, BarChart2, Target, User
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const Navbar: React.FC = () => {
  const location = useLocation();
  
  // Define nav items
  const navItems = [
    {
      label: 'Home',
      href: '/dashboard',
      icon: <Home className="w-5 h-5" />,
    },
    {
      label: 'Workouts',
      href: '/workouts',
      icon: <Dumbbell className="w-5 h-5" />,
    },
    {
      label: 'Progress',
      href: '/progress',
      icon: <BarChart2 className="w-5 h-5" />,
    },
    {
      label: 'Goals',
      href: '/goals',
      icon: <Target className="w-5 h-5" />,
    },
    {
      label: 'Profile',
      href: '/profile',
      icon: <User className="w-5 h-5" />,
    },
  ];

  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <span className="font-semibold tracking-tighter text-xl text-[#61DAFB]">
                Fitness
              </span>
              <span className="font-semibold tracking-tighter text-xl">Minder</span>
            </Link>
          </div>
          
          <nav className="flex">
            <ul className="hidden md:flex space-x-8">
              {navItems.map((item) => (
                <li key={item.href}>
                  <Link
                    to={item.href}
                    className={cn(
                      "flex items-center py-2 text-sm font-medium transition-colors",
                      location.pathname === item.href 
                        ? "text-[#61DAFB]" 
                        : "text-gray-600 hover:text-gray-900"
                    )}
                  >
                    {item.icon}
                    <span className="ml-2">{item.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          
          <div>
            <Button className="bg-[#61DAFB] hover:bg-[#4ecca3] text-white">
              Sign In
            </Button>
          </div>
        </div>
      </div>
      
      {/* Mobile navigation */}
      <div className="block md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t shadow-sm">
        <div className="flex justify-around">
          {navItems.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                "flex flex-col items-center justify-center py-2 px-3",
                location.pathname === item.href 
                  ? "text-[#61DAFB]" 
                  : "text-gray-600"
              )}
            >
              {item.icon}
              <span className="text-xs mt-1">{item.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
