
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FeatureCard } from '@/components/landing/FeatureCard';
import { DynamicBadge } from '@/components/landing/DynamicBadge';
import { 
  Users, MessageSquare, Target, BookOpen, Award, FileText, BarChart3, 
  Zap, Shield, Linkedin, Instagram, Facebook, Github, Smartphone, 
  TrendingUp, Video
} from 'lucide-react';

export const Landing = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);

  const videos = [
    {
      id: 'overview',
      title: 'Visão Geral da Plataforma',
      thumbnail: '/placeholder.svg',
      duration: '2:30'
    },
    {
      id: 'onboarding',
      title: 'Sistema de Onboarding',
      thumbnail: '/placeholder.svg', 
      duration: '3:15'
    },
    {
      id: 'training',
      title: 'Gestão de Treinamentos',
      thumbnail: '/placeholder.svg',
      duration: '2:45'
    }
  ];

  const features = [
    {
      icon: Users,
      title: 'Gestão de Colaboradores',
      description: 'Gerencie equipes com facilidade e acompanhe o desenvolvimento de cada colaborador',
      path: '/collaborators'
    },
    {
      icon: Target,
      title: 'Definição de Metas',
      description: 'Estabeleça objetivos claros e acompanhe o progresso em tempo real',
      path: '/goals'
    },
    {
      icon: BarChart3,
      title: 'Análises Avançadas',
      description: 'Relatórios detalhados e insights para tomada de decisões estratégicas',
      path: '/analytics'
    },
    {
      icon: BookOpen,
      title: 'Biblioteca de Recursos',
      description: 'Acesso a materiais de treinamento e desenvolvimento profissional',
      path: '/training'
    },
    {
      icon: MessageSquare,
      title: 'Comunicação Integrada',
      description: 'Ferramentas de feedback e comunicação para melhor colaboração',
      path: '/feedback'
    },
    {
      icon: Award,
      title: 'Sistema de Reconhecimento',
      description: 'Gamificação e badges para motivar e engajar sua equipe',
      path: '/certificates'
    },
    {
      icon: Shield,
      title: 'Segurança Avançada',
      description: 'Proteção de dados com criptografia e controles de acesso',
      path: '/security'
    },
    {
      icon: Zap,
      title: 'Automação Inteligente',
      description: 'Fluxos automatizados para otimizar processos de RH',
      path: '/automation'
    },
    {
      icon: TrendingUp,
      title: 'Crescimento Acelerado',
      description: 'Ferramentas para impulsionar o desenvolvimento organizacional',
      path: '/growth'
    },
    {
      icon: Smartphone,
      title: 'Acesso Mobile',
      description: 'Plataforma responsiva para acesso em qualquer dispositivo',
      path: '/mobile'
    },
    {
      icon: FileText,
      title: 'Documentação Completa',
      description: 'Manuais e guias para maximizar o uso da plataforma',
      path: '/documentation'
    },
    {
      icon: Video,
      title: 'Treinamentos em Vídeo',
      description: 'Conteúdo audiovisual para capacitação contínua',
      path: '/video-training'
    }
  ];

  const handleGetStarted = () => {
    navigate('/login');
  };

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      console.log('Email submitted:', email);
      // Handle email submission
    }
  };

  const handleFeatureClick = (path: string) => {
    navigate(path);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentVideoIndex((prev) => (prev + 1) % videos.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [videos.length]);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">O</span>
              </div>
              <span className="font-bold text-xl">OrientoHub</span>
            </div>
            <nav className="hidden md:flex items-center space-x-6">
              <Link to="/about" className="text-muted-foreground hover:text-foreground">Sobre</Link>
              <Link to="/plans" className="text-muted-foreground hover:text-foreground">Planos</Link>
              <Link to="/contact" className="text-muted-foreground hover:text-foreground">Contato</Link>
              <Link to="/login">
                <Button variant="outline">Entrar</Button>
              </Link>
              <Button onClick={handleGetStarted}>Começar Agora</Button>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 lg:py-28">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto">
            <DynamicBadge>🚀 Nova versão disponível</DynamicBadge>
            <h1 className="text-4xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
              Transforme sua gestão de pessoas
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              A plataforma completa para onboarding, treinamento e desenvolvimento de colaboradores. 
              Simplifique processos e acelere resultados.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" onClick={handleGetStarted} className="text-lg px-8">
                Começar Gratuitamente
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-8">
                Ver Demonstração
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              Tudo que você precisa em uma plataforma
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Recursos completos para revolucionar a gestão de pessoas na sua empresa
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <FeatureCard
                key={index}
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
                path={feature.path}
                onClick={handleFeatureClick}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Empresas que confiam em nós</h2>
            <p className="text-muted-foreground">
              Mais de 500 empresas já transformaram sua gestão de pessoas
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 opacity-60">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} className="flex items-center justify-center p-6 bg-muted rounded-lg">
                <span className="text-2xl font-bold text-muted-foreground">Logo {i}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">
            Pronto para transformar sua gestão de pessoas?
          </h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Comece gratuitamente e veja os resultados em poucos dias
          </p>
          <form onSubmit={handleEmailSubmit} className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
            <Input
              type="email"
              placeholder="Seu melhor email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-white text-foreground"
              required
            />
            <Button type="submit" variant="secondary" size="lg">
              Começar Agora
            </Button>
          </form>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-muted py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <span className="text-primary-foreground font-bold text-sm">O</span>
                </div>
                <span className="font-bold text-xl">OrientoHub</span>
              </div>
              <p className="text-muted-foreground">
                Transformando a gestão de pessoas através da tecnologia
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Produto</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li><Link to="/features" className="hover:text-foreground">Recursos</Link></li>
                <li><Link to="/plans" className="hover:text-foreground">Planos</Link></li>
                <li><Link to="/security" className="hover:text-foreground">Segurança</Link></li>
                <li><Link to="/integrations" className="hover:text-foreground">Integrações</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Empresa</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li><Link to="/about" className="hover:text-foreground">Sobre nós</Link></li>
                <li><Link to="/careers" className="hover:text-foreground">Carreiras</Link></li>
                <li><Link to="/blog" className="hover:text-foreground">Blog</Link></li>
                <li><Link to="/contact" className="hover:text-foreground">Contato</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Suporte</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li><Link to="/help" className="hover:text-foreground">Central de Ajuda</Link></li>
                <li><Link to="/documentation" className="hover:text-foreground">Documentação</Link></li>
                <li><Link to="/status" className="hover:text-foreground">Status</Link></li>
                <li><Link to="/privacy" className="hover:text-foreground">Privacidade</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-muted-foreground">
              © 2024 OrientoHub. Todos os direitos reservados.
            </p>
            <div className="flex space-x-4 mt-4 md:mt-0">
              <Link to="#" className="text-muted-foreground hover:text-foreground">
                <Facebook className="h-5 w-5" />
              </Link>
              <Link to="#" className="text-muted-foreground hover:text-foreground">
                <Linkedin className="h-5 w-5" />
              </Link>
              <Link to="#" className="text-muted-foreground hover:text-foreground">
                <Instagram className="h-5 w-5" />
              </Link>
              <Link to="#" className="text-muted-foreground hover:text-foreground">
                <Github className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
