import React from 'react';
import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/contexts/ThemeContext';
import SmokeFooterEffect from '@/components/visuals/SmokeFooterEffect';
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
  UserCheck,
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
import { BrainBot } from '@/components/landing/BrainBot';
import FeatureCarousel from '@/components/landing/FeatureCarousel';
import { AnimatedText } from '@/components/ui/animated-text';
import { useNavigate } from 'react-router-dom';
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { Play, ArrowDown } from "lucide-react";
import { ConnectionLines } from "@/components/ui/connection-lines";
import { NeuralBackground } from "@/components/ui/neural-background";
import { MouseTrail } from "@/components/ui/mouse-trail";
import { DISCCard } from "@/components/landing/DISCCard";
import { CheckSquare } from 'lucide-react';



interface Module {
  id: string
  name: string
  icon: React.ReactNode
  position: { x: number; y: number }
  color: string
}

interface PulseProps {
  delay: number
  targetModule: Module
}

const Pulse: React.FC<PulseProps> = ({ delay, targetModule }) => {
  return (
    <>
      {/* Main pulse dot */}
      <motion.div
        className="absolute w-3 h-3 rounded-full"
        style={{ backgroundColor: targetModule.color }}
        initial={{ 
          x: '50%', 
          y: '50%', 
          scale: 0,
          opacity: 0
        }}
        animate={{
          x: targetModule.position.x,
          y: targetModule.position.y,
          scale: [0, 1, 0.8, 0],
          opacity: [0, 1, 0.8, 0]
        }}
        transition={{
          duration: 2.5,
          delay,
          ease: "easeOut"
        }}
      />
      {/* Glow effect */}
      <motion.div
        className="absolute w-6 h-6 rounded-full blur-sm"
        style={{ backgroundColor: `${targetModule.color}40` }}
        initial={{ 
          x: '50%', 
          y: '50%', 
          scale: 0,
          opacity: 0
        }}
        animate={{
          x: targetModule.position.x - 6,
          y: targetModule.position.y - 6,
          scale: [0, 1.5, 1, 0],
          opacity: [0, 0.6, 0.4, 0]
        }}
        transition={{
          duration: 2.5,
          delay,
          ease: "easeOut"
        }}
      />
    </>
  )
}

const BrainSysSection: React.FC = () => {
  const [pulseCount, setPulseCount] = React.useState(0)
  const [activePulses, setActivePulses] = React.useState<Array<{ id: number; module: Module; delay: number }>>([])

  const modules: Module[] = [
    {
      id: 'cargos-salarios',
      name: 'Cargos e Salários',
      icon: <Award className="w-6 h-6" />,
      position: { x: 200, y: -150 },
      color: '#3B82F6'
    },
    {
      id: 'brainpeople',
      name: 'BrainPeople',
      icon: <Users className="w-6 h-6" />,
      position: { x: 300, y: -50 },
      color: '#10B981'
    },
    {
      id: 'motiva',
      name: 'Motiva',
      icon: <Target className="w-6 h-6" />,
      position: { x: 250, y: 100 },
      color: '#F59E0B'
    },
    {
      id: 'performance',
      name: 'Performance',
      icon: <TrendingUp className="w-6 h-6" />,
      position: { x: 100, y: 150 },
      color: '#EF4444'
    },
    {
      id: 'recrutamento',
      name: 'Recrutamento',
      icon: <UserCheck className="w-6 h-6" />,
      position: { x: -100, y: 100 },
      color: '#8B5CF6'
    },
    {
      id: 'competencias',
      name: 'Competências',
      icon: <Award className="w-6 h-6" />,
      position: { x: -200, y: -50 },
      color: '#EC4899'
    }
  ]

  React.useEffect(() => {
    const interval = setInterval(() => {
      const randomModule = modules[Math.floor(Math.random() * modules.length)]
      const newPulse = {
        id: Date.now(),
        module: randomModule,
        delay: 0
      }
      
      setActivePulses(prev => [...prev, newPulse])
      setPulseCount(prev => prev + 1)

      setTimeout(() => {
        setActivePulses(prev => prev.filter(pulse => pulse.id !== newPulse.id))
      }, 2500)
    }, 1500)

    return () => clearInterval(interval)
  }, [])

  return (
    <section className="relative min-h-screen bg-background flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-green-50/20 via-emerald-50/20 to-teal-50/20 dark:from-green-950/20 dark:via-emerald-950/20 dark:to-teal-950/20" />
      {/* Subtle dot pattern */}
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_1px_1px,rgba(16,185,129,0.15)_1px,transparent_0)] [background-size:20px_20px]" />
      
      <div className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <motion.div
            className="flex justify-center mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-4 py-2 rounded-full text-sm font-medium shadow-lg">
              Algoritmo Único
            </div>
          </motion.div>
          <motion.h1 
            className="text-2xl sm:text-4xl md:text-6xl font-bold text-foreground mb-4 sm:mb-6 px-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            BrainSys <span className="text-green-600">IAO</span>
          </motion.h1>
          <motion.p 
            className="text-sm sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto px-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Inteligência Artificial Organizacional conectando todos os módulos de gestão de pessoas
          </motion.p>
        </div>

        <div className="relative flex items-center justify-center px-4">
          {/* Central Brain */}
          <div className="relative z-10">
            <motion.div
              className="relative w-24 sm:w-32 h-24 sm:h-32 md:w-40 md:h-40"
              animate={{
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full shadow-2xl" />
              <div className="absolute inset-2 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full" />
              <div className="absolute inset-4 bg-gradient-to-br from-green-300 to-emerald-400 rounded-full" />
              <motion.div
                className="absolute inset-0 flex items-center justify-center"
                animate={{
                  rotate: 360
                }}
                transition={{
                  duration: 20,
                  repeat: Infinity,
                  ease: "linear"
                }}
              >
                <Brain className="w-16 h-16 md:w-20 md:h-20 text-white" />
              </motion.div>
              
              {/* Pulsing glow effect */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-green-400/50 to-emerald-500/50 rounded-full blur-xl"
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [0.5, 0.8, 0.5]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
              {/* Additional pulse rings */}
              <motion.div
                className="absolute inset-0 border-2 border-green-400/30 rounded-full"
                animate={{
                  scale: [1, 2, 1],
                  opacity: [0.7, 0, 0.7]
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
              <motion.div
                className="absolute inset-0 border-2 border-emerald-400/20 rounded-full"
                animate={{
                  scale: [1, 2.5, 1],
                  opacity: [0.5, 0, 0.5]
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 1
                }}
              />
            </motion.div>

            {/* Pulse animations */}
            <AnimatePresence>
              {activePulses.map((pulse) => (
                <Pulse
                  key={pulse.id}
                  delay={pulse.delay}
                  targetModule={pulse.module}
                />
              ))}
            </AnimatePresence>
          </div>

          {/* Module Cards */}
          {modules.map((module, index) => (
            <motion.div
              key={module.id}
              className="absolute"
              style={{
                transform: `translate(${module.position.x}px, ${module.position.y}px)`
              }}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ 
                duration: 0.6, 
                delay: 0.5 + index * 0.1,
                type: "spring",
                stiffness: 100
              }}
            >
              <motion.div
                className="bg-card border border-border rounded-xl p-4 md:p-6 shadow-lg backdrop-blur-sm min-w-[140px] md:min-w-[180px]"
                whileHover={{ 
                  scale: 1.05,
                  boxShadow: `0 20px 40px ${module.color}20`
                }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div 
                  className="w-10 h-10 md:w-12 md:h-12 rounded-lg flex items-center justify-center mb-3 mx-auto"
                  style={{ backgroundColor: `${module.color}20` }}
                >
                  <div style={{ color: module.color }}>
                    {module.icon}
                  </div>
                </div>
                <h3 className="text-xs md:text-sm font-semibold text-foreground text-center">
                  {module.name}
                </h3>
              </motion.div>
            </motion.div>
          ))}

          {/* Connection lines - MindSight style */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 1 }}>
            {modules.map((module, index) => (
              <g key={`connection-${module.id}`}>
                {/* Main connection line */}
                <motion.line
                  x1="50%"
                  y1="50%"
                  x2={`calc(50% + ${module.position.x}px)`}
                  y2={`calc(50% + ${module.position.y}px)`}
                  stroke="url(#gradient)"
                  strokeWidth="1"
                  strokeOpacity="0.4"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ 
                    duration: 1.5, 
                    delay: 1 + index * 0.1,
                    ease: "easeInOut"
                  }}
                />
                {/* Glow effect */}
                <motion.line
                  x1="50%"
                  y1="50%"
                  x2={`calc(50% + ${module.position.x}px)`}
                  y2={`calc(50% + ${module.position.y}px)`}
                  stroke={module.color}
                  strokeWidth="3"
                  strokeOpacity="0.1"
                  filter="blur(2px)"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ 
                    duration: 1.5, 
                    delay: 1 + index * 0.1,
                    ease: "easeInOut"
                  }}
                />
              </g>
            ))}
            {/* Gradient definition */}
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#10b981" stopOpacity="0.8" />
                <stop offset="50%" stopColor="#059669" stopOpacity="0.6" />
                <stop offset="100%" stopColor="#047857" stopOpacity="0.4" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        {/* Stats */}
        <motion.div 
          className="mt-12 sm:mt-16 md:mt-20 text-center px-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.5 }}
        >
          <div className="grid grid-cols-3 gap-3 sm:gap-6 md:gap-8 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="text-xl sm:text-2xl md:text-3xl font-bold text-green-600">{pulseCount}</div>
              <div className="text-xs sm:text-sm text-muted-foreground">Conexões Ativas</div>
            </div>
            <div className="text-center">
              <div className="text-xl sm:text-2xl md:text-3xl font-bold text-emerald-600">6</div>
              <div className="text-xs sm:text-sm text-muted-foreground">Módulos</div>
            </div>
            <div className="text-center">
              <div className="text-xl sm:text-2xl md:text-3xl font-bold text-green-500">∞</div>
              <div className="text-xs sm:text-sm text-muted-foreground">Possibilidades</div>
            </div>
          </div>
          
          <motion.div
            className="mt-8 sm:mt-12 text-center px-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 2 }}
          >
            <div className="text-base sm:text-lg font-semibold text-muted-foreground/80 mb-1 sm:mb-2">
              Ontológico e Simbiótico
            </div>
            <div className="text-xs sm:text-sm text-muted-foreground">
              Solução <span className="font-semibold text-green-600">Ontotech</span>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

const FooterLogo: React.FC = () => {
  const { actualTheme } = useTheme();
  return (
    <img 
      src={actualTheme === 'dark' ? "/Humansysbranco.png" : "/Humansys.png"}
      alt="Logotipo da Humansys" 
      className="w-40 h-auto mb-2 object-contain"
    />
  );
};

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
    debouncedNavigate('/plans');
  };

  return (
    <div className="w-full min-h-screen bg-background">
      <Header showAuth />

      {/* Hero Section */}
      <section className="w-full relative overflow-hidden bg-gradient-to-br from-green-50/70 via-emerald-25/50 to-green-100/60 dark:from-gray-900/90 dark:via-gray-800/50 dark:to-gray-900/70 py-12 sm:py-16 lg:py-20 xl:py-24 pb-0">

        
        <div className="w-full mx-auto px-4 sm:px-6 lg:px-8">
          <div className="w-full text-center">
            <div className="flex justify-center mb-6 sm:mb-8">
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 sm:px-6 sm:py-3 rounded-full text-sm sm:text-base font-medium shadow-lg animate-pulse">
                🚀 Novo: Founder Dashboard com IA Preditiva
              </div>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight leading-tight">
              <AnimatedText
                firstPart="Transforme sua"
                animatedWords={[
                  "Gestão de Pessoas",
                  "Estratégia de RH",
                  "Cultura Organizacional",
                  "Liderança",
                  "Produtividade",
                  "Equipe",
                  "Performance",
                  "Inovação"
                ]}
                lastPart="com Inteligência Artificial"
                className="block"
                interval={2000}
              />
            </h1>
            <p className="mt-6 sm:mt-8 text-base sm:text-lg lg:text-xl text-muted-foreground max-w-4xl mx-auto">
              A Humansys é uma plataforma completa com IA preditiva, gamificação e PWA. 
              Preveja turnover, engaje colaboradores e transforme seu RH.
            </p>
            <div className="mt-8 sm:mt-10 flex flex-col gap-4 sm:flex-row sm:justify-center">
              <Button 
                size="lg" 
                className="text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4 w-full sm:w-auto"
                onClick={() => debouncedNavigate('/checkout')}
              >
                <Zap className="mr-2 h-5 w-5" />
                Teste Grátis 30 Dias
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4 w-full sm:w-auto"
                onClick={() => debouncedNavigate('/changelog')}
              >
                <TrendingUp className="mr-2 h-5 w-5" />
                Ver Novidades
              </Button>
            </div>
          </div>
        </div>
        
        {/* Gradiente de transição suave */}
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-b from-transparent to-green-50/30 dark:to-gray-900/30"></div>
      </section>

      {/* BrainSys IAO Section */}
      <BrainSysSection />

      {/* Interactive Features Carousel Section */}
      <section className="w-full py-12 sm:py-16 lg:py-20 bg-gradient-to-r from-green-25/30 via-white to-emerald-25/30 dark:from-gray-700/30 dark:via-gray-900 dark:to-gray-700/30">
        <FeatureCarousel />
      </section>

      {/* Novidades Section */}
      <section className="w-full py-12 sm:py-16 lg:py-20 bg-gradient-to-r from-green-25/40 via-emerald-25/30 to-green-50/50 dark:from-gray-700/40 dark:via-gray-800/30 dark:to-gray-700/50">
        <div className="w-full mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center mb-12 sm:mb-16 px-4">
            <div className="flex justify-center mb-3 sm:mb-4">
              <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium shadow-lg border border-purple-300 animate-pulse">
                <Sparkles className="mr-1 h-2.5 sm:h-3 w-2.5 sm:w-3 inline" />
                Lançamento Oficial
              </div>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold">
              <Crown className="inline h-6 sm:h-8 w-6 sm:w-8 mr-1 sm:mr-2 text-yellow-500" />
              Novo Founder Dashboard
            </h2>
            <p className="mt-2 sm:mt-4 text-sm sm:text-base md:text-lg text-muted-foreground">
              Tome decisões estratégicas com métricas de negócio em tempo real e IA preditiva
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-8 max-w-6xl mx-auto px-4">
            <Card className="relative overflow-hidden group hover:shadow-xl transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <CardHeader className="text-center p-4 sm:p-6">
                <div className="mx-auto mb-2 sm:mb-4 flex h-12 sm:h-16 w-12 sm:w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30 group-hover:bg-green-200 dark:group-hover:bg-green-900/50 transition-colors">
                  <DollarSign className="h-6 sm:h-8 w-6 sm:w-8 text-green-600 dark:text-green-400" />
                </div>
                <CardTitle className="text-lg sm:text-xl">Métricas SaaS</CardTitle>
              </CardHeader>
              <CardContent className="text-center p-4 sm:p-6">
                <p className="text-sm sm:text-base text-muted-foreground mb-3 sm:mb-4">
                  MRR, ARR, Churn Rate, LTV/CAC, NRR e todas as métricas essenciais para SaaS
                </p>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>MRR Tracking</span>
                    <Check className="h-4 w-4 text-green-600 dark:text-green-400" />
                  </div>
                  <div className="flex justify-between">
                    <span>Churn Analysis</span>
                    <Check className="h-4 w-4 text-green-600 dark:text-green-400" />
                  </div>
                  <div className="flex justify-between">
                    <span>Revenue Forecasting</span>
                    <Check className="h-4 w-4 text-green-600 dark:text-green-400" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="relative overflow-hidden group hover:shadow-xl transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <CardHeader className="text-center p-4 sm:p-6">
                <div className="mx-auto mb-2 sm:mb-4 flex h-12 sm:h-16 w-12 sm:w-16 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-900/30 group-hover:bg-purple-200 dark:group-hover:bg-purple-900/50 transition-colors">
                  <Brain className="h-6 sm:h-8 w-6 sm:w-8 text-purple-600 dark:text-purple-400" />
                </div>
                <CardTitle className="text-lg sm:text-xl">Brainsys IAO V.1</CardTitle>
              </CardHeader>
              <CardContent className="text-center p-4 sm:p-6">
                <p className="text-sm sm:text-base text-muted-foreground mb-3 sm:mb-4">
                  Orquestrador de Inteligência Organizacional com precisão de 94.7%
                </p>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Churn Prediction</span>
                    <Brain className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div className="flex justify-between">
                    <span>Revenue Forecast</span>
                    <Brain className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div className="flex justify-between">
                    <span>ML Analytics</span>
                    <Brain className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div className="flex justify-between">
                    <span>Insights Automáticos</span>
                    <Brain className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="relative overflow-hidden group hover:shadow-xl transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-red-500/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <CardHeader className="text-center p-4 sm:p-6">
                <div className="mx-auto mb-2 sm:mb-4 flex h-12 sm:h-16 w-12 sm:w-16 items-center justify-center rounded-full bg-orange-100 dark:bg-orange-900/30 group-hover:bg-orange-200 dark:group-hover:bg-orange-900/50 transition-colors">
                  <Trophy className="h-6 sm:h-8 w-6 sm:w-8 text-orange-600 dark:text-orange-400" />
                </div>
                <CardTitle className="text-lg sm:text-xl">Gamificação</CardTitle>
              </CardHeader>
              <CardContent className="text-center p-4 sm:p-6">
                <p className="text-sm sm:text-base text-muted-foreground mb-3 sm:mb-4">
                  Sistema de níveis, conquistas e ranking para founders
                </p>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Level System</span>
                    <Trophy className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                  </div>
                  <div className="flex justify-between">
                    <span>Achievements</span>
                    <Trophy className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                  </div>
                  <div className="flex justify-between">
                    <span>Leaderboard</span>
                    <Trophy className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="text-center mt-8 sm:mt-12 px-4">
            <Button 
              size="lg" 
              className="text-sm sm:text-base md:text-lg px-4 sm:px-8 py-3 sm:py-6 w-full sm:w-auto"
              onClick={() => debouncedNavigate('/app/founder/dashboard')}
            >
              <Crown className="mr-2 h-4 sm:h-5 w-4 sm:w-5" />
              Acessar Founder Dashboard
            </Button>
          </div>
        </div>
      </section>

      {/* Análise DISC Section - Premium Design */}
      <section className="w-full py-12 sm:py-16 lg:py-20 bg-gradient-to-r from-indigo-50/50 via-purple-50/30 to-blue-50/50 dark:from-indigo-950/20 dark:via-purple-950/20 dark:to-blue-950/20">
        <div className="w-full mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mx-auto max-w-3xl text-center mb-12 sm:mb-16 px-4">
            <motion.div 
              className="flex justify-center mb-3 sm:mb-4"
              initial={{ opacity: 0, y: -20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <Badge className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium shadow-lg border-0 animate-pulse">
                <Brain className="mr-1 h-2.5 sm:h-3 w-2.5 sm:w-3 inline" />
                Análise Comportamental com IA
              </Badge>
            </motion.div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">
              Análise de Perfil DISC com Brainsys IAO
            </h2>
            <p className="text-sm sm:text-base md:text-lg text-muted-foreground">
              Mapeie perfis comportamentais com 94% de precisão e entenda melhor suas equipes
            </p>
          </div>

          {/* DISC Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 max-w-7xl mx-auto mb-12 px-4">
            {/* Dominante */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0 }}
              viewport={{ once: true }}
            >
              <Card className="relative overflow-hidden group hover:shadow-xl transition-all duration-300 h-full border-0 bg-white dark:bg-slate-950">
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-yellow-400 to-yellow-500"></div>
                <CardHeader className="p-4 sm:p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="p-3 sm:p-4 rounded-xl bg-yellow-100 dark:bg-yellow-900/30 group-hover:bg-yellow-200 dark:group-hover:bg-yellow-900/50 transition-colors">
                      <Target className="h-6 sm:h-7 w-6 sm:w-7 text-yellow-600 dark:text-yellow-400" />
                    </div>
                    <span className="text-xs font-bold text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-900/20 px-2 py-1 rounded">D</span>
                  </div>
                  <CardTitle className="text-lg sm:text-xl mb-2">Dominante</CardTitle>
                  <CardDescription className="text-sm">Líderes decisivos e orientados a resultados</CardDescription>
                </CardHeader>
                <CardContent className="p-4 sm:p-6 pt-0">
                  <ul className="space-y-2 text-xs sm:text-sm">
                    <li className="flex items-center"><CheckCircle className="h-4 w-4 text-yellow-600 dark:text-yellow-400 mr-2 flex-shrink-0" />Foco em metas</li>
                    <li className="flex items-center"><CheckCircle className="h-4 w-4 text-yellow-600 dark:text-yellow-400 mr-2 flex-shrink-0" />Tomada rápida de decisão</li>
                    <li className="flex items-center"><CheckCircle className="h-4 w-4 text-yellow-600 dark:text-yellow-400 mr-2 flex-shrink-0" />Liderança assertiva</li>
                  </ul>
                </CardContent>
              </Card>
            </motion.div>

            {/* Influência */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="relative overflow-hidden group hover:shadow-xl transition-all duration-300 h-full border-0 bg-white dark:bg-slate-950">
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-400 to-red-500"></div>
                <CardHeader className="p-4 sm:p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="p-3 sm:p-4 rounded-xl bg-orange-100 dark:bg-orange-900/30 group-hover:bg-orange-200 dark:group-hover:bg-orange-900/50 transition-colors">
                      <Users className="h-6 sm:h-7 w-6 sm:w-7 text-orange-600 dark:text-orange-400" />
                    </div>
                    <span className="text-xs font-bold text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-900/20 px-2 py-1 rounded">I</span>
                  </div>
                  <CardTitle className="text-lg sm:text-xl mb-2">Influência</CardTitle>
                  <CardDescription className="text-sm">Comunicadores entusiastas e motivadores</CardDescription>
                </CardHeader>
                <CardContent className="p-4 sm:p-6 pt-0">
                  <ul className="space-y-2 text-xs sm:text-sm">
                    <li className="flex items-center"><CheckCircle className="h-4 w-4 text-orange-600 dark:text-orange-400 mr-2 flex-shrink-0" />Engajamento de equipes</li>
                    <li className="flex items-center"><CheckCircle className="h-4 w-4 text-orange-600 dark:text-orange-400 mr-2 flex-shrink-0" />Comunicação fluida</li>
                    <li className="flex items-center"><CheckCircle className="h-4 w-4 text-orange-600 dark:text-orange-400 mr-2 flex-shrink-0" />Networking forte</li>
                  </ul>
                </CardContent>
              </Card>
            </motion.div>

            {/* Estabilidade */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <Card className="relative overflow-hidden group hover:shadow-xl transition-all duration-300 h-full border-0 bg-white dark:bg-slate-950">
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-400 to-indigo-600"></div>
                <CardHeader className="p-4 sm:p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="p-3 sm:p-4 rounded-xl bg-blue-100 dark:bg-blue-900/30 group-hover:bg-blue-200 dark:group-hover:bg-blue-900/50 transition-colors">
                      <Heart className="h-6 sm:h-7 w-6 sm:w-7 text-blue-600 dark:text-blue-400" />
                    </div>
                    <span className="text-xs font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 px-2 py-1 rounded">S</span>
                  </div>
                  <CardTitle className="text-lg sm:text-xl mb-2">Estabilidade</CardTitle>
                  <CardDescription className="text-sm">Profissionais leais e cooperadores</CardDescription>
                </CardHeader>
                <CardContent className="p-4 sm:p-6 pt-0">
                  <ul className="space-y-2 text-xs sm:text-sm">
                    <li className="flex items-center"><CheckCircle className="h-4 w-4 text-blue-600 dark:text-blue-400 mr-2 flex-shrink-0" />Trabalho em equipe</li>
                    <li className="flex items-center"><CheckCircle className="h-4 w-4 text-blue-600 dark:text-blue-400 mr-2 flex-shrink-0" />Consistência confiável</li>
                    <li className="flex items-center"><CheckCircle className="h-4 w-4 text-blue-600 dark:text-blue-400 mr-2 flex-shrink-0" />Apoio e lealdade</li>
                  </ul>
                </CardContent>
              </Card>
            </motion.div>

            {/* Conformidade */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              viewport={{ once: true }}
            >
              <Card className="relative overflow-hidden group hover:shadow-xl transition-all duration-300 h-full border-0 bg-white dark:bg-slate-950">
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-teal-400 to-green-500"></div>
                <CardHeader className="p-4 sm:p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="p-3 sm:p-4 rounded-xl bg-teal-100 dark:bg-teal-900/30 group-hover:bg-teal-200 dark:group-hover:bg-teal-900/50 transition-colors">
                      <CheckSquare className="h-6 sm:h-7 w-6 sm:w-7 text-teal-600 dark:text-teal-400" />
                    </div>
                    <span className="text-xs font-bold text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-900/20 px-2 py-1 rounded">C</span>
                  </div>
                  <CardTitle className="text-lg sm:text-xl mb-2">Conformidade</CardTitle>
                  <CardDescription className="text-sm">Analistas precisos e detalhistas</CardDescription>
                </CardHeader>
                <CardContent className="p-4 sm:p-6 pt-0">
                  <ul className="space-y-2 text-xs sm:text-sm">
                    <li className="flex items-center"><CheckCircle className="h-4 w-4 text-teal-600 dark:text-teal-400 mr-2 flex-shrink-0" />Precisão e qualidade</li>
                    <li className="flex items-center"><CheckCircle className="h-4 w-4 text-teal-600 dark:text-teal-400 mr-2 flex-shrink-0" />Seguimento de padrões</li>
                    <li className="flex items-center"><CheckCircle className="h-4 w-4 text-teal-600 dark:text-teal-400 mr-2 flex-shrink-0" />Atenção ao detalhe</li>
                  </ul>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* CTA Section */}
          <motion.div 
            className="text-center px-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            viewport={{ once: true }}
          >
            <div className="inline-block bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-950/20 dark:to-blue-950/20 rounded-2xl p-6 sm:p-8 border border-purple-200/30 dark:border-purple-800/30">
              <p className="text-sm sm:text-base text-muted-foreground mb-4">
                Comece sua análise DISC agora e descubra insights profundos sobre seus colaboradores
              </p>
              <Button 
                size="lg"
                className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white text-base sm:text-lg px-8 sm:px-10 py-6 sm:py-7 shadow-lg hover:shadow-xl transition-all duration-300"
                onClick={() => debouncedNavigate('/checkout')}
              >
                <Brain className="mr-2 h-5 w-5" />
                Começar Análise DISC Agora
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full py-12 sm:py-16 lg:py-20 bg-primary">
        <div className="w-full mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto text-center text-white">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold">
              Pronto para Revolucionar seu RH?
            </h2>
            <p className="mt-4 text-base sm:text-lg opacity-90">
              Junte-se a centenas de empresas que já transformaram sua gestão de RH com IA
            </p>
            <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:justify-center max-w-md sm:max-w-none mx-auto">
              <Button 
                size="lg" 
                variant="secondary"
                className="text-base sm:text-lg px-6 sm:px-8 py-4 sm:py-6 w-full sm:w-auto whitespace-nowrap"
                onClick={() => debouncedNavigate('/checkout')}
              >
                <Shield className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                Teste Grátis 30 Dias
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                className="text-base sm:text-lg px-6 sm:px-8 py-4 sm:py-6 border-white text-white hover:bg-white hover:text-primary w-full sm:w-auto whitespace-nowrap"
                onClick={() => debouncedNavigate('/checkout')}
              >
                Ver Planos
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full border-t py-12 sm:py-16 relative overflow-hidden">
        <MouseTrail 
          colors={[
            '#10b981', // emerald-500
            '#06b6d4', // cyan-500
            '#8b5cf6', // violet-500
            '#f59e0b', // amber-500
            '#ec4899', // pink-500
            '#3b82f6', // blue-500
            '#22c55e', // green-500
            '#f97316', // orange-500
          ]}
          particleCount={4}
          particleLife={80}
        />
        <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 relative z-20">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
            <div>
              <h3 className="font-semibold mb-3 sm:mb-4 text-sm sm:text-base">Produto</h3>
              <ul className="space-y-2 text-xs sm:text-sm text-muted-foreground">
                <li><button onClick={() => debouncedNavigate('/app/dashboard')} className="hover:text-primary text-left">Funcionalidades</button></li>
                <li><button onClick={() => debouncedNavigate('/brainsys')} className="hover:text-primary text-left">BrainSys</button></li>
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
                <li><button onClick={() => debouncedNavigate('/termsofservices')} className="hover:text-primary text-left">Termos de Uso</button></li>
              </ul>
            </div>
          </div>

          <div className="border-t mt-8 pt-8 relative">
            {/* Logo Seloontotech posicionada na lateral esquerda */}
            <div className="absolute left-0 top-1/2 transform -translate-y-1/2 hidden md:block">
              <img 
                src="/seloontotech.png" 
                alt="Seloontotech Logo" 
                className="w-32 h-auto opacity-75 hover:opacity-100 transition-opacity"
              />
            </div>
            
            {/* Conteúdo central mantido igual */}
            <div className="text-center flex flex-col items-center space-y-2">
              <FooterLogo />
              
              <p className="text-muted-foreground text-sm">
                &copy; 2024 Humansys. Todos os direitos reservados.
              </p>
              <p className="text-muted-foreground text-xs">
                CNPJ: 61.209.173/0001-09
              </p>
              <div className="flex space-x-4 mt-2">
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
        </div>
      </footer>

          {/* Brain Bot Assistant */}
          <BrainBot />
          </div>
          );
          };
