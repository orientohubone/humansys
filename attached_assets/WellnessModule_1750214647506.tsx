
import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import {
  Heart,
  Brain,
  AlertTriangle,
  TrendingUp,
  Users,
  Activity,
  BarChart3,
  Plus,
  Settings,
  Thermometer,
  Shield,
  Lightbulb,
  Target,
  Clock,
  CheckCircle,
  ArrowUp,
  ArrowDown,
  Minus
} from 'lucide-react';

interface WellnessThermometer {
  id: string;
  department: string;
  overallScore: number;
  trend: 'up' | 'down' | 'stable';
  dimensions: {
    wellbeing: number;
    stress: number;
    satisfaction: number;
    engagement: number;
    workload: number;
  };
  responses: number;
  lastUpdate: string;
}

interface WellnessAction {
  id: string;
  title: string;
  description: string;
  category: 'stress' | 'wellbeing' | 'engagement' | 'balance';
  priority: 'low' | 'medium' | 'high';
  targetDepartment: string;
  estimatedImpact: number;
  isActive: boolean;
  participants: number;
  duration?: number;
  cost?: number;
}

export const WellnessModule: React.FC = () => {
  console.log('🌿 WellnessModule: Componente carregado com sucesso');
  console.log('🌿 WellnessModule: Localização:', window.location.pathname);
  
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [selectedTimeframe, setSelectedTimeframe] = useState('7d');
  const [isCreatingAction, setIsCreatingAction] = useState(false);

  // Mock data para o termômetro emocional
  const mockThermometers: WellnessThermometer[] = [
    {
      id: '1',
      department: 'TI',
      overallScore: 72,
      trend: 'down',
      dimensions: {
        wellbeing: 75,
        stress: 68,
        satisfaction: 80,
        engagement: 70,
        workload: 65
      },
      responses: 24,
      lastUpdate: '2024-01-15T10:30:00Z'
    },
    {
      id: '2',
      department: 'Marketing',
      overallScore: 85,
      trend: 'up',
      dimensions: {
        wellbeing: 88,
        stress: 82,
        satisfaction: 85,
        engagement: 90,
        workload: 80
      },
      responses: 18,
      lastUpdate: '2024-01-15T09:15:00Z'
    },
    {
      id: '3',
      department: 'Vendas',
      overallScore: 78,
      trend: 'stable',
      dimensions: {
        wellbeing: 76,
        stress: 75,
        satisfaction: 82,
        engagement: 78,
        workload: 79
      },
      responses: 32,
      lastUpdate: '2024-01-15T11:45:00Z'
    }
  ];

  // Mock data para ações recomendadas
  const mockActions: WellnessAction[] = [
    {
      id: '1',
      title: 'Programa de Mindfulness',
      description: 'Sessões diárias de meditação para redução do estresse',
      category: 'stress',
      priority: 'high',
      targetDepartment: 'TI',
      estimatedImpact: 85,
      isActive: true,
      participants: 12,
      duration: 30,
      cost: 2500
    },
    {
      id: '2',
      title: 'Flexible Work Hours',
      description: 'Implementar horários flexíveis para melhor work-life balance',
      category: 'balance',
      priority: 'medium',
      targetDepartment: 'Todos',
      estimatedImpact: 75,
      isActive: false,
      participants: 0,
      duration: 0
    },
    {
      id: '3',
      title: 'Team Building Virtual',
      description: 'Atividades online para fortalecer vínculos da equipe',
      category: 'engagement',
      priority: 'low',
      targetDepartment: 'Marketing',
      estimatedImpact: 65,
      isActive: true,
      participants: 8,
      duration: 120
    }
  ];

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBackground = (score: number) => {
    if (score >= 80) return 'bg-green-100';
    if (score >= 60) return 'bg-yellow-100';
    return 'bg-red-100';
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <ArrowUp className="h-4 w-4 text-green-500" />;
      case 'down': return <ArrowDown className="h-4 w-4 text-red-500" />;
      case 'stable': return <Minus className="h-4 w-4 text-gray-500" />;
      default: return null;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'stress': return Shield;
      case 'wellbeing': return Heart;
      case 'engagement': return Users;
      case 'balance': return Activity;
      default: return Lightbulb;
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <Heart className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">BrainPeople - Saúde Mental</h1>
              <p className="text-muted-foreground">
                Monitoramento e ações para bem-estar organizacional
              </p>
            </div>
          </div>
          <div className="flex space-x-2">
            <Button onClick={() => setIsCreatingAction(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Nova Ação
            </Button>
            <Button variant="outline">
              <Settings className="h-4 w-4 mr-2" />
              Configurações
            </Button>
          </div>
        </div>

        {/* BrainSys IAO Insights */}
        <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Brain className="h-5 w-5 text-green-600" />
                <CardTitle>Análise Preditiva BrainSys IAO</CardTitle>
                <Badge className="bg-green-500">Wellness Analytics</Badge>
              </div>
              <div className="text-right">
                <div className="text-sm text-green-600">Confiança: 91.8%</div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="flex items-center space-x-3 p-4 bg-white rounded-lg">
                <AlertTriangle className="h-8 w-8 text-red-500" />
                <div>
                  <h4 className="font-medium">Alerta de Estresse</h4>
                  <p className="text-sm text-muted-foreground">Departamento TI com níveis elevados</p>
                  <div className="text-xs text-red-600 mt-1">Intervenção recomendada</div>
                </div>
              </div>

              <div className="flex items-center space-x-3 p-4 bg-white rounded-lg">
                <TrendingUp className="h-8 w-8 text-green-500" />
                <div>
                  <h4 className="font-medium">Melhoria Detectada</h4>
                  <p className="text-sm text-muted-foreground">Marketing apresenta tendência positiva</p>
                  <div className="text-xs text-green-600 mt-1">+12% em engajamento</div>
                </div>
              </div>

              <div className="flex items-center space-x-3 p-4 bg-white rounded-lg">
                <Target className="h-8 w-8 text-blue-500" />
                <div>
                  <h4 className="font-medium">Ação Recomendada</h4>
                  <p className="text-sm text-muted-foreground">Implementar programa de mindfulness</p>
                  <div className="text-xs text-blue-600 mt-1">ROI estimado: 240%</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Content */}
        <Tabs defaultValue="thermometer" className="space-y-6">
          <TabsList>
            <TabsTrigger value="thermometer">Termômetro Emocional</TabsTrigger>
            <TabsTrigger value="actions">Ações Recomendadas</TabsTrigger>
            <TabsTrigger value="analytics">Analytics Avançado</TabsTrigger>
            <TabsTrigger value="reports">Relatórios</TabsTrigger>
          </TabsList>

          <TabsContent value="thermometer" className="space-y-6">
            {/* Filters */}
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-4">
                  <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Departamento" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos os Departamentos</SelectItem>
                      <SelectItem value="ti">TI</SelectItem>
                      <SelectItem value="marketing">Marketing</SelectItem>
                      <SelectItem value="vendas">Vendas</SelectItem>
                      <SelectItem value="rh">RH</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Select value={selectedTimeframe} onValueChange={setSelectedTimeframe}>
                    <SelectTrigger className="w-32">
                      <SelectValue placeholder="Período" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="7d">7 dias</SelectItem>
                      <SelectItem value="30d">30 dias</SelectItem>
                      <SelectItem value="90d">90 dias</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Thermometers Grid */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {mockThermometers.map((thermometer) => (
                <Card key={thermometer.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{thermometer.department}</CardTitle>
                      <div className="flex items-center space-x-2">
                        {getTrendIcon(thermometer.trend)}
                        <Badge variant="outline">{thermometer.responses} respostas</Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {/* Overall Score */}
                    <div className={`text-center p-4 rounded-lg mb-4 ${getScoreBackground(thermometer.overallScore)}`}>
                      <div className="flex items-center justify-center space-x-2 mb-2">
                        <Thermometer className="h-6 w-6 text-gray-600" />
                        <span className="text-sm font-medium">Score Geral</span>
                      </div>
                      <div className={`text-3xl font-bold ${getScoreColor(thermometer.overallScore)}`}>
                        {thermometer.overallScore}%
                      </div>
                    </div>

                    {/* Dimensions */}
                    <div className="space-y-3">
                      {Object.entries(thermometer.dimensions).map(([key, value]) => (
                        <div key={key} className="flex items-center justify-between">
                          <span className="text-sm capitalize">{key === 'wellbeing' ? 'Bem-estar' : key === 'stress' ? 'Estresse' : key === 'satisfaction' ? 'Satisfação' : key === 'engagement' ? 'Engajamento' : 'Carga de Trabalho'}</span>
                          <div className="flex items-center space-x-2">
                            <Progress value={value} className="w-16" />
                            <span className={`text-sm font-medium ${getScoreColor(value)}`}>
                              {value}%
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="mt-4 pt-3 border-t text-xs text-muted-foreground">
                      Última atualização: {new Date(thermometer.lastUpdate).toLocaleString('pt-BR')}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="actions" className="space-y-6">
            <div className="grid gap-4">
              {mockActions.map((action) => {
                const CategoryIcon = getCategoryIcon(action.category);
                return (
                  <Card key={action.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <CategoryIcon className="h-5 w-5 text-blue-600" />
                            <h3 className="text-lg font-semibold">{action.title}</h3>
                            <div className={`w-3 h-3 rounded-full ${getPriorityColor(action.priority)}`}></div>
                            {action.isActive && (
                              <Badge className="bg-green-500">
                                <CheckCircle className="h-3 w-3 mr-1" />
                                Ativa
                              </Badge>
                            )}
                          </div>
                          
                          <p className="text-muted-foreground mb-3">{action.description}</p>
                          
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                            <div>
                              <div className="text-muted-foreground">Departamento</div>
                              <div className="font-medium">{action.targetDepartment}</div>
                            </div>
                            <div>
                              <div className="text-muted-foreground">Impacto Estimado</div>
                              <div className="font-medium">{action.estimatedImpact}%</div>
                            </div>
                            <div>
                              <div className="text-muted-foreground">Participantes</div>
                              <div className="font-medium">{action.participants}</div>
                            </div>
                            {action.cost && (
                              <div>
                                <div className="text-muted-foreground">Custo</div>
                                <div className="font-medium">R$ {action.cost.toLocaleString()}</div>
                              </div>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm">
                            <BarChart3 className="h-4 w-4 mr-2" />
                            Métricas
                          </Button>
                          <Button size="sm">
                            <Settings className="h-4 w-4 mr-2" />
                            Gerenciar
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BarChart3 className="h-5 w-5" />
                  <span>Analytics Avançado de Bem-estar</span>
                </CardTitle>
                <CardDescription>
                  Análises preditivas e correlações de dados de wellness
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-muted-foreground">
                  <Brain className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Analytics avançado em desenvolvimento</p>
                  <p className="text-sm">Machine Learning para predição de burnout</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reports" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Activity className="h-5 w-5" />
                  <span>Relatórios de Wellness</span>
                </CardTitle>
                <CardDescription>
                  Relatórios executivos e comparativos de bem-estar
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-muted-foreground">
                  <Activity className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Sistema de relatórios em desenvolvimento</p>
                  <p className="text-sm">Dashboards executivos personalizados</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Create Action Dialog */}
        {isCreatingAction && (
          <Card className="fixed inset-4 z-50 bg-white shadow-2xl rounded-lg overflow-auto">
            <CardHeader>
              <CardTitle>Nova Ação de Bem-estar</CardTitle>
              <CardDescription>Criar uma nova intervenção para melhorar o wellness organizacional</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium">Título da Ação</label>
                <Input placeholder="Ex: Programa de Mindfulness" />
              </div>
              <div>
                <label className="text-sm font-medium">Descrição</label>
                <Textarea placeholder="Descreva detalhadamente a ação proposta..." />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Categoria</label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="stress">Redução de Estresse</SelectItem>
                      <SelectItem value="wellbeing">Bem-estar Geral</SelectItem>
                      <SelectItem value="engagement">Engajamento</SelectItem>
                      <SelectItem value="balance">Work-Life Balance</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium">Prioridade</label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="high">Alta</SelectItem>
                      <SelectItem value="medium">Média</SelectItem>
                      <SelectItem value="low">Baixa</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex justify-end space-x-2 pt-4">
                <Button variant="outline" onClick={() => setIsCreatingAction(false)}>
                  Cancelar
                </Button>
                <Button onClick={() => setIsCreatingAction(false)}>
                  Criar Ação
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
};

export default WellnessModule;
