import React from 'react';
import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DynamicBadge } from '@/components/landing/DynamicBadge';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import {
  ArrowRight,
  CheckCircle,
  Users,
  UserPlus,
  MessageSquare,
  Target,
  BookOpen,
  Award,
  FileText,
  BarChart3,
  Check,
  Star,
  Zap,
  Shield,
  Sparkles,
  Linkedin,
  Instagram,
  Facebook,
  Github,
  Brain,
  Trophy,
  Smartphone,
  TrendingUp,
  Video,
  Crown,
  DollarSign,
  TrendingDown,
  CreditCard,
  Building,
  Heart
} from 'lucide-react';
import { useDebounceNavigation } from '@/hooks/useDebounceNavigation';
import { FeatureCard } from '@/components/landing/FeatureCard';
import { useNavigate } from 'react-router-dom';

export const Landing = () => {
  const { debouncedNavigate } = useDebounceNavigation();
  const navigate = useNavigate();

  const features = [
    {
      icon: Brain,
      title: 'Analytics com IA',
      description: 'Machine Learning para prever turnover e identificar talentos em risco.',
      path: '/app/analytics',
      isNew: true,
      realImpact: {
        metric: 'Precisão de 85% na previsão de turnover',
        example: 'Empresa TechCorp identificou 12 colaboradores em risco',
        benefit: 'Redução de 60% na rotatividade não planejada'
      }
    },
    {
      icon: Crown,
      title: 'Founder Dashboard',
      description: 'Métricas estratégicas de negócio com IA preditiva para founders.',
      path: '/app/founder/dashboard',
      isNew: true,
      realImpact: {
        metric: 'Visibilidade 360° do negócio em tempo real',
        example: 'MRR, Churn, LTV/CAC e previsões de crescimento',
        benefit: 'Decisões estratégicas baseadas em dados e IA'
      }
    },
    {
      icon: Trophy,
      title: 'Gamificação Completa',
      description: 'Sistema de badges, conquistas e ranking para engajar colaboradores.',
      path: '/app/dashboard',
      isNew: true,
      realImpact: {
        metric: 'Aumento de 45% no engajamento',
        example: 'Startup XYZ viu 90% de participação em treinamentos',
        benefit: 'Melhoria de 35% na produtividade da equipe'
      }
    },
    {
      icon: UserPlus,
      title: 'Onboarding Inteligente',
      description: 'Processo estruturado de integração com acompanhamento automático.',
      path: '/app/onboarding',
      realImpact: {
        metric: 'Redução de 70% no tempo de integração',
        example: 'De 30 dias para 9 dias para produtividade total',
        benefit: 'Satisfação de novos funcionários em 95%'
      }
    },
    {
      icon: Users,
      title: 'Gestão de Colaboradores',
      description: 'Controle completo do quadro de funcionários, estagiários e terceiros.',
      path: '/app/collaborators',
      realImpact: {
        metric: 'Centralização de 100% dos dados',
        example: 'Visão unificada de 500+ colaboradores em tempo real',
        benefit: 'Economia de 8h semanais em relatórios'
      }
    },
    {
      icon: MessageSquare,
      title: 'Feedback 360°',
      description: 'Sistema completo de feedbacks e avaliações de performance.',
      path: '/app/feedback',
      realImpact: {
        metric: 'Aumento de 60% na comunicação',
        example: '95% dos feedbacks entregues dentro do prazo',
        benefit: 'Melhoria de 40% no clima organizacional'
      }
    },
    {
      icon: Target,
      title: 'Metas & PDI',
      description: 'Plano de Desenvolvimento Individual com controle de metas e indicadores.',
      path: '/app/goals',
      realImpact: {
        metric: 'Aumento de 55% no alcance de metas',
        example: '80% das metas atingidas vs. 45% anterior',
        benefit: 'Crescimento profissional estruturado para todos'
      }
    },
    {
      icon: Video,
      title: 'Treinamentos Interativos',
      description: 'Plataforma de cursos com player de vídeo integrado e certificação.',
      path: '/app/training',
      realImpact: {
        metric: 'Conclusão de 85% dos treinamentos',
        example: 'Certificação automática de 200+ colaboradores',
        benefit: 'ROI de 300% em desenvolvimento de talentos'
      }
    },
    {
      icon: Smartphone,
      title: 'Progressive Web App',
      description: 'Funciona offline e pode ser instalado como aplicativo nativo.',
      path: '/app/dashboard',
      isNew: true,
      realImpact: {
        metric: 'Acesso 24/7 mesmo offline',
        example: 'Funcionários remotos mantêm produtividade',
        benefit: 'Aumento de 25% na utilização do sistema'
      }
    }
  ];

  const benefits = [
    'Redução de 70% no tempo de onboarding',
    'Aumento de 45% na retenção de talentos',
    'Melhoria de 60% na comunicação interna',
    'Economia de 50% em processos manuais',
    'IA prevê turnover com 85% de precisão',
    'Gamificação aumenta engajamento em 40%',
    'Dashboard founder com métricas em tempo real',
    'Alertas inteligentes para departamentos',
    'Previsões de receita com IA preditiva'
  ];

  const plans = [
    {
      name: 'Inicial',
      description: 'Perfeito para startups e pequenas empresas',
      monthlyPrice: 'R$ 127',
      yearlyPrice: 'R$ 1.270',
      features: [
        'Gestão de 15 Colaboradores',
        'Dashboard Principal',
        'Módulo de Treinamentos',
        'Reuniões 1:1 Básicas',
        'Metas & PDI Simples',
        'Feedback Estruturado',
        'Onboarding Básico',
        'Suporte por Email'
      ],
      popular: false
    },
    {
      name: 'Em Crescimento',
      description: 'Para empresas em expansão',
      monthlyPrice: 'R$ 247',
      yearlyPrice: 'R$ 2.470',
      features: [
        'Gestão de 75 Colaboradores',
        'Análise DISC com IA',
        'Analytics Avançados',
        'Pesquisas de Engajamento',
        'Certificados Personalizados',
        'Gamificação Completa',
        'Recrutamento Inteligente',
        'Documentos Avançados',
        'Suporte Prioritário'
      ],
      popular: true
    },
    {
      name: 'Profissional',
      description: 'Para grandes organizações',
      monthlyPrice: 'R$ 497',
      yearlyPrice: 'R$ 4.970',
      features: [
        'Gestão de 500 Colaboradores',
        'Founder Dashboard Premium',
        'IA Preditiva Avançada',
        'Brainsys IAO V.1 Completo',
        'Security Management',
        'API Personalizada',
        'Integrações Ilimitadas',
        'White Label Disponível',
        'Suporte 24/7 Dedicado',
        'Consultor Especializado'
      ],
      popular: false
    }
  ];

  const testimonials = [
    {
      name: 'Maria Silva',
      role: 'Diretora de RH',
      company: 'TechCorp',
      content: 'A IA da Humansys nos ajudou a reduzir o turnover em 60%. Incrível!',
      rating: 5
    },
    {
      name: 'João Santos',
      role: 'CEO',
      company: 'StartupXYZ',
      content: 'O sistema de gamificação transformou o engajamento da nossa equipe.',
      rating: 5
    }
  ];

  const socialLinks = [
    { icon: Linkedin, href: '#', label: 'LinkedIn' },
    { icon: Instagram, href: '#', label: 'Instagram' },
    { icon: Facebook, href: '#', label: 'Facebook' },
    { icon: Github, href: '#', label: 'GitHub' }
  ];

  const handleFeatureClick = (path: string) => {
    debouncedNavigate(path);
  };

  const handlePlanSelection = (planName: string, price: string, billing: 'monthly' | 'yearly') => {
    debouncedNavigate('/plans', { 
      state: { 
        selectedPlan: planName, 
        selectedPrice: price,
        selectedBilling: billing 
      } 
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header showAuth />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-green-50/70 via-emerald-25/50 to-green-100/60 py-8 sm:py-12 md:py-16 lg:py-24">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-full text-center mb-8 sm:mb-12 lg:mb-16"></div>
          <div className="mx-auto max-w-4xl text-center animate-fade-in">
            <div className="flex justify-center mb-4 sm:mb-6 lg:mb-8">
              <div className="relative">
                <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-3 py-1.5 sm:px-4 sm:py-2 lg:px-6 lg:py-2 rounded-full text-xs sm:text-sm font-medium shadow-lg animate-pulse">
                  🚀 Novo: Founder Dashboard com IA Preditiva
                </div>
              </div>
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-6xl xl:text-7xl font-bold tracking-tight">
              Transforme sua
              <span className="text-primary"> Gestão de Pessoas</span>
              <span className="block text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl mt-2 text-muted-foreground">
                com Inteligência Artificial
              </span>
            </h1>
            <p className="mt-4 sm:mt-6 text-base sm:text-lg md:text-xl lg:text-2xl text-muted-foreground px-4 sm:px-0">
              A Humansys é uma plataforma completa com IA preditiva, gamificação e PWA. 
              Preveja turnover, engaje colaboradores e transforme seu RH.
            </p>
            <div className="mt-6 sm:mt-8 lg:mt-10 flex flex-col gap-3 sm:gap-4 sm:flex-row sm:justify-center px-4 sm:px-0">
              <Button 
                size="lg" 
                className="text-sm sm:text-base lg:text-lg px-4 sm:px-6 lg:px-8 py-3 sm:py-4 lg:py-6 w-full sm:w-auto"
                onClick={() => debouncedNavigate('/checkout', { state: { selectedBilling: 'trial' } })}
              >
                <Zap className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                Começar Teste Grátis 30 Dias
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="text-sm sm:text-base lg:text-lg px-4 sm:px-6 lg:px-8 py-3 sm:py-4 lg:py-6 w-full sm:w-auto"
                onClick={() => debouncedNavigate('/changelog')}
              >
                <TrendingUp className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                Ver Novidades
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Screenshots Carousel Section */}
      <section className="py-8 sm:py-12 md:py-16 lg:py-20 bg-gradient-to-r from-green-25/30 via-white to-emerald-25/30">
        <div className="container px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center mb-8 sm:mb-12 lg:mb-16">
            <div className="flex justify-center mb-3 sm:mb-4">
              <div className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-medium shadow-lg border border-blue-300">
                <Smartphone className="mr-1 h-3 w-3 inline" />
                Interface Moderna
              </div>
            </div>
            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold">
              Visual Moderno e Intuitivo
            </h2>
            <p className="mt-3 sm:mt-4 text-sm sm:text-base md:text-lg text-muted-foreground px-4 sm:px-0">
              Conheça nossa interface elegante e funcional que facilita a gestão de RH
            </p>
          </div>

          <div className="max-w-6xl mx-auto">
            <Carousel
              opts={{
                align: "start",
                loop: true,
              }}
              className="w-full"
            >
              <CarouselContent className="-ml-2 md:-ml-4">
                <CarouselItem className="pl-2 md:pl-4 basis-full md:basis-1/2 lg:basis-1/3">
                  <Card className="relative overflow-hidden group hover:shadow-2xl transition-all duration-500 border-0 bg-white">
                    <div className="aspect-video bg-gradient-to-br from-blue-500 to-indigo-600 relative overflow-hidden">
                      <div className="absolute inset-0 bg-black/20"></div>
                      <div className="absolute inset-4 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20 flex items-center justify-center">
                        <div className="text-center text-white">
                          <Users className="h-12 w-12 mx-auto mb-2 opacity-80" />
                          <h3 className="font-semibold text-lg">Dashboard Principal</h3>
                          <p className="text-sm opacity-90">Visão geral completa</p>
                        </div>
                      </div>
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-semibold mb-2">Dashboard Executivo</h3>
                      <p className="text-sm text-muted-foreground">Central de controle com métricas em tempo real e insights de IA</p>
                    </CardContent>
                  </Card>
                </CarouselItem>

                <CarouselItem className="pl-2 md:pl-4 basis-full md:basis-1/2 lg:basis-1/3">
                  <Card className="relative overflow-hidden group hover:shadow-2xl transition-all duration-500 border-0 bg-white">
                    <div className="aspect-video bg-gradient-to-br from-green-500 to-emerald-600 relative overflow-hidden">
                      <div className="absolute inset-0 bg-black/20"></div>
                      <div className="absolute inset-4 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20 flex items-center justify-center">
                        <div className="text-center text-white">
                          <UserPlus className="h-12 w-12 mx-auto mb-2 opacity-80" />
                          <h3 className="font-semibold text-lg">Gestão de Pessoas</h3>
                          <p className="text-sm opacity-90">Controle total</p>
                        </div>
                      </div>
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-semibold mb-2">Gestão de Colaboradores</h3>
                      <p className="text-sm text-muted-foreground">Interface moderna para gerenciar toda sua equipe com facilidade</p>
                    </CardContent>
                  </Card>
                </CarouselItem>

                <CarouselItem className="pl-2 md:pl-4 basis-full md:basis-1/2 lg:basis-1/3">
                  <Card className="relative overflow-hidden group hover:shadow-2xl transition-all duration-500 border-0 bg-white">
                    <div className="aspect-video bg-gradient-to-br from-purple-500 to-pink-600 relative overflow-hidden">
                      <div className="absolute inset-0 bg-black/20"></div>
                      <div className="absolute inset-4 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20 flex items-center justify-center">
                        <div className="text-center text-white">
                          <Trophy className="h-12 w-12 mx-auto mb-2 opacity-80" />
                          <h3 className="font-semibold text-lg">Gamificação</h3>
                          <p className="text-sm opacity-90">Engajamento total</p>
                        </div>
                      </div>
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-semibold mb-2">Sistema de Badges</h3>
                      <p className="text-sm text-muted-foreground">Gamificação completa com conquistas e ranking para motivar sua equipe</p>
                    </CardContent>
                  </Card>
                </CarouselItem>

                <CarouselItem className="pl-2 md:pl-4 basis-full md:basis-1/2 lg:basis-1/3">
                  <Card className="relative overflow-hidden group hover:shadow-2xl transition-all duration-500 border-0 bg-white">
                    <div className="aspect-video bg-gradient-to-br from-orange-500 to-red-600 relative overflow-hidden">
                      <div className="absolute inset-0 bg-black/20"></div>
                      <div className="absolute inset-4 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20 flex items-center justify-center">
                        <div className="text-center text-white">
                          <Brain className="h-12 w-12 mx-auto mb-2 opacity-80" />
                          <h3 className="font-semibold text-lg">IA Analytics</h3>
                          <p className="text-sm opacity-90">Insights inteligentes</p>
                        </div>
                      </div>
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-semibold mb-2">Analytics com IA</h3>
                      <p className="text-sm text-muted-foreground">Análises preditivas e insights automáticos para decisões estratégicas</p>
                    </CardContent>
                  </Card>
                </CarouselItem>

                <CarouselItem className="pl-2 md:pl-4 basis-full md:basis-1/2 lg:basis-1/3">
                  <Card className="relative overflow-hidden group hover:shadow-2xl transition-all duration-500 border-0 bg-white">
                    <div className="aspect-video bg-gradient-to-br from-teal-500 to-cyan-600 relative overflow-hidden">
                      <div className="absolute inset-0 bg-black/20"></div>
                      <div className="absolute inset-4 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20 flex items-center justify-center">
                        <div className="text-center text-white">
                          <Video className="h-12 w-12 mx-auto mb-2 opacity-80" />
                          <h3 className="font-semibold text-lg">Treinamentos</h3>
                          <p className="text-sm opacity-90">Plataforma completa</p>
                        </div>
                      </div>
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-semibold mb-2">Portal de Treinamentos</h3>
                      <p className="text-sm text-muted-foreground">Plataforma de cursos com certificação automática e player integrado</p>
                    </CardContent>
                  </Card>
                </CarouselItem>

                <CarouselItem className="pl-2 md:pl-4 basis-full md:basis-1/2 lg:basis-1/3">
                  <Card className="relative overflow-hidden group hover:shadow-2xl transition-all duration-500 border-0 bg-white">
                    <div className="aspect-video bg-gradient-to-br from-indigo-500 to-blue-600 relative overflow-hidden">
                      <div className="absolute inset-0 bg-black/20"></div>
                      <div className="absolute inset-4 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20 flex items-center justify-center">
                        <div className="text-center text-white">
                          <Target className="h-12 w-12 mx-auto mb-2 opacity-80" />
                          <h3 className="font-semibold text-lg">Metas & PDI</h3>
                          <p className="text-sm opacity-90">Desenvolvimento contínuo</p>
                        </div>
                      </div>
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-semibold mb-2">Gestão de Metas</h3>
                      <p className="text-sm text-muted-foreground">Plano de desenvolvimento individual com acompanhamento em tempo real</p>
                    </CardContent>
                  </Card>
                </CarouselItem>
              </CarouselContent>
              <CarouselPrevious className="left-2" />
              <CarouselNext className="right-2" />
            </Carousel>

            <div className="text-center mt-12">
              <Button 
                size="lg" 
                className="text-lg px-8 py-6"
                onClick={() => debouncedNavigate('/app/dashboard')}
              >
                <Smartphone className="mr-2 h-5 w-5" />
                Explorar Interface
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Novidades Section */}
      <section className="py-12 md:py-20 bg-gradient-to-r from-green-25/40 via-emerald-25/30 to-green-50/50">
        <div className="container">
          <div className="mx-auto max-w-2xl text-center mb-16">
            <div className="flex justify-center mb-4">
              <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-full text-sm font-medium shadow-lg border border-purple-300 animate-pulse">
                <Sparkles className="mr-1 h-3 w-3 inline" />
                Lançamento Oficial
              </div>
            </div>
            <h2 className="text-3xl font-bold md:text-4xl">
              <Crown className="inline h-8 w-8 mr-2 text-yellow-500" />
              Novo Founder Dashboard
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Tome decisões estratégicas com métricas de negócio em tempo real e IA preditiva
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3 max-w-6xl mx-auto">
            <Card className="relative overflow-hidden group hover:shadow-xl transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 group-hover:bg-green-200 transition-colors">
                  <DollarSign className="h-8 w-8 text-green-600" />
                </div>
                <CardTitle className="text-xl">Métricas SaaS</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-muted-foreground mb-4">
                  MRR, ARR, Churn Rate, LTV/CAC, NRR e todas as métricas essenciais para SaaS
                </p>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>MRR Tracking</span>
                    <Check className="h-4 w-4 text-green-600" />
                  </div>
                  <div className="flex justify-between">
                    <span>Churn Analysis</span>
                    <Check className="h-4 w-4 text-green-600" />
                  </div>
                  <div className="flex justify-between">
                    <span>Revenue Forecasting</span>
                    <Check className="h-4 w-4 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="relative overflow-hidden group hover:shadow-xl transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-purple-100 group-hover:bg-purple-200 transition-colors">
                  <Brain className="h-8 w-8 text-purple-600" />
                </div>
                <CardTitle className="text-xl">Brainsys IAO V.1</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-muted-foreground mb-4">
                  Orquestrador de Inteligência Organizacional com precisão de 94.7%
                </p>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Churn Prediction</span>
                    <Brain className="h-4 w-4 text-purple-600" />
                  </div>
                  <div className="flex justify-between">
                    <span>Revenue Forecast</span>
                    <Brain className="h-4 w-4 text-purple-600" />
                  </div>
                  <div className="flex justify-between">
                    <span>ML Analytics</span>
                    <Brain className="h-4 w-4 text-purple-600" />
                  </div>
                  <div className="flex justify-between">
                    <span>Insights Automáticos</span>
                    <Brain className="h-4 w-4 text-purple-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="relative overflow-hidden group hover:shadow-xl transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-red-500/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-orange-100 group-hover:bg-orange-200 transition-colors">
                  <Trophy className="h-8 w-8 text-orange-600" />
                </div>
                <CardTitle className="text-xl">Gamificação</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-muted-foreground mb-4">
                  Sistema de níveis, conquistas e ranking para founders
                </p>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Level System</span>
                    <Trophy className="h-4 w-4 text-orange-600" />
                  </div>
                  <div className="flex justify-between">
                    <span>Achievements</span>
                    <Trophy className="h-4 w-4 text-orange-600" />
                  </div>
                  <div className="flex justify-between">
                    <span>Leaderboard</span>
                    <Trophy className="h-4 w-4 text-orange-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="text-center mt-12">
            <Button 
              size="lg" 
              className="text-lg px-8 py-6"
              onClick={() => debouncedNavigate('/app/founder/dashboard')}
            >
              <Crown className="mr-2 h-5 w-5" />
              Acessar Founder Dashboard
            </Button>
          </div>
        </div>
      </section>

      {/* Análise DISC Section */}
      <section className="py-12 md:py-20 bg-gradient-to-r from-green-25/30 via-emerald-25/20 to-green-50/35">
        <div className="container">
          <div className="mx-auto max-w-6xl">
            <div className="text-center mb-16">
              <div className="flex justify-center mb-4">
                <div className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-4 py-2 rounded-full text-sm font-medium shadow-lg border border-indigo-300 animate-pulse">
                  <Brain className="mr-1 h-3 w-3 inline" />
                  Nova Funcionalidade
                </div>
              </div>
              <h2 className="text-3xl font-bold md:text-4xl">
                <Brain className="inline h-8 w-8 mr-2 text-indigo-600" />
                Análise de Perfil DISC com IA
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Descubra o perfil comportamental dos seus colaboradores com análise avançada e insights de IA
              </p>
            </div>

            <div className="text-center">
              <Card className="inline-block bg-gradient-to-r from-indigo-500 to-purple-500 text-white p-6">
                <CardContent className="pt-0">
                  <h3 className="text-xl font-bold mb-2">🧠 Análise DISC Disponível Agora!</h3>
                  <p className="mb-4">Descubra o perfil comportamental dos seus colaboradores</p>
                  <Button 
                    variant="secondary" 
                    size="lg"
                    onClick={() => debouncedNavigate('/checkout', { state: { selectedBilling: 'trial' } })}
                  >
                    <Brain className="mr-2 h-5 w-5" />
                    Fazer Análise DISC
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-primary">
        <div className="container">
          <div className="mx-auto max-w-2xl text-center text-white">
            <h2 className="text-3xl font-bold md:text-4xl">
              Pronto para Revolucionar seu RH?
            </h2>
            <p className="mt-4 text-lg opacity-90">
              Junte-se a centenas de empresas que já transformaram sua gestão de RH com IA
            </p>
            <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:justify-center">
              <Button 
                size="lg" 
                variant="secondary"
                className="text-lg px-8 py-6"
                onClick={() => debouncedNavigate('/checkout', { state: { selectedBilling: 'trial' } })}
              >
                <Shield className="mr-2 h-5 w-5" />
                Teste Grátis 30 Dias
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                className="text-lg px-8 py-6 border-white text-white hover:bg-white hover:text-primary"
                onClick={() => debouncedNavigate('/checkout')}
              >
                Ver Planos
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-12">
        <div className="container">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            <div>
              <h3 className="font-semibold mb-4">Produto</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><button onClick={() => debouncedNavigate('/app/dashboard')} className="hover:text-primary text-left">Funcionalidades</button></li>
                <li><button onClick={() => debouncedNavigate('/plans')} className="hover:text-primary text-left">Preços</button></li>
                <li><button onClick={() => debouncedNavigate('/changelog')} className="hover:text-primary text-left">Novidades</button></li>
                <li><button onClick={() => debouncedNavigate('/app/settings')} className="hover:text-primary text-left">Integrações</button></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Empresa</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><button onClick={() => debouncedNavigate('/about')} className="hover:text-primary text-left">Sobre</button></li>
                <li><button onClick={() => debouncedNavigate('/careers')} className="hover:text-primary text-left">Carreiras</button></li>
                <li><button onClick={() => debouncedNavigate('/blog')} className="hover:text-primary text-left">Blog</button></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Suporte</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><button onClick={() => debouncedNavigate('/documentation')} className="hover:text-primary text-left">Documentação</button></li>
                <li><button onClick={() => debouncedNavigate('/help')} className="hover:text-primary text-left">Ajuda</button></li>
                <li><button onClick={() => debouncedNavigate('/contact')} className="hover:text-primary text-left">Contato</button></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Legal</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><button onClick={() => debouncedNavigate('/privacy')} className="hover:text-primary text-left">Política de Privacidade</button></li>
                <li><button onClick={() => debouncedNavigate('/terms')} className="hover:text-primary text-left">Termos de Uso</button></li>
              </ul>
            </div>
          </div>

          <div className="border-t mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-muted-foreground text-sm">
              &copy; 2024 Humansys. Todos os direitos reservados.
            </p>
            <div className="flex space-x-4 mt-4 md:mt-0">
              {socialLinks.map((social, index) => {
                const Icon = social.icon;
                return (
                  <a
                    key={index}
                    href={social.href}
                    className="text-muted-foreground hover:text-primary transition-colors"
                    aria-label={social.label}
                  >
                    <Icon className="h-5 w-5" />
                  </a>
                );
              })}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};