import { clsx } from 'clsx';
import {
  Activity,
  ArrowDownRight,
  ArrowUpRight,
  BarChart3,
  DollarSign,
  Minus,
  Target,
  Users,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { twMerge } from 'tailwind-merge';

// Local utility function
function cn(...inputs: (string | undefined | null | boolean)[]) {
  return twMerge(clsx(inputs));
}

interface KPICardProps {
  title: string;
  value: number | string;
  change?: number;
  trend?: 'up' | 'down' | 'neutral';
  format?: 'currency' | 'percentage' | 'number';
  color?: 'blue' | 'green' | 'red' | 'yellow' | 'purple' | 'indigo';
  icon?: 'dollar' | 'users' | 'activity' | 'target' | 'chart';
  subtitle?: string;
  target?: number;
  animated?: boolean;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'glass' | 'gradient' | 'minimal';
  className?: string;
}

const iconMap = {
  dollar: DollarSign,
  users: Users,
  activity: Activity,
  target: Target,
  chart: BarChart3,
};

const colorSchemes = {
  blue: {
    bg: 'from-blue-50 to-blue-100',
    border: 'border-blue-200',
    icon: 'text-blue-600',
    accent: 'bg-blue-500',
    text: 'text-blue-700',
  },
  green: {
    bg: 'from-green-50 to-green-100',
    border: 'border-green-200',
    icon: 'text-green-600',
    accent: 'bg-green-500',
    text: 'text-green-700',
  },
  red: {
    bg: 'from-red-50 to-red-100',
    border: 'border-red-200',
    icon: 'text-red-600',
    accent: 'bg-red-500',
    text: 'text-red-700',
  },
  yellow: {
    bg: 'from-yellow-50 to-yellow-100',
    border: 'border-yellow-200',
    icon: 'text-yellow-600',
    accent: 'bg-yellow-500',
    text: 'text-yellow-700',
  },
  purple: {
    bg: 'from-purple-50 to-purple-100',
    border: 'border-purple-200',
    icon: 'text-purple-600',
    accent: 'bg-purple-500',
    text: 'text-purple-700',
  },
  indigo: {
    bg: 'from-indigo-50 to-indigo-100',
    border: 'border-indigo-200',
    icon: 'text-indigo-600',
    accent: 'bg-indigo-500',
    text: 'text-indigo-700',
  },
};

const sizeClasses = {
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
};

export default function EnhancedKPICard({
  title,
  value,
  change,
  trend,
  format = 'number',
  color = 'blue',
  icon,
  subtitle,
  target,
  animated = true,
  size = 'md',
  variant = 'default',
  className,
}: KPICardProps) {
  const [displayValue, setDisplayValue] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  const IconComponent = icon ? iconMap[icon] : null;
  const colorScheme = colorSchemes[color];

  // Animate number counting
  useEffect(() => {
    if (!animated || typeof value !== 'number') {
      setDisplayValue(value as number);
      return;
    }

    const timer = setTimeout(() => setIsVisible(true), 100);

    if (isVisible) {
      const duration = 1000;
      const steps = 60;
      const increment = (value as number) / steps;
      let current = 0;

      const counter = setInterval(() => {
        current += increment;
        if (current >= (value as number)) {
          setDisplayValue(value as number);
          clearInterval(counter);
        } else {
          setDisplayValue(Math.floor(current));
        }
      }, duration / steps);

      return () => clearInterval(counter);
    }

    return () => clearTimeout(timer);
  }, [value, animated, isVisible]);

  const formatValue = (val: number | string): string => {
    if (typeof val === 'string') return val;

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
      <ArrowUpRight className='w-4 h-4 text-green-600' />
    ) : (
      <ArrowDownRight className='w-4 h-4 text-red-600' />
    );
  };

  const getTrendColor = () => {
    if (change === undefined || change === 0) return 'text-neutral-600';
    return change > 0 ? 'text-green-600' : 'text-red-600';
  };

  const getVariantClasses = () => {
    switch (variant) {
      case 'glass':
        return 'glass border-white/20 shadow-lg';
      case 'gradient':
        return `bg-gradient-to-br ${colorScheme.bg} border ${colorScheme.border}`;
      case 'minimal':
        return 'bg-white border border-neutral-200 shadow-sm';
      default:
        return 'bg-white border border-neutral-200 shadow-md';
    }
  };

  const progressPercentage = target ? Math.min(((displayValue as number) / target) * 100, 100) : 0;

  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-xl transition-all duration-300',
        'hover:shadow-lg hover:-translate-y-1 group',
        getVariantClasses(),
        sizeClasses[size],
        animated && 'animate-fade-in',
        className
      )}
    >
      {/* Background Pattern */}
      <div className='absolute inset-0 opacity-5'>
        <div className='absolute -right-4 -top-4 w-24 h-24 rounded-full bg-current'></div>
        <div className='absolute -left-2 -bottom-2 w-16 h-16 rounded-full bg-current'></div>
      </div>

      {/* Content */}
      <div className='relative z-10'>
        {/* Header */}
        <div className='flex items-start justify-between mb-4'>
          <div className='flex-1'>
            <h3 className='text-sm font-medium text-neutral-600 mb-1'>{title}</h3>
            {subtitle && <p className='text-xs text-neutral-500'>{subtitle}</p>}
          </div>

          {IconComponent && (
            <div
              className={cn(
                'p-2 rounded-lg transition-transform group-hover:scale-110',
                variant === 'gradient' ? 'bg-white/50' : `bg-${color}-50`,
                colorScheme.icon
              )}
            >
              <IconComponent className='w-5 h-5' />
            </div>
          )}
        </div>

        {/* Main Value */}
        <div className='mb-4'>
          <p className='text-3xl font-bold text-neutral-900 mb-1'>{formatValue(displayValue)}</p>

          {/* Change Indicator */}
          {change !== undefined && (
            <div className={cn('flex items-center space-x-1 text-sm', getTrendColor())}>
              {getTrendIcon()}
              <span className='font-medium'>
                {change > 0 ? '+' : ''}
                {change}%
              </span>
              <span className='text-neutral-500'>vs last period</span>
            </div>
          )}
        </div>

        {/* Progress Bar (if target is provided) */}
        {target && (
          <div className='space-y-2'>
            <div className='flex justify-between text-xs text-neutral-600'>
              <span>Progress</span>
              <span>{Math.round(progressPercentage)}% of target</span>
            </div>
            <div className='w-full bg-neutral-200 rounded-full h-2 overflow-hidden'>
              <div
                className={cn(
                  'h-full rounded-full transition-all duration-1000 ease-out',
                  colorScheme.accent
                )}
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>
        )}

        {/* Trend Indicator */}
        {trend && (
          <div className='absolute top-4 right-4'>
            <div
              className={cn(
                'w-2 h-2 rounded-full',
                trend === 'up'
                  ? 'bg-green-500 animate-pulse'
                  : trend === 'down'
                    ? 'bg-red-500 animate-pulse'
                    : 'bg-neutral-400'
              )}
            />
          </div>
        )}
      </div>

      {/* Hover Effect Overlay */}
      <div className='absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out pointer-events-none' />
    </div>
  );
}

// Specialized KPI Card Variants
export function RevenueKPICard({
  value,
  change,
  target,
  ...props
}: Omit<KPICardProps, 'title' | 'format' | 'icon' | 'color'>) {
  return (
    <EnhancedKPICard
      title='Total Revenue'
      format='currency'
      icon='dollar'
      color='green'
      value={value}
      change={change}
      target={target}
      {...props}
    />
  );
}

export function UsersKPICard({
  value,
  change,
  target,
  ...props
}: Omit<KPICardProps, 'title' | 'format' | 'icon' | 'color'>) {
  return (
    <EnhancedKPICard
      title='Active Users'
      format='number'
      icon='users'
      color='blue'
      value={value}
      change={change}
      target={target}
      {...props}
    />
  );
}

export function ConversionKPICard({
  value,
  change,
  target,
  ...props
}: Omit<KPICardProps, 'title' | 'format' | 'icon' | 'color'>) {
  return (
    <EnhancedKPICard
      title='Conversion Rate'
      format='percentage'
      icon='target'
      color='purple'
      value={value}
      change={change}
      target={target}
      {...props}
    />
  );
}
