
import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { 
  Home, Dumbbell, BarChart2, Target, User, LogOut
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from '@/components/ui/button';

type NavItem = {
  label: string;
  href: string;
  icon: React.ReactNode;
  requiresAuth?: boolean;
};

const Navbar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const { isAuthenticated, user, logout } = useAuth();

  // Define nav items with authentication requirements
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
      requiresAuth: true,
    },
    {
      label: 'Progress',
      href: '/progress',
      icon: <BarChart2 className="w-5 h-5" />,
      requiresAuth: true,
    },
    {
      label: 'Goals',
      href: '/goals',
      icon: <Target className="w-5 h-5" />,
      requiresAuth: true,
    },
    {
      label: 'Profile',
      href: '/profile',
      icon: <User className="w-5 h-5" />,
      requiresAuth: true,
    },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Filter nav items based on authentication status
  const filteredNavItems = navItems.filter(item => 
    !item.requiresAuth || (item.requiresAuth && isAuthenticated)
  );

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
            <Link to="/" className="flex items-center">
              <span className="font-semibold tracking-tighter text-lg text-fitness-accent">
                Fitness
              </span>
              <span className="font-semibold tracking-tighter text-lg">Minder</span>
            </Link>
          </div>
          
          <ul className="flex w-full md:w-auto justify-around md:justify-center md:space-x-8">
            {filteredNavItems.map((item) => (
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
            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                      <span className="font-medium text-sm">{user?.name.charAt(0)}</span>
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="flex items-center justify-start gap-2 p-2">
                    <div className="flex flex-col space-y-0.5">
                      <p className="text-sm font-medium">{user?.name}</p>
                      <p className="text-xs text-muted-foreground">{user?.email}</p>
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/profile">
                      <User className="mr-2 h-4 w-4" />
                      <span>Profile</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button
                className="px-4 py-2 rounded-md bg-fitness-accent text-white font-medium text-sm transition-all hover:bg-fitness-accent/90"
                onClick={() => navigate('/login')}
              >
                Sign In
              </Button>
            )}
          </div>
        </nav>
      </div>
    </div>
  );
};

export default Navbar;
