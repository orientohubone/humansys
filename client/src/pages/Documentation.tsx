
import React, { useCallback, useEffect, useState } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Header } from '@/components/layout/Header';
import { MouseTrail } from '@/components/ui/mouse-trail';
import { ScrollToTopButton } from '@/components/ui/scroll-to-top';
import { 
  Brain, 
  Users, 
  Trophy, 
  BookOpen, 
  FileText,
  Video,
  MessageSquare,
  Target,
  Award,
  Zap,
  Crown,
  TrendingUp,
  UserPlus,
  ArrowRight,
  CreditCard,
  BarChart3,
  Calendar,
  ClipboardList,
  Settings,
  Briefcase,
  Star,
  Play,
  Download,
  ExternalLink,
  Linkedin,
  Instagram,
  Facebook,
  Github
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const Documentation = () => {
  const navigate = useNavigate();
  const { actualTheme } = useTheme();
  const [scrollProgress, setScrollProgress] = useState(0);

  const socialLinks = [
    { icon: Linkedin, href: '#', label: 'LinkedIn' },
    { icon: Instagram, href: '#', label: 'Instagram' },
    { icon: Facebook, href: '#', label: 'Facebook' },
    { icon: Github, href: '#', label: 'GitHub' },
  ];

  // Dados das funcionalidades para o carrossel
  const platformFeatures = [
    {
      id: 1,
      title: 'Dashboard Principal',
      description: 'Visão geral completa com métricas em tempo real e ações rápidas',
      image: '/placeholder.svg?height=300&width=500&text=Dashboard+Principal',
      category: 'Analytics',
      path: '/app/dashboard'
    },
    {
      id: 2,
      title: 'Análise DISC com IA',
      description: 'Sistema avançado de análise comportamental com insights de inteligência artificial',
      image: '/placeholder.svg?height=300&width=500&text=Análise+DISC',
      category: 'RH',
      path: '/app/disc',
      isNew: true
    },
    {
      id: 3,
      title: 'Founder Dashboard',
      description: 'Métricas estratégicas de negócio com análise preditiva',
      image: '/placeholder.svg?height=300&width=500&text=Founder+Dashboard',
      category: 'Estratégia',
      path: '/founder/dashboard',
      isNew: true
    },
    {
      id: 4,
      title: 'Gestão de Colaboradores',
      description: 'Controle completo do quadro de funcionários com filtros inteligentes',
      image: '/placeholder.svg?height=300&width=500&text=Gestão+Colaboradores',
      category: 'RH',
      path: '/app/collaborators'
    },
    {
      id: 5,
      title: 'Sistema de Gamificação',
      description: 'Badges, conquistas e ranking para engajar sua equipe',
      image: '/placeholder.svg?height=300&width=500&text=Gamificação',
      category: 'Engajamento',
      path: '/app/dashboard'
    },
    {
      id: 6,
      title: 'Onboarding Estruturado',
      description: 'Processo guiado de integração de novos colaboradores',
      image: '/placeholder.svg?height=300&width=500&text=Onboarding',
      category: 'RH',
      path: '/app/onboarding'
    }
  ];

  const quickStartGuide = [
    {
      step: 1,
      title: 'Configure sua Empresa',
      description: 'Defina departamentos, cargos e estrutura organizacional',
      icon: Settings,
      time: '5 min'
    },
    {
      step: 2,
      title: 'Adicione Colaboradores',
      description: 'Cadastre sua equipe e organize por departamentos',
      icon: Users,
      time: '10 min'
    },
    {
      step: 3,
      title: 'Execute Análise DISC',
      description: 'Conheça os perfis comportamentais da sua equipe',
      icon: Brain,
      time: '15 min'
    },
    {
      step: 4,
      title: 'Configure Metas',
      description: 'Defina objetivos e acompanhe o progresso',
      icon: Target,
      time: '8 min'
    }
  ];

  const resources = [
    {
      title: 'Guia de Primeiros Passos',
      description: 'Tutorial completo para começar a usar a plataforma',
      type: 'PDF',
      icon: FileText,
      downloadUrl: '#'
    },
    {
      title: 'Vídeo Tutorial - DISC',
      description: 'Como fazer e interpretar análises DISC',
      type: 'Vídeo',
      icon: Video,
      watchUrl: '#'
    },
    {
      title: 'Manual de Gamificação',
      description: 'Como implementar e gerenciar o sistema de badges',
      type: 'PDF',
      icon: Trophy,
      downloadUrl: '#'
    },
    {
      title: 'API Documentation',
      description: 'Documentação técnica para integrações',
      type: 'Web',
      icon: ExternalLink,
      externalUrl: '#'
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Global Header */}
      <Header showAuth={true} />

      {/* Documentation Header */}
      <div className="border-b bg-gradient-to-r from-primary/5 to-purple-100/50 dark:from-gray-800/30 dark:to-gray-700/20">
        <div className="container mx-auto px-3 sm:px-4 md:px-6 py-6 sm:py-8 md:py-12">
          <div className="text-center max-w-3xl mx-auto">
            <div className="flex items-center justify-center gap-1 sm:gap-2 mb-2 sm:mb-4">
              <BookOpen className="h-7 sm:h-10 w-7 sm:w-10 text-primary" />
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold">Central de Documentação</h1>
            </div>
            <p className="text-sm sm:text-base md:text-lg text-muted-foreground mb-4 sm:mb-6">
              Explore todas as funcionalidades da Humansys e maximize o potencial da sua gestão de RH
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 w-full">
              <Button onClick={() => navigate('/app/dashboard')} className="w-full sm:w-auto text-xs sm:text-base px-3 sm:px-6 py-2 sm:py-3">
                <Play className="h-3 sm:h-5 w-3 sm:w-5 mr-1 sm:mr-2" />
                Começar Agora
              </Button>
              <Button variant="outline" className="w-full sm:w-auto text-xs sm:text-base px-3 sm:px-6 py-2 sm:py-3">
                <Video className="h-3 sm:h-5 w-3 sm:w-5 mr-1 sm:mr-2" />
                Ver Demo
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-3 sm:px-4 md:px-6 py-6 sm:py-8">
        <Tabs defaultValue="showcase" className="space-y-6 sm:space-y-8">
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 max-w-full sm:max-w-2xl mx-auto gap-1 sm:gap-0 h-auto sm:h-10">
            <TabsTrigger value="showcase" className="text-xs sm:text-sm">Showcase</TabsTrigger>
            <TabsTrigger value="quickstart" className="text-xs sm:text-sm">Início Rápido</TabsTrigger>
            <TabsTrigger value="features" className="text-xs sm:text-sm">Funcionalidades</TabsTrigger>
            <TabsTrigger value="resources" className="text-xs sm:text-sm">Recursos</TabsTrigger>
          </TabsList>

          <TabsContent value="showcase" className="space-y-8">
            {/* Carrossel Principal */}
            <Card>
              <CardHeader>
                <CardTitle className="text-center">Conheça Nossa Plataforma</CardTitle>
                <CardDescription className="text-center">
                  Explore visualmente as principais funcionalidades que vão transformar sua gestão de RH
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Carousel className="w-full max-w-5xl mx-auto">
                  <CarouselContent>
                    {platformFeatures.map((feature) => (
                      <CarouselItem key={feature.id} className="md:basis-1/2 lg:basis-1/3">
                        <Card className="h-full cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1" 
                              onClick={() => navigate(feature.path)}>
                          <CardContent className="p-0">
                            <div className="relative">
                              <img 
                                src={feature.image} 
                                alt={feature.title}
                                className="w-full h-48 object-cover rounded-t-lg"
                              />
                              <div className="absolute top-3 right-3 flex gap-1">
                                {feature.isNew && (
                                  <Badge className="bg-green-500 text-white">Novo</Badge>
                                )}
                                <Badge variant="outline">{feature.category}</Badge>
                              </div>
                            </div>
                            <div className="p-4">
                              <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                              <p className="text-sm text-muted-foreground mb-3">
                                {feature.description}
                              </p>
                              <Button variant="outline" size="sm" className="w-full">
                                Explorar <ArrowRight className="h-4 w-4 ml-2" />
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  <CarouselPrevious />
                  <CarouselNext />
                </Carousel>
              </CardContent>
            </Card>

            {/* Estatísticas da Plataforma */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-6">
              <Card className="text-center">
                <CardContent className="p-6">
                  <Users className="h-8 w-8 text-primary mx-auto mb-2" />
                  <div className="text-2xl font-bold">50+</div>
                  <div className="text-sm text-muted-foreground">Funcionalidades</div>
                </CardContent>
              </Card>
              <Card className="text-center">
                <CardContent className="p-6">
                  <Brain className="h-8 w-8 text-purple-500 mx-auto mb-2" />
                  <div className="text-2xl font-bold">94.7%</div>
                  <div className="text-sm text-muted-foreground">Precisão IAO</div>
                </CardContent>
              </Card>
              <Card className="text-center">
                <CardContent className="p-6">
                  <Zap className="h-8 w-8 text-green-500 mx-auto mb-2" />
                  <div className="text-2xl font-bold">24/7</div>
                  <div className="text-sm text-muted-foreground">IA Assistant</div>
                </CardContent>
              </Card>
              <Card className="text-center">
                <CardContent className="p-6">
                  <Trophy className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
                  <div className="text-2xl font-bold">100%</div>
                  <div className="text-sm text-muted-foreground">Gamificado</div>
                </CardContent>
              </Card>
              <Card className="text-center">
                <CardContent className="p-6">
                  <BarChart3 className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                  <div className="text-2xl font-bold">Real-time</div>
                  <div className="text-sm text-muted-foreground">Analytics</div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="quickstart" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Primeiros Passos</CardTitle>
                <CardDescription>
                  Siga este guia para configurar sua plataforma em menos de 30 minutos
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {quickStartGuide.map((step) => (
                    <div key={step.step} className="flex gap-4 p-4 border rounded-lg dark:border-gray-700 dark:bg-gray-800/50">
                      <div className="w-12 h-12 bg-primary/10 dark:bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0">
                        <step.icon className="h-6 w-6 text-primary" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-semibold">Passo {step.step}: {step.title}</h3>
                          <Badge variant="outline">{step.time}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{step.description}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 p-4 bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-900/50 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Star className="h-5 w-5 text-green-600 dark:text-green-400" />
                    <span className="font-medium text-green-800 dark:text-green-200">Dica Pro</span>
                  </div>
                  <p className="text-sm text-green-700 dark:text-green-300">
                    Use o assistente virtual durante a configuração inicial para dicas personalizadas baseadas no seu setor.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="features" className="space-y-6">
            {/* Seção especial para Brainsys IAO V.1 e IA Assistant */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold mb-4 text-center">🧠 Núcleo de Inteligência Artificial</h3>
              <div className="grid gap-6 md:grid-cols-2">
                {/* Brainsys IAO V.1 */}
                <Card className="relative overflow-hidden bg-gradient-to-br from-purple-900/20 to-blue-900/20 border-purple-500/30">
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-blue-500/10"></div>
                  <CardHeader className="relative">
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                        <Brain className="h-8 w-8 text-white" />
                      </div>
                      <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">V.1</Badge>
                    </div>
                    <CardTitle className="text-xl text-purple-900 dark:text-purple-100">Brainsys IAO V.1</CardTitle>
                    <CardDescription className="text-purple-700 dark:text-purple-300">
                      Orquestrador de Inteligência Organizacional
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="relative space-y-3">
                    <div className="flex items-center gap-2 text-sm text-purple-800 dark:text-purple-200">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      <span>Análises preditivas em tempo real</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-purple-800 dark:text-purple-200">
                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                      <span>Machine Learning avançado</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-purple-800 dark:text-purple-200">
                      <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
                      <span>94.7% de precisão preditiva</span>
                    </div>
                    <Button 
                      className="w-full mt-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                      onClick={() => navigate('/app/brainsys-iao')}
                    >
                      Acessar IAO <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </CardContent>
                </Card>

                {/* IA Assistant */}
                <Card className="relative overflow-hidden bg-gradient-to-br from-green-900/20 to-emerald-900/20 border-green-500/30">
                  <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-emerald-500/10"></div>
                  <CardHeader className="relative">
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
                        <Zap className="h-8 w-8 text-white" />
                      </div>
                      <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                    </div>
                    <CardTitle className="text-xl text-green-900 dark:text-green-100">IA Assistant</CardTitle>
                    <CardDescription className="text-green-700 dark:text-green-300">
                      Assistente Inteligente 24/7
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="relative space-y-3">
                    <div className="flex items-center gap-2 text-sm text-green-800 dark:text-green-200">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      <span>Suporte instantâneo e inteligente</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-green-800 dark:text-green-200">
                      <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                      <span>Respostas contextuais personalizadas</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-green-800 dark:text-green-200">
                      <div className="w-2 h-2 bg-teal-500 rounded-full animate-pulse"></div>
                      <span>Integração completa com o sistema</span>
                    </div>
                    <Button 
                      className="w-full mt-4 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                      onClick={() => navigate('/app/dashboard')}
                    >
                      Falar com IA <MessageSquare className="h-4 w-4 ml-2" />
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>

            <div className="border-t pt-6">
              <h3 className="text-xl font-semibold mb-4 text-center">📊 Funcionalidades Principais</h3>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {[
                  { icon: Brain, title: 'Análise DISC', desc: 'IA para perfil comportamental', path: '/app/disc', new: true },
                  { icon: Crown, title: 'Founder Dashboard', desc: 'Métricas estratégicas', path: '/founder/dashboard', new: true },
                  { icon: Users, title: 'Colaboradores', desc: 'Gestão completa da equipe', path: '/app/collaborators' },
                  { icon: UserPlus, title: 'Onboarding', desc: 'Integração estruturada', path: '/app/onboarding' },
                  { icon: MessageSquare, title: 'Feedback 360°', desc: 'Avaliações completas', path: '/app/feedback' },
                  { icon: Target, title: 'Metas & PDI', desc: 'Desenvolvimento individual', path: '/app/goals' },
                  { icon: Video, title: 'Treinamentos', desc: 'Plataforma de cursos', path: '/app/training' },
                  { icon: Calendar, title: 'Reuniões 1:1', desc: 'Agendamento inteligente', path: '/app/meetings' },
                  { icon: Trophy, title: 'Gamificação', desc: 'Badges e conquistas', path: '/app/dashboard' }
                ].map((feature, index) => (
                  <Card key={index} className="cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
                        onClick={() => navigate(feature.path)}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                          <feature.icon className="h-6 w-6 text-primary" />
                        </div>
                        {feature.new && (
                          <Badge className="bg-green-500 text-white">Novo</Badge>
                        )}
                      </div>
                      <CardTitle className="text-lg">{feature.title}</CardTitle>
                      <CardDescription>{feature.desc}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Button variant="outline" size="sm" className="w-full">
                        Acessar <ArrowRight className="h-4 w-4 ml-2" />
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="resources" className="space-y-6">
            {/* Seção especial para recursos de IA */}
            <Card className="bg-gradient-to-r from-purple-50 dark:from-purple-950/20 to-blue-50 dark:to-blue-950/20 border-purple-200 dark:border-purple-900/50 mb-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                  Recursos de Inteligência Artificial
                </CardTitle>
                <CardDescription>
                  Documentação específica sobre nossos módulos de IA
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-purple-200 dark:border-purple-900/50">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-600 rounded-lg flex items-center justify-center">
                        <Brain className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-purple-900 dark:text-purple-100">Manual Brainsys IAO V.1</h4>
                        <Badge variant="outline" className="text-xs">PDF</Badge>
                      </div>
                    </div>
                    <p className="text-sm text-purple-700 dark:text-purple-300 mb-3">
                      Guia completo do Orquestrador de Inteligência Organizacional
                    </p>
                    <Button variant="outline" size="sm" className="w-full">
                      <Download className="h-4 w-4 mr-2" />
                      Download Manual IAO
                    </Button>
                  </div>
                  
                  <div className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-green-200 dark:border-green-900/50">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
                        <Zap className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-green-900">Tutorial IA Assistant</h4>
                        <Badge variant="outline" className="text-xs">Vídeo</Badge>
                      </div>
                    </div>
                    <p className="text-sm text-green-700 mb-3">
                      Como usar efetivamente o assistente de IA 24/7
                    </p>
                    <Button variant="outline" size="sm" className="w-full">
                      <Play className="h-4 w-4 mr-2" />
                      Assistir Tutorial
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid gap-6 md:grid-cols-2">
              {resources.map((resource, index) => (
                <Card key={index}>
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                        <resource.icon className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{resource.title}</CardTitle>
                        <Badge variant="outline">{resource.type}</Badge>
                      </div>
                    </div>
                    <CardDescription>{resource.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button variant="outline" className="w-full">
                      {resource.type === 'PDF' && <Download className="h-4 w-4 mr-2" />}
                      {resource.type === 'Vídeo' && <Play className="h-4 w-4 mr-2" />}
                      {resource.type === 'Web' && <ExternalLink className="h-4 w-4 mr-2" />}
                      {resource.type === 'PDF' ? 'Download' : resource.type === 'Vídeo' ? 'Assistir' : 'Acessar'}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-6 w-6 text-blue-600" />
                  Precisa de Ajuda Personalizada?
                </CardTitle>
                <CardDescription>
                  Nossa equipe está disponível para orientações específicas sobre implementação
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex gap-3">
                  <Button>
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Chat de Suporte
                  </Button>
                  <Button variant="outline">
                    <Calendar className="h-4 w-4 mr-2" />
                    Agendar Consultoria
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Footer */}
      <footer className="w-full border-t py-8 sm:py-12 md:py-16 relative overflow-hidden mt-12 sm:mt-16">
        <MouseTrail 
          colors={[
            '#10b981',
            '#06b6d4',
            '#8b5cf6',
            '#f59e0b',
            '#ec4899',
            '#3b82f6',
            '#22c55e',
            '#f97316',
          ]}
          particleCount={4}
          particleLife={80}
        />
        <div className="w-full mx-auto px-3 sm:px-4 md:px-6 lg:px-8 relative z-20">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
            <div>
              <h3 className="font-semibold mb-3 sm:mb-4 text-sm sm:text-base">Produto</h3>
              <ul className="space-y-2 text-xs sm:text-sm text-muted-foreground">
                <li><button onClick={() => navigate('/app/dashboard')} className="hover:text-primary text-left transition-colors">Funcionalidades</button></li>
                <li><button onClick={() => navigate('/brainsys')} className="hover:text-primary text-left transition-colors">BrainSys</button></li>
                <li><button onClick={() => navigate('/plans')} className="hover:text-primary text-left transition-colors">Preços</button></li>
                <li><button onClick={() => navigate('/changelog')} className="hover:text-primary text-left transition-colors">Novidades</button></li>
                <li><button onClick={() => navigate('/app/settings')} className="hover:text-primary text-left transition-colors">Integrações</button></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-3 sm:mb-4 text-sm sm:text-base">Empresa</h3>
              <ul className="space-y-2 text-xs sm:text-sm text-muted-foreground">
                <li><button onClick={() => navigate('/about')} className="hover:text-primary text-left transition-colors">Sobre</button></li>
                <li><button onClick={() => navigate('/careers')} className="hover:text-primary text-left transition-colors">Carreiras</button></li>
                <li><button onClick={() => navigate('/blog')} className="hover:text-primary text-left transition-colors">Blog</button></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-3 sm:mb-4 text-sm sm:text-base">Suporte</h3>
              <ul className="space-y-2 text-xs sm:text-sm text-muted-foreground">
                <li><button onClick={() => navigate('/documentation')} className="hover:text-primary text-left transition-colors">Documentação</button></li>
                <li><button onClick={() => navigate('/help')} className="hover:text-primary text-left transition-colors">Ajuda</button></li>
                <li><button onClick={() => navigate('/contact')} className="hover:text-primary text-left transition-colors">Contato</button></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-3 sm:mb-4 text-sm sm:text-base">Legal</h3>
              <ul className="space-y-2 text-xs sm:text-sm text-muted-foreground">
                <li><button onClick={() => navigate('/privacy')} className="hover:text-primary text-left transition-colors">Política de Privacidade</button></li>
                <li><button onClick={() => navigate('/termsofservices')} className="hover:text-primary text-left transition-colors">Termos de Uso</button></li>
              </ul>
            </div>
          </div>

          <div className="border-t mt-6 sm:mt-8 pt-6 sm:pt-8 relative">
            <div className="absolute left-0 top-1/2 transform -translate-y-1/2 hidden md:block">
              <img src="/seloontotech.png" alt="Seloontotech Logo" className="w-32 h-auto opacity-75 hover:opacity-100 transition-opacity" />
            </div>
            <div className="text-center flex flex-col items-center space-y-2">
              <img 
                src={actualTheme === 'dark' ? "/Humansysbranco.png" : "/Humansys.png"}
                alt="Logotipo da Humansys" 
                className="w-32 sm:w-40 h-auto mb-2 object-contain"
              />
              
              <p className="text-muted-foreground text-xs sm:text-sm">
                &copy; 2024 Humansys. Todos os direitos reservados.
              </p>
              <p className="text-muted-foreground text-xs">
                CNPJ: 61.209.173/0001-09
              </p>
              <div className="flex space-x-3 sm:space-x-4 mt-2">
                {socialLinks.map((social, index) => {
                  const Icon = social.icon;
                  return (
                    <a
                      key={index}
                      href={social.href}
                      className="text-muted-foreground hover:text-primary transition-colors"
                      aria-label={social.label}
                    >
                      <Icon className="h-4 sm:h-5 w-4 sm:w-5" />
                    </a>
                  );
                })}
              </div>
              <div className="mt-4">
                <ScrollToTopButton />
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
