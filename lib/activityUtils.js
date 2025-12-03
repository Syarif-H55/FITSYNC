// Activity Calculator class from Phase 15
export class ActivityCalculator {
  static calculateXP(duration, intensity) {
    const intensityFactors = {
      low: 1,
      moderate: 2,
      high: 3
    };
    
    const baseXP = Math.floor(duration / 5); // 1 XP per 5 minutes
    const intensityMultiplier = intensityFactors[intensity] || 1;
    
    return baseXP * intensityMultiplier;
  }

  static calculateCalories(duration, intensity, activityType) {
    const calorieFactors = {
      walking: 4,
      running: 10,
      cycling: 8,
      workout: 7,
      yoga: 3,
      swimming: 9
    };
    
    const baseRate = calorieFactors[activityType] || 5;
    return duration * baseRate;
  }

  static calculateActivityScore(activity) {
    // Used for AI insights and recommendations
    const durationScore = Math.min(activity.duration / 60, 2); // Max 2 points
    const intensityScore = { low: 1, moderate: 2, high: 3 }[activity.intensity];
    
    return durationScore + intensityScore;
  }
}

export const intensityMultiplier = {
  low: 1,
  moderate: 1.5,
  high: 2
};

export const activityTypeMultiplier = {
  walking: 3,
  running: 5,
  cycling: 4,
  workout: 6
};

export const getActivityIcon = (type) => {
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

export const getActivityColor = (type) => {
  const colors = {
    walking: '#00C48C',
    running: '#FF6B6B',
    cycling: '#4FB3FF',
    workout: '#FFA726',
    yoga: '#9C27B0',
    swimming: '#2196F3'
  };
  return colors[type] || '#9C27B0';
};

export function calculateCalories(activityType, duration) {
  if (typeof duration !== 'number' || duration <= 0) {
    return 0;
  }
  return Math.round(duration * (activityTypeMultiplier[activityType] || 3));
}

export function calculateXP(intensity, duration) {
  if (typeof duration !== 'number' || duration <= 0) {
    return 0;
  }
  return Math.round(duration * (intensityMultiplier[intensity] || 1));
}

// Function to generate AI feedback based on activity
export function generateActivityFeedback(activity) {
  const { type, duration, intensity, calories } = activity;
  const baseFeedback = {
    walking: `Great walk! You burned ${calories} calories and earned ${activity.xp} XP.`,
    running: `Excellent run! You burned ${calories} calories and earned ${activity.xp} XP.`,
    cycling: `Nice cycling session! You burned ${calories} calories and earned ${activity.xp} XP.`,
    workout: `Great workout! You burned ${calories} calories and earned ${activity.xp} XP.`,
    yoga: `Wonderful yoga session! You burned ${calories} calories and earned ${activity.xp} XP.`,
    swimming: `Great swim! You burned ${calories} calories and earned ${activity.xp} XP.`
  };

  // Add intensity-based feedback
  let intensityFeedback = '';
  if (intensity === 'high') {
    intensityFeedback = ' Your high intensity effort is impressive!';
  } else if (intensity === 'low') {
    intensityFeedback = ' Perfect for an easy session.';
  }

  // Add duration-based feedback
  let durationFeedback = '';
  if (duration >= 60) {
    durationFeedback = ' That\'s a great long session!';
  } else if (duration >= 30) {
    durationFeedback = ' Consistent effort pays off!';
  }

  return (baseFeedback[type] || `Great ${type} session!`) + intensityFeedback + durationFeedback;
}