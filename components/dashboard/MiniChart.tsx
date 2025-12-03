'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { getSession } from '@/lib/session';
import { getWeeklyStats } from '@/lib/storage/unified-aggregator-wrapper';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

interface MiniChartData {
  name: string;
  value: number;
}

interface MiniChartProps {
  userId?: string;
  metric: 'steps' | 'calories' | 'sleep' | 'xp';
  title?: string;
  className?: string;
}

const MiniChart: React.FC<MiniChartProps> = ({ 
  userId,
  metric = 'steps', 
  title = 'Weekly Trend',
  className = '' 
}) => {
  const { data: session } = useSession();
  const [chartData, setChartData] = useState<MiniChartData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchChartData = async () => {
      try {
        setLoading(true);
        setError(null);

        let actualUserId = userId;
        if (!actualUserId) {
          if (session && session.user) {
            actualUserId = session.user.email || session.user.name || 'default_user';
          } else {
            const fallbackSession = getSession();
            actualUserId = fallbackSession?.username || 'default_user';
          }
        }

        if (!actualUserId) {
          throw new Error('User ID not available');
        }

        const weeklyStats = await getWeeklyStats(actualUserId);

        // Format data based on the requested metric
        const formattedData: MiniChartData[] = [];
        
        const dates = weeklyStats?.dates || Array(7).fill(0).map((_, i) => {
          const date = new Date();
          date.setDate(date.getDate() - (6 - i));
          return date.toLocaleDateString('en-US', { weekday: 'short' });
        });
        
        let metricValues: number[] = [];
        switch (metric) {
          case 'steps':
            metricValues = weeklyStats?.steps || Array(7).fill(0);
            break;
          case 'calories':
            metricValues = weeklyStats?.caloriesIn || Array(7).fill(0);
            break;
          case 'sleep':
            metricValues = weeklyStats?.sleepHours || Array(7).fill(0);
            break;
          case 'xp':
            metricValues = weeklyStats?.xp || Array(7).fill(0);
            break;
          default:
            metricValues = Array(7).fill(0);
        }

        for (let i = 0; i < 7; i++) {
          formattedData.push({
            name: dates[i] || `Day ${i+1}`,
            value: metricValues[i] !== undefined && metricValues[i] !== null ? Number(metricValues[i]) : 0
          });
        }

        setChartData(formattedData);
      } catch (err) {
        console.error('Error fetching mini chart data:', err);
        setError(err instanceof Error ? err.message : 'Failed to load chart data');
        // Set empty data on error to avoid breaking the chart
        setChartData(Array(7).fill(0).map((_, i) => ({
          name: `Day ${i+1}`,
          value: 0
        })));
      } finally {
        setLoading(false);
      }
    };

    fetchChartData();
  }, [session, userId, metric]);

  if (loading) {
    return (
      <div className={`bg-[#0D1117] rounded-lg p-4 ${className}`}>
        <div className="text-center py-4 text-[#8B949E]">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`bg-[#0D1117] rounded-lg p-4 ${className}`}>
        <div className="text-center py-4 text-[#FF6B6B]">Error: {error}</div>
      </div>
    );
  }

  const chartColors = {
    steps: '#00C48C',
    calories: '#FF6B6B',
    sleep: '#7C3AED',
    xp: '#4FB3FF'
  };

  return (
    <div className={`bg-[#0D1117] rounded-lg p-4 ${className}`}>
      <h4 className="text-sm font-semibold text-[#E6EDF3] mb-2">{title}</h4>
      <div className="h-24">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
            <Bar 
              dataKey="value" 
              fill={chartColors[metric]} 
              radius={[2, 2, 0, 0]}
              barSize={6}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default MiniChart;