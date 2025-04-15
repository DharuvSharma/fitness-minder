
import React, { useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Home, Dumbbell, BarChart2, Trophy, User, Settings, Calendar, InfoCircle, Bell, ChevronDown, ChevronUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { useIsMobile } from '@/hooks/use-mobile';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const Navigation = () => {
  const location = useLocation();
  const isMobile = useIsMobile();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  
  const mainNavItems = [
    { icon: Home, label: "Home", path: "/" },
    { icon: Dumbbell, label: "Workouts", path: "/workouts" },
    { icon: Trophy, label: "Goals", path: "/goals" },
    { icon: BarChart2, label: "Progress", path: "/progress" },
  ];
  
  const moreNavItems = [
    { icon: Calendar, label: "Calendar", path: "/workout-calendar" },
    { icon: InfoCircle, label: "About", path: "/about" },
    { icon: Bell, label: "Notifications", path: "/notifications" },
    { icon: Settings, label: "Settings", path: "/settings" },
  ];
  
  // Add Profile to mobile items
  const mobileNavItems = [
    ...mainNavItems,
    { icon: User, label: "Profile", path: "/profile" },
  ];

  // Desktop Navigation
  if (!isMobile) {
    return (
      <motion.div 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="hidden md:flex fixed top-0 left-0 right-0 bg-background/80 backdrop-blur-md border-b border-border z-50 h-16"
      >
        <div className="container flex items-center justify-between h-full">
          <Link to="/" className="text-xl font-bold">
            FitnessMinder
          </Link>
          
          <div className="flex items-center gap-1">
            {mainNavItems.map((item) => {
              const isActive = location.pathname === item.path;
              const Icon = item.icon;
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    "relative flex items-center gap-2 px-4 py-2 rounded-full transition-colors",
                    isActive 
                      ? "text-primary font-medium" 
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                  )}
                >
                  {isActive && (
                    <motion.div
                      layoutId="desktopNavIndicator"
                      className="absolute inset-0 bg-primary/10 rounded-full"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}

            {/* More Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  className={cn(
                    "relative flex items-center gap-2 px-4 py-2 rounded-full transition-colors",
                    moreNavItems.some(item => location.pathname === item.path)
                      ? "text-primary font-medium" 
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                  )}
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                >
                  <span>More</span>
                  {dropdownOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {moreNavItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.path;
                  
                  return (
                    <DropdownMenuItem key={item.path} asChild>
                      <Link
                        to={item.path}
                        className={cn(
                          "flex items-center gap-2 w-full",
                          isActive ? "text-primary font-medium" : ""
                        )}
                      >
                        <Icon className="h-4 w-4" />
                        <span>{item.label}</span>
                      </Link>
                    </DropdownMenuItem>
                  );
                })}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* User Profile - Always visible in desktop */}
            <Link
              to="/profile"
              className={cn(
                "relative flex items-center gap-2 px-4 py-2 rounded-full transition-colors",
                location.pathname === "/profile" 
                  ? "text-primary font-medium" 
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              )}
            >
              {location.pathname === "/profile" && (
                <motion.div
                  layoutId="desktopNavIndicator"
                  className="absolute inset-0 bg-primary/10 rounded-full"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              <User className="h-4 w-4" />
              <span>Profile</span>
            </Link>
          </div>
        </div>
      </motion.div>
    );
  }

  // Mobile Navigation
  return (
    <motion.div 
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 260, damping: 20 }}
      className="fixed bottom-0 left-0 right-0 bg-background/80 backdrop-blur-md border-t border-border z-50 md:hidden"
    >
      <div className="flex justify-around items-center h-16">
        {mobileNavItems.map((item) => {
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

export default Navigation;
