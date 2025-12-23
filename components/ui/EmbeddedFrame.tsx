'use client';

import { useState } from 'react';
import ArcReactor from './ArcReactor';

interface EmbeddedFrameProps {
  src: string;
  title: string;
  onBack: () => void;
  className?: string;
}

export default function EmbeddedFrame({ src, title, onBack, className = '' }: EmbeddedFrameProps) {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div className={`embedded-frame ${className}`}>
      {/* Frame Header */}
      <div className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between p-4 bg-gradient-to-b from-black/20 to-transparent">
        <div className="flex items-center space-x-3">
          <ArcReactor size="sm" intensity="medium" trigger={isLoading} />
          <div>
            <h2 className="system-value text-lg font-semibold">{title}</h2>
            <span className="system-label">EMBEDDED SYSTEM</span>
          </div>
        </div>
        
        <button
          onClick={onBack}
          className="tech-button tech-hover px-4 py-2 group"
          style={{
            background: 'rgba(255, 68, 68, 0.1)',
            border: '1px solid rgba(255, 68, 68, 0.2)'
          }}
        >
          <span className="text-red-400 group-hover:text-red-300 text-sm font-medium">
            ← BACK TO MODULES
          </span>
        </button>
      </div>

      {/* Loading Indicator */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/20 backdrop-blur-sm z-20">
          <div className="flex flex-col items-center space-y-4">
            <ArcReactor size="lg" intensity="high" trigger={true} />
            <div className="text-center">
              <div className="system-value text-lg">INITIALIZING SYSTEM</div>
              <div className="system-label">Loading external module...</div>
            </div>
          </div>
        </div>
      )}

      {/* Embedded Content */}
      <iframe
        src={src}
        className="w-full h-full"
        frameBorder="0"
        allowFullScreen
        sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox allow-top-navigation allow-top-navigation-by-user-activation"
        onLoad={() => setIsLoading(false)}
        onError={() => setIsLoading(false)}
      />

      {/* Frame Border Glow */}
      <div className="absolute inset-0 pointer-events-none border border-cyan-500/20 rounded-lg" />
    </div>
  );
}