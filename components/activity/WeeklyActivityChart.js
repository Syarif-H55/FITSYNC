'use client';

import { useEffect, useState } from 'react';

// Helper function to get the start of the week (Sunday)
const getWeekStart = (date) => {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day; // Sunday of the current week
  return new Date(d.setDate(diff));
};

// Helper function to format date as YYYY-MM-DD
const formatDate = (date) => {
  return date.toISOString().split('T')[0];
};

export default function WeeklyActivityChart({ activities = [] }) {
  const [weeklyData, setWeeklyData] = useState([]);

  useEffect(() => {
    // Calculate weekly data
    const weekStart = getWeekStart(new Date());
    const weekData = [];

    for (let i = 0; i < 7; i++) {
      const date = new Date(weekStart);
      date.setDate(weekStart.getDate() + i);
      
      const dateStr = formatDate(date);
      const dayActivities = activities.filter(activity => {
        const activityDate = new Date(activity.date || activity.timestamp);
        return formatDate(activityDate) === dateStr;
      });

      const totalCalories = dayActivities.reduce((sum, activity) => 
        sum + (activity.calories || activity.calories_burned || 0), 0);
      
      const totalDuration = dayActivities.reduce((sum, activity) => 
        sum + (activity.duration || 0), 0);
        
      const totalXP = dayActivities.reduce((sum, activity) => 
        sum + (activity.xp || 0), 0);

      weekData.push({
        date: dateStr,
        day: date.toLocaleDateString('en-US', { weekday: 'short' }),
        totalCalories,
        totalDuration,
        totalXP,
        activityCount: dayActivities.length
      });
    }

    setWeeklyData(weekData);
  }, [activities]);

  // Calculate max value for scaling the chart
  const maxCalories = Math.max(...weeklyData.map(d => d.totalCalories), 1);
  const maxDuration = Math.max(...weeklyData.map(d => d.totalDuration), 1);

  return (
    <div className="bg-[#161B22] border border-[#30363D] p-5 rounded-2xl">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-[#E6EDF3]">Weekly Activity</h2>
        <span className="text-xs text-[#8B949E]">Last 7 days</span>
      </div>
      
      <div className="flex items-end justify-between h-32 gap-1 mt-6">
        {weeklyData.map((day, index) => (
          <div key={index} className="flex flex-col items-center flex-1">
            <div className="flex flex-col items-center flex-1 justify-end w-full">
              {/* Duration bar */}
              <div 
                className="w-3/4 bg-[#4FB3FF] rounded-t-md transition-all duration-500 ease-out"
                style={{ 
                  height: `${(day.totalDuration / maxDuration) * 100}%`,
                  minHeight: day.totalDuration > 0 ? '4px' : '0px'
                }}
                title={`Duration: ${day.totalDuration} min`}
              ></div>
              
              {/* Calories bar */}
              <div 
                className="w-3/4 bg-[#00C48C] rounded-t-md mt-1 transition-all duration-500 ease-out"
                style={{ 
                  height: `${(day.totalCalories / maxCalories) * 100}%`,
                  minHeight: day.totalCalories > 0 ? '4px' : '0px'
                }}
                title={`Calories: ${day.totalCalories}`}
              ></div>
            </div>
            <span className="text-xs text-[#8B949E] mt-2">{day.day.substring(0, 1)}</span>
          </div>
        ))}
      </div>
      
      <div className="flex justify-center gap-6 mt-6">
        <div className="flex items-center">
          <div className="w-3 h-3 bg-[#4FB3FF] rounded mr-2"></div>
          <span className="text-xs text-[#8B949E]">Duration (min)</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 bg-[#00C48C] rounded mr-2"></div>
          <span className="text-xs text-[#8B949E]">Calories</span>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4 mt-4">
        <div className="text-center p-2 bg-[#0D1117] rounded-lg">
          <div className="text-lg font-bold text-[#00C48C]">
            {weeklyData.reduce((sum, day) => sum + day.totalCalories, 0)}
          </div>
          <div className="text-xs text-[#8B949E]">Total Calories</div>
        </div>
        <div className="text-center p-2 bg-[#0D1117] rounded-lg">
          <div className="text-lg font-bold text-[#4FB3FF]">
            {weeklyData.reduce((sum, day) => sum + day.activityCount, 0)}
          </div>
          <div className="text-xs text-[#8B949E]">Total Activities</div>
        </div>
      </div>
    </div>
  );
}