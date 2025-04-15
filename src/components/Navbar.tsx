
import React from 'react';
import { Link } from 'react-router-dom';
import { Moon, Sun, Menu, X, Calendar, ClipboardList, ChevronDown } from 'lucide-react';
import { useTheme } from '@/hooks/use-theme';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useIsMobile } from '@/hooks/use-mobile';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const { theme, setTheme } = useTheme();
  const isMobile = useIsMobile();

  if (isMobile) {
    return null; // Don't render on mobile as we have the bottom navigation
  }

  const toggleTheme = (newTheme: 'light' | 'dark' | 'system') => {
    setTheme(newTheme);
  };

  return (
    <nav className="bg-background border-b border-border sticky top-0 z-40 h-16 flex items-center">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="text-foreground font-bold text-xl">
            FitnessMinder
          </Link>

          <div className="flex items-center">
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                <Link to="/" className="text-muted-foreground hover:text-foreground hover:bg-muted/50 px-3 py-2 rounded-md text-sm font-medium">
                  Dashboard
                </Link>
                <Link to="/workouts" className="text-muted-foreground hover:text-foreground hover:bg-muted/50 px-3 py-2 rounded-md text-sm font-medium">
                  Workouts
                </Link>
                <Link to="/goals" className="text-muted-foreground hover:text-foreground hover:bg-muted/50 px-3 py-2 rounded-md text-sm font-medium">
                  Goals
                </Link>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="text-muted-foreground hover:text-foreground hover:bg-muted/50 px-3 py-2 rounded-md text-sm font-medium">
                      <span>More</span>
                      <ChevronDown className="ml-2 h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56">
                    <DropdownMenuItem asChild>
                      <Link to="/workout-history" className="flex items-center">
                        <ClipboardList className="mr-2 h-4 w-4" />
                        <span>Workout History</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/workout-calendar" className="flex items-center">
                        <Calendar className="mr-2 h-4 w-4" />
                        <span>Calendar View</span>
                      </Link>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                if (theme === 'light') toggleTheme('dark');
                else if (theme === 'dark') toggleTheme('system');
                else toggleTheme('light');
              }}
              className="rounded-full"
            >
              {theme === 'light' && <Moon className="h-5 w-5" />}
              {theme === 'dark' && <Sun className="h-5 w-5" />}
              {theme === 'system' && <Sun className="h-5 w-5" />}
              <span className="sr-only">Toggle theme</span>
            </Button>
          </div>
        </div>
      </div>

      {isMenuOpen && (
        <div className="md:hidden fixed inset-0 bg-background/90 backdrop-blur-md z-50 pt-16">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link 
              to="/" 
              className="text-foreground hover:bg-muted/50 block px-3 py-2 rounded-md text-base font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              Dashboard
            </Link>
            <Link 
              to="/workouts" 
              className="text-foreground hover:bg-muted/50 block px-3 py-2 rounded-md text-base font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              Workouts
            </Link>
            <Link 
              to="/goals" 
              className="text-foreground hover:bg-muted/50 block px-3 py-2 rounded-md text-base font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              Goals
            </Link>
            <Link 
              to="/workout-history" 
              className="text-foreground hover:bg-muted/50 block px-3 py-2 rounded-md text-base font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              Workout History
            </Link>
            <Link 
              to="/workout-calendar" 
              className="text-foreground hover:bg-muted/50 block px-3 py-2 rounded-md text-base font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              Calendar View
            </Link>
          </div>
          
          <button
            onClick={() => setIsMenuOpen(false)}
            className="absolute top-4 right-4 p-2 rounded-md text-muted-foreground hover:text-foreground focus:outline-none"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
