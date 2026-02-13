import React, { useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { TrendChart } from '@/components/dashboard/TrendChart';
import { ActivityItem } from '@/components/dashboard/ActivityItem';
import { CreditsCard } from '@/components/dashboard/CreditsCard';
import { useDashboardData } from '@/hooks/useDashboardData';
import { useAuth } from '@/contexts/AuthContext';
import { useFounderAccess } from '@/hooks/useFounderAccess';
import { UpdateBanner } from '@/components/layout/UpdateBanner';
import { SystemHealthIndicator } from '@/components/common/SystemHealthIndicator';
import { GamificationPanel } from '@/components/gamification/GamificationPanel';
import { SmartLoadingIndicator } from '@/components/common/SmartLoadingIndicator';
import { IAAssistantDialog } from '@/components/dashboard/IAAssistantDialog';
import { NewCollaboratorDialog } from '@/components/dashboard/NewCollaboratorDialog';
import { TrainingDialog } from '@/components/dashboard/TrainingDialog';
import { FeedbackDialog } from '@/components/dashboard/FeedbackDialog';
import { Widget } from '@/components/dashboard/Widget';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { 
  Activity, 
  Users, 
  TrendingUp, 
  Calendar, 
  BookOpen, 
  Award,
  Target,
  Zap,
  Bell,
  Plus,
  BarChart3,
  User,
  MessageSquare,
  FileText,
  Brain,
  Sparkles,
  Crown,
  Heart,
  Trophy,
  UserPlus
} from 'lucide-react';
import { BrainSysModulesPanel } from '@/components/brainsys/BrainSysModulesPanel';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { TaskItem } from '@/components/dashboard/TaskItem';
import { useIAAssistant } from '@/contexts/IAAssistantContext';

// Componente de gráfico de tendências de performance
const PerformanceTrendsChart = () => {
  // Dados de exemplo para o gráfico de tendências
  const performanceData = [
    {
      month: 'Jan',
      produtividade: 78,
      engajamento: 85,
      satisfacao: 72,
      retencao: 92
    },
    {
      month: 'Fev',
      produtividade: 82,
      engajamento: 88,
      satisfacao: 75,
      retencao: 91
    },
    {
      month: 'Mar',
      produtividade: 85,
      engajamento: 90,
      satisfacao: 78,
      retencao: 93
    },
    {
      month: 'Abr',
      produtividade: 88,
      engajamento: 92,
      satisfacao: 82,
      retencao: 94
    },
    {
      month: 'Mai',
      produtividade: 91,
      engajamento: 89,
      satisfacao: 85,
      retencao: 95
    },
    {
      month: 'Jun',
      produtividade: 94,
      engajamento: 94,
      satisfacao: 88,
      retencao: 96
    }
  ];

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={performanceData}>
          <defs>
            <linearGradient id="gradientProdutividade" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#8884d8" stopOpacity={0.1}/>
            </linearGradient>
            <linearGradient id="gradientEngajamento" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#82ca9d" stopOpacity={0.1}/>
            </linearGradient>
            <linearGradient id="gradientSatisfacao" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#ffc658" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#ffc658" stopOpacity={0.1}/>
            </linearGradient>
            <linearGradient id="gradientRetencao" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#ff7c7c" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#ff7c7c" stopOpacity={0.1}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
          <XAxis 
            dataKey="month" 
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <YAxis 
            fontSize={12}
            tickLine={false}
            axisLine={false}
            domain={[60, 100]}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'var(--background)', 
              border: '1px solid var(--border)',
              borderRadius: '8px',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
              color: 'var(--foreground)'
            }}
            formatter={(value: number, name: string) => [`${value}%`, name]}
          />
          <Legend />
          <Area
            type="monotone"
            dataKey="produtividade"
            stroke="#8884d8"
            strokeWidth={2}
            fill="url(#gradientProdutividade)"
            name="Produtividade"
          />
          <Area
            type="monotone"
            dataKey="engajamento"
            stroke="#82ca9d"
            strokeWidth={2}
            fill="url(#gradientEngajamento)"
            name="Engajamento"
          />
          <Area
            type="monotone"
            dataKey="satisfacao"
            stroke="#ffc658"
            strokeWidth={2}
            fill="url(#gradientSatisfacao)"
            name="Satisfação"
          />
          <Area
            type="monotone"
            dataKey="retencao"
            stroke="#ff7c7c"
            strokeWidth={2}
            fill="url(#gradientRetencao)"
            name="Retenção"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export const DashboardComponent = () => {
  const { user } = useAuth();
  const [dashboardLoading, setDashboardLoading] = useState(false);
  const [dashboardData, setDashboardData] = useState({
    collaborators: [],
    activities: [
      {
        id: 1,
        type: 'collaborator_added',
        title: 'Novo colaborador adicionado',
        description: 'Maria Silva foi adicionada ao departamento de Marketing',
        timestamp: '2 horas atrás',
        icon: 'UserPlus',
        color: 'text-green-600'
      },
      {
        id: 2,
        type: 'training_completed',
        title: 'Treinamento concluído',
        description: 'João Santos completou o curso de Segurança da Informação',
        timestamp: '4 horas atrás',
        icon: 'BookOpen',
        color: 'text-blue-600'
      },
      {
        id: 3,
        type: 'feedback_received',
        title: 'Feedback recebido',
        description: 'Ana Costa enviou feedback sobre processo de onboarding',
        timestamp: '1 dia atrás',
        icon: 'MessageSquare',
        color: 'text-purple-600'
      },
      {
        id: 4,
        type: 'goal_achieved',
        title: 'Meta alcançada',
        description: 'Equipe de vendas atingiu 100% da meta mensal',
        timestamp: '1 dia atrás',
        icon: 'Trophy',
        color: 'text-yellow-600'
      },
      {
        id: 5,
        type: 'document_uploaded',
        title: 'Documento enviado',
        description: 'Relatório de performance Q1 foi enviado para análise',
        timestamp: '2 dias atrás',
        icon: 'FileText',
        color: 'text-gray-600'
      }
    ],
    tasks: [
      {
        id: 1,
        title: 'Revisar onboarding de Maria Silva',
        priority: 'high' as const,
        dueDate: 'Hoje',
        status: 'pending' as const
      },
      {
        id: 2,
        title: 'Preparar relatório mensal de RH',
        priority: 'medium' as const,
        dueDate: 'Amanhã',
        status: 'in_progress' as const
      },
      {
        id: 3,
        title: 'Agendar reunião de feedback',
        priority: 'low' as const,
        dueDate: 'Esta semana',
        status: 'pending' as const
      }
    ],
    stats: {
      totalCollaborators: 24,
      activeProcesses: 8,
      completionRate: 85,
      gamificationPoints: 1250
    },
    trends: []
  });
  const { isOpen: isIAAssistantOpen, close: closeIAAssistant, open: openIAAssistant } = useIAAssistant();
  const [selectedBrainSysModule, setSelectedBrainSysModule] = useState<string | null>(null);

  const navigate = (path: string) => {
    window.location.href = path;
  };

  useEffect(() => {
    console.log('📊 Dashboard - Usuário carregado:', user?.email);
    console.log('📊 Dashboard - Rota atual:', window.location.pathname);
  }, [user?.id]);

  const handleModuleSelect = (moduleId: string) => {
    setSelectedBrainSysModule(moduleId);
    // Navegar para o módulo específico baseado no ID
    switch (moduleId) {
      case 'careers-salaries':
        console.log('Navegando para careers module');
        navigate('/app/brainsys/careers');
        break;
      case 'brainpeople':
        console.log('Navegando para wellness module');
        navigate('/app/brainsys/wellness');
        break;
      case 'motiva':
        console.log('Navegando para motivation module');
        navigate('/app/brainsys/motivation');
        break;
      default:
        console.log('Módulo não encontrado:', moduleId);
    }
  };

  if (dashboardLoading) {
    return (
      <DashboardLayout>
        <div className="p-6 flex justify-center items-center min-h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </DashboardLayout>
    );
  }

  const collaborators = dashboardData?.collaborators || [];
  const activities = dashboardData?.activities || [];
  const tasks = dashboardData?.tasks || [];
  const stats = dashboardData?.stats || {};

  return (
    <DashboardLayout>
      <div className="space-y-4 sm:space-y-6">
        <UpdateBanner />

        {/* BrainSys IAO - A Inteligência Viva */}
        <Card className="relative overflow-hidden bg-gradient-to-br from-purple-900/95 via-blue-900/95 to-indigo-900/95 border-purple-500/30 backdrop-blur-sm">
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 via-blue-500/15 to-indigo-500/20"></div>
            <div className="absolute top-0 left-0 w-full h-full opacity-30">
              <div className="absolute top-4 left-4 w-32 h-32 bg-purple-400/20 rounded-full blur-3xl animate-pulse"></div>
              <div className="absolute bottom-4 right-4 w-40 h-40 bg-blue-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
            </div>
          </div>
          <CardContent className="relative p-3 sm:p-4 md:p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-5 w-full">
                <div className="relative flex-shrink-0">
                  <div className="w-16 sm:w-20 h-16 sm:h-20 bg-gradient-to-br from-purple-500 via-blue-600 to-indigo-600 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-2xl shadow-purple-500/30">
                    <Brain className="h-8 sm:h-10 w-8 sm:w-10 text-white animate-pulse" style={{ animationDuration: '3s' }} />
                  </div>
                  <div className="absolute -top-1 -right-1 w-4 sm:w-5 h-4 sm:h-5 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center">
                    <div className="w-1.5 sm:w-2 h-1.5 sm:h-2 bg-white rounded-full animate-ping"></div>
                  </div>
                  <div className="absolute -bottom-1 -left-1 w-3 sm:w-4 h-3 sm:h-4 bg-gradient-to-r from-red-400 to-pink-500 rounded-full flex items-center justify-center">
                    <Heart className="h-1.5 sm:h-2 w-1.5 sm:w-2 text-white animate-pulse" />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
                    <h2 className="text-2xl sm:text-3xl font-bold text-white truncate">BrainSys IAO</h2>
                    <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white border-none px-2 sm:px-3 py-0.5 sm:py-1 text-xs sm:text-sm animate-pulse w-fit">
                      VIVA
                    </Badge>
                  </div>
                  <p className="text-base sm:text-lg md:text-xl text-purple-100 mb-1 sm:mb-2 font-medium">
                    A Inteligência Viva do HumanSys
                  </p>
                  <p className="text-xs sm:text-sm text-purple-200 opacity-90 mb-2 sm:mb-3 line-clamp-2">
                    IAO = Inteligência Artificial Operacional • Ontológica
                  </p>
                  <div className="flex flex-wrap gap-2 text-xs text-purple-200">
                    <span className="flex items-center bg-white/10 px-2 py-1 rounded-full flex-shrink-0">
                      <div className="w-1.5 h-1.5 bg-green-400 rounded-full mr-1 animate-pulse"></div>
                      <span className="truncate">Aprendendo</span>
                    </span>
                    <span className="flex items-center bg-white/10 px-2 py-1 rounded-full flex-shrink-0">
                      <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mr-1 animate-pulse"></div>
                      <span className="truncate">Evoluindo</span>
                    </span>
                    <span className="flex items-center bg-white/10 px-2 py-1 rounded-full flex-shrink-0">
                      <div className="w-1.5 h-1.5 bg-purple-400 rounded-full mr-1 animate-pulse"></div>
                      <span className="truncate">Conectada</span>
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto sm:flex-col md:flex-col lg:flex-col">
                <Button 
                  className="bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 hover:from-purple-700 hover:via-blue-700 hover:to-indigo-700 text-white border-none shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:scale-105 px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base w-full sm:w-auto"
                  onClick={() => navigate('/app/brainsys-iao')}
                >
                  <Sparkles className="h-3 sm:h-4 w-3 sm:w-4 mr-1 sm:mr-2" />
                  Despertar IAO
                </Button>
                <Button 
                  variant="outline"
                  className="bg-white/10 border-white/30 text-white hover:bg-white/20 backdrop-blur-sm px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base w-full sm:w-auto"
                  onClick={() => openIAAssistant()}
                >
                  <Zap className="h-3 sm:h-4 w-3 sm:w-4 mr-1 sm:mr-2" />
                  <span className="hidden sm:inline">Console Rápido</span>
                  <span className="sm:hidden">Console</span>
                </Button>
                <div className="text-right">
                  <div className="text-xs text-purple-200">Powered by</div>
                  <div className="text-xs sm:text-sm font-medium text-white truncate">Claude 3.5 Sonnet</div>
                </div>
              </div>
            </div>

            {/* Living Intelligence Metrics */}
            <div className="mt-4 sm:mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2 sm:gap-4">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-purple-200 font-medium">Status Inteligência</span>
                  <Heart className="h-4 w-4 text-red-400 animate-pulse" />
                </div>
                <div className="text-xl font-bold text-white mb-1">VIVA</div>
                <div className="text-xs text-purple-200">Cérebro Ativo</div>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-purple-200 font-medium">Precisão Ontológica</span>
                  <Brain className="h-4 w-4 text-purple-400" />
                </div>
                <div className="text-xl font-bold text-white mb-1">94.7%</div>
                <div className="text-xs text-purple-200">Contexto Humano</div>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-purple-200 font-medium">Insights Evolutivos</span>
                  <Target className="h-4 w-4 text-blue-400" />
                </div>
                <div className="text-xl font-bold text-white mb-1">12</div>
                <div className="text-xs text-purple-200">Transformações</div>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-purple-200 font-medium">Impacto Humano</span>
                  <TrendingUp className="h-4 w-4 text-green-400" />
                </div>
                <div className="text-xl font-bold text-white mb-1">R$ 45K</div>
                <div className="text-xs text-purple-200">Potencial/Mês</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* BrainSys Modules Panel */}
        <BrainSysModulesPanel onModuleSelect={handleModuleSelect} />

        <div className="flex flex-col gap-2 xs:gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-0">
          <div>
            <h1 className="text-xl xs:text-2xl sm:text-3xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-xs xs:text-sm text-muted-foreground">
              Bem-vindo ao seu painel de controle otimizado
            </p>
          </div>
          <div className="flex flex-col gap-1 xs:gap-1.5 sm:flex-row sm:items-center sm:gap-2">
            <Button onClick={() => navigate('/changelog')} variant="outline">
              <Trophy className="h-4 w-4 mr-2" />
              Ver Novidades
            </Button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid gap-3 xs:gap-4 sm:gap-6 grid-cols-1 xs:grid-cols-2 md:grid-cols-2 lg:grid-cols-5">
          <StatsCard
            title="Total de Colaboradores"
            value={stats.totalCollaborators}
            icon={Users}
            trend={12}
          />
          <StatsCard
            title="Processos Ativos"
            value={stats.activeProcesses}
            icon={UserPlus}
            trend={8}
          />
          <StatsCard
            title="Taxa de Conclusão"
            value={`${stats.completionRate}%`}
            icon={TrendingUp}
            trend={15}
          />
          <StatsCard
            title="Pontos Gamificação"
            value={stats.gamificationPoints}
            icon={Trophy}
            trend={25}
            isNew={true}
          />
          <CreditsCard />
        </div>

        {/* Novas Funcionalidades Banner */}
        <Card className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 border-blue-200 dark:border-blue-800">
          <CardContent className="p-3 xs:p-4 sm:p-6">
            <div className="flex flex-col xs:flex-row items-start gap-2 xs:gap-4 xs:space-x-0">
              <div className="bg-purple-100 dark:bg-purple-900/50 p-1.5 xs:p-2 rounded-lg flex-shrink-0">
                <Sparkles className="h-4 xs:h-5 sm:h-6 w-4 xs:w-5 sm:w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-base xs:text-lg text-gray-900 dark:text-gray-100 mb-1 xs:mb-2">
                  Novas Funcionalidades <Badge variant="secondary" className="ml-1 xs:ml-2 text-xs">Novo</Badge>
                </h3>
                <p className="text-xs xs:text-sm text-gray-600 dark:text-gray-300 mb-3 xs:mb-4">
                  Explore as funcionalidades mais recentes do HumanSys
                </p>

        <div className="grid gap-3 xs:gap-4 sm:gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                  {/* Main Content */}
                  <div className="md:col-span-1 lg:col-span-2 space-y-3 xs:space-y-4 sm:space-y-6">
                    <Widget
                      id="trends-widget"
                      title="Tendências de Performance"
                      description="Análise de performance dos últimos 6 meses"
                    >
                      <PerformanceTrendsChart />
                    </Widget>

                    <Widget
                      id="activities-widget"
                      title="Atividades Recentes"
                      description="Últimas ações realizadas no sistema"
                    >
                      <div className="space-y-4">
                        {activities.length > 0 ? (
                          activities.map((activity, index) => (
                            <ActivityItem key={index} activity={activity} />
                          ))
                        ) : (
                          <p className="text-sm text-muted-foreground">Nenhuma atividade recente</p>
                        )}
                      </div>
                    </Widget>
                  </div>

                  {/* Sidebar */}
                  <div className="space-y-3 xs:space-y-4 sm:space-y-6">
                    <Widget
                      id="goals-widget"
                      title="Metas do Mês"
                      description="Progresso das principais metas"
                    >
                      <div className="space-y-4">
                        <div>
                          <div className="flex justify-between mb-2">
                            <span className="text-sm font-medium">Onboardings</span>
                            <span className="text-sm text-muted-foreground">75%</span>
                          </div>
                          <Progress value={75} />
                        </div>
                        <div>
                          <div className="flex justify-between mb-2">
                            <span className="text-sm font-medium">Treinamentos</span>
                            <span className="text-sm text-muted-foreground">60%</span>
                          </div>
                          <Progress value={60} />
                        </div>
                        <div>
                          <div className="flex justify-between mb-2">
                            <span className="text-sm font-medium">Feedbacks</span>
                            <span className="text-sm text-muted-foreground">90%</span>
                          </div>
                          <Progress value={90} />
                        </div>
                      </div>
                    </Widget>

                    <Widget
                      id="tasks-widget"
                      title="Tarefas Pendentes"
                      description="Itens que precisam da sua atenção"
                    >
                      <div className="space-y-3">
                        {tasks.length > 0 ? (
                          tasks.map((task, index) => (
                            <TaskItem key={index} task={task} />
                          ))
                        ) : (
                          <p className="text-sm text-muted-foreground">Nenhuma tarefa pendente</p>
                        )}
                      </div>
                    </Widget>

                    <Widget
                      id="actions-widget"
                      title="Ações Rápidas"
                      description="Acesso rápido às principais funcionalidades"
                    >
                      <div className="grid gap-1 xs:gap-1.5 sm:gap-2">
                        <Button variant="outline" size="sm" className="justify-start text-xs xs:text-sm h-8 xs:h-9 sm:h-10" onClick={() => navigate('/app/collaborators')}>
                          <Users className="h-3 w-3 xs:h-4 xs:w-4 mr-1 xs:mr-2 flex-shrink-0" />
                          <span className="truncate">Adicionar Colaborador</span>
                        </Button>
                        <Button variant="outline" size="sm" className="justify-start text-xs xs:text-sm h-8 xs:h-9 sm:h-10" onClick={() => navigate('/app/onboarding')}>
                          <UserPlus className="h-3 w-3 xs:h-4 xs:w-4 mr-1 xs:mr-2 flex-shrink-0" />
                          <span className="truncate">Novo Onboarding</span>
                        </Button>
                        <Button variant="outline" size="sm" className="justify-start text-xs xs:text-sm h-8 xs:h-9 sm:h-10" onClick={() => navigate('/app/feedback')}>
                          <MessageSquare className="h-3 w-3 xs:h-4 xs:w-4 mr-1 xs:mr-2 flex-shrink-0" />
                          <span className="truncate">Enviar Feedback</span>
                        </Button>
                        <Button variant="outline" size="sm" className="justify-start text-xs xs:text-sm h-8 xs:h-9 sm:h-10" onClick={() => navigate('/app/goals')}>
                          <Target className="h-3 w-3 xs:h-4 xs:w-4 mr-1 xs:mr-2 flex-shrink-0" />
                          <span className="truncate">Definir Meta</span>
                        </Button>
                        <Button variant="outline" size="sm" className="justify-start text-xs xs:text-sm h-8 xs:h-9 sm:h-10" onClick={() => navigate('/app/disc')}>
                          <Brain className="h-3 w-3 xs:h-4 xs:w-4 mr-1 xs:mr-2 flex-shrink-0" />
                          <span className="truncate">Análise DISC</span>
                        </Button>
                      </div>
                    </Widget>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

      </div>
    </DashboardLayout>
  );
};

export const Dashboard = DashboardComponent;