import React, { useEffect, useState } from 'react';

// Inline Button component for now
const Button = ({
  children,
  onClick,
  variant = 'default',
  className = '',
}: {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: string;
  className?: string;
}) => (
  <button
    onClick={onClick}
    className={`inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 ${
      variant === 'outline'
        ? 'border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground'
        : 'bg-primary text-primary-foreground shadow hover:bg-primary/90'
    } h-9 px-4 py-2 ${className}`}
  >
    {children}
  </button>
);

// Inline Card component for now
const Card = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <div className={`rounded-xl border bg-card text-card-foreground shadow ${className}`}>
    {children}
  </div>
);

interface StatsData {
  totalProjects: number;
  activeUsers: number;
  revenue: number;
  growth: number;
}

export default function DashboardStats() {
  const [stats, setStats] = useState<StatsData>({
    totalProjects: 0,
    activeUsers: 0,
    revenue: 0,
    growth: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    const fetchStats = async () => {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setStats({
        totalProjects: 142,
        activeUsers: 1284,
        revenue: 89432,
        growth: 12.5,
      });
      setIsLoading(false);
    };

    fetchStats();
  }, []);

  const refreshStats = () => {
    setIsLoading(true);
    setStats(prev => ({
      totalProjects: prev.totalProjects + Math.floor(Math.random() * 5),
      activeUsers: prev.activeUsers + Math.floor(Math.random() * 20),
      revenue: prev.revenue + Math.floor(Math.random() * 1000),
      growth: +(prev.growth + (Math.random() - 0.5) * 2).toFixed(1),
    }));
    setTimeout(() => setIsLoading(false), 500);
  };

  if (isLoading) {
    return (
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
        {[...Array(4)].map((_, i) => (
          <Card key={i} className='p-6'>
            <div className='animate-pulse'>
              <div className='h-4 bg-gray-200 rounded w-3/4 mb-2'></div>
              <div className='h-8 bg-gray-200 rounded w-1/2'></div>
            </div>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className='space-y-6'>
      <div className='flex justify-between items-center'>
        <h2 className='text-2xl font-bold'>Dashboard Overview</h2>
        <Button onClick={refreshStats} variant='outline'>
          Refresh Stats
        </Button>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
        <Card className='p-6'>
          <div className='flex flex-col'>
            <span className='text-sm font-medium text-muted-foreground'>Total Projects</span>
            <span className='text-2xl font-bold'>{stats.totalProjects}</span>
          </div>
        </Card>

        <Card className='p-6'>
          <div className='flex flex-col'>
            <span className='text-sm font-medium text-muted-foreground'>Active Users</span>
            <span className='text-2xl font-bold'>{stats.activeUsers.toLocaleString()}</span>
          </div>
        </Card>

        <Card className='p-6'>
          <div className='flex flex-col'>
            <span className='text-sm font-medium text-muted-foreground'>Revenue</span>
            <span className='text-2xl font-bold'>${stats.revenue.toLocaleString()}</span>
          </div>
        </Card>

        <Card className='p-6'>
          <div className='flex flex-col'>
            <span className='text-sm font-medium text-muted-foreground'>Growth</span>
            <span
              className={`text-2xl font-bold ${stats.growth >= 0 ? 'text-green-600' : 'text-red-600'}`}
            >
              {stats.growth >= 0 ? '+' : ''}
              {stats.growth}%
            </span>
          </div>
        </Card>
      </div>
    </div>
  );
}
