'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { getSession } from '@/lib/session';
import { getWeeklyStats } from '@/lib/storage/unified-aggregator-wrapper';
import { Card, CardContent } from '@/components/ui/card';
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
import { Activity, Flame, Moon, TrendingUp } from 'lucide-react';

interface MiniChartData {
  name: string;
  steps?: number;
  calories?: number;
  sleep?: number;
  xp?: number;
}

interface MiniChartsProps {
  userId?: string;
}

const MiniCharts: React.FC<MiniChartsProps> = ({ userId }) => {
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
          // Use the consistent userId helper to ensure we use the same format as data storage
          const { getConsistentUserId } = await import('@/lib/userId-helper');
          actualUserId = getConsistentUserId(session);
        }

        if (!actualUserId) {
          throw new Error('User ID not available');
        }

        const weeklyStats = await getWeeklyStats(actualUserId);

        // Format data for all metrics
        const formattedData: MiniChartData[] = [];
        
        const dates = weeklyStats?.dates || Array(7).fill(0).map((_, i) => {
          const date = new Date();
          date.setDate(date.getDate() - (6 - i));
          return date.toLocaleDateString('en-US', { weekday: 'short' });
        });
        
        const steps = weeklyStats?.steps || Array(7).fill(0);
        const calories = weeklyStats?.caloriesIn || Array(7).fill(0);
        const sleep = weeklyStats?.sleepHours || Array(7).fill(0);
        const xp = weeklyStats?.xp || Array(7).fill(0);

        for (let i = 0; i < 7; i++) {
          formattedData.push({
            name: dates[i] || `Day ${i+1}`,
            steps: steps[i] !== undefined && steps[i] !== null ? Number(steps[i]) : 0,
            calories: calories[i] !== undefined && calories[i] !== null ? Number(calories[i]) : 0,
            sleep: sleep[i] !== undefined && sleep[i] !== null ? Number(sleep[i]) : 0,
            xp: xp[i] !== undefined && xp[i] !== null ? Number(xp[i]) : 0
          });
        }

        setChartData(formattedData);
      } catch (err) {
        console.error('Error fetching mini charts data:', err);
        setError(err instanceof Error ? err.message : 'Failed to load chart data');
        // Set empty data on error to avoid breaking the charts
        setChartData(Array(7).fill(0).map((_, i) => ({
          name: `Day ${i+1}`,
          steps: 0,
          calories: 0,
          sleep: 0,
          xp: 0
        })));
      } finally {
        setLoading(false);
      }
    };

    fetchChartData();
  }, [session, userId]);

  if (loading) {
    return (
      <Card className="bg-[#161B22] border-[#30363D] p-4 rounded-2xl shadow-md transition-all duration-200">
        <div className="text-center py-4 text-[#8B949E]">Loading charts...</div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="bg-[#161B22] border-[#30363D] p-4 rounded-2xl shadow-md transition-all duration-200">
        <div className="text-center py-4 text-[#FF6B6B]">Error: {error}</div>
      </Card>
    );
  }

  return (
    <Card className="bg-[#161B22] border-[#30363D] p-4 rounded-2xl shadow-md transition-all duration-200">
      <h3 className="text-lg font-bold text-[#E6EDF3] mb-4">Weekly Trends</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Steps Mini Chart */}
        <div className="bg-[#0D1117] rounded-lg p-3">
          <div className="flex items-center mb-2">
            <Activity className="h-4 w-4 text-[#00C48C] mr-2" />
            <h4 className="text-xs font-semibold text-[#E6EDF3]">Steps</h4>
          </div>
          <div className="h-16">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <Bar dataKey="steps" fill="#00C48C" radius={[2, 2, 0, 0]} barSize={6} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Calories Mini Chart */}
        <div className="bg-[#0D1117] rounded-lg p-3">
          <div className="flex items-center mb-2">
            <Flame className="h-4 w-4 text-[#FF6B6B] mr-2" />
            <h4 className="text-xs font-semibold text-[#E6EDF3]">Calories</h4>
          </div>
          <div className="h-16">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <Bar dataKey="calories" fill="#FF6B6B" radius={[2, 2, 0, 0]} barSize={6} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Sleep Mini Chart */}
        <div className="bg-[#0D1117] rounded-lg p-3">
          <div className="flex items-center mb-2">
            <Moon className="h-4 w-4 text-[#7C3AED] mr-2" />
            <h4 className="text-xs font-semibold text-[#E6EDF3]">Sleep</h4>
          </div>
          <div className="h-16">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <Bar dataKey="sleep" fill="#7C3AED" radius={[2, 2, 0, 0]} barSize={6} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* XP Mini Chart */}
        <div className="bg-[#0D1117] rounded-lg p-3">
          <div className="flex items-center mb-2">
            <TrendingUp className="h-4 w-4 text-[#4FB3FF] mr-2" />
            <h4 className="text-xs font-semibold text-[#E6EDF3]">XP</h4>
          </div>
          <div className="h-16">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <Bar dataKey="xp" fill="#4FB3FF" radius={[2, 2, 0, 0]} barSize={6} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default MiniCharts;