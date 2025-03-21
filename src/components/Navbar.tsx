
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { 
  Home, Dumbbell, BarChart2, Target, User, 
} from 'lucide-react';

type NavItem = {
  label: string;
  href: string;
  icon: React.ReactNode;
};

const navItems: NavItem[] = [
  {
    label: 'Home',
    href: '/',
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

const Navbar: React.FC = () => {
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 md:top-0 md:bottom-auto">
      <div 
        className={cn(
          "w-full flex justify-center items-center transition-all duration-300 ease-in-out",
          scrolled ? "md:py-3 bg-background/80 backdrop-blur-md border-b" : "md:py-5",
          "md:border-b border-border/40 bg-background/90 backdrop-blur-md"
        )}
      >
        <nav className="flex items-center justify-between w-full max-w-screen-xl px-4 py-3 md:py-0">
          <div className="hidden md:flex items-center space-x-1">
            <span className="font-semibold tracking-tighter text-lg text-fitness-accent">
              Fitness
            </span>
            <span className="font-semibold tracking-tighter text-lg">Minder</span>
          </div>
          
          <ul className="flex w-full md:w-auto justify-around md:justify-center md:space-x-8">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link
                  to={item.href}
                  className={cn(
                    "flex flex-col md:flex-row items-center justify-center py-1 md:py-2 px-3 rounded-md transition-all duration-200",
                    "text-muted-foreground hover:text-foreground",
                    location.pathname === item.href 
                      ? "text-fitness-accent font-medium" 
                      : "text-muted-foreground"
                  )}
                >
                  <span className="md:mr-2">{item.icon}</span>
                  <span className="text-xs mt-1 md:mt-0 md:text-sm">{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
          
          <div className="hidden md:block">
            <button
              className="px-4 py-2 rounded-md bg-fitness-accent text-white font-medium text-sm transition-all hover:bg-fitness-accent/90"
            >
              Sign In
            </button>
          </div>
        </nav>
      </div>
    </div>
  );
};

export default Navbar;
