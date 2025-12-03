import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';

interface TrendDataPoint {
  date: string;
  value: number;
}

interface TrendAnalysis {
  metric: string;
  data: TrendDataPoint[];
  trend: 'up' | 'down' | 'stable';
  change: number;
  description: string;
}

interface TrendAnalyzerProps {
  trends: TrendAnalysis[];
}

const TrendAnalyzer = ({ trends }: TrendAnalyzerProps) => {
  return (
    <Card className="bg-[#1C1F26] border-[#2A2D33] rounded-2xl shadow-md transition-all duration-200">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <span className="text-[#4FB3FF]">📈</span>
          Trend Analysis
        </CardTitle>
      </CardHeader>
      <CardContent>
        {trends.length === 0 ? (
          <div className="text-center py-8 text-[#8B949E]">
            No trend data available
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {trends.map((trend, index) => (
              <div key={index} className="p-4 bg-[#22252D] rounded-lg border border-[#2A2D33]">
                <div className="flex justify-between items-center mb-3">
                  <h4 className="font-medium text-white capitalize">{trend.metric}</h4>
                  <span className={`text-sm font-medium ${
                    trend.trend === 'up' ? 'text-[#00FFAA]' :
                    trend.trend === 'down' ? 'text-[#FF6B6B]' : 'text-[#A0A3A8]'
                  }`}>
                    {trend.trend === 'up' ? '↗' : trend.trend === 'down' ? '↘' : '→'} {trend.change.toFixed(1)}%
                  </span>
                </div>

                <div className="h-24">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={trend.data}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#2A2D33" />
                      <XAxis
                        dataKey="date"
                        tick={{ fontSize: 10, fill: '#8B949E' }}
                        axisLine={false}
                        tickLine={false}
                      />
                      <YAxis
                        domain={['auto', 'auto']}
                        tick={{ fontSize: 10, fill: '#8B949E' }}
                        axisLine={false}
                        tickLine={false}
                        width={30}
                      />
                      <Line
                        type="monotone"
                        dataKey="value"
                        stroke={
                          trend.trend === 'up' ? '#00FFAA' :
                          trend.trend === 'down' ? '#FF6B6B' : '#A0A3A8'
                        }
                        strokeWidth={2}
                        dot={false}
                        activeDot={{ r: 4, fill: '#4FB3FF' }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                <p className="text-sm text-[#8B949E] mt-2">{trend.description}</p>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TrendAnalyzer;