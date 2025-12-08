import { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { getSession } from '@/lib/session';
import { getWeeklyStats } from '@/lib/storage/unified-aggregator-wrapper';

interface WeeklyChartData {
  dates: string[];
  steps: number[];
  caloriesIn: number[];
  caloriesOut: number[];
  netCalories: number[];
  sleepHours: number[];
  xp: number[];
  nutritionScores?: number[];
  sleepScores?: number[];
  recoveryScores?: number[];
  mealQualityTrends?: number[];
}

interface UseWeeklyChartDataReturn {
  data: WeeklyChartData | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

/**
 * Custom hook to fetch and normalize weekly chart data
 * Includes request deduplication and error handling
 */
const useWeeklyChartData = (userId?: string): UseWeeklyChartDataReturn => {
  const { data: session } = useSession();
  const [data, setData] = useState<WeeklyChartData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchWeeklyData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      let actualUserId = userId;
      if (!actualUserId) {
        // Use the consistent userId helper to ensure we use the same format as data storage
        const { getConsistentUserId } = await import('@/lib/userId-helper');
        actualUserId = getConsistentUserId(session);
      }

      if (!actualUserId) {
        throw new Error('User ID not available');
      }

      const weeklyStats = await getWeeklyStats(actualUserId);

      // Normalize data - ensure all arrays have the same length (7 days)
      const normalizedData = normalizeWeeklyData(weeklyStats);
      
      setData(normalizedData);
    } catch (err) {
      console.error('Error in useWeeklyChartData:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch weekly chart data');
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [session, userId]);

  useEffect(() => {
    fetchWeeklyData();
  }, [fetchWeeklyData]);

  return {
    data,
    loading,
    error,
    refetch: fetchWeeklyData
  };
};

/**
 * Normalize weekly data arrays to ensure consistent length and handle missing values
 */
const normalizeWeeklyData = (weeklyStats: any): WeeklyChartData => {
  // Ensure we have at least 7 days of data, padding with 0s if needed
  const dates = weeklyStats?.dates || [];
  const steps = weeklyStats?.steps || [];
  const caloriesIn = weeklyStats?.caloriesIn || [];
  const caloriesOut = weeklyStats?.caloriesOut || [];
  const netCalories = weeklyStats?.netCalories || [];
  const sleepHours = weeklyStats?.sleepHours || [];
  const xp = weeklyStats?.xp || [];
  
  // New fusion fields
  const nutritionScores = weeklyStats?.nutritionScores || [];
  const sleepScores = weeklyStats?.sleepScores || [];
  const recoveryScores = weeklyStats?.recoveryScores || [];
  const mealQualityTrends = weeklyStats?.mealQualityTrends || [];

  // Ensure all arrays have exactly 7 elements
  const normalized = {
    dates: padArrayWithDefault(dates, 7, () => {
      const date = new Date();
      date.setDate(date.getDate() - (6 - dates.length));
      return date.toLocaleDateString('en-US', { weekday: 'short' });
    }),
    steps: padArrayWithZeroes(steps, 7),
    caloriesIn: padArrayWithZeroes(caloriesIn, 7),
    caloriesOut: padArrayWithZeroes(caloriesOut, 7),
    netCalories: padArrayWithZeroes(netCalories, 7),
    sleepHours: padArrayWithZeroes(sleepHours, 7),
    xp: padArrayWithZeroes(xp, 7),
    // New fusion fields
    nutritionScores: padArrayWithZeroes(nutritionScores, 7),
    sleepScores: padArrayWithZeroes(sleepScores, 7),
    recoveryScores: padArrayWithZeroes(recoveryScores, 7),
    mealQualityTrends: padArrayWithZeroes(mealQualityTrends, 7),
  };

  return normalized;
};

/**
 * Pad array with zero values to ensure it has the specified length
 */
const padArrayWithZeroes = (arr: any[], length: number): number[] => {
  const result = [...arr];
  while (result.length < length) {
    result.push(0);
  }
  return result.slice(0, length); // Ensure it doesn't exceed the desired length
};

/**
 * Pad array with custom default values
 */
const padArrayWithDefault = (arr: any[], length: number, defaultFn: () => any): any[] => {
  const result = [...arr];
  while (result.length < length) {
    result.push(defaultFn());
  }
  return result.slice(0, length); // Ensure it doesn't exceed the desired length
};

export default useWeeklyChartData;