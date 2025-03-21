
import React, { useEffect, useRef } from 'react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { cn } from '@/lib/utils';

export interface ProgressDataPoint {
  date: string;
  value: number;
}

export interface ProgressChartProps {
  data: ProgressDataPoint[];
  title: string;
  metric: string;
  color?: string;
  className?: string;
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-background p-3 shadow-md rounded-md border border-border text-sm">
        <p className="font-medium">{label}</p>
        <p className="text-fitness-accent">
          <span className="font-medium">{payload[0].value}</span>
        </p>
      </div>
    );
  }

  return null;
};

const ProgressChart: React.FC<ProgressChartProps> = ({
  data,
  title,
  metric,
  color = "#61DAFB",
  className,
}) => {
  const chartRef = useRef<HTMLDivElement>(null);
  
  // Animation effect
  useEffect(() => {
    if (chartRef.current) {
      chartRef.current.classList.add('animate-fade-in');
    }
  }, []);

  return (
    <div 
      ref={chartRef}
      className={cn(
        "glass-card p-5 rounded-2xl", 
        className
      )}
    >
      <div className="mb-4">
        <h3 className="section-title">{title}</h3>
        <p className="section-subtitle">
          Your {metric.toLowerCase()} over time
        </p>
      </div>
      
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{
              top: 10,
              right: 10,
              left: 0,
              bottom: 0,
            }}
          >
            <defs>
              <linearGradient id={`color${title.replace(/\s+/g, '')}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={color} stopOpacity={0.3} />
                <stop offset="95%" stopColor={color} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              dataKey="date" 
              tick={{ fontSize: 12 }} 
              tickLine={false}
              axisLine={{ stroke: '#f0f0f0' }}
            />
            <YAxis 
              tick={{ fontSize: 12 }} 
              tickLine={false}
              axisLine={{ stroke: '#f0f0f0' }}
              width={30}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area 
              type="monotone" 
              dataKey="value" 
              stroke={color} 
              fillOpacity={1} 
              fill={`url(#color${title.replace(/\s+/g, '')})`} 
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ProgressChart;
