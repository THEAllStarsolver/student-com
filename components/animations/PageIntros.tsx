'use client';

import { useEffect, useState } from 'react';

interface PageIntroProps {
  type: 'companion' | 'todo' | 'coding' | 'games' | 'travel' | 'community';
  onComplete?: () => void;
}

export function PageIntro({ type, onComplete }: PageIntroProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const duration = getDuration(type);
    const timer = setTimeout(() => {
      setIsVisible(false);
      onComplete?.();
    }, duration);

    return () => clearTimeout(timer);
  }, [type, onComplete]);

  if (!isVisible) return null;

  return (
    <div className="page-intro">
      {renderIntro(type)}
    </div>
  );
}

function getDuration(type: string): number {
  switch (type) {
    case 'companion': return 1000;
    case 'todo': return 900;
    case 'coding': return 800;
    case 'games': return 800;
    case 'travel': return 1200;
    case 'community': return 1000;
    default: return 800;
  }
}

function renderIntro(type: string) {
  switch (type) {
    case 'companion':
      return (
        <div className="companion-intro flex items-center justify-center h-full">
          <div className="flex flex-col items-center space-y-4">
            <svg width="120" height="80" viewBox="0 0 120 80" className="companion-arm">
              <g stroke="var(--arc-primary)" strokeWidth="1.5" fill="none" opacity="0.7">
                <line x1="20" y1="40" x2="50" y2="30" />
                <line x1="50" y1="30" x2="80" y2="35" />
                <line x1="80" y1="35" x2="100" y2="45" />
                <circle cx="20" cy="40" r="3" />
                <circle cx="50" cy="30" r="3" />
                <circle cx="80" cy="35" r="3" />
                <circle cx="100" cy="45" r="8" />
                <circle cx="100" cy="45" r="4" className="arc-reactor-pulse" />
              </g>
            </svg>
            <div className="system-label">COMPANION MODULE INITIALIZED</div>
          </div>
        </div>
      );

    case 'todo':
      return (
        <div className="todo-intro flex items-center justify-center h-full">
          <div className="flex flex-col items-center space-y-4">
            <svg width="100" height="80" viewBox="0 0 100 80">
              {Array.from({ length: 5 }).map((_, i) => (
                <g key={i}>
                  <line 
                    x1="20" 
                    y1={15 + i * 12} 
                    x2="80" 
                    y2={15 + i * 12}
                    stroke="var(--arc-primary)"
                    strokeWidth="1"
                    className="checklist-line"
                    style={{ animationDelay: `${i * 100}ms` }}
                  />
                  <circle 
                    cx="15" 
                    cy={15 + i * 12} 
                    r="2" 
                    stroke="var(--arc-primary)"
                    strokeWidth="1"
                    fill="none"
                    style={{ animationDelay: `${i * 100 + 50}ms` }}
                  />
                </g>
              ))}
            </svg>
            <div className="system-label">TASK TRACKING ONLINE</div>
          </div>
        </div>
      );

    case 'coding':
      return (
        <div className="coding-intro flex items-center justify-center h-full">
          <div className="flex flex-col items-center space-y-4">
            <div className="space-y-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <div 
                  key={i}
                  className="code-block flex space-x-1"
                  style={{ animationDelay: `${i * 100}ms` }}
                >
                  {Array.from({ length: 8 }).map((_, j) => (
                    <div 
                      key={j}
                      className="w-2 h-3 bg-accent/40 rounded-sm"
                      style={{ animationDelay: `${i * 100 + j * 20}ms` }}
                    />
                  ))}
                </div>
              ))}
            </div>
            <div className="system-label">CODE ANALYSIS READY</div>
          </div>
        </div>
      );

    case 'games':
      return (
        <div className="games-intro flex items-center justify-center h-full">
          <div className="flex flex-col items-center space-y-4">
            <svg width="80" height="80" viewBox="0 0 80 80" className="opacity-30">
              <path 
                d="M40 10 C50 10, 60 20, 60 35 L60 50 C60 65, 50 70, 40 70 C30 70, 20 65, 20 50 L20 35 C20 20, 30 10, 40 10 Z"
                stroke="var(--arc-primary)"
                strokeWidth="1.5"
                fill="none"
              />
              <ellipse cx="32" cy="35" rx="4" ry="6" fill="var(--arc-primary)" className="helmet-eye" />
              <ellipse cx="48" cy="35" rx="4" ry="6" fill="var(--arc-primary)" className="helmet-eye" />
            </svg>
            <div className="system-label">ENTERTAINMENT SYSTEMS ACTIVE</div>
          </div>
        </div>
      );

    case 'travel':
      return (
        <div className="travel-intro flex items-center justify-center h-full">
          <div className="flex flex-col items-center space-y-4">
            <svg width="120" height="60" viewBox="0 0 120 60">
              <path 
                d="M10 30 L30 25 L50 30 L70 25 L90 30 L110 25"
                stroke="var(--arc-primary)"
                strokeWidth="1.5"
                fill="none"
                className="plane-path"
              />
              <g className="plane-path">
                <path d="M45 28 L55 28 L52 25 L48 25 Z" fill="var(--arc-primary)" opacity="0.8" />
                <line x1="50" y1="28" x2="50" y2="32" stroke="var(--arc-primary)" strokeWidth="1" />
              </g>
            </svg>
            <div className="system-label">ROUTE CALCULATED</div>
          </div>
        </div>
      );

    case 'community':
      return (
        <div className="community-intro flex items-center justify-center h-full">
          <div className="flex flex-col items-center space-y-4">
            <svg width="100" height="80" viewBox="0 0 100 80">
              <circle cx="20" cy="20" r="3" fill="var(--arc-primary)" opacity="0.8" />
              <circle cx="50" cy="15" r="3" fill="var(--arc-primary)" opacity="0.8" />
              <circle cx="80" cy="25" r="3" fill="var(--arc-primary)" opacity="0.8" />
              <circle cx="30" cy="50" r="3" fill="var(--arc-primary)" opacity="0.8" />
              <circle cx="70" cy="55" r="3" fill="var(--arc-primary)" opacity="0.8" />
              
              <line x1="20" y1="20" x2="50" y2="15" stroke="var(--arc-primary)" strokeWidth="1" className="network-line" />
              <line x1="50" y1="15" x2="80" y2="25" stroke="var(--arc-primary)" strokeWidth="1" className="network-line" style={{ animationDelay: '100ms' }} />
              <line x1="20" y1="20" x2="30" y2="50" stroke="var(--arc-primary)" strokeWidth="1" className="network-line" style={{ animationDelay: '200ms' }} />
              <line x1="80" y1="25" x2="70" y2="55" stroke="var(--arc-primary)" strokeWidth="1" className="network-line" style={{ animationDelay: '300ms' }} />
              <line x1="30" y1="50" x2="70" y2="55" stroke="var(--arc-primary)" strokeWidth="1" className="network-line" style={{ animationDelay: '400ms' }} />
            </svg>
            <div className="system-label">COMMUNICATION CHANNELS ONLINE</div>
          </div>
        </div>
      );

    default:
      return null;
  }
}