'use client';

import { useRef, useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import ThemeToggle from '@/components/ui/ThemeToggle';

const quickAccessItems = [
  { name: 'Dashboard', path: '/dashboard', icon: '⬢' },
  { name: 'Companion', path: '/companion', icon: '◈' },
  { name: 'Todo', path: '/todo', icon: '◎' },
  { name: 'Coding', path: '/coding', icon: '◔' },
  { name: 'Games', path: '/games', icon: '◖' },
  { name: 'Shopping', path: '/shopping', icon: '◚' },
  { name: 'Community', path: '/community', icon: '◝' },
  { name: 'Learning', path: '/learning', icon: '◓' },
  { name: 'Design', path: '/design', icon: '◕' },
  { name: 'Travel', path: '/travel', icon: '◗' },
];

export default function HorizontalNav() {
  const pathname = usePathname();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [sidebarExpanded, setSidebarExpanded] = useState(false);

  const checkScrollability = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1);
    }
  };

  useEffect(() => {
    checkScrollability();
    const handleResize = () => checkScrollability();
    window.addEventListener('resize', handleResize);
    
    const checkSidebarState = () => {
      const saved = localStorage.getItem('sidebar-expanded');
      if (saved !== null) {
        setSidebarExpanded(JSON.parse(saved));
      }
    };
    
    checkSidebarState();
    window.addEventListener('storage', checkSidebarState);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('storage', checkSidebarState);
    };
  }, []);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 200;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  if (pathname === '/login' || pathname === '/register') return null;

  return (
    <div className={`glass-panel hud-corners navbar-container ${
      sidebarExpanded ? 'navbar-expanded' : 'navbar-collapsed'
    }`}>
      <div className="relative h-full flex items-center">
        {/* System Status Indicators */}
        <div className="flex items-center space-x-4 px-6 border-r border-white/5">
          <div className="mission-indicator">
            QUICK ACCESS
          </div>
          <div className="flex items-center space-x-2">
            <span className="system-label">MODULES</span>
            <span className="system-value">{quickAccessItems.length}</span>
          </div>
        </div>

        {/* Left fade gradient */}
        {canScrollLeft && (
          <div className="absolute left-48 top-0 w-8 h-full bg-gradient-to-r from-bg-primary/80 to-transparent z-10 pointer-events-none" />
        )}

        {/* Right fade gradient */}
        {canScrollRight && (
          <div className="absolute right-0 top-0 w-8 h-full bg-gradient-to-l from-bg-primary/80 to-transparent z-10 pointer-events-none" />
        )}

        {/* Scrollable Navigation */}
        <div
          ref={scrollRef}
          className="flex-1 flex items-center h-full px-4 overflow-x-auto scrollbar-none"
          onScroll={checkScrollability}
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          <div className="flex items-center space-x-2 min-w-max">
            {quickAccessItems.map((item) => {
              const isActive = pathname === item.path;
              
              return (
                <Link
                  key={item.path}
                  href={item.path}
                  className={`
                    group flex items-center px-4 py-2 rounded-md transition-all duration-150 whitespace-nowrap relative
                    ${isActive 
                      ? 'bg-accent/20 text-accent navbar-item-active' 
                      : 'text-secondary hover:text-primary hover:bg-white/5'
                    }
                  `}
                >
                  <span className="text-sm mr-2 opacity-80">{item.icon}</span>
                  <span className="text-sm font-medium tracking-wide">{item.name}</span>
                  
                  {/* Active indicator */}
                  {isActive && (
                    <div className="absolute -top-px left-1/2 -translate-x-1/2 w-8 h-0.5 bg-gradient-to-r from-transparent via-accent to-transparent" />
                  )}
                </Link>
              );
            })}
          </div>
        </div>

        {/* Navigation Controls */}
        <div className="flex items-center space-x-4 px-4 border-l border-white/5">
          {canScrollLeft && (
            <button
              onClick={() => scroll('left')}
              className="w-8 h-8 tech-button tech-hover flex items-center justify-center group"
            >
              <span className="text-accent group-hover:opacity-80 text-sm font-bold">‹</span>
            </button>
          )}

          {canScrollRight && (
            <button
              onClick={() => scroll('right')}
              className="w-8 h-8 tech-button tech-hover flex items-center justify-center group"
            >
              <span className="text-accent group-hover:opacity-80 text-sm font-bold">›</span>
            </button>
          )}
          
          {/* Theme Toggle */}
          <div className="flex flex-col items-center space-y-1">
            <span className="system-label text-xs">THEME</span>
            <ThemeToggle />
          </div>
          
          {/* System Time */}
          <div className="flex flex-col items-end">
            <span className="system-label text-xs">SYSTEM TIME</span>
            <span className="system-value text-xs">
              {new Date().toLocaleTimeString('en-US', { 
                hour12: false,
                hour: '2-digit',
                minute: '2-digit'
              })}
            </span>
          </div>
        </div>
        

      </div>
    </div>
  );
}