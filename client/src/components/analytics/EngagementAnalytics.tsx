
import React, { memo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { TrendChart } from '@/components/dashboard/TrendChart';
import { 
  Users, 
  Heart, 
  MessageSquare, 
  Target,
  TrendingUp,
  Award
} from 'lucide-react';
import { useEngagementMetrics } from '@/hooks/useEngagementMetrics';

export const EngagementAnalytics: React.FC = memo(() => {
  const { metrics, departmentScores, trends } = useEngagementMetrics();

  return (
    <div className="space-y-4 xs:space-y-6">
      {/* Métricas de Engajamento */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 xs:gap-4">
        <Card className="bg-white dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-3 xs:p-4">
            <CardTitle className="text-xs xs:text-sm font-medium text-gray-900 dark:text-white">Score Geral</CardTitle>
            <Heart className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent className="p-3 xs:p-4">
            <div className="text-xl xs:text-2xl font-bold text-green-600 dark:text-green-400">84%</div>
            <p className="text-xs text-muted-foreground dark:text-gray-400">
              +5% vs anterior
            </p>
            <Progress value={84} className="mt-2 h-2" />
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-3 xs:p-4">
            <CardTitle className="text-xs xs:text-sm font-medium text-gray-900 dark:text-white">Participação</CardTitle>
            <Users className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent className="p-3 xs:p-4">
            <div className="text-xl xs:text-2xl font-bold text-blue-600 dark:text-blue-400">92%</div>
            <p className="text-xs text-muted-foreground dark:text-gray-400">
              Do mês
            </p>
            <Progress value={92} className="mt-2 h-2" />
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-3 xs:p-4">
            <CardTitle className="text-xs xs:text-sm font-medium text-gray-900 dark:text-white">Feedback +</CardTitle>
            <MessageSquare className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent className="p-3 xs:p-4">
            <div className="text-xl xs:text-2xl font-bold text-green-600 dark:text-green-400">78%</div>
            <p className="text-xs text-muted-foreground dark:text-gray-400">
              Satisfação
            </p>
            <Progress value={78} className="mt-2 h-2" />
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-3 xs:p-4">
            <CardTitle className="text-xs xs:text-sm font-medium text-gray-900 dark:text-white">Metas</CardTitle>
            <Target className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent className="p-3 xs:p-4">
            <div className="text-xl xs:text-2xl font-bold text-purple-600 dark:text-purple-400">67%</div>
            <p className="text-xs text-muted-foreground dark:text-gray-400">
              Concluídas
            </p>
            <Progress value={67} className="mt-2 h-2" />
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 xs:gap-6 md:grid-cols-2">
        {/* Evolução do Engajamento */}
        <Card className="bg-white dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800">
          <CardHeader className="p-3 xs:p-4">
            <CardTitle className="flex items-center space-x-2 text-base xs:text-lg text-gray-900 dark:text-white">
              <TrendingUp className="h-4 w-4 xs:h-5 xs:w-5" />
              <span>Evolução</span>
            </CardTitle>
            <CardDescription className="text-xs xs:text-sm dark:text-gray-400">
              Tendência últimos 6 meses
            </CardDescription>
          </CardHeader>
          <CardContent className="p-3 xs:p-4">
            <TrendChart 
              data={trends} 
              type="area" 
              color="#22c55e"
              height={250}
            />
          </CardContent>
        </Card>

        {/* Ranking por Departamento */}
        <Card className="bg-white dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800">
          <CardHeader className="p-3 xs:p-4">
            <CardTitle className="flex items-center space-x-2 text-base xs:text-lg text-gray-900 dark:text-white">
              <Award className="h-4 w-4 xs:h-5 xs:w-5" />
              <span>Ranking</span>
            </CardTitle>
            <CardDescription className="text-xs xs:text-sm dark:text-gray-400">
              Score por departamento
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 xs:space-y-3 p-3 xs:p-4">
            {departmentScores.map((dept, index) => (
              <div key={dept.name} className="flex items-center justify-between text-xs xs:text-sm">
                <div className="flex items-center space-x-2 min-w-0">
                  <div className={`w-6 h-6 xs:w-8 xs:h-8 rounded-full flex items-center justify-center text-white font-bold text-xs flex-shrink-0 ${
                    index === 0 ? 'bg-yellow-500' : 
                    index === 1 ? 'bg-gray-400' : 
                    index === 2 ? 'bg-amber-600' : 'bg-slate-500'
                  }`}>
                    {index + 1}
                  </div>
                  <div className="min-w-0">
                    <p className="font-medium truncate text-gray-900 dark:text-white">{dept.name}</p>
                    <p className="text-xs text-muted-foreground dark:text-gray-400">{dept.collaborators}</p>
                  </div>
                </div>
                <div className="text-right flex-shrink-0 ml-2">
                  <p className="font-bold text-gray-900 dark:text-white">{dept.score}%</p>
                  <Badge variant={dept.trend === 'up' ? 'default' : dept.trend === 'down' ? 'destructive' : 'secondary'} className="text-xs">
                    {dept.trend === 'up' ? '+' : dept.trend === 'down' ? '-' : '='}{dept.change}%
                  </Badge>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Análise Detalhada */}
      <Card className="bg-white dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800">
        <CardHeader className="p-3 xs:p-4">
          <CardTitle className="text-base xs:text-lg text-gray-900 dark:text-white">Análise Comportamental</CardTitle>
          <CardDescription className="text-xs xs:text-sm dark:text-gray-400">
            Insights sobre padrões
          </CardDescription>
        </CardHeader>
        <CardContent className="p-3 xs:p-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 xs:gap-4">
            <div className="p-2 xs:p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700/50 rounded-lg">
              <h4 className="font-medium text-blue-800 dark:text-blue-200 mb-1 text-xs xs:text-sm">Padrão</h4>
              <p className="text-xs text-blue-700 dark:text-blue-300">
                Treinamentos: +40% engajamento
              </p>
            </div>
            
            <div className="p-2 xs:p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700/50 rounded-lg">
              <h4 className="font-medium text-green-800 dark:text-green-200 mb-1 text-xs xs:text-sm">Correlação</h4>
              <p className="text-xs text-green-700 dark:text-green-300">
                Feedback: +25% satisfação
              </p>
            </div>
            
            <div className="p-2 xs:p-3 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-700/50 rounded-lg">
              <h4 className="font-medium text-orange-800 dark:text-orange-200 mb-1 text-xs xs:text-sm">Oportunidade</h4>
              <p className="text-xs text-orange-700 dark:text-orange-300">
                Mentoria: -30% turnover
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
});
