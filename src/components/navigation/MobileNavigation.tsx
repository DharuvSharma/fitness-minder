
import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Home, Dumbbell, BarChart2, Trophy, User, History } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface MobileNavItemProps {
  icon: React.ElementType;
  label: string;
  path: string;
  isActive: boolean;
}

export const MobileNavItem = ({ icon: Icon, label, path, isActive }: MobileNavItemProps) => {
  return (
    <Link
      to={path}
      className="flex flex-col items-center justify-center w-full h-full"
      aria-label={label}
    >
      <div className="relative w-full flex flex-col items-center">
        {isActive && (
          <motion.div
            layoutId="mobileNavIndicator"
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
          {label}
        </span>
      </div>
    </Link>
  );
};

export const MobileNavigation = () => {
  const location = useLocation();
  
  const navItems = [
    { icon: Home, label: "Home", path: "/" },
    { icon: Dumbbell, label: "Workouts", path: "/workouts" },
    { icon: History, label: "History", path: "/workout-history" },
    { icon: Trophy, label: "Goals", path: "/goals" },
    { icon: User, label: "Profile", path: "/profile" },
  ];

  return (
    <motion.div 
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 260, damping: 20 }}
      className="fixed bottom-0 left-0 right-0 bg-background/80 backdrop-blur-md border-t border-border z-50 md:hidden"
    >
      <div className="flex justify-around items-center h-16">
        {navItems.map((item) => (
          <MobileNavItem 
            key={item.path}
            icon={item.icon}
            label={item.label}
            path={item.path}
            isActive={location.pathname === item.path}
          />
        ))}
      </div>
    </motion.div>
  );
};

export default MobileNavigation;
