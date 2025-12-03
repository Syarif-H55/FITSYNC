'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import TimelineEvent from './TimelineEvent';
import { format, isToday, isYesterday, isThisWeek, isThisMonth } from 'date-fns';

interface TimelineGroupProps {
  date: Date;
  events: {
    timestamp: Date;
    type: 'meal' | 'sleep' | 'activity' | 'hydration' | 'mood';
    title: string;
    description: string;
    calories?: number;
    duration?: number;
    quality?: number;
    intensity?: number;
  }[];
}

const TimelineGroup = ({ date, events }: TimelineGroupProps) => {
  const formatDateLabel = (date: Date) => {
    if (isToday(date)) return 'Today';
    if (isYesterday(date)) return 'Yesterday';
    if (isThisWeek(date)) return format(date, 'EEEE');
    if (isThisMonth(date)) return format(date, 'MMMM d');
    return format(date, 'MMMM d, yyyy');
  };

  return (
    <div className="mb-8">
      <div className="text-center mb-4">
        <span className="text-sm font-medium text-[#A0A3A8] bg-[#22252D] px-3 py-1 rounded-full">
          {formatDateLabel(date)}
        </span>
      </div>
      
      <div className="space-y-4">
        {events.map((event, index) => (
          <TimelineEvent
            key={`${event.timestamp.toString()}-${index}`}
            timestamp={event.timestamp}
            type={event.type}
            title={event.title}
            description={event.description}
            calories={event.calories}
            duration={event.duration}
            quality={event.quality}
            intensity={event.intensity}
          />
        ))}
      </div>
    </div>
  );
};

export default TimelineGroup;