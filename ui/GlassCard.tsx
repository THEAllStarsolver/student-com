import { ReactNode } from 'react';

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}

export default function GlassCard({ children, className = '', onClick }: GlassCardProps) {
  return (
    <div
      onClick={onClick}
      className={`
        backdrop-blur-xl
        bg-slate-800/40
        border border-white/10
        rounded-2xl p-6
        shadow-xl
        transition-all duration-300 ease-out
        ${onClick ? 'cursor-pointer hover:scale-[1.01] hover:shadow-2xl active:scale-[0.99]' : ''}
        ${className}
      `}
    >
      {children}
    </div>
  );
}
