'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import NavGroup from './NavGroup';
import ArcReactor from '@/components/ui/ArcReactor';

const navigationGroups = [
  {
    id: 'core',
    label: 'CORE',
    items: [
      { name: 'Dashboard', path: '/dashboard', icon: '⬢' },
      { name: 'Companion', path: '/companion', icon: '◈' },
      { name: 'Video Call', path: '/videocall', icon: '◉' },
    ]
  },
  {
    id: 'productivity',
    label: 'PRODUCTIVITY',
    items: [
      { name: 'Todo', path: '/todo', icon: '◎' },
      { name: 'Attendance', path: '/attendance', icon: '◐' },
      { name: 'Tracker', path: '/tracker', icon: '◑' },
      { name: 'Academics', path: '/academics', icon: '◒' },
    ]
  },
  {
    id: 'learning',
    label: 'LEARNING',
    items: [
      { name: 'Learning Hub', path: '/learning', icon: '◓' },
      { name: 'Coding', path: '/coding', icon: '◔' },
      { name: 'Design', path: '/design', icon: '◕' },
    ]
  },
  {
    id: 'tools',
    label: 'TOOLS',
    items: [
      { name: 'Games', path: '/games', icon: '◖' },
      { name: 'Travel', path: '/travel', icon: '◗' },
      { name: 'Events', path: '/events', icon: '◘' },
      { name: 'Internships', path: '/internships', icon: '◙' },
    ]
  },
  {
    id: 'commerce',
    label: 'COMMERCE',
    items: [
      { name: 'Shopping', path: '/shopping', icon: '◚' },
      { name: 'Snacks', path: '/snacks', icon: '◛' },
      { name: 'Core Shop', path: '/coreshop', icon: '◜' },
    ]
  },
  {
    id: 'social',
    label: 'SOCIAL',
    items: [
      { name: 'Community', path: '/community', icon: '◝' },
      { name: 'Movies', path: '/movies', icon: '◞' },
    ]
  }
];

export default function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [isExpanded, setIsExpanded] = useState(false);
  const [focusModeActive, setFocusModeActive] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('sidebar-expanded');
    if (saved !== null) {
      const expanded = JSON.parse(saved);
      setIsExpanded(expanded);
      document.documentElement.style.setProperty(
        '--sidebar-width', 
        expanded ? 'var(--sidebar-width-expanded)' : '4rem'
      );
    } else {
      document.documentElement.style.setProperty('--sidebar-width', '4rem');
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('sidebar-expanded', JSON.stringify(isExpanded));
    document.documentElement.style.setProperty(
      '--sidebar-width', 
      isExpanded ? 'var(--sidebar-width-expanded)' : '4rem'
    );
    
    const layout = document.querySelector('.mission-control-layout');
    if (layout) {
      (layout as HTMLElement).style.gridTemplateColumns = 
        `${isExpanded ? 'var(--sidebar-width-expanded)' : '4rem'} 1fr`;
    }
  }, [isExpanded]);

  useEffect(() => {
    if (user) {
      const unsubscribe = onSnapshot(doc(db, 'focusMode', user.uid), (doc) => {
        if (doc.exists()) {
          const data = doc.data();
          setFocusModeActive(data.isActive || false);
        }
      });
      return () => unsubscribe();
    }
  }, [user]);

  if (!user || pathname === '/login' || pathname === '/register') return null;

  const allowedInFocus = ['/dashboard', '/companion', '/coding'];

  return (
    <>
      {isExpanded && (
        <div 
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsExpanded(false)}
        />
      )}
      
      <div className={`
        glass-panel hud-corners sidebar-container
        transition-all duration-300 ease-out
        ${isExpanded ? 'w-72' : 'w-16'}
      `}>
        <div className="h-16 flex items-center justify-center px-4 border-b border-white/5 relative">
          {isExpanded ? (
            <div className="flex items-center justify-between w-full">
              <div className="flex flex-col space-y-1">
                <div className="mission-indicator">
                  MISSION CONTROL
                </div>
                <div className="flex items-center space-x-2">
                  <span className="system-label">STATUS</span>
                  <span className="system-value">OPERATIONAL</span>
                </div>
              </div>
              <button
                onClick={() => setIsExpanded(false)}
                className="tech-button tech-hover p-2 group relative"
              >
                <span className="block w-4 h-4 text-accent group-hover:opacity-80 transition-opacity text-sm font-bold">
                  ‹
                </span>
              </button>
            </div>
          ) : (
            <button
              onClick={() => setIsExpanded(true)}
              className="tech-button tech-hover p-3 group relative"
            >
              <span className="block w-5 h-5 text-accent group-hover:opacity-80 transition-opacity text-lg font-bold">
                ›
              </span>
            </button>
          )}
        </div>

        <div className="flex-1 overflow-y-auto py-4">
          {isExpanded && (
            <div className="px-4 mb-4">
              <div className="system-label mb-2">SYSTEM MODULES</div>
              <div className="h-px bg-gradient-to-r from-transparent via-text-accent/40 to-transparent" />
            </div>
          )}
          
          <nav className="space-y-2">
            {navigationGroups.map((group) => (
              <NavGroup
                key={group.id}
                group={group}
                isExpanded={isExpanded}
                currentPath={pathname}
                focusModeActive={focusModeActive}
                allowedInFocus={allowedInFocus}
              />
            ))}
          </nav>
        </div>

        <div className="h-16 border-t border-white/5 flex items-center justify-center px-4 relative">
          <div className="relative">
            <ArcReactor 
              size="sm" 
              intensity="low" 
              trigger={isExpanded} 
              className="opacity-60 hover:opacity-100 transition-opacity duration-300" 
            />
            
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-2 h-2 rounded-full bg-accent animate-pulse shadow-lg" style={{
                boxShadow: '0 0 4px var(--text-accent)'
              }} />
            </div>
          </div>
          
          <button
            onClick={logout}
            className="absolute inset-0 w-full h-full opacity-0 cursor-default"
            onContextMenu={(e) => {
              e.preventDefault();
              if (confirm('Disconnect from system?')) logout();
            }}
            title="Right-click to disconnect"
          />
        </div>

      </div>
    </>
  );
}