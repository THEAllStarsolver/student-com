'use client';

import Link from 'next/link';
import { useState } from 'react';

interface NavItemProps {
  item: {
    name: string;
    path: string;
    icon: string;
  };
  isExpanded: boolean;
  isActive: boolean;
  isRestricted: boolean;
}

export default function NavItem({ item, isExpanded, isActive, isRestricted }: NavItemProps) {
  const [showTooltip, setShowTooltip] = useState(false);

  const handleClick = (e: React.MouseEvent) => {
    if (isRestricted) {
      e.preventDefault();
    }
  };

  return (
    <div className="relative">
      <Link
        href={isRestricted ? '#' : item.path}
        onClick={handleClick}
        className={`
          group flex items-center px-4 py-2 transition-all duration-150 relative
          ${isActive 
            ? 'text-accent bg-accent/10' 
            : isRestricted
            ? 'text-error cursor-not-allowed opacity-60'
            : 'text-secondary hover:text-primary'
          }
          ${!isExpanded ? 'justify-center' : ''}
        `}
        onMouseEnter={() => !isExpanded && setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      >
        {/* Icon */}
        <div className={`
          flex items-center justify-center transition-all duration-200
          ${isExpanded ? 'w-4 h-4 mr-3' : 'w-4 h-4'}
        `}>
          <span className="text-xs opacity-80">{item.icon}</span>
        </div>

        {/* Label */}
        {isExpanded && (
          <span className="text-sm font-medium tracking-wide">
            {item.name}
          </span>
        )}

        {/* Active Indicator */}
        {isActive && (
          <div className="absolute left-1 top-1/2 -translate-y-1/2 w-1 h-4 bg-accent rounded-r-full" />
        )}

        {/* Status Dot */}
        {isExpanded && (
          <div className="ml-auto">
            {isRestricted && (
              <div className="w-1.5 h-1.5 rounded-full bg-error animate-pulse" />
            )}
            {isActive && (
              <div className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" style={{
                boxShadow: '0 0 3px var(--text-accent)'
              }} />
            )}
          </div>
        )}
      </Link>

      {/* Tooltip for collapsed mode */}
      {!isExpanded && showTooltip && !isRestricted && (
        <div className="absolute left-full ml-3 top-1/2 -translate-y-1/2 z-50">
          <div className="glass-panel px-3 py-2 text-sm whitespace-nowrap">
            <div className="flex items-center space-x-2">
              <span className="text-accent">{item.icon}</span>
              <span className="text-primary">{item.name}</span>
            </div>
            <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 w-0 h-0 border-t-4 border-b-4 border-r-4 border-transparent" style={{
              borderRightColor: 'var(--glass-border)'
            }} />
          </div>
        </div>
      )}
    </div>
  );
}