'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Line, ComposedChart } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { getSession } from '@/lib/session';
import { getWeeklyStats } from '@/lib/storage/unified-aggregator-wrapper';

interface SleepTrendChartProps {
  userId?: string;
  className?: string;
  title?: string;
}

interface ChartData {
  name: string;
  sleep: number;
  sleepScore?: number;
}

const SleepTrendChart: React.FC<SleepTrendChartProps> = ({ 
  userId, 
  className = '', 
  title = 'Sleep Trend' 
}) => {
  const { data: session } = useSession();
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSleepData = async () => {
      try {
        setLoading(true);
        setError(null);

        let actualUserId = userId;
        if (!actualUserId) {
          if (session && session.user) {
            // Use the consistent userId helper to ensure we use the same format as data storage
            const { getConsistentUserId } = await import('@/lib/userId-helper');
            actualUserId = getConsistentUserId(session);
          } else {
            const fallbackSession = getSession();
            actualUserId = fallbackSession?.username || 'default_user';
          }
        }

        if (!actualUserId) {
          throw new Error('User ID not available');
        }

        const weeklyStats = await getWeeklyStats(actualUserId);

        // Format data for chart - ensure arrays are normalized to same length
        const formattedData: ChartData[] = [];
        
        // Normalize the data to ensure equal array lengths
        const dates = weeklyStats?.dates || Array(7).fill(0).map((_, i) => {
          const date = new Date();
          date.setDate(date.getDate() - (6 - i));
          return date.toLocaleDateString('en-US', { weekday: 'short' });
        });
        
        const sleepHours = weeklyStats?.sleepHours || Array(7).fill(0);
        const sleepScores = weeklyStats?.sleepScores || Array(7).fill(0);

        for (let i = 0; i < 7; i++) {
          formattedData.push({
            name: dates[i] || `Day ${i+1}`,
            sleep: sleepHours[i] !== undefined && sleepHours[i] !== null ? Number(sleepHours[i]) : 0,
            sleepScore: sleepScores[i] !== undefined && sleepScores[i] !== null ? Number(sleepScores[i]) : undefined
          });
        }

        setChartData(formattedData);
      } catch (err) {
        console.error('Error fetching sleep trend data:', err);
        setError(err instanceof Error ? err.message : 'Failed to load sleep trend data');
        // Set empty data on error to avoid breaking the chart
        setChartData(Array(7).fill(0).map((_, i) => ({
          name: `Day ${i+1}`,
          sleep: 0
        })));
      } finally {
        setLoading(false);
      }
    };

    fetchSleepData();
  }, [session, userId]);

  if (loading) {
    return (
      <Card className={`bg-[#161B22] border-[#30363D] rounded-2xl shadow-md transition-all duration-200 ${className}`}>
        <CardHeader>
          <CardTitle className="text-lg font-bold text-[#E6EDF3]">{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-64">
            <div className="text-[#8B949E]">Loading sleep data...</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className={`bg-[#161B22] border-[#30363D] rounded-2xl shadow-md transition-all duration-200 ${className}`}>
        <CardHeader>
          <CardTitle className="text-lg font-bold text-[#E6EDF3]">{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-[#FF6B6B] text-center py-8">{error}</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`bg-[#161B22] border-[#30363D] rounded-2xl shadow-md transition-all duration-200 ${className}`}>
      <CardHeader>
        <CardTitle className="text-lg font-bold text-[#E6EDF3]">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart
              data={chartData}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#30363D" />
              <XAxis 
                dataKey="name" 
                stroke="#8B949E"
                tick={{ fill: '#8B949E' }}
              />
              <YAxis 
                stroke="#8B949E"
                tick={{ fill: '#8B949E' }}
                domain={[0, 'dataMax + 2']} // Ensure proper scale for sleep hours
              />
              <Tooltip
                contentStyle={{ 
                  backgroundColor: '#161B22', 
                  borderColor: '#30363D', 
                  color: '#E6EDF3' 
                }}
                formatter={(value, name) => {
                  if (name === 'sleep') return [`${value} hours`, 'Sleep'];
                  if (name === 'sleepScore') return [`${value}`, 'Sleep Score'];
                  return [value, name];
                }}
                labelFormatter={(label) => `Day: ${label}`}
              />
              <Legend />
              <Bar
                dataKey="sleep"
                name="Sleep Hours"
                fill="#7C3AED"
                radius={[4, 4, 0, 0]}
                barSize={24}
              />
              {chartData.some(d => d.sleepScore !== undefined) && (
                <Line
                  type="monotone"
                  dataKey="sleepScore"
                  name="Sleep Score"
                  stroke="#FFA726"
                  strokeWidth={2}
                  dot={{ r: 4, fill: '#FFA726' }}
                  activeDot={{ r: 6 }}
                />
              )}
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default SleepTrendChart;