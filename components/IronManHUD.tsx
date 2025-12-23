'use client';

import { motion } from 'framer-motion';

export default function StarkHUD() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* Main HUD Container */}
      <div className="absolute inset-0 flex items-center justify-center">
        <svg
          width="800"
          height="600"
          viewBox="0 0 800 600"
          className="opacity-30"
        >
          {/* Iron Man Helmet Silhouette */}
          <g transform="translate(400, 300)">
            {/* Helmet Outline */}
            <path
              d="M-120,-150 C-120,-180 -90,-200 0,-200 C90,-200 120,-180 120,-150 
                 L120,-50 C120,0 100,30 80,50 L80,80 C80,100 60,120 40,130 
                 L20,140 C10,145 -10,145 -20,140 L-40,130 C-60,120 -80,100 -80,80 
                 L-80,50 C-100,30 -120,0 -120,-50 Z"
              fill="none"
              stroke="url(#helmetGradient)"
              strokeWidth="2"
              className="opacity-60"
            />
            
            {/* Breathing Animation */}
            <motion.path
              d="M-120,-150 C-120,-180 -90,-200 0,-200 C90,-200 120,-180 120,-150 
                 L120,-50 C120,0 100,30 80,50 L80,80 C80,100 60,120 40,130 
                 L20,140 C10,145 -10,145 -20,140 L-40,130 C-60,120 -80,100 -80,80 
                 L-80,50 C-100,30 -120,0 -120,-50 Z"
              fill="none"
              stroke="#818cf8"
              strokeWidth="1"
              animate={{
                strokeWidth: [1, 2, 1],
                strokeOpacity: [0.2, 0.5, 0.2]
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
            
            {/* Left Eye Slot - Breathing from 0.1 to 0.6 */}
            <motion.ellipse
              cx="-40"
              cy="-80"
              rx="25"
              ry="15"
              fill="url(#eyeGradient)"
              animate={{
                opacity: [0.1, 0.6, 0.1]
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
            
            {/* Right Eye Slot - Breathing from 0.1 to 0.6 */}
            <motion.ellipse
              cx="40"
              cy="-80"
              rx="25"
              ry="15"
              fill="url(#eyeGradient)"
              animate={{
                opacity: [0.1, 0.6, 0.1]
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
            
            {/* Mouth/Vent Area */}
            <path
              d="M-30,20 Q0,40 30,20 Q20,30 10,35 L-10,35 Q-20,30 -30,20 Z"
              fill="none"
              stroke="#818cf8"
              strokeWidth="1"
              strokeOpacity="0.4"
            />
          </g>
          
          {/* Large Slow-Rotating Data Ring with stroke-dasharray */}
          <g transform="translate(400, 300)">
            <motion.circle
              cx="0"
              cy="0"
              r="280"
              fill="none"
              stroke="url(#ringGradient)"
              strokeWidth="2"
              strokeDasharray="20 15 5 15"
              animate={{ rotate: 360 }}
              transition={{
                duration: 30,
                repeat: Infinity,
                ease: "linear"
              }}
            />
            
            {/* Technical readout markers */}
            {[...Array(16)].map((_, i) => {
              const angle = (i * 22.5) * (Math.PI / 180);
              const x = Math.cos(angle) * 280;
              const y = Math.sin(angle) * 280;
              
              return (
                <g key={i}>
                  <motion.circle
                    cx={x}
                    cy={y}
                    r="2"
                    fill="#818cf8"
                    animate={{
                      opacity: [0.3, 1, 0.3],
                      scale: [0.8, 1.2, 0.8]
                    }}
                    transition={{
                      duration: 2.5,
                      repeat: Infinity,
                      delay: i * 0.15,
                      ease: "easeInOut"
                    }}
                  />
                  
                  {/* Technical readout lines */}
                  <motion.line
                    x1={x * 0.92}
                    y1={y * 0.92}
                    x2={x * 1.08}
                    y2={y * 1.08}
                    stroke="#818cf8"
                    strokeWidth="1"
                    strokeDasharray="3 2"
                    animate={{
                      strokeOpacity: [0.2, 0.8, 0.2]
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      delay: i * 0.1
                    }}
                  />
                </g>
              );
            })}
          </g>
          
          {/* Corner HUD Elements */}
          {/* Top Left */}
          <g transform="translate(50, 50)">
            <rect width="100" height="2" fill="#818cf8" opacity="0.6" />
            <rect width="2" height="100" fill="#818cf8" opacity="0.6" />
            <motion.rect
              width="20"
              height="2"
              x="10"
              y="10"
              fill="#818cf8"
              animate={{ width: [20, 50, 20] }}
              transition={{ duration: 2.5, repeat: Infinity }}
            />
          </g>
          
          {/* Top Right */}
          <g transform="translate(650, 50)">
            <rect width="100" height="2" fill="#818cf8" opacity="0.6" />
            <rect width="2" height="100" x="98" fill="#818cf8" opacity="0.6" />
            <motion.rect
              width="20"
              height="2"
              x="70"
              y="10"
              fill="#818cf8"
              animate={{ width: [20, 50, 20] }}
              transition={{ duration: 2.5, repeat: Infinity, delay: 0.8 }}
            />
          </g>
          
          {/* Bottom Left */}
          <g transform="translate(50, 450)">
            <rect width="100" height="2" y="98" fill="#818cf8" opacity="0.6" />
            <rect width="2" height="100" fill="#818cf8" opacity="0.6" />
            <motion.rect
              width="20"
              height="2"
              x="10"
              y="80"
              fill="#818cf8"
              animate={{ width: [20, 50, 20] }}
              transition={{ duration: 2.5, repeat: Infinity, delay: 1.6 }}
            />
          </g>
          
          {/* Bottom Right */}
          <g transform="translate(650, 450)">
            <rect width="100" height="2" y="98" fill="#818cf8" opacity="0.6" />
            <rect width="2" height="100" x="98" fill="#818cf8" opacity="0.6" />
            <motion.rect
              width="20"
              height="2"
              x="70"
              y="80"
              fill="#818cf8"
              animate={{ width: [20, 50, 20] }}
              transition={{ duration: 2.5, repeat: Infinity, delay: 2.4 }}
            />
          </g>
          
          {/* Gradients */}
          <defs>
            <linearGradient id="helmetGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#818cf8" stopOpacity="0.8" />
              <stop offset="50%" stopColor="#6366f1" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#4f46e5" stopOpacity="0.2" />
            </linearGradient>
            
            <radialGradient id="eyeGradient" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.9" />
              <stop offset="30%" stopColor="#818cf8" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#4338ca" stopOpacity="0.4" />
            </radialGradient>
            
            <linearGradient id="ringGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#818cf8" stopOpacity="0.7" />
              <stop offset="50%" stopColor="#a78bfa" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#818cf8" stopOpacity="0.7" />
            </linearGradient>
          </defs>
        </svg>
      </div>
      
      {/* Ambient Glow Effects */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-purple-500/5 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '1.5s' }} />
    </div>
  );
}