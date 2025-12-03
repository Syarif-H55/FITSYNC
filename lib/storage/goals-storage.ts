import { DailyGoals, BehaviorPatterns } from '../types/adaptive-goals';

/**
 * Storage management for adaptive goals
 */
export class GoalsStorage {
  private static readonly GOALS_STORAGE_KEY = (userId: string) =>
    `fitsync_goals_${userId}`;

  /**
   * Store daily goals for a user
   */
  static async storeDailyGoals(
    userId: string,
    date: Date,
    goals: DailyGoals,
    patterns: BehaviorPatterns
  ): Promise<void> {
    const dateKey = date.toISOString().split('T')[0];
    
    // Get existing goals for the user
    const existingGoals = this.getUserGoals(userId);
    
    // Update with new goals for the date
    const updatedGoals = {
      ...existingGoals,
      [dateKey]: {
        goals,
        patterns,
        calculatedAt: new Date().toISOString(),
        version: '1.0'
      }
    };

    // Store in localStorage using unified pattern
    localStorage.setItem(
      this.GOALS_STORAGE_KEY(userId),
      JSON.stringify(updatedGoals)
    );
    
    console.log(`[GOALS STORAGE] Stored goals for user: ${userId}, date: ${dateKey}`);
  }

  /**
   * Get goals for a specific date
   */
  static async getGoalsForDate(userId: string, date: Date): Promise<DailyGoals | null> {
    const dateKey = date.toISOString().split('T')[0];
    const allGoals = this.getUserGoals(userId);
    
    if (allGoals && allGoals[dateKey]) {
      console.log(`[GOALS STORAGE] Retrieved goals for user: ${userId}, date: ${dateKey}`);
      return allGoals[dateKey].goals;
    }
    
    // If no goals exist for this date, return null
    // The calling function should calculate new goals
    console.log(`[GOALS STORAGE] No goals found for user: ${userId}, date: ${dateKey}`);
    return null;
  }

  /**
   * Get today's goals for a user
   */
  static async getTodaysGoals(userId: string): Promise<DailyGoals | null> {
    return await this.getGoalsForDate(userId, new Date());
  }

  /**
   * Get user's goals from storage
   */
  private static getUserGoals(userId: string): any {
    const stored = localStorage.getItem(this.GOALS_STORAGE_KEY(userId));
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (error) {
        console.error('[GOALS STORAGE] Error parsing goals:', error);
        return {};
      }
    }
    return {};
  }

  /**
   * Get recent goal history for analysis
   */
  static async getRecentGoalHistory(userId: string, days: number = 7): Promise<DailyGoals[]> {
    const history: DailyGoals[] = [];
    const allGoals = this.getUserGoals(userId);
    
    // Get the last 'days' worth of goals
    const dates = Object.keys(allGoals).sort().slice(-days);
    
    for (const date of dates) {
      if (allGoals[date] && allGoals[date].goals) {
        history.push(allGoals[date].goals);
      }
    }
    
    console.log(`[GOALS STORAGE] Retrieved ${history.length} days of goal history`);
    return history;
  }
}