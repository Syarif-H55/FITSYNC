import { Sparkles } from 'lucide-react';
import { useXp } from '@/context/XpContext';
import { getLevelProgress } from '@/lib/xpCalculator';

export default function XPBadge({ size = 'default' }) {
  const { xp, level } = useXp();
  const sizeClasses = {
    small: 'text-xs px-2 py-1',
    default: 'text-sm px-3 py-1.5',
    large: 'text-base px-4 py-2'
  };

  const textSize = {
    small: 'text-xs',
    default: 'text-sm',
    large: 'text-base'
  };

  const progress = getLevelProgress(xp);

  return (
    <div className="flex flex-col items-center">
      <div className={`flex items-center bg-primary/10 rounded-full ${sizeClasses[size]}`}>
        <Sparkles className={`h-4 w-4 text-primary mr-1 ${size === 'large' ? 'h-5 w-5' : ''}`} />
        <span className={`font-medium text-primary ${textSize[size]}`}>Lvl {level} | {xp} XP</span>
      </div>
      <div className="w-24 h-1.5 bg-gray-200 rounded-full mt-1 overflow-hidden">
        <div 
          className="h-full bg-[#00C48C]" 
          style={{ width: `${progress}%` }}
        ></div>
      </div>
    </div>
  );
}