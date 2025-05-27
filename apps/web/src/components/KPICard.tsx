import type { LucideIcon } from 'lucide-react';
import { Minus, TrendingDown, TrendingUp } from 'lucide-react';

interface KPICardProps {
  title: string;
  value: number | string;
  change?: number;
  icon?: LucideIcon;
  color?: 'blue' | 'green' | 'red' | 'yellow' | 'purple';
  format?: 'currency' | 'percentage' | 'number';
  className?: string;
}

const colorClasses = {
  blue: {
    bg: 'bg-blue-50 dark:bg-blue-950',
    icon: 'text-blue-600 dark:text-blue-400',
    border: 'border-blue-200 dark:border-blue-800',
  },
  green: {
    bg: 'bg-green-50 dark:bg-green-950',
    icon: 'text-green-600 dark:text-green-400',
    border: 'border-green-200 dark:border-green-800',
  },
  red: {
    bg: 'bg-red-50 dark:bg-red-950',
    icon: 'text-red-600 dark:text-red-400',
    border: 'border-red-200 dark:border-red-800',
  },
  yellow: {
    bg: 'bg-yellow-50 dark:bg-yellow-950',
    icon: 'text-yellow-600 dark:text-yellow-400',
    border: 'border-yellow-200 dark:border-yellow-800',
  },
  purple: {
    bg: 'bg-purple-50 dark:bg-purple-950',
    icon: 'text-purple-600 dark:text-purple-400',
    border: 'border-purple-200 dark:border-purple-800',
  },
};

export default function KPICard({
  title,
  value,
  change,
  icon: Icon,
  color = 'blue',
  format = 'number',
  className = '',
}: KPICardProps) {
  const formatValue = (val: number | string): string => {
    if (typeof val === 'string') {
      return val;
    }

    switch (format) {
      case 'currency':
        return new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD',
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
        }).format(val);
      case 'percentage':
        return `${val}%`;
      default:
        return new Intl.NumberFormat('en-US').format(val);
    }
  };

  const getTrendIcon = () => {
    if (change === undefined || change === 0) return <Minus className='w-4 h-4' />;
    return change > 0 ? (
      <TrendingUp className='w-4 h-4 text-green-600' />
    ) : (
      <TrendingDown className='w-4 h-4 text-red-600' />
    );
  };

  const getTrendColor = () => {
    if (change === undefined || change === 0) return 'text-gray-600';
    return change > 0 ? 'text-green-600' : 'text-red-600';
  };

  const colors = colorClasses[color];

  return (
    <div
      className={`
        relative overflow-hidden rounded-xl border ${colors.border} ${colors.bg}
        p-6 shadow-sm transition-all duration-200 hover:shadow-md
        ${className}
      `}
    >
      <div className='flex items-center justify-between'>
        <div className='flex-1'>
          <p className='text-sm font-medium text-muted-foreground'>{title}</p>
          <p className='text-2xl font-bold text-foreground mt-1'>{formatValue(value)}</p>
          {change !== undefined && (
            <div className='flex items-center gap-1 mt-2'>
              {getTrendIcon()}
              <span className={`text-sm font-medium ${getTrendColor()}`}>{Math.abs(change)}%</span>
              <span className='text-xs text-muted-foreground'>vs last month</span>
            </div>
          )}
        </div>
        {Icon && (
          <div className={`p-3 rounded-lg ${colors.bg}`}>
            <Icon className={`w-6 h-6 ${colors.icon}`} />
          </div>
        )}
      </div>

      {/* Subtle background pattern */}
      <div className='absolute inset-0 opacity-5'>
        <div className='absolute inset-0 bg-gradient-to-br from-transparent via-white to-transparent' />
      </div>
    </div>
  );
}
