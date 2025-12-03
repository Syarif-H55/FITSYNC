// components/charts/SimpleChart.js
import React from 'react';

const SimpleChart = ({ data, type = 'line', color = '#00C48C' }) => {
  // This is a simplified version - in a real app, you'd use Recharts or similar
  if (!data || data.length === 0) return null;
  
  const maxValue = Math.max(...data.map(item => item.value));
  const minValue = Math.min(...data.map(item => item.value));
  const range = maxValue - minValue || 1; // Avoid division by zero
  
  const points = data.map((item, index) => {
    const x = (index / (data.length - 1)) * 100;
    const y = 100 - ((item.value - minValue) / range) * 100;
    
    return `${x}% ${y}%`;
  }).join(', ');

  return (
    <div className="w-full h-32 relative">
      <svg 
        viewBox="0 0 100 100" 
        preserveAspectRatio="none" 
        className="w-full h-full"
      >
        {/* Background grid lines */}
        <line x1="0" y1="25" x2="100" y2="25" stroke="rgba(255,255,255,0.1)" strokeWidth="0.5" />
        <line x1="0" y1="50" x2="100" y2="50" stroke="rgba(255,255,255,0.1)" strokeWidth="0.5" />
        <line x1="0" y1="75" x2="100" y2="75" stroke="rgba(255,255,255,0.1)" strokeWidth="0.5" />
        
        {/* Chart line */}
        <polyline
          fill="none"
          stroke={color}
          strokeWidth="2"
          points={points}
          className="drop-shadow-sm"
        />
      </svg>
    </div>
  );
};

export default SimpleChart;