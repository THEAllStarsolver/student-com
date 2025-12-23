'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ArcReactorLoaderProps {
  isVisible: boolean;
  operation?: string;
  onComplete?: () => void;
}

export default function ArcReactorLoader({ 
  isVisible, 
  operation = "OPERATION", 
  onComplete 
}: ArcReactorLoaderProps) {
  const [phase, setPhase] = useState<'split' | 'rotate' | 'merge' | 'exit'>('split');

  useEffect(() => {
    if (!isVisible) return;

    const timer1 = setTimeout(() => setPhase('rotate'), 300);
    const timer2 = setTimeout(() => setPhase('merge'), 800);
    const timer3 = setTimeout(() => setPhase('exit'), 1000);
    const timer4 = setTimeout(() => {
      onComplete?.();
    }, 1200);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
    };
  }, [isVisible, onComplete]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[10000] flex items-center justify-center"
          style={{
            background: 'rgba(0, 0, 0, 0.6)',
            backdropFilter: 'blur(8px)'
          }}
        >
          <div className="flex flex-col items-center space-y-8">
            {/* High-Detail Arc Reactor */}
            <div className="relative w-32 h-32">
              <svg viewBox="0 0 200 200" className="w-full h-full">
                {/* Outer Ring - Counter-clockwise */}
                <motion.g
                  animate={phase === 'rotate' ? {
                    rotate: -360,
                    scale: phase === 'merge' ? 0.8 : 1
                  } : {}}
                  transition={{
                    rotate: { duration: 3, repeat: Infinity, ease: "linear" },
                    scale: { duration: 0.3 }
                  }}
                  style={{ transformOrigin: '100px 100px' }}
                >
                  {Array.from({ length: 12 }).map((_, i) => {
                    const angle = (i * 30) - 90;
                    const startAngle = angle;
                    const endAngle = angle + 22;
                    const startRad = (startAngle * Math.PI) / 180;
                    const endRad = (endAngle * Math.PI) / 180;
                    const radius = 85;
                    
                    const x1 = 100 + radius * Math.cos(startRad);
                    const y1 = 100 + radius * Math.sin(startRad);
                    const x2 = 100 + radius * Math.cos(endRad);
                    const y2 = 100 + radius * Math.sin(endRad);
                    
                    return (
                      <motion.path
                        key={`outer-${i}`}
                        d={`M ${x1} ${y1} A ${radius} ${radius} 0 0 1 ${x2} ${y2}`}
                        fill="none"
                        stroke="var(--arc-primary)"
                        strokeWidth="2"
                        initial={{ pathLength: 0, opacity: 0 }}
                        animate={{
                          pathLength: phase === 'split' ? 1 : phase === 'merge' ? 0 : 1,
                          opacity: phase === 'split' ? 1 : phase === 'merge' ? 0 : 1
                        }}
                        transition={{
                          duration: 0.3,
                          delay: i * 0.02
                        }}
                      />
                    );
                  })}
                </motion.g>

                {/* Middle Ring - Clockwise */}
                <motion.g
                  animate={phase === 'rotate' ? {
                    rotate: 360,
                    scale: phase === 'merge' ? 0.9 : 1
                  } : {}}
                  transition={{
                    rotate: { duration: 2, repeat: Infinity, ease: "linear" },
                    scale: { duration: 0.3 }
                  }}
                  style={{ transformOrigin: '100px 100px' }}
                >
                  {Array.from({ length: 8 }).map((_, i) => {
                    const angle = (i * 45) - 90;
                    const startAngle = angle;
                    const endAngle = angle + 30;
                    const startRad = (startAngle * Math.PI) / 180;
                    const endRad = (endAngle * Math.PI) / 180;
                    const radius = 60;
                    
                    const x1 = 100 + radius * Math.cos(startRad);
                    const y1 = 100 + radius * Math.sin(startRad);
                    const x2 = 100 + radius * Math.cos(endRad);
                    const y2 = 100 + radius * Math.sin(endRad);
                    
                    return (
                      <motion.path
                        key={`middle-${i}`}
                        d={`M ${x1} ${y1} A ${radius} ${radius} 0 0 1 ${x2} ${y2}`}
                        fill="none"
                        stroke="var(--arc-secondary)"
                        strokeWidth="1.5"
                        initial={{ pathLength: 0, opacity: 0 }}
                        animate={{
                          pathLength: phase === 'split' ? 1 : phase === 'merge' ? 0 : 1,
                          opacity: phase === 'split' ? 0.8 : phase === 'merge' ? 0 : 0.8
                        }}
                        transition={{
                          duration: 0.3,
                          delay: i * 0.03
                        }}
                      />
                    );
                  })}
                </motion.g>

                {/* Inner Ring - Counter-clockwise fast */}
                <motion.circle
                  cx="100"
                  cy="100"
                  r="35"
                  fill="none"
                  stroke="var(--arc-primary)"
                  strokeWidth="1"
                  animate={phase === 'rotate' ? {
                    rotate: -360,
                    scale: phase === 'merge' ? 1 : 1
                  } : {}}
                  transition={{
                    rotate: { duration: 1.5, repeat: Infinity, ease: "linear" },
                    scale: { duration: 0.3 }
                  }}
                  style={{ transformOrigin: '100px 100px' }}
                  strokeDasharray="10 5"
                />

                {/* Energy Calibration Ticks */}
                {Array.from({ length: 16 }).map((_, i) => {
                  const angle = (i * 22.5) - 90;
                  const rad = (angle * Math.PI) / 180;
                  const innerRadius = 40;
                  const outerRadius = 50;
                  
                  const x1 = 100 + innerRadius * Math.cos(rad);
                  const y1 = 100 + innerRadius * Math.sin(rad);
                  const x2 = 100 + outerRadius * Math.cos(rad);
                  const y2 = 100 + outerRadius * Math.sin(rad);
                  
                  return (
                    <motion.line
                      key={`tick-${i}`}
                      x1={x1}
                      y1={y1}
                      x2={x2}
                      y2={y2}
                      stroke="var(--arc-primary)"
                      strokeWidth="0.5"
                      animate={{
                        opacity: [0.3, 0.8, 0.3]
                      }}
                      transition={{
                        duration: 1,
                        repeat: Infinity,
                        delay: i * 0.05
                      }}
                    />
                  );
                })}

                {/* Core Glow */}
                <motion.circle
                  cx="100"
                  cy="100"
                  r="15"
                  fill="var(--arc-primary)"
                  opacity="0.3"
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.3, 0.6, 0.3]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  style={{ transformOrigin: '100px 100px' }}
                />

                {/* Center Core */}
                <circle
                  cx="100"
                  cy="100"
                  r="8"
                  fill="none"
                  stroke="var(--arc-primary)"
                  strokeWidth="1.5"
                />
              </svg>
            </div>

            {/* System Text */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-center"
            >
              <div className="system-operation text-accent font-mono text-sm font-semibold tracking-widest uppercase mb-2">
                INITIALIZING {operation}
              </div>
              <div className="system-status text-secondary font-mono text-xs tracking-wider uppercase opacity-70">
                SYSTEM STATUS: CALIBRATING MODULES
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}