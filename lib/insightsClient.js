// lib/insightsClient.js - Client-side insights aggregator

import { getSession } from './session';

// Helper function to safely get data from localStorage
function safeGet(key) {
  // Check if we're in the browser
  if (typeof window === "undefined") {
    console.warn(`Attempted to access localStorage in server environment for key: ${key}`);
    return null;
  }
  
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : null;
  } catch (error) {
    console.error(`Error reading ${key} from localStorage:`, error);
    return null;
  }
}

// Helper function to get the start of the week (Sunday)
function getWeekStart(date) {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day; // Sunday of the current week
  return new Date(d.setDate(diff));
}

// Helper function to format date as YYYY-MM-DD
function formatDate(date) {
  return date.toISOString().split('T')[0];
}

// Helper function to get user-specific keys
function getUserKey(baseKey) {
  const session = getSession();
  if (session && session.username) {
    return `${baseKey}_${session.username}`;
  }
  return baseKey;
}

export async function getInsightsClient() {
  // Only run if we're in the browser
  if (typeof window === "undefined") {
    console.warn("getInsightsClient can only be called in the browser");
    return {
      today: {
        date: new Date().toISOString().split('T')[0],
        steps: 0,
        caloriesIn: 0,
        caloriesOut: 0,
        netCalories: 0,
        sleepHours: 0,
        xp: 0
      },
      week: {
        dates: [],
        steps: [],
        caloriesIn: [],
        caloriesOut: [],
        netCalories: [],
        sleepHours: [],
        xp: []
      },
      recentActivities: [],
      recentMeals: [],
      recentSleep: []
    };
  }
  
  const session = getSession();
  if (!session) {
    console.warn('User session not found, returning empty data');
    return {
      today: {
        date: new Date().toISOString().split('T')[0],
        steps: 0,
        caloriesIn: 0,
        caloriesOut: 0,
        netCalories: 0,
        sleepHours: 0,
        xp: 0
      },
      week: {
        dates: [],
        steps: [],
        caloriesIn: [],
        caloriesOut: [],
        netCalories: [],
        sleepHours: [],
        xp: []
      },
      recentActivities: [],
      recentMeals: [],
      recentSleep: []
    };
  }

  const today = new Date();
  const weekStart = getWeekStart(today);
  
  // Get user-specific activity, meal, and sleep data
  const activityKey = getUserKey('activities');
  const mealKey = getUserKey('meals');
  
  // Load data from localStorage
  let activities = safeGet(activityKey) || [];
  let meals = safeGet(mealKey) || [];
  
  // Load sleep data (stored differently, with date-specific keys)
  const sleepKey = getUserKey('sleep');
  let sleepData = [];
  for (let i = 0; i < 7; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    const formattedDate = formatDate(date);
    const dateSleepKey = `${sleepKey}_${formattedDate}`;
    const sleepEntry = safeGet(dateSleepKey);
    if (sleepEntry && sleepEntry.date) { // Ensure sleep entry has date field
      sleepData.push(sleepEntry);
    }
  }
  
  // Get today's date string for filtering
  const todayStr = formatDate(today);
  
  // Calculate today's metrics
  const todayActivities = activities.filter(activity => {
    const timestamp = activity.date || activity.timestamp;
    if (!timestamp) return false; // Skip if no date/timestamp
    
    const activityDate = new Date(timestamp);
    if (isNaN(activityDate.getTime())) return false; // Skip if invalid date
    
    return formatDate(activityDate) === todayStr;
  });
  
  const todayMeals = meals.filter(meal => {
    const timestamp = meal.date || meal.timestamp;
    if (!timestamp) return false; // Skip if no date/timestamp
    
    const mealDate = new Date(timestamp);
    if (isNaN(mealDate.getTime())) return false; // Skip if invalid date
    
    return formatDate(mealDate) === todayStr;
  });
  
  const todaySleep = sleepData.find(sleep => sleep.date === todayStr) || { duration: 0 };
  
  // Calculate today's totals
  // Get direct steps for today
  const todayStepsKey = `steps-${todayStr}`;
  const todayDirectSteps = parseInt(localStorage.getItem(todayStepsKey) || '0');
  
  // Get steps from activities
  const todayActivitySteps = todayActivities
    .filter(activity => activity.type === 'walking' || activity.type === 'running')
    .reduce((sum, activity) => sum + Math.round((activity.duration || 0) * 100), 0); // 100 steps per minute
  
  const todaySteps = todayDirectSteps + todayActivitySteps; // Total steps for today
  
  const todayCaloriesOut = todayActivities.reduce((sum, activity) => 
    sum + (activity.calories || activity.calories_burned || 0), 0);
    
  const todayCaloriesIn = todayMeals.reduce((sum, meal) => 
    sum + (meal.calories || 0), 0);
  
  const todayNetCalories = todayCaloriesIn - todayCaloriesOut;
  
  // Calculate week's metrics
  const weekData = {
    dates: [],
    steps: [],
    caloriesIn: [],
    caloriesOut: [],
    netCalories: [],
    sleepHours: [],
    xp: []
  };
  
  for (let i = 6; i >= 0; i--) {
    const date = new Date(weekStart);
    date.setDate(weekStart.getDate() + (6 - i));
    const dateStr = formatDate(date);
    const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
    
    weekData.dates.push(dayName);
    
    // Get activities for this date
    const dayActivities = activities.filter(activity => {
      const timestamp = activity.date || activity.timestamp;
      if (!timestamp) return false; // Skip if no date/timestamp
      
      const activityDate = new Date(timestamp);
      if (isNaN(activityDate.getTime())) return false; // Skip if invalid date
      
      return formatDate(activityDate) === dateStr;
    });
    
    // Get meals for this date
    const dayMeals = meals.filter(meal => {
      const timestamp = meal.date || meal.timestamp;
      if (!timestamp) return false; // Skip if no date/timestamp
      
      const mealDate = new Date(timestamp);
      if (isNaN(mealDate.getTime())) return false; // Skip if invalid date
      
      return formatDate(mealDate) === dateStr;
    });
    
    // Get sleep for this date
    const daySleep = sleepData.find(sleep => sleep.date === dateStr) || { duration: 0 };
    
    // Calculate metrics for this date
    // For steps: try to get from date-specific key first (for direct step entries)
    const dateStepsKey = `steps-${dateStr}`;
    const dateSteps = parseInt(localStorage.getItem(dateStepsKey) || '0');
    
    // Also include steps from activities
    const activitySteps = dayActivities
      .filter(activity => activity.type === 'walking' || activity.type === 'running')
      .reduce((sum, activity) => sum + Math.round((activity.duration || 0) * 100), 0);
    
    const daySteps = dateSteps + activitySteps; // Total steps for the day
      
    const dayCaloriesOut = dayActivities.reduce((sum, activity) => 
      sum + (activity.calories || activity.calories_burned || 0), 0);
      
    const dayCaloriesIn = dayMeals.reduce((sum, meal) => 
      sum + (meal.calories || 0), 0);
      
    const dayNetCalories = dayCaloriesIn - dayCaloriesOut;
    
    // Calculate XP for this date (based on activities)
    const dayXP = dayActivities.reduce((sum, activity) => 
      sum + (activity.xp || 0), 0);
    
    weekData.steps.push(daySteps);
    weekData.caloriesIn.push(dayCaloriesIn);
    weekData.caloriesOut.push(dayCaloriesOut);
    weekData.netCalories.push(dayNetCalories);
    weekData.sleepHours.push(typeof daySleep.duration === 'number' ? daySleep.duration : parseFloat(daySleep.duration) || 0);
    weekData.xp.push(dayXP);
  }
  
  // Get recent entries
  const recentActivities = [...todayActivities].reverse().slice(0, 5);
  const recentMeals = [...todayMeals].reverse().slice(0, 5);
  
  return {
    today: {
      date: todayStr,
      steps: todaySteps,
      caloriesIn: todayCaloriesIn,
      caloriesOut: todayCaloriesOut,
      netCalories: todayNetCalories,
      sleepHours: typeof todaySleep.duration === 'number' ? todaySleep.duration : parseFloat(todaySleep.duration) || 0,
      xp: todayActivities.reduce((sum, activity) => sum + (activity.xp || 0), 0)
    },
    week: weekData,
    recentActivities,
    recentMeals,
    recentSleep: sleepData.slice(0, 5)
  };
}

// Function to calculate summary statistics for AI prompt
export async function getSummaryStatsClient() {
  const insights = await getInsightsClient();
  
  const weekStepsTotal = insights.week.steps.reduce((sum, val) => sum + val, 0);
  const weekCaloriesInTotal = insights.week.caloriesIn.reduce((sum, val) => sum + val, 0);
  const weekCaloriesOutTotal = insights.week.caloriesOut.reduce((sum, val) => sum + val, 0);
  const weekNetCaloriesTotal = weekCaloriesInTotal - weekCaloriesOutTotal;
  const weekSleepTotal = insights.week.sleepHours.reduce((sum, val) => sum + val, 0);
  const weekXPTotal = insights.week.xp.reduce((sum, val) => sum + val, 0);
  
  return {
    week: {
      stepsTotal: weekStepsTotal,
      caloriesInTotal: weekCaloriesInTotal,
      caloriesOutTotal: weekCaloriesOutTotal,
      netCaloriesTotal: weekNetCaloriesTotal,
      sleepTotal: weekSleepTotal,
      xpTotal: weekXPTotal
    },
    today: insights.today
  };
}