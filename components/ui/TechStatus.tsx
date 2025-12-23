import { ReactNode } from 'react';

interface TechStatusProps {
  status: 'active' | 'warning' | 'error' | 'info';
  label: string;
  children?: ReactNode;
  className?: string;
}

export default function TechStatus({ status, label, children, className = '' }: TechStatusProps) {
  return (
    <div className={`status-indicator status-${status} ${className}`}>
      <div className="status-dot"></div>
      <span className="tech-label">{label}</span>
      {children}
    </div>
  );
}