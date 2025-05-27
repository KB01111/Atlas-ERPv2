import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';

interface ChartData {
  name: string;
  value: number;
  date?: string;
  [key: string]: any;
}

interface RealtimeChartProps {
  title: string;
  type?: 'line' | 'bar';
  dataEndpoint: string;
  refreshInterval?: number; // in milliseconds
  height?: number;
  color?: string;
  showLegend?: boolean;
  showGrid?: boolean;
}

export default function RealtimeChart({
  title,
  type = 'line',
  dataEndpoint,
  refreshInterval = 30000, // 30 seconds
  height = 300,
  color = '#8884d8',
  showLegend = true,
  showGrid = true
}: RealtimeChartProps) {
  const [data, setData] = useState<ChartData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchData = async () => {
    try {
      // Get auth token from localStorage
      const session = localStorage.getItem('supabase_session');
      const token = session ? JSON.parse(session).access_token : null;

      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      };

      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(dataEndpoint, {
        headers,
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch data: ${response.statusText}`);
      }

      const result = await response.json();
      
      // Handle different response formats
      let chartData: ChartData[] = [];
      
      if (Array.isArray(result)) {
        chartData = result;
      } else if (result.data && Array.isArray(result.data)) {
        chartData = result.data;
      } else if (result.trends && Array.isArray(result.trends)) {
        chartData = result.trends;
      } else {
        throw new Error('Invalid data format received');
      }

      setData(chartData);
      setError(null);
      setLastUpdated(new Date());
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch data';
      setError(errorMessage);
      console.error('Chart data fetch error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();

    // Set up interval for real-time updates
    const interval = setInterval(fetchData, refreshInterval);

    return () => clearInterval(interval);
  }, [dataEndpoint, refreshInterval]);

  const formatTooltipValue = (value: any, name: string) => {
    if (typeof value === 'number') {
      return [value.toLocaleString(), name];
    }
    return [value, name];
  };

  const formatXAxisLabel = (tickItem: any) => {
    // Try to format as date if it looks like a date
    if (typeof tickItem === 'string' && tickItem.match(/^\d{4}-\d{2}/)) {
      try {
        return new Date(tickItem).toLocaleDateString('en-US', { 
          month: 'short', 
          day: 'numeric' 
        });
      } catch {
        return tickItem;
      }
    }
    return tickItem;
  };

  if (isLoading) {
    return (
      <div className="bg-card p-6 rounded-lg border">
        <h3 className="text-lg font-semibold mb-4">{title}</h3>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-card p-6 rounded-lg border">
        <h3 className="text-lg font-semibold mb-4">{title}</h3>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="text-destructive mb-2">⚠️</div>
            <p className="text-sm text-muted-foreground">{error}</p>
            <button
              onClick={fetchData}
              className="mt-2 px-3 py-1 text-xs bg-primary text-primary-foreground rounded hover:bg-primary/90"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card p-6 rounded-lg border">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">{title}</h3>
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-xs text-muted-foreground">
            {lastUpdated ? `Updated ${lastUpdated.toLocaleTimeString()}` : 'Live'}
          </span>
        </div>
      </div>

      {data.length === 0 ? (
        <div className="flex items-center justify-center h-64">
          <p className="text-muted-foreground">No data available</p>
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={height}>
          {type === 'line' ? (
            <LineChart data={data}>
              {showGrid && <CartesianGrid strokeDasharray="3 3" />}
              <XAxis 
                dataKey="name" 
                tickFormatter={formatXAxisLabel}
                fontSize={12}
              />
              <YAxis fontSize={12} />
              <Tooltip 
                formatter={formatTooltipValue}
                labelStyle={{ color: 'var(--foreground)' }}
                contentStyle={{ 
                  backgroundColor: 'var(--card)',
                  border: '1px solid var(--border)',
                  borderRadius: '6px'
                }}
              />
              {showLegend && <Legend />}
              <Line 
                type="monotone" 
                dataKey="value" 
                stroke={color} 
                strokeWidth={2}
                dot={{ fill: color, strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: color, strokeWidth: 2 }}
              />
            </LineChart>
          ) : (
            <BarChart data={data}>
              {showGrid && <CartesianGrid strokeDasharray="3 3" />}
              <XAxis 
                dataKey="name" 
                tickFormatter={formatXAxisLabel}
                fontSize={12}
              />
              <YAxis fontSize={12} />
              <Tooltip 
                formatter={formatTooltipValue}
                labelStyle={{ color: 'var(--foreground)' }}
                contentStyle={{ 
                  backgroundColor: 'var(--card)',
                  border: '1px solid var(--border)',
                  borderRadius: '6px'
                }}
              />
              {showLegend && <Legend />}
              <Bar dataKey="value" fill={color} />
            </BarChart>
          )}
        </ResponsiveContainer>
      )}
    </div>
  );
}
