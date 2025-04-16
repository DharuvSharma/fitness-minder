
import React from 'react';
import { motion } from 'framer-motion';
import { User, Settings, Activity, Calendar, History } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import UserProfile from '@/components/UserProfile';

const Profile: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 pb-20 md:pb-0">
      <div className="container mx-auto px-4 pt-6 animate-fade-in">
        <header className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-50">
            My Profile
          </h1>
          <p className="text-muted-foreground">
            Manage your account settings and preferences
          </p>
        </header>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* User Profile Card */}
          <div className="md:col-span-1">
            <UserProfile className="shadow-md dark:bg-gray-800 dark:border-gray-700" />
          </div>
          
          {/* Main Content */}
          <div className="md:col-span-2">
            <Tabs defaultValue="stats" className="w-full">
              <TabsList className="grid w-full grid-cols-3 mb-6">
                <TabsTrigger value="stats" className="flex items-center gap-2">
                  <Activity className="h-4 w-4" />
                  <span className="hidden sm:inline">Stats</span>
                </TabsTrigger>
                <TabsTrigger value="history" className="flex items-center gap-2">
                  <History className="h-4 w-4" />
                  <span className="hidden sm:inline">History</span>
                </TabsTrigger>
                <TabsTrigger value="settings" className="flex items-center gap-2">
                  <Settings className="h-4 w-4" />
                  <span className="hidden sm:inline">Preferences</span>
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="stats">
                <Card>
                  <CardHeader>
                    <CardTitle>Workout Statistics</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-indigo-50 dark:bg-indigo-900/30 rounded-lg p-4">
                        <p className="text-sm text-gray-500 dark:text-gray-400">Workouts Completed</p>
                        <p className="text-2xl font-bold">27</p>
                      </div>
                      <div className="bg-green-50 dark:bg-green-900/30 rounded-lg p-4">
                        <p className="text-sm text-gray-500 dark:text-gray-400">Current Streak</p>
                        <p className="text-2xl font-bold">5 days</p>
                      </div>
                      <div className="bg-amber-50 dark:bg-amber-900/30 rounded-lg p-4">
                        <p className="text-sm text-gray-500 dark:text-gray-400">Total Minutes</p>
                        <p className="text-2xl font-bold">843</p>
                      </div>
                      <div className="bg-red-50 dark:bg-red-900/30 rounded-lg p-4">
                        <p className="text-sm text-gray-500 dark:text-gray-400">Calories Burned</p>
                        <p className="text-2xl font-bold">9,254</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="mt-6">
                  <CardHeader>
                    <CardTitle>Goals Progress</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm font-medium">Weekly workouts</span>
                          <span className="text-sm font-medium">3/4</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                          <div className="bg-indigo-600 h-2.5 rounded-full" style={{ width: '75%' }}></div>
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm font-medium">Weight loss</span>
                          <span className="text-sm font-medium">5/10 lbs</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                          <div className="bg-green-600 h-2.5 rounded-full" style={{ width: '50%' }}></div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="history">
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Activity</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {[1, 2, 3].map((item) => (
                        <div 
                          key={item} 
                          className="flex items-center p-3 border rounded-lg border-gray-200 dark:border-gray-700"
                        >
                          <div className="mr-4 bg-indigo-100 dark:bg-indigo-900/50 p-2 rounded-md">
                            <Calendar className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                          </div>
                          <div>
                            <h4 className="text-sm font-medium">Completed 30 min HIIT workout</h4>
                            <p className="text-xs text-gray-500">2 days ago</p>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <Button variant="outline" className="w-full mt-4">
                      View Full History
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="settings">
                <Card>
                  <CardHeader>
                    <CardTitle>Workout Preferences</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <form className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">Default Workout Duration</label>
                        <select className="w-full p-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600">
                          <option>30 minutes</option>
                          <option>45 minutes</option>
                          <option>60 minutes</option>
                          <option>90 minutes</option>
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium mb-1">Preferred Workout Type</label>
                        <select className="w-full p-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600">
                          <option>Cardio</option>
                          <option>Strength</option>
                          <option>HIIT</option>
                          <option>Yoga</option>
                          <option>Pilates</option>
                        </select>
                      </div>
                      
                      <Button type="button" className="w-full mt-4 bg-indigo-600 hover:bg-indigo-700">
                        Save Preferences
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
