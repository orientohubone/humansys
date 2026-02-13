
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { TrendChart } from '@/components/dashboard/TrendChart';
import { 
  BarChart3, 
  Clock, 
  Target, 
  TrendingUp,
  Zap,
  Users
} from 'lucide-react';

export const ProductivityAnalytics: React.FC = () => {
  const productivityData = [
    { date: '2024-01-15', value: 78 },
    { date: '2024-01-16', value: 82 },
    { date: '2024-01-17', value: 85 },
    { date: '2024-01-18', value: 88 },
    { date: '2024-01-19', value: 84 },
    { date: '2024-01-20', value: 90 },
    { date: '2024-01-21', value: 92 }
  ];

  return (
    <div className="space-y-4 xs:space-y-6">
      {/* Métricas de Produtividade */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 xs:gap-4">
        <Card className="bg-white dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-3 xs:p-4">
            <CardTitle className="text-xs xs:text-sm font-medium text-gray-900 dark:text-white">Produtividade</CardTitle>
            <BarChart3 className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent className="p-3 xs:p-4">
            <div className="text-xl xs:text-2xl font-bold text-blue-600 dark:text-blue-400">89%</div>
            <p className="text-xs text-muted-foreground dark:text-gray-400">
              +7% anterior
            </p>
            <Progress value={89} className="mt-2 h-2" />
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-3 xs:p-4">
            <CardTitle className="text-xs xs:text-sm font-medium text-gray-900 dark:text-white">Tempo Médio</CardTitle>
            <Clock className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent className="p-3 xs:p-4">
            <div className="text-xl xs:text-2xl font-bold text-green-600 dark:text-green-400">6.2h</div>
            <p className="text-xs text-muted-foreground dark:text-gray-400">
              Trabalho focado
            </p>
            <Progress value={78} className="mt-2 h-2" />
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-3 xs:p-4">
            <CardTitle className="text-xs xs:text-sm font-medium text-gray-900 dark:text-white">Eficiência</CardTitle>
            <Zap className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent className="p-3 xs:p-4">
            <div className="text-xl xs:text-2xl font-bold text-yellow-600 dark:text-yellow-400">94%</div>
            <p className="text-xs text-muted-foreground dark:text-gray-400">
              Tarefas
            </p>
            <Progress value={94} className="mt-2 h-2" />
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-3 xs:p-4">
            <CardTitle className="text-xs xs:text-sm font-medium text-gray-900 dark:text-white">Colaboração</CardTitle>
            <Users className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent className="p-3 xs:p-4">
            <div className="text-xl xs:text-2xl font-bold text-purple-600 dark:text-purple-400">82%</div>
            <p className="text-xs text-muted-foreground dark:text-gray-400">
              Em equipe
            </p>
            <Progress value={82} className="mt-2 h-2" />
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 xs:gap-6 md:grid-cols-2">
        {/* Gráfico de Tendência */}
        <Card className="bg-white dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800">
          <CardHeader className="p-3 xs:p-4">
            <CardTitle className="flex items-center space-x-2 text-base xs:text-lg text-gray-900 dark:text-white">
              <TrendingUp className="h-4 w-4 xs:h-5 xs:w-5" />
              <span>Tendência Semanal</span>
            </CardTitle>
            <CardDescription className="text-xs xs:text-sm dark:text-gray-400">
              Últimos 7 dias
            </CardDescription>
          </CardHeader>
          <CardContent className="p-3 xs:p-4">
            <TrendChart 
              data={productivityData} 
              type="line" 
              color="#3b82f6"
              height={250}
            />
          </CardContent>
        </Card>

        {/* Top Performers */}
        <Card className="bg-white dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800">
          <CardHeader className="p-3 xs:p-4">
            <CardTitle className="flex items-center space-x-2 text-base xs:text-lg text-gray-900 dark:text-white">
              <Target className="h-4 w-4 xs:h-5 xs:w-5" />
              <span>Top Performers</span>
            </CardTitle>
            <CardDescription className="text-xs xs:text-sm dark:text-gray-400">
              Melhor performance
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 xs:space-y-3 p-3 xs:p-4">
            {[
              { name: 'Maria Santos', score: 96, department: 'TI' },
              { name: 'João Silva', score: 94, department: 'Marketing' },
              { name: 'Ana Costa', score: 92, department: 'Vendas' },
              { name: 'Pedro Oliveira', score: 89, department: 'TI' }
            ].map((performer, index) => (
              <div key={performer.name} className="flex items-center justify-between text-xs xs:text-sm">
                <div className="flex items-center space-x-2 min-w-0">
                  <div className="w-6 h-6 xs:w-8 xs:h-8 bg-primary dark:bg-primary/80 text-primary-foreground rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">
                    {index + 1}
                  </div>
                  <div className="min-w-0">
                    <p className="font-medium truncate text-gray-900 dark:text-white">{performer.name}</p>
                    <p className="text-xs text-muted-foreground dark:text-gray-400">{performer.department}</p>
                  </div>
                </div>
                <Badge variant="secondary" className="text-xs flex-shrink-0 ml-2">{performer.score}%</Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
