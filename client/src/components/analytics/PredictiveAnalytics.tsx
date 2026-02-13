
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { TrendChart } from '@/components/dashboard/TrendChart';
import { 
  Brain, 
  TrendingUp, 
  TrendingDown, 
  Users, 
  AlertTriangle,
  Target,
  Zap
} from 'lucide-react';
import { usePredictiveAnalytics } from '@/hooks/usePredictiveAnalytics';

export const PredictiveAnalytics: React.FC = () => {
  const { predictions, trends, risks } = usePredictiveAnalytics();

  return (
    <div className="space-y-4 xs:space-y-6">
      {/* Previsões Principais */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 xs:gap-4">
        <Card className="bg-white dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-3 xs:p-4">
            <CardTitle className="text-xs xs:text-sm font-medium text-gray-900 dark:text-white">Risco de Turnover</CardTitle>
            <AlertTriangle className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent className="p-3 xs:p-4">
            <div className="text-xl xs:text-2xl font-bold text-orange-600 dark:text-orange-400">15%</div>
            <p className="text-xs text-muted-foreground dark:text-gray-400">
              3 em risco alto
            </p>
            <Progress value={15} className="mt-2 h-2" />
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-3 xs:p-4">
            <CardTitle className="text-xs xs:text-sm font-medium text-gray-900 dark:text-white">Performance Prevista</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent className="p-3 xs:p-4">
            <div className="text-xl xs:text-2xl font-bold text-green-600 dark:text-green-400">+12%</div>
            <p className="text-xs text-muted-foreground dark:text-gray-400">
              Próximos 3 meses
            </p>
            <Progress value={75} className="mt-2 h-2" />
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-3 xs:p-4">
            <CardTitle className="text-xs xs:text-sm font-medium text-gray-900 dark:text-white">Demanda Treinamento</CardTitle>
            <Target className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent className="p-3 xs:p-4">
            <div className="text-xl xs:text-2xl font-bold text-blue-600 dark:text-blue-400">68</div>
            <p className="text-xs text-muted-foreground dark:text-gray-400">
              Inscrições este mês
            </p>
            <Progress value={68} className="mt-2 h-2" />
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-3 xs:p-4">
            <CardTitle className="text-xs xs:text-sm font-medium text-gray-900 dark:text-white">Score de IA</CardTitle>
            <Brain className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent className="p-3 xs:p-4">
            <div className="text-xl xs:text-2xl font-bold text-purple-600 dark:text-purple-400">87%</div>
            <p className="text-xs text-muted-foreground dark:text-gray-400">
              Precisão
            </p>
            <Progress value={87} className="mt-2 h-2" />
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 xs:gap-6 md:grid-cols-2">
        {/* Análise de Tendências */}
        <Card className="bg-white dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800">
          <CardHeader className="p-3 xs:p-4">
            <CardTitle className="flex items-center space-x-2 text-base xs:text-lg text-gray-900 dark:text-white">
              <TrendingUp className="h-4 w-4 xs:h-5 xs:w-5" />
              <span>Tendências Preditivas</span>
            </CardTitle>
            <CardDescription className="text-xs xs:text-sm dark:text-gray-400">
              Projeções baseadas em padrões
            </CardDescription>
          </CardHeader>
          <CardContent className="p-3 xs:p-4">
            <TrendChart 
              data={trends} 
              type="line" 
              color="#10b981"
              height={250}
            />
          </CardContent>
        </Card>

        {/* Insights Automáticos */}
        <Card className="bg-white dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800">
          <CardHeader className="p-3 xs:p-4">
            <CardTitle className="flex items-center space-x-2 text-base xs:text-lg text-gray-900 dark:text-white">
              <Zap className="h-4 w-4 xs:h-5 xs:w-5" />
              <span>Insights Automáticos</span>
            </CardTitle>
            <CardDescription className="text-xs xs:text-sm dark:text-gray-400">
              Descobertas geradas pela IA
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 xs:space-y-3 p-3 xs:p-4">
            <div className="p-2 xs:p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700/50 rounded-lg">
              <div className="flex items-center space-x-2 mb-1 xs:mb-2">
                <TrendingUp className="h-3 w-3 xs:h-4 xs:w-4 text-green-600 dark:text-green-400" />
                <span className="font-medium text-green-800 dark:text-green-200 text-xs xs:text-sm">Oportunidade</span>
              </div>
              <p className="text-xs text-green-700 dark:text-green-300">
                TI: +23% engajamento treinamentos
              </p>
            </div>

            <div className="p-2 xs:p-3 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-700/50 rounded-lg">
              <div className="flex items-center space-x-2 mb-1 xs:mb-2">
                <AlertTriangle className="h-3 w-3 xs:h-4 xs:w-4 text-orange-600 dark:text-orange-400" />
                <span className="font-medium text-orange-800 dark:text-orange-200 text-xs xs:text-sm">Atenção</span>
              </div>
              <p className="text-xs text-orange-700 dark:text-orange-300">
                Onboarding: -15% conclusões
              </p>
            </div>

            <div className="p-2 xs:p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700/50 rounded-lg">
              <div className="flex items-center space-x-2 mb-1 xs:mb-2">
                <Brain className="h-3 w-3 xs:h-4 xs:w-4 text-blue-600 dark:text-blue-400" />
                <span className="font-medium text-blue-800 dark:text-blue-200 text-xs xs:text-sm">Padrão</span>
              </div>
              <p className="text-xs text-blue-700 dark:text-blue-300">
                Feedback regular: -34% turnover
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recomendações Baseadas em IA */}
      <Card className="bg-white dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800">
        <CardHeader className="p-3 xs:p-4">
          <CardTitle className="flex items-center space-x-2 text-base xs:text-lg text-gray-900 dark:text-white">
            <Target className="h-4 w-4 xs:h-5 xs:w-5" />
            <span>Recomendações</span>
          </CardTitle>
          <CardDescription className="text-xs xs:text-sm dark:text-gray-400">
            Ações sugeridas pela IA
          </CardDescription>
        </CardHeader>
        <CardContent className="p-3 xs:p-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 xs:gap-4">
            {predictions.recommendations?.map((rec, index) => (
              <div key={index} className="p-2 xs:p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:shadow-md dark:hover:shadow-lg/50 transition-shadow bg-white dark:bg-gray-800/50">
                <div className="flex items-center justify-between gap-1 mb-1 xs:mb-2">
                  <Badge variant={rec.priority === 'high' ? 'destructive' : rec.priority === 'medium' ? 'default' : 'secondary'} className="text-xs">
                    {rec.priority === 'high' ? 'Alta' : rec.priority === 'medium' ? 'Média' : 'Baixa'}
                  </Badge>
                  <span className="text-xs text-muted-foreground dark:text-gray-400">{rec.impact}%</span>
                </div>
                <h4 className="font-medium text-xs xs:text-sm text-gray-900 dark:text-white mb-1">{rec.title}</h4>
                <p className="text-xs text-muted-foreground dark:text-gray-400">{rec.description}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
