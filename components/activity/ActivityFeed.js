'use client';

import { useState } from 'react';
import ActivityCard from './ActivityCard';

export default function ActivityFeed({ activities = [], onDelete, filterType = 'all', limit = 10 }) {
  const [filter, setFilter] = useState(filterType);
  
  // Filter activities based on type
  const filteredActivities = filter === 'all' 
    ? activities 
    : activities.filter(activity => activity.type === filter);

  // Get unique activity types for filter options
  const activityTypes = [...new Set(activities.map(activity => activity.type))];

  return (
    <div className="space-y-4">
      {/* Filter Controls */}
      <div className="flex flex-wrap gap-2 mb-4">
        <button
          onClick={() => setFilter('all')}
          className={`px-3 py-1 text-sm rounded-full ${
            filter === 'all'
              ? 'bg-[#00C48C] text-white'
              : 'bg-[#0D1117] text-[#E6EDF3] border border-[#30363D]'
          }`}
        >
          All
        </button>
        {activityTypes.map((type) => (
          <button
            key={type}
            onClick={() => setFilter(type)}
            className={`px-3 py-1 text-sm rounded-full capitalize ${
              filter === type
                ? 'bg-[#00C48C] text-white'
                : 'bg-[#0D1117] text-[#E6EDF3] border border-[#30363D]'
            }`}
          >
            {type}
          </button>
        ))}
      </div>

      {/* Activity List */}
      <div className="space-y-3">
        {filteredActivities.length > 0 ? (
          filteredActivities.slice(0, limit).map((activity) => (
            <ActivityCard
              key={activity.id}
              activity={activity}
              onDelete={onDelete}
            />
          ))
        ) : (
          <div className="text-center py-6">
            <p className="text-[#8B949E]">No activities found</p>
            <p className="text-sm text-[#6E7681] mt-1">
              {filter === 'all' 
                ? 'Log your first activity to see it here' 
                : `No ${filter} activities logged yet`}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}