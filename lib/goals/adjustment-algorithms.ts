import { GoalDelta, BehaviorPatterns } from '../types/adaptive-goals';

/**
 * Goal adjustment algorithms based on behavior patterns
 */
export class GoalAdjustmentAlgorithms {
  /**
   * Adjust steps goal based on patterns and historical performance
   */
  static adjustStepsGoal(
    currentGoal: number,
    patterns: BehaviorPatterns,
    historicalAvg: number
  ): GoalDelta {
    let newTarget = currentGoal;
    let reason = 'maintenance';

    // Under-goal streak adjustment (reduce if consistently underachieving)
    if (patterns.underGoalStreak >= 4) {
      newTarget = Math.max(3000, Math.floor(currentGoal * 0.85)); // Reduce by 15%, minimum 3000
      reason = 'reducing_due_consistent_under_achievement';
    }
    // Over-goal streak adjustment (increase if consistently overachieving)
    else if (patterns.overGoalStreak >= 5) {
      newTarget = Math.min(20000, Math.floor(currentGoal * 1.15)); // Increase by 15%, maximum 20000
      reason = 'increasing_due_consistent_over_achievement';
    }
    // Fatigue detection (reduce if signs of burnout)
    else if (patterns.fatigueSigns && patterns.consistencyScore < 60) {
      newTarget = Math.floor(currentGoal * 0.9); // Reduce by 10%
      reason = 'reducing_due_fatigue_signs';
    }
    // Motivation-based adjustment
    else if (patterns.motivationLevel === 'low' && historicalAvg < currentGoal * 0.7) {
      newTarget = Math.floor(currentGoal * 0.95); // Slight reduction
      reason = 'motivation_based_adjustment';
    }
    else if (patterns.motivationLevel === 'high' && historicalAvg > currentGoal * 1.2) {
      newTarget = Math.floor(currentGoal * 1.05); // Slight increase
      reason = 'motivation_based_adjustment';
    }

    return {
      previousTarget: currentGoal,
      newTarget,
      changeAmount: newTarget - currentGoal,
      changePercentage: ((newTarget - currentGoal) / currentGoal) * 100,
      direction: newTarget > currentGoal ? 'increase' :
                newTarget < currentGoal ? 'decrease' : 'maintain',
      reason
    };
  }

  /**
   * Adjust calories burned goal based on patterns and historical performance
   */
  static adjustCaloriesBurnedGoal(
    currentGoal: number,
    patterns: BehaviorPatterns,
    historicalAvg: number
  ): GoalDelta {
    let newTarget = currentGoal;
    let reason = 'maintenance';

    // If consistently underachieving (less than 70% of goal)
    if (historicalAvg < currentGoal * 0.7) {
      newTarget = Math.max(150, Math.floor(currentGoal * 0.85)); // Reduce by 15%, minimum 150
      reason = 'reducing_due_consistent_under_achievement';
    }
    // If consistently overachieving (more than 130% of goal)
    else if (historicalAvg > currentGoal * 1.3) {
      newTarget = Math.min(800, Math.floor(currentGoal * 1.15)); // Increase by 15%, maximum 800
      reason = 'increasing_due_consistent_over_achievement';
    }
    // Fatigue detection
    else if (patterns.fatigueSigns && patterns.consistencyScore < 60) {
      newTarget = Math.floor(currentGoal * 0.95); // Small reduction
      reason = 'reducing_due_fatigue_signs';
    }

    return {
      previousTarget: currentGoal,
      newTarget,
      changeAmount: newTarget - currentGoal,
      changePercentage: ((newTarget - currentGoal) / currentGoal) * 100,
      direction: newTarget > currentGoal ? 'increase' :
                newTarget < currentGoal ? 'decrease' : 'maintain',
      reason
    };
  }

  /**
   * Adjust sleep hours goal based on patterns and historical performance
   */
  static adjustSleepHoursGoal(
    currentGoal: number,
    patterns: BehaviorPatterns,
    historicalAvg: number
  ): GoalDelta {
    let newTarget = currentGoal;
    let reason = 'maintenance';

    // Sleep adjustments are more conservative since they're critical for health
    // If consistently sleeping too little (less than 6 hours on avg)
    if (historicalAvg < 6.0) {
      newTarget = Math.min(9, currentGoal + 0.5); // Increase by 0.5 hours, max 9
      reason = 'increasing_due_consistent_under_achievement';
    }
    // If consistently sleeping too much (more than 9.5 hours on avg)
    else if (historicalAvg > 9.0) {
      newTarget = Math.max(6, currentGoal - 0.5); // Decrease by 0.5 hours, min 6
      reason = 'decreasing_due_consistent_over_achievement';
    }
    // If user has low consistency with sleep goals
    else if (patterns.consistencyScore < 50) {
      // Adjust towards a healthy range (7-8 hours) gradually
      if (currentGoal < 7) {
        newTarget = Math.min(7.5, currentGoal + 0.25);
        reason = 'improving_consistency_towards_optimal';
      } else if (currentGoal > 8) {
        newTarget = Math.max(7.5, currentGoal - 0.25);
        reason = 'improving_consistency_towards_optimal';
      }
    }

    return {
      previousTarget: currentGoal,
      newTarget,
      changeAmount: newTarget - currentGoal,
      changePercentage: ((newTarget - currentGoal) / currentGoal) * 100,
      direction: newTarget > currentGoal ? 'increase' :
                newTarget < currentGoal ? 'decrease' : 'maintain',
      reason
    };
  }

  /**
   * Calculate base goals from user profile
   */
  static calculateBaseGoals(userId: string): BaseGoals {
    // In a real implementation, this would pull from user profile
    // For now, using default values based on common recommendations
    return {
      steps: 8000,
      caloriesBurned: 300,
      sleepHours: 7.5
    };
  }
}

interface BaseGoals {
  steps: number;
  caloriesBurned: number;
  sleepHours: number;
}