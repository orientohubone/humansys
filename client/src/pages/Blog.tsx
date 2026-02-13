
import React, { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { useTheme } from '@/contexts/ThemeContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, User, ArrowRight, Brain, Trophy, TrendingUp } from 'lucide-react';
import { Linkedin, Instagram, Facebook, Github } from 'lucide-react';
import { MouseTrail } from "@/components/ui/mouse-trail";
import { useLocation } from 'wouter';

export const Blog = () => {
  const [, navigate] = useLocation();
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const { actualTheme } = useTheme();

  const socialLinks = [
    { icon: Linkedin, href: '#', label: 'LinkedIn' },
    { icon: Instagram, href: '#', label: 'Instagram' },
    { icon: Facebook, href: '#', label: 'Facebook' },
    { icon: Github, href: '#', label: 'GitHub' }
  ];

  const posts = [
    {
      title: "Como a IA está Revolucionando o RH em 2024",
      excerpt: "Descubra como a Inteligência Artificial pode prever turnover e otimizar a gestão de talentos na sua empresa.",
      author: "Ana Silva",
      date: "2024-12-01",
      readTime: "5 min",
      category: "Inteligência Artificial",
      icon: Brain,
      featured: true
    },
    {
      title: "Gamificação no RH: Engajando Colaboradores",
      excerpt: "Estratégias práticas para implementar gamificação e aumentar o engajamento da sua equipe em até 45%.",
      author: "Carlos Santos",
      date: "2024-11-28",
      readTime: "7 min",
      category: "Gamificação",
      icon: Trophy,
      featured: true
    },
    {
      title: "Onboarding Digital: Melhores Práticas",
      excerpt: "Como reduzir o tempo de integração de novos colaboradores em 70% com processos digitais estruturados.",
      author: "Maria Oliveira",
      date: "2024-11-25",
      readTime: "6 min",
      category: "Onboarding",
      icon: TrendingUp,
      featured: false
    },
    {
      title: "PWA para RH: Gestão Mobile que Funciona",
      excerpt: "Por que Progressive Web Apps são o futuro da gestão de RH e como implementar na sua empresa.",
      author: "João Costa",
      date: "2024-11-22",
      readTime: "4 min",
      category: "Tecnologia",
      icon: Brain,
      featured: false
    },
    {
      title: "Analytics Preditivas: Prevenindo Turnover",
      excerpt: "Como usar dados e machine learning para identificar colaboradores em risco de saída.",
      author: "Ana Silva",
      date: "2024-11-20",
      readTime: "8 min",
      category: "Analytics",
      icon: TrendingUp,
      featured: false
    },
    {
      title: "Feedback 360°: Transformando Comunicação",
      excerpt: "Implementando um sistema de feedback eficaz que melhora o clima organizacional.",
      author: "Pedro Almeida",
      date: "2024-11-18",
      readTime: "5 min",
      category: "Feedback",
      icon: Trophy,
      featured: false
    }
  ];

  const categories = ["Todos", "Inteligência Artificial", "Gamificação", "Onboarding", "Tecnologia", "Analytics", "Feedback"];

  return (
    <div className="min-h-screen bg-background">
      <Header showAuth />
      
      <div className="container py-20">
        <div className="mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold tracking-tight md:text-5xl mb-4">
              Blog HumanSys
            </h1>
            <p className="text-xl text-muted-foreground">
              Insights, tendências e melhores práticas em gestão de pessoas
            </p>
          </div>

          {/* Filtros por Categoria */}
          <div className="flex flex-wrap justify-center gap-2 mb-12">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                className="mb-2"
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </Button>
            ))}
          </div>

          {/* Posts em Destaque */}
          <div className="mb-16">
            <h2 className="text-2xl font-bold mb-8">Em Destaque</h2>
            <div className="grid gap-8 md:grid-cols-2">
              {posts.filter(post => post.featured && (selectedCategory === "Todos" || post.category === selectedCategory)).map((post, index) => (
                <Card key={index} className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
                  <div className="aspect-video bg-gradient-to-br from-primary/10 to-primary/20 flex items-center justify-center">
                    <post.icon className="h-16 w-16 text-primary" />
                  </div>
                  <CardHeader>
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant="secondary">{post.category}</Badge>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4 mr-1" />
                        {new Date(post.date).toLocaleDateString('pt-BR')}
                      </div>
                    </div>
                    <CardTitle className="text-xl hover:text-primary transition-colors">
                      {post.title}
                    </CardTitle>
                    <CardDescription className="text-base">
                      {post.excerpt}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                        <User className="h-4 w-4" />
                        <span>{post.author}</span>
                        <span>•</span>
                        <span>{post.readTime} de leitura</span>
                      </div>
                      <Button variant="ghost" size="sm">
                        Ler mais
                        <ArrowRight className="h-4 w-4 ml-1" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Todos os Posts */}
          <div>
            <h2 className="text-2xl font-bold mb-8">Todos os Artigos</h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {posts.filter(post => !post.featured && (selectedCategory === "Todos" || post.category === selectedCategory)).map((post, index) => (
                <Card key={index} className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardHeader>
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant="outline" className="text-xs">{post.category}</Badge>
                      <div className="flex items-center text-xs text-muted-foreground">
                        <Calendar className="h-3 w-3 mr-1" />
                        {new Date(post.date).toLocaleDateString('pt-BR')}
                      </div>
                    </div>
                    <CardTitle className="text-lg hover:text-primary transition-colors line-clamp-2">
                      {post.title}
                    </CardTitle>
                    <CardDescription className="text-sm line-clamp-3">
                      {post.excerpt}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                        <User className="h-3 w-3" />
                        <span>{post.author}</span>
                        <span>•</span>
                        <span>{post.readTime}</span>
                      </div>
                      <Button variant="ghost" size="sm">
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Newsletter Signup */}
          <div className="mt-16 text-center">
            <Card className="bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
              <CardContent className="pt-8">
                <h3 className="text-2xl font-bold mb-4">
                  Receba Insights Exclusivos
                </h3>
                <p className="text-muted-foreground mb-6">
                  Assine nossa newsletter e receba as últimas tendências em RH, 
                  IA e gestão de pessoas diretamente no seu email.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
                  <input
                    type="email"
                    placeholder="Seu melhor email"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  />
                  <Button>
                    Assinar Newsletter
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
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
