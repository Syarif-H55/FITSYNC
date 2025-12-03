import { WellnessRecord } from '@/data/models/wellness-record';
import { getDailyStats } from '@/lib/storage/unified-aggregator-wrapper';

// Type definitions for daily suggestions
export interface DailySuggestion {
  id: string;
  title: string;
  description: string;
  category: 'sleep' | 'nutrition' | 'activity' | 'recovery' | 'general';
  priority: 'low' | 'medium' | 'high';
  ruleId: string;
  dataContext?: any; // Contextual data used to generate the suggestion
}

// Main function for the daily suggestions engine
export const dailySuggestionsEngine = async (userId: string): Promise<DailySuggestion[]> => {
  try {
    // Get today's stats to base suggestions on
    const dailyStats = await getDailyStats(userId);
    
    const suggestions: DailySuggestion[] = [];
    
    // Rule 1: Low sleep (<6h) → "Take a lighter activity day."
    if (dailyStats?.sleepHours < 6) {
      suggestions.push({
        id: 'low-sleep-' + Date.now(),
        title: 'Prioritize Rest',
        description: 'You had less than 6 hours of sleep. Consider taking a lighter activity day to allow your body to recover.',
        category: 'sleep',
        priority: 'high',
        ruleId: 'low-sleep-rule'
      });
    }

    // Rule 2: High caloriesIn compared to caloriesOut (>400 surplus) → "Try reducing late-night snacks."
    const calorieSurplus = (dailyStats?.caloriesIn || 0) - (dailyStats?.caloriesOut || 0);
    if (calorieSurplus > 400) {
      suggestions.push({
        id: 'high-calorie-surplus-' + Date.now(),
        title: 'Mind Your Intake',
        description: `You had a calorie surplus of ${calorieSurplus} calories. Consider reducing late-night snacks or choosing lighter options in the evening.`,
        category: 'nutrition',
        priority: 'medium',
        ruleId: 'high-calorie-surplus-rule'
      });
    }

    // Rule 3: Steps < 3000 → "Short walk recommended."
    if (dailyStats?.steps < 3000) {
      suggestions.push({
        id: 'low-steps-' + Date.now(),
        title: 'Move More Today',
        description: 'You\'ve taken fewer than 3,000 steps today. A short 15-20 minute walk could help boost your activity levels.',
        category: 'activity',
        priority: 'medium',
        ruleId: 'low-steps-rule'
      });
    }
    
    // Rule 4: Positive streak → "Great consistency! Keep it up."
    // Check if user has recent streaks (this would require additional logic to track streaks)
    // For now, we'll check if they met most of their daily goals
    // Ensure dailyStats is defined before accessing properties
    if (dailyStats) {
      const stepsGoalMet = (dailyStats.steps || 0) >= 8000; // Assuming 10k goal, aiming for 80% (8k steps)
      const sleepGoalMet = (dailyStats.sleepHours || 0) >= 7; // Assuming 8h goal, 7h is good
      const caloriesBalanced = Math.abs((dailyStats.caloriesIn || 0) - (dailyStats.caloriesOut || 0)) < 300; // Within 300 cal difference

      if (stepsGoalMet && sleepGoalMet && caloriesBalanced) {
        suggestions.push({
          id: 'positive-streak-' + Date.now(),
          title: 'Great Consistency!',
          description: 'You\'re maintaining excellent habits across all wellness areas. Keep up the great work!',
          category: 'general',
          priority: 'low',
          ruleId: 'positive-streak-rule'
        });
      }
    }
    
    // Sort suggestions by priority (high first)
    suggestions.sort((a, b) => {
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    });
    
    console.log(`[AI COACH] Generated ${suggestions.length} suggestions for user ${userId}`, suggestions);
    
    return suggestions;
  } catch (error) {
    console.error('[AI COACH] Error generating daily suggestions:', error);
    return [];
  }
};