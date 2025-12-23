'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

interface StarkArcReactorProps {
  loading: boolean;
  size?: number;
  onComplete?: () => void;
}

export default function StarkArcReactor({ 
  loading, 
  size = 150, 
  onComplete 
}: StarkArcReactorProps) {
  const [isExpanding, setIsExpanding] = useState(false);

  useEffect(() => {
    if (!loading) {
      setIsExpanding(true);
      const timer = setTimeout(() => {
        onComplete?.();
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [loading, onComplete]);

  return (
    <div className="relative flex items-center justify-center">
      <motion.div
        className="relative"
        animate={isExpanding ? { 
          scale: 12, 
          filter: 'blur(60px)',
          opacity: 0 
        } : { 
          scale: 1, 
          filter: 'blur(0px)',
          opacity: 1 
        }}
        transition={{ 
          duration: 1.2, 
          ease: "easeInOut" 
        }}
      >
        <svg
          width={size}
          height={size}
          viewBox="0 0 200 200"
          className="arc-reactor-pulse"
        >
          {/* Outer Ring - 10s Clockwise */}
          <motion.circle
            cx="100"
            cy="100"
            r="85"
            fill="none"
            stroke="url(#outerGradient)"
            strokeWidth="2"
            strokeDasharray="15 8"
            animate={{ rotate: 360 }}
            transition={{ 
              duration: 10, 
              repeat: Infinity, 
              ease: "linear" 
            }}
          />
          
          {/* Middle Ring - 6s Counter-clockwise */}
          <motion.circle
            cx="100"
            cy="100"
            r="60"
            fill="none"
            stroke="url(#middleGradient)"
            strokeWidth="3"
            strokeDasharray="12 6"
            animate={{ rotate: -360 }}
            transition={{ 
              duration: 6, 
              repeat: Infinity, 
              ease: "linear" 
            }}
          />
          
          {/* Inner Ring - 3s Clockwise */}
          <motion.circle
            cx="100"
            cy="100"
            r="35"
            fill="none"
            stroke="url(#innerGradient)"
            strokeWidth="4"
            strokeDasharray="8 4"
            animate={{ rotate: 360 }}
            transition={{ 
              duration: 3, 
              repeat: Infinity, 
              ease: "linear" 
            }}
          />
          
          {/* Central Core */}
          <motion.circle
            cx="100"
            cy="100"
            r="15"
            fill="url(#coreGradient)"
            animate={{ 
              scale: [1, 1.3, 1],
              opacity: [0.8, 1, 0.8]
            }}
            transition={{ 
              duration: 2, 
              repeat: Infinity, 
              ease: "easeInOut" 
            }}
          />
          
          {/* Energy Particles */}
          {[...Array(12)].map((_, i) => (
            <motion.circle
              key={i}
              cx="100"
              cy="100"
              r="2"
              fill="#818cf8"
              animate={{
                x: [0, Math.cos(i * Math.PI / 6) * 40],
                y: [0, Math.sin(i * Math.PI / 6) * 40],
                opacity: [0, 1, 0],
                scale: [0, 1.5, 0]
              }}
              transition={{
                duration: 2.5,
                repeat: Infinity,
                delay: i * 0.2,
                ease: "easeOut"
              }}
            />
          ))}
          
          {/* Gradients */}
          <defs>
            <radialGradient id="outerGradient" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#818cf8" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#a78bfa" stopOpacity="0.3" />
            </radialGradient>
            
            <radialGradient id="middleGradient" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#818cf8" stopOpacity="1" />
              <stop offset="100%" stopColor="#6366f1" stopOpacity="0.5" />
            </radialGradient>
            
            <radialGradient id="innerGradient" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.9" />
              <stop offset="50%" stopColor="#818cf8" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#4f46e5" stopOpacity="0.6" />
            </radialGradient>
            
            <radialGradient id="coreGradient" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="1" />
              <stop offset="30%" stopColor="#818cf8" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#312e81" stopOpacity="0.7" />
            </radialGradient>
          </defs>
        </svg>
      </motion.div>
      
      {/* Loading Text */}
      {loading && (
        <motion.div
          className="absolute top-full mt-8 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <div className="hud-font text-sm text-indigo-400 uppercase tracking-widest">
            Stark Industries OS
          </div>
          <motion.div
            className="hud-font text-xs text-gray-400 mt-2"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            Initializing Nightshade Protocol...
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}