
import React from 'react';
import { User, Mail, MapPin, Calendar, Workflow } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';

interface UserProfileProps {
  className?: string;
}

const UserProfile: React.FC<UserProfileProps> = ({ className }) => {
  // This would come from a real API or auth service in a real app
  const userData = {
    name: "Alex Johnson",
    username: "alexj",
    email: "alex@example.com",
    location: "San Francisco, CA",
    memberSince: "January 2023",
    fitnessLevel: "Intermediate",
    avatarUrl: "",
    stats: {
      workoutsCompleted: 27,
      currentStreak: 5,
      totalMinutes: 843,
      caloriesBurned: 9254
    }
  };

  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardHeader className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white p-6">
        <div className="flex flex-col items-center">
          <Avatar className="h-24 w-24 border-4 border-white">
            <AvatarImage src={userData.avatarUrl} alt={userData.name} />
            <AvatarFallback className="text-2xl bg-indigo-300 text-indigo-800">
              {userData.name.split(' ').map(n => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
          <h2 className="text-xl font-bold mt-4">{userData.name}</h2>
          <p className="text-indigo-100 text-sm">@{userData.username}</p>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-4">
          <div className="flex items-center text-sm">
            <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
            <span>{userData.email}</span>
          </div>
          <div className="flex items-center text-sm">
            <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
            <span>{userData.location}</span>
          </div>
          <div className="flex items-center text-sm">
            <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
            <span>Member since {userData.memberSince}</span>
          </div>
          <div className="flex items-center text-sm">
            <Workflow className="h-4 w-4 mr-2 text-muted-foreground" />
            <span>Fitness Level: {userData.fitnessLevel}</span>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4 mt-6">
          <div className="bg-slate-100 dark:bg-slate-800 p-3 rounded-lg text-center">
            <p className="text-xl font-semibold">{userData.stats.workoutsCompleted}</p>
            <p className="text-xs text-muted-foreground">Workouts</p>
          </div>
          <div className="bg-slate-100 dark:bg-slate-800 p-3 rounded-lg text-center">
            <p className="text-xl font-semibold">{userData.stats.currentStreak} days</p>
            <p className="text-xs text-muted-foreground">Current Streak</p>
          </div>
        </div>
      </CardContent>
      <CardFooter className="border-t bg-slate-50 dark:bg-slate-900 px-6 py-4">
        <Button variant="outline" className="w-full">Edit Profile</Button>
      </CardFooter>
    </Card>
  );
};

export default UserProfile;
