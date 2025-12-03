'use client';

import { useEffect, useState } from 'react';
import { getSession } from '@/lib/session';

export default function WeeklyActivitySummary() {
  const [summary, setSummary] = useState({
    period: 'weekly',
    totalActivities: 0,
    totalDuration: 0,
    totalCalories: 0,
    totalXP: 0,
    averageIntensity: 0,
    totalSteps: 0
  });

  useEffect(() => {
    const loadWeeklyData = () => {
      try {
        const session = getSession();
        if (!session) return;

        // Load activities from localStorage
        const activityLogs = JSON.parse(localStorage.getItem(`activities_${session.username}`) || '[]');
        
        // Get activities from the last 7 days
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
        
        const weeklyActivities = activityLogs.filter(activity => {
          const activityDate = new Date(activity.date || activity.timestamp);
          return activityDate >= oneWeekAgo;
        });
        
        // Calculate weekly stats
        const weeklyCalories = weeklyActivities.reduce((sum, activity) => 
          sum + (activity.calories || activity.calories_burned || 0), 0);
          
        const weeklyXP = weeklyActivities.reduce((sum, activity) => 
          sum + (activity.xp || 0), 0);
          
        const weeklyDuration = weeklyActivities.reduce((sum, activity) => 
          sum + (activity.duration || 0), 0);
          
        // Calculate average intensity (assigning numeric values to intensity levels)
        const intensityMap = { 'low': 1, 'moderate': 2, 'high': 3 };
        const totalIntensity = weeklyActivities.reduce((sum, activity) => 
          sum + (intensityMap[activity.intensity] || 2), 0); // Default to moderate
        const averageIntensity = weeklyActivities.length > 0 
          ? totalIntensity / weeklyActivities.length 
          : 0;
          
        // Calculate steps (approximate for walking/running activities)
        const weeklySteps = weeklyActivities
          .filter(activity => activity.type === 'walking' || activity.type === 'running')
          .reduce((sum, activity) => sum + Math.round((activity.duration || 0) * 100), 0); // Approximate 100 steps per minute

        setSummary({
          period: 'weekly',
          totalActivities: weeklyActivities.length,
          totalDuration: weeklyDuration,
          totalCalories: weeklyCalories,
          totalXP: weeklyXP,
          averageIntensity: averageIntensity,
          totalSteps: weeklySteps
        });
      } catch (error) {
        console.error('Error loading weekly summary:', error);
        setSummary({
          period: 'weekly',
          totalActivities: 0,
          totalDuration: 0,
          totalCalories: 0,
          totalXP: 0,
          averageIntensity: 0,
          totalSteps: 0
        });
      }
    };

    loadWeeklyData();
  }, []);

  // Format intensity for display
  const formatIntensity = (value) => {
    if (value < 1.5) return 'Low';
    if (value < 2.5) return 'Moderate';
    return 'High';
  };

  return (
    <div className="bg-[#161B22] border border-[#30363D] p-5 rounded-2xl">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-[#E6EDF3]">Weekly Activity Summary</h2>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="text-center p-3 bg-[#0D1117] rounded-lg border border-[#30363D]">
          <div className="text-2xl font-bold text-[#00C48C]">{summary.totalActivities}</div>
          <div className="text-xs text-[#8B949E]">Activities</div>
        </div>
        <div className="text-center p-3 bg-[#0D1117] rounded-lg border border-[#30363D]">
          <div className="text-2xl font-bold text-[#4FB3FF]">{Math.round(summary.totalDuration)}m</div>
          <div className="text-xs text-[#8B949E]">Duration</div>
        </div>
        <div className="text-center p-3 bg-[#0D1117] rounded-lg border border-[#30363D]">
          <div className="text-2xl font-bold text-[#FFA726]">{summary.totalCalories}</div>
          <div className="text-xs text-[#8B949E]">Calories</div>
        </div>
        <div className="text-center p-3 bg-[#0D1117] rounded-lg border border-[#30363D]">
          <div className="text-2xl font-bold text-[#4FB3FF]">{summary.totalXP}</div>
          <div className="text-xs text-[#8B949E]">XP</div>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4 mt-4">
        <div className="text-center p-3 bg-[#0D1117] rounded-lg border border-[#30363D]">
          <div className="text-xl font-bold text-[#00C48C]">{summary.totalSteps.toLocaleString()}</div>
          <div className="text-xs text-[#8B949E]">Steps</div>
        </div>
        <div className="text-center p-3 bg-[#0D1117] rounded-lg border border-[#30363D]">
          <div className="text-xl font-bold text-[#FFA726]">{formatIntensity(summary.averageIntensity)}</div>
          <div className="text-xs text-[#8B949E]">Avg Intensity</div>
        </div>
      </div>
    </div>
  );
}