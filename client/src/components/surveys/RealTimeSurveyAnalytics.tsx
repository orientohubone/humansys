
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { SurveyAnalytics, Survey } from '@/types/surveys';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { Users, Clock, TrendingUp, MessageSquare, ThumbsUp, ThumbsDown, Minus } from 'lucide-react';

interface RealTimeSurveyAnalyticsProps {
  survey: Survey;
  analytics: SurveyAnalytics;
  isLive?: boolean;
}

export const RealTimeSurveyAnalytics: React.FC<RealTimeSurveyAnalyticsProps> = ({
  survey,
  analytics,
  isLive = false
}) => {
  const [liveData, setLiveData] = useState(analytics);
  const [isUpdating, setIsUpdating] = useState(false);

  // Simular atualizações em tempo real
  useEffect(() => {
    if (!isLive) return;

    const interval = setInterval(() => {
      setIsUpdating(true);
      
      // Simular novos dados chegando
      setLiveData(prev => ({
        ...prev,
        total_responses: prev.total_responses + Math.floor(Math.random() * 3),
        completion_rate: Math.min(prev.completion_rate + Math.random() * 2, 100),
        real_time_responses: [
          ...prev.real_time_responses.slice(-10),
          {
            id: Date.now().toString(),
            survey_id: survey.id,
            answers: [],
            completed_at: new Date().toISOString()
          }
        ]
      }));

      setTimeout(() => setIsUpdating(false), 500);
    }, 5000);

    return () => clearInterval(interval);
  }, [isLive, survey.id]);

  const sentimentData = [
    { name: 'Positivo', value: liveData.sentiment_analysis.positive, color: '#10b981' },
    { name: 'Neutro', value: liveData.sentiment_analysis.neutral, color: '#6b7280' },
    { name: 'Negativo', value: liveData.sentiment_analysis.negative, color: '#ef4444' }
  ];

  const getSentimentIcon = (type: string) => {
    switch (type) {
      case 'positive': return ThumbsUp;
      case 'negative': return ThumbsDown;
      default: return Minus;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header com Status */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">{survey.title}</h2>
          <p className="text-muted-foreground">Análise em tempo real</p>
        </div>
        <div className="flex items-center gap-2">
          {isLive && (
            <Badge variant={isUpdating ? "default" : "secondary"} className="animate-pulse">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
              {isUpdating ? 'Atualizando...' : 'Ao vivo'}
            </Badge>
          )}
          <Badge variant="outline">
            {survey.status === 'active' ? 'Ativa' : 'Finalizada'}
          </Badge>
        </div>
      </div>

      {/* KPIs Principais */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className={isUpdating ? 'ring-2 ring-blue-500 transition-all' : ''}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Respostas</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{liveData.total_responses}</div>
            <p className="text-xs text-muted-foreground">
              {liveData.real_time_responses.length} nas últimas horas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taxa de Conclusão</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{liveData.completion_rate.toFixed(1)}%</div>
            <Progress value={liveData.completion_rate} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tempo Médio</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Math.round(liveData.average_completion_time / 60)}min</div>
            <p className="text-xs text-muted-foreground">
              Para completar a pesquisa
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sentimento Geral</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {Math.round((liveData.sentiment_analysis.positive / (liveData.sentiment_analysis.positive + liveData.sentiment_analysis.neutral + liveData.sentiment_analysis.negative)) * 100)}%
            </div>
            <p className="text-xs text-muted-foreground">Respostas positivas</p>
          </CardContent>
        </Card>
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Tendência de Respostas */}
        <Card>
          <CardHeader>
            <CardTitle>Tendência de Respostas</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={liveData.response_trends}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="count" 
                  stroke="#3b82f6" 
                  strokeWidth={2}
                  dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Análise de Sentimento */}
        <Card>
          <CardHeader>
            <CardTitle>Análise de Sentimento</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-center mb-4">
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={sentimentData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {sentimentData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            
            <div className="space-y-2">
              {sentimentData.map((item) => {
                const Icon = getSentimentIcon(item.name.toLowerCase());
                return (
                  <div key={item.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Icon className="h-4 w-4" style={{ color: item.color }} />
                      <span className="text-sm">{item.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: item.color }}
                      ></div>
                      <span className="text-sm font-medium">{item.value}%</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Respostas Recentes */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            Atividade Recente
            {isLive && (
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {liveData.real_time_responses.slice(-5).map((response) => (
              <div key={response.id} className="flex items-center justify-between p-2 bg-muted/50 rounded">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-sm">Nova resposta recebida</span>
                </div>
                <span className="text-xs text-muted-foreground">
                  {new Date(response.completed_at).toLocaleTimeString('pt-BR')}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
