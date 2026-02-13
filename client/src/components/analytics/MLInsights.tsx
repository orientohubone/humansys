
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { TrendChart } from '@/components/dashboard/TrendChart';
import { 
  Brain, 
  Target, 
  TrendingUp, 
  Users,
  Lightbulb,
  Zap
} from 'lucide-react';

export const MLInsights: React.FC = () => {
  const predictionData = [
    { date: '2024-02-01', value: 78, prediction: true },
    { date: '2024-02-15', value: 82, prediction: true },
    { date: '2024-03-01', value: 85, prediction: true },
    { date: '2024-03-15', value: 88, prediction: true },
    { date: '2024-04-01', value: 91, prediction: true },
    { date: '2024-04-15', value: 89, prediction: true }
  ];

  const clusters = [
    {
      name: 'Grupo Alto Performance',
      size: 23,
      characteristics: ['Alta produtividade', 'Engajamento alto', 'Baixo risco turnover'],
      color: 'bg-green-500'
    },
    {
      name: 'Grupo Em Desenvolvimento',
      size: 31,
      characteristics: ['Performance média', 'Potencial de crescimento', 'Necessita mentoria'],
      color: 'bg-blue-500'
    },
    {
      name: 'Grupo Risco',
      size: 12,
      characteristics: ['Baixo engajamento', 'Performance inconsistente', 'Alto risco turnover'],
      color: 'bg-red-500'
    }
  ];

  return (
    <div className="space-y-4 xs:space-y-6">
      {/* Métricas de ML */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 xs:gap-4">
        <Card className="bg-white dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-3 xs:p-4">
            <CardTitle className="text-xs xs:text-sm font-medium text-gray-900 dark:text-white">Precisão</CardTitle>
            <Brain className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent className="p-3 xs:p-4">
            <div className="text-xl xs:text-2xl font-bold text-purple-600 dark:text-purple-400">91.2%</div>
            <p className="text-xs text-muted-foreground dark:text-gray-400">
              Previsões
            </p>
            <Progress value={91} className="mt-2 h-2" />
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-3 xs:p-4">
            <CardTitle className="text-xs xs:text-sm font-medium text-gray-900 dark:text-white">Padrões</CardTitle>
            <Target className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent className="p-3 xs:p-4">
            <div className="text-xl xs:text-2xl font-bold text-blue-600 dark:text-blue-400">47</div>
            <p className="text-xs text-muted-foreground dark:text-gray-400">
              Correlações
            </p>
            <Progress value={78} className="mt-2 h-2" />
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-3 xs:p-4">
            <CardTitle className="text-xs xs:text-sm font-medium text-gray-900 dark:text-white">Insights</CardTitle>
            <Lightbulb className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent className="p-3 xs:p-4">
            <div className="text-xl xs:text-2xl font-bold text-yellow-600 dark:text-yellow-400">23</div>
            <p className="text-xs text-muted-foreground dark:text-gray-400">
              Esta semana
            </p>
            <Progress value={85} className="mt-2 h-2" />
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-3 xs:p-4">
            <CardTitle className="text-xs xs:text-sm font-medium text-gray-900 dark:text-white">Automação</CardTitle>
            <Zap className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent className="p-3 xs:p-4">
            <div className="text-xl xs:text-2xl font-bold text-green-600 dark:text-green-400">94%</div>
            <p className="text-xs text-muted-foreground dark:text-gray-400">
              Processos
            </p>
            <Progress value={94} className="mt-2 h-2" />
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 xs:gap-6 md:grid-cols-2">
        {/* Previsões Futuras */}
        <Card className="bg-white dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800">
          <CardHeader className="p-3 xs:p-4">
            <CardTitle className="flex items-center space-x-2 text-base xs:text-lg text-gray-900 dark:text-white">
              <TrendingUp className="h-4 w-4 xs:h-5 xs:w-5" />
              <span>Previsões 6M</span>
            </CardTitle>
            <CardDescription className="text-xs xs:text-sm dark:text-gray-400">
              Machine learning
            </CardDescription>
          </CardHeader>
          <CardContent className="p-3 xs:p-4">
            <TrendChart 
              data={predictionData} 
              type="line" 
              color="#8b5cf6"
              height={250}
            />
            <div className="mt-3 p-2 xs:p-3 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-700/50 rounded text-xs xs:text-sm">
              <p className="text-purple-700 dark:text-purple-300">
                <strong>IA:</strong> +15% performance próximos 6M
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Clustering de Colaboradores */}
        <Card className="bg-white dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800">
          <CardHeader className="p-3 xs:p-4">
            <CardTitle className="flex items-center space-x-2 text-base xs:text-lg text-gray-900 dark:text-white">
              <Users className="h-4 w-4 xs:h-5 xs:w-5" />
              <span>Segmentação</span>
            </CardTitle>
            <CardDescription className="text-xs xs:text-sm dark:text-gray-400">
              Agrupamento automático
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 xs:space-y-3 p-3 xs:p-4">
            {clusters.map((cluster, index) => (
              <div key={index} className="p-2 xs:p-3 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800/50">
                <div className="flex items-center justify-between gap-2 mb-1 xs:mb-2">
                  <div className="flex items-center space-x-2 min-w-0">
                    <div className={`w-3 h-3 rounded-full flex-shrink-0 ${cluster.color}`}></div>
                    <h4 className="font-medium text-xs xs:text-sm text-gray-900 dark:text-white truncate">{cluster.name}</h4>
                  </div>
                  <Badge variant="secondary" className="text-xs flex-shrink-0">{cluster.size}</Badge>
                </div>
                <div className="space-y-0.5">
                  {cluster.characteristics.map((char, charIndex) => (
                    <p key={charIndex} className="text-xs text-muted-foreground dark:text-gray-400">
                      • {char}
                    </p>
                  ))}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Descobertas de IA */}
      <Card className="bg-white dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800">
        <CardHeader className="p-3 xs:p-4">
          <CardTitle className="flex items-center space-x-2 text-base xs:text-lg text-gray-900 dark:text-white">
            <Brain className="h-4 w-4 xs:h-5 xs:w-5" />
            <span>Descobertas</span>
          </CardTitle>
          <CardDescription className="text-xs xs:text-sm dark:text-gray-400">
            Insights automáticos
          </CardDescription>
        </CardHeader>
        <CardContent className="p-3 xs:p-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 xs:gap-3">
            <div className="p-2 xs:p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700/50 rounded-lg">
              <div className="flex items-center space-x-2 mb-1 xs:mb-2">
                <Target className="h-3 w-3 xs:h-4 xs:w-4 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                <span className="font-medium text-blue-800 dark:text-blue-200 text-xs xs:text-sm">Correlação</span>
              </div>
              <p className="text-xs text-blue-700 dark:text-blue-300">
                {'>'}3 treinamentos: -40% turnover
              </p>
            </div>

            <div className="p-2 xs:p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700/50 rounded-lg">
              <div className="flex items-center space-x-2 mb-1 xs:mb-2">
                <Lightbulb className="h-3 w-3 xs:h-4 xs:w-4 text-green-600 dark:text-green-400 flex-shrink-0" />
                <span className="font-medium text-green-800 dark:text-green-200 text-xs xs:text-sm">Temporal</span>
              </div>
              <p className="text-xs text-green-700 dark:text-green-300">
                Feedback 2 primeiras semanas: +60%
              </p>
            </div>

            <div className="p-2 xs:p-3 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-700/50 rounded-lg">
              <div className="flex items-center space-x-2 mb-1 xs:mb-2">
                <Brain className="h-3 w-3 xs:h-4 xs:w-4 text-purple-600 dark:text-purple-400 flex-shrink-0" />
                <span className="font-medium text-purple-800 dark:text-purple-200 text-xs xs:text-sm">Comportamental</span>
              </div>
              <p className="text-xs text-purple-700 dark:text-purple-300">
                Perguntas em reuniões: +25% promoção
              </p>
            </div>

            <div className="p-2 xs:p-3 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-700/50 rounded-lg">
              <div className="flex items-center space-x-2 mb-1 xs:mb-2">
                <TrendingUp className="h-3 w-3 xs:h-4 xs:w-4 text-orange-600 dark:text-orange-400 flex-shrink-0" />
                <span className="font-medium text-orange-800 dark:text-orange-200 text-xs xs:text-sm">Otimização</span>
              </div>
              <p className="text-xs text-orange-700 dark:text-orange-300">
                1:1 20-30min: +35% engajamento
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Configurações do Modelo */}
      <Card className="bg-white dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800">
        <CardHeader className="p-3 xs:p-4">
          <CardTitle className="text-base xs:text-lg text-gray-900 dark:text-white">Configurações ML</CardTitle>
          <CardDescription className="text-xs xs:text-sm dark:text-gray-400">
            Parâmetros dos algoritmos
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3 xs:gap-4 md:grid-cols-2 p-3 xs:p-4">
          <div className="space-y-2 xs:space-y-3">
            <div>
              <label className="text-xs xs:text-sm font-medium text-gray-900 dark:text-white">Sensibilidade</label>
              <div className="flex items-center space-x-1 mt-1">
                <span className="text-xs">Baixa</span>
                <Progress value={70} className="flex-1 h-2" />
                <span className="text-xs">Alta</span>
              </div>
            </div>
            
            <div>
              <label className="text-xs xs:text-sm font-medium text-gray-900 dark:text-white">Janela Predição</label>
              <select className="w-full p-2 border rounded text-sm bg-white dark:bg-gray-800 dark:border-gray-700 dark:text-white mt-1">
                <option>30 dias</option>
                <option>90 dias</option>
                <option>6 meses</option>
                <option>1 ano</option>
              </select>
            </div>
          </div>
          
          <div className="space-y-2 xs:space-y-3">
            <div>
              <label className="text-xs xs:text-sm font-medium text-gray-900 dark:text-white">Atualização</label>
              <select className="w-full p-2 border rounded text-sm bg-white dark:bg-gray-800 dark:border-gray-700 dark:text-white mt-1">
                <option>Tempo real</option>
                <option>Diário</option>
                <option>Semanal</option>
                <option>Mensal</option>
              </select>
            </div>
            
            <div>
              <label className="text-xs xs:text-sm font-medium text-gray-900 dark:text-white">Variáveis</label>
              <div className="mt-1 space-y-1">
                {['Performance', 'Engajamento', 'Feedback', 'Treinamentos'].map((variable) => (
                  <label key={variable} className="flex items-center space-x-2">
                    <input type="checkbox" defaultChecked className="rounded" />
                    <span className="text-xs xs:text-sm text-gray-700 dark:text-gray-300">{variable}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
