'use client';

import { useEffect, useState } from 'react';
import ArcReactor from './ArcReactor';

interface SystemInitializerProps {
  isVisible: boolean;
  operation?: string;
  onComplete?: () => void;
}

export default function SystemInitializer({ 
  isVisible, 
  operation = "OPERATION", 
  onComplete 
}: SystemInitializerProps) {
  const [phase, setPhase] = useState<'split' | 'rotate' | 'complete'>('split');

  useEffect(() => {
    if (!isVisible) return;

    const timer1 = setTimeout(() => setPhase('rotate'), 200);
    const timer2 = setTimeout(() => setPhase('complete'), 500);
    const timer3 = setTimeout(() => {
      onComplete?.();
    }, 800);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, [isVisible, onComplete]);

  if (!isVisible) return null;

  return (
    <div className="system-initializer-overlay">
      <div className="system-initializer-content">
        {/* Arc Reactor */}
        <div className={`arc-reactor-container ${phase}`}>
          <ArcReactor 
            size="lg" 
            intensity="high" 
            trigger={phase === 'rotate'} 
          />
          
          {/* Segmented Ring Overlay */}
          <svg 
            viewBox="0 0 100 100" 
            className={`arc-segments ${phase === 'split' ? 'splitting' : ''}`}
          >
            {/* Outer segments that split */}
            {Array.from({ length: 8 }).map((_, i) => {
              const angle = (i * 45) - 90;
              const startAngle = angle;
              const endAngle = angle + 35;
              const startRad = (startAngle * Math.PI) / 180;
              const endRad = (endAngle * Math.PI) / 180;
              const radius = 45;
              
              const x1 = 50 + radius * Math.cos(startRad);
              const y1 = 50 + radius * Math.sin(startRad);
              const x2 = 50 + radius * Math.cos(endRad);
              const y2 = 50 + radius * Math.sin(endRad);
              
              return (
                <path
                  key={i}
                  d={`M ${x1} ${y1} A ${radius} ${radius} 0 0 1 ${x2} ${y2}`}
                  fill="none"
                  stroke="var(--arc-primary)"
                  strokeWidth="1.5"
                  opacity="0.9"
                  style={{
                    transformOrigin: '50px 50px',
                    animationDelay: `${i * 25}ms`
                  }}
                />
              );
            })}
          </svg>
        </div>

        {/* System Text */}
        <div className="system-text">
          <div className="system-operation">
            INITIALIZING {operation}...
          </div>
          <div className="system-status">
            SYSTEM STATUS: SYNCHRONIZING
          </div>
        </div>
      </div>
    </div>
  );
}