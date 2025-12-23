'use client';

import { motion, AnimatePresence } from 'framer-motion';

interface CinematicIntroProps {
  type: 'companion' | 'todo' | 'coding' | 'games' | 'travel' | 'design' | 'community';
  isVisible: boolean;
  onComplete?: () => void;
}

export function CinematicIntro({ type, isVisible, onComplete }: CinematicIntroProps) {
  if (!isVisible) return null;

  const handleComplete = () => {
    setTimeout(() => onComplete?.(), 100);
  };

  return (
    <AnimatePresence onExitComplete={handleComplete}>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[9999] flex items-center justify-center pointer-events-none"
          style={{ background: 'rgba(0, 0, 0, 0.4)' }}
        >
          {renderIntro(type)}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function renderIntro(type: string) {
  switch (type) {
    case 'companion':
      return <CompanionIntro />;
    case 'todo':
      return <TodoIntro />;
    case 'coding':
      return <CodingIntro />;
    case 'games':
      return <GamesIntro />;
    case 'travel':
      return <TravelIntro />;
    case 'design':
      return <DesignIntro />;
    case 'community':
      return <CommunityIntro />;
    default:
      return null;
  }
}

function CompanionIntro() {
  return (
    <div className="flex flex-col items-center space-y-6">
      <motion.svg
        width="200"
        height="150"
        viewBox="0 0 200 150"
        initial={{ x: -300, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: -300, opacity: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        {/* Iron Man Hand Wireframe */}
        <g stroke="var(--arc-primary)" strokeWidth="2" fill="none">
          {/* Forearm */}
          <motion.line x1="20" y1="75" x2="80" y2="70" />
          <motion.line x1="20" y1="85" x2="80" y2="80" />
          
          {/* Wrist joint */}
          <motion.circle cx="80" cy="75" r="5" />
          
          {/* Palm structure */}
          <motion.path d="M 80 70 L 120 65 L 140 70 L 140 85 L 120 90 L 80 80 Z" />
          
          {/* Fingers */}
          <motion.line x1="120" y1="65" x2="130" y2="50" />
          <motion.line x1="130" y1="65" x2="145" y2="48" />
          <motion.line x1="140" y1="70" x2="155" y2="55" />
          <motion.line x1="140" y1="80" x2="150" y2="70" />
          
          {/* Arc Reactor in Palm */}
          <motion.circle
            cx="110"
            cy="77"
            r="12"
            stroke="var(--arc-primary)"
            strokeWidth="1.5"
            animate={{
              opacity: [0, 1, 1, 0],
              scale: [0.8, 1.2, 1.2, 0.8]
            }}
            transition={{
              duration: 1.2,
              times: [0, 0.3, 0.7, 1]
            }}
          />
          <motion.circle
            cx="110"
            cy="77"
            r="6"
            fill="var(--arc-primary)"
            animate={{
              opacity: [0, 0.8, 0.8, 0]
            }}
            transition={{
              duration: 1.2,
              times: [0, 0.3, 0.7, 1]
            }}
          />
        </g>
      </motion.svg>
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ delay: 0.4, duration: 0.3 }}
        className="system-label text-accent"
      >
        COMPANION SYSTEM ONLINE
      </motion.div>
    </div>
  );
}

function TodoIntro() {
  return (
    <div className="flex flex-col items-center space-y-6">
      <svg width="180" height="120" viewBox="0 0 180 120">
        {/* Grid lines */}
        {Array.from({ length: 6 }).map((_, i) => (
          <motion.line
            key={`grid-${i}`}
            x1="30"
            y1={20 + i * 16}
            x2="150"
            y2={20 + i * 16}
            stroke="var(--arc-primary)"
            strokeWidth="1"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 0.6 }}
            transition={{
              duration: 0.3,
              delay: i * 0.1,
              ease: "easeOut"
            }}
          />
        ))}
        
        {/* Checkboxes */}
        {Array.from({ length: 6 }).map((_, i) => (
          <motion.rect
            key={`box-${i}`}
            x="20"
            y={15 + i * 16}
            width="8"
            height="8"
            stroke="var(--arc-primary)"
            strokeWidth="1"
            fill="none"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 0.8 }}
            transition={{
              duration: 0.2,
              delay: i * 0.1 + 0.15
            }}
          />
        ))}
      </svg>
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="system-label text-accent"
      >
        TASK MANAGEMENT INITIALIZED
      </motion.div>
    </div>
  );
}

function CodingIntro() {
  return (
    <div className="flex flex-col items-center space-y-6">
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <motion.div
            key={i}
            className="flex space-x-2"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{
              duration: 0.2,
              delay: i * 0.1,
              ease: "easeOut"
            }}
          >
            {Array.from({ length: 10 + Math.floor(Math.random() * 5) }).map((_, j) => (
              <motion.div
                key={j}
                className="h-3 bg-accent/40 rounded-sm"
                style={{ width: `${8 + Math.random() * 20}px` }}
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{
                  duration: 0.15,
                  delay: i * 0.1 + j * 0.02
                }}
              />
            ))}
          </motion.div>
        ))}
      </div>
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
        className="system-label text-accent"
      >
        CODE ANALYSIS READY
      </motion.div>
    </div>
  );
}

function GamesIntro() {
  return (
    <div className="flex flex-col items-center space-y-6">
      <motion.svg
        width="120"
        height="120"
        viewBox="0 0 120 120"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.3 }}
        transition={{ duration: 0.4 }}
      >
        {/* Iron Man Helmet Silhouette */}
        <motion.path
          d="M60 20 C75 20, 90 30, 90 50 L90 75 C90 95, 75 105, 60 105 C45 105, 30 95, 30 75 L30 50 C30 30, 45 20, 60 20 Z"
          stroke="var(--arc-primary)"
          strokeWidth="2"
          fill="none"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.6 }}
        />
        
        {/* Eyes - Blink effect */}
        <motion.ellipse
          cx="48"
          cy="55"
          rx="6"
          ry="10"
          fill="var(--arc-primary)"
          animate={{
            scaleY: [1, 0.1, 1]
          }}
          transition={{
            duration: 0.3,
            times: [0, 0.5, 1],
            delay: 0.5
          }}
        />
        <motion.ellipse
          cx="72"
          cy="55"
          rx="6"
          ry="10"
          fill="var(--arc-primary)"
          animate={{
            scaleY: [1, 0.1, 1]
          }}
          transition={{
            duration: 0.3,
            times: [0, 0.5, 1],
            delay: 0.5
          }}
        />
        
        {/* HUD Scan Line */}
        <motion.line
          x1="30"
          y1="60"
          x2="90"
          y2="60"
          stroke="var(--arc-primary)"
          strokeWidth="1"
          opacity="0.5"
          animate={{
            y1: [30, 90],
            y2: [30, 90]
          }}
          transition={{
            duration: 0.8,
            delay: 0.3
          }}
        />
      </motion.svg>
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="system-label text-accent"
      >
        ENTERTAINMENT SYSTEMS ACTIVE
      </motion.div>
    </div>
  );
}

function TravelIntro() {
  return (
    <div className="flex flex-col items-center space-y-6">
      <svg width="200" height="100" viewBox="0 0 200 100">
        {/* Runway */}
        <motion.line
          x1="0"
          y1="70"
          x2="200"
          y2="70"
          stroke="var(--arc-primary)"
          strokeWidth="1"
          strokeDasharray="10 5"
          opacity="0.4"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.4 }}
        />
        
        {/* Aircraft Wireframe */}
        <motion.g
          initial={{ x: -50, y: 10 }}
          animate={{
            x: [0, 100, 100, 150],
            y: [10, 0, 0, -30]
          }}
          transition={{
            duration: 1.2,
            times: [0, 0.4, 0.6, 1],
            ease: "easeInOut"
          }}
        >
          {/* Fuselage */}
          <path
            d="M 0 0 L 30 0 L 35 -3 L 30 -6 L 0 -6 Z"
            stroke="var(--arc-primary)"
            strokeWidth="1.5"
            fill="none"
          />
          {/* Wings */}
          <line x1="10" y1="-3" x2="10" y2="-15" stroke="var(--arc-primary)" strokeWidth="1.5" />
          <line x1="10" y1="-3" x2="10" y2="9" stroke="var(--arc-primary)" strokeWidth="1.5" />
          {/* Tail */}
          <line x1="0" y1="-3" x2="-5" y2="-8" stroke="var(--arc-primary)" strokeWidth="1" />
        </motion.g>
      </svg>
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="system-label text-accent"
      >
        FLIGHT SYSTEM READY
      </motion.div>
    </div>
  );
}

function DesignIntro() {
  return (
    <div className="flex flex-col items-center space-y-6">
      <svg width="160" height="120" viewBox="0 0 160 120">
        {/* Blueprint Grid */}
        {Array.from({ length: 8 }).map((_, i) => (
          <motion.line
            key={`v-${i}`}
            x1={20 + i * 20}
            y1="20"
            x2={20 + i * 20}
            y2="100"
            stroke="var(--arc-primary)"
            strokeWidth="0.5"
            opacity="0.3"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.3, delay: i * 0.05 }}
          />
        ))}
        {Array.from({ length: 5 }).map((_, i) => (
          <motion.line
            key={`h-${i}`}
            x1="20"
            y1={20 + i * 20}
            x2="160"
            y2={20 + i * 20}
            stroke="var(--arc-primary)"
            strokeWidth="0.5"
            opacity="0.3"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.3, delay: i * 0.05 }}
          />
        ))}
        
        {/* CAD Wireframe */}
        <motion.rect
          x="50"
          y="40"
          width="60"
          height="40"
          stroke="var(--arc-primary)"
          strokeWidth="1.5"
          fill="none"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 0.8 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        />
        <motion.circle
          cx="80"
          cy="60"
          r="15"
          stroke="var(--arc-primary)"
          strokeWidth="1.5"
          fill="none"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 0.8 }}
          transition={{ duration: 0.4, delay: 0.6 }}
        />
      </svg>
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.9 }}
        className="system-label text-accent"
      >
        DESIGN WORKSPACE LOADED
      </motion.div>
    </div>
  );
}

function CommunityIntro() {
  const nodes = [
    { x: 40, y: 40 },
    { x: 90, y: 30 },
    { x: 140, y: 50 },
    { x: 60, y: 90 },
    { x: 120, y: 100 }
  ];

  const connections = [
    [0, 1], [1, 2], [0, 3], [2, 4], [3, 4], [1, 4]
  ];

  return (
    <div className="flex flex-col items-center space-y-6">
      <svg width="180" height="140" viewBox="0 0 180 140">
        {/* Connection Lines */}
        {connections.map(([start, end], i) => (
          <motion.line
            key={`conn-${i}`}
            x1={nodes[start].x}
            y1={nodes[start].y}
            x2={nodes[end].x}
            y2={nodes[end].y}
            stroke="var(--arc-primary)"
            strokeWidth="1"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 0.6 }}
            transition={{
              duration: 0.4,
              delay: i * 0.1,
              ease: "easeOut"
            }}
          />
        ))}
        
        {/* Nodes */}
        {nodes.map((node, i) => (
          <motion.circle
            key={`node-${i}`}
            cx={node.x}
            cy={node.y}
            r="5"
            fill="var(--arc-primary)"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 0.8 }}
            transition={{
              duration: 0.3,
              delay: i * 0.1 + 0.2
            }}
          />
        ))}
      </svg>
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="system-label text-accent"
      >
        COMMUNICATION CHANNELS ACTIVE
      </motion.div>
    </div>
  );
}