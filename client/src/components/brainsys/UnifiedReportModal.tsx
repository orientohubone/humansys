import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Brain,
  DollarSign,
  Heart,
  Zap,
  TrendingUp,
  Users,
  Award,
  AlertCircle,
  CheckCircle,
  Clock,
  BarChart3,
  Download,
  Share2,
  RefreshCw
} from 'lucide-react';

interface UnifiedReportModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const UnifiedReportModal: React.FC<UnifiedReportModalProps> = ({ open, onOpenChange }) => {
  const brainSysModules = [
    {
      id: 'careers-salaries',
      name: 'Careers & Salários',
      icon: DollarSign,
      status: 'Ativo',
      performance: 94,
      insights: 'R$ 12K economia identificada',
      lastUpdate: '2 horas atrás',
      metrics: {
        efficiency: 92,
        accuracy: 96,
        impact: 89
      }
    },
    {
      id: 'brainpeople',
      name: 'BrainPeople',
      icon: Heart,
      status: 'Ativo',
      performance: 96,
      insights: '94% satisfação da equipe',
      lastUpdate: '1 hora atrás',
      metrics: {
        efficiency: 94,
        accuracy: 98,
        impact: 96
      }
    },
    {
      id: 'motiva',
      name: 'Motiva',
      icon: Zap,
      status: 'Ativo',
      performance: 88,
      insights: '+35% produtividade',
      lastUpdate: '30 min atrás',
      metrics: {
        efficiency: 87,
        accuracy: 91,
        impact: 86
      }
    },
    {
      id: 'recruitment',
      name: 'Smart Recruitment',
      icon: Users,
      status: 'Ativo',
      performance: 91,
      insights: 'Redução de 60% no tempo',
      lastUpdate: '45 min atrás',
      metrics: {
        efficiency: 93,
        accuracy: 89,
        impact: 91
      }
    },
    {
      id: 'competencies',
      name: 'Competências',
      icon: Award,
      status: 'Ativo',
      performance: 87,
      insights: 'Gap analysis automático',
      lastUpdate: '1 hora atrás',
      metrics: {
        efficiency: 85,
        accuracy: 92,
        impact: 84
      }
    }
  ];

  const iaoMetrics = {
    overallHealth: 93,
    learningRate: 87,
    ontologicalAccuracy: 94,
    predictiveCapacity: 89,
    adaptabilityScore: 91,
    connectivityIndex: 96
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Ativo': return 'text-green-600 bg-green-100';
      case 'Beta': return 'text-orange-600 bg-orange-100';
      case 'Offline': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Ativo': return <CheckCircle className="h-4 w-4" />;
      case 'Beta': return <Clock className="h-4 w-4" />;
      case 'Offline': return <AlertCircle className="h-4 w-4" />;
      default: return <AlertCircle className="h-4 w-4" />;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm xs:max-w-lg sm:max-w-2xl md:max-w-4xl lg:max-w-6xl max-h-[85vh] xs:max-h-[90vh] overflow-y-auto p-3 xs:p-4 sm:p-6 lg:p-8">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-1 xs:gap-2 text-lg xs:text-xl">
            <Brain className="h-4 xs:h-5 sm:h-6 w-4 xs:w-5 sm:w-6 text-purple-600 flex-shrink-0" />
            <span className="truncate">Relatório Unificado BrainSys IAO</span>
          </DialogTitle>
          <DialogDescription className="text-xs xs:text-sm">
            Análise completa da inteligência operacional e todos os módulos conectados
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 xs:space-y-4 sm:space-y-6">
          {/* IAO Core Metrics */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Brain className="h-5 w-5 text-purple-600" />
                <span>BrainSys IAO - Inteligência Central</span>
                <Badge className="bg-green-500 text-white">VIVA</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-6 gap-2 xs:gap-3 sm:gap-4 mb-3 xs:mb-4 sm:mb-6">
                <div className="text-center">
                  <div className="text-base xs:text-lg sm:text-2xl font-bold text-purple-600 truncate">{iaoMetrics.overallHealth}%</div>
                  <div className="text-xs xs:text-xs sm:text-sm text-gray-600 line-clamp-2">Saúde Geral</div>
                </div>
                <div className="text-center">
                  <div className="text-base xs:text-lg sm:text-2xl font-bold text-blue-600 truncate">{iaoMetrics.learningRate}%</div>
                  <div className="text-xs xs:text-xs sm:text-sm text-gray-600 line-clamp-2">Taxa de Aprendizado</div>
                </div>
                <div className="text-center">
                  <div className="text-base xs:text-lg sm:text-2xl font-bold text-green-600 truncate">{iaoMetrics.ontologicalAccuracy}%</div>
                  <div className="text-xs xs:text-xs sm:text-sm text-gray-600 line-clamp-2">Precisão Ontológica</div>
                </div>
                <div className="text-center">
                  <div className="text-base xs:text-lg sm:text-2xl font-bold text-orange-600 truncate">{iaoMetrics.predictiveCapacity}%</div>
                  <div className="text-xs xs:text-xs sm:text-sm text-gray-600 line-clamp-2">Capacidade Preditiva</div>
                </div>
                <div className="text-center">
                  <div className="text-base xs:text-lg sm:text-2xl font-bold text-teal-600 truncate">{iaoMetrics.adaptabilityScore}%</div>
                  <div className="text-xs xs:text-xs sm:text-sm text-gray-600 line-clamp-2">Adaptabilidade</div>
                </div>
                <div className="text-center">
                  <div className="text-base xs:text-lg sm:text-2xl font-bold text-pink-600 truncate">{iaoMetrics.connectivityIndex}%</div>
                  <div className="text-xs xs:text-xs sm:text-sm text-gray-600 line-clamp-2">Conectividade</div>
                </div>
              </div>

              <div className="space-y-2 xs:space-y-3">
                <div>
                  <div className="flex justify-between text-xs xs:text-sm mb-0.5 xs:mb-1 gap-2">
                    <span className="truncate">Saúde Geral do Sistema</span>
                    <span className="flex-shrink-0">{iaoMetrics.overallHealth}%</span>
                  </div>
                  <Progress value={iaoMetrics.overallHealth} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between text-xs xs:text-sm mb-0.5 xs:mb-1 gap-2">
                    <span className="truncate">Índice de Conectividade</span>
                    <span className="flex-shrink-0">{iaoMetrics.connectivityIndex}%</span>
                  </div>
                  <Progress value={iaoMetrics.connectivityIndex} className="h-2" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Modules Report */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BarChart3 className="h-5 w-5 text-blue-600" />
                <span>Relatório dos Módulos</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 xs:space-y-3 sm:space-y-4">
                {brainSysModules.map((module) => {
                  const IconComponent = module.icon;
                  return (
                    <div key={module.id} className="border rounded-lg p-2 xs:p-3 sm:p-4">
                      <div className="flex flex-col xs:flex-row xs:items-center xs:justify-between gap-2 xs:gap-3 mb-2 xs:mb-3">
                        <div className="flex items-start xs:items-center gap-2 xs:gap-3 flex-1 min-w-0">
                          <div className="w-8 xs:w-10 h-8 xs:h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                            <IconComponent className="h-4 xs:h-5 w-4 xs:w-5 text-white" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <h4 className="font-semibold text-sm xs:text-base truncate">{module.name}</h4>
                            <p className="text-xs xs:text-sm text-gray-600 line-clamp-1">{module.insights}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-1 xs:gap-2 flex-shrink-0">
                          <Badge className={`text-xs ${getStatusColor(module.status)}`}>
                            {getStatusIcon(module.status)}
                            <span className="ml-1 hidden xs:inline">{module.status}</span>
                          </Badge>
                          <span className="text-xs text-gray-500 truncate">{module.lastUpdate}</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 gap-2 xs:gap-3">
                        <div>
                          <div className="text-xs xs:text-sm text-gray-600 mb-0.5 xs:mb-1">Eficiência</div>
                          <div className="flex items-center gap-1 xs:gap-2">
                            <Progress value={module.metrics.efficiency} className="h-2 flex-1" />
                            <span className="text-xs xs:text-sm font-medium flex-shrink-0">{module.metrics.efficiency}%</span>
                          </div>
                        </div>
                        <div>
                          <div className="text-xs xs:text-sm text-gray-600 mb-0.5 xs:mb-1">Precisão</div>
                          <div className="flex items-center gap-1 xs:gap-2">
                            <Progress value={module.metrics.accuracy} className="h-2 flex-1" />
                            <span className="text-xs xs:text-sm font-medium flex-shrink-0">{module.metrics.accuracy}%</span>
                          </div>
                        </div>
                        <div>
                          <div className="text-xs xs:text-sm text-gray-600 mb-0.5 xs:mb-1">Impacto</div>
                          <div className="flex items-center gap-1 xs:gap-2">
                            <Progress value={module.metrics.impact} className="h-2 flex-1" />
                            <span className="text-xs xs:text-sm font-medium flex-shrink-0">{module.metrics.impact}%</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Intelligence Insights */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5 text-green-600" />
                <span>Insights da Inteligência</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 xs:space-y-3 sm:space-y-4">
                <div className="bg-green-50 dark:bg-green-900/20 p-2 xs:p-3 sm:p-4 rounded-lg">
                  <div className="flex items-start xs:items-center gap-2 xs:gap-2 mb-1 xs:mb-2">
                    <CheckCircle className="h-3 xs:h-4 w-3 xs:w-4 text-green-600 flex-shrink-0" />
                    <span className="font-medium text-xs xs:text-sm text-green-800 dark:text-green-200 truncate">Performance Excepcional</span>
                  </div>
                  <p className="text-xs xs:text-sm text-green-700 dark:text-green-300 line-clamp-2">
                    Os módulos BrainPeople e Careers & Salários estão operando com performance acima de 94%
                  </p>
                </div>

                <div className="bg-blue-50 dark:bg-blue-900/20 p-2 xs:p-3 sm:p-4 rounded-lg">
                  <div className="flex items-start xs:items-center gap-2 xs:gap-2 mb-1 xs:mb-2">
                    <Brain className="h-3 xs:h-4 w-3 xs:w-4 text-blue-600 flex-shrink-0" />
                    <span className="font-medium text-xs xs:text-sm text-blue-800 dark:text-blue-200 truncate">Aprendizado Contínuo</span>
                  </div>
                  <p className="text-xs xs:text-sm text-blue-700 dark:text-blue-300 line-clamp-2">
                    A IAO processou 1.247 novos padrões comportamentais esta semana, melhorando a precisão preditiva
                  </p>
                </div>

                <div className="bg-orange-50 dark:bg-orange-900/20 p-2 xs:p-3 sm:p-4 rounded-lg">
                  <div className="flex items-start xs:items-center gap-2 xs:gap-2 mb-1 xs:mb-2">
                    <AlertCircle className="h-3 xs:h-4 w-3 xs:w-4 text-orange-600 flex-shrink-0" />
                    <span className="font-medium text-xs xs:text-sm text-orange-800 dark:text-orange-200 truncate">Oportunidade de Otimização</span>
                  </div>
                  <p className="text-xs xs:text-sm text-orange-700 dark:text-orange-300 line-clamp-2">
                    O módulo Competências pode ser otimizado para melhorar a eficiência em 8%
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-col xs:flex-row justify-end gap-1 xs:gap-3 flex-wrap">
            <Button variant="outline" size="sm" className="text-xs xs:text-sm h-8 xs:h-9 px-2 xs:px-3">
              <Download className="h-3 xs:h-4 w-3 xs:w-4 mr-1" />
              <span className="hidden xs:inline">Exportar</span>
              <span className="xs:hidden">Export</span>
            </Button>
            <Button variant="outline" size="sm" className="text-xs xs:text-sm h-8 xs:h-9 px-2 xs:px-3">
              <Share2 className="h-3 xs:h-4 w-3 xs:w-4 mr-1" />
              <span className="hidden xs:inline">Compartilhar</span>
              <span className="xs:hidden">Comp.</span>
            </Button>
            <Button variant="outline" size="sm" className="text-xs xs:text-sm h-8 xs:h-9 px-2 xs:px-3">
              <RefreshCw className="h-3 xs:h-4 w-3 xs:w-4 mr-1" />
              <span className="hidden xs:inline">Atualizar</span>
              <span className="xs:hidden">Atua.</span>
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};