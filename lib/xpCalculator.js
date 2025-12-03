// XP and Level calculation functions
const calculateXPFromActivity = (activityType, details = {}) => {
  switch (activityType) {
    case 'workout':
      // Base XP is 50 + duration in minutes * 10 + intensity bonus
      const baseXP = 50;
      const durationXP = Math.floor(details.duration / 60) * 10; // 10 XP per minute
      const intensityMultiplier = details.intensity === 'Beginner' ? 1 : details.intensity === 'Intermediate' ? 1.5 : 2;
      const intensityXP = Math.round(20 * intensityMultiplier);
      return baseXP + durationXP + intensityXP;
    
    case 'steps':
      // 1 XP per 200 steps (rounded)
      return Math.floor(details.steps / 200);
    
    case 'meal_logged':
      // 10 XP for logging a meal
      return 10;
    
    case 'sleep_logged':
      // Variable XP based on sleep duration (between 5-50 XP)
      const sleepHours = details.duration || 0;
      if (sleepHours >= 7 && sleepHours <= 9) {
        return 30; // Optimal sleep
      } else if (sleepHours >= 5 && sleepHours < 7) {
        return 15; // Adequate sleep
      } else if (sleepHours > 9) {
        return 20; // Too much sleep
      } else {
        return 5; // Poor sleep
      }

    default:
      return 0;
  }
};

// Calculate level based on total XP
const calculateLevelFromXP = (totalXP) => {
  // Simple formula: level = floor(sqrt(totalXP / 100)) + 1
  // This means each level requires increasing amounts of XP
  return Math.floor(Math.sqrt(totalXP / 100)) + 1;
};

// Calculate XP needed for next level
const calculateXPToNextLevel = (totalXP) => {
  const currentLevel = calculateLevelFromXP(totalXP);
  const nextLevelXP = Math.pow(currentLevel, 2) * 100;
  return nextLevelXP - totalXP;
};

// Get progress percentage toward next level
const getLevelProgress = (totalXP) => {
  const currentLevel = calculateLevelFromXP(totalXP);
  const levelStartXP = Math.pow(currentLevel - 1, 2) * 100;
  const levelEndXP = Math.pow(currentLevel, 2) * 100;
  const progress = ((totalXP - levelStartXP) / (levelEndXP - levelStartXP)) * 100;
  return Math.min(100, Math.max(0, progress));
};

export {
  calculateXPFromActivity,
  calculateLevelFromXP,
  calculateXPToNextLevel,
  getLevelProgress
};