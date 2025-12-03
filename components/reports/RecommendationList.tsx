import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/Badge';

interface Recommendation {
  category: 'activity' | 'nutrition' | 'sleep' | 'recovery';
  priority: 'high' | 'medium' | 'low';
  description: string;
  target: string;
}

interface RecommendationListProps {
  recommendations: Recommendation[];
}

const RecommendationList = ({ recommendations }: RecommendationListProps) => {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'medium': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'low': return 'bg-green-500/20 text-green-400 border-green-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'activity': return '🏃';
      case 'nutrition': return '🥗';
      case 'sleep': return '😴';
      case 'recovery': return '💆';
      default: return '📋';
    }
  };

  return (
    <Card className="bg-[#1C1F26] border-[#2A2D33] rounded-2xl shadow-md transition-all duration-200">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <span className="text-[#00FFAA]">🎯</span>
          Recommendations
        </CardTitle>
      </CardHeader>
      <CardContent>
        {recommendations.length === 0 ? (
          <div className="text-center py-4 text-[#8B949E]">
            No recommendations available
          </div>
        ) : (
          <div className="space-y-4">
            {recommendations.map((rec, index) => (
              <div 
                key={index} 
                className="p-4 bg-[#22252D] rounded-lg border border-[#2A2D33] hover:bg-[#2A2D33] transition-colors"
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-2">
                    <span>{getCategoryIcon(rec.category)}</span>
                    <span className="font-medium text-white">{rec.description}</span>
                  </div>
                  <Badge
                    variant="outline"
                    className={`border ${getPriorityColor(rec.priority)}`}
                  >
                    {rec.priority}
                  </Badge>
                </div>
                <div className="text-sm text-[#A0A3A8] mt-2">
                  <span className="font-medium">Target:</span> {rec.target}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RecommendationList;