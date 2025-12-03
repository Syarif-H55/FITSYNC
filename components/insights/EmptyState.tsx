import React from 'react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { Activity, Utensils, Moon, Target } from 'lucide-react';

interface Props {
  message?: string;
  actionText?: string;
  actionPath?: string;
  icon?: React.ReactNode;
  className?: string;
}

const EmptyState: React.FC<Props> = ({
  message = "No activity data found",
  actionText = "Start tracking your workouts, meals, steps, or sleep to get insights.",
  actionPath = "/dashboard",
  icon,
  className = ""
}) => {
  const router = useRouter();
  
  return (
    <div className={`p-6 bg-[#161B22] border border-[#30363D] rounded-2xl text-center ${className}`}>
      <div className="flex justify-center mb-4">
        {icon || <Activity className="h-12 w-12 text-[#7C3AED]" />}
      </div>
      <h3 className="text-lg font-medium text-white mb-2">No Data Available</h3>
      <p className="text-[#8B949E] mb-4">{message}</p>
      <p className="text-[#8B949E] mb-6">{actionText}</p>
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Button
          onClick={() => router.push('/dashboard')}
          className="bg-gradient-to-r from-[#7C3AED] to-[#00FFAA] hover:from-[#6d32d6] hover:to-[#00e69a] text-white"
        >
          Go to Dashboard
        </Button>
        <Button
          onClick={() => router.push('/activities')}
          variant="outline"
          className="border-[#30363D] text-white hover:bg-[#22252D]"
        >
          Log Activities
        </Button>
      </div>
    </div>
  );
};

export default EmptyState;