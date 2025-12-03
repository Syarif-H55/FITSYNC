import React from 'react';

interface Props {
  title: string;
  value: string | number;
  description?: string;
  icon?: React.ReactNode;
  color?: string;
  className?: string;
}

const MetricCard: React.FC<Props> = ({
  title,
  value,
  description,
  icon,
  color = 'text-white',
  className = ''
}) => {
  return (
    <div className={`p-4 text-center bg-[#161B22] border-[#30363D] rounded-2xl shadow-md transition-all duration-200 ${className}`}>
      {icon && <div className="mx-auto mb-2">{icon}</div>}
      <h3 className="text-sm font-medium text-[#8B949E]">{title}</h3>
      <p className={`text-xl font-bold ${color}`}>{value}</p>
      {description && <p className="text-xs text-[#8B949E] mt-1">{description}</p>}
    </div>
  );
};

export default MetricCard;