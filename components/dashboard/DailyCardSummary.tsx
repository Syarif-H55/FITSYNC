'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { getSession } from '@/lib/session';
import { Card, CardContent } from '@/components/ui/card';
import { Flame, Footprints, Moon, TrendingUp } from 'lucide-react';

interface DailySummary {
  date: string;
  caloriesIn: number;
  caloriesOut: number;
  netCalories: number;
  steps: number;
  sleepHours: number;
  goalSteps: number;
  goalSleep: number;
}

interface DailyCardSummaryProps {
  userId?: string;
}

const DailyCardSummary = ({ userId }: DailyCardSummaryProps) => {
  const { data: session } = useSession();
  const [dailySummary, setDailySummary] = useState<DailySummary | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDailySummary();
  }, [userId, session]);

  const fetchDailySummary = async () => {
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

      // Get today's aggregated data from unified store
      const { getDailyStats } = await import('@/lib/storage/unified-aggregator-wrapper');
      const dailyStats = await getDailyStats(actualUserId);

      // Get goals for comparison
      let goalSteps = 10000;
      let goalSleep = 8;

      try {
        const profile = JSON.parse(localStorage.getItem(`user_${actualUserId}_profile`) || '{}');
        goalSteps = profile.goalSteps || 10000;
        goalSleep = profile.sleepGoal || 8;
      } catch (e) {
        // Use defaults if profile not found
      }

      setDailySummary({
        date: new Date().toISOString().split('T')[0], // Today's date
        caloriesIn: dailyStats.caloriesIn || 0,
        caloriesOut: dailyStats.caloriesOut || 0,
        netCalories: (dailyStats.caloriesIn || 0) - (dailyStats.caloriesOut || 0),
        steps: dailyStats.steps || 0,
        sleepHours: dailyStats.sleepHours || 0,
        goalSteps,
        goalSleep
      });
    } catch (err) {
      console.error('Error fetching daily summary:', err);
      setError('Failed to load daily summary');
      setDailySummary(null);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Card className="bg-[#1C1F26] border-[#2A2D33] rounded-2xl shadow-md transition-all duration-200">
        <CardContent className="p-6">
          <div className="text-center py-4 text-[#8B949E]">Loading daily summary...</div>
        </CardContent>
      </Card>
    );
  }

  if (error || !dailySummary) {
    return (
      <Card className="bg-[#1C1F26] border-[#2A2D33] rounded-2xl shadow-md transition-all duration-200">
        <CardContent className="p-6">
          <div className="text-center py-4 text-[#FF6B6B]">Error: {error || 'No data available'}</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-[#1C1F26] border-[#2A2D33] rounded-2xl shadow-md transition-all duration-200">
      <CardContent className="p-6">
        <h3 className="text-lg font-bold text-white mb-4">Today's Summary</h3>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {/* Calories In/Out */}
          <div className="p-3 bg-[#22252D] rounded-lg">
            <div className="flex items-center mb-1">
              <Flame className="h-4 w-4 text-[#FF6B6B] mr-2" />
              <span className="text-xs font-medium text-[#8B949E]">Calories</span>
            </div>
            <div className="flex justify-between">
              <div>
                <span className="text-xs text-[#A0A3A8]">In</span>
                <p className="text-sm font-bold text-white">{dailySummary.caloriesIn}</p>
              </div>
              <div>
                <span className="text-xs text-[#A0A3A8]">Out</span>
                <p className="text-sm font-bold text-white">{dailySummary.caloriesOut}</p>
              </div>
            </div>
            <div className="mt-1">
              <span className="text-xs text-[#A0A3A8]">Net</span>
              <p className={`text-xs font-bold ${dailySummary.netCalories >= 0 ? 'text-[#FF6B6B]' : 'text-[#00FFAA]'}`}>
                {dailySummary.netCalories >= 0 ? '+' : ''}{dailySummary.netCalories}
              </p>
            </div>
          </div>

          {/* Steps */}
          <div className="p-3 bg-[#22252D] rounded-lg">
            <div className="flex items-center mb-1">
              <Footprints className="h-4 w-4 text-[#00FFAA] mr-2" />
              <span className="text-xs font-medium text-[#8B949E]">Steps</span>
            </div>
            <p className="text-lg font-bold text-white">{dailySummary.steps.toLocaleString()}</p>
            <div className="mt-2">
              <div className="w-full bg-[#161B22] rounded-full h-1.5">
                <div
                  className="bg-[#00FFAA] h-1.5 rounded-full"
                  style={{ width: `${Math.min(100, (dailySummary.steps / dailySummary.goalSteps) * 100)}%` }}
                ></div>
              </div>
              <p className="text-xs text-[#8B949E] mt-1">{Math.round((dailySummary.steps / dailySummary.goalSteps) * 100)}% of goal</p>
            </div>
          </div>

          {/* Sleep */}
          <div className="p-3 bg-[#22252D] rounded-lg">
            <div className="flex items-center mb-1">
              <Moon className="h-4 w-4 text-[#7C3AED] mr-2" />
              <span className="text-xs font-medium text-[#8B949E]">Sleep</span>
            </div>
            <p className="text-lg font-bold text-white">{dailySummary.sleepHours.toFixed(1)}h</p>
            <div className="mt-2">
              <div className="w-full bg-[#161B22] rounded-full h-1.5">
                <div
                  className="bg-[#7C3AED] h-1.5 rounded-full"
                  style={{ width: `${Math.min(100, (dailySummary.sleepHours / dailySummary.goalSleep) * 100)}%` }}
                ></div>
              </div>
              <p className="text-xs text-[#8B949E] mt-1">{Math.round((dailySummary.sleepHours / dailySummary.goalSleep) * 100)}% of goal</p>
            </div>
          </div>

          {/* XP (placeholder) */}
          <div className="p-3 bg-[#22252D] rounded-lg">
            <div className="flex items-center mb-1">
              <TrendingUp className="h-4 w-4 text-[#4FB3FF] mr-2" />
              <span className="text-xs font-medium text-[#8B949E]">XP Today</span>
            </div>
            <p className="text-lg font-bold text-white">0</p>
            <p className="text-xs text-[#8B949E] mt-2">No data</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DailyCardSummary;