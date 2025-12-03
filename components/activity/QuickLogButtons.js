'use client';

import { useXp } from '@/context/XpContext';

export default function QuickLogButtons({ onQuickLog }) {
  const { updateXp } = useXp();

  const quickActivities = [
    { 
      type: 'walking', 
      label: '10 Min Walk', 
      icon: '🚶', 
      duration: 10, 
      intensity: 'low',
      calories: 40,
      xp: 4
    },
    { 
      type: 'running', 
      label: '20 Min Run', 
      icon: '🏃', 
      duration: 20, 
      intensity: 'high',
      calories: 200,
      xp: 12
    },
    { 
      type: 'workout', 
      label: '30 Min Workout', 
      icon: '💪', 
      duration: 30, 
      intensity: 'moderate',
      calories: 210,
      xp: 12
    },
    { 
      type: 'yoga', 
      label: '15 Min Yoga', 
      icon: '🧘', 
      duration: 15, 
      intensity: 'low',
      calories: 45,
      xp: 6
    }
  ];

  const handleQuickLog = (activity) => {
    const fullActivity = {
      ...activity,
      notes: `Quick log: ${activity.label}`,
      date: new Date().toISOString(),
      id: Date.now().toString()
    };

    // Log the activity
    onQuickLog(fullActivity);

    // Update XP
    updateXp(activity.xp, `quick_activity_${activity.type}`);
  };

  return (
    <div className="mt-6">
      <h3 className="text-sm font-medium text-[#8B949E] mb-3">Quick Activities</h3>
      <div className="grid grid-cols-2 gap-2">
        {quickActivities.map((activity, index) => (
          <button
            key={index}
            type="button"
            onClick={() => handleQuickLog(activity)}
            className="flex flex-col items-center justify-center p-3 bg-[#0D1117] border border-[#30363D] rounded-lg hover:bg-[#161B22] transition-colors"
          >
            <span className="text-xl mb-1">{activity.icon}</span>
            <span className="text-xs text-[#E6EDF3] text-center">{activity.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}