'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Activity, Utensils, Moon, Footprints, Droplets, HeartPulse } from 'lucide-react';
import { format } from 'date-fns';

interface TimelineEventProps {
  timestamp: Date;
  type: 'meal' | 'sleep' | 'activity' | 'hydration' | 'mood';
  title: string;
  description: string;
  calories?: number;
  duration?: number;
  quality?: number;
  intensity?: number;
}

const TimelineEvent = ({ 
  timestamp, 
  type, 
  title, 
  description, 
  calories,
  duration,
  quality,
  intensity
}: TimelineEventProps) => {
  const getEventTypeIcon = () => {
    switch (type) {
      case 'meal': return <Utensils className="h-5 w-5 text-[#00FFAA]" />;
      case 'sleep': return <Moon className="h-5 w-5 text-[#7C3AED]" />;
      case 'activity': return <Activity className="h-5 w-5 text-[#4FB3FF]" />;
      case 'hydration': return <Droplets className="h-5 w-5 text-[#3498DB]" />;
      case 'mood': return <HeartPulse className="h-5 w-5 text-[#E74C3C]" />;
      default: return <Activity className="h-5 w-5 text-[#A0A3A8]" />;
    }
  };

  const getEventTypeColor = () => {
    switch (type) {
      case 'meal': return 'border-[#00FFAA]/30 bg-[#00FFAA]/10';
      case 'sleep': return 'border-[#7C3AED]/30 bg-[#7C3AED]/10';
      case 'activity': return 'border-[#4FB3FF]/30 bg-[#4FB3FF]/10';
      case 'hydration': return 'border-[#3498DB]/30 bg-[#3498DB]/10';
      case 'mood': return 'border-[#E74C3C]/30 bg-[#E74C3C]/10';
      default: return 'border-[#A0A3A8]/30 bg-[#A0A3A8]/10';
    }
  };

  return (
    <Card className={`border-l-4 border-l-[#00FFAA] bg-[#22252D] rounded-lg shadow-sm mb-4 ${getEventTypeColor()}`}>
      <CardContent className="p-4">
        <div className="flex items-start">
          <div className="mr-3 mt-1 text-[#00FFAA]">
            {getEventTypeIcon()}
          </div>
          <div className="flex-1">
            <div className="flex justify-between items-start">
              <h3 className="font-semibold text-white">{title}</h3>
              <span className="text-xs text-[#A0A3A8]">
                {format(new Date(timestamp), 'HH:mm')}
              </span>
            </div>
            <p className="text-sm text-[#E4E6EB] mt-1">{description}</p>
            
            <div className="flex flex-wrap gap-2 mt-2 text-xs">
              {calories !== undefined && (
                <span className="bg-[#2A2D33] px-2 py-1 rounded text-[#00FFAA]">
                  {calories} kcal
                </span>
              )}
              {duration !== undefined && (
                <span className="bg-[#2A2D33] px-2 py-1 rounded text-[#4FB3FF]">
                  {duration} min
                </span>
              )}
              {quality !== undefined && (
                <span className="bg-[#2A2D33] px-2 py-1 rounded text-[#7C3AED]">
                  Quality: {quality}/5
                </span>
              )}
              {intensity !== undefined && (
                <span className="bg-[#2A2D33] px-2 py-1 rounded text-[#FFA726]">
                  Intensity: {intensity}/10
                </span>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TimelineEvent;