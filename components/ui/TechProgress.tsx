interface TechProgressProps {
  value: number;
  max?: number;
  label?: string;
  className?: string;
}

export default function TechProgress({ value, max = 100, label, className = '' }: TechProgressProps) {
  const percentage = Math.min((value / max) * 100, 100);
  
  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <div className="flex justify-between items-center">
          <span className="tech-label">{label}</span>
          <span className="tech-data text-xs">{value}/{max}</span>
        </div>
      )}
      <div className="tech-progress">
        <div 
          className="tech-progress-bar" 
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}