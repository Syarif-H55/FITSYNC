// /lib/storage/unified-aggregator-wrapper.ts
// Wrapper module to provide consistent exports for unified-aggregator

import UnifiedAggregator from './unified-aggregator';

// Named exports for consistency - these are static methods of the UnifiedAggregator class
// Use wrapper functions to preserve the 'this' context
export const getWeeklyStats = (userId: string, date?: Date) => UnifiedAggregator.getWeeklyStats(userId, date);
export const getDailyStats = (userId: string, date?: Date) => UnifiedAggregator.getDailyStats(userId, date);
export const getMonthlyStats = (userId: string, date?: Date) => UnifiedAggregator.getMonthlyStats(userId, date);
export const getInsightsData = (userId: string) => UnifiedAggregator.getInsightsData(userId);
export const getSummaryStats = (userId: string) => UnifiedAggregator.getSummaryStats(userId);
export const getAdaptiveGoals = (userId: string, date?: Date) => UnifiedAggregator.getAdaptiveGoals(userId, date);

// Default export
export default UnifiedAggregator;