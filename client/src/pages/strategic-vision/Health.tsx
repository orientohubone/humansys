import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';

export function Health() {
  const navigate = useNavigate();

  const goBack = () => {
    navigate('/app/founder', { state: { tab: 'strategic-vision' } });
  };

  const healthMetrics = [
    { name: 'Engajamento', value: 78, benchmark: 85 },
    { name: 'Retenção', value: 82, benchmark: 88 },
    { name: 'Produtividade', value: 85, benchmark: 80 },
    { name: 'Inovação', value: 72, benchmark: 75 },
    { name: 'Cultura', value: 88, benchmark: 85 },
    { name: 'Crescimento', value: 76, benchmark: 78 },
  ];

  const trendData = [
    { month: 'Jan', score: 72 },
    { month: 'Fev', score: 74 },
    { month: 'Mar', score: 76 },
    { month: 'Abr', score: 78 },
    { month: 'Mai', score: 80 },
    { month: 'Jun', score: 82 },
  ];

  const overallScore = Math.round(
    healthMetrics.reduce((sum, m) => sum + m.value, 0) / healthMetrics.length
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-green-50/30 to-green-50 dark:from-slate-950 dark:via-green-950/20 dark:to-green-950/20 p-4">
      <div className="container mx-auto max-w-7xl">
        <div className="mb-8 flex items-center gap-4">
          <Button
            variant="outline"
            size="icon"
            onClick={goBack}
            className="dark:border-slate-700"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-4xl font-bold text-emerald-600 dark:text-emerald-400">Monitor de Saúde Organizacional</h1>
        </div>

        <div className="space-y-6">
          {/* Overall Health Score */}
          <Card className="dark:border-slate-700 bg-gradient-to-r from-emerald-50 to-green-50 dark:from-emerald-950/20 dark:to-green-950/20 border-2 border-emerald-300 dark:border-emerald-700">
            <CardContent className="pt-8">
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-2">Score de Saúde Geral</p>
                <p className="text-7xl font-bold text-emerald-600 dark:text-emerald-400">{overallScore}</p>
                <p className="text-lg text-muted-foreground mt-2">/100</p>
                <div className="mt-4 h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-emerald-500 to-green-500 transition-all"
                    style={{ width: `${overallScore}%` }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Health Metrics Comparison */}
          <Card className="dark:border-slate-700">
            <CardHeader>
              <CardTitle>Indicadores Chave</CardTitle>
              <CardDescription>Sua organização vs. Benchmark de Mercado</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={healthMetrics}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="value" name="Seu Score" fill="#059669" />
                  <Bar dataKey="benchmark" name="Benchmark" fill="#9CA3AF" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Trend Over Time */}
          <Card className="dark:border-slate-700">
            <CardHeader>
              <CardTitle>Tendência de Saúde</CardTitle>
              <CardDescription>Últimos 6 meses</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line 
                    type="monotone" 
                    dataKey="score" 
                    stroke="#059669" 
                    strokeWidth={2}
                    name="Score de Saúde"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Detailed Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {healthMetrics.map((metric) => (
              <Card key={metric.name} className="dark:border-slate-700">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold">{metric.name}</h3>
                    <span className={`text-2xl font-bold ${metric.value >= metric.benchmark ? 'text-emerald-600 dark:text-emerald-400' : 'text-orange-600 dark:text-orange-400'}`}>
                      {metric.value}
                    </span>
                  </div>
                  <div className="space-y-2">
                    <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-emerald-500"
                        style={{ width: `${metric.value}%` }}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Benchmark: {metric.benchmark} ({metric.value >= metric.benchmark ? '✓' : '↑'})
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
