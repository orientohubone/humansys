import React, { memo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { cn } from '@/lib/utils';

interface TrendData {
  date: string;
  value: number;
  label?: string;
}

interface TrendChartProps {
  data: TrendData[];
  color?: string;
  type?: 'line' | 'area';
  showGrid?: boolean;
  animate?: boolean;
  height?: number;
  className?: string;
}

export const TrendChart: React.FC<TrendChartProps> = memo(({
  data,
  color = '#22c55e',
  type = 'line',
  showGrid = true,
  animate = false, // Desabilitar animação para evitar flickering
  height = 200,
  className
}) => {
  const formatTooltip = (value: any, name: string) => {
    return [value, name || 'Valor'];
  };

  const formatLabel = (label: string) => {
    const date = new Date(label);
    return date.toLocaleDateString('pt-BR', { 
      day: '2-digit', 
      month: 'short' 
    });
  };

  if (type === 'area') {
    return (
      <div className={cn("w-full", className)} style={{ height }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
            {showGrid && <CartesianGrid strokeDasharray="3 3" opacity={0.3} />}
            <XAxis 
              dataKey="date" 
              axisLine={false}
              tickLine={false}
              fontSize={12}
              tickFormatter={formatLabel}
            />
            <YAxis 
              axisLine={false}
              tickLine={false}
              fontSize={12}
            />
            <Tooltip 
              formatter={formatTooltip}
              labelFormatter={formatLabel}
              contentStyle={{
                backgroundColor: 'hsl(var(--background))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
                fontSize: '12px'
              }}
            />
            <Area 
              type="monotone" 
              dataKey="value" 
              stroke={color}
              fill={color}
              fillOpacity={0.2}
              strokeWidth={2}
              isAnimationActive={animate}
              animationDuration={animate ? 750 : 0}
              animationEasing="ease-out"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    );
  }

  return (
    <div className={cn("w-full", className)} style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
          {showGrid && <CartesianGrid strokeDasharray="3 3" opacity={0.3} />}
          <XAxis 
            dataKey="date" 
            axisLine={false}
            tickLine={false}
            fontSize={12}
            tickFormatter={formatLabel}
          />
          <YAxis 
            axisLine={false}
            tickLine={false}
            fontSize={12}
          />
          <Tooltip 
            formatter={formatTooltip}
            labelFormatter={formatLabel}
            contentStyle={{
              backgroundColor: 'hsl(var(--background))',
              border: '1px solid hsl(var(--border))',
              borderRadius: '8px',
              fontSize: '12px'
            }}
          />
          <Line 
            type="monotone" 
            dataKey="value" 
            stroke={color}
            strokeWidth={2}
            dot={{ fill: color, r: 4 }}
            activeDot={{ r: 6, fill: color }}
            isAnimationActive={animate}
            animationDuration={animate ? 750 : 0}
            animationEasing="ease-out"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
});