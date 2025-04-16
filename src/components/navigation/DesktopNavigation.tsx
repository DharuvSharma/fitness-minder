
import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Home, Dumbbell, BarChart2, Trophy, User, Settings, Calendar, Info, Bell, ChevronDown, ChevronUp, History } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface NavItemProps {
  icon: React.ElementType;
  label: string;
  path: string;
  isActive: boolean;
}

export const NavItem = ({ icon: Icon, label, path, isActive }: NavItemProps) => {
  return (
    <Link
      to={path}
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
      <span>{label}</span>
    </Link>
  );
};

export const MoreDropdown = ({ items, isOpen, setIsOpen, isAnyActive }: {
  items: { icon: React.ElementType; label: string; path: string; }[];
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  isAnyActive: boolean;
}) => {
  const location = useLocation();
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className={cn(
            "relative flex items-center gap-2 px-4 py-2 rounded-full transition-colors",
            isAnyActive
              ? "text-primary font-medium" 
              : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
          )}
          onClick={() => setIsOpen(!isOpen)}
        >
          <span>More</span>
          {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {items.map((item) => {
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
  );
};

export const DesktopNavigation = () => {
  const location = useLocation();
  const [dropdownOpen, setDropdownOpen] = React.useState(false);
  
  const mainNavItems = [
    { icon: Home, label: "Home", path: "/" },
    { icon: Dumbbell, label: "Workouts", path: "/workouts" },
    { icon: Trophy, label: "Goals", path: "/goals" },
    { icon: BarChart2, label: "Progress", path: "/progress" },
  ];
  
  const moreNavItems = [
    { icon: History, label: "Workout History", path: "/workout-history" },
    { icon: Calendar, label: "Calendar", path: "/workout-calendar" },
    { icon: Info, label: "About", path: "/about" },
    { icon: Bell, label: "Notifications", path: "/notifications" },
    { icon: Settings, label: "Settings", path: "/settings" },
  ];

  const isMoreItemActive = moreNavItems.some(item => location.pathname === item.path);

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
          {mainNavItems.map((item) => (
            <NavItem 
              key={item.path}
              icon={item.icon}
              label={item.label}
              path={item.path}
              isActive={location.pathname === item.path}
            />
          ))}

          <MoreDropdown 
            items={moreNavItems} 
            isOpen={dropdownOpen}
            setIsOpen={setDropdownOpen}
            isAnyActive={isMoreItemActive}
          />

          <NavItem 
            icon={User}
            label="Profile"
            path="/profile"
            isActive={location.pathname === "/profile"}
          />
        </div>
      </div>
    </motion.div>
  );
};

export default DesktopNavigation;
