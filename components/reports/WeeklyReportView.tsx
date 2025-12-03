'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { getSession } from '@/lib/session';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Activity, Flame, Moon, TrendingUp } from 'lucide-react';
import { useWeeklyReport } from '@/hooks/useWeeklyReport';

interface WeeklyReportViewProps {
  userId?: string;
}

const WeeklyReportView = ({ userId }: WeeklyReportViewProps) => {
  const { data: session } = useSession();
  const { report, loading, error, generateReport } = useWeeklyReport();
  
  const [selectedWeek, setSelectedWeek] = useState<Date>(new Date());

  if (loading) {
    return (
      <Card className="bg-[#1C1F26] border-[#2A2D33] rounded-2xl shadow-md transition-all duration-200">
        <CardHeader>
          <CardTitle className="text-lg font-bold text-white">Weekly Report</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-white">Loading weekly report...</div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="bg-[#1C1F26] border-[#2A2D33] rounded-2xl shadow-md transition-all duration-200">
        <CardHeader>
          <CardTitle className="text-lg font-bold text-white">Weekly Report</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-[#FF6B6B]">{error}</div>
          <Button 
            onClick={() => generateReport(selectedWeek)} 
            className="w-full bg-[#00FFAA] text-[#0E0E12]"
          >
            Retry Report Generation
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (!report) {
    return (
      <Card className="bg-[#1C1F26] border-[#2A2D33] rounded-2xl shadow-md transition-all duration-200">
        <CardHeader>
          <CardTitle className="text-lg font-bold text-white">Weekly Report</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-[#8B949E]">
            No report data available. Generate your first weekly report!
          </div>
          <Button 
            onClick={() => generateReport(selectedWeek)} 
            className="w-full bg-gradient-to-r from-[#7C3AED] to-[#00FFAA] hover:from-[#6d32d6] hover:to-[#00e69a] text-white"
          >
            Generate Weekly Report
          </Button>
        </CardContent>
      </Card>
    );
  }

  const { scores, highlights, recommendations, trends, comparison } = report;

  return (
    <Card className="bg-[#1C1F26] border-[#2A2D33] rounded-2xl shadow-md transition-all duration-200">
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <CardTitle className="text-lg font-bold text-white">Weekly Report</CardTitle>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="bg-[#22252D] border-[#30363D] text-white hover:bg-[#2A2D33]"
              onClick={() => setSelectedWeek(new Date(Date.now() - 7 * 24 * 60 * 60 * 1000))}
            >
              Previous Week
            </Button>
            <Button
              onClick={() => generateReport(selectedWeek)}
              className="bg-[#00FFAA] text-[#0E0E12]"
            >
              Refresh Report
            </Button>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2 mt-2">
          <span className="text-sm text-[#8B949E]">
            {report.weekStart} to {report.weekEnd}
          </span>
          <span className="text-sm text-[#A0A3A8] ml-2">
            Generated: {report.generatedAt.toLocaleDateString()}
          </span>
        </div>
      </CardHeader>
      
      <CardContent>
        {/* Scores Overview */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <div className="text-center p-4 bg-[#22252D] rounded-lg border border-[#2A2D33]">
            <Activity className="h-6 w-6 text-[#4FB3FF] mx-auto mb-2" />
            <p className="text-2xl font-bold text-white">{scores.activity.value}</p>
            <p className="text-sm text-[#8B949E]">Activity</p>
          </div>
          <div className="text-center p-4 bg-[#22252D] rounded-lg border border-[#2A2D33]">
            <Flame className="h-6 w-6 text-[#FF6B6B] mx-auto mb-2" />
            <p className="text-2xl font-bold text-white">{scores.nutrition.value}</p>
            <p className="text-sm text-[#8B949E]">Nutrition</p>
          </div>
          <div className="text-center p-4 bg-[#22252D] rounded-lg border border-[#2A2D33]">
            <Moon className="h-6 w-6 text-[#7C3AED] mx-auto mb-2" />
            <p className="text-2xl font-bold text-white">{scores.sleep.value}</p>
            <p className="text-sm text-[#8B949E]">Sleep</p>
          </div>
          <div className="text-center p-4 bg-[#22252D] rounded-lg border border-[#2A2D33]">
            <TrendingUp className="h-6 w-6 text-[#4FB3FF] mx-auto mb-2" />
            <p className="text-2xl font-bold text-white">{scores.recovery.value}</p>
            <p className="text-sm text-[#8B949E]">Recovery</p>
          </div>
          <div className="text-center p-4 bg-[#22252D] rounded-lg border border-[#2A2D33]">
            <TrendingUp className="h-6 w-6 text-[#FFD700] mx-auto mb-2" />
            <p className="text-2xl font-bold text-white">{scores.overall.value}</p>
            <p className="text-sm text-[#8B949E]">Overall</p>
          </div>
        </div>

        {/* Highlights */}
        <div className="mb-8">
          <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <span className="h-5 w-5 text-[#00FFAA]">🌟</span> Week Highlights
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {report.highlights?.map((highlight, index) => (
              <Card key={index} className="bg-[#22252D] border-[#2A2D33]">
                <CardContent className="p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-sm font-medium text-[#00FFAA] capitalize">{highlight.type}</span>
                      <p className="text-[#E4E6EB] mt-1">{highlight.description}</p>
                    </div>
                    <span className="text-sm text-[#8B949E]">{highlight.value}</span>
                  </div>
                </CardContent>
              </Card>
            )) || (
              <p className="text-center text-[#8B949E] col-span-2">No highlights available</p>
            )}
          </div>
        </div>

        {/* Recommendations */}
        <div className="mb-8">
          <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <span className="h-5 w-5 text-[#FFA726]">💡</span> Recommendations
          </h3>
          <div className="space-y-4">
            {report.recommendations?.map((rec, index) => (
              <div key={index} className="flex items-start gap-4 p-4 bg-[#22252D] rounded-lg border border-[#2A2D33]">
                <div className={`w-3 h-3 mt-1.5 rounded-full ${
                  rec.priority === 'high' ? 'bg-[#FF6B6B]' :
                  rec.priority === 'medium' ? 'bg-[#FFA726]' : 'bg-[#00FFAA]'
                }`}></div>
                <div>
                  <span className="font-medium text-white">{rec.description}</span>
                  <p className="text-sm text-[#8B949E] mt-1">{rec.target}</p>
                </div>
              </div>
            )) || (
              <p className="text-center text-[#8B949E]">No recommendations available</p>
            )}
          </div>
        </div>

        {/* Trend Analysis */}
        <div className="mb-8">
          <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <span className="h-5 w-5 text-[#4FB3FF]">📊</span> Trend Analysis
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {report.trends?.map((trend, index) => (
              <Card key={index} className="bg-[#22252D] border-[#2A2D33]">
                <CardContent className="p-4">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="font-medium text-white capitalize">{trend.metric}</h4>
                    <span className={`text-sm ${
                      trend.direction === 'improving' ? 'text-[#00FFAA]' :
                      trend.direction === 'declining' ? 'text-[#FF6B6B]' : 'text-[#A0A3A8]'
                    }`}>
                      {trend.direction === 'improving' ? '↗' : trend.direction === 'declining' ? '↘' : '→'} {trend.change.toFixed(1)}%
                    </span>
                  </div>
                  <p className="text-sm text-[#8B949E]">{trend.description}</p>
                </CardContent>
              </Card>
            )) || (
              <p className="text-center text-[#8B949E] col-span-2">No trend data available</p>
            )}
          </div>
        </div>

        {/* Week Comparison */}
        <div>
          <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <span className="h-5 w-5 text-[#7C3AED]">🔄</span> This vs Last Week
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="text-center p-4 bg-[#22252D] rounded-lg border border-[#2A2D33]">
              <Activity className="h-5 w-5 text-[#4FB3FF] mx-auto mb-2" />
              <p className="font-medium text-white">Steps</p>
              <p className={`text-lg font-bold ${
                (report.comparison?.differences?.steps || 0) > 0 ? 'text-[#00FFAA]' : 'text-[#FF6B6B]'
              }`}>
                {(report.comparison?.differences?.steps || 0) > 0 ? '+' : ''}{(report.comparison?.differences?.steps || 0).toFixed(1)}%
              </p>
            </div>
            <div className="text-center p-4 bg-[#22252D] rounded-lg border border-[#2A2D33]">
              <Flame className="h-5 w-5 text-[#FF6B6B] mx-auto mb-2" />
              <p className="font-medium text-white">Calories In</p>
              <p className={`text-lg font-bold ${
                (report.comparison?.differences?.caloriesIn || 0) > 0 ? 'text-[#00FFAA]' : 'text-[#FF6B6B]'
              }`}>
                {(report.comparison?.differences?.caloriesIn || 0) > 0 ? '+' : ''}{(report.comparison?.differences?.caloriesIn || 0).toFixed(1)}%
              </p>
            </div>
            <div className="text-center p-4 bg-[#22252D] rounded-lg border border-[#2A2D33]">
              <Activity className="h-5 w-5 text-[#4FB3FF] mx-auto mb-2" />
              <p className="font-medium text-white">Calories Out</p>
              <p className={`text-lg font-bold ${
                (report.comparison?.differences?.caloriesOut || 0) > 0 ? 'text-[#00FFAA]' : 'text-[#FF6B6B]'
              }`}>
                {(report.comparison?.differences?.caloriesOut || 0) > 0 ? '+' : ''}{(report.comparison?.differences?.caloriesOut || 0).toFixed(1)}%
              </p>
            </div>
            <div className="text-center p-4 bg-[#22252D] rounded-lg border border-[#2A2D33]">
              <Moon className="h-5 w-5 text-[#7C3AED] mx-auto mb-2" />
              <p className="font-medium text-white">Sleep</p>
              <p className={`text-lg font-bold ${
                (report.comparison?.differences?.sleep || 0) > 0 ? 'text-[#00FFAA]' : 'text-[#FF6B6B]'
              }`}>
                {(report.comparison?.differences?.sleep || 0) > 0 ? '+' : ''}{(report.comparison?.differences?.sleep || 0).toFixed(1)}%
              </p>
            </div>
            <div className="text-center p-4 bg-[#22252D] rounded-lg border border-[#2A2D33]">
              <TrendingUp className="h-5 w-5 text-[#4FB3FF] mx-auto mb-2" />
              <p className="font-medium text-white">XP</p>
              <p className={`text-lg font-bold ${
                (report.comparison?.differences?.xp || 0) > 0 ? 'text-[#00FFAA]' : 'text-[#FF6B6B]'
              }`}>
                {(report.comparison?.differences?.xp || 0) > 0 ? '+' : ''}{(report.comparison?.differences?.xp || 0).toFixed(1)}%
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default WeeklyReportView;