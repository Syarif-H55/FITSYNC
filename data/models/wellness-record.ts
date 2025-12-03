/**
 * Unified data models for FitSync wellness tracking
 */

/**
 * Core unified record - single source of truth for all wellness metrics
 */
export interface WellnessRecord {
  id: string;
  userId: string;
  timestamp: Date;
  type: 'activity' | 'meal' | 'sleep' | 'steps' | 'hydration' | 'workout';
  category: string; // e.g., 'running', 'breakfast', 'deep_sleep'

  // Unified metrics
  metrics: {
    duration?: number;        // minutes
    calories?: number;        // kcal
    xpEarned: number;        // XP from activity
    intensity?: number;       // 1-10 scale
    quantity?: number;        // steps, ml, etc.
    quality?: number;         // 0-1 scale for sleep/meal quality

    // Nutrition (for meals)
    nutrition?: {
      protein: number;
      carbs: number;
      fat: number;
    };

    // Sleep specifics
    sleep?: {
      light: number;
      deep: number;
      rem: number;
      interruptions: number;
    };
  };

  // AI-generated metadata
  metadata: {
    confidence: number;
    aiInsights: string[];
    tags: string[];
    correlationId?: string; // Links related records
  };
}

/**
 * Time-based aggregates for daily/weekly/monthly views
 */
export interface TimeAggregate {
  period: 'daily' | 'weekly' | 'monthly';
  startDate: Date;
  endDate: Date;

  totals: {
    xp: number;
    caloriesBurned: number;
    caloriesConsumed: number;
    activityMinutes: number;
    sleepHours: number;
    steps: number;
  };

  averages: {
    sleepQuality: number;
    activityIntensity: number;
    nutritionBalance: number;
  };

  trends: {
    xpTrend: number;         // Slope of XP over period
    calorieBalanceTrend: number;
    consistencyScore: number; // 0-100
  };

  records: WellnessRecord[];
}