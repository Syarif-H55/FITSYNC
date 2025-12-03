'use client';

import { cn } from '@/lib/utils';

const Progress = ({ value, className, ...props }) => {
  return (
    <div 
      className={cn(
        'relative h-4 w-full overflow-hidden rounded-full bg-gray-200',
        className
      )}
      {...props}
    >
      <div
        className="h-full w-full flex-1 bg-[#00C48C] transition-all duration-300 ease-in-out"
        style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
      />
    </div>
  );
};

export { Progress };