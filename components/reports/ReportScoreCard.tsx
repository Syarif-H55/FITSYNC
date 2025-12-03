import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ReportScoreCardProps {
  title: string;
  score: number;
  category: string;
  breakdown: any[];
}

const ReportScoreCard = ({ title, score, category, breakdown }: ReportScoreCardProps) => {
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-[#00FFAA]';
    if (score >= 60) return 'text-[#FFA726]';
    if (score >= 40) return 'text-[#FF9800]';
    return 'text-[#FF6B6B]';
  };

  const getScoreBg = (score: number) => {
    if (score >= 80) return 'bg-[#00FFAA]/10';
    if (score >= 60) return 'bg-[#FFA726]/10';
    if (score >= 40) return 'bg-[#FF9800]/10';
    return 'bg-[#FF6B6B]/10';
  };

  return (
    <Card className={`bg-[#1C1F26] border-[#2A2D33] rounded-2xl shadow-md transition-all duration-200 ${getScoreBg(score)}`}>
      <CardHeader className="pb-2">
        <CardTitle className="text-white flex justify-between items-center">
          <span>{title}</span>
          <span className={`text-2xl font-bold ${getScoreColor(score)}`}>{score}</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {breakdown.map((factor: any, index: number) => (
            <div key={index} className="flex justify-between text-sm">
              <span className="text-[#A0A3A8]">{factor.factor}</span>
              <span className="text-white font-medium">{factor.score}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ReportScoreCard;