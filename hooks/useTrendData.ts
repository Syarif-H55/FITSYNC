import { useState, useEffect } from 'react';
import { getWeeklyStats } from '@/lib/storage/unified-aggregator-wrapper';

interface TrendDatum {
  date: string;
  value: number;
}

interface TrendData {
  steps: TrendDatum[];
  caloriesIn: TrendDatum[];
  caloriesOut: TrendDatum[];
  sleepHours: TrendDatum[];
}

export const useTrendData = ({ userId }: { userId?: string }) => {
  const [trendData, setTrendData] = useState<TrendData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadTrendData();
  }, [userId]);

  const loadTrendData = async () => {
    try {
      setLoading(true);
      setError(null);

      if (!userId) {
        // Set to empty data when no userId is provided
        setTrendData({
          steps: [],
          caloriesIn: [],
          caloriesOut: [],
          sleepHours: []
        });
        return;
      }

      // Get weekly stats from unified aggregator
      const { getWeeklyStats } = await import('@/lib/storage/unified-aggregator-wrapper');
      const weeklyStats = await getWeeklyStats(userId);

      // Format the data for trend visualization
      const formattedData: TrendData = {
        steps: [],
        caloriesIn: [],
        caloriesOut: [],
        sleepHours: []
      };

      if (Array.isArray(weeklyStats?.dates)) {
        // Format steps data
        if (Array.isArray(weeklyStats.steps)) {
          formattedData.steps = weeklyStats.dates.map((date, index) => ({
            date,
            value: weeklyStats.steps?.[index] || 0
          }));
        }

        // Format calories in data
        if (Array.isArray(weeklyStats.caloriesIn)) {
          formattedData.caloriesIn = weeklyStats.dates.map((date, index) => ({
            date,
            value: weeklyStats.caloriesIn?.[index] || 0
          }));
        }

        // Format calories out data
        if (Array.isArray(weeklyStats.caloriesOut)) {
          formattedData.caloriesOut = weeklyStats.dates.map((date, index) => ({
            date,
            value: weeklyStats.caloriesOut?.[index] || 0
          }));
        }

        // Format sleep hours data
        if (Array.isArray(weeklyStats.sleepHours)) {
          formattedData.sleepHours = weeklyStats.dates.map((date, index) => ({
            date,
            value: weeklyStats.sleepHours?.[index] || 0
          }));
        }
      }

      setTrendData(formattedData);
    } catch (err) {
      console.error('[HOOK - useTrendData] Error loading trend data:', err);
      setError(err instanceof Error ? err.message : 'Failed to load trend data');
      setTrendData(null);
    } finally {
      setLoading(false);
    }
  };

  const reload = () => {
    loadTrendData();
  };

  return {
    trendData,
    loading,
    error,
    reload
  };
};