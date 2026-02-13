
import React from 'react';
import { Header } from '@/components/layout/Header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DynamicBadge } from '@/components/landing/DynamicBadge';
import { Brain, Trophy, Smartphone, Users, MessageSquare, BarChart3, Shield, Zap } from 'lucide-react';

export const PublicChangelog = () => {
  const updates = [
    {
      version: "2.5.0",
      date: "2024-12-01",
      title: "Inteligência Artificial e Gamificação",
      isNew: true,
      features: [
        {
          icon: Brain,
          title: "Analytics Preditiva com IA",
          description: "Machine Learning para prever turnover e identificar talentos em risco com 85% de precisão.",
          impact: "Redução de 60% na rotatividade não planejada"
        },
        {
          icon: Trophy,
          title: "Sistema Completo de Gamificação",
          description: "Badges, conquistas, rankings e sistema de pontos para engajar colaboradores.",
          impact: "Aumento de 45% no engajamento da equipe"
        },
        {
          icon: Smartphone,
          title: "Progressive Web App (PWA)",
          description: "Aplicativo móvel que funciona offline e pode ser instalado como app nativo.",
          impact: "Acesso 24/7 mesmo sem internet"
        }
      ]
    },
    {
      version: "2.4.0",
      date: "2024-11-15",
      title: "Melhorias na Experiência do Usuário",
      features: [
        {
          icon: Users,
          title: "Gestão Avançada de Colaboradores",
          description: "Interface redesenhada com filtros inteligentes e busca otimizada.",
          impact: "50% mais rápido para encontrar informações"
        },
        {
          icon: MessageSquare,
          title: "Feedback 360° Aprimorado",
          description: "Sistema de feedbacks mais intuitivo com templates personalizáveis.",
          impact: "95% dos feedbacks entregues no prazo"
        }
      ]
    },
    {
      version: "2.3.0",
      date: "2024-11-01",
      title: "Analytics e Relatórios",
      features: [
        {
          icon: BarChart3,
          title: "Dashboard Executivo",
          description: "Novos relatórios com insights automáticos e métricas avançadas.",
          impact: "Decisões 70% mais rápidas"
        },
        {
          icon: Shield,
          title: "Segurança Aprimorada",
          description: "Implementação de autenticação multifator e criptografia avançada.",
          impact: "100% de conformidade com LGPD"
        }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header showAuth />
      
      <div className="container py-20">
        <div className="mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold tracking-tight md:text-5xl mb-4">
              Novidades da Plataforma
            </h1>
            <p className="text-xl text-muted-foreground">
              Acompanhe todas as atualizações e melhorias do HumanSys
            </p>
          </div>

          <div className="space-y-8">
            {updates.map((update, index) => (
              <Card key={index} className="overflow-hidden">
                <CardHeader className="bg-muted/50">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-3">
                        Versão {update.version}
                        {update.isNew && <DynamicBadge>Novo</DynamicBadge>}
                      </CardTitle>
                      <CardDescription className="text-lg mt-1">
                        {update.title}
                      </CardDescription>
                    </div>
                    <Badge variant="outline">
                      {new Date(update.date).toLocaleDateString('pt-BR')}
                    </Badge>
                  </div>
                </CardHeader>
                
                <CardContent className="pt-6">
                  <div className="grid gap-6 md:grid-cols-1">
                    {update.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-start space-x-4 p-4 bg-muted/30 rounded-lg">
                        <div className="flex-shrink-0 p-2 bg-primary/10 rounded-full">
                          <feature.icon className="h-6 w-6 text-primary" />
                        </div>
                        <div className="flex-grow">
                          <h3 className="font-semibold mb-2">{feature.title}</h3>
                          <p className="text-muted-foreground mb-3">{feature.description}</p>
                          <div className="flex items-center space-x-2">
                            <Zap className="h-4 w-4 text-green-600" />
                            <span className="text-sm font-medium text-green-600">{feature.impact}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <Card className="bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
              <CardContent className="pt-6">
                <h3 className="text-xl font-semibold mb-4">
                  Quer experimentar todas essas novidades?
                </h3>
                <p className="text-muted-foreground mb-6">
                  Comece seu teste grátis de 30 dias e veja como nossa IA pode transformar seu RH.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <a
                    href="/plans"
                    className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90 transition-colors"
                  >
                    <Shield className="mr-2 h-4 w-4" />
                    Começar Teste Grátis
                  </a>
                  <a
                    href="/app/dashboard"
                    className="inline-flex items-center justify-center rounded-md border border-input bg-background px-6 py-3 text-sm font-medium shadow-sm hover:bg-accent hover:text-accent-foreground transition-colors"
                  >
                    Ver Demonstração
                  </a>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};
