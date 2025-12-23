'use client';

import { useEffect, useState } from 'react';

interface ArcReactorProps {
  size?: 'sm' | 'md' | 'lg';
  intensity?: 'low' | 'medium' | 'high';
  trigger?: boolean;
  className?: string;
}

export default function ArcReactor({ 
  size = 'md', 
  intensity = 'medium', 
  trigger = false,
  className = '' 
}: ArcReactorProps) {
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    if (trigger) {
      setIsActive(true);
      const timer = setTimeout(() => setIsActive(false), 600);
      return () => clearTimeout(timer);
    }
  }, [trigger]);

  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  const intensityStyles = {
    low: { opacity: 0.3 },
    medium: { opacity: 0.5 },
    high: { opacity: 0.7 }
  };

  const style = intensityStyles[intensity];

  return (
    <div className={`relative ${sizeClasses[size]} ${className}`}>
      <svg
        viewBox="0 0 100 100"
        className="absolute inset-0 w-full h-full transition-opacity duration-300"
        style={{ opacity: isActive ? style.opacity * 1.4 : style.opacity }}
      >
        {/* Outer Segmented Ring */}
        <g className={`arc-outer-ring ${isActive ? 'active' : ''}`}>
          {/* Segmented outer ring - 8 segments */}
          {Array.from({ length: 8 }).map((_, i) => {
            const angle = (i * 45) - 90;
            const startAngle = angle;
            const endAngle = angle + 35; // 35° segments with 10° gaps
            const startRad = (startAngle * Math.PI) / 180;
            const endRad = (endAngle * Math.PI) / 180;
            const radius = 42;
            
            const x1 = 50 + radius * Math.cos(startRad);
            const y1 = 50 + radius * Math.sin(startRad);
            const x2 = 50 + radius * Math.cos(endRad);
            const y2 = 50 + radius * Math.sin(endRad);
            
            return (
              <path
                key={i}
                d={`M ${x1} ${y1} A ${radius} ${radius} 0 0 1 ${x2} ${y2}`}
                fill="none"
                stroke="#3FD6FF"
                strokeWidth="1.2"
                opacity="0.8"
              />
            );
          })}
        </g>
        
        {/* Inner Static Ring */}
        <circle
          cx="50"
          cy="50"
          r="28"
          fill="none"
          stroke="#1FA2C9"
          strokeWidth="1"
          opacity="0.6"
        />
        
        {/* Radial Ticks */}
        <g stroke="rgba(255, 255, 255, 0.15)" strokeWidth="0.8">
          {Array.from({ length: 12 }).map((_, i) => {
            const angle = (i * 30) - 90;
            const rad = (angle * Math.PI) / 180;
            const innerRadius = 32;
            const outerRadius = 38;
            
            const x1 = 50 + innerRadius * Math.cos(rad);
            const y1 = 50 + innerRadius * Math.sin(rad);
            const x2 = 50 + outerRadius * Math.cos(rad);
            const y2 = 50 + outerRadius * Math.sin(rad);
            
            return (
              <line
                key={i}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
              />
            );
          })}
        </g>
        
        {/* Center Hollow Ring */}
        <circle
          cx="50"
          cy="50"
          r="12"
          fill="none"
          stroke="#3FD6FF"
          strokeWidth="0.8"
          opacity="0.4"
        />
      </svg>
      

    </div>
  );
}