// lib/dataAggregator.js
import { getSession } from './session';

export const aggregateWeeklyData = () => {
  // Get data from localStorage or use default values
  const today = new Date();
  const weekData = [];

  // Get session to access user-specific activity data
  const session = getSession();

  for (let i = 6; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    
    const formattedDate = date.toISOString().split('T')[0];
    const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
    
    // Get steps from activities for the specific date
    let dailySteps = 0;
    let dailyCalories = 0;
    
    if (session) {
      // Load activities for the user
      const activityData = JSON.parse(localStorage.getItem(`activities_${session.username}`) || '[]');
      
      // Filter activities for the specific date
      const dayActivities = activityData.filter(activity => {
        const activityDate = new Date(activity.date || activity.timestamp);
        const activityFormattedDate = activityDate.toISOString().split('T')[0];
        return activityFormattedDate === formattedDate;
      });
      
      // Calculate steps from walking/running activities (approximation)
      dailySteps = dayActivities
        .filter(activity => activity.type === 'walking' || activity.type === 'running')
        .reduce((sum, activity) => sum + Math.round((activity.duration || 0) * 100), 0); // Approximate 100 steps per minute
      
      // Calculate calories from all activities
      dailyCalories = dayActivities.reduce((sum, activity) => 
        sum + (activity.calories || activity.calories_burned || 0), 0);
    }
    
    // Try to get legacy data from localStorage for this date as fallback
    const legacyStepsKey = `steps-${formattedDate}`;
    const legacyCaloriesKey = `calories-${formattedDate}`;
    const sleepKey = `sleep-${formattedDate}`;
    
    const legacySteps = localStorage.getItem(legacyStepsKey) ? parseInt(localStorage.getItem(legacyStepsKey)) : 0;
    const legacyCalories = localStorage.getItem(legacyCaloriesKey) ? parseInt(localStorage.getItem(legacyCaloriesKey)) : 0;
    const sleep = localStorage.getItem(sleepKey) ? parseFloat(localStorage.getItem(sleepKey)) : 0;
    
    // Combine both data sources (activity data takes priority, but use legacy if no activity data)
    const steps = dailySteps > 0 ? dailySteps : legacySteps;
    const calories = dailyCalories > 0 ? dailyCalories : legacyCalories;
    
    // Calculate XP based on activities
    const xp = steps > 0 || calories > 0 || sleep > 0 ? Math.floor((steps/1000) + (calories/50) + (sleep*10)) : 0;
    
    weekData.push({
      date: formattedDate,
      day: dayName,
      xp: xp,
      calories: calories,
      sleep: sleep,
      steps: steps, // Add steps to the daily data
    });
  }

  // Calculate summary
  const totalXP = weekData.reduce((sum, day) => sum + day.xp, 0);
  const totalCalories = weekData.reduce((sum, day) => sum + day.calories, 0);
  const totalSteps = weekData.reduce((sum, day) => sum + day.steps, 0);
  const avgSleep = weekData.reduce((sum, day) => sum + day.sleep, 0) / weekData.length;

  return {
    summary: {
      totalXP,
      totalCalories,
      totalSteps, // Add total steps to summary
      avgSleepDuration: parseFloat(avgSleep.toFixed(1)),
    },
    dailyData: weekData,
  };
};