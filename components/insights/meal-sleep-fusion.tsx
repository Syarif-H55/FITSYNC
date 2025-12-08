'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useSession } from 'next-auth/react';
import { getSession } from '@/lib/session';
import { InsightFusionEngine, FusionInsight, CorrelationMetrics } from '@/lib/insights/fusion-engine';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, ComposedChart, Area, AreaChart } from 'recharts';

interface MealSleepFusionCardProps {
  userId?: string;
}

const MealSleepFusionCard = ({ userId }: MealSleepFusionCardProps) => {
  const { data: session } = useSession();
  const [insights, setInsights] = useState<FusionInsight[]>([]);
  const [metrics, setMetrics] = useState<CorrelationMetrics | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFusionData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Determine user ID
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

        // Create fusion engine instance
        const fusionEngine = new InsightFusionEngine();

        // Get fusion insights
        const insightsData = await fusionEngine.generateMealSleepInsights(actualUserId, new Date());
        setInsights(insightsData);

        // Get correlation metrics
        const metricsData = await fusionEngine.calculateCorrelationMetrics(actualUserId);
        setMetrics(metricsData);
      } catch (err) {
        console.error('Error fetching fusion data:', err);
        setError('Failed to load meal-sleep fusion insights');
      } finally {
        setLoading(false);
      }
    };

    fetchFusionData();
  }, [userId, session]);

  // Prepare data for chart visualization
  const chartData = metrics ? [
    { name: 'Recovery', value: metrics.recoveryScore },
    { name: 'Nutrition Quality', value: metrics.mealQualityTrend },
    { name: 'Meal-Sleep Correlation', value: Math.abs(metrics.mealSleepCorrelation) * 100 },
    { name: 'Timing Impact', value: Math.abs(metrics.timingImpact) * 100 },
  ] : [];

  // Data for additional correlation charts
  const correlationChartData = metrics ? [
    { name: 'Sleep Quality', value: metrics.nutritionQualityImpact * 100 },
    { name: 'Nutrition Impact', value: metrics.nutritionQualityImpact * 100 },
    { name: 'Recovery', value: metrics.recoveryScore },
    { name: 'Meal Timing', value: Math.abs(metrics.timingImpact) * 100 }
  ] : [];

  if (loading) {
    return (
      <Card className="bg-[#161B22] border-[#30363D] mb-6 rounded-2xl shadow-md transition-all duration-200">
        <CardHeader>
          <CardTitle className="text-lg font-bold text-[#E6EDF3] flex items-center">
            <span className="h-5 w-5 mr-2 text-[#00C48C]">🍽️😴</span>
            Meal-Sleep Fusion
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-40">
            <div className="text-[#8B949E]">Analyzing meal-sleep correlations...</div>
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
            <span className="h-5 w-5 mr-2 text-[#00C48C]">🍽️😴</span>
            Meal-Sleep Fusion
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
          <span className="h-5 w-5 mr-2 text-[#00C48C]">🍽️😴</span>
          Meal-Sleep Fusion
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-6">
          <h3 className="text-md font-semibold text-[#E6EDF3] mb-3">Correlation Metrics</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#30363D" />
                <XAxis dataKey="name" stroke="#8B949E" />
                <YAxis stroke="#8B949E" domain={[0, 100]} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#161B22', borderColor: '#30363D', color: '#E6EDF3' }}
                  formatter={(value) => [`${value}`, 'Score']}
                />
                <Bar dataKey="value" fill="#4FB3FF" name="Score" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {metrics && (
          <div className="mb-6">
            <h3 className="text-md font-semibold text-[#E6EDF3] mb-3">Correlation Analysis</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-2 bg-[#0D1117] rounded-lg">
                <span className="text-[#8B949E]">Recovery Score:</span>
                <span className="ml-2 font-medium text-[#E6EDF3]">{metrics.recoveryScore.toFixed(1)}</span>
                <div className="w-full bg-[#161B22] rounded-full h-2 mt-2">
                  <div
                    className="bg-[#00FFAA] h-2 rounded-full"
                    style={{ width: `${(metrics.recoveryScore / 100) * 100}%` }}
                  ></div>
                </div>
              </div>
              <div className="p-2 bg-[#0D1117] rounded-lg">
                <span className="text-[#8B949E]">Nutrition Trend:</span>
                <span className="ml-2 font-medium text-[#E6EDF3]">{metrics.mealQualityTrend.toFixed(1)}</span>
                <div className="w-full bg-[#161B22] rounded-full h-2 mt-2">
                  <div
                    className="bg-[#4FB3FF] h-2 rounded-full"
                    style={{ width: `${(metrics.mealQualityTrend / 100) * 100}%` }}
                  ></div>
                </div>
              </div>
              <div className="p-2 bg-[#0D1117] rounded-lg">
                <span className="text-[#8B949E]">Meal-Sleep Correlation:</span>
                <span className="ml-2 font-medium text-[#E6EDF3]">{(metrics.mealSleepCorrelation * 100).toFixed(1)}%</span>
                <div className="w-full bg-[#161B22] rounded-full h-2 mt-2">
                  <div
                    className="bg-[#FFA726] h-2 rounded-full"
                    style={{ width: `${Math.abs(metrics.mealSleepCorrelation * 100)}%` }}
                  ></div>
                </div>
              </div>
              <div className="p-2 bg-[#0D1117] rounded-lg">
                <span className="text-[#8B949E]">Timing Impact:</span>
                <span className="ml-2 font-medium text-[#E6EDF3]">{(metrics.timingImpact * 100).toFixed(1)}%</span>
                <div className="w-full bg-[#161B22] rounded-full h-2 mt-2">
                  <div
                    className="bg-[#7C3AED] h-2 rounded-full"
                    style={{ width: `${Math.abs(metrics.timingImpact * 100)}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        )}

        {insights.length > 0 && (
          <div className="mb-6">
            <h3 className="text-md font-semibold text-[#E6EDF3] mb-3">Key Insights</h3>
            <div className="space-y-3">
              {insights.map((insight) => (
                <div key={insight.id} className="p-3 bg-[#0D1117] rounded-lg border border-[#30363D]">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-[#E6EDF3] font-medium">{insight.insight}</p>
                      <p className="text-[#8B949E] text-sm mt-1">{insight.recommendation}</p>
                    </div>
                    <span className="ml-2 px-2 py-1 bg-[#22252D] text-xs rounded-full text-[#00FFAA]">
                      {insight.score.toFixed(1)}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {insights.length === 0 && metrics && (
          <div className="text-center py-4">
            <p className="text-[#8B949E]">Not enough data to generate specific insights yet.</p>
            <p className="text-sm text-[#8B949E] mt-1">Continue logging meals and sleep to improve analysis.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MealSleepFusionCard;