
import React, { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { useTheme } from '@/contexts/ThemeContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { MouseTrail } from '@/components/ui/mouse-trail';
import { 
  Check, 
  Crown, 
  Users, 
  Brain, 
  Shield, 
  Zap,
  TrendingUp,
  Award,
  Sparkles,
  Building,
  Target,
  BarChart3,
  Linkedin,
  Instagram,
  Facebook,
  Github
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const Plans = () => {
  const [isAnnual, setIsAnnual] = useState(false);
  const navigate = useNavigate();
  const { actualTheme } = useTheme();

  const socialLinks = [
    { icon: Linkedin, href: '#', label: 'LinkedIn' },
    { icon: Instagram, href: '#', label: 'Instagram' },
    { icon: Facebook, href: '#', label: 'Facebook' },
    { icon: Github, href: '#', label: 'GitHub' },
  ];

  const plans = [
    {
      name: 'Inicial',
      description: 'Perfeito para startups e pequenas empresas',
      price: isAnnual ? 'R$ 1.270' : 'R$ 127',
      period: isAnnual ? '/ano' : '/mês',
      originalPrice: isAnnual ? 'R$ 1.524' : null,
      credits: 15,
      features: [
        'Dashboard Principal',
        'Gestão de 15 Colaboradores',
        'Módulo de Treinamentos',
        'Reuniões 1:1 Básicas',
        'Metas & PDI Simples',
        'Feedback Estruturado',
        'Suporte por Email',
        'Onboarding Básico'
      ],
      icon: Building,
      color: 'border-blue-200 bg-blue-50',
      buttonStyle: 'default'
    },
    {
      name: 'Em Crescimento',
      description: 'Para empresas em expansão',
      price: isAnnual ? 'R$ 3.170' : 'R$ 317',
      period: isAnnual ? '/ano' : '/mês',
      originalPrice: isAnnual ? 'R$ 3.804' : null,
      credits: 75,
      features: [
        'Tudo do Plano Inicial',
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
      icon: TrendingUp,
      color: 'border-green-200 bg-green-50',
      buttonStyle: 'default',
      popular: true
    },
    {
      name: 'Profissional',
      description: 'Para grandes empresas e corporações',
      price: isAnnual ? 'R$ 5.970' : 'R$ 597',
      period: isAnnual ? '/ano' : '/mês',
      originalPrice: isAnnual ? 'R$ 7.164' : null,
      credits: 500,
      features: [
        'Tudo do Plano Em Crescimento',
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
      icon: Crown,
      color: 'border-yellow-200 bg-yellow-50',
      buttonStyle: 'premium'
    }
  ];

  const enterprise = {
    name: 'Enterprise',
    description: 'Soluções customizadas para grandes corporações',
    features: [
      'Colaboradores Ilimitados',
      'Customização Completa',
      'Deployment On-Premise',
      'SLA Garantido',
      'Treinamento da Equipe',
      'Suporte Técnico Dedicado',
      'Integração com Sistemas Legados',
      'Compliance e Auditoria',
      'Multi-tenancy',
      'Relatórios Executivos'
    ]
  };

  const allFeatures = [
    {
      category: 'Core & Gestão',
      items: [
        { name: 'Dashboard Principal', inicial: true, crescimento: true, profissional: true },
        { name: 'Gestão de Colaboradores', inicial: '15', crescimento: '75', profissional: '500' },
        { name: 'Founder Dashboard', inicial: false, crescimento: false, profissional: true },
        { name: 'Brainsys IAO V.1', inicial: false, crescimento: 'Básico', profissional: 'Completo' }
      ]
    },
    {
      category: 'IA & Analytics',
      items: [
        { name: 'Análise DISC com IA', inicial: false, crescimento: true, profissional: true },
        { name: 'Analytics Preditivos', inicial: false, crescimento: 'Básico', profissional: 'Avançado' },
        { name: 'Machine Learning', inicial: false, crescimento: false, profissional: true },
        { name: 'Insights Inteligentes', inicial: false, crescimento: true, profissional: true }
      ]
    },
    {
      category: 'Desenvolvimento',
      items: [
        { name: 'Treinamentos', inicial: 'Básico', crescimento: 'Avançado', profissional: 'Completo' },
        { name: 'Reuniões 1:1', inicial: 'Básico', crescimento: 'Avançado', profissional: 'IA Assisted' },
        { name: 'Metas & PDI', inicial: 'Simples', crescimento: 'Avançado', profissional: 'IA Powered' },
        { name: 'Certificados', inicial: false, crescimento: true, profissional: true }
      ]
    },
    {
      category: 'Engajamento',
      items: [
        { name: 'Feedback 360°', inicial: 'Básico', crescimento: 'Completo', profissional: 'IA Enhanced' },
        { name: 'Pesquisas', inicial: false, crescimento: true, profissional: true },
        { name: 'Gamificação', inicial: false, crescimento: true, profissional: true },
        { name: 'Onboarding', inicial: 'Básico', crescimento: 'Avançado', profissional: 'Personalizado' }
      ]
    },
    {
      category: 'Segurança & Suporte',
      items: [
        { name: 'Security Management', inicial: false, crescimento: false, profissional: true },
        { name: 'Suporte', inicial: 'Email', crescimento: 'Prioritário', profissional: '24/7 Dedicado' },
        { name: 'API Access', inicial: false, crescimento: 'Limitado', profissional: 'Completo' },
        { name: 'Integrações', inicial: 'Básicas', crescimento: 'Avançadas', profissional: 'Ilimitadas' }
      ]
    }
  ];

  const renderFeatureValue = (value: any) => {
    if (value === true) return <Check className="h-4 w-4 text-green-600" />;
    if (value === false) return <span className="text-muted-foreground">-</span>;
    return <span className="text-sm font-medium">{value}</span>;
  };

  return (
    <div className="min-h-screen bg-background">
      <Header showAuth />
      
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-6 sm:py-8 md:py-12 lg:py-16">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12 md:mb-16">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-6xl font-bold tracking-tight mb-4 sm:mb-6">
            Planos e <span className="text-green-600">Preços</span>
          </h1>
          <p className="text-sm sm:text-base md:text-lg lg:text-xl text-muted-foreground max-w-3xl mx-auto mb-6 sm:mb-8">
            Escolha o plano ideal para sua empresa. Todas as funcionalidades, 
            sem pegadinhas, com suporte especializado.
          </p>
          
          {/* Toggle Anual/Mensal */}
          <div className="flex items-center justify-center gap-4 mb-8">
            <Label htmlFor="billing-toggle" className={!isAnnual ? 'font-semibold' : ''}>
              Mensal
            </Label>
            <Switch
              id="billing-toggle"
              checked={isAnnual}
              onCheckedChange={setIsAnnual}
            />
            <Label htmlFor="billing-toggle" className={isAnnual ? 'font-semibold' : ''}>
              Anual
            </Label>
            {isAnnual && (
              <Badge className="bg-green-500 text-white">
                Economize 17%
              </Badge>
            )}
          </div>
        </div>

        {/* Planos Principais */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8 mb-12 sm:mb-16">
          {plans.map((plan, index) => {
            const Icon = plan.icon;
            return (
              <Card 
                key={index} 
                className={`relative ${plan.color} ${plan.popular ? 'ring-2 ring-green-500 shadow-lg scale-105' : ''}`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-green-500 text-white px-4 py-1">
                      MAIS POPULAR
                    </Badge>
                  </div>
                )}
                
                <CardHeader className="text-center">
                  <div className="w-12 h-12 mx-auto mb-4 bg-white rounded-xl flex items-center justify-center shadow-sm">
                    <Icon className="h-6 w-6 text-green-600" />
                  </div>
                  <CardTitle className="text-2xl">{plan.name}</CardTitle>
                  <CardDescription className="text-base">{plan.description}</CardDescription>
                  
                  <div className="py-4">
                    <div className="flex items-center justify-center gap-2">
                      {plan.originalPrice && (
                        <span className="text-lg text-muted-foreground line-through">
                          {plan.originalPrice}
                        </span>
                      )}
                      <span className="text-4xl font-bold">{plan.price}</span>
                      <span className="text-muted-foreground">{plan.period}</span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-2">
                      {plan.credits} créditos para colaboradores
                    </p>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <ul className="space-y-3 mb-6">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center gap-3">
                        <Check className="h-4 w-4 text-green-600 flex-shrink-0" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <Button 
                    className="w-full" 
                    variant={plan.buttonStyle === 'premium' ? 'default' : 'default'}
                    size="lg"
                    onClick={() => navigate('/checkout')}
                  >
                    {plan.buttonStyle === 'premium' && <Crown className="h-4 w-4 mr-2" />}
                    Começar Agora
                  </Button>
                  
                  <p className="text-xs text-center text-muted-foreground mt-3">
                    30 dias grátis • Cancele quando quiser
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Enterprise */}
        <Card className="border-purple-200 bg-gradient-to-br from-purple-50 to-indigo-50 mb-12 sm:mb-16">
          <CardContent className="p-4 sm:p-6 md:p-8">
            <div className="text-center mb-6 sm:mb-8">
              <div className="w-12 sm:w-16 h-12 sm:h-16 mx-auto mb-3 sm:mb-4 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl flex items-center justify-center">
                <Building className="h-6 sm:h-8 w-6 sm:w-8 text-white" />
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold mb-1 sm:mb-2">{enterprise.name}</h3>
              <p className="text-sm sm:text-base md:text-lg text-muted-foreground mb-4 sm:mb-6">{enterprise.description}</p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
              {enterprise.features.map((feature, index) => (
                <div key={index} className="flex items-center gap-3">
                  <Check className="h-4 w-4 text-purple-600 flex-shrink-0" />
                  <span className="text-sm">{feature}</span>
                </div>
              ))}
            </div>
            
            <div className="text-center">
              <Button size="lg" variant="outline" onClick={() => navigate('/contact')}>
                <Building className="h-4 w-4 mr-2" />
                Falar com Especialista
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Comparação Detalhada */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">
            Comparação Detalhada de Funcionalidades
          </h2>
          
          <div className="overflow-x-auto">
            <div className="min-w-[800px]">
              {allFeatures.map((category, categoryIndex) => (
                <Card key={categoryIndex} className="mb-6">
                  <CardHeader>
                    <CardTitle className="text-lg">{category.category}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid grid-cols-4 gap-4 text-sm font-medium text-muted-foreground border-b pb-2">
                        <div>Funcionalidade</div>
                        <div className="text-center">Inicial</div>
                        <div className="text-center">Em Crescimento</div>
                        <div className="text-center">Profissional</div>
                      </div>
                      
                      {category.items.map((item, itemIndex) => (
                        <div key={itemIndex} className="grid grid-cols-4 gap-4 text-sm items-center py-2">
                          <div className="font-medium">{item.name}</div>
                          <div className="text-center">{renderFeatureValue(item.inicial)}</div>
                          <div className="text-center">{renderFeatureValue(item.crescimento)}</div>
                          <div className="text-center">{renderFeatureValue(item.profissional)}</div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>

        {/* FAQ Rápido */}
        <div className="mb-12 sm:mb-16">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-6 sm:mb-8">Perguntas Frequentes</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 md:gap-8">
            <div>
              <h3 className="font-semibold mb-2 text-sm sm:text-base">Como funcionam os créditos?</h3>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Cada usuário cadastrado consome 1 crédito. Os créditos são renovados mensalmente 
                e não acumulam entre períodos.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Posso mudar de plano a qualquer momento?</h3>
              <p className="text-sm text-muted-foreground">
                Sim! Você pode fazer upgrade ou downgrade do seu plano a qualquer momento. 
                As mudanças são aplicadas no próximo ciclo de cobrança.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Tem teste grátis?</h3>
              <p className="text-sm text-muted-foreground">
                Todos os planos incluem 30 dias de teste grátis com acesso completo às 
                funcionalidades do plano escolhido.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Como funciona o suporte?</h3>
              <p className="text-sm text-muted-foreground">
                Oferecemos suporte por email no plano Inicial, prioritário no Em Crescimento 
                e dedicado 24/7 no Profissional.
              </p>
            </div>
          </div>
        </div>

        {/* CTA Final */}
        <div className="text-center">
          <Card className="border-green-200 bg-gradient-to-br from-green-50 to-emerald-50">
            <CardContent className="p-4 sm:p-6 md:p-8">
              <h2 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4">
                Comece sua Transformação Hoje
              </h2>
              <p className="text-sm sm:text-base md:text-lg text-muted-foreground mb-4 sm:mb-6 max-w-2xl mx-auto">
                Junte-se a centenas de empresas que já revolucionaram 
                sua gestão de pessoas com a HumanSys.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-2 sm:gap-4">
                <Button className="text-xs sm:text-base px-3 sm:px-4 py-2 sm:py-3" onClick={() => navigate('/checkout')}>
                  <Zap className="h-4 w-4 mr-1 sm:mr-2" />
                  Testar 30 Dias Grátis
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
