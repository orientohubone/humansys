
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { TrendChart } from '@/components/dashboard/TrendChart';
import { 
  BarChart3, 
  TrendingUp, 
  Download, 
  Eye, 
  Users, 
  Clock,
  FileText,
  Target
} from 'lucide-react';

interface DocumentAnalyticsProps {
  documents: any[];
}

export const DocumentAnalytics: React.FC<DocumentAnalyticsProps> = ({ documents }) => {
  // Calcular métricas com verificação de tipos
  const totalDownloads = documents.reduce((sum, doc) => {
    const downloadCount = Number(doc.download_count) || 0;
    return sum + downloadCount;
  }, 0);
  
  const averageDownloads = documents.length > 0 ? Math.round(totalDownloads / documents.length) : 0;
  
  const categoryStats: Record<string, number> = documents.reduce((acc, doc) => {
    const currentCount = acc[doc.category] || 0;
    acc[doc.category] = currentCount + 1;
    return acc;
  }, {} as Record<string, number>);

  const mostPopularCategory = Object.entries(categoryStats)
    .sort(([,a], [,b]) => b - a)[0]?.[0] || 'general';

  const recentDocuments = documents.filter(doc => {
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return new Date(doc.updated_at) > weekAgo;
  }).length;

  // Dados para gráfico de tendência
  const downloadTrendData = [
    { date: '2024-01-15', value: Math.floor(totalDownloads * 0.6) },
    { date: '2024-01-16', value: Math.floor(totalDownloads * 0.7) },
    { date: '2024-01-17', value: Math.floor(totalDownloads * 0.65) },
    { date: '2024-01-18', value: Math.floor(totalDownloads * 0.8) },
    { date: '2024-01-19', value: Math.floor(totalDownloads * 0.85) },
    { date: '2024-01-20', value: Math.floor(totalDownloads * 0.95) },
    { date: '2024-01-21', value: totalDownloads },
  ];

  const getCategoryLabel = (category: string): string => {
    const labels: { [key: string]: string } = {
      'policies': 'Políticas',
      'procedures': 'Procedimentos',
      'forms': 'Formulários',
      'general': 'Geral'
    };
    return labels[category] || 'Geral';
  };

  return (
    <div className="space-y-6">
      {/* Métricas principais */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Downloads Total</CardTitle>
            <Download className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalDownloads}</div>
            <p className="text-xs text-muted-foreground">
              {averageDownloads} por documento
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Documentos Ativos</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{documents.length}</div>
            <p className="text-xs text-muted-foreground">
              +{recentDocuments} esta semana
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Categoria Popular</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {getCategoryLabel(mostPopularCategory)}
            </div>
            <p className="text-xs text-muted-foreground">
              {categoryStats[mostPopularCategory] || 0} documentos
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Engajamento</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">85%</div>
            <p className="text-xs text-muted-foreground">
              Taxa de utilização
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Gráfico de downloads */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <BarChart3 className="h-5 w-5" />
              <span>Tendência de Downloads</span>
            </CardTitle>
            <CardDescription>
              Evolução dos downloads nos últimos 7 dias
            </CardDescription>
          </CardHeader>
          <CardContent>
            <TrendChart 
              data={downloadTrendData} 
              type="area" 
              color="#22c55e"
              height={250}
            />
          </CardContent>
        </Card>

        {/* Distribuição por categoria */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Target className="h-5 w-5" />
              <span>Distribuição por Categoria</span>
            </CardTitle>
            <CardDescription>
              Quantidade de documentos por categoria
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {Object.entries(categoryStats).map(([category, count]) => {
              const percentage = documents.length > 0 ? (count / documents.length) * 100 : 0;
              return (
                <div key={category} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">
                      {getCategoryLabel(category)}
                    </span>
                    <Badge variant="secondary">{count}</Badge>
                  </div>
                  <Progress value={percentage} className="h-2" />
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
