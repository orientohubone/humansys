import React from 'react';
import { Header } from '@/components/layout/Header';
import { useTheme } from '@/contexts/ThemeContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MouseTrail } from '@/components/ui/mouse-trail';
import { 
  Brain, 
  Users, 
  Target, 
  Award, 
  Sparkles, 
  Crown,
  Shield,
  TrendingUp,
  Zap,
  Heart,
  Building,
  Lightbulb,
  Linkedin,
  Instagram,
  Facebook,
  Github
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const About = () => {
  const navigate = useNavigate();
  const { actualTheme } = useTheme();

  const socialLinks = [
    { icon: Linkedin, href: '#', label: 'LinkedIn' },
    { icon: Instagram, href: '#', label: 'Instagram' },
    { icon: Facebook, href: '#', label: 'Facebook' },
    { icon: Github, href: '#', label: 'GitHub' },
  ];

  const features = [
    {
      icon: Brain,
      title: 'IA Avançada Integrada',
      description: 'Brainsys IAO V.1 com análise DISC inteligente, insights preditivos e automação completa',
      isNew: true
    },
    {
      icon: Crown,
      title: 'Founder Dashboard',
      description: 'Métricas SaaS exclusivas, análise de churn e forecasting para founders',
      isPro: true
    },
    {
      icon: Users,
      title: 'Gestão Completa de Pessoas',
      description: 'Do recrutamento ao offboarding, com sistema de créditos e permissões avançadas'
    },
    {
      icon: Award,
      title: 'Gamificação Total',
      description: 'Sistema de badges, rankings e conquistas para maximizar o engajamento'
    },
    {
      icon: Shield,
      title: 'Segurança Empresarial',
      description: 'Proteção contra vazamentos, watermarks e monitoramento em tempo real'
    },
    {
      icon: TrendingUp,
      title: 'Analytics Preditivos',
      description: 'Machine Learning para previsão de tendências e tomada de decisão estratégica'
    }
  ];

  const stats = [
    { number: '500+', label: 'Empresas Atendidas' },
    { number: '50k+', label: 'Colaboradores Gerenciados' },
    { number: '99.9%', label: 'Uptime Garantido' },
    { number: '24/7', label: 'Suporte Especializado' }
  ];

  const team = [
    {
      name: 'Equipe de IA',
      role: 'Desenvolvimento de Inteligência Artificial',
      description: 'Especialistas em ML e processamento de linguagem natural'
    },
    {
      name: 'Equipe de Produto',
      role: 'UX/UI e Product Management',
      description: 'Focados na melhor experiência do usuário'
    },
    {
      name: 'Equipe de RH',
      role: 'Consultoria Especializada',
      description: 'Profissionais com décadas de experiência em gestão de pessoas'
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header showAuth />

      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-6 sm:py-8 md:py-12 lg:py-16">
        {/* Hero Section */}
        <div className="text-center mb-8 sm:mb-12 md:mb-16">
          <div className="flex justify-center mb-4 sm:mb-6">
            <div className="w-12 sm:w-16 h-12 sm:h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center">
              <Sparkles className="h-6 sm:h-8 w-6 sm:w-8 text-white" />
            </div>
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-6xl font-bold tracking-tight mb-4 sm:mb-6">
            Sobre a <span className="text-green-600">HumanSys</span>
          </h1>
          <p className="text-sm sm:text-base md:text-lg lg:text-xl text-muted-foreground max-w-3xl mx-auto mb-6 sm:mb-8">
            Revolucionamos a gestão de pessoas com inteligência artificial avançada, 
            oferecendo a plataforma mais completa e inovadora do mercado.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-2 sm:gap-4">
            <Button className="text-xs sm:text-base px-3 sm:px-4 py-2 sm:py-3" onClick={() => navigate('/plans')}>
              <Zap className="h-4 w-4 mr-1 sm:mr-2" />
              Começar Agora
            </Button>
            <Button variant="outline" className="text-xs sm:text-base px-3 sm:px-4 py-2 sm:py-3" onClick={() => navigate('/app/documentation')}>
              <Lightbulb className="h-4 w-4 mr-1 sm:mr-2" />
              Ver Documentação
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 md:gap-8 mb-12 sm:mb-16">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-xl sm:text-2xl md:text-3xl font-bold text-green-600 mb-1 sm:mb-2">{stat.number}</div>
              <div className="text-xs sm:text-sm text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Nossa Missão */}
        <div className="mb-12 sm:mb-16">
          <Card className="border-green-200 dark:border-green-900/50 bg-gradient-to-br from-green-50 dark:from-green-950/20 to-emerald-50 dark:to-emerald-950/20">
            <CardContent className="p-4 sm:p-6 md:p-8">
              <div className="text-center mb-6 sm:mb-8">
                <Heart className="h-10 sm:h-12 w-10 sm:w-12 text-green-600 dark:text-green-400 mx-auto mb-3 sm:mb-4" />
                <h2 className="text-2xl sm:text-3xl font-bold mb-2 sm:mb-4">Nossa Missão</h2>
                <p className="text-sm sm:text-base md:text-lg text-muted-foreground max-w-4xl mx-auto">
                  Democratizar o acesso a ferramentas avançadas de gestão de pessoas, 
                  permitindo que empresas de todos os tamanhos tenham acesso à tecnologia 
                  de ponta para desenvolver seus colaboradores e maximizar resultados.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
                <div className="text-center">
                  <Brain className="h-6 sm:h-8 w-6 sm:w-8 text-green-600 dark:text-green-400 mx-auto mb-2 sm:mb-3" />
                  <h3 className="font-semibold mb-2 text-sm sm:text-base">Inovação Contínua</h3>
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    Sempre na vanguarda da tecnologia, implementando IA e ML de forma prática
                  </p>
                </div>
                <div className="text-center">
                  <Users className="h-8 w-8 text-green-600 dark:text-green-400 mx-auto mb-3" />
                  <h3 className="font-semibold mb-2">Foco nas Pessoas</h3>
                  <p className="text-sm text-muted-foreground">
                    Entendemos que o sucesso das empresas começa com pessoas engajadas
                  </p>
                </div>
                <div className="text-center">
                  <Target className="h-8 w-8 text-green-600 dark:text-green-400 mx-auto mb-3" />
                  <h3 className="font-semibold mb-2">Resultados Mensuráveis</h3>
                  <p className="text-sm text-muted-foreground">
                    Todas nossas funcionalidades são baseadas em métricas e dados concretos
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Principais Funcionalidades */}
        <div className="mb-12 sm:mb-16">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-6 sm:mb-8">
            Funcionalidades Principais
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index} className="relative hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                        <Icon className="h-5 w-5 text-green-600 dark:text-green-400" />
                      </div>
                      <div className="flex items-center gap-2">
                        <CardTitle className="text-lg">{feature.title}</CardTitle>
                        {feature.isNew && (
                          <Badge className="bg-green-500 text-white text-xs">NOVO</Badge>
                        )}
                        {feature.isPro && (
                          <Badge className="bg-yellow-500 text-white text-xs">PRO</Badge>
                        )}
                      </div>
                    </div>
                    <CardDescription>{feature.description}</CardDescription>
                  </CardHeader>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Nossa Equipe */}
        <div className="mb-12 sm:mb-16">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-6 sm:mb-8">Nossa Equipe</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
            {team.map((member, index) => (
              <Card key={index}>
                <CardHeader>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center">
                      <Building className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{member.name}</CardTitle>
                      <p className="text-sm text-green-600 font-medium">{member.role}</p>
                    </div>
                  </div>
                  <CardDescription>{member.description}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>

        {/* CTA Final */}
        <div className="text-center">
          <Card className="border-green-200 dark:border-green-900/50 bg-gradient-to-br from-green-50 dark:from-green-950/20 to-emerald-50 dark:to-emerald-950/20">
            <CardContent className="p-4 sm:p-6 md:p-8">
              <h2 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4">
                Pronto para Revolucionar seu RH?
              </h2>
              <p className="text-sm sm:text-base md:text-lg text-muted-foreground mb-4 sm:mb-6 max-w-2xl mx-auto">
                Junte-se a centenas de empresas que já transformaram 
                sua gestão de pessoas com a HumanSys.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-2 sm:gap-4">
                <Button className="text-xs sm:text-base px-3 sm:px-4 py-2 sm:py-3" onClick={() => navigate('/plans')}>
                  <Zap className="h-4 w-4 mr-1 sm:mr-2" />
                  Testar Grátis
                </Button>
                <Button variant="outline" className="text-xs sm:text-base px-3 sm:px-4 py-2 sm:py-3" onClick={() => navigate('/contact')}>
                  Falar com Consultor
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Footer */}
      <footer className="w-full border-t py-12 sm:py-16 relative overflow-hidden">
        <MouseTrail colors={['#10b981', '#06b6d4', '#8b5cf6', '#f59e0b', '#ec4899', '#3b82f6', '#22c55e', '#f97316']} particleCount={4} particleLife={80} />
        <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 relative z-20">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
            <div>
              <h3 className="font-semibold mb-3 sm:mb-4 text-sm sm:text-base">Produto</h3>
              <ul className="space-y-2 text-xs sm:text-sm text-muted-foreground">
                <li><button onClick={() => navigate('/app/dashboard')} className="hover:text-primary text-left">Funcionalidades</button></li>
                <li><button onClick={() => navigate('/brainsys')} className="hover:text-primary text-left">BrainSys</button></li>
                <li><button onClick={() => navigate('/plans')} className="hover:text-primary text-left">Preços</button></li>
                <li><button onClick={() => navigate('/changelog')} className="hover:text-primary text-left">Novidades</button></li>
                <li><button onClick={() => navigate('/app/settings')} className="hover:text-primary text-left">Integrações</button></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Empresa</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><button onClick={() => navigate('/about')} className="hover:text-primary text-left">Sobre</button></li>
                <li><button onClick={() => navigate('/careers')} className="hover:text-primary text-left">Carreiras</button></li>
                <li><button onClick={() => navigate('/blog')} className="hover:text-primary text-left">Blog</button></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Suporte</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><button onClick={() => navigate('/documentation')} className="hover:text-primary text-left">Documentação</button></li>
                <li><button onClick={() => navigate('/help')} className="hover:text-primary text-left">Ajuda</button></li>
                <li><button onClick={() => navigate('/contact')} className="hover:text-primary text-left">Contato</button></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Legal</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><button onClick={() => navigate('/privacy')} className="hover:text-primary text-left">Política de Privacidade</button></li>
                <li><button onClick={() => navigate('/termsofservices')} className="hover:text-primary text-left">Termos de Uso</button></li>
              </ul>
            </div>
          </div>

          <div className="border-t mt-8 pt-8 relative">
            <div className="absolute left-0 top-1/2 transform -translate-y-1/2 hidden md:block">
              <img src="/seloontotech.png" alt="Seloontotech Logo" className="w-32 h-auto opacity-75 hover:opacity-100 transition-opacity" />
            </div>
            <div className="text-center flex flex-col items-center space-y-2">
              <img src={actualTheme === 'dark' ? "/Humansysbranco.png" : "/Humansys.png"} alt="Logotipo da Humansys" className="w-40 h-auto mb-2 object-contain" />
              <p className="text-muted-foreground text-sm">&copy; 2024 Humansys. Todos os direitos reservados.</p>
              <p className="text-muted-foreground text-xs">CNPJ: 61.209.173/0001-09</p>
              <div className="flex space-x-4 mt-2">
                {socialLinks.map((social, index) => {
                  const Icon = social.icon;
                  return <a key={index} href={social.href} className="text-muted-foreground hover:text-primary transition-colors" aria-label={social.label}><Icon className="h-5 w-5" /></a>;
                })}
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};