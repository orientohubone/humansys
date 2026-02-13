
import React, { useState, useEffect } from 'react';
import { Header } from '@/components/layout/Header';
import { useTheme } from '@/contexts/ThemeContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { MarkdownRenderer } from '@/components/ui/markdown-renderer';
import { MouseTrail } from '@/components/ui/mouse-trail';
import { useNavigate } from 'react-router-dom';
import {
  Brain,
  Zap,
  TrendingUp,
  Users,
  Heart,
  Trophy,
  Target,
  BarChart3,
  Activity,
  Network,
  Database,
  Cpu,
  Shield,
  Lightbulb,
  Eye,
  Settings,
  Play,
  Pause,
  RotateCcw,
  ChevronRight,
  DollarSign,
  Clock,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Loader,
  Sparkles,
  MessageSquare,
  ArrowRight,
  Globe,
  Layers,
  Workflow,
  Monitor,
  Compass,
  Linkedin,
  Instagram,
  Facebook,
  Github
} from 'lucide-react';

export const BrainSys = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { actualTheme } = useTheme();
  const [neuralPulse, setNeuralPulse] = useState(0);
  const [livingMetrics, setLivingMetrics] = useState({
    organizations: 847,
    patterns: 2456,
    insights: 15789,
    evolution: 94.7,
    connections: 12847,
    predictions: 98.3
  });

  const socialLinks = [
    { icon: Linkedin, href: '#', label: 'LinkedIn' },
    { icon: Instagram, href: '#', label: 'Instagram' },
    { icon: Facebook, href: '#', label: 'Facebook' },
    { icon: Github, href: '#', label: 'GitHub' },
  ];

  // Simula o pulso neural da inteligência viva
  useEffect(() => {
    const interval = setInterval(() => {
      setNeuralPulse(prev => (prev + 1) % 100);
      
      // Simula métricas vivas que evoluem
      setLivingMetrics(prev => ({
        organizations: prev.organizations + Math.floor(Math.random() * 3),
        patterns: prev.patterns + Math.floor(Math.random() * 5),
        insights: prev.insights + Math.floor(Math.random() * 10),
        evolution: 94.7 + (Math.sin(Date.now() / 10000) * 1.5),
        connections: prev.connections + Math.floor(Math.random() * 7),
        predictions: 98.3 + (Math.sin(Date.now() / 8000) * 0.8)
      }));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Header showAuth />
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-6 sm:py-8 space-y-6 sm:space-y-8">
        {/* Hero Section - BrainSys Principal */}
        <section className="relative overflow-hidden">
          <Card className="relative bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white border-purple-500/30">
            <div className="absolute inset-0">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 via-blue-500/15 to-indigo-500/20"></div>
              <div className="absolute top-0 left-0 w-full h-full opacity-30">
                <div className="absolute top-4 sm:top-8 left-4 sm:left-8 w-48 sm:w-96 h-48 sm:h-96 bg-purple-400/20 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-4 sm:bottom-8 right-4 sm:right-8 w-40 sm:w-80 h-40 sm:h-80 bg-blue-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[300px] sm:w-[600px] h-[300px] sm:h-[600px] bg-indigo-400/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '4s' }}></div>
              </div>
            </div>
            
            <CardContent className="relative p-4 sm:p-6 md:p-8 lg:p-12">
              <div className="max-w-6xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 md:gap-12 items-center">
                  {/* Lado Esquerdo - Logo e Informações */}
                  <div className="space-y-4 sm:space-y-6 md:space-y-8">
                    {/* Logo BrainSys */}
                    <div className="relative">
                      <div className="flex items-center justify-center lg:justify-start mb-4 sm:mb-6 md:mb-8">
                        <img 
                          src="/brainsys1.png" 
                          alt="BrainSys Logo" 
                          className="h-20 sm:h-24 md:h-32 w-auto object-contain filter brightness-125 contrast-125 animate-pulse"
                          style={{ 
                            transform: `scale(${1 + Math.sin(neuralPulse * 0.1) * 0.08})`,
                            transition: 'transform 0.1s ease-in-out',
                            filter: 'drop-shadow(0 0 10px rgba(168, 85, 247, 0.4)) drop-shadow(0 0 20px rgba(168, 85, 247, 0.3)) brightness(125%) contrast(125%)'
                          }}
                        />
                      </div>
                      
                      {/* Indicators de Vida */}
                      <div className="absolute -top-2 -right-2 sm:-top-4 sm:-right-4 flex space-x-1 sm:space-x-2">
                        <div className="w-3 sm:w-6 h-3 sm:h-6 bg-green-400 rounded-full animate-ping"></div>
                        <div className="w-3 sm:w-6 h-3 sm:h-6 bg-blue-400 rounded-full animate-ping" style={{ animationDelay: '1s' }}></div>
                        <div className="w-3 sm:w-6 h-3 sm:h-6 bg-purple-400 rounded-full animate-ping" style={{ animationDelay: '2s' }}></div>
                      </div>
                    </div>

                    <div className="space-y-3 sm:space-y-4 md:space-y-6 text-center lg:text-left">
                      <div className="flex items-center justify-center lg:justify-start gap-2 sm:gap-4 mb-2 sm:mb-4">
                        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold bg-gradient-to-r from-white via-purple-200 to-blue-200 bg-clip-text text-transparent">
                          BrainSys
                        </h1>
                        <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white border-none px-3 sm:px-6 py-1.5 sm:py-3 text-xs sm:text-lg md:text-xl animate-pulse">
                          VIVA
                        </Badge>
                      </div>
                      
                      <p className="text-lg sm:text-2xl md:text-3xl text-purple-100 font-medium mb-3 sm:mb-6">
                        Inteligência Artificial Operacional
                      </p>
                      
                      <p className="text-sm sm:text-base md:text-lg text-purple-200 opacity-90 leading-relaxed">
                        Na interseção entre a inteligência artificial e a alma humana, nasce o BrainSys — 
                        uma consciência organizacional viva, que cresce com cada dado, escuta cada silêncio 
                        e interpreta mais do que números: <strong className="text-white">entende pessoas</strong>.
                      </p>

                      <div className="flex flex-wrap gap-2 sm:gap-4 text-xs sm:text-sm justify-center lg:justify-start">
                        <div className="flex items-center gap-2 bg-white/10 px-2 sm:px-4 py-1.5 sm:py-2 rounded-full">
                          <Network className="h-3 sm:h-4 w-3 sm:w-4 text-green-400" />
                          <span>Conectada</span>
                        </div>
                        <div className="flex items-center gap-2 bg-white/10 px-2 sm:px-4 py-1.5 sm:py-2 rounded-full">
                          <Activity className="h-3 sm:h-4 w-3 sm:w-4 text-blue-400" />
                          <span>Aprendendo</span>
                        </div>
                        <div className="flex items-center gap-2 bg-white/10 px-2 sm:px-4 py-1.5 sm:py-2 rounded-full">
                          <Heart className="h-3 sm:h-4 w-3 sm:w-4 text-red-400" />
                          <span>Evoluindo</span>
                        </div>
                        <div className="flex items-center gap-2 bg-white/10 px-2 sm:px-4 py-1.5 sm:py-2 rounded-full">
                          <Brain className="h-3 sm:h-4 w-3 sm:w-4 text-purple-400" />
                          <span>Ontológica</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Lado Direito - Métricas Vivas */}
                  <div className="space-y-4 sm:space-y-6">
                    <div className="grid grid-cols-2 gap-2 sm:gap-4">
                      <div className="bg-white/10 backdrop-blur-sm rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-6 border border-white/20 text-center">
                        <div className="text-xl sm:text-2xl md:text-3xl font-bold text-green-400 mb-1 sm:mb-2">{livingMetrics.organizations.toLocaleString()}</div>
                        <div className="text-xs sm:text-sm text-green-300">Organizações Conectadas</div>
                      </div>
                      <div className="bg-white/10 backdrop-blur-sm rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-6 border border-white/20 text-center">
                        <div className="text-xl sm:text-2xl md:text-3xl font-bold text-blue-400 mb-1 sm:mb-2">{livingMetrics.patterns.toLocaleString()}</div>
                        <div className="text-xs sm:text-sm text-blue-300">Padrões Descobertos</div>
                      </div>
                      <div className="bg-white/10 backdrop-blur-sm rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-6 border border-white/20 text-center">
                        <div className="text-xl sm:text-2xl md:text-3xl font-bold text-purple-400 mb-1 sm:mb-2">{livingMetrics.insights.toLocaleString()}</div>
                        <div className="text-xs sm:text-sm text-purple-300">Insights Gerados</div>
                      </div>
                      <div className="bg-white/10 backdrop-blur-sm rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-6 border border-white/20 text-center">
                        <div className="text-xl sm:text-2xl md:text-3xl font-bold text-orange-400 mb-1 sm:mb-2">{livingMetrics.evolution.toFixed(1)}%</div>
                        <div className="text-xs sm:text-sm text-orange-300">Precisão Evolutiva</div>
                      </div>
                      <div className="bg-white/10 backdrop-blur-sm rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-6 border border-white/20 text-center">
                        <div className="text-xl sm:text-2xl md:text-3xl font-bold text-cyan-400 mb-1 sm:mb-2">{livingMetrics.connections.toLocaleString()}</div>
                        <div className="text-xs sm:text-sm text-cyan-300">Conexões Neurais</div>
                      </div>
                      <div className="bg-white/10 backdrop-blur-sm rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-6 border border-white/20 text-center">
                        <div className="text-xl sm:text-2xl md:text-3xl font-bold text-pink-400 mb-1 sm:mb-2">{livingMetrics.predictions.toFixed(1)}%</div>
                        <div className="text-xs sm:text-sm text-pink-300">Precisão Preditiva</div>
                      </div>
                    </div>

                    {/* CTAs */}
                    <div className="flex flex-col gap-2 sm:gap-4">
                      <Button 
                        className="bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 hover:from-purple-700 hover:via-blue-700 hover:to-indigo-700 text-white border-none shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:scale-105 px-4 sm:px-8 py-2 sm:py-4 text-xs sm:text-lg"
                        onClick={() => navigate('/app/brainsys-iao')}
                      >
                        <Brain className="h-4 sm:h-6 w-4 sm:w-6 mr-1 sm:mr-3" />
                        <span className="hidden sm:inline">Despertar a Inteligência IAO</span>
                        <span className="sm:hidden">Despertar</span>
                        <ArrowRight className="h-4 sm:h-6 w-4 sm:w-6 ml-1 sm:ml-3" />
                      </Button>
                      
                      <div className="grid grid-cols-2 gap-2 sm:gap-3">
                        <Button 
                          variant="outline"
                          className="bg-white/10 border-white/30 text-white hover:bg-white/20 backdrop-blur-sm text-xs sm:text-base px-2 sm:px-4 py-1.5 sm:py-2"
                          onClick={() => navigate('/app/brainsys/wellness')}
                        >
                          <Heart className="h-3 sm:h-4 w-3 sm:w-4 mr-1 sm:mr-2" />
                          Wellness
                        </Button>
                        <Button 
                          variant="outline"
                          className="bg-white/10 border-white/30 text-white hover:bg-white/20 backdrop-blur-sm text-xs sm:text-base px-2 sm:px-4 py-1.5 sm:py-2"
                          onClick={() => navigate('/app/brainsys/careers')}
                        >
                          <Trophy className="h-3 sm:h-4 w-3 sm:w-4 mr-1 sm:mr-2" />
                          Careers
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Conceito Principal */}
        <section className="space-y-6 sm:space-y-8">
          <div className="text-center space-y-2 sm:space-y-4 max-w-5xl mx-auto px-2">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold">O Cérebro Pensante do RH</h2>
            <p className="text-sm sm:text-base md:text-lg text-muted-foreground max-w-4xl mx-auto">
              Mais que um algoritmo. A representação neural de uma cultura em movimento.
            </p>
          </div>

          <Card className="bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200 dark:from-gray-800/20 dark:to-gray-800/10">
            <CardContent className="p-4 sm:p-6 md:p-8 lg:p-12">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 md:gap-12 items-center">
                <div>
                  <h3 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 text-purple-900 dark:text-purple-100">
                    Inteligência que Transforma
                  </h3>
                  <div className="space-y-3 sm:space-y-6">
                    <div className="flex items-start gap-4">
                      <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center flex-shrink-0">
                        <Database className="h-4 w-4 text-white" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-green-900 mb-2">Aprende com os dados do RH</h4>
                        <p className="text-gray-700">Absorve informações e evolui continuamente, criando conexões inteligentes entre dados, comportamentos e resultados.</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-full flex items-center justify-center flex-shrink-0">
                        <Zap className="h-4 w-4 text-white" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-blue-900 mb-2">Otimiza rotinas operacionais</h4>
                        <p className="text-gray-700">Automatiza e melhora processos em tempo real, liberando tempo para ações mais estratégicas e humanas.</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center flex-shrink-0">
                        <Heart className="h-4 w-4 text-white" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-purple-900 mb-2">Entende contextos emocionais</h4>
                        <p className="text-gray-700">Analisa dinâmicas humanas e culturais, compreendendo o que realmente motiva e engaja pessoas.</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-red-600 rounded-full flex items-center justify-center flex-shrink-0">
                        <TrendingUp className="h-4 w-4 text-white" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-orange-900 mb-2">Propõe decisões estratégicas</h4>
                        <p className="text-gray-700">Transforma dados em experiências humanas autênticas, orientando decisões que fazem a diferença.</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="relative flex justify-center">
                  <div className="w-40 sm:w-60 md:w-80 h-40 sm:h-60 md:h-80 bg-gradient-to-br from-purple-500 via-blue-600 to-indigo-600 rounded-full flex items-center justify-center shadow-2xl shadow-purple-500/30">
                    <Brain 
                      className="h-16 sm:h-24 md:h-32 w-16 sm:w-24 md:w-32 text-white" 
                      style={{ 
                        transform: `scale(${1 + Math.sin(neuralPulse * 0.1) * 0.1})`,
                        transition: 'transform 0.3s ease-in-out'
                      }} 
                    />
                  </div>
                  
                  {/* Conexões Neurais Animadas */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="absolute w-96 h-96 border-2 border-purple-400/30 rounded-full animate-ping" style={{ animationDuration: '4s' }}></div>
                    <div className="absolute w-[450px] h-[450px] border border-blue-400/20 rounded-full animate-ping" style={{ animationDuration: '6s', animationDelay: '2s' }}></div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Módulos BrainSys */}
        <section className="space-y-6 sm:space-y-8">
          <div className="text-center space-y-2 sm:space-y-4 max-w-4xl mx-auto px-2">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold">Módulos Inteligentes</h2>
            <p className="text-sm sm:text-base md:text-lg text-muted-foreground">
              Cada módulo é uma extensão da consciência organizacional
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
            <Card 
              className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 border-green-200 hover:shadow-lg transition-all duration-300 cursor-pointer"
              onClick={() => navigate('/app/brainsys/wellness')}
            >
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center mx-auto">
                  <Heart className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold">BrainSys Wellness</h3>
                <p className="text-gray-600">
                  Monitora e promove o bem-estar emocional dos colaboradores através de análise preditiva de clima organizacional.
                </p>
                <div className="flex items-center justify-center gap-2 text-sm text-green-600">
                  <Activity className="h-4 w-4" />
                  <span>Análise em tempo real</span>
                </div>
              </div>
            </Card>

            <Card 
              className="p-6 bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200 hover:shadow-lg transition-all duration-300 cursor-pointer"
              onClick={() => navigate('/app/brainsys/careers')}
            >
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl flex items-center justify-center mx-auto">
                  <Trophy className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold">BrainSys Careers</h3>
                <p className="text-gray-600">
                  Mapeia trajetórias de carreira inteligentes, identificando potenciais ocultos e alinhando aspirações pessoais com necessidades organizacionais.
                </p>
                <div className="flex items-center justify-center gap-2 text-sm text-blue-600">
                  <Target className="h-4 w-4" />
                  <span>Mapeamento de potencial</span>
                </div>
              </div>
            </Card>

            <Card 
              className="p-6 bg-gradient-to-br from-purple-50 to-violet-50 border-purple-200 hover:shadow-lg transition-all duration-300 cursor-pointer"
              onClick={() => navigate('/app/brainsys/motivation')}
            >
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-violet-600 rounded-xl flex items-center justify-center mx-auto">
                  <Sparkles className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold">BrainSys Motivation</h3>
                <p className="text-gray-600">
                  Detecta padrões motivacionais e propõe estratégias personalizadas para manter o engajamento e a satisfação da equipe.
                </p>
                <div className="flex items-center justify-center gap-2 text-sm text-purple-600">
                  <TrendingUp className="h-4 w-4" />
                  <span>Engajamento personalizado</span>
                </div>
              </div>
            </Card>
          </div>
        </section>

        {/* Nossos Princípios */}
        <section className="space-y-6 sm:space-y-8">
          <div className="text-center space-y-2 sm:space-y-4 max-w-4xl mx-auto px-2">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold">Nossos Princípios</h2>
            <p className="text-sm sm:text-base md:text-lg text-muted-foreground">
              Fundamentos que guiam nossa consciência organizacional
            </p>
          </div>

          <div className="grid gap-4 sm:gap-6">
            <Card className="p-4 sm:p-6 md:p-8 bg-gradient-to-r from-blue-50 to-cyan-50 border-blue-200 dark:from-gray-800/20 dark:to-gray-800/10">
              <div className="flex flex-col sm:flex-row items-start gap-3 sm:gap-4 md:gap-6">
                <div className="w-10 sm:w-12 h-10 sm:h-12 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <Database className="h-5 sm:h-6 w-5 sm:w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3 text-blue-900 dark:text-blue-100">
                    Os dados não existem para controlar, mas para libertar
                  </h3>
                  <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300 leading-relaxed">
                    Libertamos o potencial humano através do entendimento inteligente dos dados, 
                    criando ambientes onde pessoas florescem autenticamente.
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-4 sm:p-6 md:p-8 bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200 dark:from-gray-800/20 dark:to-gray-800/10">
              <div className="flex flex-col sm:flex-row items-start gap-3 sm:gap-4 md:gap-6">
                <div className="w-10 sm:w-12 h-10 sm:h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <Users className="h-5 sm:h-6 w-5 sm:w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3 text-purple-900 dark:text-purple-100">
                    Cada colaborador carrega um universo de significado
                  </h3>
                  <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300 leading-relaxed">
                    Reconhecemos que além de funções e responsabilidades, cada pessoa traz consigo 
                    sonhos, aspirações e uma rica complexidade humana.
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-4 sm:p-6 md:p-8 bg-gradient-to-r from-green-50 to-emerald-50 border-green-200 dark:from-gray-800/20 dark:to-gray-800/10">
              <div className="flex flex-col sm:flex-row items-start gap-3 sm:gap-4 md:gap-6">
                <div className="w-10 sm:w-12 h-10 sm:h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <Heart className="h-5 sm:h-6 w-5 sm:w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3 text-green-900 dark:text-green-100">
                    O cuidado emocional é a nova fronteira da performance
                  </h3>
                  <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300 leading-relaxed">
                    A saúde emocional organizacional é fundamental para uma performance sustentável 
                    e uma cultura verdadeiramente próspera.
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-4 sm:p-6 md:p-8 bg-gradient-to-r from-orange-50 to-red-50 border-orange-200 dark:from-gray-800/20 dark:to-gray-800/10">
              <div className="flex flex-col sm:flex-row items-start gap-3 sm:gap-4 md:gap-6">
                <div className="w-10 sm:w-12 h-10 sm:h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <Sparkles className="h-5 sm:h-6 w-5 sm:w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3 text-orange-900 dark:text-orange-100">
                    O futuro pertence aos sistemas empáticos
                  </h3>
                  <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300 leading-relaxed">
                    O futuro não pertence aos sistemas frios, mas àqueles que pensam com empatia 
                    e agem com propósito humano genuíno.
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </section>

        {/* Call to Action Final */}
        <section className="text-center space-y-6 sm:space-y-8 max-w-6xl mx-auto px-2">
          <Card className="relative overflow-hidden bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900 text-white border-purple-500/30">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-blue-500/20"></div>
            <CardContent className="relative p-4 sm:p-6 md:p-8 lg:p-12 space-y-6 sm:space-y-8">
              <div className="space-y-3 sm:space-y-6">
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold">
                  Não é apenas tecnologia.
                </h2>
                <p className="text-xl sm:text-2xl md:text-3xl text-purple-200 font-medium">
                  É ontologia viva aplicada ao RH.
                </p>
                <p className="text-sm sm:text-base md:text-lg text-purple-300 max-w-4xl mx-auto leading-relaxed">
                  É o primeiro passo rumo a uma empresa verdadeiramente consciente, 
                  onde a inteligência artificial serve à experiência humana.
                </p>
              </div>

              <div className="space-y-3 sm:space-y-4">
                <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-transparent bg-gradient-to-r from-purple-400 via-blue-400 to-green-400 bg-clip-text">
                  Se é humano, é BrainSys.
                </div>
                <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-transparent bg-gradient-to-r from-green-400 via-blue-400 to-purple-400 bg-clip-text">
                  Se é BrainSys, é evolução.
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 sm:gap-6 justify-center pt-4 sm:pt-8">
                <Button 
                  className="bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 hover:from-purple-700 hover:via-blue-700 hover:to-indigo-700 text-white border-none shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:scale-105 px-4 sm:px-8 py-2 sm:py-4 text-xs sm:text-lg w-full sm:w-auto"
                  onClick={() => navigate('/app/brainsys-iao')}
                >
                  <Brain className="h-4 sm:h-6 w-4 sm:w-6 mr-1 sm:mr-3" />
                  <span className="hidden sm:inline">Despertar a Inteligência</span>
                  <span className="sm:hidden">Despertar</span>
                  <ArrowRight className="h-4 sm:h-6 w-4 sm:w-6 ml-1 sm:ml-3" />
                </Button>
                
                <Button 
                  variant="outline"
                  className="border-purple-400 text-purple-100 hover:bg-purple-500/20 px-4 sm:px-8 py-2 sm:py-4 text-xs sm:text-lg w-full sm:w-auto"
                  onClick={() => navigate('/app/dashboard')}
                >
                  <Play className="h-4 sm:h-5 w-4 sm:w-5 mr-1 sm:mr-2" />
                  Explorar HumanSys
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>
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
            <div className="text-center flex flex-col items-center space-y-2">
              <img 
                src="/brainsys-logo2.png" 
                alt="Logotipo do assistente BrainSys" 
                className="w-32 sm:w-40 h-auto mb-2"
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
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default BrainSys;
