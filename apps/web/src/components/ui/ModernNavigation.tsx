import { clsx } from 'clsx';
import {
  BarChart3,
  Bell,
  CheckSquare,
  ChevronLeft,
  ChevronRight,
  FolderOpen,
  LayoutDashboard,
  Menu,
  Search,
  Settings,
  User,
  Users,
  X,
} from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { twMerge } from 'tailwind-merge';

// Local utility function
function cn(...inputs: (string | undefined | null | boolean)[]) {
  return twMerge(clsx(inputs));
}

interface NavigationItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: number;
  active?: boolean;
}

const navigationItems: NavigationItem[] = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Projects', href: '/projects', icon: FolderOpen, badge: 3 },
  { name: 'Tasks', href: '/tasks', icon: CheckSquare, badge: 12 },
  { name: 'Team', href: '/team', icon: Users },
  { name: 'Analytics', href: '/analytics', icon: BarChart3 },
  { name: 'Settings', href: '/settings', icon: Settings },
];

interface ModernNavigationProps {
  className?: string;
}

export default function ModernNavigation({ className }: ModernNavigationProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [activeItem, setActiveItem] = useState('/');

  // Get current path for active state
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setActiveItem(window.location.pathname);
    }
  }, []);

  const toggleCollapse = () => setIsCollapsed(!isCollapsed);
  const toggleMobile = () => setIsMobileOpen(!isMobileOpen);

  return (
    <>
      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div
          className='fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden'
          onClick={toggleMobile}
        />
      )}

      {/* Mobile Menu Button */}
      <button
        onClick={toggleMobile}
        className='fixed top-4 left-4 z-50 lg:hidden p-2 rounded-lg bg-white shadow-lg border border-neutral-200'
      >
        {isMobileOpen ? <X className='w-5 h-5' /> : <Menu className='w-5 h-5' />}
      </button>

      {/* Navigation Sidebar */}
      <nav
        className={cn(
          'fixed left-0 top-0 h-full bg-white border-r border-neutral-200 shadow-xl z-50 transition-all duration-300',
          'lg:relative lg:translate-x-0',
          isCollapsed ? 'w-16' : 'w-64',
          isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
          className
        )}
      >
        {/* Header */}
        <div className='flex items-center justify-between p-4 border-b border-neutral-200'>
          <div className={cn('flex items-center space-x-3', isCollapsed && 'justify-center')}>
            <div className='w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center'>
              <span className='text-white font-bold text-sm'>A</span>
            </div>
            {!isCollapsed && (
              <div className='animate-fade-in'>
                <h1 className='font-bold text-lg text-gradient'>Atlas ERP</h1>
                <p className='text-xs text-neutral-500'>v2.0</p>
              </div>
            )}
          </div>

          {/* Collapse Button - Desktop Only */}
          <button
            onClick={toggleCollapse}
            className='hidden lg:flex p-1.5 rounded-md hover:bg-neutral-100 transition-colors'
          >
            {isCollapsed ? (
              <ChevronRight className='w-4 h-4 text-neutral-600' />
            ) : (
              <ChevronLeft className='w-4 h-4 text-neutral-600' />
            )}
          </button>
        </div>

        {/* Search Bar */}
        {!isCollapsed && (
          <div className='p-4 animate-fade-in'>
            <div className='relative'>
              <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-neutral-400' />
              <input
                type='text'
                placeholder='Search...'
                className='w-full pl-10 pr-4 py-2 bg-neutral-50 border border-neutral-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all'
              />
            </div>
          </div>
        )}

        {/* Navigation Items */}
        <div className='flex-1 px-3 py-4 space-y-1'>
          {navigationItems.map((item, index) => {
            const Icon = item.icon;
            const isActive = activeItem === item.href;

            return (
              <a
                key={item.name}
                href={item.href}
                onClick={() => setActiveItem(item.href)}
                className={cn(
                  'group flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200',
                  'hover:bg-neutral-100 hover:scale-105',
                  isActive
                    ? 'bg-gradient-to-r from-blue-50 to-purple-50 text-blue-700 border border-blue-200 shadow-sm'
                    : 'text-neutral-700 hover:text-neutral-900',
                  isCollapsed && 'justify-center'
                )}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <Icon
                  className={cn(
                    'w-5 h-5 transition-colors',
                    isActive ? 'text-blue-600' : 'text-neutral-500 group-hover:text-neutral-700'
                  )}
                />

                {!isCollapsed && <span className='ml-3 animate-fade-in'>{item.name}</span>}

                {!isCollapsed && item.badge && (
                  <span className='ml-auto bg-red-500 text-white text-xs rounded-full px-2 py-0.5 animate-pulse'>
                    {item.badge}
                  </span>
                )}

                {isCollapsed && item.badge && (
                  <span className='absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center animate-pulse'>
                    {item.badge}
                  </span>
                )}
              </a>
            );
          })}
        </div>

        {/* User Profile Section */}
        <div className='border-t border-neutral-200 p-4'>
          <div className={cn('flex items-center space-x-3', isCollapsed && 'justify-center')}>
            <div className='relative'>
              <div className='w-8 h-8 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center'>
                <User className='w-4 h-4 text-white' />
              </div>
              <div className='absolute -top-1 -right-1 w-3 h-3 bg-green-500 border-2 border-white rounded-full'></div>
            </div>

            {!isCollapsed && (
              <div className='flex-1 animate-fade-in'>
                <p className='text-sm font-medium text-neutral-900'>John Doe</p>
                <p className='text-xs text-neutral-500'>Administrator</p>
              </div>
            )}

            {!isCollapsed && (
              <button className='p-1.5 rounded-md hover:bg-neutral-100 transition-colors'>
                <Bell className='w-4 h-4 text-neutral-600' />
              </button>
            )}
          </div>
        </div>

        {/* Collapse Indicator */}
        {isCollapsed && (
          <div className='absolute bottom-4 left-1/2 transform -translate-x-1/2'>
            <div className='w-1 h-8 bg-gradient-to-b from-blue-500 to-purple-600 rounded-full opacity-30'></div>
          </div>
        )}
      </nav>
    </>
  );
}
