'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Line, ComposedChart } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { getSession } from '@/lib/session';
import { getWeeklyStats } from '@/lib/storage/unified-aggregator-wrapper';

interface StepProgressChartProps {
  userId?: string;
  className?: string;
  title?: string;
}

interface ChartData {
  name: string;
  steps: number;
  xp?: number;
  recoveryScore?: number;
}

const StepProgressChart: React.FC<StepProgressChartProps> = ({ 
  userId, 
  className = '', 
  title = 'Step Progress' 
}) => {
  const { data: session } = useSession();
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStepData = async () => {
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

        // Format data for chart - ensure arrays are normalized to same length
        const formattedData: ChartData[] = [];
        
        // Normalize the data to ensure equal array lengths
        const dates = weeklyStats?.dates || Array(7).fill(0).map((_, i) => {
          const date = new Date();
          date.setDate(date.getDate() - (6 - i));
          return date.toLocaleDateString('en-US', { weekday: 'short' });
        });
        
        const steps = weeklyStats?.steps || Array(7).fill(0);
        const xp = weeklyStats?.xp || Array(7).fill(0);
        const recoveryScores = weeklyStats?.recoveryScores || Array(7).fill(0);

        for (let i = 0; i < 7; i++) {
          formattedData.push({
            name: dates[i] || `Day ${i+1}`,
            steps: steps[i] !== undefined && steps[i] !== null ? Number(steps[i]) : 0,
            xp: xp[i] !== undefined && xp[i] !== null ? Number(xp[i]) : undefined,
            recoveryScore: recoveryScores[i] !== undefined && recoveryScores[i] !== null ? Number(recoveryScores[i]) : undefined
          });
        }

        setChartData(formattedData);
      } catch (err) {
        console.error('Error fetching step progress data:', err);
        setError(err instanceof Error ? err.message : 'Failed to load step progress data');
        // Set empty data on error to avoid breaking the chart
        setChartData(Array(7).fill(0).map((_, i) => ({
          name: `Day ${i+1}`,
          steps: 0
        })));
      } finally {
        setLoading(false);
      }
    };

    fetchStepData();
  }, [session, userId]);

  if (loading) {
    return (
      <Card className={`bg-[#161B22] border-[#30363D] rounded-2xl shadow-md transition-all duration-200 ${className}`}>
        <CardHeader>
          <CardTitle className="text-lg font-bold text-[#E6EDF3]">{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-64">
            <div className="text-[#8B949E]">Loading step data...</div>
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
                yAxisId="left"
              />
              <YAxis 
                stroke="#8B949E"
                tick={{ fill: '#8B949E' }}
                yAxisId="right"
                orientation="right"
              />
              <Tooltip
                contentStyle={{ 
                  backgroundColor: '#161B22', 
                  borderColor: '#30363D', 
                  color: '#E6EDF3' 
                }}
                formatter={(value, name) => {
                  if (name === 'steps') return [`${Number(value).toLocaleString()}`, 'Steps'];
                  if (name === 'xp') return [`${value}`, 'XP'];
                  if (name === 'recoveryScore') return [`${value}`, 'Recovery Score'];
                  return [value, name];
                }}
                labelFormatter={(label) => `Day: ${label}`}
              />
              <Legend />
              <Bar
                yAxisId="left"
                dataKey="steps"
                name="Steps"
                fill="#00C48C"
                radius={[4, 4, 0, 0]}
                barSize={24}
              />
              {chartData.some(d => d.xp !== undefined) && (
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="xp"
                  name="XP"
                  stroke="#4FB3FF"
                  strokeWidth={2}
                  dot={{ r: 4, fill: '#4FB3FF' }}
                  activeDot={{ r: 6 }}
                />
              )}
              {chartData.some(d => d.recoveryScore !== undefined) && (
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="recoveryScore"
                  name="Recovery Score"
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

export default StepProgressChart;