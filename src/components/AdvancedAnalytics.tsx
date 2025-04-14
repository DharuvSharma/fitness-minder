
import React from 'react';
import { cn } from '@/lib/utils';
import { 
  Clock, 
  Flame, 
  BarChart, 
  TrendingUp,
  CalendarDays,
  TrendingDown,
  Target
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Workout } from '@/types';
import { analyticsService } from '@/services/analyticsService';

interface AnalyticCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  description?: string;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  className?: string;
}

const AnalyticCard: React.FC<AnalyticCardProps> = ({
  title,
  value,
  icon,
  description,
  trend,
  trendValue,
  className,
}) => {
  return (
    <div className={cn("glass-card rounded-2xl p-5", className)}>
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
        <div className="text-muted-foreground">{icon}</div>
      </div>
      <div className="flex items-end gap-2">
        <div className="text-2xl font-bold">{value}</div>
        {trend && trendValue && (
          <div className={cn(
            "text-xs font-medium flex items-center gap-1",
            trend === 'up' ? 'text-green-500' : trend === 'down' ? 'text-red-500' : 'text-muted-foreground'
          )}>
            {trend === 'up' ? <TrendingUp className="w-3 h-3" /> : trend === 'down' ? <TrendingDown className="w-3 h-3" /> : null}
            {trendValue}
          </div>
        )}
      </div>
      {description && <p className="text-xs text-muted-foreground mt-1">{description}</p>}
    </div>
  );
};

interface AdvancedAnalyticsProps {
  workouts: Workout[];
  dateRange: string;
  className?: string;
}

const AdvancedAnalytics: React.FC<AdvancedAnalyticsProps> = ({
  workouts,
  dateRange,
  className,
}) => {
  // Get days value from dateRange
  const days = dateRange === 'the last 7 days' ? 7 : 30;
  
  // Use analyticsService to get analytics
  const analytics = analyticsService.getAnalytics(workouts, { 
    days,
    compareWithPrevious: true
  });
  
  // Format the most frequent type for display
  const formattedMostFrequentType = analytics.mostFrequentType === 'none' 
    ? 'None' 
    : analytics.mostFrequentType.charAt(0).toUpperCase() + analytics.mostFrequentType.slice(1);

  return (
    <div className={cn("", className)}>
      <Tabs defaultValue="overview">
        <TabsList className="mb-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="duration">Duration</TabsTrigger>
          <TabsTrigger value="calories">Calories</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <AnalyticCard
            title="Total Workouts"
            value={analytics.totalWorkouts}
            icon={<CalendarDays className="w-4 h-4" />}
            description={`Completed in ${dateRange}`}
            trend={analytics.workoutTrend}
            trendValue={analytics.trendPercentage ? `${analytics.trendPercentage}%` : undefined}
          />
          <AnalyticCard
            title="Total Duration"
            value={`${analytics.totalDuration} mins`}
            icon={<Clock className="w-4 h-4" />}
            description="Time invested in your fitness"
          />
          <AnalyticCard
            title="Total Calories"
            value={analytics.totalCalories}
            icon={<Flame className="w-4 h-4" />}
            description="Calories burned across workouts"
            trend={analytics.calorieTrend}
            trendValue={analytics.workoutTrend !== 'neutral' ? 'from previous period' : undefined}
          />
          <AnalyticCard
            title="Most Common Type"
            value={formattedMostFrequentType}
            icon={<Target className="w-4 h-4" />}
            description={analytics.mostFrequentType !== 'none' ? 
              `${analytics.frequencyByType[analytics.mostFrequentType]} workouts` : 
              "No workouts completed"}
          />
        </TabsContent>
        
        <TabsContent value="duration" className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <AnalyticCard
            title="Average Duration"
            value={`${analytics.avgDuration} mins`}
            icon={<Clock className="w-4 h-4" />}
            description="Per workout"
          />
          {Object.entries(analytics.frequencyByType).map(([type, count]) => {
            const avgTypeDuration = workouts
              .filter(w => w.type === type && w.completed)
              .reduce((sum, w) => sum + w.duration, 0) / count;
            
            return (
              <AnalyticCard
                key={type}
                title={`${type.charAt(0).toUpperCase() + type.slice(1)} Duration`}
                value={`${Math.round(avgTypeDuration)} mins`}
                icon={<BarChart className="w-4 h-4" />}
                description={`Avg for ${count} workouts`}
              />
            );
          })}
        </TabsContent>
        
        <TabsContent value="calories" className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <AnalyticCard
            title="Average Calories"
            value={analytics.avgCalories}
            icon={<Flame className="w-4 h-4" />}
            description="Per workout"
          />
          {Object.entries(analytics.caloriesByType).map(([type, calories]) => {
            const typeCount = analytics.frequencyByType[type] || 0;
            
            return (
              <AnalyticCard
                key={type}
                title={`${type.charAt(0).toUpperCase() + type.slice(1)} Calories`}
                value={calories}
                icon={<BarChart className="w-4 h-4" />}
                description={`Across ${typeCount} workouts`}
              />
            );
          })}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdvancedAnalytics;
