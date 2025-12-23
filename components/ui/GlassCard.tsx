import { ReactNode } from 'react';

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  variant?: 'default' | 'elevated' | 'interactive';
}

export default function GlassCard({ 
  children, 
  className = '', 
  onClick, 
  variant = 'default' 
}: GlassCardProps) {
  const getVariantStyles = () => {
    switch (variant) {
      case 'elevated':
        return {
          background: 'var(--glass-bg-elevated)',
          backdropFilter: 'var(--glass-blur-heavy)',
          border: '1px solid var(--glass-border-strong)',
          boxShadow: `
            0 8px 32px rgba(0, 0, 0, 0.3),
            inset 0 1px 0 rgba(255, 255, 255, 0.15),
            0 0 0 1px rgba(0, 212, 255, 0.1)
          `
        };
      case 'interactive':
        return {
          background: 'var(--glass-bg-secondary)',
          backdropFilter: 'var(--glass-blur)',
          border: '1px solid var(--glass-border)',
          boxShadow: `
            0 4px 16px rgba(0, 0, 0, 0.2),
            inset 0 1px 0 rgba(255, 255, 255, 0.1)
          `,
          transition: 'all 150ms ease-out'
        };
      default:
        return {
          background: 'var(--glass-bg-primary)',
          backdropFilter: 'var(--glass-blur)',
          border: '1px solid var(--glass-border)',
          boxShadow: `
            0 4px 16px rgba(0, 0, 0, 0.2),
            inset 0 1px 0 rgba(255, 255, 255, 0.08)
          `
        };
    }
  };

  const hoverStyles = onClick || variant === 'interactive' ? {
    ':hover': {
      background: 'var(--glass-bg-elevated)',
      borderColor: 'rgba(0, 212, 255, 0.2)',
      boxShadow: `
        0 8px 32px rgba(0, 0, 0, 0.4),
        inset 0 1px 0 rgba(255, 255, 255, 0.15),
        0 0 0 1px rgba(0, 212, 255, 0.15)
      `,
      transform: 'translateY(-2px)'
    }
  } : {};
  
  return (
    <div
      onClick={onClick}
      className={`
        relative rounded-lg p-6 transition-all duration-150
        ${onClick ? 'cursor-pointer' : ''}
        ${className}
      `}
      style={{
        ...getVariantStyles(),
        position: 'relative'
      }}
      onMouseEnter={(e) => {
        if (onClick || variant === 'interactive') {
          const target = e.currentTarget as HTMLElement;
          target.style.background = 'var(--glass-bg-elevated)';
          target.style.borderColor = 'rgba(0, 212, 255, 0.2)';
          target.style.boxShadow = `
            0 8px 32px rgba(0, 0, 0, 0.4),
            inset 0 1px 0 rgba(255, 255, 255, 0.15),
            0 0 0 1px rgba(0, 212, 255, 0.15)
          `;
          target.style.transform = 'translateY(-2px)';
        }
      }}
      onMouseLeave={(e) => {
        if (onClick || variant === 'interactive') {
          const target = e.currentTarget as HTMLElement;
          const styles = getVariantStyles();
          target.style.background = styles.background;
          target.style.borderColor = styles.border.split(' ')[3]; // Extract border color
          target.style.boxShadow = styles.boxShadow;
          target.style.transform = 'translateY(0)';
        }
      }}
    >
      {/* Top Glow Line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-400/30 to-transparent opacity-60" />
      
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
      
      {/* Interactive Glow Effect */}
      {(onClick || variant === 'interactive') && (
        <div className="absolute inset-0 rounded-lg opacity-0 hover:opacity-100 transition-opacity duration-200 pointer-events-none bg-gradient-to-br from-cyan-500/5 via-transparent to-blue-500/5" />
      )}
    </div>
  );
}
