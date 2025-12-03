// Report models

export interface ReportScore {
  value: number; // 0-100
  category: string;
  breakdown: ScoreBreakdown[];
  trend: 'improving' | 'declining' | 'stable';
}

export interface ScoreBreakdown {
  factor: string;
  score: number; // 0-100
  weight: number; // 0-1
  details: string;
}

export interface WeeklyReportData {
  weekStart: string;
  weekEnd: string;
  dailyStats: DailyStat[];
  weeklyTotals: WeeklyTotals;
}

export interface DailyStat {
  date: string;
  steps: number;
  caloriesIn: number;
  caloriesOut: number;
  netCalories: number;
  sleepHours: number;
  xp: number;
  mealsLogged: number;
}

export interface WeeklyTotals {
  totalSteps: number;
  totalCaloriesIn: number;
  totalCaloriesOut: number;
  totalSleepHours: number;
  totalXP: number;
  avgSteps: number;
  avgCaloriesIn: number;
  avgCaloriesOut: number;
  avgSleepHours: number;
  avgXP: number;
  daysWithActivity: number; // Days with steps > 1000
  daysWithMeals: number;    // Days with > 0 meals logged
}

export interface WeeklyReport {
  weekStart: string;
  weekEnd: string;
  scores: {
    activity: ReportScore;
    nutrition: ReportScore;
    sleep: ReportScore;
    recovery: ReportScore;
    overall: ReportScore;
  };
  highlights: ReportHighlight[];
  recommendations: Recommendation[];
  trends: TrendAnalysis[];
  comparison: WeekComparison;
  generatedAt: Date;
}

export interface ReportHighlight {
  category: 'activity' | 'nutrition' | 'sleep' | 'recovery' | 'overall';
  type: 'win' | 'achievement' | 'improvement' | 'struggle';
  description: string;
  value?: number | string;
}

export interface Recommendation {
  category: 'activity' | 'nutrition' | 'sleep' | 'recovery';
  priority: 'high' | 'medium' | 'low';
  description: string;
  target: string;
}

export interface TrendAnalysis {
  metric: 'steps' | 'caloriesIn' | 'caloriesOut' | 'sleep' | 'xp';
  data: { date: string; value: number }[];
  direction: 'improving' | 'declining' | 'stable';
  change: number; // Percentage change
  description: string;
}

export interface WeekComparison {
  prevWeek: WeeklyTotals;
  currentWeek: WeeklyTotals;
  differences: {
    steps: number; // percentage change
    caloriesIn: number;
    caloriesOut: number;
    sleep: number;
    xp: number;
  };
}

// Scoring rules and thresholds
export const SCORING_RULES = {
  activity: {
    factors: [
      { name: 'consistency', weight: 0.3, description: 'Days with activity logged' },
      { name: 'intensity', weight: 0.3, description: 'Average steps per active day' },
      { name: 'variety', weight: 0.2, description: 'Different types of activities' },
      { name: 'goal_achievement', weight: 0.2, description: 'Achievement of daily goals' }
    ],
    thresholds: {
      excellent: 85,
      good: 70,
      fair: 50,
      poor: 0
    }
  },
  nutrition: {
    factors: [
      { name: 'consistency', weight: 0.25, description: 'Days with meals logged' },
      { name: 'balance', weight: 0.25, description: 'Calorie balance (in/out)' },
      { name: 'quality', weight: 0.25, description: 'Nutrition quality metrics' },
      { name: 'regularity', weight: 0.25, description: 'Meal timing regularity' }
    ],
    thresholds: {
      excellent: 85,
      good: 70,
      fair: 50,
      poor: 0
    }
  },
  sleep: {
    factors: [
      { name: 'duration', weight: 0.4, description: 'Average hours slept per night' },
      { name: 'consistency', weight: 0.3, description: 'Consistent bedtime/wake time' },
      { name: 'quality', weight: 0.3, description: 'Subjective sleep quality scores' }
    ],
    thresholds: {
      excellent: 85,
      good: 70,
      fair: 50,
      poor: 0
    }
  },
  recovery: {
    factors: [
      { name: 'rest_balance', weight: 0.4, description: 'Activity vs rest balance' },
      { name: 'recovery_indicators', weight: 0.3, description: 'Recovery metrics' },
      { name: 'stress_management', weight: 0.3, description: 'Stress tracking and management' }
    ],
    thresholds: {
      excellent: 85,
      good: 70,
      fair: 50,
      poor: 0
    }
  }
};

export interface RecommendationRule {
  condition: (stats: WeeklyTotals) => boolean;
  description: string;
  target: string;
  priority?: 'high' | 'medium' | 'low';
}

export const RECOMMENDATION_RULES: Record<string, RecommendationRule[]> = {
  activity: [
    {
      condition: (stats: WeeklyTotals) => stats.daysWithActivity / 7 < 0.7,
      description: 'Try to be active for at least 5 days per week',
      target: 'Increase activity frequency',
      priority: 'medium'
    },
    {
      condition: (stats: WeeklyTotals) => stats.avgSteps < 8000,
      description: 'Aim for 10,000 steps daily to reach recommended activity levels',
      target: 'Increase daily steps',
      priority: 'medium'
    }
  ],
  nutrition: [
    {
      condition: (stats: WeeklyTotals) => Math.abs(stats.avgCaloriesIn - stats.avgCaloriesOut) > 500,
      description: 'Reduce large calorie imbalances by adjusting meal portions',
      target: 'Balance calorie intake',
      priority: 'medium'
    },
    {
      condition: (stats: WeeklyTotals) => stats.daysWithMeals / 7 < 0.8,
      description: 'Try logging more meals to improve nutrition awareness',
      target: 'Increase meal logging',
      priority: 'medium'
    }
  ],
  sleep: [
    {
      condition: (stats: WeeklyTotals) => stats.avgSleepHours < 7,
      description: 'Aim for 7-9 hours of sleep nightly for optimal recovery',
      target: 'Increase sleep duration',
      priority: 'high'
    },
    {
      condition: (stats: WeeklyTotals) => stats.avgSleepHours > 9,
      description: 'Ensure you\'re not oversleeping which might affect energy levels',
      target: 'Optimize sleep duration',
      priority: 'medium'
    }
  ],
  recovery: [
    {
      condition: (stats: WeeklyTotals) => stats.avgXP < 100,
      description: 'Consider adding more recovery-focused activities like stretching or meditation',
      target: 'Improve recovery practices',
      priority: 'medium'
    }
  ]
};