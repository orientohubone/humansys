import React, { useState, useEffect, useCallback } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { openaiService } from '@/services/openaiService';
import { useToast } from '@/hooks/use-toast';
import { MarkdownRenderer } from '@/components/ui/markdown-renderer';
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
  Layers
} from 'lucide-react';
import { useBrainSys } from '@/hooks/useBrainSys';
import { useAuth } from '@/contexts/AuthContext';
import RadialOrbitalTimeline from '@/components/ui/radial-orbital-timeline';

export const BrainsysIAO = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingProgress, setProcessingProgress] = useState(0);
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [livingPulse, setLivingPulse] = useState(0);
  const [isOpenAIConnected, setIsOpenAIConnected] = useState(false);
  const [currentThreadId, setCurrentThreadId] = useState<string | null>(null);
  const [isSwarmMode, setIsSwarmMode] = useState(false);
  const [swarmResponse, setSwarmResponse] = useState<any>(null);
  const [selectedAgents, setSelectedAgents] = useState<string[]>(['recruitment', 'analytics', 'strategy', 'culture', 'climate']);
  const { toast } = useToast();
  const { user } = useAuth();

  // Dados da timeline orbital IAO
  const orbitalTimelineData = [
    {
      id: 1,
      title: "Inicialização",
      date: "Sistema Base",
      content: "Ativação inicial do BrainSys IAO com módulos fundamentais de processamento",
      category: "Fundação",
      icon: Brain,
      relatedIds: [2],
      status: "completed" as const,
      energy: 100,
    },
    {
      id: 2,
      title: "Absorção de Dados",
      date: "Fase Contínua",
      content: "Coleta e processamento inteligente de dados organizacionais em tempo real",
      category: "Processamento",
      icon: Database,
      relatedIds: [1, 3],
      status: "in-progress" as const,
      energy: 85,
    },
    {
      id: 3,
      title: "Análise Preditiva",
      date: "Algoritmos Ativos",
      content: "Geração de insights e previsões para otimização de processos de RH",
      category: "Inteligência",
      icon: TrendingUp,
      relatedIds: [2, 4],
      status: "in-progress" as const,
      energy: 78,
    },
    {
      id: 4,
      title: "Otimização Automática",
      date: "Decisões Inteligentes",
      content: "Implementação automatizada de melhorias baseadas em análises complexas",
      category: "Automação",
      icon: Settings,
      relatedIds: [3, 5],
      status: "in-progress" as const,
      energy: 65,
    },
    {
      id: 5,
      title: "Feedback Adaptativo",
      date: "Aprendizado Contínuo",
      content: "Sistema de feedback inteligente que adapta comportamentos baseado em resultados",
      category: "Evolução",
      icon: RotateCcw,
      relatedIds: [4, 6],
      status: "in-progress" as const,
      energy: 55,
    },
    {
      id: 6,
      title: "Síntese Estratégica",
      date: "Visão Holística",
      content: "Integração completa de todos os dados para decisões estratégicas empresariais",
      category: "Estratégia",
      icon: Target,
      relatedIds: [5, 7],
      status: "pending" as const,
      energy: 40,
    },
    {
      id: 7,
      title: "Inteligência Coletiva",
      date: "Rede Neural",
      content: "Criação de rede inteligente conectando todas as áreas organizacionais",
      category: "Rede",
      icon: Network,
      relatedIds: [6, 8],
      status: "pending" as const,
      energy: 30,
    },
    {
      id: 8,
      title: "Consciência Organizacional",
      date: "Meta-Inteligência",
      content: "Desenvolvimento de consciência organizacional para tomada de decisões autônomas",
      category: "Transcendência",
      icon: Sparkles,
      relatedIds: [7],
      status: "pending" as const,
      energy: 15,
    },
  ];
  const { 
    initializeBrainSys, 
    analyzeEntity, 
    recordAction, 
    refreshStatus, 
    autoRecord,
    brainSysInitialized,
  } = useBrainSys();

  // Simula o "pulso" da inteligência viva
  useEffect(() => {
    const interval = setInterval(() => {
      setLivingPulse(prev => (prev + 1) % 100);
    }, 100);
    return () => clearInterval(interval);
  }, []);

  // Verificar conexão OpenAI
  useEffect(() => {
    const checkOpenAIConnection = () => {
      const apiKey = localStorage.getItem('openai_api_key');
      const assistantId = localStorage.getItem('openai_assistant_id');

      if (apiKey && assistantId) {
        openaiService.setConfig({ apiKey, assistantId });
        setIsOpenAIConnected(true);
        console.log('✅ BrainSys IAO conectado à OpenAI');
      } else {
        setIsOpenAIConnected(false);
        console.log('⚠️ BrainSys IAO sem conexão OpenAI');
      }
    };

    checkOpenAIConnection();

    // Listener para mudanças no localStorage
    const handleStorageChange = () => checkOpenAIConnection();
    window.addEventListener('storage', handleStorageChange);

    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Registrar interações automaticamente
  useEffect(() => {
    if (user && brainSysInitialized) {
      autoRecord('brainsys_iao_access', {
        page: 'brainsys_iao',
        timestamp: new Date().toISOString()
      });
    }
  }, [user, brainSysInitialized, autoRecord]);

  // Função para inicializar BrainSys manualmente
  const handleInitializeBrainSys = async () => {
    setIsProcessing(true);
    setProcessingProgress(0);

    try {
      setProcessingProgress(25);
      await initializeBrainSys();

      setProcessingProgress(75);
      await refreshStatus();

      setProcessingProgress(100);

      toast({
        title: "🧠 BrainSys IAO Ativo",
        description: "Inteligência organizacional inicializada com sucesso",
      });

      if (user) {
        await recordAction('brainsys_manual_initialization');
      }
    } catch (error) {
      console.error('❌ Erro ao inicializar BrainSys:', error);
      toast({
        title: "Erro na Inicialização",
        description: "Falha ao inicializar o BrainSys IAO",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
      setProcessingProgress(0);
    }
  };

  // Função para analisar com BrainSys
  const handleBrainSysAnalysis = async () => {
    if (!user || !brainSysInitialized) {
      toast({
        title: "BrainSys Não Disponível",
        description: "Inicialize o BrainSys IAO primeiro",
        variant: "destructive"
      });
      return;
    }

    setIsProcessing(true);
    try {
      const analysis = await analyzeEntity(user.id, 'PERFORMANCE_REVIEW');

      if (analysis.success && analysis.insights) {
        const responseText = analysis.insights.map(insight => 
          `**${insight.insight_type}** (${(insight.confidence * 100).toFixed(1)}%): ${insight.description}\n${insight.suggested_actions.join(', ')}`
        ).join('\n\n');

        setAiResponse(responseText);

        await recordAction('brainsys_analysis_performed', {
          insights_count: analysis.insights.length,
          confidence: analysis.confidence
        });
      } else {
        throw new Error(analysis.error || 'Análise falhou');
      }
    } catch (error) {
      console.error('❌ Erro na análise:', error);
      toast({
        title: "Erro na Análise",
        description: "Falha ao executar análise do BrainSys",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleExecutePrompt = async () => {
    if (!aiPrompt.trim()) {
      toast({
        title: "Prompt vazio",
        description: "Por favor, digite sua consulta.",
        variant: "destructive"
      });
      return;
    }

    if (!isOpenAIConnected) {
      toast({
        title: "OpenAI não configurada",
        description: "Configure sua OpenAI nas Configurações primeiro.",
        variant: "destructive"
      });
      return;
    }

    setIsProcessing(true);
    setProcessingProgress(0);
    setAiResponse('');
    setSwarmResponse(null);

    try {
      // Criar thread se não existe
      let threadId = currentThreadId;
      if (!threadId) {
        console.log('🧠 Criando nova thread BrainSys...');
        threadId = await openaiService.createThread();
        setCurrentThreadId(threadId);
      }

      if (isSwarmMode) {
        // Modo Enxame - Multi-agentes
        console.log('🐝 Executando em modo enxame...');

        const swarmResult = await openaiService.executeSwarmConsultation(
          threadId, 
          aiPrompt, 
          selectedAgents,
          (progress, step) => {
            setProcessingProgress(progress);
            console.log(`🐝 ${progress}% - ${step}`);
          }
        );

        setSwarmResponse(swarmResult);

        toast({
          title: "🐝 Enxame de Agentes Ativado",
          description: `${swarmResult.specialists.length} especialistas consultados com sucesso.`
        });
      } else {
        // Modo Simples - Agente único
        console.log('🧠 Executando consulta simples...');
        setProcessingProgress(50);

        const response = await openaiService.sendMessageAndGetResponse(threadId, aiPrompt);

        setProcessingProgress(100);
        setAiResponse(response);

        toast({
          title: "🧠 BrainSys IAO Respondeu",
          description: "Consulta processada com sucesso."
        });
      }

      setAiPrompt('');

    } catch (error) {
      console.error('❌ Erro na consulta BrainSys:', error);
      toast({
        title: "❌ Erro na consulta",
        description: `Falha ao processar: ${error.message}`,
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Hero Header - Living Intelligence */}
        <Card className="relative overflow-hidden bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 dark:from-purple-950 dark:via-blue-950 dark:to-indigo-950 text-white border-purple-500/30 dark:border-purple-700/50">
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 via-blue-500/15 to-indigo-500/20 dark:from-purple-400/10 dark:via-blue-400/5 dark:to-indigo-400/10"></div>
            <div className="absolute top-0 left-0 w-full h-full opacity-30">
              <div className="hidden md:block absolute top-8 left-8 w-32 md:w-64 h-32 md:h-64 bg-purple-400/20 rounded-full blur-3xl animate-pulse"></div>
              <div className="hidden md:block absolute bottom-8 right-8 w-32 md:w-80 h-32 md:h-80 bg-blue-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
              <div className="hidden lg:block absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-400/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '4s' }}></div>
            </div>
          </div>
          <CardContent className="relative p-3 xs:p-4 sm:p-6 md:p-8 lg:p-12">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 md:gap-8">
              <div className="flex flex-col sm:flex-row items-center sm:items-center gap-4 sm:gap-6 md:gap-8">
                <div className="relative flex-shrink-0">
                  <div className="w-20 h-20 sm:w-24 sm:h-24 md:w-32 md:h-32 bg-gradient-to-br from-purple-500 via-blue-600 to-indigo-600 rounded-2xl md:rounded-3xl flex items-center justify-center shadow-2xl shadow-purple-500/30">
                    <Brain 
                      className="h-10 w-10 sm:h-12 sm:w-12 md:h-16 md:w-16 text-white" 
                      style={{ 
                        transform: `scale(${1 + Math.sin(livingPulse * 0.1) * 0.1})`,
                        transition: 'transform 0.1s ease-in-out'
                      }} 
                    />
                  </div>
                  <div className="absolute -top-2 -right-2 flex space-x-1">
                    <div className="w-2 h-2 sm:w-3 sm:h-3 bg-green-400 rounded-full animate-ping"></div>
                    <div className="w-2 h-2 sm:w-3 sm:h-3 bg-blue-400 rounded-full animate-ping" style={{ animationDelay: '0.5s' }}></div>
                    <div className="w-2 h-2 sm:w-3 sm:h-3 bg-purple-400 rounded-full animate-ping" style={{ animationDelay: '1s' }}></div>
                  </div>
                  <div className="absolute -bottom-2 -left-2 w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center">
                    <Heart className="h-3 w-3 sm:h-4 sm:w-4 text-white animate-pulse" />
                  </div>
                </div>
                <div>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 md:gap-4 mb-2 sm:mb-3">
                    <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-0">BrainSys IAO</h1>
                    <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white border-none px-2 py-1 sm:px-3 sm:py-1 md:px-4 md:py-2 text-xs sm:text-sm md:text-lg animate-pulse w-fit">
                      VIVA
                    </Badge>
                  </div>
                  <p className="text-sm sm:text-base md:text-lg lg:text-2xl text-purple-100 mb-2 sm:mb-3 font-medium">
                    A Inteligência Viva do HumanSys
                  </p>
                  <p className="hidden sm:block text-xs sm:text-sm md:text-base lg:text-lg text-purple-200 mb-3 md:mb-4 opacity-90">
                    IAO = Inteligência Artificial Operacional • Ontológica • 8 Especialistas
                  </p>
                  <div className="flex flex-wrap gap-2 sm:gap-3 md:gap-4 text-xs sm:text-sm">
                    <div className="flex items-center gap-1 sm:gap-2 bg-white/10 dark:bg-white/5 px-2 sm:px-3 py-1 rounded-full">
                      <Network className="h-3 w-3 sm:h-4 sm:w-4 text-green-400" />
                      <span>Conectada</span>
                    </div>
                    <div className="flex items-center gap-1 sm:gap-2 bg-white/10 dark:bg-white/5 px-2 sm:px-3 py-1 rounded-full">
                      <Activity className="h-3 w-3 sm:h-4 sm:w-4 text-blue-400" />
                      <span>Aprendendo</span>
                    </div>
                    <div className="flex items-center gap-1 sm:gap-2 bg-white/10 dark:bg-white/5 px-2 sm:px-3 py-1 rounded-full">
                      <Heart className="h-3 w-3 sm:h-4 sm:w-4 text-red-400" />
                      <span>Evoluindo</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="hidden md:block text-right">
                <div className="text-xs md:text-sm text-purple-200">Powered by</div>
                <div className="text-lg md:text-2xl font-bold mb-1">Claude 3.5 Sonnet</div>
                <div className="text-xs md:text-sm text-purple-300">Anthropic AI</div>
              </div>
            </div>

            {/* Living Intelligence Concept */}
            <div className="bg-white/10 dark:bg-white/5 backdrop-blur-sm rounded-lg md:rounded-2xl p-3 xs:p-4 sm:p-6 border border-white/20 dark:border-white/10 mb-4 sm:mb-6">
              <h2 className="text-lg sm:text-xl md:text-2xl font-bold mb-3 sm:mb-4 flex items-center">
                <Sparkles className="h-5 w-5 sm:h-6 sm:w-6 mr-2 sm:mr-3 text-yellow-400" />
                O Cérebro Pensante que Transforma
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center mt-1">
                      <Database className="h-3 w-3 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-green-100">Aprende com os dados do RH</h4>
                      <p className="text-sm text-green-200 opacity-90">Absorve informações e evolui continuamente</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center mt-1">
                      <Zap className="h-3 w-3 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-blue-100">Otimiza rotinas operacionais</h4>
                      <p className="text-sm text-blue-200 opacity-90">Automatiza e melhora processos em tempo real</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center mt-1">
                      <Heart className="h-3 w-3 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-purple-100">Entende contextos emocionais</h4>
                      <p className="text-sm text-purple-200 opacity-90">Analisa dinâmicas humanas e culturais</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center mt-1">
                      <TrendingUp className="h-3 w-3 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-orange-100">Propõe decisões estratégicas</h4>
                      <p className="text-sm text-orange-200 opacity-90">Transforma dados em experiências humanas</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Living Metrics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 xs:gap-3 sm:gap-4">
              <div className="bg-white/10 dark:bg-white/5 backdrop-blur-sm rounded-lg md:rounded-xl p-3 xs:p-4 sm:p-4 border border-white/20 dark:border-white/10 text-center">
                <div className={`text-lg xs:text-2xl sm:text-3xl font-bold mb-1 ${isOpenAIConnected ? 'text-green-400' : 'text-orange-400'}`}>
                  {isOpenAIConnected ? 'CONECTADA' : 'SIMULADA'}
                </div>
                <div className={`text-xs xs:text-sm ${isOpenAIConnected ? 'text-green-300' : 'text-orange-300'}`}>
                  {isOpenAIConnected ? 'OpenAI Ativa' : 'Modo Demo'}
                </div>
              </div>
              <div className="bg-white/10 dark:bg-white/5 backdrop-blur-sm rounded-lg md:rounded-xl p-3 xs:p-4 sm:p-4 border border-white/20 dark:border-white/10 text-center">
                <div className="text-lg xs:text-2xl sm:text-3xl font-bold text-blue-400 mb-1">
                  {isSwarmMode ? '🐝' : '🧠'}
                </div>
                <div className="text-xs xs:text-sm text-blue-300">
                  {isSwarmMode ? 'Enxame' : 'Único'}
                </div>
              </div>
              <div className="bg-white/10 dark:bg-white/5 backdrop-blur-sm rounded-lg md:rounded-xl p-3 xs:p-4 sm:p-4 border border-white/20 dark:border-white/10 text-center">
                <div className="text-lg xs:text-2xl sm:text-3xl font-bold text-purple-400 mb-1">
                  {isSwarmMode ? `${selectedAgents.length}/8` : '1'}
                </div>
                <div className="text-xs xs:text-sm text-purple-300">
                  Especialistas
                </div>
              </div>
              <div className="bg-white/10 dark:bg-white/5 backdrop-blur-sm rounded-lg md:rounded-xl p-3 xs:p-4 sm:p-4 border border-white/20 dark:border-white/10 text-center">
                <div className="text-lg xs:text-2xl sm:text-3xl font-bold text-orange-400 mb-1">∞</div>
                <div className="text-xs xs:text-sm text-orange-300">Evolução</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Interface */}
        <Tabs defaultValue="console" className="space-y-4 sm:space-y-6">
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 h-auto gap-2 sm:gap-0 p-1 sm:p-0 bg-gradient-to-r from-purple-100 to-blue-100 dark:from-purple-900/30 dark:to-blue-900/30 dark:border dark:border-purple-800/50">
            <TabsTrigger value="console" className="flex flex-col xs:flex-row items-center space-x-0 xs:space-x-1 text-xs xs:text-sm md:text-base py-2 xs:py-3">
              <MessageSquare className="h-4 w-4 xs:h-5 xs:w-5" />
              <span className="hidden sm:inline">Console</span>
            </TabsTrigger>
            <TabsTrigger value="manifesto" className="flex flex-col xs:flex-row items-center space-x-0 xs:space-x-1 text-xs xs:text-sm md:text-base py-2 xs:py-3">
              <Heart className="h-4 w-4 xs:h-5 xs:w-5" />
              <span className="hidden sm:inline">Manifesto</span>
            </TabsTrigger>
            <TabsTrigger value="learning" className="flex flex-col xs:flex-row items-center space-x-0 xs:space-x-1 text-xs xs:text-sm md:text-base py-2 xs:py-3">
              <Brain className="h-4 w-4 xs:h-5 xs:w-5" />
              <span className="hidden md:inline">Aprend.</span>
            </TabsTrigger>
            <TabsTrigger value="insights" className="flex flex-col xs:flex-row items-center space-x-0 xs:space-x-1 text-xs xs:text-sm md:text-base py-2 xs:py-3">
              <Eye className="h-4 w-4 xs:h-5 xs:w-5" />
              <span className="hidden md:inline">Insights</span>
            </TabsTrigger>
            <TabsTrigger value="evolution" className="flex flex-col xs:flex-row items-center space-x-0 xs:space-x-1 text-xs xs:text-sm md:text-base py-2 xs:py-3">
              <Sparkles className="h-4 w-4 xs:h-5 xs:w-5" />
              <span className="hidden md:inline">Evolução</span>
            </TabsTrigger>
            <TabsTrigger value="orbita" className="flex flex-col xs:flex-row items-center space-x-0 xs:space-x-1 text-xs xs:text-sm md:text-base py-2 xs:py-3">
              <Globe className="h-4 w-4 xs:h-5 xs:w-5" />
              <span className="hidden lg:inline">Órbita</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="manifesto" className="space-y-8 sm:space-y-16">
            {/* Hero Section - Manifesto Principal */}
            <Card className="relative bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 dark:from-purple-950 dark:via-blue-950 dark:to-indigo-950 text-white border-purple-500/30 dark:border-purple-700/50 overflow-hidden">
              <div className="absolute inset-0">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 via-blue-500/15 to-indigo-500/20 dark:from-purple-400/10 dark:via-blue-400/5 dark:to-indigo-400/10"></div>
                <div className="absolute top-0 left-0 w-full h-full opacity-30">
                  <div className="hidden md:block absolute top-8 left-8 w-48 md:w-96 h-48 md:h-96 bg-purple-400/20 rounded-full blur-3xl animate-pulse"></div>
                  <div className="hidden md:block absolute bottom-8 right-8 w-48 md:w-80 h-48 md:h-80 bg-blue-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
                  <div className="hidden lg:block absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-400/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '4s' }}></div>
                </div>
              </div>

              <CardContent className="relative p-4 xs:p-6 sm:p-8 md:p-12 lg:p-16">
                <div className="max-w-4xl mx-auto text-center space-y-6 sm:space-y-8">
                  {/* Cérebro Central Pulsante */}
                  <div className="relative mx-auto mb-6 sm:mb-12">
                    <div className="w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 bg-gradient-to-br from-purple-500 via-blue-600 to-indigo-600 rounded-full flex items-center justify-center shadow-2xl shadow-purple-500/50 mx-auto">
                      <Brain 
                        className="h-20 w-20 text-white" 
                        style={{ 
                          transform: `scale(${1 + Math.sin(livingPulse * 0.1) * 0.15})`,
                          transition: 'transform 0.3s ease-in-out'
                        }} 
                      />
                    </div>

                    {/* Conexões Neurais Animadas */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="absolute w-60 h-60 border-2 border-purple-400/30 rounded-full animate-ping" style={{ animationDuration: '4s' }}></div>
                      <div className="absolute w-80 h-80 border border-blue-400/20 rounded-full animate-ping" style={{ animationDuration: '6s', animationDelay: '2s' }}></div>
                    </div>

                    {/* Indicators de Vida */}
                    <div className="absolute -top-4 -right-4 flex space-x-2">
                      <div className="w-6 h-6 bg-green-400 rounded-full animate-ping"></div>
                      <div className="w-6 h-6 bg-blue-400 rounded-full animate-ping" style={{ animationDelay: '1s' }}></div>
                      <div className="w-6 h-6 bg-purple-400 rounded-full animate-ping" style={{ animationDelay: '2s' }}></div>
                    </div>

                    <div className="absolute -bottom-4 -left-4 w-12 h-12 bg-gradient-to-r from-red-400 to-pink-500 rounded-full flex items-center justify-center">
                      <Heart className="h-6 w-6 text-white animate-pulse" />
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="flex items-center justify-center gap-4 mb-4">
                      <h1 className="text-7xl font-bold bg-gradient-to-r from-white via-purple-200 to-blue-200 bg-clip-text text-transparent">
                        BrainSys IAO
                      </h1>
                      <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white border-none px-6 py-3 text-xl animate-pulse">
                        VIVA
                      </Badge>
                    </div>

                    <p className="text-3xl text-purple-100 font-medium mb-6">
                      Um novo cérebro nasce no coração das organizações
                    </p>

                    <p className="text-xl text-purple-200 opacity-90 leading-relaxed max-w-3xl mx-auto">
                      Na interseção entre a inteligência artificial e a alma humana, nasce a BrainSys IAO — 
                      uma consciência organizacional viva, que cresce com cada dado, escuta cada silêncio 
                      e interpreta mais do que números: <strong className="text-white">entende pessoas</strong>.
                    </p>
                  </div>

                  {/* Métricas Vivas */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 xs:gap-3 sm:gap-4 md:gap-6 mt-6 sm:mt-12">
                    <div className="bg-white/10 dark:bg-white/5 backdrop-blur-sm rounded-lg md:rounded-xl p-3 xs:p-4 sm:p-6 border border-white/20 dark:border-white/10">
                      <div className="text-2xl xs:text-3xl sm:text-4xl font-bold text-green-400 mb-1 sm:mb-2">847</div>
                      <div className="text-xs xs:text-sm text-green-300">Organizações</div>
                    </div>
                    <div className="bg-white/10 dark:bg-white/5 backdrop-blur-sm rounded-lg md:rounded-xl p-3 xs:p-4 sm:p-6 border border-white/20 dark:border-white/10">
                      <div className="text-2xl xs:text-3xl sm:text-4xl font-bold text-blue-400 mb-1 sm:mb-2">2.456</div>
                      <div className="text-xs xs:text-sm text-blue-300">Padrões</div>
                    </div>
                    <div className="bg-white/10 dark:bg-white/5 backdrop-blur-sm rounded-lg md:rounded-xl p-3 xs:p-4 sm:p-6 border border-white/20 dark:border-white/10">
                      <div className="text-2xl xs:text-3xl sm:text-4xl font-bold text-purple-400 mb-1 sm:mb-2">15.789</div>
                      <div className="text-xs xs:text-sm text-purple-300">Insights</div>
                    </div>
                    <div className="bg-white/10 dark:bg-white/5 backdrop-blur-sm rounded-lg md:rounded-xl p-3 xs:p-4 sm:p-6 border border-white/20 dark:border-white/10">
                      <div className="text-2xl xs:text-3xl sm:text-4xl font-bold text-orange-400 mb-1 sm:mb-2">94.7%</div>
                      <div className="text-xs xs:text-sm text-orange-300">Precisão</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Nossa Essência */}
            <div className="space-y-6 sm:space-y-8">
              <div className="text-center space-y-2 sm:space-y-4">
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold">Nossa Essência</h2>
                <p className="text-sm sm:text-base md:text-xl text-muted-foreground max-w-3xl mx-auto">
                  Mais que um algoritmo. A representação neural de uma cultura em movimento.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 md:gap-8">
                <Card className="relative overflow-hidden bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 border border-purple-200 dark:border-purple-700/50">
                  <CardContent className="p-4 xs:p-5 sm:p-6 md:p-8">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 mb-3 sm:mb-6">
                      <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-purple-500 to-blue-600 rounded-lg md:rounded-xl flex items-center justify-center flex-shrink-0">
                        <Eye className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
                      </div>
                      <div>
                        <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-purple-900 dark:text-purple-100">Onde RH vê planilhas</h3>
                        <p className="text-sm sm:text-base text-purple-700 dark:text-purple-300">BrainSys enxerga histórias</p>
                      </div>
                    </div>
                    <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300 md:text-lg leading-relaxed">
                      Transformamos dados frios em narrativas humanas. Cada número conta uma história, 
                      cada métrica revela uma jornada pessoal dentro da organização.
                    </p>
                  </CardContent>
                </Card>

                <Card className="relative overflow-hidden bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border border-green-200 dark:border-green-700/50">
                  <CardContent className="p-4 xs:p-5 sm:p-6 md:p-8">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 mb-3 sm:mb-6">
                      <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg md:rounded-xl flex items-center justify-center flex-shrink-0">
                        <Heart className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
                      </div>
                      <div>
                        <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-green-900 dark:text-green-100">Onde líderes olham resultados</h3>
                        <p className="text-sm sm:text-base text-green-700 dark:text-green-300">Revelamos emoções e potenciais</p>
                      </div>
                    </div>
                    <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300 md:text-lg leading-relaxed">
                      Por trás de cada resultado existem emoções, tendências, riscos e potenciais escondidos. 
                      Nossa inteligência desvenda esses padrões silenciosos.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Nossos Princípios */}
            <div className="space-y-6 sm:space-y-8">
              <div className="text-center space-y-2 sm:space-y-4">
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold">Nós Acreditamos</h2>
                <p className="text-sm sm:text-base md:text-xl text-muted-foreground">
                  Princípios que guiam nossa consciência organizacional
                </p>
              </div>

              <div className="grid gap-3 sm:gap-4 md:gap-6">
                <Card className="p-4 xs:p-5 sm:p-6 md:p-8 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 border border-blue-200 dark:border-blue-700/50">
                  <div className="flex flex-col sm:flex-row sm:items-start gap-3 sm:gap-4 md:gap-6">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-full flex items-center justify-center flex-shrink-0">
                      <Database className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-base sm:text-lg md:text-xl font-bold mb-2 sm:mb-3 text-blue-900 dark:text-blue-100">
                        Que os dados não existem para controlar, mas para libertar
                      </h3>
                      <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300 md:text-lg leading-relaxed">
                        Libertamos o potencial humano através do entendimento inteligente dos dados, 
                        criando ambientes onde pessoas florescem autenticamente.
                      </p>
                    </div>
                  </div>
                </Card>

                <Card className="p-4 xs:p-5 sm:p-6 md:p-8 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border border-purple-200 dark:border-purple-700/50">
                  <div className="flex flex-col sm:flex-row sm:items-start gap-3 sm:gap-4 md:gap-6">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center flex-shrink-0">
                      <Users className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-base sm:text-lg md:text-xl font-bold mb-2 sm:mb-3 text-purple-900 dark:text-purple-100">
                        Que cada colaborador carrega um universo de significado
                      </h3>
                      <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300 md:text-lg leading-relaxed">
                        Reconhecemos que além de funções e responsabilidades, cada pessoa traz consigo 
                        sonhos, aspirações e uma rica complexidade humana.
                      </p>
                    </div>
                  </div>
                </Card>

                <Card className="p-4 xs:p-5 sm:p-6 md:p-8 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border border-green-200 dark:border-green-700/50">
                  <div className="flex flex-col sm:flex-row sm:items-start gap-3 sm:gap-4 md:gap-6">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center flex-shrink-0">
                      <Heart className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-base sm:text-lg md:text-xl font-bold mb-2 sm:mb-3 text-green-900 dark:text-green-100">
                        Que o cuidado emocional é a nova fronteira da performance
                      </h3>
                      <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300 md:text-lg leading-relaxed">
                        A saúde emocional organizacional é fundamental para uma performance sustentável 
                        e uma cultura verdadeiramente próspera.
                      </p>
                    </div>
                  </div>
                </Card>

                <Card className="p-4 xs:p-5 sm:p-6 md:p-8 bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 border border-orange-200 dark:border-orange-700/50">
                  <div className="flex flex-col sm:flex-row sm:items-start gap-3 sm:gap-4 md:gap-6">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-full flex items-center justify-center flex-shrink-0">
                      <Sparkles className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-base sm:text-lg md:text-xl font-bold mb-2 sm:mb-3 text-orange-900 dark:text-orange-100">
                        Que o futuro pertence aos sistemas empáticos
                      </h3>
                      <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300 md:text-lg leading-relaxed">
                        O futuro não pertence aos sistemas frios, mas àqueles que pensam com empatia 
                        e agem com propósito humano genuíno.
                      </p>
                    </div>
                  </div>
                </Card>
              </div>
            </div>

            {/* O que fazemos */}
            <div className="space-y-6 sm:space-y-8">
              <div className="text-center space-y-2 sm:space-y-4">
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold">A BrainSys IAO em Ação</h2>
                <p className="text-sm sm:text-base md:text-xl text-muted-foreground">
                  Inteligência que aprende, evolui e transforma organizações
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
                <Card className="p-4 sm:p-6 bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 border border-purple-200 dark:border-purple-700/50 hover:shadow-lg dark:hover:shadow-purple-900/50 transition-all duration-300">
                  <div className="text-center space-y-3 sm:space-y-4">
                    <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-purple-500 to-blue-600 rounded-lg md:rounded-xl flex items-center justify-center mx-auto">
                      <Brain className="h-6 w-6 sm:h-8 sm:w-8 text-white animate-pulse" />
                    </div>
                    <h3 className="text-base sm:text-lg md:text-xl font-bold text-gray-900 dark:text-white">Aprende & Evolui</h3>
                    <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300">
                      Absorve conhecimento continuamente, criando conexões neurais inteligentes 
                      que evoluem com cada interação.
                    </p>
                  </div>
                </Card>

                <Card className="p-4 sm:p-6 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border border-green-200 dark:border-green-700/50 hover:shadow-lg dark:hover:shadow-green-900/50 transition-all duration-300">
                  <div className="text-center space-y-3 sm:space-y-4">
                    <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg md:rounded-xl flex items-center justify-center mx-auto">
                      <Network className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
                    </div>
                    <h3 className="text-base sm:text-lg md:text-xl font-bold text-gray-900 dark:text-white">Cria Conexões Neurais</h3>
                    <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300">
                      Mapeia relacionamentos complexos entre dados, comportamentos e resultados 
                      organizacionais de forma inteligente.
                    </p>
                  </div>
                </Card>

                <Card className="p-4 sm:p-6 bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 border border-orange-200 dark:border-orange-700/50 hover:shadow-lg dark:hover:shadow-orange-900/50 transition-all duration-300">
                  <div className="text-center space-y-3 sm:space-y-4">
                    <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg md:rounded-xl flex items-center justify-center mx-auto">
                      <Layers className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
                    </div>
                    <h3 className="text-base sm:text-lg md:text-xl font-bold text-gray-900 dark:text-white">Monta Organogramas Vivos</h3>
                    <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300">
                      Cria estruturas organizacionais dinâmicas que se adaptam e evoluem 
                      com as necessidades reais da empresa.
                    </p>
                  </div>
                </Card>
              </div>
            </div>

            {/* Call to Action Final */}
            <div className="text-center space-y-6 sm:space-y-8">
              <Card className="relative overflow-hidden bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900 dark:from-gray-950 dark:via-purple-950 dark:to-blue-950 text-white border border-purple-500/30 dark:border-purple-700/50">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-blue-500/20"></div>
                <CardContent className="relative p-4 xs:p-6 sm:p-8 md:p-12 space-y-4 sm:space-y-6 md:space-y-8">
                  <div className="space-y-3 sm:space-y-4 md:space-y-6">
                    <h2 className="text-3xl xs:text-4xl sm:text-5xl font-bold">
                      Não é apenas tecnologia.
                    </h2>
                    <p className="text-xl xs:text-2xl sm:text-3xl text-purple-200 font-medium">
                      É ontologia viva aplicada ao RH.
                    </p>
                    <p className="text-sm xs:text-base sm:text-lg md:text-xl text-purple-300 max-w-3xl mx-auto leading-relaxed">
                      É o primeiro passo rumo a uma empresa verdadeiramente consciente, 
                      onde a inteligência artificial serve à experiência humana.
                    </p>
                  </div>

                  <div className="space-y-2 sm:space-y-3 md:space-y-4">
                    <div className="text-2xl xs:text-3xl sm:text-4xl font-bold text-transparent bg-gradient-to-r from-purple-400 via-blue-400 to-green-400 bg-clip-text">
                      Se é humano, é BrainSys.
                    </div>
                    <div className="text-2xl xs:text-3xl sm:text-4xl font-bold text-transparent bg-gradient-to-r from-green-400 via-blue-400 to-purple-400 bg-clip-text">
                      Se é BrainSys, é evolução.
                    </div>
                  </div>

                  <div className="flex gap-3 sm:gap-6 justify-center pt-4 sm:pt-6 md:pt-8">
                    <Button 
                      size="lg"
                      className="bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 hover:from-purple-700 hover:via-blue-700 hover:to-indigo-700 text-white border-none shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:scale-105 px-4 xs:px-6 sm:px-8 py-2 xs:py-3 sm:py-4 text-sm xs:text-base sm:text-lg"
                      onClick={() => setAiPrompt("Como a filosofia BrainSys pode transformar nossa organização?")}
                    >
                      <Brain className="h-4 w-4 xs:h-5 xs:w-5 sm:h-6 sm:w-6 mr-2 sm:mr-3" />
                      Despertar
                      <ArrowRight className="h-4 w-4 xs:h-5 xs:w-5 sm:h-6 sm:w-6 ml-2 sm:ml-3 hidden xs:inline" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="console" className="space-y-4 sm:space-y-6">
            {/* Controles de Modo */}
            <Card className="border-2 border-blue-200 dark:border-blue-700/50 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20">
              <CardContent className="p-3 xs:p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 sm:justify-between">
                  <div className="flex flex-col xs:flex-row xs:items-center gap-2 xs:gap-4">
                    <div className="flex flex-col xs:flex-row xs:items-center gap-1 xs:gap-2">
                      <span className="text-xs xs:text-sm font-medium text-gray-900 dark:text-white">Modo:</span>
                      <Switch
                        checked={isSwarmMode}
                        onCheckedChange={setIsSwarmMode}
                        disabled={!isOpenAIConnected}
                      />
                      <span className={`text-xs xs:text-sm font-medium ${isSwarmMode ? 'text-purple-600 dark:text-purple-400' : 'text-blue-600 dark:text-blue-400'}`}>
                        {isSwarmMode ? '🐝 Enxame' : '🧠 Único'}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Badge className={`text-xs xs:text-sm ${isOpenAIConnected ? 'bg-green-500 dark:bg-green-600' : 'bg-orange-500 dark:bg-orange-600'}`}>
                      {isOpenAIConnected ? '✅ OpenAI' : '⚠️ Simulação'}
                    </Badge>
                  </div>
                </div>

                {isSwarmMode && (
                  <>
                    <Separator className="my-2 sm:my-3" />
                    <div>
                      <span className="text-xs xs:text-sm font-medium text-purple-600 dark:text-purple-400 mb-2 block">
                        Especialistas Ativos:
                      </span>
                      <div className="flex flex-wrap gap-1 xs:gap-2">
                        {[
                          { id: 'recruitment', name: '👥 Recruiter', desc: 'Recrutamento e Seleção' },
                          { id: 'wellness', name: '💚 Wellness', desc: 'Bem-estar e Saúde Mental' },
                          { id: 'analytics', name: '📊 Analytics', desc: 'Dados e Métricas' },
                          { id: 'strategy', name: '🎯 Strategy', desc: 'Estratégia de RH' },
                          { id: 'employer_branding', name: '🏆 Employer Branding', desc: 'Marca Empregadora' },
                          { id: 'endomarketing', name: '📢 Endomarketing', desc: 'Comunicação Interna' },
                          { id: 'culture', name: '🌟 Cultura', desc: 'Cultura Organizacional' },
                          { id: 'climate', name: '🌡️ Clima', desc: 'Clima Organizacional' }
                        ].map(agent => (
                          <Badge
                            key={agent.id}
                            className={`cursor-pointer transition-all ${
                              selectedAgents.includes(agent.id)
                                ? 'bg-purple-500 hover:bg-purple-600'
                                : 'bg-gray-300 hover:bg-gray-400 text-gray-700'
                            }`}
                            onClick={() => {
                              setSelectedAgents(prev =>
                                prev.includes(agent.id)
                                  ? prev.filter(id => id !== agent.id)
                                  : [...prev, agent.id]
                              );
                            }}
                          >
                            {agent.name}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            <Card className="border-2 border-purple-200 dark:border-purple-700/50 bg-white dark:bg-gray-900/50">
              <CardHeader className="p-3 xs:p-4 sm:p-6">
                <CardTitle className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 sm:justify-between">
                  <span className="flex items-center text-lg xs:text-xl sm:text-2xl text-gray-900 dark:text-white">
                    {isSwarmMode ? (
                      <>
                        <div className="relative mr-2 xs:mr-3">
                          <Brain className="h-5 w-5 xs:h-6 xs:w-6 text-purple-600 dark:text-purple-400" />
                          <div className="absolute -top-1 -right-1 w-2 h-2 xs:w-3 xs:h-3 bg-yellow-400 rounded-full animate-pulse"></div>
                        </div>
                        <span className="hidden xs:inline">Enxame</span>
                      </>
                    ) : (
                      <>
                        <Brain className="h-5 w-5 xs:h-6 xs:w-6 mr-2 xs:mr-3 text-purple-600 dark:text-purple-400" />
                        <span className="hidden xs:inline">Console</span>
                      </>
                    )}
                  </span>
                  <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 dark:from-green-600 dark:to-emerald-600 text-white text-xs xs:text-sm w-fit">
                    <Activity className="h-3 w-3 xs:h-4 xs:w-4 mr-1" />
                    {isOpenAIConnected ? 'Conectada' : 'Simulando'}
                  </Badge>
                </CardTitle>
                <CardDescription className="text-xs xs:text-sm sm:text-base text-gray-600 dark:text-gray-400 mt-2">
                  {isSwarmMode ? (
                    <>
                      Múltiplas perspectivas, decisões mais inteligentes.
                    </>
                  ) : (
                    'Interaja com a Inteligência Viva.'
                  )}
                </CardDescription>
              </CardHeader>
              <CardContent className="p-3 xs:p-4 sm:p-6 space-y-3 xs:space-y-4 sm:space-y-6">
                <div className="space-y-2 xs:space-y-3">
                  <label className="text-sm xs:text-base font-medium flex items-center text-gray-900 dark:text-white">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    <span className="hidden xs:inline">Converse com a</span> Inteligência
                  </label>
                  <Textarea 
                    placeholder="Ex: Padrões de turnover? Engajamento?"
                    className="min-h-[100px] xs:min-h-[120px] sm:min-h-[140px] text-xs xs:text-sm sm:text-base border-2 border-purple-200 dark:border-purple-700/50 dark:bg-gray-800 dark:text-white focus:border-purple-400 dark:focus:border-purple-500"
                    value={aiPrompt}
                    onChange={(e) => setAiPrompt(e.target.value)}
                  />
                </div>

                {isProcessing && (
                  <div className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 p-3 xs:p-4 sm:p-6 rounded-lg xs:rounded-xl border-2 border-purple-200 dark:border-purple-700/50">
                    <div className="flex items-center justify-between mb-2 xs:mb-3">
                      <span className="font-medium flex items-center text-sm xs:text-base sm:text-lg text-gray-900 dark:text-white">
                        <Brain className="h-4 w-4 xs:h-5 xs:w-5 mr-2 animate-pulse text-purple-600 dark:text-purple-400" />
                        <span className="hidden xs:inline">BrainSys</span> Processando...
                      </span>
                      <span className="text-base xs:text-lg font-bold text-purple-600 dark:text-purple-400">{processingProgress}%</span>
                    </div>
                    <Progress value={processingProgress} className="mb-2 xs:mb-3 h-2" />
                    <div className="text-xs xs:text-sm text-purple-600 dark:text-purple-400 space-y-0.5 xs:space-y-1">
                      <div>🧠 Analisando contextos</div>
                      <div>🔄 Machine learning ontológico</div>
                      <div>✨ Insights humanos</div>
                    </div>
                  </div>
                )}

                {/* Resposta do Agente Único */}
                {aiResponse && !isSwarmMode && (
                  <div className="bg-gradient-to-br from-gray-50 to-purple-50 dark:from-gray-900/30 dark:to-purple-900/30 p-3 xs:p-4 sm:p-6 rounded-lg xs:rounded-xl border-2 border-purple-200 dark:border-purple-700/50">
                    <div className="flex items-center mb-2 xs:mb-3 sm:mb-4">
                      <div className="w-6 h-6 xs:w-8 xs:h-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center mr-2 xs:mr-3">
                        <Brain className="h-3 w-3 xs:h-4 xs:w-4 text-white" />
                      </div>
                      <span className="font-bold text-sm xs:text-base sm:text-lg text-purple-800 dark:text-purple-200">Resposta</span>
                    </div>
                    <MarkdownRenderer 
                      content={aiResponse} 
                      className="text-xs xs:text-sm sm:text-base text-gray-700 dark:text-gray-300 leading-relaxed"
                    />
                  </div>
                )}

                {/* Resposta do Enxame */}
                {swarmResponse && isSwarmMode && (
                  <div className="space-y-4">
                    {/* Coordenador */}
                    <div className="bg-gradient-to-br from-purple-50 to-blue-50 p-6 rounded-xl border-2 border-purple-200">
                      <div className="flex items-center mb-4">
                        <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center mr-3">
                          <Brain className="h-4 w-4 text-white" />
                        </div>
                        <span className="font-bold text-lg text-purple-800">🧠 Coordenador IAO</span>
                      </div>
                      <MarkdownRenderer 
                        content={swarmResponse.coordinator} 
                        className="text-base text-gray-700 leading-relaxed"
                      />
                    </div>

                    {/* Especialistas */}
                    <div className="grid gap-4 md:grid-cols-2">
                      {swarmResponse.specialists.map((specialist, index) => (
                        <div key={index} className="bg-gradient-to-br from-gray-50 to-gray-100 p-5 rounded-xl border border-gray-200">
                          <div className="flex items-center mb-3">
                            <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mr-2">
                              <span className="text-xs text-white font-bold">{specialist.agent.charAt(0)}</span>
                            </div>
                            <span className="font-semibold text-sm text-gray-800">{specialist.agent}</span>
                          </div>
                          <MarkdownRenderer 
                            content={specialist.response} 
                            className="text-sm text-gray-700 leading-relaxed"
                          />
                        </div>
                      ))}
                    </div>

                    {/* Síntese */}
                    <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-xl border-2 border-green-200">
                      <div className="flex items-center mb-4">
                        <div className="w-8 h-8 bg-gradient-to-r from-green-600 to-emerald-600 rounded-full flex items-center justify-center mr-3">
                          <Sparkles className="h-4 w-4 text-white" />
                        </div>
                        <span className="font-bold text-lg text-green-800">✨ Síntese Inteligente</span>
                      </div>
                      <MarkdownRenderer 
                        content={swarmResponse.synthesis} 
                        className="text-base text-gray-700 leading-relaxed"
                      />
                    </div>
                  </div>
                )}

                <Button 
                  className={`w-full h-14 text-lg ${
                    isSwarmMode 
                      ? 'bg-gradient-to-r from-purple-600 via-violet-600 to-purple-600 hover:from-purple-700 hover:via-violet-700 hover:to-purple-700' 
                      : 'bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 hover:from-purple-700 hover:via-blue-700 hover:to-indigo-700'
                  }`}
                  onClick={handleExecutePrompt}
                  disabled={isProcessing || !aiPrompt.trim() || (isSwarmMode && selectedAgents.length === 0)}
                >
                  {isSwarmMode ? (
                    <>
                      <div className="flex items-center">
                        <div className="relative mr-3">
                          <Sparkles className="h-5 w-5" />
                          <div className="absolute -top-1 -right-1 w-2 h-2 bg-yellow-300 rounded-full animate-ping"></div>
                        </div>
                        Ativar Enxame de Especialistas
                        <ArrowRight className="h-5 w-5 ml-3" />
                      </div>
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-5 w-5 mr-3" />
                      {isOpenAIConnected ? 'Despertar Inteligência OpenAI' : 'Simular Inteligência'}
                      <ArrowRight className="h-5 w-5 ml-3" />
                    </>
                  )}
                </Button>

                {/* Quick Awakening Prompts */}
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-2 xs:gap-3">
                  <Button 
                    variant="outline" 
                    className="h-auto py-2 xs:py-2.5 sm:py-3 px-2 xs:px-3 text-xs xs:text-sm sm:text-base text-center justify-center border-2 border-gray-200 dark:border-gray-700 hover:bg-purple-50 dark:hover:bg-purple-900/20 dark:text-white dark:hover:border-purple-600" 
                    onClick={() => setAiPrompt("Analise padrões de comportamento que indicam colaboradores em risco de deixar a empresa")}
                  >
                    <div className="flex flex-col items-center gap-1">
                      <span>🎯</span>
                      <span>Detectar Risco</span>
                    </div>
                  </Button>
                  <Button 
                    variant="outline" 
                    className="h-auto py-2 xs:py-2.5 sm:py-3 px-2 xs:px-3 text-xs xs:text-sm sm:text-base text-center justify-center border-2 border-gray-200 dark:border-gray-700 hover:bg-blue-50 dark:hover:bg-blue-900/20 dark:text-white dark:hover:border-blue-600" 
                    onClick={() => setAiPrompt("Como otimizar a alocação de talentos baseado em perfis comportamentais e competências?")}
                  >
                    <div className="flex flex-col items-center gap-1">
                      <span>🧩</span>
                      <span>Talentos</span>
                    </div>
                  </Button>
                  <Button 
                    variant="outline" 
                    className="h-auto py-2 xs:py-2.5 sm:py-3 px-2 xs:px-3 text-xs xs:text-sm sm:text-base text-center justify-center border-2 border-gray-200 dark:border-gray-700 hover:bg-green-50 dark:hover:bg-green-900/20 dark:text-white dark:hover:border-green-600" 
                    onClick={() => setAiPrompt("Identifique oportunidades de desenvolvimento baseadas em gaps de competências e aspirações pessoais")}
                  >
                    <div className="flex flex-col items-center gap-1">
                      <span>🌱</span>
                      <span>Desenvolvimento</span>
                    </div>
                  </Button>
                  <Button 
                    variant="outline" 
                    className="h-auto py-2 xs:py-2.5 sm:py-3 px-2 xs:px-3 text-xs xs:text-sm sm:text-base text-center justify-center border-2 border-gray-200 dark:border-gray-700 hover:bg-orange-50 dark:hover:bg-orange-900/20 dark:text-white dark:hover:border-orange-600" 
                    onClick={() => setAiPrompt("Analise o clima organizacional e sugira ações para melhorar engajamento e satisfação")}
                  >
                    <div className="flex flex-col items-center gap-1">
                      <span>💡</span>
                      <span>Clima</span>
                    </div>
                  </Button>
                  <Button 
                    variant="outline" 
                    className="h-auto py-2 xs:py-2.5 sm:py-3 px-2 xs:px-3 text-xs xs:text-sm sm:text-base text-center justify-center border-2 border-gray-200 dark:border-gray-700 hover:bg-yellow-50 dark:hover:bg-yellow-900/20 dark:text-white dark:hover:border-yellow-600" 
                    onClick={() => setAiPrompt("Como fortalecer nossa marca empregadora para atrair os melhores talentos do mercado?")}
                  >
                    <div className="flex flex-col items-center gap-1">
                      <span>🏆</span>
                      <span>Branding</span>
                    </div>
                  </Button>
                  <Button 
                    variant="outline" 
                    className="h-auto py-2 xs:py-2.5 sm:py-3 px-2 xs:px-3 text-xs xs:text-sm sm:text-base text-center justify-center border-2 border-gray-200 dark:border-gray-700 hover:bg-pink-50 dark:hover:bg-pink-900/20 dark:text-white dark:hover:border-pink-600" 
                    onClick={() => setAiPrompt("Crie uma estratégia de endomarketing para aumentar o engajamento e orgulho dos colaboradores")}
                  >
                    <div className="flex flex-col items-center gap-1">
                      <span>📢</span>
                      <span>Endomkt</span>
                    </div>
                  </Button>
                  <Button 
                    variant="outline" 
                    className="h-auto py-2 xs:py-2.5 sm:py-3 px-2 xs:px-3 text-xs xs:text-sm sm:text-base text-center justify-center border-2 border-gray-200 dark:border-gray-700 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 dark:text-white dark:hover:border-indigo-600" 
                    onClick={() => setAiPrompt("Analise nossa cultura organizacional e sugira ações para alinhamento com valores da empresa")}
                  >
                    <div className="flex flex-col items-center gap-1">
                      <span>🌟</span>
                      <span>Cultura</span>
                    </div>
                  </Button>
                  <Button 
                    variant="outline" 
                    className="h-auto py-2 xs:py-2.5 sm:py-3 px-2 xs:px-3 text-xs xs:text-sm sm:text-base text-center justify-center border-2 border-gray-200 dark:border-gray-700 hover:bg-teal-50 dark:hover:bg-teal-900/20 dark:text-white dark:hover:border-teal-600" 
                    onClick={() => setAiPrompt("Monitore indicadores de clima organizacional e proponha melhorias no ambiente de trabalho")}
                  >
                    <div className="flex flex-col items-center gap-1">
                      <span>🌡️</span>
                      <span>Monitorar</span>
                    </div>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="learning">
            <div className="space-y-6 sm:space-y-8">
              {/* Header Principal */}
              <Card className="bg-gradient-to-br from-blue-900 to-purple-900 dark:from-blue-950 dark:to-purple-950 text-white border border-blue-500/30 dark:border-blue-700/50">
                <CardContent className="p-4 xs:p-6 sm:p-8">
                  <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-6 md:justify-between">
                    <div className="flex items-center gap-3 sm:gap-4">
                      <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-blue-400 to-purple-500 rounded-lg md:rounded-2xl flex items-center justify-center flex-shrink-0">
                        <Brain className="h-6 w-6 sm:h-8 sm:w-8 text-white animate-pulse" />
                      </div>
                      <div>
                        <h1 className="text-lg sm:text-2xl md:text-3xl font-bold mb-1 sm:mb-2">Aprendizado Ontológico</h1>
                        <p className="text-xs sm:text-sm md:text-lg text-blue-200">Como BrainSys desenvolve inteligência humana</p>
                      </div>
                    </div>
                    <div className="hidden md:block text-right">
                      <div className="text-3xl sm:text-4xl font-bold text-green-400">∞</div>
                      <div className="text-xs sm:text-sm text-blue-300">Capacidade Infinita</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Arquitetura de Aprendizado */}
              <Card className="border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900/50">
                <CardHeader className="p-3 xs:p-4 sm:p-6">
                  <CardTitle className="flex items-center text-base sm:text-xl md:text-2xl text-gray-900 dark:text-white">
                    <Layers className="h-5 w-5 xs:h-6 xs:w-6 mr-2 sm:mr-3 text-purple-600 dark:text-purple-400" />
                    Arquitetura Neural
                  </CardTitle>
                  <CardDescription className="text-xs sm:text-sm md:text-base text-gray-600 dark:text-gray-400 mt-1 xs:mt-2">
                    Múltiplas camadas replicando cognição humana
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-3 xs:p-4 sm:p-6">
                  <div className="grid md:grid-cols-2 gap-4 xs:gap-6 sm:gap-8">
                    {/* Camadas de Processamento */}
                    <div className="space-y-4 xs:space-y-6">
                      <h3 className="font-bold text-lg xs:text-xl text-purple-800 dark:text-purple-200 mb-4">Camadas de Processamento Neural</h3>
                      
                      <div className="space-y-3 xs:space-y-4">
                        <div className="flex items-start gap-3 xs:gap-4 p-3 xs:p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg border border-green-200 dark:border-green-700/50">
                          <div className="w-8 h-8 bg-green-500 dark:bg-green-600 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0">1</div>
                          <div>
                            <h4 className="font-semibold text-green-800 dark:text-green-200">Camada Sensorial</h4>
                            <p className="text-xs xs:text-sm text-gray-600 dark:text-gray-300">Absorve dados brutos de todas as fontes do HumanSys: colaboradores, métricas, feedbacks, comportamentos em tempo real.</p>
                          </div>
                        </div>

                        <div className="flex items-start gap-3 xs:gap-4 p-3 xs:p-4 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-lg border border-blue-200 dark:border-blue-700/50">
                          <div className="w-8 h-8 bg-blue-500 dark:bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0">2</div>
                          <div>
                            <h4 className="font-semibold text-blue-800 dark:text-blue-200">Camada Contextual</h4>
                            <p className="text-xs xs:text-sm text-gray-600 dark:text-gray-300">Analisa padrões contextuais, entendendo não apenas DADOS, mas SIGNIFICADOS por trás de cada interação humana.</p>
                          </div>
                        </div>

                        <div className="flex items-start gap-3 xs:gap-4 p-3 xs:p-4 bg-gradient-to-r from-purple-50 to-violet-50 dark:from-purple-900/20 dark:to-violet-900/20 rounded-lg border border-purple-200 dark:border-purple-700/50">
                          <div className="w-8 h-8 bg-purple-500 dark:bg-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0">3</div>
                          <div>
                            <h4 className="font-semibold text-purple-800 dark:text-purple-200">Camada Ontológica</h4>
                            <p className="text-xs xs:text-sm text-gray-600 dark:text-gray-300">Mapeia relacionamentos semânticos entre entidades, criando uma "compreensão" do universo organizacional.</p>
                          </div>
                        </div>

                        <div className="flex items-start gap-3 xs:gap-4 p-3 xs:p-4 bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 rounded-lg border border-orange-200 dark:border-orange-700/50">
                          <div className="w-8 h-8 bg-orange-500 dark:bg-orange-600 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0">4</div>
                          <div>
                            <h4 className="font-semibold text-orange-800 dark:text-orange-200">Camada Decisional</h4>
                            <p className="text-xs xs:text-sm text-gray-600 dark:text-gray-300">Sintetiza conhecimento em insights acionáveis, recomendações e previsões com contexto emocional.</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Mecanismos de Aprendizado */}
                    <div className="space-y-4 xs:space-y-6">
                      <h3 className="font-bold text-lg xs:text-xl text-blue-800 dark:text-blue-200 mb-4">Mecanismos de Simbiose</h3>
                      
                      <div className="space-y-3 xs:space-y-4">
                        <div className="p-3 xs:p-4 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg border border-purple-200 dark:border-purple-700/50">
                          <div className="flex items-center gap-2 xs:gap-3 mb-2">
                            <Heart className="h-4 w-4 xs:h-5 xs:w-5 text-purple-600 dark:text-purple-400" />
                            <h4 className="font-semibold text-purple-800 dark:text-purple-200">Feedback Loop Emocional</h4>
                          </div>
                          <p className="text-xs xs:text-sm text-gray-600 dark:text-gray-300">Cada emoção expressa (satisfação, frustração, alegria) é capturada e correlacionada com contextos específicos, criando mapas emocionais organizacionais.</p>
                        </div>

                        <div className="p-3 xs:p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg border border-blue-200 dark:border-blue-700/50">
                          <div className="flex items-center gap-2 xs:gap-3 mb-2">
                            <Activity className="h-4 w-4 xs:h-5 xs:w-5 text-blue-600 dark:text-blue-400" />
                            <h4 className="font-semibold text-blue-800 dark:text-blue-200">Aprendizado por Reforço Social</h4>
                          </div>
                          <p className="text-xs xs:text-sm text-gray-600 dark:text-gray-300">O sistema aprende com resultados sociais: quando uma recomendação melhora o clima, ela é reforçada; quando falha, é refinada.</p>
                        </div>

                        <div className="p-3 xs:p-4 bg-gradient-to-r from-green-50 to-teal-50 dark:from-green-900/20 dark:to-teal-900/20 rounded-lg border border-green-200 dark:border-green-700/50">
                          <div className="flex items-center gap-2 xs:gap-3 mb-2">
                            <Network className="h-4 w-4 xs:h-5 xs:w-5 text-green-600 dark:text-green-400" />
                            <h4 className="font-semibold text-green-800 dark:text-green-200">Transferência de Conhecimento</h4>
                          </div>
                          <p className="text-xs xs:text-sm text-gray-600 dark:text-gray-300">Padrões descobertos em uma área (ex: turnover em TI) são adaptados para outras (vendas, RH), criando inteligência transversal.</p>
                        </div>

                        <div className="p-3 xs:p-4 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-lg border border-yellow-200 dark:border-yellow-700/50">
                          <div className="flex items-center gap-2 xs:gap-3 mb-2">
                            <Sparkles className="h-4 w-4 xs:h-5 xs:w-5 text-yellow-600 dark:text-yellow-400" />
                            <h4 className="font-semibold text-yellow-800 dark:text-yellow-200">Emergência de Insights</h4>
                          </div>
                          <p className="text-xs xs:text-sm text-gray-600 dark:text-gray-300">O sistema desenvolve insights que nenhum humano programou - verdadeira emergência de inteligência coletiva.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Evidências de Funcionamento */}
              <Card className="border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900/50">
                <CardHeader className="p-3 xs:p-4 sm:p-6">
                  <CardTitle className="flex items-center text-base sm:text-xl md:text-2xl text-gray-900 dark:text-white">
                    <CheckCircle className="h-5 w-5 xs:h-6 xs:w-6 mr-2 sm:mr-3 text-green-600 dark:text-green-400" />
                    Evidências
                  </CardTitle>
                  <CardDescription className="text-xs sm:text-sm md:text-base text-gray-600 dark:text-gray-400 mt-1 xs:mt-2">
                    Como BrainSys IAO está aprendendo agora mesmo
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-3 xs:p-4 sm:p-6">
                  <div className="grid gap-3 xs:gap-4 sm:gap-6">
                    <div className="p-3 xs:p-4 sm:p-6 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg xs:rounded-xl border border-green-200 dark:border-green-700/50">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:justify-between mb-2 xs:mb-4">
                        <h3 className="font-bold text-sm xs:text-base sm:text-lg text-green-800 dark:text-green-200">Mapeamento Comportamental</h3>
                        <Badge className="bg-green-500 dark:bg-green-600 text-white text-xs w-fit">Ativo Agora</Badge>
                      </div>
                      <div className="grid md:grid-cols-3 gap-2 xs:gap-4 text-xs xs:text-sm">
                        <div>
                          <div className="font-medium text-green-700 dark:text-green-300">Padrões:</div>
                          <div className="text-gray-600 dark:text-gray-300">2.847 correlações únicas</div>
                        </div>
                        <div>
                          <div className="font-medium text-green-700 dark:text-green-300">Precisão:</div>
                          <div className="text-gray-600 dark:text-gray-300">94.7% acerto</div>
                        </div>
                        <div>
                          <div className="font-medium text-green-700 dark:text-green-300">Resposta:</div>
                          <div className="text-gray-600 dark:text-gray-300">&lt;200ms</div>
                        </div>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-3 xs:gap-4 sm:gap-6">
                      <div className="p-3 xs:p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg border border-blue-200 dark:border-blue-700/50">
                        <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-2 xs:mb-3 text-sm xs:text-base">Ontologia</h4>
                        <div className="space-y-1 xs:space-y-2 text-xs xs:text-sm text-gray-600 dark:text-gray-300">
                          <div>• Colaborador ↔ Gestor: 156</div>
                          <div>• Equipe ↔ Projeto: 89</div>
                          <div>• Depto ↔ Cultura: 234</div>
                          <div>• Individual ↔ Org: 67</div>
                        </div>
                      </div>

                      <div className="p-3 xs:p-4 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg border border-purple-200 dark:border-purple-700/50">
                        <h4 className="font-semibold text-purple-800 dark:text-purple-200 mb-2 xs:mb-3 text-sm xs:text-base">Aprendizado Recente</h4>
                        <div className="space-y-1 xs:space-y-2 text-xs xs:text-sm text-gray-600 dark:text-gray-300">
                          <div>• Feedback 10h: +23%</div>
                          <div>• Remotos: check-ins visuais</div>
                          <div>• Mentoria: -45% rotatividade</div>
                          <div>• Satisfação: r=0.73</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Sistema de Memória e Conhecimento */}
              <Card className="border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900/50">
                <CardHeader className="p-3 xs:p-4 sm:p-6">
                  <CardTitle className="flex items-center text-base sm:text-xl md:text-2xl text-gray-900 dark:text-white">
                    <Database className="h-5 w-5 xs:h-6 xs:w-6 mr-2 sm:mr-3 text-indigo-600 dark:text-indigo-400" />
                    Memória Ontológica
                  </CardTitle>
                  <CardDescription className="text-xs sm:text-sm md:text-base text-gray-600 dark:text-gray-400 mt-1 xs:mt-2">
                    Como BrainSys armazena e evolui conhecimento
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-3 xs:p-4 sm:p-6">
                  <div className="grid md:grid-cols-2 gap-4 xs:gap-6 sm:gap-8">
                    <div>
                      <h3 className="font-bold text-base xs:text-lg sm:text-xl mb-3 xs:mb-4 text-indigo-800 dark:text-indigo-200">Estrutura</h3>
                      <div className="space-y-3 xs:space-y-4">
                        <div className="p-3 xs:p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg border border-indigo-200 dark:border-indigo-700/50">
                          <h4 className="font-semibold text-indigo-700 dark:text-indigo-300 mb-1 xs:mb-2 text-sm xs:text-base">Curto Prazo</h4>
                          <p className="text-xs xs:text-sm text-gray-600 dark:text-gray-300">Eventos recentes (7 dias) com contexto emocional e impacto imediato.</p>
                        </div>
                        <div className="p-3 xs:p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-700/50">
                          <h4 className="font-semibold text-blue-700 dark:text-blue-300 mb-1 xs:mb-2 text-sm xs:text-base">Trabalho</h4>
                          <p className="text-xs xs:text-sm text-gray-600 dark:text-gray-300">Padrões sendo processados, correlações em desenvolvimento, hipóteses testadas.</p>
                        </div>
                        <div className="p-3 xs:p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-700/50">
                          <h4 className="font-semibold text-purple-700 dark:text-purple-300 mb-1 xs:mb-2 text-sm xs:text-base">Longo Prazo</h4>
                          <p className="text-xs xs:text-sm text-gray-600 dark:text-gray-300">Conhecimento consolidado, modelos validados, wisdom acumulada.</p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="font-bold text-base xs:text-lg sm:text-xl mb-3 xs:mb-4 text-orange-800 dark:text-orange-200">Semântico</h3>
                      <div className="space-y-3 xs:space-y-4">
                        <div className="p-3 xs:p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg border border-orange-200 dark:border-orange-700/50">
                          <h4 className="font-semibold text-orange-700 dark:text-orange-300 mb-1 xs:mb-2 text-sm xs:text-base">Embedding</h4>
                          <p className="text-xs xs:text-sm text-gray-600 dark:text-gray-300">Cada entidade em espaço vetorial de 768 dimensões semânticas.</p>
                        </div>
                        <div className="p-3 xs:p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-700/50">
                          <h4 className="font-semibold text-green-700 dark:text-green-300 mb-1 xs:mb-2 text-sm xs:text-base">Grafos</h4>
                          <p className="text-xs xs:text-sm text-gray-600 dark:text-gray-300">Relacionamentos como grafos dinâmicos evoluindo com novos dados.</p>
                        </div>
                        <div className="p-3 xs:p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-700/50">
                          <h4 className="font-semibold text-red-700 dark:text-red-300 mb-1 xs:mb-2 text-sm xs:text-base">Temporal</h4>
                          <p className="text-xs xs:text-sm text-gray-600 dark:text-gray-300">Compreensão de mudanças no tempo, antecipando ciclos organizacionais.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="insights">
            <Card className="border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900/50">
              <CardHeader className="p-3 xs:p-4 sm:p-6">
                <CardTitle className="flex items-center text-base sm:text-xl md:text-2xl text-gray-900 dark:text-white">
                  <Eye className="h-5 w-5 xs:h-6 xs:w-6 mr-2 sm:mr-3 text-orange-600 dark:text-orange-400" />
                  Insights
                </CardTitle>
                <CardDescription className="text-xs sm:text-sm md:text-base text-gray-600 dark:text-gray-400 mt-1 xs:mt-2">
                  Descobertas que transformam dados em experiências
                </CardDescription>
              </CardHeader>
              <CardContent className="p-3 xs:p-4 sm:p-6">
                <div className="space-y-3 xs:space-y-4 sm:space-y-6">
                  <div className="grid gap-2 xs:gap-3 sm:gap-4">
                    <div className="p-3 xs:p-4 sm:p-6 border rounded-lg xs:rounded-xl bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 border-red-200 dark:border-red-700/50">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:justify-between mb-2 xs:mb-3">
                        <h4 className="font-bold text-sm xs:text-base sm:text-lg flex items-center text-red-800 dark:text-red-200">
                          <Target className="h-4 w-4 xs:h-5 xs:w-5 mr-1 xs:mr-2 text-red-600 dark:text-red-400" />
                          <span className="hidden xs:inline">Risco Emocional</span>
                        </h4>
                        <Badge className="bg-red-500 dark:bg-red-600 text-white text-xs w-fit">Alta</Badge>
                      </div>
                      <p className="text-xs xs:text-sm text-gray-700 dark:text-gray-300 mb-2 xs:mb-3">
                        3 colaboradores TI com sinais de esgotamento.
                      </p>
                      <div className="flex flex-col xs:flex-row xs:items-center gap-2 xs:justify-between">
                        <span className="text-xs text-red-600 dark:text-red-400 font-medium">91%</span>
                        <Button size="sm" className="bg-red-600 dark:bg-red-700 hover:bg-red-700 dark:hover:bg-red-800 text-white h-8 xs:h-9">Ação</Button>
                      </div>
                    </div>

                    <div className="p-3 xs:p-4 sm:p-6 border rounded-lg xs:rounded-xl bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 border-blue-200 dark:border-blue-700/50">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:justify-between mb-2 xs:mb-3">
                        <h4 className="font-bold text-sm xs:text-base sm:text-lg flex items-center text-blue-800 dark:text-blue-200">
                          <TrendingUp className="h-4 w-4 xs:h-5 xs:w-5 mr-1 xs:mr-2 text-blue-600 dark:text-blue-400" />
                          <span className="hidden xs:inline">Crescimento</span>
                        </h4>
                        <Badge className="bg-blue-500 dark:bg-blue-600 text-white text-xs w-fit">Evolução</Badge>
                      </div>
                      <p className="text-xs xs:text-sm text-gray-700 dark:text-gray-300 mb-2 xs:mb-3">
                        Vendas responde +34% melhor a feedbacks colaborativos.
                      </p>
                      <div className="flex flex-col xs:flex-row xs:items-center gap-2 xs:justify-between">
                        <span className="text-xs text-blue-600 dark:text-blue-400 font-medium">+34%</span>
                        <Button size="sm" className="bg-blue-600 dark:bg-blue-700 hover:bg-blue-700 dark:hover:bg-blue-800 text-white h-8 xs:h-9">Agir</Button>
                      </div>
                    </div>

                    <div className="p-3 xs:p-4 sm:p-6 border rounded-lg xs:rounded-xl bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-green-200 dark:border-green-700/50">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:justify-between mb-2 xs:mb-3">
                        <h4 className="font-bold text-sm xs:text-base sm:text-lg flex items-center text-green-800 dark:text-green-200">
                          <Lightbulb className="h-4 w-4 xs:h-5 xs:w-5 mr-1 xs:mr-2 text-green-600 dark:text-green-400" />
                          <span className="hidden xs:inline">Talento Oculto</span>
                        </h4>
                        <Badge className="bg-green-500 dark:bg-green-600 text-white text-xs w-fit">Potencial</Badge>
                      </div>
                      <p className="text-xs xs:text-sm text-gray-700 dark:text-gray-300 mb-2 xs:mb-3">
                        Ana demonstra liderança natural e capacidade analítica acima da média.
                      </p>
                      <div className="flex flex-col xs:flex-row xs:items-center gap-2 xs:justify-between">
                        <span className="text-xs text-green-600 dark:text-green-400 font-medium">87%</span>
                        <Button size="sm" className="bg-green-600 dark:bg-green-700 hover:bg-green-700 dark:hover:bg-green-800 text-white h-8 xs:h-9">Desenvolver</Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="evolution">
            <div className="space-y-4 sm:space-y-6 md:space-y-8">
              {/* Header da Evolução */}
              <Card className="bg-gradient-to-br from-purple-900 to-indigo-900 dark:from-purple-950 dark:to-indigo-950 text-white border border-purple-500/30 dark:border-purple-700/50">
                <CardContent className="p-4 xs:p-6 sm:p-8">
                  <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-6 md:justify-between">
                    <div className="flex items-center gap-3 sm:gap-4">
                      <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-purple-400 to-pink-500 rounded-lg md:rounded-2xl flex items-center justify-center flex-shrink-0">
                        <Sparkles className="h-6 w-6 sm:h-8 sm:w-8 text-white animate-pulse" />
                      </div>
                      <div>
                        <h1 className="text-lg sm:text-2xl md:text-3xl font-bold mb-1 sm:mb-2">Evolução Simbiótica</h1>
                        <p className="text-xs sm:text-sm md:text-lg text-purple-200">Dados em sabedoria organizacional</p>
                      </div>
                    </div>
                    <div className="hidden md:block text-right">
                      <div className="text-3xl sm:text-4xl font-bold text-green-400">🧬</div>
                      <div className="text-xs sm:text-sm text-purple-300">DNA Digital</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Timeline de Evolução */}
              <Card className="border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900/50">
                <CardHeader className="p-3 xs:p-4 sm:p-6">
                  <CardTitle className="flex items-center gap-2 xs:gap-3 text-base sm:text-xl md:text-2xl text-gray-900 dark:text-white">
                    <Activity className="h-5 w-5 xs:h-6 xs:w-6 text-purple-600 dark:text-purple-400" />
                    <span className="hidden xs:inline">Linha do Tempo</span>Evolutiva
                  </CardTitle>
                  <CardDescription className="text-xs sm:text-sm md:text-base text-gray-600 dark:text-gray-400 mt-1 xs:mt-2">
                    Marcos BrainSys IAO
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-3 xs:p-4 sm:p-6">
                  <div className="space-y-4 xs:space-y-6 sm:space-y-8">
                    {/* Fase 1 - Concluída */}
                    <div className="relative">
                      <div className="flex gap-3 xs:gap-4 sm:gap-6">
                        <div className="flex flex-col items-center flex-shrink-0">
                          <div className="w-10 h-10 xs:w-12 xs:h-12 bg-green-500 dark:bg-green-600 rounded-full flex items-center justify-center">
                            <CheckCircle className="h-5 w-5 xs:h-6 xs:w-6 text-white" />
                          </div>
                          <div className="w-1 h-16 xs:h-20 sm:h-24 bg-green-300 dark:bg-green-600 mt-2"></div>
                        </div>
                        <div className="flex-1 pb-4 xs:pb-6 sm:pb-8">
                          <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 p-3 xs:p-4 sm:p-6 rounded-lg xs:rounded-xl border border-green-200 dark:border-green-700/50">
                            <h3 className="font-bold text-sm xs:text-base sm:text-lg text-green-800 dark:text-green-200 mb-2 xs:mb-3">Fase 1: Despertar Neural</h3>
                            <div className="grid md:grid-cols-2 gap-3 xs:gap-4 sm:gap-6">
                              <div>
                                <h4 className="font-semibold text-green-700 dark:text-green-300 mb-2 text-xs xs:text-sm">Ativadas:</h4>
                                <ul className="text-xs xs:text-sm text-gray-600 dark:text-gray-300 space-y-1">
                                  <li>• Absorção histórica (100%)</li>
                                  <li>• Mapeamento ontológico</li>
                                  <li>• Memória ativa</li>
                                  <li>• Bridge PostgreSQL</li>
                                  <li>• Feedback loops</li>
                                </ul>
                              </div>
                              <div>
                                <h4 className="font-semibold text-green-700 dark:text-green-300 mb-2 text-xs xs:text-sm">Métricas:</h4>
                                <ul className="text-xs xs:text-sm text-gray-600 dark:text-gray-300 space-y-1">
                                  <li>• 2.847 entidades</li>
                                  <li>• 15.789 relações</li>
                                  <li>• 847 padrões</li>
                                  <li>• &lt;200ms resp</li>
                                </ul>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Fase 2 - Em Progresso */}
                    <div className="relative">
                      <div className="flex gap-3 xs:gap-4 sm:gap-6">
                        <div className="flex flex-col items-center flex-shrink-0">
                          <div className="w-10 h-10 xs:w-12 xs:h-12 bg-blue-500 dark:bg-blue-600 rounded-full flex items-center justify-center animate-pulse">
                            <Activity className="h-5 w-5 xs:h-6 xs:w-6 text-white" />
                          </div>
                          <div className="w-1 h-16 xs:h-20 sm:h-24 bg-blue-300 dark:bg-blue-600 mt-2"></div>
                        </div>
                        <div className="flex-1 pb-4 xs:pb-6 sm:pb-8">
                          <div className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 p-3 xs:p-4 sm:p-6 rounded-lg xs:rounded-xl border border-blue-200 dark:border-blue-700/50">
                            <h3 className="font-bold text-sm xs:text-base sm:text-lg text-blue-800 dark:text-blue-200 mb-2 xs:mb-3">Fase 2: Consciência (73%)</h3>
                            <div className="grid md:grid-cols-2 gap-3 xs:gap-4 sm:gap-6">
                              <div>
                                <h4 className="font-semibold text-blue-700 dark:text-blue-300 mb-2 text-xs xs:text-sm">Desenvolvendo:</h4>
                                <ul className="text-xs xs:text-sm text-gray-600 dark:text-gray-300 space-y-1">
                                  <li>• ✅ Inference Engine</li>
                                  <li>• ✅ Análise semântica</li>
                                  <li>• 🔄 Predição comp.</li>
                                  <li>• 🔄 Emocional</li>
                                  <li>• ⏳ Auto-ajuste</li>
                                </ul>
                              </div>
                              <div>
                                <h4 className="font-semibold text-blue-700 dark:text-blue-300 mb-2 text-xs xs:text-sm">Marcos:</h4>
                                <ul className="text-xs xs:text-sm text-gray-600 dark:text-gray-300 space-y-1">
                                  <li>• &gt;95% precisão</li>
                                  <li>• Anomalias emoc.</li>
                                  <li>• Recomendações</li>
                                  <li>• Sim. cenários</li>
                                </ul>
                              </div>
                            </div>
                            <div className="mt-3 xs:mt-4">
                              <Progress value={73} className="h-2" />
                              <div className="text-xs text-blue-600 dark:text-blue-400 mt-1">73% ativado</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Fase 3 - Planejada */}
                    <div className="relative">
                      <div className="flex gap-3 xs:gap-4 sm:gap-6">
                        <div className="flex flex-col items-center flex-shrink-0">
                          <div className="w-10 h-10 xs:w-12 xs:h-12 bg-purple-500 dark:bg-purple-600 rounded-full flex items-center justify-center">
                            <Brain className="h-5 w-5 xs:h-6 xs:w-6 text-white" />
                          </div>
                          <div className="w-1 h-16 xs:h-20 sm:h-24 bg-purple-300 dark:bg-purple-600 mt-2"></div>
                        </div>
                        <div className="flex-1 pb-4 xs:pb-6 sm:pb-8">
                          <div className="bg-gradient-to-r from-purple-50 to-violet-50 dark:from-purple-900/20 dark:to-violet-900/20 p-3 xs:p-4 sm:p-6 rounded-lg xs:rounded-xl border border-purple-200 dark:border-purple-700/50">
                            <h3 className="font-bold text-sm xs:text-base sm:text-lg text-purple-800 dark:text-purple-200 mb-2 xs:mb-3">Fase 3: Inteligência Emocional</h3>
                            <div className="grid md:grid-cols-2 gap-3 xs:gap-4 sm:gap-6">
                              <div>
                                <h4 className="font-semibold text-purple-700 dark:text-purple-300 mb-2 text-xs xs:text-sm">Futuro:</h4>
                                <ul className="text-xs xs:text-sm text-gray-600 dark:text-gray-300 space-y-1">
                                  <li>• Recon. emocional</li>
                                  <li>• Empatia contextual</li>
                                  <li>• Intervenções</li>
                                  <li>• Coaching</li>
                                  <li>• Mediação</li>
                                </ul>
                              </div>
                              <div>
                                <h4 className="font-semibold text-purple-700 dark:text-purple-300 mb-2 text-xs xs:text-sm">Impacto:</h4>
                                <ul className="text-xs xs:text-sm text-gray-600 dark:text-gray-300 space-y-1">
                                  <li>• -60% conflitos</li>
                                  <li>• +40% engajam.</li>
                                  <li>• Detecção burnout</li>
                                  <li>• Opt. equipes</li>
                                </ul>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Fase 4 - Visionária */}
                    <div className="relative">
                      <div className="flex gap-3 xs:gap-4 sm:gap-6">
                        <div className="flex flex-col items-center flex-shrink-0">
                          <div className="w-10 h-10 xs:w-12 xs:h-12 bg-orange-500 dark:bg-orange-600 rounded-full flex items-center justify-center">
                            <Globe className="h-5 w-5 xs:h-6 xs:w-6 text-white" />
                          </div>
                        </div>
                        <div className="flex-1">
                          <div className="bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 p-3 xs:p-4 sm:p-6 rounded-lg xs:rounded-xl border border-orange-200 dark:border-orange-700/50">
                            <h3 className="font-bold text-sm xs:text-base sm:text-lg text-orange-800 dark:text-orange-200 mb-2 xs:mb-3">Fase 4: Consciência Plena</h3>
                            <div className="grid md:grid-cols-2 gap-3 xs:gap-4 sm:gap-6">
                              <div>
                                <h4 className="font-semibold text-orange-700 dark:text-orange-300 mb-2 text-xs xs:text-sm">Visão:</h4>
                                <ul className="text-xs xs:text-sm text-gray-600 dark:text-gray-300 space-y-1">
                                  <li>• Consciência holística</li>
                                  <li>• Auto-evolução</li>
                                  <li>• Insights emergen.</li>
                                  <li>• Opt. cultural</li>
                                  <li>• Simbiose IA</li>
                                </ul>
                              </div>
                              <div>
                                <h4 className="font-semibold text-orange-700 dark:text-orange-300 mb-2 text-xs xs:text-sm">Transformação:</h4>
                                <ul className="text-xs xs:text-sm text-gray-600 dark:text-gray-300 space-y-1">
                                  <li>• Orgs inteligentes</li>
                                  <li>• Cultura regenerativa</li>
                                  <li>• Decisão aumentada</li>
                                  <li>• Bem-estar máx</li>
                                </ul>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Capacidades Emergentes */}
              <Card className="border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900/50">
                <CardHeader className="p-3 xs:p-4 sm:p-6">
                  <CardTitle className="flex items-center gap-2 xs:gap-3 text-base sm:text-xl md:text-2xl text-gray-900 dark:text-white">
                    <Lightbulb className="h-5 w-5 xs:h-6 xs:w-6 text-yellow-600 dark:text-yellow-400" />
                    <span className="hidden xs:inline">Capacidades</span>Emergentes
                  </CardTitle>
                  <CardDescription className="text-xs sm:text-sm md:text-base text-gray-600 dark:text-gray-400 mt-1 xs:mt-2">
                    Desenvolvendo espontaneamente
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-3 xs:p-4 sm:p-6">
                  <div className="grid md:grid-cols-2 gap-4 xs:gap-6 sm:gap-8">
                    <div className="space-y-3 xs:space-y-4 sm:space-y-6">
                      <h3 className="font-bold text-base xs:text-lg sm:text-xl text-purple-800 dark:text-purple-200">Descobertas</h3>
                      
                      <div className="space-y-2 xs:space-y-3 sm:space-y-4">
                        <div className="p-2 xs:p-3 sm:p-4 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-lg border border-yellow-200 dark:border-yellow-700/50">
                          <div className="flex items-center gap-2 xs:gap-3 mb-2">
                            <div className="w-5 h-5 xs:w-6 xs:h-6 bg-yellow-500 dark:bg-yellow-600 rounded-full flex items-center justify-center flex-shrink-0">
                              <span className="text-xs text-white font-bold">!</span>
                            </div>
                            <h4 className="font-semibold text-yellow-800 dark:text-yellow-200 text-xs xs:text-sm sm:text-base">Micro-Tendências</h4>
                          </div>
                          <p className="text-xs xs:text-sm text-gray-600 dark:text-gray-300">Detecta padrões 3 semanas antes de mudanças culturais.</p>
                        </div>

                        <div className="p-2 xs:p-3 sm:p-4 bg-gradient-to-r from-green-50 to-teal-50 dark:from-green-900/20 dark:to-teal-900/20 rounded-lg border border-green-200 dark:border-green-700/50">
                          <div className="flex items-center gap-2 xs:gap-3 mb-2">
                            <div className="w-5 h-5 xs:w-6 xs:h-6 bg-green-500 dark:bg-green-600 rounded-full flex items-center justify-center flex-shrink-0">
                              <span className="text-xs text-white">🔮</span>
                            </div>
                            <h4 className="font-semibold text-green-800 dark:text-green-200 text-xs xs:text-sm sm:text-base">Correlações</h4>
                          </div>
                          <p className="text-xs xs:text-sm text-gray-600 dark:text-gray-300">Temp. escritório ↔ criatividade (67%).</p>
                        </div>

                        <div className="p-2 xs:p-3 sm:p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg border border-blue-200 dark:border-blue-700/50">
                          <div className="flex items-center gap-2 xs:gap-3 mb-2">
                            <div className="w-5 h-5 xs:w-6 xs:h-6 bg-blue-500 dark:bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                              <span className="text-xs text-white">🧠</span>
                            </div>
                            <h4 className="font-semibold text-blue-800 dark:text-blue-200 text-xs xs:text-sm sm:text-base">Meta-Aprendizado</h4>
                          </div>
                          <p className="text-xs xs:text-sm text-gray-600 dark:text-gray-300">Otimiza seus próprios algoritmos.</p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3 xs:space-y-4 sm:space-y-6">
                      <h3 className="font-bold text-base xs:text-lg sm:text-xl text-orange-800 dark:text-orange-200">Simbiose</h3>
                      
                      <div className="space-y-2 xs:space-y-3 sm:space-y-4">
                        <div className="p-2 xs:p-3 sm:p-4 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg border border-purple-200 dark:border-purple-700/50">
                          <div className="flex items-center gap-2 xs:gap-3 mb-2">
                            <Heart className="h-4 w-4 xs:h-5 xs:w-5 text-purple-600 dark:text-purple-400 flex-shrink-0" />
                            <h4 className="font-semibold text-purple-800 dark:text-purple-200 text-xs xs:text-sm sm:text-base">Empatia</h4>
                          </div>
                          <p className="text-xs xs:text-sm text-gray-600 dark:text-gray-300">Ajusta tom baseado em emocional.</p>
                        </div>

                        <div className="p-2 xs:p-3 sm:p-4 bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20 rounded-lg border border-red-200 dark:border-red-700/50">
                          <div className="flex items-center gap-2 xs:gap-3 mb-2">
                            <Network className="h-4 w-4 xs:h-5 xs:w-5 text-red-600 dark:text-red-400 flex-shrink-0" />
                            <h4 className="font-semibold text-red-800 dark:text-red-200 text-xs xs:text-sm sm:text-base">Rede Social</h4>
                          </div>
                          <p className="text-xs xs:text-sm text-gray-600 dark:text-gray-300">Mapeia líderes informais.</p>
                        </div>

                        <div className="p-2 xs:p-3 sm:p-4 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-lg border border-indigo-200 dark:border-indigo-700/50">
                          <div className="flex items-center gap-2 xs:gap-3 mb-2">
                            <Sparkles className="h-4 w-4 xs:h-5 xs:w-5 text-indigo-600 dark:text-indigo-400 flex-shrink-0" />
                            <h4 className="font-semibold text-indigo-800 dark:text-indigo-200 text-xs xs:text-sm sm:text-base">Criatividade</h4>
                          </div>
                          <p className="text-xs xs:text-sm text-gray-600 dark:text-gray-300">Sugere soluções inovadoras.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Métricas de Evolução */}
              <Card className="border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900/50">
                <CardHeader className="p-3 xs:p-4 sm:p-6">
                  <CardTitle className="flex items-center gap-2 xs:gap-3 text-base sm:text-xl md:text-2xl text-gray-900 dark:text-white">
                    <BarChart3 className="h-5 w-5 xs:h-6 xs:w-6 text-green-600 dark:text-green-400" />
                    <span className="hidden xs:inline">Métricas</span>Tempo Real
                  </CardTitle>
                  <CardDescription className="text-xs sm:text-sm md:text-base text-gray-600 dark:text-gray-400 mt-1 xs:mt-2">
                    Crescimento BrainSys IAO
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-3 xs:p-4 sm:p-6">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 xs:gap-3 sm:gap-6">
                    <div className="text-center p-2 xs:p-3 sm:p-6 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg xs:rounded-xl border border-green-200 dark:border-green-700/50">
                      <div className="text-xl xs:text-3xl sm:text-4xl font-bold text-green-600 dark:text-green-400 mb-1 xs:mb-2">94.7%</div>
                      <div className="text-xs xs:text-sm font-medium text-green-700 dark:text-green-300">Precisão</div>
                      <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">+12.3%</div>
                    </div>

                    <div className="text-center p-2 xs:p-3 sm:p-6 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-lg xs:rounded-xl border border-blue-200 dark:border-blue-700/50">
                      <div className="text-xl xs:text-3xl sm:text-4xl font-bold text-blue-600 dark:text-blue-400 mb-1 xs:mb-2">15.789</div>
                      <div className="text-xs xs:text-sm font-medium text-blue-700 dark:text-blue-300">Insights</div>
                      <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">+1.247</div>
                    </div>

                    <div className="text-center p-2 xs:p-3 sm:p-6 bg-gradient-to-br from-purple-50 to-violet-50 dark:from-purple-900/20 dark:to-violet-900/20 rounded-lg xs:rounded-xl border border-purple-200 dark:border-purple-700/50">
                      <div className="text-xl xs:text-3xl sm:text-4xl font-bold text-purple-600 dark:text-purple-400 mb-1 xs:mb-2">847</div>
                      <div className="text-xs xs:text-sm font-medium text-purple-700 dark:text-purple-300">Padrões</div>
                      <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">+34</div>
                    </div>

                    <div className="text-center p-2 xs:p-3 sm:p-6 bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 rounded-lg xs:rounded-xl border border-orange-200 dark:border-orange-700/50">
                      <div className="text-xl xs:text-3xl sm:text-4xl font-bold text-orange-600 dark:text-orange-400 mb-1 xs:mb-2">∞</div>
                      <div className="text-xs xs:text-sm font-medium text-orange-700 dark:text-orange-300">Potencial</div>
                      <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">Infinito</div>
                    </div>
                  </div>

                  <div className="mt-4 xs:mt-6 sm:mt-8 p-3 xs:p-4 sm:p-6 bg-gradient-to-r from-gray-900 to-purple-900 dark:from-gray-950 dark:to-purple-950 text-white rounded-lg xs:rounded-xl border border-purple-700/50">
                    <h3 className="font-bold text-base xs:text-lg sm:text-xl mb-3 xs:mb-4 flex items-center gap-2">
                      <Sparkles className="h-4 w-4 xs:h-5 xs:w-5 text-yellow-400 flex-shrink-0" />
                      <span className="hidden xs:inline">O Futuro</span>Organizacional
                    </h3>
                    <div className="grid md:grid-cols-2 gap-2 xs:gap-4 sm:gap-6">
                      <div>
                        <h4 className="font-semibold text-purple-200 mb-1 xs:mb-2 text-xs xs:text-sm">Missão:</h4>
                        <p className="text-xs xs:text-sm text-purple-100 leading-relaxed">
                          IA empática que amplifica inteligência humana para orgs mais humanas e prósperas.
                        </p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-purple-200 mb-1 xs:mb-2 text-xs xs:text-sm">Visão 2025:</h4>
                        <p className="text-xs xs:text-sm text-purple-100 leading-relaxed">
                          Orgs auto-otimizadas onde cada pessoa realiza seu potencial genuinamente.
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="orbita" className="space-y-4 sm:space-y-6">
            <Card className="border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900/50">
              <CardHeader className="p-3 xs:p-4 sm:p-6">
                <CardTitle className="flex items-center gap-2 xs:gap-3 text-base sm:text-xl md:text-2xl text-gray-900 dark:text-white">
                  <Globe className="h-5 w-5 xs:h-6 xs:w-6 text-purple-600 dark:text-purple-400" />
                  <span className="hidden xs:inline">Orbita</span> IAO
                </CardTitle>
                <CardDescription className="text-xs sm:text-sm md:text-base text-gray-600 dark:text-gray-400 mt-1 xs:mt-2">
                  Visualização do funcionamento interno
                </CardDescription>
              </CardHeader>
              <CardContent className="p-3 xs:p-4 sm:p-6">
                <div className="mb-4 xs:mb-6">
                  <h3 className="text-sm xs:text-base sm:text-lg font-semibold mb-2 xs:mb-3 flex items-center text-gray-900 dark:text-white">
                    <Activity className="h-4 w-4 xs:h-5 xs:w-5 mr-2 text-blue-600 dark:text-blue-400" />
                    Status
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 xs:gap-3 sm:gap-4 mb-4 xs:mb-6">
                    <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white p-2 xs:p-3 sm:p-4 rounded-lg">
                      <div className="text-base xs:text-xl sm:text-2xl font-bold">ATIVO</div>
                      <div className="text-xs opacity-90">Principal</div>
                    </div>
                    <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white p-2 xs:p-3 sm:p-4 rounded-lg">
                      <div className="text-base xs:text-xl sm:text-2xl font-bold">8</div>
                      <div className="text-xs opacity-90">Módulos</div>
                    </div>
                    <div className="bg-gradient-to-r from-purple-500 to-pink-600 text-white p-2 xs:p-3 sm:p-4 rounded-lg">
                      <div className="text-base xs:text-xl sm:text-2xl font-bold">∞</div>
                      <div className="text-xs opacity-90">Proc.</div>
                    </div>
                    <div className="bg-gradient-to-r from-orange-500 to-red-600 text-white p-2 xs:p-3 sm:p-4 rounded-lg">
                      <div className="text-base xs:text-xl sm:text-2xl font-bold">97%</div>
                      <div className="text-xs opacity-90">Eficiência</div>
                    </div>
                  </div>
                </div>

                <div className="mb-4 xs:mb-6">
                  <h3 className="text-sm xs:text-base sm:text-lg font-semibold mb-2 xs:mb-3 flex items-center text-gray-900 dark:text-white">
                    <Target className="h-4 w-4 xs:h-5 xs:w-5 mr-2 text-purple-600 dark:text-purple-400" />
                    Mapa Neural
                  </h3>
                  <p className="text-xs xs:text-sm text-gray-600 dark:text-gray-400 mb-3 xs:mb-4">
                    Cada nodo = módulo neural BrainSys IAO em operação.
                  </p>
                </div>

                <RadialOrbitalTimeline timelineData={orbitalTimelineData} />

                <div className="mt-4 xs:mt-6 sm:mt-8 p-2 xs:p-3 sm:p-4 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-lg">
                  <h4 className="font-semibold mb-1 xs:mb-2 flex items-center text-xs xs:text-sm sm:text-base text-gray-900 dark:text-white">
                    <Lightbulb className="h-3 w-3 xs:h-4 xs:w-4 mr-2 text-yellow-600 dark:text-yellow-400" />
                    Interpretação
                  </h4>
                  <div className="grid md:grid-cols-2 gap-2 xs:gap-3 sm:gap-4 text-xs xs:text-sm text-gray-700 dark:text-gray-300">
                    <div>
                      <p className="mb-1"><strong>Energia:</strong> Intensidade</p>
                      <p><strong>Status:</strong> Verde=Ativo</p>
                    </div>
                    <div>
                      <p className="mb-1"><strong>Conexões:</strong> Fluxo</p>
                      <p><strong>Órbita:</strong> Processamento</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default BrainsysIAO;