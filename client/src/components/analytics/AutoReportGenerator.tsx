
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  FileText, 
  Download, 
  Calendar, 
  Send,
  Settings,
  BarChart3
} from 'lucide-react';

export const AutoReportGenerator: React.FC = () => {
  const reports = [
    {
      id: '1',
      title: 'Relatório Semanal de RH',
      description: 'Resumo executivo das métricas de recursos humanos',
      schedule: 'Toda segunda às 9h',
      lastGenerated: '21/01/2024',
      recipients: ['diretoria@empresa.com', 'rh@empresa.com'],
      status: 'Ativo'
    },
    {
      id: '2',
      title: 'Analytics de Treinamento',
      description: 'Performance e ROI dos programas de capacitação',
      schedule: 'Quinzenal',
      lastGenerated: '15/01/2024',
      recipients: ['treinamento@empresa.com'],
      status: 'Ativo'
    },
    {
      id: '3',
      title: 'Dashboard de Engajamento',
      description: 'Métricas de satisfação e retenção por departamento',
      schedule: 'Mensal',
      lastGenerated: '01/01/2024',
      recipients: ['gestores@empresa.com'],
      status: 'Pausado'
    }
  ];

  return (
    <div className="space-y-4 xs:space-y-6">
      {/* Estatísticas de Relatórios */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 xs:gap-4">
        <Card className="bg-white dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-3 xs:p-4">
            <CardTitle className="text-xs xs:text-sm font-medium text-gray-900 dark:text-white">Ativos</CardTitle>
            <FileText className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent className="p-3 xs:p-4">
            <div className="text-xl xs:text-2xl font-bold text-gray-900 dark:text-white">8</div>
            <p className="text-xs text-muted-foreground dark:text-gray-400">
              +2 mês
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-3 xs:p-4">
            <CardTitle className="text-xs xs:text-sm font-medium text-gray-900 dark:text-white">Enviados</CardTitle>
            <Send className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent className="p-3 xs:p-4">
            <div className="text-xl xs:text-2xl font-bold text-gray-900 dark:text-white">156</div>
            <p className="text-xs text-muted-foreground dark:text-gray-400">
              30 dias
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-3 xs:p-4">
            <CardTitle className="text-xs xs:text-sm font-medium text-gray-900 dark:text-white">Taxa Abertura</CardTitle>
            <BarChart3 className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent className="p-3 xs:p-4">
            <div className="text-xl xs:text-2xl font-bold text-gray-900 dark:text-white">87%</div>
            <p className="text-xs text-muted-foreground dark:text-gray-400">
              Média
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-3 xs:p-4">
            <CardTitle className="text-xs xs:text-sm font-medium text-gray-900 dark:text-white">Tempo Médio</CardTitle>
            <Calendar className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent className="p-3 xs:p-4">
            <div className="text-xl xs:text-2xl font-bold text-gray-900 dark:text-white">2.3min</div>
            <p className="text-xs text-muted-foreground dark:text-gray-400">
              Geração
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Geração Rápida */}
      <Card className="bg-white dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800">
        <CardHeader className="p-3 xs:p-4">
          <CardTitle className="text-base xs:text-lg text-gray-900 dark:text-white">Gerar Instantâneo</CardTitle>
          <CardDescription className="text-xs xs:text-sm dark:text-gray-400">
            Relatórios sob demanda
          </CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 xs:gap-3 p-3 xs:p-4">
          <Button className="h-16 xs:h-20 flex flex-col items-center space-y-1 text-xs xs:text-sm">
            <BarChart3 className="h-5 w-5 xs:h-6 xs:w-6" />
            <span>Dashboard</span>
          </Button>
          <Button variant="outline" className="h-16 xs:h-20 flex flex-col items-center space-y-1 text-xs xs:text-sm">
            <FileText className="h-5 w-5 xs:h-6 xs:w-6" />
            <span>RH</span>
          </Button>
          <Button variant="outline" className="h-16 xs:h-20 flex flex-col items-center space-y-1 text-xs xs:text-sm">
            <Send className="h-5 w-5 xs:h-6 xs:w-6" />
            <span>Análise</span>
          </Button>
        </CardContent>
      </Card>

      {/* Lista de Relatórios Programados */}
      <Card className="bg-white dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800">
        <CardHeader className="p-3 xs:p-4">
          <CardTitle className="text-base xs:text-lg text-gray-900 dark:text-white">Programados</CardTitle>
          <CardDescription className="text-xs xs:text-sm dark:text-gray-400">
            Automação de relatórios
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2 xs:space-y-3 p-3 xs:p-4">
          {reports.map((report) => (
            <div key={report.id} className="p-2 xs:p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:shadow-md dark:hover:shadow-lg/50 transition-shadow bg-white dark:bg-gray-800/50">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-1 gap-1 mb-1 flex-wrap">
                    <h4 className="font-medium text-xs xs:text-sm text-gray-900 dark:text-white truncate">{report.title}</h4>
                    <Badge variant={report.status === 'Ativo' ? 'default' : 'secondary'} className="text-xs">
                      {report.status}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground dark:text-gray-400 mb-1 line-clamp-1">
                    {report.description}
                  </p>
                  <div className="flex items-center space-x-1 gap-1 text-xs text-muted-foreground dark:text-gray-400 flex-wrap">
                    <span className="flex items-center space-x-0.5">
                      <Calendar className="h-3 w-3" />
                      <span>{report.schedule}</span>
                    </span>
                  </div>
                </div>
                <div className="flex space-x-1 flex-shrink-0">
                  <Button size="sm" variant="outline" className="text-xs h-8">
                    <Download className="h-3 w-3" />
                  </Button>
                  <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                    <Settings className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Configurações de Template */}
      <Card className="bg-white dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800">
        <CardHeader className="p-3 xs:p-4">
          <CardTitle className="text-base xs:text-lg text-gray-900 dark:text-white">Templates</CardTitle>
          <CardDescription className="text-xs xs:text-sm dark:text-gray-400">
            Personalize relatórios
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3 xs:gap-4 md:grid-cols-2 p-3 xs:p-4">
          <div className="space-y-2">
            <h4 className="font-medium text-sm text-gray-900 dark:text-white">Seções</h4>
            <div className="space-y-1">
              {[
                'Resumo Executivo',
                'Métricas',
                'Tendências',
                'Recomendações',
                'Alertas'
              ].map((section) => (
                <label key={section} className="flex items-center space-x-2">
                  <input type="checkbox" defaultChecked className="rounded" />
                  <span className="text-xs xs:text-sm text-gray-700 dark:text-gray-300">{section}</span>
                </label>
              ))}
            </div>
          </div>
          
          <div className="space-y-2">
            <h4 className="font-medium text-sm text-gray-900 dark:text-white">Formato</h4>
            <select className="w-full p-2 border rounded text-sm bg-white dark:bg-gray-800 dark:border-gray-700 dark:text-white mb-2">
              <option>PDF</option>
              <option>PowerPoint</option>
              <option>Dashboard</option>
              <option>Email HTML</option>
            </select>
            
            <h4 className="font-medium text-sm text-gray-900 dark:text-white">Idioma</h4>
            <select className="w-full p-2 border rounded text-sm bg-white dark:bg-gray-800 dark:border-gray-700 dark:text-white">
              <option>Português (Técnico)</option>
              <option>Português (Executivo)</option>
              <option>Inglês</option>
            </select>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
