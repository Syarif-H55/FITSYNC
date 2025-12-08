'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { getSession } from '@/lib/session';
import Navbar from '@/components/Navbar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import TimelineGroup from '@/components/timeline/TimelineGroup';
import { Button } from '@/components/ui/button';
import { RotateCcw, Filter } from 'lucide-react';
import { format, subDays } from 'date-fns';

interface TimelineEvent {
  timestamp: Date;
  type: 'meal' | 'sleep' | 'activity' | 'hydration' | 'mood';
  title: string;
  description: string;
  calories?: number;
  duration?: number;
  quality?: number;
  intensity?: number;
}

interface TimelineDay {
  date: Date;
  events: TimelineEvent[];
}

export default function TimelinePage() {
  const { data: session } = useSession();
  const [timelineData, setTimelineData] = useState<TimelineDay[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [filteredType, setFilteredType] = useState<string | null>(null);

  useEffect(() => {
    fetchTimelineData();
  }, []);

  const fetchTimelineData = async () => {
    try {
      setLoading(true);
      setError(null);

      let userId = 'default_user';
      if (session && session.user) {
        // Use the same userId format as data entry pages (activities, meals, sleep)
        // Prioritize session.username to match how data is stored
        const userWithUsername = session.user as any;
        userId = userWithUsername.username || session.user.email || session.user.name || 'default_user';
      } else {
        const fallbackSession = getSession();
        userId = fallbackSession?.username || 'default_user';
      }

      // Fetch timeline events from unified aggregator
      const { getInsightsData } = await import('@/lib/storage/unified-aggregator-wrapper');
      const insightsData = await getInsightsData(userId);
      
      // Transform data into timeline format
      const timelineEvents: TimelineEvent[] = [];

      // Add sleep events
      if (insightsData?.recentSleep) {
        insightsData.recentSleep.forEach((sleep: any) => {
          timelineEvents.push({
            timestamp: new Date(sleep.timestamp),
            type: 'sleep',
            title: 'Sleep Session',
            description: `Duration: ${sleep.metrics.duration / 60} hours, Quality: ${sleep.metrics.quality}`,
            duration: sleep.metrics.duration,
            quality: sleep.metrics.quality
          });
        });
      }

      // Add meal events
      if (insightsData?.recentMeals) {
        insightsData.recentMeals.forEach((meal: any) => {
          timelineEvents.push({
            timestamp: new Date(meal.timestamp),
            type: 'meal',
            title: meal.name || 'Meal Logged',
            description: meal.category || 'Food',
            calories: meal.metrics.calories
          });
        });
      }

      // Add activity events
      if (insightsData?.recentActivities) {
        insightsData.recentActivities.forEach((activity: any) => {
          timelineEvents.push({
            timestamp: new Date(activity.timestamp),
            type: 'activity',
            title: activity.category || 'Activity',
            description: activity.metadata?.aiInsights?.[0] || 'Workout session',
            duration: activity.metrics.duration,
            intensity: activity.metrics.intensity,
            calories: activity.metrics.calories
          });
        });
      }

      // Sort events by timestamp (newest first)
      timelineEvents.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

      // Group events by date
      const groupedEvents: { [key: string]: TimelineEvent[] } = {};
      timelineEvents.forEach(event => {
        const dateKey = new Date(event.timestamp).toISOString().split('T')[0];
        if (!groupedEvents[dateKey]) {
          groupedEvents[dateKey] = [];
        }
        groupedEvents[dateKey].push(event);
      });

      // Convert to TimelineDay array
      const timelineDays: TimelineDay[] = Object.entries(groupedEvents).map(([date, events]) => ({
        date: new Date(date),
        events: events.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      }));

      // Sort days by date (newest first)
      timelineDays.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

      setTimelineData(timelineDays);
    } catch (err) {
      console.error('Error fetching timeline data:', err);
      setError('Failed to load timeline data');
      // Set empty data to show empty state
      setTimelineData([]);
    } finally {
      setLoading(false);
    }
  };

  // Filter events by type if filter is applied
  const filteredTimelineData = filteredType
    ? timelineData.map(day => ({
        ...day,
        events: day.events.filter(event => event.type === filteredType)
      })).filter(day => day.events.length > 0)
    : timelineData;

  const eventTypes = [
    { type: 'meal', label: 'Meals', icon: '🍽️' },
    { type: 'sleep', label: 'Sleep', icon: '😴' },
    { type: 'activity', label: 'Activities', icon: '🏃' },
    { type: 'hydration', label: 'Hydration', icon: '💧' },
    { type: 'mood', label: 'Mood', icon: '😊' }
  ];

  return (
    <div className="min-h-screen bg-[#0E0E12] text-white">
      <Navbar />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white">Progress Timeline</h1>
          <p className="text-[#A0A3A8]">Chronological view of your wellness activities</p>
        </div>

        {/* Filters */}
        <div className="mb-6 flex flex-wrap gap-2">
          <Button
            variant={filteredType === null ? 'default' : 'outline'}
            onClick={() => setFilteredType(null)}
            className="flex items-center gap-2"
          >
            <RotateCcw className="h-4 w-4" />
            All Events
          </Button>
          
          {eventTypes.map((eventType) => (
            <Button
              key={eventType.type}
              variant={filteredType === eventType.type ? 'default' : 'outline'}
              onClick={() => setFilteredType(eventType.type)}
              className="flex items-center gap-2"
            >
              {eventType.icon} {eventType.label}
            </Button>
          ))}
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="text-[#A0A3A8]">Loading timeline...</div>
          </div>
        ) : error ? (
          <Card className="bg-[#1C1F26] border-[#2A2D33]">
            <CardContent className="p-8 text-center">
              <p className="text-[#FF6B6B] mb-4">{error}</p>
              <Button onClick={fetchTimelineData} className="bg-[#00FFAA] text-[#0E0E12]">
                <RotateCcw className="h-4 w-4 mr-2" />
                Retry
              </Button>
            </CardContent>
          </Card>
        ) : filteredTimelineData.length === 0 ? (
          <Card className="bg-[#1C1F26] border-[#2A2D33]">
            <CardContent className="p-8 text-center">
              <p className="text-[#A0A3A8] mb-4">No activities logged yet</p>
              <p className="text-sm text-[#8B949E]">
                Start tracking your meals, activities, and sleep to see your progress timeline
              </p>
            </CardContent>
          </Card>
        ) : (
          <div>
            {filteredTimelineData.map((day, index) => (
              <TimelineGroup
                key={`${day.date.toISOString()}-${index}`}
                date={day.date}
                events={day.events}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}