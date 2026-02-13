
import React from 'react';
import { Header } from '@/components/layout/Header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CheckCircle, Star, Zap, Brain, Trophy, Video, Smartphone, TrendingUp, Crown, DollarSign, FileText, Users, MessageSquare, Target, BarChart3, Shield, Lightbulb, Settings, Calendar, Award, UserPlus, Briefcase } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const Changelog = () => {
  const navigate = useNavigate();

  const updates = [
    {
      version: '4.0.0',
      date: '2024-01-25',
      type: 'major' as const,
      title: 'Grande Atualização: IA Avançada e Modernização Completa',
      description: 'Lançamento da versão 4.0 com inteligência artificial avançada, interface completamente redesenhada e novas funcionalidades revolucionárias.',
      features: [
        {
          icon: Brain,
          title: 'Sistema DISC com IA Revolucionário',
          description: 'Análise comportamental DISC completamente renovada com insights de IA, questionário de 12 perguntas e relatórios em HTML exportáveis'
        },
        {
          icon: Crown,
          title: 'Founder Dashboard Premium',
          description: 'Dashboard exclusivo para founders com métricas SaaS, IA preditiva para churn, análise de receita e forecasting inteligente'
        },
        {
          icon: Trophy,
          title: 'Gamificação Completa',
          description: 'Sistema de badges, conquistas, rankings e pontuação para todos os módulos da plataforma'
        },
        {
          icon: Lightbulb,
          title: 'Interface Moderna Redesenhada',
          description: 'Sidebar modernizada, componentes atualizados e experiência de usuário completamente repensada'
        },
        {
          icon: Shield,
          title: 'Sistema de Segurança Avançado',
          description: 'Proteção contra vazamentos, watermarks para preview e monitoramento de segurança em tempo real'
        },
        {
          icon: FileText,
          title: 'Central de Documentação Interativa',
          description: 'Nova página de documentação com carrossel de funcionalidades, guias interativos e recursos visuais'
        }
      ],
      impacts: [
        'Aumento de 85% na precisão das análises comportamentais',
        'Redução de 60% no tempo de setup inicial',
        'Interface 3x mais moderna e intuitiva',
        'Previsões de negócio com 90% de precisão',
        'Segurança enterprise-grade implementada',
        'Experiência de usuário completamente revolucionária'
      ],
      testimonial: {
        text: "A versão 4.0 transformou completamente nossa gestão de RH. A IA para análise DISC e as previsões do Founder Dashboard são impressionantes!",
        author: "Ana Carolina",
        role: "VP de People, TechInnovate"
      }
    },
    {
      version: '3.8.0',
      date: '2024-01-20',
      type: 'major' as const,
      title: 'IA Preditiva e Analytics Avançadas',
      description: 'Sistema completo de machine learning para previsões de turnover, análise de produtividade e alertas inteligentes.',
      features: [
        {
          icon: Brain,
          title: 'Machine Learning para RH',
          description: 'Algoritmos de IA para prever turnover e identificar talentos em risco com 85% de precisão'
        },
        {
          icon: TrendingUp,
          title: 'Analytics Preditivas',
          description: 'Dashboard com métricas avançadas de produtividade, engajamento e performance'
        },
        {
          icon: Zap,
          title: 'Alertas Inteligentes',
          description: 'Notificações automáticas baseadas em padrões de comportamento e risco de saída'
        },
        {
          icon: BarChart3,
          title: 'Relatórios Automáticos',
          description: 'Geração automática de relatórios executivos com insights acionáveis'
        }
      ],
      impacts: [
        'Identificação precoce de 90% dos casos de turnover',
        'Aumento de 45% na retenção de talentos',
        'Decisões de RH 70% mais rápidas',
        'ROI de 300% em prevenção de rotatividade'
      ],
      testimonial: {
        text: "Os insights de IA nos ajudaram a reduzir drasticamente nossa rotatividade. O sistema previu com precisão quais colaboradores estavam em risco.",
        author: "Roberto Silva",
        role: "Diretor de RH, MegaCorp"
      }
    },
    {
      version: '3.7.0',
      date: '2024-01-15',
      type: 'major' as const,
      title: 'Experiência Mobile e PWA',
      description: 'Aplicativo progressivo (PWA) com funcionalidade offline, interface responsiva otimizada e sincronização inteligente.',
      features: [
        {
          icon: Smartphone,
          title: 'Progressive Web App',
          description: 'Aplicativo pode ser instalado e funciona offline com sincronização automática'
        },
        {
          icon: Video,
          title: 'Player de Vídeo Avançado',
          description: 'Sistema de reprodução de vídeos com controles avançados e acompanhamento de progresso'
        },
        {
          icon: Settings,
          title: 'Otimização de Performance',
          description: 'Carregamento 50% mais rápido e consumo reduzido de dados'
        },
        {
          icon: UserPlus,
          title: 'Onboarding Mobile',
          description: 'Processo de integração otimizado para dispositivos móveis'
        }
      ],
      impacts: [
        'Acesso móvel para 100% dos colaboradores',
        'Uso offline em situações sem internet',
        'Engajamento móvel 200% maior',
        'Experiência nativa em qualquer dispositivo'
      ]
    },
    {
      version: '3.6.0',
      date: '2024-01-10',
      type: 'feature' as const,
      title: 'Sistema de Treinamentos Inteligente',
      description: 'Plataforma completa de e-learning com IA para personalização, certificações automáticas e gamificação.',
      features: [
        {
          icon: Award,
          title: 'Certificações Automáticas',
          description: 'Geração automática de certificados personalizáveis ao concluir treinamentos'
        },
        {
          icon: Target,
          title: 'Trilhas de Aprendizado',
          description: 'Caminhos de desenvolvimento personalizados baseados no perfil do colaborador'
        },
        {
          icon: Trophy,
          title: 'Gamificação de Aprendizado',
          description: 'Badges e conquistas específicas para motivar o desenvolvimento contínuo'
        },
        {
          icon: BarChart3,
          title: 'Analytics de Aprendizado',
          description: 'Métricas detalhadas de progresso e efetividade dos treinamentos'
        }
      ]
    },
    {
      version: '3.5.0',
      date: '2024-01-05',
      type: 'feature' as const,
      title: 'Gestão de Colaboradores Avançada',
      description: 'Sistema completo de gestão com filtros inteligentes, busca otimizada e perfis detalhados.',
      features: [
        {
          icon: Users,
          title: 'Filtros Inteligentes',
          description: 'Sistema de busca e filtros avançados com IA para encontrar perfis específicos'
        },
        {
          icon: Briefcase,
          title: 'Gestão de Competências',
          description: 'Mapeamento completo de skills e competências com gaps de desenvolvimento'
        },
        {
          icon: Calendar,
          title: 'Reuniões 1:1 Inteligentes',
          description: 'Agendamento automático baseado na disponibilidade e prioridades'
        },
        {
          icon: MessageSquare,
          title: 'Feedback 360° Avançado',
          description: 'Sistema estruturado de feedback com templates personalizáveis'
        }
      ]
    },
    {
      version: '3.4.0',
      date: '2023-12-20',
      type: 'feature' as const,
      title: 'Sistema de Metas e PDI',
      description: 'Plano de Desenvolvimento Individual com acompanhamento inteligente e métricas de progresso.',
      features: [
        {
          icon: Target,
          title: 'Metas SMART Automáticas',
          description: 'Criação assistida de metas com validação automática dos critérios SMART'
        },
        {
          icon: TrendingUp,
          title: 'Acompanhamento em Tempo Real',
          description: 'Dashboard de progresso com atualizações automáticas e alertas'
        },
        {
          icon: Award,
          title: 'Planos de Desenvolvimento',
          description: 'PDI personalizado com sugestões baseadas em perfil comportamental'
        }
      ]
    }
  ];

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'major': return 'bg-purple-500';
      case 'feature': return 'bg-blue-500';
      case 'fix': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'major': return 'Grande Atualização';
      case 'feature': return 'Nova Funcionalidade';
      case 'fix': return 'Correção';
      default: return 'Atualização';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header showAuth />

      <div className="container py-20">
        <div className="mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h1 className="text-4xl font-bold tracking-tight md:text-5xl mb-4">
              Changelog & Novidades
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Acompanhe todas as inovações e melhorias que estamos implementando no HumanSys
            </p>
            <div className="flex items-center justify-center gap-4">
              <Button onClick={() => navigate('/app/dashboard')} size="lg">
                <Crown className="h-5 w-5 mr-2" />
                Explorar Plataforma
              </Button>
              <Button variant="outline" size="lg" onClick={() => navigate('/documentation')}>
                <FileText className="h-5 w-5 mr-2" />
                Ver Documentação
              </Button>
            </div>
          </div>

          <div className="space-y-12">
            {updates.map((update, index) => (
              <Card key={index} className="relative overflow-hidden border-2 hover:border-primary/20 transition-colors">
                <CardHeader className="bg-gradient-to-r from-muted/50 to-transparent">
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        <Badge className={`${getTypeColor(update.type)} text-white`}>
                          {update.version}
                        </Badge>
                        <Badge variant="outline">
                          {getTypeLabel(update.type)}
                        </Badge>
                        {update.type === 'major' && (
                          <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white">
                            <Star className="h-3 w-3 mr-1" />
                            Destaque
                          </Badge>
                        )}
                      </div>
                      <CardTitle className="text-2xl">{update.title}</CardTitle>
                      <CardDescription className="text-base">
                        {update.description}
                      </CardDescription>
                      <p className="text-sm text-muted-foreground">
                        Lançado em {new Date(update.date).toLocaleDateString('pt-BR', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="p-6">
                  {/* Funcionalidades */}
                  <div className="mb-8">
                    <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
                      <Zap className="h-5 w-5 text-primary" />
                      Principais Funcionalidades
                    </h4>
                    <div className="grid gap-4 md:grid-cols-2">
                      {update.features.map((feature, featureIndex) => {
                        const Icon = feature.icon;
                        return (
                          <div key={featureIndex} className="flex gap-4 p-4 bg-muted/30 rounded-lg border">
                            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                              <Icon className="h-6 w-6 text-primary" />
                            </div>
                            <div>
                              <h5 className="font-semibold mb-1">{feature.title}</h5>
                              <p className="text-sm text-muted-foreground">
                                {feature.description}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Impactos */}
                  {update.impacts && (
                    <div className="mb-8">
                      <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        <TrendingUp className="h-5 w-5 text-green-600" />
                        Impactos e Resultados
                      </h4>
                      <div className="grid gap-2 md:grid-cols-2">
                        {update.impacts.map((impact, impactIndex) => (
                          <div key={impactIndex} className="flex items-center gap-3 p-3 bg-green-50 rounded-lg border border-green-200">
                            <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                            <span className="text-sm font-medium text-green-800">{impact}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Depoimento */}
                  {update.testimonial && (
                    <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg border border-blue-200">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <MessageSquare className="h-6 w-6 text-blue-600" />
                        </div>
                        <div>
                          <blockquote className="text-sm font-medium text-blue-900 mb-2">
                            "{update.testimonial.text}"
                          </blockquote>
                          <div className="text-xs text-blue-700">
                            <strong>{update.testimonial.author}</strong> • {update.testimonial.role}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Roadmap Futuro */}
          <div className="mt-20">
            <Card className="bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 border-2 border-purple-200">
              <CardContent className="p-8">
                <div className="text-center mb-8">
                  <h3 className="text-3xl font-bold mb-4 text-purple-900">
                    🚀 Próximas Inovações
                  </h3>
                  <p className="text-lg text-purple-700 mb-6">
                    Estamos trabalhando nas próximas funcionalidades revolucionárias
                  </p>
                </div>
                
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                  <div className="text-center p-6 bg-white/50 rounded-xl border border-purple-200">
                    <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Brain className="h-8 w-8 text-purple-600" />
                    </div>
                    <h4 className="font-bold text-purple-900 mb-2">IA Conversacional</h4>
                    <p className="text-sm text-purple-700">Assistente virtual para dúvidas de RH em tempo real</p>
                  </div>
                  
                  <div className="text-center p-6 bg-white/50 rounded-xl border border-blue-200">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Smartphone className="h-8 w-8 text-blue-600" />
                    </div>
                    <h4 className="font-bold text-blue-900 mb-2">App Nativo</h4>
                    <p className="text-sm text-blue-700">Aplicativo iOS e Android com funcionalidades exclusivas</p>
                  </div>
                  
                  <div className="text-center p-6 bg-white/50 rounded-xl border border-green-200">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <BarChart3 className="h-8 w-8 text-green-600" />
                    </div>
                    <h4 className="font-bold text-green-900 mb-2">Analytics Avançadas</h4>
                    <p className="text-sm text-green-700">Dashboard executivo com insights de mercado</p>
                  </div>
                  
                  <div className="text-center p-6 bg-white/50 rounded-xl border border-orange-200">
                    <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Trophy className="h-8 w-8 text-orange-600" />
                    </div>
                    <h4 className="font-bold text-orange-900 mb-2">Gamificação 2.0</h4>
                    <p className="text-sm text-orange-700">Sistema de rewards e competições entre equipes</p>
                  </div>
                </div>

                <div className="text-center mt-8">
                  <Button size="lg" className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
                    <Star className="h-5 w-5 mr-2" />
                    Seja Beta Tester
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};
