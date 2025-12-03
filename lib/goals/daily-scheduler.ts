import { AdaptiveGoalsEngine } from '../goals/adaptive-engine';

/**
 * Daily scheduler for goal recalculation
 */
export class DailyGoalScheduler {
  private static isInitialized = false;
  private static lastCalculationTime: Date | null = null;

  /**
   * Initialize the daily scheduler
   */
  static initialize(): void {
    if (this.isInitialized) return;

    console.log('[GOAL SCHEDULER] Initializing daily goal scheduler');

    // Check every minute if it's time to recalculate goals
    setInterval(() => {
      this.checkAndRecalculateGoals();
    }, 60 * 1000); // Check every minute

    // Also run immediately when initialized for debugging
    setTimeout(() => {
      this.checkAndRecalculateGoals();
    }, 5000); // Run after 5 seconds

    this.isInitialized = true;
  }

  /**
   * Check if goals need recalculation and recalculate if needed
   */
  private static async checkAndRecalculateGoals(): Promise<void> {
    const now = new Date();
    
    // Check if we've crossed to a new day (after midnight and not already calculated today)
    const shouldCalculate = !this.lastCalculationTime || 
                           (now.getDate() !== this.lastCalculationTime.getDate()) ||
                           (this.isDebugEnabled());
    
    if (shouldCalculate) {
      console.log(`[GOAL SCHEDULER] Time to recalculate goals. Current time: ${now.toISOString()}`);
      
      await this.recalculateAllUserGoals();
      this.lastCalculationTime = now;
      
      console.log(`[GOAL SCHEDULER] Goal recalculation completed at ${now.toISOString()}`);
    }
  }

  /**
   * Recalculate goals for all active users
   */
  private static async recalculateAllUserGoals(): Promise<void> {
    // In a real implementation, this would get all active users from a database
    // For now, we'll look for users in localStorage that have activity data
    const activeUserIds = this.getActiveUserIds();
    
    console.log(`[GOAL SCHEDULER] Found ${activeUserIds.length} active users for goal recalculation`);
    
    for (const userId of activeUserIds) {
      try {
        console.log(`[GOAL SCHEDULER] Recalculating goals for user: ${userId}`);
        await AdaptiveGoalsEngine.calculateAdaptiveGoals(userId, new Date());
      } catch (error) {
        console.error(`[GOAL SCHEDULER] Failed to recalculate goals for ${userId}:`, error);
      }
    }
  }

  /**
   * Get active user IDs from localStorage
   */
  private static getActiveUserIds(): string[] {
    const userIds: string[] = [];
    
    // Look for storage keys that contain user-specific data
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('fitsync_') && key.includes('_')) {
        // Extract user ID from keys like 'fitsync_activities_username' or 'fitsync_goals_username'
        const parts = key.split('_');
        if (parts.length >= 3) {
          const userId = parts.slice(2).join('_'); // Get everything after 'fitsync' and type
          if (!userIds.includes(userId) && userId !== 'unified') {
            userIds.push(userId);
          }
        }
      }
    }
    
    // Special case: if there's no specific user data, check for default user
    if (userIds.length === 0 && localStorage.getItem('fitsync_xp_default_user')) {
      userIds.push('default_user');
    }
    
    return [...new Set(userIds)]; // Remove duplicates
  }

  /**
   * Manual trigger for goal recalculation (for debugging)
   */
  static async manualRecalculateGoalsForUser(userId: string): Promise<void> {
    console.log(`[GOAL SCHEDULER] Manual recalculation triggered for user: ${userId}`);
    await AdaptiveGoalsEngine.calculateAdaptiveGoals(userId, new Date());
    this.lastCalculationTime = new Date();
  }

  /**
   * Check if debug mode is enabled
   */
  private static isDebugEnabled(): boolean {
    // Check for a debug flag in localStorage
    return localStorage.getItem('fitsync_debug_goals') === 'true';
  }
}