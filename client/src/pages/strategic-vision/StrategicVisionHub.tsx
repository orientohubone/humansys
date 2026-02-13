import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import {
  Crown,
  Target,
  AlertTriangle,
  TrendingUp,
  Users,
  Map,
  Zap,
  Brain,
  Shield,
  Sparkles
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export function StrategicVisionHub() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Fetch strategic context - no suspense, renders immediately
  const { data: context } = useQuery({
    queryKey: ['/api/strategic-vision/context'],
    enabled: mounted,
    staleTime: 5 * 60 * 1000
  });

  // Fetch active alerts - no suspense, renders immediately
  const { data: alerts = [] } = useQuery({
    queryKey: ['/api/strategic-vision/alerts'],
    enabled: mounted,
    staleTime: 5 * 60 * 1000
  });

  // Fetch latest health metrics - no suspense, renders immediately
  const { data: healthMetrics } = useQuery({
    queryKey: ['/api/strategic-vision/health/latest'],
    enabled: mounted,
    staleTime: 5 * 60 * 1000
  });

  // Define strategic modules
  const strategicModules = [
    {
      id: 'context',
      title: 'Contexto Estratégico',
      description: 'Configure a visão, missão e objetivos de crescimento',
      icon: Target,
      iconColor: 'text-purple-500',
      bgColor: 'bg-purple-50 dark:bg-purple-950/20',
      href: '/app/strategic-vision/context',
      status: context ? 'configured' : 'pending',
      badge: context ? '✓ Configurado' : 'Configurar',
      badgeVariant: context ? 'default' : 'outline' as const,
      chessPiece: '♔', // King - Foundation
    },
    {
      id: 'org-chart',
      title: 'Organograma Dinâmico',
      description: 'Estrutura organizacional e planejamento de crescimento',
      icon: Users,
      iconColor: 'text-blue-500',
      bgColor: 'bg-blue-50 dark:bg-blue-950/20',
      href: '/app/strategic-vision/org-chart',
      status: 'active',
      badge: 'Ver Estrutura',
      badgeVariant: 'outline' as const,
      chessPiece: '♖', // Rook - Structure
    },
    {
      id: 'simulations',
      title: 'Laboratório de Simulações',
      description: 'Simule decisões e veja efeitos em cascata com IA',
      icon: Brain,
      iconColor: 'text-emerald-500',
      bgColor: 'bg-emerald-50 dark:bg-emerald-950/20',
      href: '/app/strategic-vision/simulations',
      status: 'active',
      badge: 'Simular',
      badgeVariant: 'outline' as const,
      chessPiece: '♘', // Knight - Strategic Moves
    },
    {
      id: 'alerts',
      title: 'Central de Alertas',
      description: 'Riscos, oportunidades e ações requeridas',
      icon: AlertTriangle,
      iconColor: alerts?.length > 0 ? 'text-red-500' : 'text-gray-400',
      bgColor: 'bg-red-50 dark:bg-red-950/20',
      href: '/app/strategic-vision/alerts',
      status: alerts?.length > 0 ? 'critical' : 'clear',
      badge: alerts?.length > 0 ? `${alerts.length} Alertas` : 'Tudo OK',
      badgeVariant: alerts?.length > 0 ? 'destructive' : 'outline' as const,
      chessPiece: '♗', // Bishop - Foresight
    },
    {
      id: 'health',
      title: 'Monitor de Saúde',
      description: 'Acompanhe a saúde organizacional em tempo real',
      icon: Shield,
      iconColor: 'text-green-500',
      bgColor: 'bg-green-50 dark:bg-green-950/20',
      href: '/app/strategic-vision/health',
      status: 'healthy',
      badge: healthMetrics ? `${healthMetrics.total_score || 0}/100` : 'Calcular',
      badgeVariant: 'outline' as const,
      chessPiece: '♕', // Queen - Power & Balance
    },
    {
      id: 'development',
      title: 'Planos de Desenvolvimento',
      description: 'PDIs e planejamento de sucessão',
      icon: TrendingUp,
      iconColor: 'text-orange-500',
      bgColor: 'bg-orange-50 dark:bg-orange-950/20',
      href: '/app/strategic-vision/development',
      status: 'active',
      badge: 'Desenvolver',
      badgeVariant: 'outline' as const,
      chessPiece: '♙', // Pawn - Growth Potential
    },
    {
      id: 'roadmaps',
      title: 'Roadmaps de Crescimento',
      description: 'Timeline de contratações e expansão',
      icon: Map,
      iconColor: 'text-indigo-500',
      bgColor: 'bg-indigo-50 dark:bg-indigo-950/20',
      href: '/app/strategic-vision/roadmaps',
      status: 'active',
      badge: 'Planejar',
      badgeVariant: 'outline' as const,
      chessPiece: '♚', // King Outline - Long-term Vision
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50/30 to-blue-50 dark:from-slate-950 dark:via-purple-950/20 dark:to-blue-950/20">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        
        {/* Header Section - Chess Themed */}
        <div className="mb-12 text-center space-y-4 relative">
          <div className="absolute inset-0 -z-10">
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-200/20 dark:bg-purple-900/10 rounded-full blur-3xl animate-pulse" />
            <div className="absolute top-10 right-1/4 w-96 h-96 bg-blue-200/20 dark:bg-blue-900/10 rounded-full blur-3xl animate-pulse delay-1000" />
          </div>

          <div className="inline-flex items-center gap-3 mb-4">
            <div className="relative">
              <Target className="h-12 w-12 text-purple-600 dark:text-purple-400" />
              <Sparkles className="h-6 w-6 text-yellow-500 absolute -top-2 -right-2 animate-pulse" />
            </div>
            <h1 className="text-5xl font-bold text-emerald-600 dark:text-emerald-400">
              Strategic Vision
            </h1>
            <Crown className="h-10 w-10 text-yellow-500" />
          </div>
          
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            <span className="font-semibold text-emerald-600 dark:text-emerald-400">♟️ Orquestre sua estratégia como uma partida de xadrez</span>
            <br />
            Simule decisões, antecipe movimentos e veja os efeitos em cascata antes de executar
          </p>

          {!context && (
            <div className="mt-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg max-w-2xl mx-auto">
              <div className="flex items-center gap-3">
                <Zap className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
                <p className="text-sm text-yellow-800 dark:text-yellow-200">
                  <strong>Primeiro Movimento:</strong> Configure seu contexto estratégico para desbloquear o poder da IA
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Stats Cards */}
        {context && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Headcount Atual</p>
                    <p className="text-2xl font-bold">{context.headcount || 0}</p>
                  </div>
                  <Users className="h-8 w-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Health Score</p>
                    <p className="text-2xl font-bold">{healthMetrics?.total_score || '-'}/100</p>
                  </div>
                  <Shield className="h-8 w-8 text-green-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Alertas Ativos</p>
                    <p className="text-2xl font-bold">{alerts?.length || 0}</p>
                  </div>
                  <AlertTriangle className={`h-8 w-8 ${alerts?.length > 0 ? 'text-red-500' : 'text-gray-400'}`} />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Estágio</p>
                    <p className="text-lg font-bold capitalize">{context.stage || 'Growth'}</p>
                  </div>
                  <Crown className="h-8 w-8 text-yellow-500" />
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Strategic Modules Grid - Chess Board Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {strategicModules.map((module, index) => {
            const Icon = module.icon;
            return (
              <Card 
                key={module.id}
                className={`relative overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl ${module.bgColor} border-2 group`}
                data-testid={`module-${module.id}`}
              >
                {/* Chess Piece Watermark */}
                <div className="absolute top-2 right-2 text-6xl opacity-10 group-hover:opacity-20 transition-opacity">
                  {module.chessPiece}
                </div>

                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className={`p-3 rounded-lg ${module.bgColor} border-2 border-current`}>
                      <Icon className={`h-6 w-6 ${module.iconColor}`} />
                    </div>
                    <Badge 
                      variant={module.badgeVariant}
                      className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white border-2 border-slate-300 dark:border-slate-700 font-semibold"
                    >
                      {module.badge}
                    </Badge>
                  </div>
                  <CardTitle className="mt-4 text-xl">{module.title}</CardTitle>
                  <CardDescription className="text-sm">
                    {module.description}
                  </CardDescription>
                </CardHeader>

                <CardContent>
                  <Link to={module.href}>
                    <Button 
                      className="w-full bg-emerald-600 hover:bg-emerald-700 text-white dark:bg-emerald-500 dark:hover:bg-emerald-600 font-semibold"
                      data-testid={`button-${module.id}`}
                    >
                      Acessar
                      <Target className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* AI Assistant Hint */}
        <Card className="mt-8 bg-gradient-to-r from-emerald-50 to-blue-50 dark:from-emerald-950/20 dark:to-blue-950/20 border-2 border-emerald-200 dark:border-emerald-800">
          <CardContent className="pt-6">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-emerald-100 dark:bg-emerald-900/30 rounded-full">
                <Brain className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold mb-2 text-emerald-900 dark:text-emerald-100">
                  🧠 Powered by AI - Claude 3.5 Sonnet
                </h3>
                <p className="text-sm text-emerald-800 dark:text-emerald-200 mb-3">
                  Todas as análises, simulações e recomendações são geradas por IA avançada, 
                  processando seu contexto estratégico único para fornecer insights acionáveis e predições precisas.
                </p>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline" className="bg-white/50 dark:bg-black/20">
                    <Sparkles className="h-3 w-3 mr-1" />
                    Análise Preditiva
                  </Badge>
                  <Badge variant="outline" className="bg-white/50 dark:bg-black/20">
                    <Zap className="h-3 w-3 mr-1" />
                    Simulações em Tempo Real
                  </Badge>
                  <Badge variant="outline" className="bg-white/50 dark:bg-black/20">
                    <Target className="h-3 w-3 mr-1" />
                    Recomendações Estratégicas
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Legend - Chess Pieces Meaning */}
        <Card className="mt-6 bg-slate-50/50 dark:bg-slate-900/20">
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2">
              <Crown className="h-4 w-4" />
              Legenda das Peças de Xadrez
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
              <div><span className="text-2xl mr-2">♔</span> Rei = Fundação Estratégica</div>
              <div><span className="text-2xl mr-2">♕</span> Rainha = Poder & Equilíbrio</div>
              <div><span className="text-2xl mr-2">♖</span> Torre = Estrutura Organizacional</div>
              <div><span className="text-2xl mr-2">♗</span> Bispo = Visão de Futuro</div>
              <div><span className="text-2xl mr-2">♘</span> Cavalo = Movimentos Estratégicos</div>
              <div><span className="text-2xl mr-2">♙</span> Peão = Potencial de Crescimento</div>
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}
