
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const DashboardSkeleton = () => {
  return (
    <div className="animate-fade-in space-y-6">
      {/* Stats Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="border-none shadow-md bg-white/80 backdrop-blur-sm dark:bg-gray-800/50">
            <CardHeader className="p-4 pb-0">
              <Skeleton className="h-4 w-24" />
            </CardHeader>
            <CardContent className="p-4">
              <Skeleton className="h-8 w-16 mb-2" />
              <Skeleton className="h-4 w-36" />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Chart Skeleton */}
      <Card className="border-none shadow-md bg-white/80 backdrop-blur-sm dark:bg-gray-800/50">
        <CardContent className="p-4">
          <Skeleton className="h-[200px] w-full" />
        </CardContent>
      </Card>

      {/* Workouts and Goals Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2 border-none shadow-md bg-white/80 backdrop-blur-sm dark:bg-gray-800/50">
          <CardHeader className="p-4 pb-0">
            <CardTitle className="text-xl font-semibold">
              <Skeleton className="h-6 w-48" />
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <div className="h-[180px]">
              <Skeleton className="h-full w-full" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-none shadow-md bg-white/80 backdrop-blur-sm dark:bg-gray-800/50">
          <CardHeader className="p-4 pb-0">
            <CardTitle className="text-xl font-semibold">
              <Skeleton className="h-6 w-36" />
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Workouts Skeleton */}
      <Card className="border-none shadow-md bg-white/80 backdrop-blur-sm dark:bg-gray-800/50">
        <CardHeader className="p-4 pb-0">
          <Skeleton className="h-6 w-48" />
        </CardHeader>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-32 w-full rounded-lg" />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
