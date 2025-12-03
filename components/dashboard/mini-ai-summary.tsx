'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useSession } from 'next-auth/react';
import { getSession } from '@/lib/session';
import UnifiedAggregator from '@/lib/storage/unified-aggregator';

interface MiniAISummaryProps {
  userId?: string;
}

interface DailyAggregate {
  date: string;
  steps: number;
  caloriesIn: number;
  caloriesOut: number;
  netCalories: number;
  sleepHours: number;
  xp: number;
}

interface SummaryStats {
  week: {
    stepsTotal: number;
    caloriesInTotal: number;
    caloriesOutTotal: number;
    netCaloriesTotal: number;
    sleepTotal: number;
    xpTotal: number;
  };
  today: DailyAggregate;
}

export function MiniAISummary({ userId }: MiniAISummaryProps) {
  const { data: session } = useSession();
  const [summary, setSummary] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAndGenerateSummary = async () => {
      try {
        setLoading(true);
        setError(null);

        // Determine user ID
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

        // Get summary stats from unified aggregator
        const summaryStats: SummaryStats = await UnifiedAggregator.getSummaryStats(actualUserId);
        
        // Generate rule-based AI summary
        const generatedSummary = generateAISummary(summaryStats);
        setSummary(generatedSummary);
      } catch (err) {
        console.error('Error generating AI summary:', err);
        setError('Failed to generate AI summary');
        setSummary('Could not generate summary. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchAndGenerateSummary();
  }, [userId, session]);

  // Function to generate rule-based AI summary
  const generateAISummary = (stats: SummaryStats): string => {
    const { week, today } = stats || {};

    // Check if we have valid data
    if (!week || !today) {
      return 'No sufficient data available. Start tracking your activities, meals, and sleep for personalized insights.';
    }

    // Determine activity trend
    let activityTrend = '';
    const avgWeeklySteps = (week.stepsTotal || 0) / 7;
    const todaySteps = today.steps || 0;

    if (todaySteps > avgWeeklySteps * 1.2 && avgWeeklySteps > 0) {
      activityTrend = 'You\'re exceeding your weekly average of steps! Keep up the great work.';
    } else if (todaySteps < avgWeeklySteps * 0.8 && avgWeeklySteps > 0) {
      activityTrend = 'Your activity level is below your weekly average. Consider adding a short walk to your day.';
    } else if (avgWeeklySteps > 0) {
      activityTrend = 'Your activity level is consistent with your weekly average. Good job staying on track!';
    } else {
      activityTrend = 'No activity data recorded yet. Start by tracking your steps today.';
    }

    // Determine sleep trend
    let sleepTrend = '';
    const avgWeeklySleep = (week.sleepTotal || 0) / 7;
    const todaySleep = today.sleepHours || 0;

    if (todaySleep > avgWeeklySleep * 1.1 && avgWeeklySleep > 0) {
      sleepTrend = 'You\'re getting more sleep than your weekly average! Your recovery is on point.';
    } else if (todaySleep < avgWeeklySleep * 0.9 && avgWeeklySleep > 0) {
      sleepTrend = 'You\'re getting less sleep than your weekly average. Prioritize your sleep tonight.';
    } else if (avgWeeklySleep > 0) {
      sleepTrend = 'Your sleep duration is consistent with your weekly average. Keep up your sleep routine.';
    } else {
      sleepTrend = 'No sleep data recorded yet. Start tracking your sleep for better insights.';
    }

    // Determine calorie balance trend
    let calorieTrend = '';
    const avgWeeklyCaloriesIn = (week.caloriesInTotal || 0) / 7;
    const avgWeeklyCaloriesOut = (week.caloriesOutTotal || 0) / 7;
    const avgWeeklyNetCalories = avgWeeklyCaloriesIn - avgWeeklyCaloriesOut;
    const todayCaloriesIn = today.caloriesIn || 0;
    const todayCaloriesOut = today.caloriesOut || 0;
    const todayNetCalories = todayCaloriesIn - todayCaloriesOut;

    if (avgWeeklyNetCalories !== 0 &&
        todayNetCalories >= avgWeeklyNetCalories * 0.8 &&
        todayNetCalories <= avgWeeklyNetCalories * 1.2) {
      calorieTrend = 'Your calorie balance is in a healthy range compared to your weekly average.';
    } else if (avgWeeklyNetCalories !== 0 && todayNetCalories > avgWeeklyNetCalories * 1.2) {
      calorieTrend = 'Your calorie intake is higher than your weekly average. Consider a more active day tomorrow.';
    } else if (avgWeeklyNetCalories !== 0) {
      calorieTrend = 'Your calorie balance is lower than your weekly average. Make sure you\'re fueling your body properly.';
    } else {
      calorieTrend = 'No calorie data recorded yet. Start logging your meals to track your nutrition.';
    }

    // Combine trends into a comprehensive summary
    return `${activityTrend} ${sleepTrend} ${calorieTrend}`;
  };

  if (loading) {
    return (
      <Card className="bg-[#161B22] border-[#30363D] mb-6 rounded-2xl shadow-md transition-all duration-200">
        <CardHeader>
          <CardTitle className="text-lg font-bold text-[#E6EDF3] flex items-center">
            <span className="h-5 w-5 mr-2 text-[#00C48C]">🤖</span>
            AI Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-20">
            <div className="text-[#8B949E]">Generating personalized insights...</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="bg-[#161B22] border-[#30363D] mb-6 rounded-2xl shadow-md transition-all duration-200">
        <CardHeader>
          <CardTitle className="text-lg font-bold text-[#E6EDF3] flex items-center">
            <span className="h-5 w-5 mr-2 text-[#00C48C]">🤖</span>
            AI Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-[#FF6B6B]">{error}</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-[#161B22] border-[#30363D] mb-6 rounded-2xl shadow-md transition-all duration-200">
      <CardHeader>
        <CardTitle className="text-lg font-bold text-[#E6EDF3] flex items-center">
          <span className="h-5 w-5 mr-2 text-[#00C48C]">🤖</span>
          AI Summary
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-[#E6EDF3]">{summary}</p>
      </CardContent>
    </Card>
  );
}

export default MiniAISummary;