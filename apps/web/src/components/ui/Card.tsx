import { clsx } from 'clsx';
import React from 'react';
import { twMerge } from 'tailwind-merge';

// Local utility function
function cn(...inputs: (string | undefined | null | boolean)[]) {
  return twMerge(clsx(inputs));
}

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'glass' | 'elevated' | 'outlined' | 'gradient';
  size?: 'sm' | 'md' | 'lg';
  hover?: boolean;
  animated?: boolean;
  children: React.ReactNode;
}

const cardVariants = {
  default: 'bg-white border border-neutral-200 shadow-sm',
  glass: 'glass border-white/20 shadow-lg',
  elevated: 'bg-white border-0 shadow-xl',
  outlined: 'bg-transparent border-2 border-neutral-300',
  gradient: 'bg-gradient-to-br from-primary-50 to-primary-100 border border-primary-200',
};

const cardSizes = {
  sm: 'p-4 rounded-lg',
  md: 'p-6 rounded-xl',
  lg: 'p-8 rounded-2xl',
};

export function Card({
  variant = 'default',
  size = 'md',
  hover = true,
  animated = true,
  className,
  children,
  ...props
}: CardProps) {
  return (
    <div
      className={cn(
        'transition-all duration-300',
        cardVariants[variant],
        cardSizes[size],
        hover && 'hover:shadow-lg hover:-translate-y-1',
        animated && 'animate-fade-in',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function CardHeader({ className, children, ...props }: CardHeaderProps) {
  return (
    <div className={cn('flex flex-col space-y-1.5 pb-4', className)} {...props}>
      {children}
    </div>
  );
}

interface CardTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  children: React.ReactNode;
  gradient?: boolean;
}

export function CardTitle({ className, children, gradient, ...props }: CardTitleProps) {
  return (
    <h3
      className={cn(
        'text-lg font-semibold leading-none tracking-tight',
        gradient && 'text-gradient',
        className
      )}
      {...props}
    >
      {children}
    </h3>
  );
}

interface CardDescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> {
  children: React.ReactNode;
}

export function CardDescription({ className, children, ...props }: CardDescriptionProps) {
  return (
    <p className={cn('text-sm text-neutral-600', className)} {...props}>
      {children}
    </p>
  );
}

interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function CardContent({ className, children, ...props }: CardContentProps) {
  return (
    <div className={cn('pt-0', className)} {...props}>
      {children}
    </div>
  );
}

interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function CardFooter({ className, children, ...props }: CardFooterProps) {
  return (
    <div className={cn('flex items-center pt-4', className)} {...props}>
      {children}
    </div>
  );
}

// Specialized Card Components
interface MetricCardProps {
  title: string;
  value: string | number;
  change?: number;
  trend?: 'up' | 'down' | 'neutral';
  icon?: React.ReactNode;
  color?: 'blue' | 'green' | 'red' | 'yellow' | 'purple';
  animated?: boolean;
}

export function MetricCard({
  title,
  value,
  change,
  trend,
  icon,
  color = 'blue',
  animated = true,
}: MetricCardProps) {
  const colorClasses = {
    blue: 'from-blue-50 to-blue-100 border-blue-200',
    green: 'from-green-50 to-green-100 border-green-200',
    red: 'from-red-50 to-red-100 border-red-200',
    yellow: 'from-yellow-50 to-yellow-100 border-yellow-200',
    purple: 'from-purple-50 to-purple-100 border-purple-200',
  };

  const trendColors = {
    up: 'text-green-600',
    down: 'text-red-600',
    neutral: 'text-neutral-600',
  };

  return (
    <Card
      variant='gradient'
      className={cn(
        'bg-gradient-to-br border',
        colorClasses[color],
        animated && 'animate-slide-up'
      )}
      hover
    >
      <CardContent className='p-6'>
        <div className='flex items-center justify-between'>
          <div className='flex-1'>
            <p className='text-sm font-medium text-neutral-600 mb-1'>{title}</p>
            <p className='text-2xl font-bold text-neutral-900'>{value}</p>
            {change !== undefined && (
              <div
                className={cn('flex items-center mt-2 text-sm', trendColors[trend || 'neutral'])}
              >
                <span>
                  {change > 0 ? '+' : ''}
                  {change}%
                </span>
                {trend === 'up' && <span className='ml-1'>↗</span>}
                {trend === 'down' && <span className='ml-1'>↘</span>}
                {trend === 'neutral' && <span className='ml-1'>→</span>}
              </div>
            )}
          </div>
          {icon && <div className='flex-shrink-0 ml-4 text-2xl opacity-80'>{icon}</div>}
        </div>
      </CardContent>
    </Card>
  );
}

interface StatsCardProps {
  title: string;
  stats: Array<{
    label: string;
    value: string | number;
    change?: number;
  }>;
  icon?: React.ReactNode;
}

export function StatsCard({ title, stats, icon }: StatsCardProps) {
  return (
    <Card variant='glass' className='animate-scale-in'>
      <CardHeader>
        <div className='flex items-center justify-between'>
          <CardTitle>{title}</CardTitle>
          {icon && <div className='text-xl opacity-70'>{icon}</div>}
        </div>
      </CardHeader>
      <CardContent>
        <div className='space-y-4'>
          {stats.map((stat, index) => (
            <div key={index} className='flex items-center justify-between'>
              <span className='text-sm text-neutral-600'>{stat.label}</span>
              <div className='flex items-center space-x-2'>
                <span className='font-semibold'>{stat.value}</span>
                {stat.change !== undefined && (
                  <span
                    className={cn(
                      'text-xs px-2 py-1 rounded-full',
                      stat.change > 0
                        ? 'bg-green-100 text-green-700'
                        : stat.change < 0
                          ? 'bg-red-100 text-red-700'
                          : 'bg-neutral-100 text-neutral-700'
                    )}
                  >
                    {stat.change > 0 ? '+' : ''}
                    {stat.change}%
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
