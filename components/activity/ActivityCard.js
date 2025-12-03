'use client';

import { motion } from 'framer-motion';

export default function ActivityCard({ activity, onDelete }) {
  const getActivityIcon = (type) => {
    const icons = {
      walking: '🚶',
      running: '🏃',
      cycling: '🚴',
      workout: '💪',
      yoga: '🧘',
      swimming: '🏊'
    };
    return icons[type] || '💪';
  };

  const getActivityColor = (type) => {
    const colors = {
      walking: 'border-[#00C48C]',
      running: 'border-[#FF6B6B]',
      cycling: 'border-[#4FB3FF]',
      workout: 'border-[#FFA726]',
      yoga: 'border-[#9C27B0]',
      swimming: 'border-[#2196F3]'
    };
    return colors[type] || 'border-[#30363D]';
  };

  const getIntensityColor = (intensity) => {
    const colors = {
      low: 'text-[#00C48C]',
      moderate: 'text-[#FFA726]',
      high: 'text-[#FF6B6B]'
    };
    return colors[intensity] || 'text-[#8B949E]';
  };

  const getActivityBgColor = (type) => {
    const colors = {
      walking: 'bg-[#00C48C]/10',
      running: 'bg-[#FF6B6B]/10',
      cycling: 'bg-[#4FB3FF]/10',
      workout: 'bg-[#FFA726]/10',
      yoga: 'bg-[#9C27B0]/10',
      swimming: 'bg-[#2196F3]/10'
    };
    return colors[type] || 'bg-[#30363D]/10';
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleDelete = () => {
    if (onDelete && activity.id) {
      onDelete(activity.id);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className={`bg-[#0D1117] rounded-xl p-4 border-l-4 ${getActivityColor(activity.type)} ${getActivityBgColor(activity.type)} relative`}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-4">
          <div className="text-2xl">{getActivityIcon(activity.type)}</div>
          <div className="flex-1">
            <h3 className="font-semibold text-[#E6EDF3] capitalize">{activity.type}</h3>
            <p className="text-[#8B949E] text-sm">{activity.duration} minutes</p>
            <p className={`text-sm ${getIntensityColor(activity.intensity)} capitalize`}>
              {activity.intensity} Intensity
            </p>
            {activity.notes && (
              <p className="text-[#8B949E] text-sm mt-1 italic">"{activity.notes}"</p>
            )}
            <p className="text-xs text-[#6E7681] mt-2">{formatDate(activity.date)}</p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-[#00C48C] font-semibold">{activity.calories} cal</div>
          <div className="text-[#4FB3FF] font-semibold">{activity.xp} XP</div>
        </div>
      </div>

      {/* Delete button */}
      {onDelete && activity.id && (
        <button
          onClick={handleDelete}
          className="absolute top-2 right-2 text-[#FF6B6B] hover:text-[#FF5252] transition-colors"
          title="Delete activity"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
      )}
    </motion.div>
  );
}