
import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Home, Dumbbell, BarChart2, Trophy, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { useIsMobile } from '@/hooks/use-mobile';

export const BottomNavbar = () => {
  const location = useLocation();
  const isMobile = useIsMobile();
  
  if (!isMobile) return null;
  
  const navItems = [
    { icon: Home, label: "Home", path: "/" },
    { icon: Dumbbell, label: "Workouts", path: "/workouts" },
    { icon: Trophy, label: "Goals", path: "/goals" },
    { icon: BarChart2, label: "Progress", path: "/progress" },
    { icon: User, label: "Profile", path: "/profile" },
  ];

  return (
    <motion.div 
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 260, damping: 20 }}
      className="fixed bottom-0 left-0 right-0 bg-background/80 backdrop-blur-md dark:bg-gray-950/90 shadow-lg border-t border-border z-50 md:hidden"
    >
      <div className="flex justify-around items-center h-16 px-2">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className="flex flex-col items-center justify-center w-full h-full"
              aria-label={item.label}
            >
              <div className="relative w-full flex flex-col items-center">
                {isActive && (
                  <motion.div
                    layoutId="navIndicator"
                    className="absolute -top-3 h-1 w-12 bg-primary rounded-full"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <Icon 
                  className={cn(
                    "h-5 w-5 mb-1 transition-colors duration-200",
                    isActive 
                      ? "text-primary" 
                      : "text-muted-foreground"
                  )} 
                />
                <span 
                  className={cn(
                    "text-xs transition-colors duration-200",
                    isActive 
                      ? "font-medium text-primary" 
                      : "text-muted-foreground"
                  )}
                >
                  {item.label}
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </motion.div>
  );
};

export default BottomNavbar;
