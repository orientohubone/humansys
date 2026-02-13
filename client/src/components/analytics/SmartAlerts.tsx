
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  AlertTriangle, 
  Bell, 
  Clock, 
  Users, 
  TrendingDown,
  CheckCircle,
  X
} from 'lucide-react';

interface Alert {
  id: string;
  title: string;
  description: string;
  type: 'warning' | 'info' | 'success' | 'error';
  priority: 'high' | 'medium' | 'low';
  category: string;
  timestamp: string;
  actionRequired: boolean;
}

export const SmartAlerts: React.FC = () => {
  const alerts: Alert[] = [
    {
      id: '1',
      title: 'Risco de Turnover Detectado',
      description: 'Ana Silva (TI) apresenta padrão de baixo engajamento. Sugestão: agendar 1:1 urgente.',
      type: 'warning',
      priority: 'high',
      category: 'Retenção',
      timestamp: '2 min atrás',
      actionRequired: true
    },
    {
      id: '2',
      title: 'Deadline de Treinamento Próximo',
      description: 'Treinamento de Segurança expira em 3 dias para 8 colaboradores.',
      type: 'warning',
      priority: 'medium',
      category: 'Treinamento',
      timestamp: '15 min atrás',
      actionRequired: true
    },
    {
      id: '3',
      title: 'Meta de Onboarding Atingida',
      description: '95% dos novos colaboradores completaram onboarding em menos de 5 dias.',
      type: 'success',
      priority: 'low',
      category: 'Onboarding',
      timestamp: '1 hora atrás',
      actionRequired: false
    },
    {
      id: '4',
      title: 'Queda na Participação',
      description: 'Departamento de Vendas teve 30% menos participação em atividades esta semana.',
      type: 'error',
      priority: 'high',
      category: 'Engajamento',
      timestamp: '2 horas atrás',
      actionRequired: true
    }
  ];

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'warning': return <AlertTriangle className="h-4 w-4 text-orange-500" />;
      case 'error': return <X className="h-4 w-4 text-red-500" />;
      case 'success': return <CheckCircle className="h-4 w-4 text-green-500" />;
      default: return <Bell className="h-4 w-4 text-blue-500" />;
    }
  };

  const getAlertColor = (type: string) => {
    switch (type) {
      case 'warning': return 'border-orange-200 bg-orange-50';
      case 'error': return 'border-red-200 bg-red-50';
      case 'success': return 'border-green-200 bg-green-50';
      default: return 'border-blue-200 bg-blue-50';
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'high': return <Badge variant="destructive">Alta</Badge>;
      case 'medium': return <Badge variant="default">Média</Badge>;
      default: return <Badge variant="secondary">Baixa</Badge>;
    }
  };

  return (
    <div className="space-y-4 xs:space-y-6">
      {/* Resumo de Alertas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 xs:gap-4">
        <Card className="bg-white dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-3 xs:p-4">
            <CardTitle className="text-xs xs:text-sm font-medium text-gray-900 dark:text-white">Ativos</CardTitle>
            <Bell className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="p-3 xs:p-4">
            <div className="text-xl xs:text-2xl font-bold text-gray-900 dark:text-white">12</div>
            <p className="text-xs text-muted-foreground dark:text-gray-400">
              +3 últimas 24h
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-3 xs:p-4">
            <CardTitle className="text-xs xs:text-sm font-medium text-gray-900 dark:text-white">Alta Prioridade</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent className="p-3 xs:p-4">
            <div className="text-xl xs:text-2xl font-bold text-red-600 dark:text-red-400">3</div>
            <p className="text-xs text-muted-foreground dark:text-gray-400">
              Ação urgente
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-3 xs:p-4">
            <CardTitle className="text-xs xs:text-sm font-medium text-gray-900 dark:text-white">Tempo Médio</CardTitle>
            <Clock className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent className="p-3 xs:p-4">
            <div className="text-xl xs:text-2xl font-bold text-blue-600 dark:text-blue-400">4.2h</div>
            <p className="text-xs text-muted-foreground dark:text-gray-400">
              Resolução
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-3 xs:p-4">
            <CardTitle className="text-xs xs:text-sm font-medium text-gray-900 dark:text-white">Taxa Resolução</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent className="p-3 xs:p-4">
            <div className="text-xl xs:text-2xl font-bold text-green-600 dark:text-green-400">87%</div>
            <p className="text-xs text-muted-foreground dark:text-gray-400">
              30 dias
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Lista de Alertas */}
      <Card className="bg-white dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800">
        <CardHeader className="p-3 xs:p-4">
          <CardTitle className="text-base xs:text-lg text-gray-900 dark:text-white">Alertas Inteligentes</CardTitle>
          <CardDescription className="text-xs xs:text-sm dark:text-gray-400">
            Detecção automática
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2 xs:space-y-3 p-3 xs:p-4">
          {alerts.map((alert) => (
            <div key={alert.id} className={`p-2 xs:p-3 border rounded-lg ${getAlertColor(alert.type)} dark:bg-opacity-20`}>
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-start space-x-2 min-w-0">
                  {getAlertIcon(alert.type)}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-1 gap-1 mb-1 flex-wrap">
                      <h4 className="font-medium text-xs xs:text-sm text-gray-900 dark:text-white">{alert.title}</h4>
                      {getPriorityBadge(alert.priority)}
                    </div>
                    <p className="text-xs text-muted-foreground dark:text-gray-400 mb-1 line-clamp-2">
                      {alert.description}
                    </p>
                    <p className="text-xs text-muted-foreground dark:text-gray-400">
                      {alert.timestamp}
                    </p>
                  </div>
                </div>
                <div className="flex space-x-1 flex-shrink-0">
                  {alert.actionRequired && (
                    <Button size="sm" variant="outline" className="text-xs">
                      Ação
                    </Button>
                  )}
                  <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Configurações de Alertas */}
      <Card className="bg-white dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800">
        <CardHeader className="p-3 xs:p-4">
          <CardTitle className="text-base xs:text-lg text-gray-900 dark:text-white">Configurar Alertas</CardTitle>
          <CardDescription className="text-xs xs:text-sm dark:text-gray-400">
            Personalize notificações
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3 xs:gap-4 md:grid-cols-2 p-3 xs:p-4">
          <div className="space-y-2">
            <h4 className="font-medium text-sm text-gray-900 dark:text-white">Categorias</h4>
            <div className="space-y-1">
              {['Turnover', 'Performance', 'Treinamento', 'Onboarding'].map((category) => (
                <label key={category} className="flex items-center space-x-2">
                  <input type="checkbox" defaultChecked className="rounded" />
                  <span className="text-xs xs:text-sm text-gray-700 dark:text-gray-300">{category}</span>
                </label>
              ))}
            </div>
          </div>
          
          <div className="space-y-2">
            <h4 className="font-medium text-sm text-gray-900 dark:text-white">Frequência</h4>
            <select className="w-full p-2 border rounded text-sm bg-white dark:bg-gray-800 dark:border-gray-700 dark:text-white">
              <option>Imediato</option>
              <option>Diário (9h)</option>
              <option>Semanal (Segunda)</option>
            </select>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
