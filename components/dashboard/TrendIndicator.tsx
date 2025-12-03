'use client';

import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface TrendIndicatorProps {
  direction: 'up' | 'down' | 'stable';
  percentage: number;
  size?: 'sm' | 'md' | 'lg';
}

const TrendIndicator = ({ direction, percentage, size = 'md' }: TrendIndicatorProps) => {
  const sizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base'
  };

  const iconSize = {
    sm: 'h-3 w-3',
    md: 'h-4 w-4',
    lg: 'h-5 w-5'
  };

  const directionColors = {
    up: 'text-[#00FFAA]',
    down: 'text-[#FF6B6B]',
    stable: 'text-[#8B949E]'
  };

  const IconComponent = direction === 'up' ? TrendingUp : 
                       direction === 'down' ? TrendingDown : 
                       Minus;

  return (
    <div className={`flex items-center gap-1 ${sizeClasses[size]}`}>
      <IconComponent className={`${iconSize[size]} ${directionColors[direction]}`} />
      <span className={`font-medium ${directionColors[direction]}`}>
        {percentage >= 0 ? '+' : ''}{percentage.toFixed(1)}%
      </span>
    </div>
  );
};

export default TrendIndicator;