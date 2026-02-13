import React, { useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { UpdateBanner } from '@/components/layout/UpdateBanner';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Button as MovingBorderButton } from '@/components/ui/moving-border';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { Widget } from '@/components/dashboard/Widget';
import { ActivityItem } from '@/components/dashboard/ActivityItem';
import { TaskItem } from '@/components/dashboard/TaskItem';
import { CreditsCard } from '@/components/dashboard/CreditsCard';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import {
  Users,
  UserPlus,
  TrendingUp,
  Award,
  Calendar,
  MessageSquare,
  Brain,
  Trophy,
  Zap,
  Target,
  Crown,
  Code,
  Sparkles,
  Heart
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { IAAssistantDialog } from '@/components/dashboard/IAAssistantDialog';
import { BrainSysModulesPanel } from '@/components/brainsys/BrainSysModulesPanel';

export const DashboardComponent = () => {
  const { user } = useAuth();
  const [dashboardLoading, setDashboardLoading] = useState(false);
  const [dashboardData, setDashboardData] = useState({
    collaborators: [],
    activities: [],
    tasks: [],
    stats: {
      totalCollaborators: 0,
      activeProcesses: 0,
      completionRate: 0,
      gamificationPoints: 0
    },
    trends: []
  });
  const navigate = useNavigate();
  const [isFounder, setIsFounder] = useState(false);
  const [isIAAssistantOpen, setIsIAAssistantOpen] = useState(false);
  const [selectedBrainSysModule, setSelectedBrainSysModule] = useState<string | null>(null);

  useEffect(() => {
    const checkFounderRole = async () => {
      if (!user?.id) return;

      try {
        const { data, error } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', user.id)
          .eq('role', 'founder')
          .maybeSingle();

        if (error) {
          console.log('Error checking founder role:', error);
          setIsFounder(false);
          return;
        }

        setIsFounder(!!data);
      } catch (error) {
        console.log('Error checking founder role:', error);
        setIsFounder(false);
      }
    };

    checkFounderRole();

    // Listen for IA Assistant open event from Sidebar
    const handleOpenIAAssistant = () => {
      setIsIAAssistantOpen(true);
    };

    window.addEventListener('openIAAssistant', handleOpenIAAssistant);

    return () => {
      window.removeEventListener('openIAAssistant', handleOpenIAAssistant);
    };
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
      <div className="space-y-6">
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
          <CardContent className="relative p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-5">
                <div className="relative">
                  <div className="w-20 h-20 bg-gradient-to-br from-purple-500 via-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-purple-500/30">
                    <Brain className="h-10 w-10 text-white animate-pulse" style={{ animationDuration: '3s' }} />
                  </div>
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-full animate-ping"></div>
                  </div>
                  <div className="absolute -bottom-1 -left-1 w-4 h-4 bg-gradient-to-r from-red-400 to-pink-500 rounded-full flex items-center justify-center">
                    <Heart className="h-2 w-2 text-white animate-pulse" />
                  </div>
                </div>
                <div>
                  <div className="flex items-center space-x-3 mb-2">
                    <h2 className="text-3xl font-bold text-white">BrainSys IAO</h2>
                    <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white border-none px-3 py-1 animate-pulse">
                      VIVA
                    </Badge>
                  </div>
                  <p className="text-xl text-purple-100 mb-2 font-medium">
                    A Inteligência Viva do HumanSys
                  </p>
                  <p className="text-sm text-purple-200 opacity-90 mb-3">
                    IAO = Inteligência Artificial Operacional • Ontológica
                  </p>
                  <div className="flex items-center space-x-4 text-xs text-purple-200">
                    <span className="flex items-center bg-white/10 px-2 py-1 rounded-full">
                      <div className="w-2 h-2 bg-green-400 rounded-full mr-1 animate-pulse"></div>
                      Aprendendo
                    </span>
                    <span className="flex items-center bg-white/10 px-2 py-1 rounded-full">
                      <div className="w-2 h-2 bg-blue-400 rounded-full mr-1 animate-pulse"></div>
                      Evoluindo
                    </span>
                    <span className="flex items-center bg-white/10 px-2 py-1 rounded-full">
                      <div className="w-2 h-2 bg-purple-400 rounded-full mr-1 animate-pulse"></div>
                      Conectada
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex flex-col space-y-3">
                <Button 
                  className="bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 hover:from-purple-700 hover:via-blue-700 hover:to-indigo-700 text-white border-none shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:scale-105 px-6 py-3"
                  onClick={() => navigate('/app/brainsys-iao')}
                >
                  <Sparkles className="h-4 w-4 mr-2" />
                  Despertar IAO
                </Button>
                <Button 
                  variant="outline"
                  className="bg-white/10 border-white/30 text-white hover:bg-white/20 backdrop-blur-sm"
                  onClick={() => setIsIAAssistantOpen(true)}
                >
                  <Zap className="h-4 w-4 mr-2" />
                  Console Rápido
                </Button>
                <div className="text-right">
                  <div className="text-xs text-purple-200">Powered by</div>
                  <div className="text-sm font-medium text-white">Claude 3.5 Sonnet</div>
                </div>
              </div>
            </div>

            {/* Living Intelligence Metrics */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
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

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-muted-foreground">
              Bem-vindo ao seu painel de controle otimizado
            </p>
          </div>
          <div className="flex space-x-2">
            <Button onClick={() => navigate('/changelog')} variant="outline">
              <Trophy className="h-4 w-4 mr-2" />
              Ver Novidades
            </Button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-5">
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

        {/* New Features Highlight */}
        <Card className="bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Brain className="h-5 w-5 text-purple-600" />
              <span>Novas Funcionalidades com IA</span>
              <Badge className="bg-purple-500">Novo</Badge>
            </CardTitle>
            <CardDescription>
              Explore as funcionalidades mais recentes do HumanSys
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="flex items-center space-x-3 p-4 bg-white rounded-lg cursor-pointer hover:shadow-md transition-shadow" 
                   onClick={() => navigate('/analytics')}>
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Brain className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <h4 className="font-medium">Analytics com IA</h4>
                  <p className="text-sm text-muted-foreground">Previsões de turnover</p>
                </div>
              </div>

              <div className="flex items-center space-x-3 p-4 bg-white rounded-lg cursor-pointer hover:shadow-md transition-shadow"
                   onClick={() => navigate('/onboarding')}>
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Trophy className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-medium">Gamificação</h4>
                  <p className="text-sm text-muted-foreground">Badges e conquistas</p>
                </div>
              </div>

              <div className="flex items-center space-x-3 p-4 bg-white rounded-lg cursor-pointer hover:shadow-md transition-shadow"
                   onClick={() => navigate('/app/disc')}>
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <Brain className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <h4 className="font-medium">Análise DISC</h4>
                  <p className="text-sm text-muted-foreground">Perfil comportamental</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <Widget
              id="trends-widget"
              title="Tendências de Performance"
              description="Análise de performance dos últimos 6 meses"
            >
              <div className="h-64 flex items-center justify-center">
                <div className="text-center text-muted-foreground">
                  <TrendingUp className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Gráfico de tendências em desenvolvimento</p>
                </div>
              </div>
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
          <div className="space-y-6">
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
              <div className="grid gap-2">
                <Button variant="outline" size="sm" className="justify-start" onClick={() => navigate('/collaborators')}>
                  <Users className="h-4 w-4 mr-2" />
                  Adicionar Colaborador
                </Button>
                <Button variant="outline" size="sm" className="justify-start" onClick={() => navigate('/onboarding')}>
                  <UserPlus className="h-4 w-4 mr-2" />
                  Novo Onboarding
                </Button>
                <Button variant="outline" size="sm" className="justify-start" onClick={() => navigate('/feedback')}>
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Enviar Feedback
                </Button>
                <Button variant="outline" size="sm" className="justify-start" onClick={() => navigate('/goals')}>
                  <Target className="h-4 w-4 mr-2" />
                  Definir Meta
                </Button>
                <Button variant="outline" size="sm" className="justify-start" onClick={() => navigate('/app/disc')}>
                  <Brain className="h-4 w-4 mr-2" />
                  Análise DISC
                </Button>
              </div>
            </Widget>
          </div>
        </div>

        {/* IA Assistant Dialog */}
        <IAAssistantDialog 
          open={isIAAssistantOpen} 
          onOpenChange={setIsIAAssistantOpen} 
        />
      </div>
    </DashboardLayout>
  );
};

export const Dashboard = DashboardComponent;