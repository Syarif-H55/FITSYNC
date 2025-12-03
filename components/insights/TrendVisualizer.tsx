'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { getSession } from '@/lib/session';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  AreaChart, 
  Area,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend,
  ResponsiveContainer 
} from 'recharts';
import { Activity, Flame, Moon, TrendingUp, Footprints } from 'lucide-react';

interface TrendDataPoint {
  date: string;
  steps?: number;
  caloriesIn?: number;
  caloriesOut?: number;
  sleepHours?: number;
  xp?: number;
}

interface TrendVisualizerProps {
  userId?: string;
}

const TrendVisualizer = ({ userId }: TrendVisualizerProps) => {
  const { data: session } = useSession();
  const [trendData, setTrendData] = useState<TrendDataPoint[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedMetric, setSelectedMetric] = useState<string>('all');

  useEffect(() => {
    fetchTrendData();
  }, [userId, session]);

  const fetchTrendData = async () => {
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

      // Get weekly aggregated data from unified aggregator
      const { getWeeklyStats } = await import('@/lib/storage/unified-aggregator-wrapper');
      const weeklyStats = await getWeeklyStats(actualUserId);

      console.log('[TREND VISUALIZER] Weekly stats received:', {
        userId: actualUserId,
        hasData: !!weeklyStats,
        dates: weeklyStats?.dates?.length,
        steps: weeklyStats?.steps?.length,
        structure: weeklyStats
      });

      // Format data for chart
      const formattedData: TrendDataPoint[] = [];

      if (Array.isArray(weeklyStats?.dates)) {
        for (let i = 0; i < weeklyStats.dates.length; i++) {
          formattedData.push({
            date: weeklyStats.dates[i],
            steps: weeklyStats.steps?.[i] || 0,
            caloriesIn: weeklyStats.caloriesIn?.[i] || 0,
            caloriesOut: weeklyStats.caloriesOut?.[i] || 0,
            sleepHours: weeklyStats.sleepHours?.[i] || 0,
            xp: weeklyStats.xp?.[i] || 0
          });
        }
        console.log('[TREND VISUALIZER] Formatted data points:', formattedData.length);
      } else {
        console.warn('[TREND VISUALIZER] No dates array in weekly stats:', weeklyStats);
      }

      setTrendData(formattedData);
    } catch (err) {
      console.error('Error fetching trend data:', err);
      setError('Failed to load trend data');
      // Set empty data to prevent crashes
      setTrendData([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Card className="bg-[#1C1F26] border-[#2A2D33] rounded-2xl shadow-md transition-all duration-200">
        <CardHeader>
          <CardTitle className="text-lg font-bold text-white flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-[#4FB3FF]" />
            7-Day Trend Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-[#8B949E]">Loading trends...</div>
        </CardContent>
      </Card>
    );
  }

  if (error || trendData.length === 0) {
    return (
      <Card className="bg-[#1C1F26] border-[#2A2D33] rounded-2xl shadow-md transition-all duration-200">
        <CardHeader>
          <CardTitle className="text-lg font-bold text-white flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-[#4FB3FF]" />
            7-Day Trend Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-[#FF6B6B]">{error || 'No trend data available'}</div>
        </CardContent>
      </Card>
    );
  }

  // Get the metric color based on the selected metric
  const getMetricColor = (metric: string) => {
    switch (metric) {
      case 'steps': return '#00FFAA';
      case 'caloriesIn': return '#FF6B6B';
      case 'caloriesOut': return '#4FB3FF';
      case 'sleepHours': return '#7C3AED';
      case 'xp': return '#4FB3FF';
      default: return '#A0A3A8';
    }
  };

  // Get the metric icon based on the selected metric
  const getMetricIcon = (metric: string) => {
    switch (metric) {
      case 'steps': return <Footprints className="h-4 w-4 mr-1" />;
      case 'caloriesIn': return <Flame className="h-4 w-4 mr-1" />;
      case 'caloriesOut': return <Activity className="h-4 w-4 mr-1" />;
      case 'sleepHours': return <Moon className="h-4 w-4 mr-1" />;
      case 'xp': return <TrendingUp className="h-4 w-4 mr-1" />;
      default: return <TrendingUp className="h-4 w-4 mr-1" />;
    }
  };

  // Render the chart based on selected metric or show all metrics
  const renderChart = () => {
    if (selectedMetric === 'all') {
      return (
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={trendData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#2A2D33" />
            <XAxis dataKey="date" stroke="#8B949E" />
            <YAxis stroke="#8B949E" />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#22252D', 
                borderColor: '#2A2D33', 
                color: '#E4E6EB',
                borderRadius: '0.5rem'
              }} 
            />
            <Legend />
            <Area 
              type="monotone" 
              dataKey="steps" 
              name="Steps" 
              stroke="#00FFAA" 
              fill="#00FFAA" 
              fillOpacity={0.1}
              strokeWidth={2}
            />
            <Area 
              type="monotone" 
              dataKey="caloriesIn" 
              name="Calories In" 
              stroke="#FF6B6B" 
              fill="#FF6B6B" 
              fillOpacity={0.1}
              strokeWidth={2}
            />
            <Area 
              type="monotone" 
              dataKey="sleepHours" 
              name="Sleep Hours" 
              stroke="#7C3AED" 
              fill="#7C3AED" 
              fillOpacity={0.1}
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      );
    } else {
      return (
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={trendData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#2A2D33" />
            <XAxis dataKey="date" stroke="#8B949E" />
            <YAxis stroke="#8B949E" />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#22252D', 
                borderColor: '#2A2D33', 
                color: '#E4E6EB',
                borderRadius: '0.5rem'
              }} 
            />
            <Legend />
            <Line 
              type="monotone" 
              dataKey={selectedMetric} 
              name={selectedMetric} 
              stroke={getMetricColor(selectedMetric)} 
              strokeWidth={2}
              dot={{ stroke: getMetricColor(selectedMetric), strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: getMetricColor(selectedMetric) }}
            />
          </LineChart>
        </ResponsiveContainer>
      );
    }
  };

  return (
    <Card className="bg-[#1C1F26] border-[#2A2D33] rounded-2xl shadow-md transition-all duration-200">
      <CardHeader>
        <CardTitle className="text-lg font-bold text-white flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-[#4FB3FF]" />
          7-Day Trend Analysis
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Metric Selection Controls */}
        <div className="mb-4 flex flex-wrap gap-2">
          <button
            className={`px-3 py-1 rounded-full text-xs ${
              selectedMetric === 'all'
                ? 'bg-[#00FFAA] text-[#0E0E12]'
                : 'bg-[#22252D] text-[#E4E6EB] border border-[#2A2D33]'
            }`}
            onClick={() => setSelectedMetric('all')}
          >
            All Metrics
          </button>
          
          <button
            className={`px-3 py-1 rounded-full text-xs flex items-center ${
              selectedMetric === 'steps'
                ? 'bg-[#00FFAA] text-[#0E0E12]'
                : 'bg-[#22252D] text-[#E4E6EB] border border-[#2A2D33]'
            }`}
            onClick={() => setSelectedMetric('steps')}
          >
            <Footprints className="h-3 w-3 mr-1" /> Steps
          </button>

          <button
            className={`px-3 py-1 rounded-full text-xs flex items-center ${
              selectedMetric === 'caloriesIn'
                ? 'bg-[#FF6B6B] text-white'
                : 'bg-[#22252D] text-[#E4E6EB] border border-[#2A2D33]'
            }`}
            onClick={() => setSelectedMetric('caloriesIn')}
          >
            <Flame className="h-3 w-3 mr-1" /> In
          </button>

          <button
            className={`px-3 py-1 rounded-full text-xs flex items-center ${
              selectedMetric === 'caloriesOut'
                ? 'bg-[#4FB3FF] text-white'
                : 'bg-[#22252D] text-[#E4E6EB] border border-[#2A2D33]'
            }`}
            onClick={() => setSelectedMetric('caloriesOut')}
          >
            <Activity className="h-3 w-3 mr-1" /> Out
          </button>

          <button
            className={`px-3 py-1 rounded-full text-xs flex items-center ${
              selectedMetric === 'sleepHours'
                ? 'bg-[#7C3AED] text-white'
                : 'bg-[#22252D] text-[#E4E6EB] border border-[#2A2D33]'
            }`}
            onClick={() => setSelectedMetric('sleepHours')}
          >
            <Moon className="h-3 w-3 mr-1" /> Sleep
          </button>
        </div>
        
        {/* Chart Visualization */}
        <div className="h-80">
          {renderChart()}
        </div>
      </CardContent>
    </Card>
  );
};

export default TrendVisualizer;