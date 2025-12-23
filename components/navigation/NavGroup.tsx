'use client';

import { useState } from 'react';
import NavItem from './NavItem';

interface NavGroupProps {
  group: {
    id: string;
    label: string;
    items: Array<{
      name: string;
      path: string;
      icon: string;
    }>;
  };
  isExpanded: boolean;
  currentPath: string;
  focusModeActive: boolean;
  allowedInFocus: string[];
}

export default function NavGroup({ 
  group, 
  isExpanded, 
  currentPath, 
  focusModeActive, 
  allowedInFocus 
}: NavGroupProps) {
  const [isGroupExpanded, setIsGroupExpanded] = useState(false);

  const hasActiveItem = group.items.some(item => currentPath === item.path);
  const isGroupRestricted = focusModeActive && !group.items.some(item => allowedInFocus.includes(item.path));

  return (
    <div className="relative nav-group">
      {/* Group Header - Text Only */}
      <div className="px-4">
        {isExpanded ? (
          <button
            onClick={() => setIsGroupExpanded(!isGroupExpanded)}
            className={`
              section-header w-full text-left py-2 transition-all duration-150
              ${hasActiveItem ? 'text-accent' : 'text-tertiary hover:text-secondary'}
              ${isGroupRestricted ? 'opacity-40' : ''}
            `}
          >
            {group.label}
          </button>
        ) : (
          <div className={`
            section-header py-2 text-center transition-all duration-150 nav-group-letter
            ${hasActiveItem ? 'text-accent' : 'text-tertiary'}
            ${isGroupRestricted ? 'opacity-40' : ''}
          `}>
            <span className="nav-letter">{group.label.charAt(0)}</span>
            <span className="nav-full-label opacity-0">{group.label}</span>
          </div>
        )}
      </div>

      {/* Group Items - Dropdown */}
      <div className={`
        nav-group-items transition-all duration-200 ease-out overflow-hidden
        ${isExpanded && isGroupExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}
      `}>
        <div className="space-y-1 pb-2">
          {group.items.map((item) => (
            <NavItem
              key={item.path}
              item={item}
              isExpanded={isExpanded}
              isActive={currentPath === item.path}
              isRestricted={focusModeActive && !allowedInFocus.includes(item.path)}
            />
          ))}
        </div>
      </div>

      {/* Subtle Separator */}
      <div className="mx-4 mb-2">
        <div className="h-px bg-gradient-to-r from-transparent via-text-tertiary/20 to-transparent" />
      </div>
    </div>
  );
}