import React, { useState } from 'react';

const navigationItems = [
  { name: 'Dashboard', href: '/', icon: '📊' },
  { name: 'Projects', href: '/projects', icon: '📁' },
  { name: 'Tasks', href: '/tasks', icon: '✅' },
  { name: 'Team', href: '/team', icon: '👥' },
  { name: 'Analytics', href: '/analytics', icon: '📈' },
  { name: 'Settings', href: '/settings', icon: '⚙️' },
];

export default function Navigation() {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <nav className={`bg-card border-r transition-all duration-300 ${isCollapsed ? 'w-16' : 'w-64'}`}>
      <div className="p-4">
        <div className="flex items-center justify-between mb-8">
          <h1 className={`font-bold text-xl ${isCollapsed ? 'hidden' : 'block'}`}>
            Atlas ERP v2
          </h1>
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-2 rounded-md hover:bg-accent"
          >
            {isCollapsed ? '→' : '←'}
          </button>
        </div>
        
        <ul className="space-y-2">
          {navigationItems.map((item) => (
            <li key={item.name}>
              <a
                href={item.href}
                className="flex items-center p-3 rounded-md hover:bg-accent transition-colors"
              >
                <span className="text-lg mr-3">{item.icon}</span>
                <span className={`${isCollapsed ? 'hidden' : 'block'}`}>
                  {item.name}
                </span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
