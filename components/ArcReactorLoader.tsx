'use client';

import { motion } from 'framer-motion';

interface ArcReactorLoaderProps {
  loading: boolean;
  size?: number;
  className?: string;
}

export default function ArcReactorLoader({ 
  loading, 
  size = 80, 
  className = '' 
}: ArcReactorLoaderProps) {
  if (!loading) return null;

  return (
    <motion.div
      className={`relative flex items-center justify-center ${className}`}
      style={{ width: size, height: size }}
      exit={{ 
        scale: 4, 
        filter: 'blur(40px)', 
        opacity: 0 
      }}
      transition={{ 
        duration: 0.8, 
        ease: "circIn" 
      }}
    >
      {/* Outer Ring - Anticlockwise */}
      <motion.div
        className="absolute inset-0"
        animate={{ rotate: -360 }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "linear"
        }}
      >
        <svg
          width={size}
          height={size}
          viewBox="0 0 100 100"
          className="drop-shadow-lg"
        >
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="url(#outerGradient)"
            strokeWidth="2"
            strokeDasharray="20 10"
            className="opacity-80"
          />
          <defs>
            <linearGradient id="outerGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.8" />
              <stop offset="50%" stopColor="#34d399" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#22d3ee" stopOpacity="0.4" />
            </linearGradient>
          </defs>
        </svg>
      </motion.div>

      {/* Inner Ring - Clockwise */}
      <motion.div
        className="absolute inset-2"
        animate={{ rotate: 360 }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "linear"
        }}
      >
        <svg
          width={size - 16}
          height={size - 16}
          viewBox="0 0 100 100"
          className="drop-shadow-md"
        >
          <circle
            cx="50"
            cy="50"
            r="40"
            fill="none"
            stroke="url(#innerGradient)"
            strokeWidth="3"
            strokeDasharray="15 5"
            className="opacity-90"
          />
          <defs>
            <linearGradient id="innerGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#22d3ee" />
              <stop offset="100%" stopColor="#0891b2" />
            </linearGradient>
          </defs>
        </svg>
      </motion.div>

      {/* Core Glow - Breathing */}
      <motion.div
        className="absolute inset-6 rounded-full bg-gradient-to-br from-stark-cyan to-cyan-400 arc-glow-strong"
        animate={{ 
          scale: [1, 1.2, 1],
          opacity: [0.8, 1, 0.8]
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      {/* Center Dot */}
      <div className="absolute inset-1/2 w-2 h-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white shadow-lg" />
    </motion.div>
  );
}