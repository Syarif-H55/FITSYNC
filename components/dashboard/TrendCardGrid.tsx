'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { getSession } from '@/lib/session';
import TrendCard from './TrendCard';

interface TrendDataPoint {
  date: string;
  value: number;
}

interface TrendCardGridProps {
  userId?: string;
}

interface TrendMetric {
  title: string;
  value: string | number;
  unit?: string;
  data: TrendDataPoint[];
  trendDirection: 'up' | 'down' | 'stable';
  changePercentage: number;
  metricType: 'steps' | 'caloriesIn' | 'caloriesOut' | 'sleep' | 'xp';
}

const TrendCardGrid = ({ userId }: TrendCardGridProps) => {
  const { data: session } = useSession();
  const [trendMetrics, setTrendMetrics] = useState<TrendMetric[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetchTrendData();
  }, [userId, session]);

  const fetchTrendData = async () => {
    try {
      setLoading(true);

      let actualUserId = userId;
      if (!actualUserId) {
        if (session && session.user) {
          actualUserId = session.user.email || session.user.name || 'default_user';
        } else {
          const fallbackSession = getSession();
          actualUserId = fallbackSession?.username || 'default_user';
        }
      }

      // Use default user if still no userId
      if (!actualUserId) {
        actualUserId = 'default_user';
      }

      // Get weekly data from unified aggregator
      const { getWeeklyStats } = await import('@/lib/storage/unified-aggregator-wrapper');
      const weeklyStats = await getWeeklyStats(actualUserId);

      if (!weeklyStats || !Array.isArray(weeklyStats.dates)) {
        // Set empty metrics if no data
        setTrendMetrics([]);
        return;
      }

      // Prepare trend metrics
      const metrics: TrendMetric[] = [];

      // Steps trend
      if (weeklyStats.steps) {
        const stepsData = weeklyStats.dates.map((date, index) => ({
          date: date.substring(0, 2), // Short date like 'Mo', 'Tu', etc.
          value: weeklyStats.steps?.[index] || 0
        }));

        // Calculate trend direction and percentage
        const firstValue = stepsData[0]?.value || 0;
        const lastValue = stepsData[stepsData.length - 1]?.value || 0;
        const changePercentage = firstValue !== 0 ? ((lastValue - firstValue) / firstValue) * 100 : 0;
        let trendDirection: 'up' | 'down' | 'stable' = 'stable';
        if (changePercentage > 5) trendDirection = 'up';
        else if (changePercentage < -5) trendDirection = 'down';

        metrics.push({
          title: 'Steps',
          value: lastValue.toLocaleString(),
          unit: '',
          data: stepsData,
          trendDirection,
          changePercentage: Math.abs(changePercentage),
          metricType: 'steps'
        });
      }

      // Calories In trend
      if (weeklyStats.caloriesIn) {
        const caloriesInData = weeklyStats.dates.map((date, index) => ({
          date: date.substring(0, 2),
          value: weeklyStats.caloriesIn?.[index] || 0
        }));

        const firstValue = caloriesInData[0]?.value || 0;
        const lastValue = caloriesInData[caloriesInData.length - 1]?.value || 0;
        const changePercentage = firstValue !== 0 ? ((lastValue - firstValue) / firstValue) * 100 : 0;
        let trendDirection: 'up' | 'down' | 'stable' = 'stable';
        if (changePercentage > 5) trendDirection = 'up';
        else if (changePercentage < -5) trendDirection = 'down';

        metrics.push({
          title: 'Calories In',
          value: lastValue,
          unit: 'kcal',
          data: caloriesInData,
          trendDirection,
          changePercentage: Math.abs(changePercentage),
          metricType: 'caloriesIn'
        });
      }

      // Calories Out trend
      if (weeklyStats.caloriesOut) {
        const caloriesOutData = weeklyStats.dates.map((date, index) => ({
          date: date.substring(0, 2),
          value: weeklyStats.caloriesOut?.[index] || 0
        }));

        const firstValue = caloriesOutData[0]?.value || 0;
        const lastValue = caloriesOutData[caloriesOutData.length - 1]?.value || 0;
        const changePercentage = firstValue !== 0 ? ((lastValue - firstValue) / firstValue) * 100 : 0;
        let trendDirection: 'up' | 'down' | 'stable' = 'stable';
        if (changePercentage > 5) trendDirection = 'up';
        else if (changePercentage < -5) trendDirection = 'down';

        metrics.push({
          title: 'Calories Out',
          value: lastValue,
          unit: 'kcal',
          data: caloriesOutData,
          trendDirection,
          changePercentage: Math.abs(changePercentage),
          metricType: 'caloriesOut'
        });
      }

      // Sleep trend
      if (weeklyStats.sleepHours) {
        const sleepData = weeklyStats.dates.map((date, index) => ({
          date: date.substring(0, 2),
          value: weeklyStats.sleepHours?.[index] || 0
        }));

        const firstValue = sleepData[0]?.value || 0;
        const lastValue = sleepData[sleepData.length - 1]?.value || 0;
        const changePercentage = firstValue !== 0 ? ((lastValue - firstValue) / firstValue) * 100 : 0;
        let trendDirection: 'up' | 'down' | 'stable' = 'stable';
        if (changePercentage > 5) trendDirection = 'up';
        else if (changePercentage < -5) trendDirection = 'down';

        metrics.push({
          title: 'Sleep',
          value: lastValue.toFixed(1),
          unit: 'hrs',
          data: sleepData,
          trendDirection,
          changePercentage: Math.abs(changePercentage),
          metricType: 'sleep'
        });
      }

      setTrendMetrics(metrics);
    } catch (error) {
      console.error('Error fetching trend data:', error);
      setTrendMetrics([]); // Set empty array on error
    } finally {
      setLoading(false);
    }
  };

  if (loading || trendMetrics.length === 0) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div 
            key={i} 
            className="bg-[#22252D] border-[#30363D] rounded-2xl shadow-md transition-all duration-200 p-6"
          >
            <div className="text-center py-8 text-[#8B949E]">Loading trend {i + 1}...</div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {trendMetrics.map((metric, index) => (
        <TrendCard
          key={index}
          title={metric.title}
          value={metric.value}
          unit={metric.unit}
          data={metric.data}
          trendDirection={metric.trendDirection}
          changePercentage={metric.changePercentage}
          metricType={metric.metricType}
        />
      ))}
    </div>
  );
};

export default TrendCardGrid;