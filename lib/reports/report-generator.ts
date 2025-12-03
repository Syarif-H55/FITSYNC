import {
  WeeklyReport,
  WeeklyReportData,
  DailyStat,
  WeeklyTotals,
  ReportScore,
  TrendAnalysis,
  WeekComparison
} from './report-models';
import { ScoringEngine } from './scoring-engine';

export class ReportGenerator {
  /**
   * Generate a complete weekly report for a user
   */
  static async generateWeeklyReport(userId: string, weekDate?: Date): Promise<WeeklyReport> {
    console.log(`[REPORT GENERATOR] Generating weekly report for user: ${userId}, week ending: ${weekDate ? weekDate.toISOString() : 'current week'}`);

    try {
      // Import unified aggregator
      const { getWeeklyStats } = await import('@/lib/storage/unified-aggregator-wrapper');
      
      // Get weekly stats
      const weeklyStats = await getWeeklyStats(userId, weekDate || new Date());
      
      // Format the raw data
      const reportData: WeeklyReportData = {
        weekStart: this.getWeekStart(weekDate || new Date()).toISOString(),
        weekEnd: (weekDate || new Date()).toISOString(),
        dailyStats: this.formatDailyStats(weeklyStats),
        weeklyTotals: this.calculateWeeklyTotals(weeklyStats)
      };

      // Calculate scores for each category
      const activityScore = ScoringEngine.calculateCategoryScore(reportData, 'activity');
      const nutritionScore = ScoringEngine.calculateCategoryScore(reportData, 'nutrition');
      const sleepScore = ScoringEngine.calculateCategoryScore(reportData, 'sleep');
      const recoveryScore = ScoringEngine.calculateCategoryScore(reportData, 'recovery');

      // Calculate overall score
      const overallScore = ScoringEngine.calculateOverallScore({
        activity: activityScore,
        nutrition: nutritionScore,
        sleep: sleepScore,
        recovery: recoveryScore
      });

      // Generate other report components
      const highlights = ScoringEngine.generateHighlights(reportData);
      const recommendations = ScoringEngine.generateRecommendations(reportData.weeklyTotals);
      const trends = ScoringEngine.generateTrendAnalysis(reportData);

      // For comparison, get previous week's data if available
      const prevWeekDate = new Date(weekDate || new Date());
      prevWeekDate.setDate(prevWeekDate.getDate() - 7);

      let prevWeeklyStats = null;
      try {
        const { getWeeklyStats } = await import('@/lib/storage/unified-aggregator-wrapper');
        prevWeeklyStats = await getWeeklyStats(userId, prevWeekDate);
      } catch (e) {
        console.log('[REPORT GENERATOR] No previous week data available for comparison');
      }

      const comparison = ScoringEngine.generateWeekComparison(reportData, prevWeeklyStats ? {
        weekStart: this.getWeekStart(prevWeekDate).toISOString(),
        weekEnd: prevWeekDate.toISOString(),
        dailyStats: this.formatDailyStats(prevWeeklyStats),
        weeklyTotals: this.calculateWeeklyTotals(prevWeeklyStats)
      } : null);

      const report: WeeklyReport = {
        weekStart: reportData.weekStart,
        weekEnd: reportData.weekEnd,
        scores: {
          activity: activityScore,
          nutrition: nutritionScore,
          sleep: sleepScore,
          recovery: recoveryScore,
          overall: overallScore
        },
        highlights,
        recommendations,
        trends,
        comparison,
        generatedAt: new Date()
      };

      console.log(`[REPORT GENERATOR] Generated report with scores:`, {
        activity: activityScore.value,
        nutrition: nutritionScore.value,
        sleep: sleepScore.value,
        recovery: recoveryScore.value,
        overall: overallScore.value
      });

      return report;
    } catch (error) {
      console.error('[REPORT GENERATOR] Error generating weekly report:', error);
      // Return a default report structure in case of error
      return {
        weekStart: new Date().toISOString(),
        weekEnd: new Date().toISOString(),
        scores: {
          activity: { value: 0, category: 'activity', breakdown: [], trend: 'stable' },
          nutrition: { value: 0, category: 'nutrition', breakdown: [], trend: 'stable' },
          sleep: { value: 0, category: 'sleep', breakdown: [], trend: 'stable' },
          recovery: { value: 0, category: 'recovery', breakdown: [], trend: 'stable' },
          overall: { value: 0, category: 'overall', breakdown: [], trend: 'stable' }
        },
        highlights: [],
        recommendations: [],
        trends: [],
        comparison: {
          prevWeek: {
            totalSteps: 0, totalCaloriesIn: 0, totalCaloriesOut: 0, totalSleepHours: 0, totalXP: 0,
            avgSteps: 0, avgCaloriesIn: 0, avgCaloriesOut: 0, avgSleepHours: 0, avgXP: 0,
            daysWithActivity: 0, daysWithMeals: 0
          },
          currentWeek: {
            totalSteps: 0, totalCaloriesIn: 0, totalCaloriesOut: 0, totalSleepHours: 0, totalXP: 0,
            avgSteps: 0, avgCaloriesIn: 0, avgCaloriesOut: 0, avgSleepHours: 0, avgXP: 0,
            daysWithActivity: 0, daysWithMeals: 0
          },
          differences: {
            steps: 0, caloriesIn: 0, caloriesOut: 0, sleep: 0, xp: 0
          }
        },
        generatedAt: new Date()
      };
    }
  }

  /**
   * Format raw weekly stats into the required structure
   */
  private static formatDailyStats(rawStats: any): DailyStat[] {
    const dailyStats: DailyStat[] = [];
    
    if (rawStats?.dates) {
      for (let i = 0; i < rawStats.dates.length; i++) {
        dailyStats.push({
          date: rawStats.dates[i],
          steps: rawStats.steps?.[i] || 0,
          caloriesIn: rawStats.caloriesIn?.[i] || 0,
          caloriesOut: rawStats.caloriesOut?.[i] || 0,
          netCalories: (rawStats.caloriesIn?.[i] || 0) - (rawStats.caloriesOut?.[i] || 0),
          sleepHours: rawStats.sleepHours?.[i] || 0,
          xp: rawStats.xp?.[i] || 0,
          mealsLogged: rawStats.meals?.[i] || 0
        });
      }
    }
    
    return dailyStats;
  }

  /**
   * Calculate weekly totals from daily stats
   */
  private static calculateWeeklyTotals(rawStats: any): WeeklyTotals {
    if (!rawStats?.steps || !Array.isArray(rawStats.steps)) {
      return {
        totalSteps: 0,
        totalCaloriesIn: 0,
        totalCaloriesOut: 0,
        totalSleepHours: 0,
        totalXP: 0,
        avgSteps: 0,
        avgCaloriesIn: 0,
        avgCaloriesOut: 0,
        avgSleepHours: 0,
        avgXP: 0,
        daysWithActivity: 0,
        daysWithMeals: 0
      };
    }

    const steps = rawStats.steps || [];
    const caloriesIn = rawStats.caloriesIn || [];
    const caloriesOut = rawStats.caloriesOut || [];
    const sleepHours = rawStats.sleepHours || [];
    const xpValues = rawStats.xp || [];
    const meals = rawStats.meals || [];

    // Calculate totals
    const totalSteps = steps.reduce((sum, value) => sum + (value || 0), 0);
    const totalCaloriesIn = caloriesIn.reduce((sum, value) => sum + (value || 0), 0);
    const totalCaloriesOut = caloriesOut.reduce((sum, value) => sum + (value || 0), 0);
    const totalSleepHours = sleepHours.reduce((sum, value) => sum + (value || 0), 0);
    const totalXP = xpValues.reduce((sum, value) => sum + (value || 0), 0);

    // Calculate averages
    const avgSteps = steps.length > 0 ? totalSteps / steps.length : 0;
    const avgCaloriesIn = caloriesIn.length > 0 ? totalCaloriesIn / caloriesIn.length : 0;
    const avgCaloriesOut = caloriesOut.length > 0 ? totalCaloriesOut / caloriesOut.length : 0;
    const avgSleepHours = sleepHours.length > 0 ? totalSleepHours / sleepHours.length : 0;
    const avgXP = xpValues.length > 0 ? totalXP / xpValues.length : 0;

    // Count days with activity (steps > 1000) and meals logged
    const daysWithActivity = steps.filter(steps => steps > 1000).length;
    const daysWithMeals = meals.filter(meals => meals > 0).length;

    return {
      totalSteps,
      totalCaloriesIn,
      totalCaloriesOut,
      totalSleepHours,
      totalXP,
      avgSteps,
      avgCaloriesIn,
      avgCaloriesOut,
      avgSleepHours,
      avgXP,
      daysWithActivity,
      daysWithMeals
    };
  }

  /**
   * Get the start of the week (Sunday) for the given date
   */
  private static getWeekStart(date: Date): Date {
    const start = new Date(date);
    const day = start.getDay(); // Sunday = 0, Monday = 1, ..., Saturday = 6
    const diff = start.getDate() - day + (day === 0 ? -6 : 1); // Adjust to get to the previous Monday
    return new Date(start.setDate(diff));
  }
}