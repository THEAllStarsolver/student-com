'use client';

import { motion } from 'framer-motion';

interface IronManHelmetProps {
  size?: number;
  className?: string;
}

export default function IronManHelmet({ 
  size = 120, 
  className = '' 
}: IronManHelmetProps) {
  return (
    <motion.div
      className={`relative ${className}`}
      style={{ width: size, height: size }}
      animate={{
        opacity: [0.6, 1, 0.6],
        scale: [1, 1.05, 1]
      }}
      transition={{
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut"
      }}
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 200 200"
        className="drop-shadow-2xl"
      >
        <defs>
          <linearGradient id="helmetGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.8" />
            <stop offset="50%" stopColor="#0891b2" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#164e63" stopOpacity="0.7" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
            <feMerge> 
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        
        {/* Helmet Outline */}
        <path
          d="M100 20 
             C140 20, 170 50, 170 90
             L170 130
             C170 150, 160 165, 145 170
             L140 175
             C135 180, 125 180, 120 175
             L115 170
             L85 170
             L80 175
             C75 180, 65 180, 60 175
             L55 170
             C40 165, 30 150, 30 130
             L30 90
             C30 50, 60 20, 100 20 Z"
          fill="none"
          stroke="url(#helmetGradient)"
          strokeWidth="2"
          filter="url(#glow)"
        />
        
        {/* Face Plate */}
        <path
          d="M70 80
             C70 70, 80 60, 100 60
             C120 60, 130 70, 130 80
             L130 120
             C130 140, 120 150, 100 150
             C80 150, 70 140, 70 120
             Z"
          fill="none"
          stroke="url(#helmetGradient)"
          strokeWidth="1.5"
          strokeOpacity="0.6"
        />
        
        {/* Eye Slits */}
        <motion.ellipse
          cx="85"
          cy="95"
          rx="8"
          ry="4"
          fill="#22d3ee"
          className="arc-glow"
          animate={{
            opacity: [0.7, 1, 0.7]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.ellipse
          cx="115"
          cy="95"
          rx="8"
          ry="4"
          fill="#22d3ee"
          className="arc-glow"
          animate={{
            opacity: [0.7, 1, 0.7]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.1
          }}
        />
        
        {/* Mouth Vent */}
        <path
          d="M90 115 L110 115 M90 120 L110 120 M90 125 L110 125"
          stroke="url(#helmetGradient)"
          strokeWidth="1"
          strokeOpacity="0.5"
        />
        
        {/* Arc Reactor Position (Chest) */}
        <motion.circle
          cx="100"
          cy="160"
          r="6"
          fill="none"
          stroke="#22d3ee"
          strokeWidth="1"
          className="arc-glow"
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.6, 1, 0.6]
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        
        {/* Side Vents */}
        <path
          d="M45 100 L55 95 M45 105 L55 100 M45 110 L55 105"
          stroke="url(#helmetGradient)"
          strokeWidth="1"
          strokeOpacity="0.4"
        />
        <path
          d="M155 100 L145 95 M155 105 L145 100 M155 110 L145 105"
          stroke="url(#helmetGradient)"
          strokeWidth="1"
          strokeOpacity="0.4"
        />
      </svg>
    </motion.div>
  );
}