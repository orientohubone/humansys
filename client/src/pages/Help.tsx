import React, { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { useTheme } from '@/contexts/ThemeContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MouseTrail } from '@/components/ui/mouse-trail';
import { 
  Search, 
  HelpCircle, 
  BookOpen, 
  Video, 
  MessageSquare,
  Brain,
  Users,
  Target,
  Award,
  Crown,
  Shield,
  TrendingUp,
  Settings,
  Zap,
  FileText,
  Lightbulb,
  HeadphonesIcon,
  ExternalLink,
  Linkedin,
  Instagram,
  Facebook,
  Github
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const Help = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  const { actualTheme } = useTheme();

  const socialLinks = [
    { icon: Linkedin, href: '#', label: 'LinkedIn' },
    { icon: Instagram, href: '#', label: 'Instagram' },
    { icon: Facebook, href: '#', label: 'Facebook' },
    { icon: Github, href: '#', label: 'GitHub' },
  ];

  const quickLinks = [
    {
      icon: Brain,
      title: 'Como usar a Análise DISC com IA',
      description: 'Guia completo para aplicar e interpretar avaliações DISC',
      category: 'IA & Analytics',
      isNew: true,
      path: '/app/disc'
    },
    {
      icon: Crown,
      title: 'Founder Dashboard',
      description: 'Métricas SaaS e insights para tomada de decisão',
      category: 'Founder',
      isPro: true,
      path: '/founder/dashboard'
    },
    {
      icon: Users,
      title: 'Gerenciamento de Usuários',
      description: 'Como cadastrar e gerenciar permissões de colaboradores',
      category: 'Gestão',
      path: '/app/settings'
    },
    {
      icon: Target,
      title: 'Configurar Metas & PDI',
      description: 'Definir objetivos e planos de desenvolvimento',
      category: 'Desenvolvimento',
      path: '/app/goals'
    },
    {
      icon: Award,
      title: 'Sistema de Gamificação',
      description: 'Badges, rankings e conquistas para engajamento',
      category: 'Engajamento',
      isNew: true,
      path: '/app/dashboard'
    },
    {
      icon: Shield,
      title: 'Segurança e Proteção',
      description: 'Configurações de segurança e proteção de dados',
      category: 'Segurança',
      path: '/app/security-management'
    }
  ];

  const categories = [
    {
      id: 'getting-started',
      title: 'Primeiros Passos',
      icon: Zap,
      description: 'Configure sua conta e comece a usar',
      articles: [
        { title: 'Configuração inicial da conta', time: '5 min', isNew: false, isPro: false },
        { title: 'Cadastrando seus primeiros colaboradores', time: '8 min', isNew: false, isPro: false },
        { title: 'Configurando permissões de usuário', time: '6 min', isNew: false, isPro: false },
        { title: 'Integrando com sistemas existentes', time: '12 min', isNew: false, isPro: false }
      ]
    },
    {
      id: 'ia-analytics',
      title: 'IA & Analytics',
      icon: Brain,
      description: 'Inteligência artificial e análises avançadas',
      articles: [
        { title: 'Brainsys IAO V.1: Guia completo', time: '15 min', isNew: true, isPro: false },
        { title: 'Análise DISC com IA: Como aplicar', time: '10 min', isNew: true, isPro: false },
        { title: 'Interpretando relatórios de IA', time: '8 min', isNew: false, isPro: false },
        { title: 'Analytics preditivos: Configuração', time: '12 min', isNew: false, isPro: false }
      ]
    },
    {
      id: 'people-management',
      title: 'Gestão de Pessoas',
      icon: Users,
      description: 'Colaboradores, recrutamento e desenvolvimento',
      articles: [
        { title: 'Gestão completa de colaboradores', time: '10 min', isNew: false, isPro: false },
        { title: 'Processo de recrutamento inteligente', time: '12 min', isNew: false, isPro: false },
        { title: 'Onboarding estruturado', time: '8 min', isNew: false, isPro: false },
        { title: 'Feedback 360° e avaliações', time: '15 min', isNew: false, isPro: false }
      ]
    },
    {
      id: 'development',
      title: 'Desenvolvimento',
      icon: Target,
      description: 'Treinamentos, metas e crescimento',
      articles: [
        { title: 'Criando treinamentos eficazes', time: '12 min', isNew: false, isPro: false },
        { title: 'Definindo metas SMART', time: '8 min', isNew: false, isPro: false },
        { title: 'PDI: Plano de desenvolvimento', time: '10 min', isNew: false, isPro: false },
        { title: 'Trilhas de carreira', time: '15 min', isNew: false, isPro: false }
      ]
    },
    {
      id: 'founder',
      title: 'Founder Suite',
      icon: Crown,
      description: 'Ferramentas exclusivas para founders',
      articles: [
        { title: 'Dashboard Founder: Visão geral', time: '8 min', isNew: false, isPro: true },
        { title: 'Análise de churn e retenção', time: '12 min', isNew: false, isPro: true },
        { title: 'Métricas SaaS essenciais', time: '10 min', isNew: false, isPro: true },
        { title: 'Forecasting inteligente', time: '15 min', isNew: false, isPro: true }
      ]
    },
    {
      id: 'security',
      title: 'Segurança',
      icon: Shield,
      description: 'Proteção e compliance',
      articles: [
        { title: 'Configurações de segurança', time: '8 min', isNew: false, isPro: false },
        { title: 'Proteção contra vazamentos', time: '10 min', isNew: false, isPro: false },
        { title: 'Auditoria e logs', time: '6 min', isNew: false, isPro: false },
        { title: 'Compliance LGPD', time: '12 min', isNew: false, isPro: false }
      ]
    }
  ];

  const supportChannels = [
    {
      icon: MessageSquare,
      title: 'Chat ao Vivo',
      description: 'Suporte imediato com nossa equipe',
      availability: 'Seg-Sex, 8h às 18h',
      action: 'Iniciar Chat'
    },
    {
      icon: Video,
      title: 'Sessão de Onboarding',
      description: 'Agende uma sessão personalizada',
      availability: 'Agendamento flexível',
      action: 'Agendar'
    },
    {
      icon: HeadphonesIcon,
      title: 'Suporte por Email',
      description: 'Envie sua dúvida detalhada',
      availability: 'Resposta em 2h úteis',
      action: 'Enviar Email'
    },
    {
      icon: BookOpen,
      title: 'Base de Conhecimento',
      description: 'Documentação completa',
      availability: 'Disponível 24/7',
      action: 'Acessar Docs'
    }
  ];

  const filteredQuickLinks = quickLinks.filter(link =>
    link.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    link.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      <Header showAuth />

      <div className="container py-20">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold tracking-tight md:text-6xl mb-6">
            Central de <span className="text-green-600">Ajuda</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Encontre respostas, tutoriais e suporte especializado para 
            aproveitar ao máximo a HumanSys.
          </p>

          {/* Busca */}
          <div className="max-w-2xl mx-auto relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Buscar ajuda, tutoriais, dúvidas..."
              className="pl-12 pr-4 py-3 text-lg"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Links Rápidos */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Acesso Rápido</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredQuickLinks.map((link, index) => {
              const Icon = link.icon;
              return (
                <Card key={index} className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => navigate(link.path)}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                        <Icon className="h-5 w-5 text-green-600 dark:text-green-400" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <CardTitle className="text-base">{link.title}</CardTitle>
                          {link.isNew && (
                            <Badge className="bg-green-500 text-white text-xs">NOVO</Badge>
                          )}
                          {link.isPro && (
                            <Badge className="bg-yellow-500 text-white text-xs">PRO</Badge>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground">{link.category}</p>
                      </div>
                      <ExternalLink className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <CardDescription className="text-sm">{link.description}</CardDescription>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Conteúdo Principal */}
        <Tabs defaultValue="articles" className="space-y-8">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="articles" className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              Artigos
            </TabsTrigger>
            <TabsTrigger value="videos" className="flex items-center gap-2">
              <Video className="h-4 w-4" />
              Vídeos
            </TabsTrigger>
            <TabsTrigger value="support" className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              Suporte
            </TabsTrigger>
            <TabsTrigger value="faq" className="flex items-center gap-2">
              <HelpCircle className="h-4 w-4" />
              FAQ
            </TabsTrigger>
          </TabsList>

          {/* Artigos */}
          <TabsContent value="articles">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {categories.map((category, index) => {
                const Icon = category.icon;
                return (
                  <Card key={index} className="hover:shadow-md transition-shadow">
                    <CardHeader>
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                          <Icon className="h-5 w-5 text-green-600 dark:text-green-400" />
                        </div>
                        <CardTitle className="text-lg">{category.title}</CardTitle>
                      </div>
                      <CardDescription>{category.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {category.articles.map((article, articleIndex) => (
                          <div key={articleIndex} className="flex items-center justify-between p-2 hover:bg-muted/50 rounded-lg cursor-pointer">
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <p className="text-sm font-medium">{article.title}</p>
                                {article.isNew && (
                                  <Badge className="bg-green-500 text-white text-xs">NOVO</Badge>
                                )}
                                {article.isPro && (
                                  <Badge className="bg-yellow-500 text-white text-xs">PRO</Badge>
                                )}
                              </div>
                              <p className="text-xs text-muted-foreground">{article.time} de leitura</p>
                            </div>
                            <ExternalLink className="h-3 w-3 text-muted-foreground" />
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          {/* Vídeos */}
          <TabsContent value="videos">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="hover:shadow-md transition-shadow">
                <div className="aspect-video bg-gradient-to-br from-green-100 dark:from-green-900/30 to-emerald-100 dark:to-emerald-900/30 rounded-t-lg flex items-center justify-center">
                  <Video className="h-12 w-12 text-green-600 dark:text-green-400" />
                </div>
                <CardHeader>
                  <CardTitle className="text-lg">Introdução à HumanSys</CardTitle>
                  <CardDescription>Visão geral da plataforma e principais funcionalidades</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">12 min</span>
                    <Button variant="outline" size="sm">Assistir</Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="hover:shadow-md transition-shadow">
                <div className="aspect-video bg-gradient-to-br from-purple-100 dark:from-purple-900/30 to-indigo-100 dark:to-indigo-900/30 rounded-t-lg flex items-center justify-center">
                  <Brain className="h-12 w-12 text-purple-600 dark:text-purple-400" />
                </div>
                <CardHeader>
                  <CardTitle className="text-lg">Brainsys IAO V.1 em Ação</CardTitle>
                  <CardDescription>Como usar nossa IA para análises comportamentais</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">15 min</span>
                      <Badge className="bg-purple-500 text-white text-xs">NOVO</Badge>
                    </div>
                    <Button variant="outline" size="sm">Assistir</Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="hover:shadow-md transition-shadow">
                <div className="aspect-video bg-gradient-to-br from-yellow-100 dark:from-yellow-900/30 to-orange-100 dark:to-orange-900/30 rounded-t-lg flex items-center justify-center">
                  <Crown className="h-12 w-12 text-yellow-600 dark:text-yellow-400" />
                </div>
                <CardHeader>
                  <CardTitle className="text-lg">Founder Dashboard</CardTitle>
                  <CardDescription>Métricas SaaS e insights estratégicos para founders</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">18 min</span>
                      <Badge className="bg-yellow-500 text-white text-xs">PRO</Badge>
                    </div>
                    <Button variant="outline" size="sm">Assistir</Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Suporte */}
          <TabsContent value="support">
            <div className="grid md:grid-cols-2 gap-6">
              {supportChannels.map((channel, index) => {
                const Icon = channel.icon;
                return (
                  <Card key={index} className="hover:shadow-md transition-shadow">
                    <CardHeader>
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                          <Icon className="h-6 w-6 text-green-600 dark:text-green-400" />
                        </div>
                        <div>
                          <CardTitle className="text-lg">{channel.title}</CardTitle>
                          <p className="text-sm text-green-600 dark:text-green-400">{channel.availability}</p>
                        </div>
                      </div>
                      <CardDescription>{channel.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Button className="w-full">{channel.action}</Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          {/* FAQ */}
          <TabsContent value="faq">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Perguntas Frequentes</CardTitle>
                  <CardDescription>Respostas para as dúvidas mais comuns</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h4 className="font-semibold mb-2">Como funciona o sistema de créditos?</h4>
                    <p className="text-sm text-muted-foreground">
                      Cada usuário cadastrado na plataforma consome 1 crédito. Os créditos são renovados mensalmente 
                      conforme seu plano e não acumulam entre períodos. Durante o teste grátis, você tem acesso 
                      a créditos ilimitados por 14 dias.
                    </p>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">A análise DISC com IA é confiável?</h4>
                    <p className="text-sm text-muted-foreground">
                      Nossa IA foi treinada com milhares de perfis DISC validados por psicólogos organizacionais. 
                      A precisão é superior a 94% e os relatórios são revisados por especialistas em comportamento humano.
                    </p>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">Posso integrar com meu sistema atual de RH?</h4>
                    <p className="text-sm text-muted-foreground">
                      Sim! Oferecemos APIs robustas e integrações nativas com os principais sistemas de RH do mercado. 
                      Nossa equipe técnica pode ajudar na implementação personalizada.
                    </p>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">Como funciona a gamificação?</h4>
                    <p className="text-sm text-muted-foreground">
                      O sistema de gamificação inclui badges, rankings, conquistas e pontuação em tempo real. 
                      Cada ação na plataforma gera pontos, incentivando o engajamento e criando competições saudáveis.
                    </p>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">Meus dados estão seguros?</h4>
                    <p className="text-sm text-muted-foreground">
                      Sim! Utilizamos criptografia de ponta, proteção contra vazamentos, watermarks em documentos 
                      e estamos em conformidade com a LGPD. Seus dados são protegidos com os mais altos padrões de segurança.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* CTA Final */}
        <div className="text-center mt-16">
          <Card className="border-green-200 dark:border-green-900/50 bg-gradient-to-br from-green-50 dark:from-green-950/20 to-emerald-50 dark:to-emerald-950/20">
            <CardContent className="p-8">
              <Lightbulb className="h-12 w-12 text-green-600 dark:text-green-400 mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-4">
                Ainda tem dúvidas?
              </h2>
              <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                Nossa equipe de especialistas está sempre pronta para ajudar. 
                Entre em contato conosco para suporte personalizado.
              </p>
              <div className="flex justify-center gap-4">
                <Button onClick={() => navigate('/contact')}>
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Falar com Suporte
                </Button>
                <Button variant="outline" onClick={() => navigate('/app/documentation')}>
                  <BookOpen className="h-4 w-4 mr-2" />
                  Ver Documentação
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