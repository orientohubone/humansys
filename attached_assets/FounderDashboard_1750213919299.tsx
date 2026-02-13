import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FounderDocumentationTab } from '@/components/founder/FounderDocumentationTab';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useFounderAccess } from '@/hooks/useFounderAccess';
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users,
  Target,
  AlertTriangle,
  Brain,
  Trophy,
  Zap,
  Bell,
  Calendar,
  Briefcase,
  BarChart3,
  Crown,
  Activity,
  PieChart,
  LineChart,
  Clock,
  Rocket,
  Star,
  ChevronUp,
  ChevronDown
} from 'lucide-react';

interface BusinessMetrics {
  mrr: number;
  arr: number;
  newMrr: number;
  expansionMrr: number;
  churnedMrr: number;
  ltv: number;
  cac: number;
  churnRate: number;
  nrr: number;
  burnRate: number;
  runway: number;
  activationRate: number;
  trialToPaid: number;
  paybackPeriod: number;
  dauMau: number;
  supportTickets: number;
  grossMargin: number;
}

interface AIPredictions {
  churnRisk: { score: number; trend: 'up' | 'down'; confidence: number };
  revenueForcast: { nextMonth: number; confidence: number; trend: 'up' | 'down' };
  customerGrowth: { prediction: number; confidence: number };
  burnRateOptimization: { recommendation: string; impact: number };
}

interface GameElements {
  level: number;
  xp: number;
  nextLevelXp: number;
  badges: string[];
  achievements: { name: string; unlocked: boolean; description: string }[];
  leaderboard: { position: number; totalFounders: number };
}

export const FounderDashboardComponent = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { isFounder, isLoading } = useFounderAccess();
  const [metrics, setMetrics] = useState<BusinessMetrics | null>(null);
  const [aiPredictions, setAiPredictions] = useState<AIPredictions | null>(null);
  const [gameElements, setGameElements] = useState<GameElements | null>(null);
  const [loading, setLoading] = useState(true);
  const [alerts, setAlerts] = useState<Array<{ type: 'warning' | 'info' | 'success'; message: string }>>([]);

  useEffect(() => {
    loadFounderData();
  }, [user?.id]);

  const loadFounderData = async () => {
    if (!user?.id) return;

    setLoading(true);
    try {
      // Carregar métricas de negócio
      const { data: businessData } = await supabase
        .from('business_metrics')
        .select('*')
        .eq('company_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      // Carregar dados de gamificação
      const { data: gameData } = await supabase
        .from('founder_gamification')
        .select('*')
        .eq('founder_id', user.id)
        .maybeSingle();

      // Simular métricas se não existirem
      const currentMetrics: BusinessMetrics = businessData || {
        mrr: 45000,
        arr: 540000,
        newMrr: 8500,
        expansionMrr: 2300,
        churnedMrr: 1200,
        ltv: 18000,
        cac: 850,
        churnRate: 2.8,
        nrr: 108,
        burnRate: 25000,
        runway: 18,
        activationRate: 68,
        trialToPaid: 24,
        paybackPeriod: 8,
        dauMau: 42,
        supportTickets: 0.8,
        grossMargin: 87
      };

      // Simular gamificação
      const currentGame: GameElements = gameData || {
        level: 7,
        xp: 2850,
        nextLevelXp: 3500,
        badges: ['Pioneiro', 'Crescimento Rápido', 'Retenção Master'],
        achievements: [
          { name: 'Primeiro Milhão ARR', unlocked: false, description: 'Alcançar R$ 1M em ARR' },
          { name: 'Churn Zero', unlocked: true, description: 'Mês com 0% de churn' },
          { name: 'NRR Champion', unlocked: true, description: 'NRR acima de 110%' }
        ],
        leaderboard: { position: 23, totalFounders: 156 }
      };

      // Simular IA preditiva
      const predictions: AIPredictions = {
        churnRisk: { score: 2.1, trend: 'down', confidence: 89 },
        revenueForcast: { nextMonth: 52000, confidence: 84, trend: 'up' },
        customerGrowth: { prediction: 15, confidence: 76 },
        burnRateOptimization: { 
          recommendation: 'Reduza custos de marketing em 15% e invista mais em retenção', 
          impact: 8500 
        }
      };

      setMetrics(currentMetrics);
      setGameElements(currentGame);
      setAiPredictions(predictions);

      // Gerar alertas inteligentes
      generateSmartAlerts(currentMetrics, predictions);

    } catch (error) {
      console.error('Erro ao carregar dados do founder:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os dados do dashboard",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const generateSmartAlerts = (metrics: BusinessMetrics, predictions: AIPredictions) => {
    const newAlerts = [];

    if (metrics.churnRate > 5) {
      newAlerts.push({
        type: 'warning' as const,
        message: `Taxa de churn em ${metrics.churnRate}% - acima do ideal (3-5%)`
      });
    }

    if (metrics.ltv / metrics.cac < 3) {
      newAlerts.push({
        type: 'warning' as const,
        message: 'LTV/CAC abaixo de 3x - otimize aquisição ou retenção'
      });
    }

    if (predictions.churnRisk.score > 3) {
      newAlerts.push({
        type: 'warning' as const,
        message: 'IA detectou risco elevado de churn nos próximos 30 dias'
      });
    }

    if (metrics.runway < 12) {
      newAlerts.push({
        type: 'warning' as const,
        message: `Runway de ${metrics.runway} meses - considere fundraising`
      });
    }

    setAlerts(newAlerts);
  };

  const triggerDepartmentAlert = (department: string, metric: string) => {
    toast({
      title: "Alerta Enviado",
      description: `Departamento ${department} notificado sobre ${metric}`,
    });
  };

  if (isLoading || loading) {
    return (
      <DashboardLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <Brain className="h-12 w-12 animate-pulse mx-auto mb-4 text-primary" />
            <p className="text-lg font-medium">Carregando Dashboard Founder...</p>
            <p className="text-muted-foreground">Processando métricas com IA</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (!isFounder) {
    return (
      <DashboardLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center space-y-4">
            <Crown className="h-16 w-16 mx-auto text-yellow-500" />
            <h2 className="text-2xl font-bold">Acesso Restrito</h2>
            <p className="text-muted-foreground">Este dashboard é exclusivo para founders.</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (!metrics || !gameElements || !aiPredictions) return null;

  return (
    <DashboardLayout>
      <div className="space-y-6 h-full overflow-y-auto">
        {/* Header com Gamificação */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Crown className="h-8 w-8 text-yellow-500" />
              Founder Dashboard
              <Badge className="bg-gradient-to-r from-purple-500 to-blue-500">
                Level {gameElements.level}
              </Badge>
            </h1>
            <p className="text-muted-foreground">
              Métricas estratégicas com IA preditiva
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm text-muted-foreground">XP Progress</p>
              <Progress 
                value={(gameElements.xp / gameElements.nextLevelXp) * 100} 
                className="w-32"
              />
              <p className="text-xs text-muted-foreground">
                {gameElements.xp}/{gameElements.nextLevelXp} XP
              </p>
            </div>
            <Button 
              variant="outline" 
              onClick={() => triggerDepartmentAlert('Geral', 'Reunião Estratégica')}
            >
              <Bell className="h-4 w-4 mr-2" />
              Alertar Equipe
            </Button>
          </div>
        </div>

        {/* Alertas Inteligentes */}
        {alerts.length > 0 && (
          <div className="space-y-2">
            {alerts.map((alert, index) => (
              <Alert key={index} className={alert.type === 'warning' ? 'border-orange-500' : ''}>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>{alert.message}</AlertDescription>
              </Alert>
            ))}
          </div>
        )}

        {/* KPIs Principais com IA */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card className="relative overflow-hidden">
            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-green-400/20 to-transparent"></div>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">MRR</CardTitle>
              <DollarSign className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                R$ {metrics.mrr.toLocaleString()}
              </div>
              <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                <TrendingUp className="h-3 w-3 text-green-600" />
                <span>+{((metrics.newMrr + metrics.expansionMrr - metrics.churnedMrr) / metrics.mrr * 100).toFixed(1)}% vs mês anterior</span>
              </div>
              <div className="mt-2">
                <Button 
                  size="sm" 
                  variant="ghost" 
                  onClick={() => triggerDepartmentAlert('Vendas', 'Meta MRR')}
                  className="text-xs"
                >
                  Alertar Vendas
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden">
            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-blue-400/20 to-transparent"></div>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Churn Rate (IA)</CardTitle>
              <Brain className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {metrics.churnRate.toFixed(1)}%
              </div>
              <div className="flex items-center space-x-2 text-xs">
                {aiPredictions.churnRisk.trend === 'down' ? (
                  <ChevronDown className="h-3 w-3 text-green-600" />
                ) : (
                  <ChevronUp className="h-3 w-3 text-red-600" />
                )}
                <span className="text-muted-foreground">
                  IA: {aiPredictions.churnRisk.confidence}% confiança
                </span>
              </div>
              <div className="mt-2">
                <Button 
                  size="sm" 
                  variant="ghost" 
                  onClick={() => triggerDepartmentAlert('Customer Success', 'Prevenção Churn')}
                  className="text-xs"
                >
                  Alertar CS
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden">
            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-purple-400/20 to-transparent"></div>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">LTV/CAC</CardTitle>
              <Target className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {(metrics.ltv / metrics.cac).toFixed(1)}x
              </div>
              <div className="text-xs text-muted-foreground">
                LTV: R$ {metrics.ltv.toLocaleString()} | CAC: R$ {metrics.cac.toLocaleString()}
              </div>
              <div className="mt-2">
                <Button 
                  size="sm" 
                  variant="ghost" 
                  onClick={() => triggerDepartmentAlert('Marketing', 'Otimização CAC')}
                  className="text-xs"
                >
                  Alertar Marketing
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden">
            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-orange-400/20 to-transparent"></div>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Runway</CardTitle>
              <Clock className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {metrics.runway} meses
              </div>
              <div className="text-xs text-muted-foreground">
                Burn Rate: R$ {metrics.burnRate.toLocaleString()}/mês
              </div>
              <div className="mt-2">
                <Button 
                  size="sm" 
                  variant="ghost" 
                  onClick={() => triggerDepartmentAlert('Financeiro', 'Controle Burn Rate')}
                  className="text-xs"
                >
                  Alertar CFO
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="overview" className="space-y-6 flex flex-col h-full">
          <TabsList className="grid w-full grid-cols-6 flex-shrink-0">
            <TabsTrigger value="overview">Visão Geral</TabsTrigger>
            <TabsTrigger value="revenue">Receita</TabsTrigger>
            <TabsTrigger value="ai-insights">IA Insights</TabsTrigger>
            <TabsTrigger value="gamification">Gamificação</TabsTrigger>
            <TabsTrigger value="alerts">Alertas</TabsTrigger>
            <TabsTrigger value="documentation">Docs</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="flex-1 overflow-y-auto">
            <div className="grid gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Visão Geral do Negócio</CardTitle>
                  <CardDescription>Principais métricas e indicadores</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <div className="text-center p-4 border rounded-lg">
                      <p className="text-2xl font-bold text-green-600">R$ {metrics.mrr.toLocaleString()}</p>
                      <p className="text-sm text-muted-foreground">MRR</p>
                    </div>
                    <div className="text-center p-4 border rounded-lg">
                      <p className="text-2xl font-bold text-blue-600">R$ {metrics.arr.toLocaleString()}</p>
                      <p className="text-sm text-muted-foreground">ARR</p>
                    </div>
                    <div className="text-center p-4 border rounded-lg">
                      <p className="text-2xl font-bold text-purple-600">{(metrics.ltv / metrics.cac).toFixed(1)}x</p>
                      <p className="text-sm text-muted-foreground">LTV/CAC</p>
                    </div>
                    <div className="text-center p-4 border rounded-lg">
                      <p className="text-2xl font-bold text-orange-600">{metrics.churnRate}%</p>
                      <p className="text-sm text-muted-foreground">Churn Rate</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="grid gap-6 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Saúde Financeira</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between">
                        <span>Burn Rate</span>
                        <span className="font-medium">R$ {metrics.burnRate.toLocaleString()}/mês</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Runway</span>
                        <span className="font-medium">{metrics.runway} meses</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Margem Bruta</span>
                        <span className="font-medium">{metrics.grossMargin}%</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Métricas de Produto</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between">
                        <span>Taxa de Ativação</span>
                        <span className="font-medium">{metrics.activationRate}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Trial → Paid</span>
                        <span className="font-medium">{metrics.trialToPaid}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>DAU/MAU</span>
                        <span className="font-medium">{metrics.dauMau}%</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="revenue" className="flex-1 overflow-y-auto">
            <div className="grid gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Análise de Receita</CardTitle>
                  <CardDescription>Métricas detalhadas de receita e crescimento</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-3">
                    <div className="text-center p-4 border rounded-lg">
                      <p className="text-2xl font-bold text-green-600">R$ {metrics.mrr.toLocaleString()}</p>
                      <p className="text-sm text-muted-foreground">MRR Atual</p>
                    </div>
                    <div className="text-center p-4 border rounded-lg">
                      <p className="text-2xl font-bold text-blue-600">R$ {metrics.arr.toLocaleString()}</p>
                      <p className="text-sm text-muted-foreground">ARR Atual</p>
                    </div>
                    <div className="text-center p-4 border rounded-lg">
                      <p className="text-2xl font-bold text-purple-600">{metrics.nrr}%</p>
                      <p className="text-sm text-muted-foreground">Net Revenue Retention</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="ai-insights" className="flex-1 overflow-y-auto">
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Brain className="h-5 w-5 text-blue-600" />
                    Previsões de IA
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm font-medium">Receita Próximo Mês</p>
                    <p className="text-2xl font-bold text-green-600">
                      R$ {aiPredictions.revenueForcast.nextMonth.toLocaleString()}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {aiPredictions.revenueForcast.confidence}% de confiança
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Novos Clientes (30 dias)</p>
                    <p className="text-2xl font-bold text-blue-600">
                      +{aiPredictions.customerGrowth.prediction}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {aiPredictions.customerGrowth.confidence}% de confiança
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="h-5 w-5 text-yellow-600" />
                    Recomendações IA
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <p className="text-sm font-medium">Otimização Burn Rate</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {aiPredictions.burnRateOptimization.recommendation}
                      </p>
                      <p className="text-sm font-bold text-green-600 mt-2">
                        Impacto: R$ {aiPredictions.burnRateOptimization.impact.toLocaleString()}/mês
                      </p>
                    </div>
                    <Button 
                      onClick={() => triggerDepartmentAlert('Todos', 'Implementar Recomendações IA')}
                      className="w-full"
                    >
                      Implementar Recomendações
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="gamification" className="flex-1 overflow-y-auto">
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Trophy className="h-5 w-5 text-yellow-600" />
                    Conquistas
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {gameElements.achievements.map((achievement, index) => (
                      <div key={index} className={`flex items-center gap-3 p-3 rounded-lg ${achievement.unlocked ? 'bg-green-50' : 'bg-gray-50'}`}>
                        <Star className={`h-5 w-5 ${achievement.unlocked ? 'text-yellow-500' : 'text-gray-400'}`} />
                        <div>
                          <p className="font-medium">{achievement.name}</p>
                          <p className="text-xs text-muted-foreground">{achievement.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Rocket className="h-5 w-5 text-purple-600" />
                    Ranking Founder
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center space-y-4">
                    <div>
                      <p className="text-3xl font-bold text-purple-600">
                        #{gameElements.leaderboard.position}
                      </p>
                      <p className="text-muted-foreground">
                        de {gameElements.leaderboard.totalFounders} founders
                      </p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm font-medium">Badges Conquistadas</p>
                      <div className="flex flex-wrap gap-2">
                        {gameElements.badges.map((badge, index) => (
                          <Badge key={index} variant="secondary">
                            {badge}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="alerts" className="flex-1 overflow-y-auto">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5 text-red-600" />
                  Central de Alertas Departamentais
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  <Button 
                    variant="outline" 
                    onClick={() => triggerDepartmentAlert('Vendas', 'Meta MRR não atingida')}
                    className="h-20 flex-col gap-2"
                  >
                    <Briefcase className="h-6 w-6" />
                    <span>Alertar Vendas</span>
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => triggerDepartmentAlert('Marketing', 'CAC acima do target')}
                    className="h-20 flex-col gap-2"
                  >
                    <Target className="h-6 w-6" />
                    <span>Alertar Marketing</span>
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => triggerDepartmentAlert('Customer Success', 'Churn elevado')}
                    className="h-20 flex-col gap-2"
                  >
                    <Users className="h-6 w-6" />
                    <span>Alertar CS</span>
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => triggerDepartmentAlert('Produto', 'Baixa ativação')}
                    className="h-20 flex-col gap-2"
                  >
                    <Activity className="h-6 w-6" />
                    <span>Alertar Produto</span>
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => triggerDepartmentAlert('Financeiro', 'Burn rate alto')}
                    className="h-20 flex-col gap-2"
                  >
                    <BarChart3 className="h-6 w-6" />
                    <span>Alertar CFO</span>
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => triggerDepartmentAlert('Geral', 'Reunião de resultados')}
                    className="h-20 flex-col gap-2"
                  >
                    <Calendar className="h-6 w-6" />
                    <span>Reunião Geral</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="documentation" className="flex-1 overflow-y-auto">
            <FounderDocumentationTab />
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

// Wrapper function for stability tracking
const withStabilityTracking = (componentName: string) => (WrappedComponent: React.ComponentType<any>) => {
  return WrappedComponent;
};

export const FounderDashboard = withStabilityTracking('FounderDashboard')(FounderDashboardComponent);