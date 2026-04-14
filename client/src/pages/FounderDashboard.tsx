import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { FounderDocumentationTab } from '@/components/founder/FounderDocumentationTab';
import { FounderVersionsTab } from '@/components/founder/FounderVersionsTab';
import { StrategicVisionHub } from './strategic-vision/StrategicVisionHub';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAuth } from '@/contexts/AuthContext';
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
  ChevronDown,
  Download,
  Image,
  Palette,
  CheckCircle,
  Gift
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

interface Creative {
  id: string;
  name: string;
  description: string;
  category: string;
  primaryColor: string;
  secondaryColor: string;
  textStyle: string;
}

export const FounderDashboardComponent = () => {
  console.log('🚀 FounderDashboard component iniciando...');
  const { user } = useAuth();
  const { toast } = useToast();
  const { isFounder, isLoading } = useFounderAccess();
  const navigate = useNavigate();

  console.log('🔍 FounderDashboard - Hook results:', { 
    isFounder, 
    isLoading, 
    userEmail: user?.email,
    userRole: user?.role 
  });
  const [metrics, setMetrics] = useState<BusinessMetrics | null>(null);
  const [aiPredictions, setAiPredictions] = useState<AIPredictions | null>(null);
  const [gameElements, setGameElements] = useState<GameElements | null>(null);
  const [loading, setLoading] = useState(true);
  const [alerts, setAlerts] = useState<Array<{ type: 'warning' | 'info' | 'success'; message: string }>>([]);
  const [expandedKPI, setExpandedKPI] = useState<string | null>(null);
  const [expandedUserCard, setExpandedUserCard] = useState<string | null>(null);

  console.log('🔍 FounderDashboard - Estado atual:', {
    user: user ? { name: user.name, email: user.email } : null,
    isFounder,
    isLoading,
    loading,
    hasMetrics: !!metrics
  });

  useEffect(() => {
    console.log('🔄 FounderDashboard - useEffect executando, isFounder:', isFounder, 'isLoading:', isLoading);
    if (!isLoading && isFounder) {
      console.log('✅ FounderDashboard - Carregando dados do founder...');
      loadFounderData();
    }
  }, [isFounder, isLoading, user?.id]);

  const loadFounderData = async () => {
    console.log('🔄 loadFounderData - Iniciando carregamento...', { userId: user?.id });
    if (!user?.id) {
      console.log('❌ loadFounderData - Sem userId, retornando');
      return;
    }

    setLoading(true);
    try {
      console.log('📊 loadFounderData - Gerando métricas simuladas...');
      // Simular métricas de negócio (sem Supabase por enquanto)
      const currentMetrics: BusinessMetrics = {
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
      const currentGame: GameElements = {
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

      console.log('✅ loadFounderData - Dados carregados com sucesso:', {
        metrics: !!currentMetrics,
        game: !!currentGame,
        predictions: !!predictions
      });

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

  const downloadCreative = (creativeId: string, creativeName: string) => {
    const creative = creatives.find(c => c.id === creativeId);
    if (!creative) return;

    const canvas = document.createElement('canvas');
    canvas.width = 1080;
    canvas.height = 1320;
    const ctx = canvas.getContext('2d');

    if (ctx) {
      // Configurar qualidade alta
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';

      // Criar fundo com gradiente personalizado
      const gradient = ctx.createLinearGradient(0, 0, 1080, 1320);
      gradient.addColorStop(0, creative.primaryColor);
      gradient.addColorStop(0.6, creative.secondaryColor);
      gradient.addColorStop(1, '#1a1a2e');

      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 1080, 1320);

      // Adicionar padrão geométrico de fundo
      ctx.globalAlpha = 0.1;
      ctx.strokeStyle = 'white';
      ctx.lineWidth = 2;
      for (let i = 0; i < 12; i++) {
        ctx.beginPath();
        ctx.arc(540 + Math.cos(i * 30 * Math.PI / 180) * 400, 660 + Math.sin(i * 30 * Math.PI / 180) * 400, 200, 0, 2 * Math.PI);
        ctx.stroke();
      }
      ctx.globalAlpha = 1;

      // Header com logo
      ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
      ctx.fillRect(0, 0, 1080, 120);

      // Logo simulado (círculo com ícone)
      ctx.fillStyle = creative.primaryColor;
      ctx.beginPath();
      ctx.arc(100, 60, 35, 0, 2 * Math.PI);
      ctx.fill();

      // Desenhar ícone do cérebro simplificado
      ctx.strokeStyle = 'white';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(100, 55, 15, 0, Math.PI);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(95, 60, 10, 0, Math.PI);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(105, 60, 10, 0, Math.PI);
      ctx.stroke();

      // Nome da marca
      ctx.fillStyle = '#1a1a2e';
      ctx.font = 'bold 42px Arial, sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText('HumanSys', 160, 75);

      // Slogan
      ctx.font = '20px Arial, sans-serif';
      ctx.fillStyle = '#666';
      ctx.fillText('IA Organizacional', 160, 100);

      // Título principal
      ctx.fillStyle = 'white';
      ctx.font = 'bold 64px Arial, sans-serif';
      ctx.textAlign = 'center';
      ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
      ctx.shadowBlur = 10;
      ctx.shadowOffsetY = 5;

      // Quebrar título em múltiplas linhas se necessário
      const titleWords = creative.name.split(' ');
      let currentLine = '';
      let lineHeight = 70;
      let startY = 220;

      for (let word of titleWords) {
        const testLine = currentLine + word + ' ';
        const metrics = ctx.measureText(testLine);
        if (metrics.width > 950 && currentLine !== '') {
          ctx.fillText(currentLine.trim(), 540, startY);
          currentLine = word + ' ';
          startY += lineHeight;
        } else {
          currentLine = testLine;
        }
      }
      ctx.fillText(currentLine.trim(), 540, startY);

      // Reset shadow
      ctx.shadowBlur = 0;
      ctx.shadowOffsetY = 0;

      // Descrição
      ctx.font = '32px Arial, sans-serif';
      ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
      const descY = startY + 80;
      const descWords = creative.description.split(' ');
      let descLine = '';
      let descStartY = descY;

      for (let word of descWords) {
        const testLine = descLine + word + ' ';
        const metrics = ctx.measureText(testLine);
        if (metrics.width > 900 && descLine !== '') {
          ctx.fillText(descLine.trim(), 540, descStartY);
          descLine = word + ' ';
          descStartY += 40;
        } else {
          descLine = testLine;
        }
      }
      ctx.fillText(descLine.trim(), 540, descStartY);

      // Seção de benefícios/recursos
      const benefitsY = descStartY + 80;
      const benefits = {
        'DISC': ['✓ Análise comportamental em 5 min', '✓ 94% de precisão comprovada', '✓ Relatórios automáticos'],
        'IA': ['✓ Predição de turnover', '✓ Insights em tempo real', '✓ Automação inteligente'],
        'Gestão': ['✓ Centralização de dados', '✓ Processos otimizados', '✓ ROI de 340%'],
        'Engajamento': ['✓ Feedback 360°', '✓ Gamificação', '✓ Clima organizacional'],
        'ROI': ['✓ Economia de 70% no tempo', '✓ Redução de 50% no turnover', '✓ Aumento de 60% na produtividade'],
        'Automação': ['✓ 80% das tarefas automatizadas', '✓ Integração completa', '✓ Suporte 24/7']
      };

      const categoryBenefits = benefits[creative.category] || benefits['IA'];

      ctx.font = '28px Arial, sans-serif';
      ctx.fillStyle = 'white';
      let benefitY = benefitsY;

      for (let benefit of categoryBenefits) {
        ctx.fillText(benefit, 540, benefitY);
        benefitY += 45;
      }

      // Métricas em destaque
      const metricsY = benefitY + 60;
      ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
      ctx.fillRect(80, metricsY - 40, 920, 160);

      ctx.fillStyle = creative.primaryColor;
      ctx.font = 'bold 48px Arial, sans-serif';
      ctx.textAlign = 'left';

      const metrics = [
        { value: 'R$ 450K', label: 'MRR Atual' },
        { value: '127', label: 'Empresas' },
        { value: '2.1%', label: 'Churn Rate' }
      ];

      let metricX = 140;
      for (let metric of metrics) {
        ctx.fillText(metric.value, metricX, metricsY);
        ctx.font = '20px Arial, sans-serif';
        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        ctx.fillText(metric.label, metricX, metricsY + 30);
        ctx.font = 'bold 48px Arial, sans-serif';
        ctx.fillStyle = creative.primaryColor;
        metricX += 280;
      }

      // Call to Action
      const ctaY = metricsY + 140;
      ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
      ctx.fillRect(140, ctaY, 800, 100);

      ctx.fillStyle = creative.primaryColor;
      ctx.font = 'bold 36px Arial, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('Agende uma demonstração gratuita', 540, ctaY + 45);

      ctx.font = '24px Arial, sans-serif';
      ctx.fillStyle = '#666';
      ctx.fillText('fernando@humansys.com.br • (11) 98765-4321', 540, ctaY + 75);

      // Footer
      ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
      ctx.fillRect(0, 1220, 1080, 100);

      ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
      ctx.font = '18px Arial, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('www.humansys.com.br', 540, 1250);
      ctx.fillText('Transformando o RH com Inteligência Artificial', 540, 1280);

      // Adicionar QR Code simulado
      ctx.fillStyle = 'white';
      ctx.fillRect(920, 1150, 120, 120);
      ctx.fillStyle = '#000';
      ctx.font = '12px Arial, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('QR CODE', 980, 1215);

      // Converter para blob e fazer download
      canvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `HumanSys_${creative.category}_${creativeName.replace(/\s+/g, '_')}_1080x1320.png`;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);

          toast({
            title: "Criativo Gerado com Sucesso!",
            description: `${creativeName} - Design profissional com recursos detalhados`,
          });
        }
      }, 'image/png', 0.95);
    }
  };

  if (isLoading) {
    console.log('🔄 FounderDashboard - Ainda verificando acesso...');
    return (
      <DashboardLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <Brain className="h-12 w-12 animate-pulse mx-auto mb-4 text-primary" />
            <p className="text-lg font-medium">Verificando acesso...</p>
            <p className="text-muted-foreground">Aguarde um momento</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (loading) {
    console.log('🔄 FounderDashboard - Carregando métricas...');
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
    console.log('❌ FounderDashboard - Acesso negado para usuário:', user?.email);
    return (
      <DashboardLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center space-y-4">
            <Crown className="h-16 w-16 mx-auto text-yellow-500" />
            <h2 className="text-2xl font-bold">Acesso Restrito</h2>
            <p className="text-muted-foreground">Este dashboard é exclusivo para founders.</p>
            <p className="text-xs text-muted-foreground">
              Usuário atual: {user?.email}
            </p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (!metrics || !gameElements || !aiPredictions) {
    console.log('❌ FounderDashboard - Dados não carregados ainda:', {
      metrics: !!metrics,
      gameElements: !!gameElements,
      aiPredictions: !!aiPredictions,
      loading,
      isFounder,
      isLoading
    });

    // Se não estiver carregando e é founder, mas dados não estão prontos
    if (!loading && isFounder && !isLoading) {
      console.log('🔄 FounderDashboard - Forçando carregamento dos dados...');
      setTimeout(() => loadFounderData(), 100);
    }

    return (
      <DashboardLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <Brain className="h-12 w-12 animate-pulse mx-auto mb-4 text-primary" />
            <p className="text-lg font-medium">Preparando Dashboard Founder...</p>
            <p className="text-muted-foreground">Carregando métricas e dados</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  console.log('✅ FounderDashboard - Renderizando dashboard completo!');

  const creatives: Creative[] = [
    {
      id: '1',
      name: 'Análise DISC em 5 Minutos',
      description: 'Mapeamento comportamental completo com 94% de precisão usando IA',
      category: 'DISC',
      primaryColor: '#6366f1',
      secondaryColor: '#8b5cf6',
      textStyle: 'Moderno e Impactante'
    },
    {
      id: '2',
      name: 'IA Preditiva Anti-Turnover',
      description: 'Identifique colaboradores em risco 90 dias antes da saída',
      category: 'IA',
      primaryColor: '#10b981',
      secondaryColor: '#34d399',
      textStyle: 'Tecnológico'
    },
    {
      id: '3',
      name: 'RH 100% Digital e Automatizado',
      description: 'Elimine planilhas e processos manuais para sempre',
      category: 'Gestão',
      primaryColor: '#f59e0b',
      secondaryColor: '#fbbf24',
      textStyle: 'Corporativo Elegante'
    },
    {
      id: '4',
      name: 'Engajamento que Gera Resultados',
      description: 'Aumente produtividade em 60% com gamificação e feedback 360°',
      category: 'Engajamento',
      primaryColor: '#ef4444',
      secondaryColor: '#f87171',
      textStyle: 'Dinâmico'
    },
    {
      id: '5',
      name: 'ROI Comprovado de 340%',
      description: 'Retorno garantido em 12 meses com dados reais de 127 empresas',
      category: 'ROI',
      primaryColor: '#8b5cf6',
      secondaryColor: '#a78bfa',
      textStyle: 'Focado em Resultados'
    },
    {
      id: '6',
      name: 'Zero Trabalho Manual no RH',
      description: 'Automação completa: contratação, desenvolvimento e retenção',
      category: 'Automação',
      primaryColor: '#06b6d4',
      secondaryColor: '#22d3ee',
      textStyle: 'Futurista'
    },
    {
      id: '7',
      name: 'Dashboard Executivo Inteligente',
      description: 'Métricas de RH em tempo real com insights acionáveis',
      category: 'Analytics',
      primaryColor: '#7c3aed',
      secondaryColor: '#a855f7',
      textStyle: 'Executivo'
    },
    {
      id: '8',
      name: 'Onboarding Gamificado',
      description: 'Integração 70% mais rápida com experiência memorável',
      category: 'Onboarding',
      primaryColor: '#059669',
      secondaryColor: '#10b981',
      textStyle: 'Inovador'
    }
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">

        {/* ── Page Header ──────────────────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold tracking-tight flex items-center gap-2.5">
              <Crown className="h-7 w-7 text-yellow-500 flex-shrink-0" />
              Founder Dashboard
              <Badge className="bg-gradient-to-r from-purple-500 to-blue-500 text-xs font-bold">
                Nível {gameElements.level}
              </Badge>
            </h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              Métricas estratégicas com predição por IA
            </p>
          </div>
          <div className="flex items-center gap-3 flex-shrink-0">
            <div className="hidden sm:block text-right">
              <p className="text-xs text-muted-foreground">XP — Nível {gameElements.level}</p>
              <Progress
                value={(gameElements.xp / gameElements.nextLevelXp) * 100}
                className="w-32 h-2 mt-1"
              />
              <p className="text-xs text-muted-foreground mt-0.5">
                {gameElements.xp.toLocaleString()} / {gameElements.nextLevelXp.toLocaleString()}
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => triggerDepartmentAlert('Geral', 'Reunião Estratégica')}
            >
              <Bell className="h-4 w-4 mr-2" />
              Alertar Equipe
            </Button>
          </div>
        </div>

        {/* ── Smart Alerts ─────────────────────────────────────────────── */}
        {alerts.length > 0 && (
          <div className="space-y-2">
            {alerts.map((alert, index) => (
              <Alert key={index} className={alert.type === 'warning' ? 'border-amber-500/50 bg-amber-50/50 dark:bg-amber-950/20' : ''}>
                <AlertTriangle className="h-4 w-4 text-amber-500" />
                <AlertDescription className="ml-2">{alert.message}</AlertDescription>
              </Alert>
            ))}
          </div>
        )}

        {/* ── KPI Top Row ───────────────────────────────────────────────── */}
        <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
          {[
            {
              id: 'mrr', label: 'MRR', sublabel: 'Receita Recorrente Mensal',
              value: `R$ ${(metrics.mrr / 1000).toFixed(0)}k`,
              trend: `+${((metrics.newMrr + metrics.expansionMrr - metrics.churnedMrr) / metrics.mrr * 100).toFixed(1)}%`,
              trendUp: true, icon: DollarSign, color: 'text-emerald-500', accent: 'from-emerald-500/10'
            },
            {
              id: 'churn', label: 'Churn Rate', sublabel: `Conf. IA ${aiPredictions.churnRisk.confidence}%`,
              value: `${metrics.churnRate.toFixed(1)}%`,
              trend: aiPredictions.churnRisk.trend === 'down' ? '↓ Diminuindo' : '↑ Aumentando',
              trendUp: aiPredictions.churnRisk.trend === 'down', icon: Brain, color: 'text-blue-500', accent: 'from-blue-500/10'
            },
            {
              id: 'ltv', label: 'LTV / CAC', sublabel: 'Razão ideal ≥ 3x',
              value: `${(metrics.ltv / metrics.cac).toFixed(1)}x`,
              trend: (metrics.ltv / metrics.cac) >= 3 ? '✓ Saudável' : '⚠ Atenção',
              trendUp: (metrics.ltv / metrics.cac) >= 3, icon: Target, color: 'text-purple-500', accent: 'from-purple-500/10'
            },
            {
              id: 'runway', label: 'Runway', sublabel: `Burn R$ ${(metrics.burnRate/1000).toFixed(0)}k/mês`,
              value: `${metrics.runway} meses`,
              trend: metrics.runway >= 18 ? '✓ Seguro' : '⚠ Atenção',
              trendUp: metrics.runway >= 18, icon: Clock, color: 'text-orange-500', accent: 'from-orange-500/10'
            },
          ].map(kpi => {
            const Icon = kpi.icon;
            return (
              <button key={kpi.id} onClick={() => setExpandedKPI(kpi.id)} className="text-left">
                <Card className="relative overflow-hidden hover:shadow-md transition-all duration-200 cursor-pointer group">
                  <div className={`absolute inset-0 bg-gradient-to-br ${kpi.accent} to-transparent opacity-0 group-hover:opacity-100 transition-opacity`} />
                  <CardContent className="p-4 relative">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">{kpi.label}</span>
                      <Icon className={`h-4 w-4 ${kpi.color}`} />
                    </div>
                    <div className="text-2xl font-bold">{kpi.value}</div>
                    <div className={`text-xs mt-1 font-medium ${kpi.trendUp ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-500 dark:text-red-400'}`}>
                      {kpi.trend}
                    </div>
                    <div className="text-xs text-muted-foreground mt-0.5">{kpi.sublabel}</div>
                  </CardContent>
                </Card>
              </button>
            );
          })}
        </div>

        {/* Modais de Expansão dos KPIs */}
        <Dialog open={expandedKPI === 'mrr'} onOpenChange={(open) => !open && setExpandedKPI(null)}>
          <DialogContent className="max-w-sm">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-green-600" />
                MRR - Receita Recorrente Mensal
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg">
                <p className="text-3xl font-bold text-green-600">R$ {metrics.mrr.toLocaleString()}</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Variação: <span className="text-green-600 font-medium">+{((metrics.newMrr + metrics.expansionMrr - metrics.churnedMrr) / metrics.mrr * 100).toFixed(1)}% vs mês anterior</span></p>
                <p className="text-sm text-muted-foreground">MRR Novo: <span className="font-medium">R$ {metrics.newMrr.toLocaleString()}</span></p>
                <p className="text-sm text-muted-foreground">MRR Expansão: <span className="font-medium">R$ {metrics.expansionMrr.toLocaleString()}</span></p>
                <p className="text-sm text-muted-foreground">MRR Churn: <span className="font-medium text-red-600">-R$ {metrics.churnedMrr.toLocaleString()}</span></p>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        <Dialog open={expandedKPI === 'churn'} onOpenChange={(open) => !open && setExpandedKPI(null)}>
          <DialogContent className="max-w-sm">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5 text-blue-600" />
                Churn Rate (Predição IA)
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="p-4 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-lg">
                <p className="text-3xl font-bold text-blue-600">{metrics.churnRate.toFixed(1)}%</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Tendência: <span className={`font-medium ${aiPredictions.churnRisk.trend === 'down' ? 'text-green-600' : 'text-red-600'}`}>
                  {aiPredictions.churnRisk.trend === 'down' ? '📉 Diminuindo' : '📈 Aumentando'}
                </span></p>
                <p className="text-sm text-muted-foreground">Confiança IA: <span className="font-medium">{aiPredictions.churnRisk.confidence}%</span></p>
                <p className="text-sm text-muted-foreground">Score de Risco: <span className="font-medium">{aiPredictions.churnRisk.score.toFixed(2)}</span></p>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        <Dialog open={expandedKPI === 'ltv'} onOpenChange={(open) => !open && setExpandedKPI(null)}>
          <DialogContent className="max-w-sm">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-purple-600" />
                LTV/CAC - Valor do Cliente
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="p-4 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg">
                <p className="text-3xl font-bold text-purple-600">{(metrics.ltv / metrics.cac).toFixed(1)}x</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">LTV (Lifetime Value): <span className="font-medium">R$ {metrics.ltv.toLocaleString()}</span></p>
                <p className="text-sm text-muted-foreground">CAC (Customer Acquisition Cost): <span className="font-medium">R$ {metrics.cac.toLocaleString()}</span></p>
                <p className="text-sm text-muted-foreground">Taxa Payback: <span className="font-medium">{metrics.paybackPeriod} meses</span></p>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        <Dialog open={expandedKPI === 'runway'} onOpenChange={(open) => !open && setExpandedKPI(null)}>
          <DialogContent className="max-w-sm">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-orange-600" />
                Runway - Meses até Falência
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="p-4 bg-gradient-to-br from-orange-50 to-yellow-50 dark:from-orange-900/20 dark:to-yellow-900/20 rounded-lg">
                <p className="text-3xl font-bold text-orange-600">{metrics.runway} meses</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Burn Rate: <span className="font-medium">R$ {metrics.burnRate.toLocaleString()}/mês</span></p>
                <p className="text-sm text-muted-foreground">MRR: <span className="font-medium">R$ {metrics.mrr.toLocaleString()}</span></p>
                <p className="text-sm text-muted-foreground">Margem Bruta: <span className="font-medium">{metrics.grossMargin}%</span></p>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        <Tabs defaultValue="overview" className="space-y-6">
          {/* ── Tab Navigation ─────────────────────────────────────────────── */}
          <div className="border-b border-border">
            <TabsList className="flex flex-nowrap gap-0 h-auto justify-start bg-transparent overflow-x-auto [-webkit-overflow-scrolling:touch] w-full rounded-none p-0">
              {[
                { value: 'overview',       short: 'Geral',     full: 'Visão Geral' },
                { value: 'users',          short: 'Usuários',  full: 'Usuários' },
                { value: 'revenue',        short: 'Receita',   full: 'Receita' },
                { value: 'ai-insights',    short: 'IA',        full: 'IA & Predições' },
                { value: 'gamification',   short: 'Gamif.',    full: 'Gamificação' },
                { value: 'alerts',         short: 'Alertas',   full: 'Alertas' },
                { value: 'pitch',          short: 'Pitch',     full: 'Pitch Deck' },
                { value: 'creatives',      short: 'Criativos', full: 'Criativos' },
                { value: 'documentation', short: 'Docs',      full: 'Documentação' },
                { value: 'versions',       short: 'Versões',   full: 'Versões' },
                { value: 'strategy',       short: 'Strat.',    full: 'Estratégia' },
              ].map(tab => (
                <TabsTrigger
                  key={tab.value}
                  value={tab.value}
                  className="
                    relative flex-shrink-0 px-3 md:px-4 py-2.5 text-xs md:text-sm font-medium whitespace-nowrap
                    text-muted-foreground border-b-2 border-transparent rounded-none bg-transparent
                    hover:text-foreground hover:border-border
                    data-[state=active]:text-foreground data-[state=active]:border-emerald-500
                    transition-all duration-200
                  "
                >
                  <span className="md:hidden">{tab.short}</span>
                  <span className="hidden md:inline">{tab.full}</span>
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

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

          <TabsContent value="users" className="flex-1 overflow-y-auto">
            <div className="grid gap-3 xs:gap-4 sm:gap-6">
              {/* Métricas de Usuários - Expandíveis */}
              <div className="grid gap-2 xs:gap-3 sm:gap-4 grid-cols-2 xs:grid-cols-3 sm:grid-cols-4">
                {/* Total Usuários */}
                <button onClick={() => setExpandedUserCard('total')} className="text-left hover:scale-105 transition-transform">
                  <Card className="bg-gradient-to-br from-white to-blue-50/50 dark:from-slate-700 dark:to-blue-950/30 cursor-pointer hover:shadow-lg dark:hover:shadow-lg dark:hover:shadow-blue-500/20 transition-all border dark:border-blue-900/50">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-0.5 p-1 xs:p-2">
                      <CardTitle className="hidden xs:inline text-xs font-medium text-gray-900 dark:text-blue-300">Total</CardTitle>
                      <Users className="xs:hidden h-4 w-4 text-blue-600 dark:text-blue-400" />
                      <Users className="hidden xs:inline h-4 w-4 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                    </CardHeader>
                    <CardContent className="p-1 xs:p-2 pt-0">
                      <div className="text-sm xs:text-base sm:text-xl font-bold text-gray-900 dark:text-blue-200">1,247</div>
                      <div className="hidden xs:inline text-xs text-muted-foreground dark:text-blue-400/70">+12%</div>
                    </CardContent>
                  </Card>
                </button>

                {/* Teste Grátis */}
                <button onClick={() => setExpandedUserCard('trial')} className="text-left hover:scale-105 transition-transform">
                  <Card className="bg-gradient-to-br from-white to-green-50/50 dark:from-slate-700 dark:to-green-950/30 cursor-pointer hover:shadow-lg dark:hover:shadow-lg dark:hover:shadow-green-500/20 transition-all border dark:border-green-900/50">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-0.5 p-1 xs:p-2">
                      <CardTitle className="hidden xs:inline text-xs font-medium text-gray-900 dark:text-green-300">Teste</CardTitle>
                      <Gift className="xs:hidden h-4 w-4 text-green-600 dark:text-green-400" />
                      <Gift className="hidden xs:inline h-4 w-4 text-green-600 dark:text-green-400 flex-shrink-0" />
                    </CardHeader>
                    <CardContent className="p-1 xs:p-2 pt-0">
                      <div className="text-sm xs:text-base sm:text-xl font-bold text-gray-900 dark:text-green-200">387</div>
                      <div className="hidden xs:inline text-xs text-muted-foreground dark:text-green-400/70">31%</div>
                    </CardContent>
                  </Card>
                </button>

                {/* Pagantes */}
                <button onClick={() => setExpandedUserCard('paid')} className="text-left hover:scale-105 transition-transform">
                  <Card className="bg-gradient-to-br from-white to-purple-50/50 dark:from-slate-700 dark:to-purple-950/30 cursor-pointer hover:shadow-lg dark:hover:shadow-lg dark:hover:shadow-purple-500/20 transition-all border dark:border-purple-900/50">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-0.5 p-1 xs:p-2">
                      <CardTitle className="hidden xs:inline text-xs font-medium text-gray-900 dark:text-purple-300">Pagantes</CardTitle>
                      <DollarSign className="xs:hidden h-4 w-4 text-purple-600 dark:text-purple-400" />
                      <DollarSign className="hidden xs:inline h-4 w-4 text-purple-600 dark:text-purple-400 flex-shrink-0" />
                    </CardHeader>
                    <CardContent className="p-1 xs:p-2 pt-0">
                      <div className="text-sm xs:text-base sm:text-xl font-bold text-gray-900 dark:text-purple-200">623</div>
                      <div className="hidden xs:inline text-xs text-muted-foreground dark:text-purple-400/70">50%</div>
                    </CardContent>
                  </Card>
                </button>

                {/* Inativos */}
                <button onClick={() => setExpandedUserCard('inactive')} className="text-left hover:scale-105 transition-transform">
                  <Card className="bg-gradient-to-br from-white to-red-50/50 dark:from-slate-700 dark:to-red-950/30 cursor-pointer hover:shadow-lg dark:hover:shadow-lg dark:hover:shadow-red-500/20 transition-all border dark:border-red-900/50">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-0.5 p-1 xs:p-2">
                      <CardTitle className="hidden xs:inline text-xs font-medium text-gray-900 dark:text-red-300">Inativos</CardTitle>
                      <AlertTriangle className="xs:hidden h-4 w-4 text-red-600 dark:text-red-400" />
                      <AlertTriangle className="hidden xs:inline h-4 w-4 text-red-600 dark:text-red-400 flex-shrink-0" />
                    </CardHeader>
                    <CardContent className="p-1 xs:p-2 pt-0">
                      <div className="text-sm xs:text-base sm:text-xl font-bold text-gray-900 dark:text-red-200">237</div>
                      <div className="hidden xs:inline text-xs text-muted-foreground dark:text-red-400/70">19%</div>
                    </CardContent>
                  </Card>
                </button>
              </div>

              {/* Modais de Usuários */}
              <Dialog open={expandedUserCard === 'total'} onOpenChange={(open) => !open && setExpandedUserCard(null)}>
                <DialogContent className="max-w-sm dark:bg-gray-800 dark:border-gray-700 dark:text-white [&>button]:text-emerald-600 [&>button]:hover:bg-emerald-100 dark:[&>button]:text-emerald-400 dark:[&>button]:hover:bg-gray-700">
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                      <Users className="h-5 w-5 text-blue-600" />
                      Total de Usuários
                    </DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="p-4 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-lg">
                      <p className="text-3xl font-bold text-blue-600">1,247</p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">Crescimento: <span className="text-green-600 font-medium">+12% vs mês anterior</span></p>
                      <p className="text-sm text-muted-foreground">Novos usuários: <span className="font-medium">+148 este mês</span></p>
                      <p className="text-sm text-muted-foreground">Taxa de retenção: <span className="font-medium">87%</span></p>
                      <p className="text-sm text-muted-foreground">Média por dia: <span className="font-medium">+4.8 usuários</span></p>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>

              <Dialog open={expandedUserCard === 'trial'} onOpenChange={(open) => !open && setExpandedUserCard(null)}>
                <DialogContent className="max-w-sm dark:bg-gray-800 dark:border-gray-700 dark:text-white [&>button]:text-emerald-600 [&>button]:hover:bg-emerald-100 dark:[&>button]:text-emerald-400 dark:[&>button]:hover:bg-gray-700">
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                      <Gift className="h-5 w-5 text-green-600" />
                      Usuários em Teste
                    </DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg">
                      <p className="text-3xl font-bold text-green-600">387</p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">% do total: <span className="font-medium">31%</span></p>
                      <p className="text-sm text-muted-foreground">Conversão esperada: <span className="font-medium">42%</span></p>
                      <p className="text-sm text-muted-foreground">Tempo médio trial: <span className="font-medium">14 dias</span></p>
                      <p className="text-sm text-muted-foreground">Taxa ativação: <span className="font-medium">68%</span></p>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>

              <Dialog open={expandedUserCard === 'paid'} onOpenChange={(open) => !open && setExpandedUserCard(null)}>
                <DialogContent className="max-w-sm dark:bg-gray-800 dark:border-gray-700 dark:text-white [&>button]:text-emerald-600 [&>button]:hover:bg-emerald-100 dark:[&>button]:text-emerald-400 dark:[&>button]:hover:bg-gray-700">
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                      <DollarSign className="h-5 w-5 text-purple-600" />
                      Usuários Pagantes
                    </DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="p-4 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg">
                      <p className="text-3xl font-bold text-purple-600">623</p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">% do total: <span className="font-medium">50%</span></p>
                      <p className="text-sm text-muted-foreground">MRR total: <span className="font-medium">R$ 45.000</span></p>
                      <p className="text-sm text-muted-foreground">ARPU: <span className="font-medium">R$ 72,23</span></p>
                      <p className="text-sm text-muted-foreground">Crescimento: <span className="text-green-600 font-medium">+8% este mês</span></p>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>

              <Dialog open={expandedUserCard === 'inactive'} onOpenChange={(open) => !open && setExpandedUserCard(null)}>
                <DialogContent className="max-w-sm dark:bg-gray-800 dark:border-gray-700 dark:text-white [&>button]:text-emerald-600 [&>button]:hover:bg-emerald-100 dark:[&>button]:text-emerald-400 dark:[&>button]:hover:bg-gray-700">
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                      <AlertTriangle className="h-5 w-5 text-red-600" />
                      Usuários Inativos
                    </DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="p-4 bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 rounded-lg">
                      <p className="text-3xl font-bold text-red-600">237</p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">% do total: <span className="font-medium">19%</span></p>
                      <p className="text-sm text-muted-foreground">Últimos 30 dias: <span className="font-medium">189 usuários</span></p>
                      <p className="text-sm text-muted-foreground">Risco de churn: <span className="text-orange-600 font-medium">Alto</span></p>
                      <p className="text-sm text-muted-foreground">Alvo reengajamento: <span className="font-medium">54 usuários</span></p>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>

              {/* Tabela de Usuários - Responsiva */}
              <Card className="dark:bg-gray-800/50 dark:border-gray-700">
                <CardHeader className="p-2 xs:p-4">
                  <CardTitle className="text-sm xs:text-base text-gray-900 dark:text-white">Lista de Usuários</CardTitle>
                  <CardDescription className="text-xs dark:text-gray-400 hidden xs:inline">Monitoramento em tempo real</CardDescription>
                </CardHeader>
                <CardContent className="p-2 xs:p-4 overflow-x-auto">
                  {/* Mobile: Stack Cards */}
                  <div className="xs:hidden space-y-2">
                    {[
                      { nome: 'João Silva', email: 'joao@empresa.com', status: 'Ativo', plano: 'Teste', statusColor: 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300' },
                      { nome: 'Maria Santos', email: 'maria@startup.com', status: 'Pagante', plano: 'Pro', statusColor: 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300' },
                      { nome: 'Pedro Costa', email: 'pedro@tech.com', status: 'Expirado', plano: 'Teste', statusColor: 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300' },
                      { nome: 'Ana Lima', email: 'ana@consultoria.com', status: 'Ativo', plano: 'Growth', statusColor: 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300' }
                    ].map((user, idx) => (
                      <div key={idx} className="p-2 border border-gray-200 dark:border-gray-600 rounded bg-white dark:bg-gray-800">
                        <p className="font-medium text-sm text-gray-900 dark:text-white">{user.nome}</p>
                        <p className="text-xs text-gray-600 dark:text-gray-400 truncate">{user.email}</p>
                        <div className="flex justify-between items-center mt-1.5">
                          <Badge className={`text-xs ${user.statusColor}`}>{user.status}</Badge>
                          <Button size="sm" variant="ghost" className="h-6 text-xs px-2 dark:text-gray-300 dark:hover:bg-gray-700">Ver</Button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Tablet+: Table */}
                  <div className="hidden xs:block rounded-md border border-gray-200 dark:border-gray-600 overflow-x-auto">
                    <table className="w-full text-xs sm:text-sm bg-white dark:bg-gray-800">
                      <thead>
                        <tr className="border-b border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700/50">
                          <th className="p-1.5 xs:p-2 text-left text-gray-900 dark:text-gray-200 font-semibold">Nome</th>
                          <th className="hidden sm:table-cell p-1.5 xs:p-2 text-left text-gray-900 dark:text-gray-200 font-semibold">Email</th>
                          <th className="p-1.5 xs:p-2 text-left text-gray-900 dark:text-gray-200 font-semibold">Status</th>
                          <th className="hidden md:table-cell p-1.5 xs:p-2 text-left text-gray-900 dark:text-gray-200 font-semibold">Plano</th>
                          <th className="hidden lg:table-cell p-1.5 xs:p-2 text-left text-gray-900 dark:text-gray-200 font-semibold">Acesso</th>
                          <th className="p-1.5 xs:p-2 text-left text-gray-900 dark:text-gray-200 font-semibold">Ações</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700/40">
                          <td className="p-1.5 xs:p-2 text-gray-900 dark:text-gray-100 text-xs sm:text-sm">João Silva</td>
                          <td className="hidden sm:table-cell p-1.5 xs:p-2 text-gray-700 dark:text-gray-300 text-xs truncate">joao@empresa.com</td>
                          <td className="p-1.5 xs:p-2">
                            <Badge className="bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300 text-xs">Ativo</Badge>
                          </td>
                          <td className="hidden md:table-cell p-1.5 xs:p-2 text-gray-700 dark:text-gray-300 text-xs">Teste</td>
                          <td className="hidden lg:table-cell p-1.5 xs:p-2 text-gray-700 dark:text-gray-300 text-xs">Hoje</td>
                          <td className="p-1.5 xs:p-2">
                            <Button size="sm" variant="outline" className="border-gray-300 dark:border-gray-500 text-gray-900 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 text-xs h-6">Ver</Button>
                          </td>
                        </tr>
                        <tr className="border-b border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700/40">
                          <td className="p-1.5 xs:p-2 text-gray-900 dark:text-gray-100 text-xs sm:text-sm">Maria Santos</td>
                          <td className="hidden sm:table-cell p-1.5 xs:p-2 text-gray-700 dark:text-gray-300 text-xs truncate">maria@startup.com</td>
                          <td className="p-1.5 xs:p-2">
                            <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300 text-xs">Pagante</Badge>
                          </td>
                          <td className="hidden md:table-cell p-1.5 xs:p-2 text-gray-700 dark:text-gray-300 text-xs">Pro</td>
                          <td className="hidden lg:table-cell p-1.5 xs:p-2 text-gray-700 dark:text-gray-300 text-xs">Ontem</td>
                          <td className="p-1.5 xs:p-2">
                            <Button size="sm" variant="outline" className="border-gray-300 dark:border-gray-500 text-gray-900 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 text-xs h-6">Ver</Button>
                          </td>
                        </tr>
                        <tr className="border-b border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700/40">
                          <td className="p-1.5 xs:p-2 text-gray-900 dark:text-gray-100 text-xs sm:text-sm">Pedro Costa</td>
                          <td className="hidden sm:table-cell p-1.5 xs:p-2 text-gray-700 dark:text-gray-300 text-xs truncate">pedro@tech.com</td>
                          <td className="p-1.5 xs:p-2">
                            <Badge className="bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300 text-xs">Expirado</Badge>
                          </td>
                          <td className="hidden md:table-cell p-1.5 xs:p-2 text-gray-700 dark:text-gray-300 text-xs">Teste</td>
                          <td className="hidden lg:table-cell p-1.5 xs:p-2 text-gray-700 dark:text-gray-300 text-xs">5d atrás</td>
                          <td className="p-1.5 xs:p-2">
                            <Button size="sm" variant="outline" className="border-gray-300 dark:border-gray-500 text-gray-900 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 text-xs h-6">Reativar</Button>
                          </td>
                        </tr>
                        <tr className="border-b border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700/40">
                          <td className="p-1.5 xs:p-2 text-gray-900 dark:text-gray-100 text-xs sm:text-sm">Ana Lima</td>
                          <td className="hidden sm:table-cell p-1.5 xs:p-2 text-gray-700 dark:text-gray-300 text-xs truncate">ana@consultoria.com</td>
                          <td className="p-1.5 xs:p-2">
                            <Badge className="bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300 text-xs">Ativo</Badge>
                          </td>
                          <td className="hidden md:table-cell p-1.5 xs:p-2 text-gray-700 dark:text-gray-300 text-xs">Growth</td>
                          <td className="hidden lg:table-cell p-1.5 xs:p-2 text-gray-700 dark:text-gray-300 text-xs">2h atrás</td>
                          <td className="p-1.5 xs:p-2">
                            <Button size="sm" variant="outline" className="border-gray-300 dark:border-gray-500 text-gray-900 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 text-xs h-6">Ver</Button>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>

              {/* Filtros e Alertas */}
              <div className="grid gap-6 md:grid-cols-2">
                <Card className="dark:bg-gray-800/50 dark:border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-gray-900 dark:text-white">Usuários Próximos ao Vencimento</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg border border-orange-200 dark:border-orange-900/50">
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">Carlos Mendes</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">carlos@digital.com</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium text-orange-600 dark:text-orange-400">3 dias restantes</p>
                          <Button size="sm" className="mt-1 bg-emerald-500 hover:bg-emerald-600 dark:bg-emerald-600 dark:hover:bg-emerald-700 text-white">Enviar Oferta</Button>
                        </div>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg border border-orange-200 dark:border-orange-900/50">
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">Lucia Rodrigues</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">lucia@empresa.com</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium text-orange-600 dark:text-orange-400">5 dias restantes</p>
                          <Button size="sm" className="mt-1 bg-emerald-500 hover:bg-emerald-600 dark:bg-emerald-600 dark:hover:bg-emerald-700 text-white">Enviar Oferta</Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="dark:bg-gray-800/50 dark:border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-gray-900 dark:text-white">Métricas de Conversão</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-700 dark:text-gray-300">Taxa de Conversão (Teste → Pago)</span>
                        <span className="font-bold text-green-600 dark:text-green-400">23.5%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-700 dark:text-gray-300">Tempo Médio de Conversão</span>
                        <span className="font-bold text-gray-900 dark:text-white">18 dias</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-700 dark:text-gray-300">Taxa de Churn Mensal</span>
                        <span className="font-bold text-red-600 dark:text-red-400">2.8%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-700 dark:text-gray-300">Usuários Ativos (30 dias)</span>
                        <span className="font-bold text-blue-600 dark:text-blue-400">87%</span>
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
                    <div className="p-3 bg-blue-50 dark:bg-blue-900/30 rounded-lg border dark:border-blue-700">
                      <p className="text-sm font-medium">Otimização Burn Rate</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {aiPredictions.burnRateOptimization.recommendation}
                      </p>
                      <p className="text-sm font-bold text-green-600 dark:text-green-400 mt-2">
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
                      <div key={index} className={`flex items-center gap-3 p-3 rounded-lg border ${achievement.unlocked ? 'bg-green-50 dark:bg-green-900/30 dark:border-green-700' : 'bg-gray-50 dark:bg-gray-900/30 dark:border-gray-700'}`}>
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

          <TabsContent value="pitch" className="flex-1 overflow-y-auto">
            <div className="space-y-8">
              {/* Header do Pitch */}
              <Card className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border-2 border-blue-200 dark:border-blue-700">
                <CardHeader className="text-center">
                  <div className="flex justify-center mb-4">
                    <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 rounded-full">
                      <Brain className="h-12 w-12" />
                    </div>
                  </div>
                  <CardTitle className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    HumanSys
                  </CardTitle>
                  <CardDescription className="text-xl font-medium text-gray-700">
                    A Revolução da Gestão de Pessoas com Inteligência Artificial
                  </CardDescription>
                  <div className="flex justify-center gap-3 mt-6 flex-wrap">
                    <Badge className="bg-emerald-500 text-white px-4 py-2 text-sm font-semibold rounded-full hover:bg-emerald-600 transition-colors">SaaS B2B</Badge>
                    <Badge className="bg-blue-500 text-white px-4 py-2 text-sm font-semibold rounded-full hover:bg-blue-600 transition-colors">HR Tech</Badge>
                    <Badge className="bg-purple-500 text-white px-4 py-2 text-sm font-semibold rounded-full hover:bg-purple-600 transition-colors">IA Generativa</Badge>
                  </div>
                </CardHeader>
              </Card>

              {/* Problema & Solução */}
              <div className="grid gap-6 md:grid-cols-2">
                <Card className="border-red-200 dark:border-red-700 bg-red-50 dark:bg-red-900/20">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-red-700">
                      <AlertTriangle className="h-6 w-6" />
                      O Problema
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
                        <p className="text-sm"><strong>89% dos RHs</strong> gastam mais de 60% do tempo em tarefas administrativas</p>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
                        <p className="text-sm"><strong>R$ 87 bilhões</strong> perdidos anualmente por baixo engajamento</p>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
                        <p className="text-sm"><strong>73% das empresas</strong> não têm dados confiáveis sobre seus colaboradores</p>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
                        <p className="text-sm"><strong>Turnover médio de 35%</strong> custa até 150% do salário anual por substituição</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-green-200 dark:border-green-700 bg-green-50 dark:bg-green-900/20">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-green-700">
                      <Zap className="h-6 w-6" />
                      Nossa Solução
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm font-medium text-green-800">
                      Plataforma SaaS completa que automatiza 80% das tarefas de RH com IA
                    </p>
                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                        <p className="text-sm"><strong>Análise DISC automatizada</strong> em 5 minutos</p>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                        <p className="text-sm"><strong>Predição de turnover</strong> com 94% de precisão</p>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                        <p className="text-sm"><strong>Insights em tempo real</strong> sobre engajamento</p>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                        <p className="text-sm"><strong>ROI médio de 340%</strong> em 12 meses</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Mercado & Oportunidade */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-6 w-6 text-blue-600" />
                    Mercado & Oportunidade
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-6 md:grid-cols-3">
                    <div className="text-center p-6 bg-blue-50 dark:bg-blue-900/30 border dark:border-blue-700 rounded-lg">
                      <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">R$ 45B</p>
                      <p className="text-sm text-gray-600 dark:text-gray-300">Mercado HR Tech Brasil</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Crescimento: 23% a.a.</p>
                    </div>
                    <div className="text-center p-6 bg-purple-50 dark:bg-purple-900/30 border dark:border-purple-700 rounded-lg">
                      <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">2.3M</p>
                      <p className="text-sm text-gray-600 dark:text-gray-300">Empresas target no Brasil</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">PMEs com 50+ funcionários</p>
                    </div>
                    <div className="text-center p-6 bg-green-50 dark:bg-green-900/30 border dark:border-green-700 rounded-lg">
                      <p className="text-3xl font-bold text-green-600 dark:text-green-400">R$ 890</p>
                      <p className="text-sm text-gray-600 dark:text-gray-300">Ticket médio mensal</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Precificação por usuário</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Modelo de Negócio */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className="h-6 w-6 text-green-600" />
                    Modelo de Negócio
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-3">
                    <div className="p-4 border rounded-lg bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30 dark:border-blue-700">
                      <h4 className="font-bold text-blue-800 dark:text-blue-300 mb-2">Starter</h4>
                      <p className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-2">R$ 49/usuário</p>
                      <ul className="text-sm space-y-1">
                        <li>• Análise DISC básica</li>
                        <li>• Dashboard executivo</li>
                        <li>• Relatórios mensais</li>
                        <li>• Até 50 usuários</li>
                      </ul>
                    </div>
                    <div className="p-4 border-2 border-purple-300 dark:border-purple-700 rounded-lg bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/30 dark:to-purple-800/30 relative">
                      <Badge className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-purple-500">Mais Popular</Badge>
                      <h4 className="font-bold text-purple-800 dark:text-purple-300 mb-2">Professional</h4>
                      <p className="text-2xl font-bold text-purple-600 dark:text-purple-400 mb-2">R$ 89/usuário</p>
                      <ul className="text-sm space-y-1">
                        <li>• Tudo do Starter +</li>
                        <li>• IA preditiva avançada</li>
                        <li>• Integração completa</li>
                        <li>• Usuários ilimitados</li>
                      </ul>
                    </div>
                    <div className="p-4 border rounded-lg bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/30 dark:to-green-800/30 dark:border-green-700">
                      <h4 className="font-bold text-green-800 dark:text-green-300 mb-2">Enterprise</h4>
                      <p className="text-2xl font-bold text-green-600 dark:text-green-400 mb-2">Customizado</p>
                      <ul className="text-sm space-y-1">
                        <li>• Tudo do Professional +</li>
                        <li>• White label</li>
                        <li>• API dedicada</li>
                        <li>• Suporte 24/7</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Métricas de Tração */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-6 w-6 text-green-600" />
                    Tração & Métricas
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-4">
                    <div className="text-center p-4 bg-green-50 dark:bg-green-900/30 border dark:border-green-700 rounded-lg">
                      <p className="text-2xl font-bold text-green-600 dark:text-green-400">R$ 450K</p>
                      <p className="text-sm text-gray-600 dark:text-gray-300">MRR Atual</p>
                      <p className="text-xs text-green-600 dark:text-green-400">+45% MoM</p>
                    </div>
                    <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/30 border dark:border-blue-700 rounded-lg">
                      <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">127</p>
                      <p className="text-sm text-gray-600 dark:text-gray-300">Clientes Ativos</p>
                      <p className="text-xs text-blue-600 dark:text-blue-400">+23% MoM</p>
                    </div>
                    <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/30 border dark:border-purple-700 rounded-lg">
                      <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">2.1%</p>
                      <p className="text-sm text-gray-600 dark:text-gray-300">Churn Rate</p>
                      <p className="text-xs text-purple-600 dark:text-purple-400">Abaixo da média</p>
                    </div>
                    <div className="text-center p-4 bg-orange-50 dark:bg-orange-900/30 border dark:border-orange-700 rounded-lg">
                      <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">NPS 76</p>
                      <p className="text-sm text-gray-600 dark:text-gray-300">Net Promoter Score</p>
                      <p className="text-xs text-orange-600 dark:text-orange-400">Classe mundial</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Competição & Vantagens */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Trophy className="h-6 w-6 text-yellow-600" />
                    Vantagens Competitivas
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-4">
                      <h4 className="font-bold text-gray-800">Diferenciais Técnicos</h4>
                      <div className="space-y-3">
                        <div className="flex items-start gap-3">
                          <Brain className="h-5 w-5 text-blue-600 mt-0.5" />
                          <div>
                            <p className="font-medium">IA Proprietária</p>
                            <p className="text-sm text-gray-600">Algoritmos treinados com +10M de dados brasileiros</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <Zap className="h-5 w-5 text-yellow-600 mt-0.5" />
                          <div>
                            <p className="font-medium">Implementação Rápida</p>
                            <p className="text-sm text-gray-600">Go-live em menos de 48 horas</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <Activity className="h-5 w-5 text-green-600 mt-0.5" />
                          <div>
                            <p className="font-medium">Predições em Tempo Real</p>
                            <p className="text-sm text-gray-600">Insights instantâneos sobre performance</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <h4 className="font-bold text-gray-800">Vantagens de Mercado</h4>
                      <div className="space-y-3">
                        <div className="flex items-start gap-3">
                          <Users className="h-5 w-5 text-purple-600 mt-0.5" />
                          <div>
                            <p className="font-medium">First Mover Advantage</p>
                            <p className="text-sm text-gray-600">Primeiro no Brasil com IA para DISC automatizado</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <Briefcase className="h-5 w-5 text-orange-600 mt-0.5" />
                          <div>
                            <p className="font-medium">Network Effects</p>
                            <p className="text-sm text-gray-600">Cada cliente melhora nossos algoritmos</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <Clock className="h-5 w-5 text-red-600 mt-0.5" />
                          <div>
                            <p className="font-medium">Switching Costs Altos</p>
                            <p className="text-sm text-gray-600">Integração profunda nos processos de RH</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Financeiro & Roadmap */}
              <div className="grid gap-6 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BarChart3 className="h-6 w-6 text-blue-600" />
                      Projeções Financeiras
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid gap-2 text-sm">
                        <div className="flex justify-between">
                          <span>2024 (Atual)</span>
                          <span className="font-bold">R$ 5.4M ARR</span>
                        </div>
                        <div className="flex justify-between">
                          <span>2025 (Projeção)</span>
                          <span className="font-bold text-blue-600">R$ 18M ARR</span>
                        </div>
                        <div className="flex justify-between">
                          <span>2026 (Meta)</span>
                          <span className="font-bold text-purple-600">R$ 45M ARR</span>
                        </div>
                      </div>
                      <div className="pt-4 border-t">
                        <p className="text-sm font-medium">Investimento Solicitado</p>
                        <p className="text-2xl font-bold text-green-600">R$ 8M</p>
                        <p className="text-xs text-gray-600">Para acelerar crescimento e expansão</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Rocket className="h-6 w-6 text-purple-600" />
                      Roadmap 2025
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        <span className="text-sm">Q1: Lançamento módulo Wellness</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                        <span className="text-sm">Q2: Expansão para Argentina/México</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                        <span className="text-sm">Q3: IA Voice Assistant para RH</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                        <span className="text-sm">Q4: 500+ clientes ativos</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Call to Action */}
              <Card className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white border-0">
                <CardContent className="text-center py-12">
                  <h3 className="text-3xl sm:text-4xl font-bold mb-4">Junte-se à Revolução do RH</h3>
                  <p className="text-lg mb-8 opacity-95">
                    Invista no futuro da gestão de pessoas no Brasil
                  </p>
                  <div className="flex justify-center gap-4 flex-wrap">
                    <Button 
                      size="lg" 
                      className="bg-white text-emerald-600 hover:bg-emerald-50 font-semibold shadow-lg hover:shadow-xl transition-all"
                      onClick={() => triggerDepartmentAlert('Investidores', 'Interesse em investimento')}
                    >
                      <Crown className="mr-2 h-5 w-5" />
                      Quero Investir
                    </Button>
                    <Button 
                      size="lg" 
                      className="bg-emerald-700 text-white hover:bg-emerald-800 font-semibold shadow-lg hover:shadow-xl transition-all border-0"
                      onClick={() => triggerDepartmentAlert('Pitch', 'Solicitação de apresentação')}
                    >
                      <Calendar className="mr-2 h-5 w-5" />
                      Agendar Apresentação
                    </Button>
                  </div>
                  <p className="text-sm mt-6 opacity-90">
                    fernando@humansys.com.br • +55 11 98765-4321
                  </p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="creatives" className="flex-1 overflow-y-auto">
            <div className="space-y-6">
              {/* Header da seção Criativos */}
              <Card className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/30 dark:to-blue-900/30 border-purple-200 dark:border-purple-700">
                <CardHeader className="text-center">
                  <div className="flex justify-center mb-4">
                    <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-3 rounded-full">
                      <Palette className="h-8 w-8" />
                    </div>
                  </div>
                  <CardTitle className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                    Biblioteca de Criativos Profissionais
                  </CardTitle>
                  <CardDescription className="text-lg">
                    Acesse bibliotecas especializadas com criativos de alta qualidade para cada funcionalidade
                  </CardDescription>
                </CardHeader>
              </Card>

              {/* Categorias de Criativos */}
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {/* DISC */}
                <Card className="group hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/30 dark:to-purple-900/30 border-indigo-200 dark:border-indigo-700">
                  <div className="h-32 bg-gradient-to-r from-indigo-600 to-purple-600 relative overflow-hidden">
                    <div className="absolute inset-0 bg-black/10"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Target className="h-16 w-16 text-white" />
                    </div>
                    <div className="absolute top-2 right-2 bg-white/20 rounded px-2 py-1">
                      <span className="text-xs text-white font-medium">3 criativos</span>
                    </div>
                  </div>
                  <CardHeader>
                    <CardTitle className="text-indigo-800 dark:text-indigo-300">Criativos DISC</CardTitle>
                    <CardDescription className="dark:text-gray-300">
                      Materiais para análise comportamental e mapeamento de perfis
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-sm">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span className="dark:text-gray-300">Análise em 5 minutos</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span className="dark:text-gray-300">94% de precisão</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span className="dark:text-gray-300">Relatórios automáticos</span>
                      </div>
                      <Button 
                        className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
                        onClick={() => {
                          console.log('🎨 Navegando para Creative DISC...');
                          navigate('/app/creative-disc');
                        }}
                      >
                        <Palette className="h-4 w-4 mr-2" />
                        Explorar Criativos DISC
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* IA Preditiva */}
                <Card className="group hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/30 dark:to-emerald-900/30 border-green-200 dark:border-green-700">
                  <div className="h-32 bg-gradient-to-r from-green-600 to-emerald-600 relative overflow-hidden">
                    <div className="absolute inset-0 bg-black/10"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Brain className="h-16 w-16 text-white" />
                    </div>
                    <div className="absolute top-2 right-2 bg-white/20 rounded px-2 py-1">
                      <span className="text-xs text-white font-medium">4 criativos</span>
                    </div>
                  </div>
                  <CardHeader>
                    <CardTitle className="text-green-800 dark:text-green-300">Criativos IA Preditiva</CardTitle>
                    <CardDescription className="dark:text-gray-300">
                      Materiais sobre predição de turnover e insights avançados
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-sm">
                        <Zap className="h-4 w-4 text-yellow-500" />
                        <span className="dark:text-gray-300">Predição 90 dias antecipada</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Zap className="h-4 w-4 text-yellow-500" />
                        <span className="dark:text-gray-300">Insights em tempo real</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Zap className="h-4 w-4 text-yellow-500" />
                        <span className="dark:text-gray-300">Automação inteligente</span>
                      </div>
                      <Button 
                        className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                        onClick={() => triggerDepartmentAlert('Criativos', 'IA Preditiva em desenvolvimento')}
                      >
                        <Brain className="h-4 w-4 mr-2" />
                        Em Breve
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Gestão Digital */}
                <Card className="group hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-900/30 dark:to-amber-900/30 border-orange-200 dark:border-orange-700">
                  <div className="h-32 bg-gradient-to-r from-orange-600 to-amber-600 relative overflow-hidden">
                    <div className="absolute inset-0 bg-black/10"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <BarChart3 className="h-16 w-16 text-white" />
                    </div>
                    <div className="absolute top-2 right-2 bg-white/20 rounded px-2 py-1">
                      <span className="text-xs text-white font-medium">5 criativos</span>
                    </div>
                  </div>
                  <CardHeader>
                    <CardTitle className="text-orange-800 dark:text-orange-300">Gestão Digital</CardTitle>
                    <CardDescription className="dark:text-gray-300">
                      Materiais sobre automação e digitalização de processos
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-sm">
                        <Activity className="h-4 w-4 text-blue-500" />
                        <span className="dark:text-gray-300">100% digital</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Activity className="h-4 w-4 text-blue-500" />
                        <span className="dark:text-gray-300">Elimina planilhas</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Activity className="h-4 w-4 text-blue-500" />
                        <span className="dark:text-gray-300">Processos otimizados</span>
                      </div>
                      <Button 
                        className="w-full bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700"
                        onClick={() => triggerDepartmentAlert('Criativos', 'Gestão Digital em desenvolvimento')}
                      >
                        <BarChart3 className="h-4 w-4 mr-2" />
                        Em Breve
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Engajamento */}
                <Card className="group hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer bg-gradient-to-br from-red-50 to-pink-50 dark:from-red-900/30 dark:to-pink-900/30 border-red-200 dark:border-red-700">
                  <div className="h-32 bg-gradient-to-r from-red-600 to-pink-600 relative overflow-hidden">
                    <div className="absolute inset-0 bg-black/10"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Users className="h-16 w-16 text-white" />
                    </div>
                    <div className="absolute top-2 right-2 bg-white/20 rounded px-2 py-1">
                      <span className="text-xs text-white font-medium">3 criativos</span>
                    </div>
                  </div>
                  <CardHeader>
                    <CardTitle className="text-red-800 dark:text-red-300">Engajamento</CardTitle>
                    <CardDescription className="dark:text-gray-300">
                      Materiais sobre motivação e gamificação corporativa
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-sm">
                        <Trophy className="h-4 w-4 text-yellow-500" />
                        <span className="dark:text-gray-300">+60% produtividade</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Trophy className="h-4 w-4 text-yellow-500" />
                        <span className="dark:text-gray-300">Feedback 360°</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Trophy className="h-4 w-4 text-yellow-500" />
                        <span className="dark:text-gray-300">Gamificação avançada</span>
                      </div>
                      <Button 
                        className="w-full bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700"
                        onClick={() => triggerDepartmentAlert('Criativos', 'Engajamento em desenvolvimento')}
                      >
                        <Users className="h-4 w-4 mr-2" />
                        Em Breve
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* ROI & Resultados */}
                <Card className="group hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer bg-gradient-to-br from-purple-50 to-violet-50 dark:from-purple-900/30 dark:to-violet-900/30 border-purple-200 dark:border-purple-700">
                  <div className="h-32 bg-gradient-to-r from-purple-600 to-violet-600 relative overflow-hidden">
                    <div className="absolute inset-0 bg-black/10"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <TrendingUp className="h-16 w-16 text-white" />
                    </div>
                    <div className="absolute top-2 right-2 bg-white/20 rounded px-2 py-1">
                      <span className="text-xs text-white font-medium">4 criativos</span>
                    </div>
                  </div>
                  <CardHeader>
                    <CardTitle className="text-purple-800 dark:text-purple-300">ROI & Resultados</CardTitle>
                    <CardDescription className="dark:text-gray-300">
                      Materiais sobre retorno de investimento e cases de sucesso
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-sm">
                        <DollarSign className="h-4 w-4 text-green-500" />
                        <span className="dark:text-gray-300">ROI de 340%</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <DollarSign className="h-4 w-4 text-green-500" />
                        <span className="dark:text-gray-300">Payback em 12 meses</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <DollarSign className="h-4 w-4 text-green-500" />
                        <span className="dark:text-gray-300">127 empresas validadas</span>
                      </div>
                      <Button 
                        className="w-full bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700"
                        onClick={() => triggerDepartmentAlert('Criativos', 'ROI em desenvolvimento')}
                      >
                        <TrendingUp className="h-4 w-4 mr-2" />
                        Em Breve
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Automação */}
                <Card className="group hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer bg-gradient-to-br from-cyan-50 to-blue-50 dark:from-cyan-900/30 dark:to-blue-900/30 border-cyan-200 dark:border-cyan-700">
                  <div className="h-32 bg-gradient-to-r from-cyan-600 to-blue-600 relative overflow-hidden">
                    <div className="absolute inset-0 bg-black/10"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Rocket className="h-16 w-16 text-white" />
                    </div>
                    <div className="absolute top-2 right-2 bg-white/20 rounded px-2 py-1">
                      <span className="text-xs text-white font-medium">6 criativos</span>
                    </div>
                  </div>
                  <CardHeader>
                    <CardTitle className="text-cyan-800 dark:text-cyan-300">Automação Total</CardTitle>
                    <CardDescription className="dark:text-gray-300">
                      Materiais sobre eliminação de trabalho manual no RH
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-sm">
                        <Zap className="h-4 w-4 text-yellow-500" />
                        <span className="dark:text-gray-300">80% tarefas automatizadas</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Zap className="h-4 w-4 text-yellow-500" />
                        <span className="dark:text-gray-300">Integração completa</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Zap className="h-4 w-4 text-yellow-500" />
                        <span className="dark:text-gray-300">Suporte 24/7</span>
                      </div>
                      <Button 
                        className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700"
                        onClick={() => triggerDepartmentAlert('Criativos', 'Automação em desenvolvimento')}
                      >
                        <Rocket className="h-4 w-4 mr-2" />
                        Em Breve
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Informações Gerais */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Image className="h-5 w-5" />
                    Sobre os Criativos Profissionais
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-6 md:grid-cols-3">
                    <div>
                      <h4 className="font-semibold mb-3">Especificações</h4>
                      <ul className="space-y-2 text-sm text-gray-600">
                        <li className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          1080x1320 pixels (Stories)
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          PNG alta qualidade (300 DPI)
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          Design responsivo
                        </li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-3">Plataformas</h4>
                      <ul className="space-y-2 text-sm text-gray-600">
                        <li className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-blue-500" />
                          Instagram Stories/Posts
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-blue-500" />
                          LinkedIn corporativo
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-blue-500" />
                          Apresentações comerciais
                        </li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-3">Vantagens</h4>
                      <ul className="space-y-2 text-sm text-gray-600">
                        <li className="flex items-center gap-2">
                          <Star className="h-4 w-4 text-yellow-500" />
                          Dados reais integrados
                        </li>
                        <li className="flex items-center gap-2">
                          <Star className="h-4 w-4 text-yellow-500" />
                          Design profissional
                        </li>
                        <li className="flex items-center gap-2">
                          <Star className="h-4 w-4 text-yellow-500" />
                          Customização automática
                        </li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="documentation" className="flex-1 overflow-y-auto">
            <FounderDocumentationTab />
          </TabsContent>

          <TabsContent value="versions" className="flex-1 overflow-y-auto">
            <FounderVersionsTab />
          </TabsContent>

          <TabsContent value="strategy" className="flex-1 overflow-y-auto">
            <div className="space-y-6">
              <StrategicVisionHub />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export const FounderDashboard = FounderDashboardComponent;
export default FounderDashboard;