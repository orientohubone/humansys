import { useNavigate } from 'react-router-dom';
import { ArrowLeft, AlertCircle, CheckCircle, Clock, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useState } from 'react';

interface Alert {
  id: string;
  title: string;
  description: string;
  severity: 'critical' | 'warning' | 'info';
  type: 'risk' | 'opportunity' | 'action';
  actionRequired: boolean;
  createdAt: Date;
}

export function Alerts() {
  const navigate = useNavigate();
  const [alerts, setAlerts] = useState<Alert[]>([
    {
      id: '1',
      title: 'Risco de Turnover em Engenharia',
      description: 'Análise predita: 35% de probabilidade de perda de talento senior nos próximos 6 meses',
      severity: 'critical',
      type: 'risk',
      actionRequired: true,
      createdAt: new Date(),
    },
    {
      id: '2',
      title: 'Oportunidade no Mercado Europeu',
      description: 'Demanda crescente (45% YoY) em sua categoria de produto no mercado europeu',
      severity: 'warning',
      type: 'opportunity',
      actionRequired: false,
      createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
    },
    {
      id: '3',
      title: 'Ação: Atualizar Planos de Compensação',
      description: 'Seus planos de compensação estão 12% abaixo da média de mercado',
      severity: 'info',
      type: 'action',
      actionRequired: true,
      createdAt: new Date(Date.now() - 48 * 60 * 60 * 1000),
    },
  ]);

  const goBack = () => {
    navigate('/app/founder', { state: { tab: 'strategic-vision' } });
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-50 dark:bg-red-950/20 border-red-300 dark:border-red-700';
      case 'warning': return 'bg-yellow-50 dark:bg-yellow-950/20 border-yellow-300 dark:border-yellow-700';
      case 'info': return 'bg-blue-50 dark:bg-blue-950/20 border-blue-300 dark:border-blue-700';
      default: return 'bg-slate-50 dark:bg-slate-950/20';
    }
  };

  const getSeverityBadgeVariant = (severity: string) => {
    switch (severity) {
      case 'critical': return 'destructive';
      case 'warning': return 'default';
      case 'info': return 'secondary';
      default: return 'outline';
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'risk': return <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400" />;
      case 'opportunity': return <Zap className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />;
      case 'action': return <Clock className="h-5 w-5 text-blue-600 dark:text-blue-400" />;
      default: return <AlertCircle className="h-5 w-5" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-red-50/30 to-red-50 dark:from-slate-950 dark:via-red-950/20 dark:to-red-950/20 p-4">
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
          <h1 className="text-4xl font-bold text-emerald-600 dark:text-emerald-400">Central de Alertas</h1>
        </div>

        <div className="space-y-6">
          {/* Summary Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="dark:border-slate-700">
              <CardContent className="pt-6">
                <div className="text-center">
                  <p className="text-3xl font-bold text-red-600 dark:text-red-400">{alerts.filter(a => a.severity === 'critical').length}</p>
                  <p className="text-sm text-muted-foreground">Críticos</p>
                </div>
              </CardContent>
            </Card>
            <Card className="dark:border-slate-700">
              <CardContent className="pt-6">
                <div className="text-center">
                  <p className="text-3xl font-bold text-yellow-600 dark:text-yellow-400">{alerts.filter(a => a.severity === 'warning').length}</p>
                  <p className="text-sm text-muted-foreground">Avisos</p>
                </div>
              </CardContent>
            </Card>
            <Card className="dark:border-slate-700">
              <CardContent className="pt-6">
                <div className="text-center">
                  <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">{alerts.filter(a => a.actionRequired).length}</p>
                  <p className="text-sm text-muted-foreground">Ações Pendentes</p>
                </div>
              </CardContent>
            </Card>
            <Card className="dark:border-slate-700">
              <CardContent className="pt-6">
                <div className="text-center">
                  <p className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">{alerts.length}</p>
                  <p className="text-sm text-muted-foreground">Total</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Alerts List */}
          <div className="space-y-4">
            {alerts.map((alert) => (
              <Card key={alert.id} className={`dark:border-slate-700 border-2 ${getSeverityColor(alert.severity)}`}>
                <CardContent className="pt-6">
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 mt-1">
                      {getIcon(alert.type)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-bold text-lg">{alert.title}</h3>
                        <div className="flex gap-2">
                          <Badge variant={getSeverityBadgeVariant(alert.severity)}>
                            {alert.severity.toUpperCase()}
                          </Badge>
                          {alert.actionRequired && (
                            <Badge className="bg-orange-600 hover:bg-orange-700">
                              AÇÃO REQUERIDA
                            </Badge>
                          )}
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">{alert.description}</p>
                      <p className="text-xs text-muted-foreground">
                        {alert.createdAt.toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {alerts.length === 0 && (
            <Card className="dark:border-slate-700">
              <CardContent className="pt-6">
                <div className="text-center">
                  <CheckCircle className="h-12 w-12 text-emerald-600 dark:text-emerald-400 mx-auto mb-3" />
                  <p className="text-lg font-semibold mb-1">Nenhum Alerta</p>
                  <p className="text-muted-foreground">Sua organização está em ótimo estado!</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
