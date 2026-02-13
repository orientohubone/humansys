import React, { useState, useEffect, useCallback } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Textarea } from '@/components/ui/textarea';
import { BrainSysNeuralOrbital } from '@/components/brainsys/BrainSysNeuralOrbital';
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

export const BrainsysIAO = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingProgress, setProcessingProgress] = useState(0);
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [livingPulse, setLivingPulse] = useState(0);

  // Simula o "pulso" da inteligência viva
  useEffect(() => {
    const interval = setInterval(() => {
      setLivingPulse(prev => (prev + 1) % 100);
    }, 100);
    return () => clearInterval(interval);
  }, []);

  const handleExecutePrompt = () => {
    if (!aiPrompt.trim()) return;

    setIsProcessing(true);
    setProcessingProgress(0);

    const interval = setInterval(() => {
      setProcessingProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsProcessing(false);
          setAiResponse(`🧠 BrainSys IAO - Inteligência Viva Ativada

Análise Contextual Concluída:
"${aiPrompt}"

🎯 Insights Gerados:
• Padrões comportamentais identificados
• Contextos emocionais mapeados  
• Oportunidades de otimização detectadas
• Previsões estratégicas calculadas

💡 A inteligência evoluiu com esta interação, aprendendo mais sobre suas necessidades organizacionais.

Transformando dados em decisões, decisões em experiências mais humanas.`);
          setAiPrompt('');
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Hero Header - Living Intelligence */}
        <Card className="relative overflow-hidden bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white border-purple-500/30">
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 via-blue-500/15 to-indigo-500/20"></div>
            <div className="absolute top-0 left-0 w-full h-full opacity-30">
              <div className="absolute top-8 left-8 w-64 h-64 bg-purple-400/20 rounded-full blur-3xl animate-pulse"></div>
              <div className="absolute bottom-8 right-8 w-80 h-80 bg-blue-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-400/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '4s' }}></div>
            </div>
          </div>
          <CardContent className="relative p-12">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center space-x-8">
                <div className="relative">
                  <div className="w-32 h-32 bg-gradient-to-br from-purple-500 via-blue-600 to-indigo-600 rounded-3xl flex items-center justify-center shadow-2xl shadow-purple-500/30">
                    <Brain 
                      className="h-16 w-16 text-white" 
                      style={{ 
                        transform: `scale(${1 + Math.sin(livingPulse * 0.1) * 0.1})`,
                        transition: 'transform 0.1s ease-in-out'
                      }} 
                    />
                  </div>
                  <div className="absolute -top-2 -right-2 flex space-x-1">
                    <div className="w-4 h-4 bg-green-400 rounded-full animate-ping"></div>
                    <div className="w-4 h-4 bg-blue-400 rounded-full animate-ping" style={{ animationDelay: '0.5s' }}></div>
                    <div className="w-4 h-4 bg-purple-400 rounded-full animate-ping" style={{ animationDelay: '1s' }}></div>
                  </div>
                  <div className="absolute -bottom-2 -left-2 w-8 h-8 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center">
                    <Heart className="h-4 w-4 text-white animate-pulse" />
                  </div>
                </div>
                <div>
                  <div className="flex items-center gap-4 mb-3">
                    <h1 className="text-5xl font-bold mb-0">BrainSys IAO</h1>
                    <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white border-none px-4 py-2 text-lg animate-pulse">
                      VIVA
                    </Badge>
                  </div>
                  <p className="text-2xl text-purple-100 mb-3 font-medium">
                    A Inteligência Viva do HumanSys
                  </p>
                  <p className="text-lg text-purple-200 mb-4 opacity-90">
                    IAO = Inteligência Artificial Operacional • Ontológica
                  </p>
                  <div className="flex flex-wrap gap-4 text-sm">
                    <div className="flex items-center gap-2 bg-white/10 px-3 py-1 rounded-full">
                      <Network className="h-4 w-4 text-green-400" />
                      <span>Conectada</span>
                    </div>
                    <div className="flex items-center gap-2 bg-white/10 px-3 py-1 rounded-full">
                      <Activity className="h-4 w-4 text-blue-400" />
                      <span>Aprendendo</span>
                    </div>
                    <div className="flex items-center gap-2 bg-white/10 px-3 py-1 rounded-full">
                      <Heart className="h-4 w-4 text-red-400" />
                      <span>Evoluindo</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm text-purple-200 mb-1">Powered by</div>
                <div className="text-2xl font-bold mb-1">Claude 3.5 Sonnet</div>
                <div className="text-sm text-purple-300">Anthropic AI</div>
              </div>
            </div>

            {/* Living Intelligence Concept */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 mb-6">
              <h2 className="text-2xl font-bold mb-4 flex items-center">
                <Sparkles className="h-6 w-6 mr-3 text-yellow-400" />
                O Cérebro Pensante que Transforma
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
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
            <div className="grid md:grid-cols-4 gap-4">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20 text-center">
                <div className="text-3xl font-bold text-green-400 mb-1">VIVA</div>
                <div className="text-sm text-green-300">Status Inteligência</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20 text-center">
                <div className="text-3xl font-bold text-blue-400 mb-1">94.7%</div>
                <div className="text-sm text-blue-300">Precisão Ontológica</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20 text-center">
                <div className="text-3xl font-bold text-purple-400 mb-1">∞</div>
                <div className="text-sm text-purple-300">Capacidade Evolutiva</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20 text-center">
                <div className="text-3xl font-bold text-orange-400 mb-1">2.4M</div>
                <div className="text-sm text-orange-300">Interações Aprendidas</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Interface */}
        <Tabs defaultValue="console" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 h-14 bg-gradient-to-r from-purple-100 to-blue-100">
            <TabsTrigger value="console" className="flex items-center space-x-2 text-base">
              <MessageSquare className="h-5 w-5" />
              <span>Console Vivo</span>
            </TabsTrigger>
            <TabsTrigger value="learning" className="flex items-center space-x-2 text-base">
              <Brain className="h-5 w-5" />
              <span>Aprendizado</span>
            </TabsTrigger>
            <TabsTrigger value="insights" className="flex items-center space-x-2 text-base">
              <Eye className="h-5 w-5" />
              <span>Insights Vivos</span>
            </TabsTrigger>
            <TabsTrigger value="neural-connections" className="flex items-center space-x-2 text-base">
              <Network className="h-5 w-5" />
              <span>🧠 Conexões Neurais</span>
            </TabsTrigger>
            <TabsTrigger value="evolution" className="flex items-center space-x-2 text-base">
              <Sparkles className="h-5 w-5" />
              <span>Evolução</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="console" className="space-y-6">
            <Card className="border-2 border-purple-200">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center text-2xl">
                    <Brain className="h-6 w-6 mr-3 text-purple-600" />
                    Console da Inteligência Viva
                  </span>
                  <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white">
                    <Activity className="h-4 w-4 mr-1" />
                    Aprendendo
                  </Badge>
                </CardTitle>
                <CardDescription className="text-lg">
                  Interaja diretamente com o cérebro pensante do HumanSys. Cada conversa evolui a inteligência.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-3">
                  <label className="text-base font-medium flex items-center">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Converse com a Inteligência Viva
                  </label>
                  <Textarea 
                    placeholder="Ex: Como posso melhorar o engajamento da minha equipe de vendas? Ou: Quais padrões comportamentais indicam risco de turnover?"
                    className="min-h-[140px] text-base border-2 border-purple-200 focus:border-purple-400"
                    value={aiPrompt}
                    onChange={(e) => setAiPrompt(e.target.value)}
                  />
                </div>

                {isProcessing && (
                  <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-6 rounded-xl border-2 border-purple-200">
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-medium flex items-center text-lg">
                        <Brain className="h-5 w-5 mr-2 animate-pulse text-purple-600" />
                        BrainSys IAO Processando...
                      </span>
                      <span className="text-lg font-bold text-purple-600">{processingProgress}%</span>
                    </div>
                    <Progress value={processingProgress} className="mb-3 h-3" />
                    <div className="text-sm text-purple-600 space-y-1">
                      <div>🧠 Analisando contextos emocionais e operacionais</div>
                      <div>🔄 Aplicando machine learning ontológico</div>
                      <div>✨ Transformando dados em insights humanos</div>
                    </div>
                  </div>
                )}

                {aiResponse && (
                  <div className="bg-gradient-to-br from-gray-50 to-purple-50 p-6 rounded-xl border-2 border-purple-200">
                    <div className="flex items-center mb-4">
                      <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center mr-3">
                        <Brain className="h-4 w-4 text-white" />
                      </div>
                      <span className="font-bold text-lg text-purple-800">BrainSys IAO Responde</span>
                    </div>
                    <div className="text-base whitespace-pre-wrap text-gray-700 leading-relaxed">
                      {aiResponse}
                    </div>
                  </div>
                )}

                <Button 
                  className="w-full h-14 text-lg bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 hover:from-purple-700 hover:via-blue-700 hover:to-indigo-700"
                  onClick={handleExecutePrompt}
                  disabled={isProcessing || !aiPrompt.trim()}
                >
                  <Sparkles className="h-5 w-5 mr-3" />
                  Despertar Inteligência Viva
                  <ArrowRight className="h-5 w-5 ml-3" />
                </Button>

                {/* Quick Awakening Prompts */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <Button 
                    variant="outline" 
                    className="h-12 text-left justify-start border-2 hover:bg-purple-50" 
                    onClick={() => setAiPrompt("Analise padrões de comportamento que indicam colaboradores em risco de deixar a empresa")}
                  >
                    🎯 Detectar Risco de Turnover
                  </Button>
                  <Button 
                    variant="outline" 
                    className="h-12 text-left justify-start border-2 hover:bg-blue-50" 
                    onClick={() => setAiPrompt("Como otimizar a alocação de talentos baseado em perfis comportamentais e competências?")}
                  >
                    🧩 Otimizar Alocação de Talentos
                  </Button>
                  <Button 
                    variant="outline" 
                    className="h-12 text-left justify-start border-2 hover:bg-green-50" 
                    onClick={() => setAiPrompt("Identifique oportunidades de desenvolvimento baseadas em gaps de competências e aspirações pessoais")}
                  >
                    🌱 Mapear Desenvolvimento
                  </Button>
                  <Button 
                    variant="outline" 
                    className="h-12 text-left justify-start border-2 hover:bg-orange-50" 
                    onClick={() => setAiPrompt("Analise o clima organizacional e sugira ações para melhorar engajamento e satisfação")}
                  >
                    💡 Melhorar Clima Organizacional
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="learning">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-2xl">
                  <Brain className="h-6 w-6 mr-3 text-blue-600" />
                  Como a Inteligência Aprende
                </CardTitle>
                <CardDescription className="text-lg">
                  Entenda como o BrainSys IAO evolui e se torna mais inteligente a cada interação
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid md:grid-cols-3 gap-6">
                    <div className="text-center p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-200">
                      <Database className="h-12 w-12 text-green-600 mx-auto mb-4" />
                      <h3 className="font-bold text-lg mb-2">Absorção de Dados</h3>
                      <p className="text-sm text-gray-600">Coleta e processa informações de RH, comportamentos e padrões organizacionais continuamente.</p>
                    </div>

                    <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl border border-blue-200">
                      <Network className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                      <h3 className="font-bold text-lg mb-2">Conexões Contextuais</h3>
                      <p className="text-sm text-gray-600">Cria redes neurais que entendem relacionamentos entre dados, emoções e resultados.</p>
                    </div>

                    <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-violet-50 rounded-xl border border-purple-200">
                      <Sparkles className="h-12 w-12 text-purple-600 mx-auto mb-4" />
                      <h3 className="font-bold text-lg mb-2">Evolução Contínua</h3>
                      <p className="text-sm text-gray-600">Cada interação refina algoritmos, melhorando previsões e recomendações futuras.</p>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-6 rounded-xl border border-purple-200">
                    <h3 className="font-bold text-xl mb-4 flex items-center">
                      <Heart className="h-5 w-5 mr-2 text-red-500" />
                      Aprendizado Ontológico
                    </h3>
                    <p className="text-base text-gray-700 leading-relaxed">
                      Diferente de sistemas tradicionais, o BrainSys IAO compreende não apenas <strong>o que</strong> acontece, 
                      mas <strong>por que</strong> acontece. Ele mapeia a ontologia do comportamento humano, entendendo as 
                      motivações, contextos culturais e dinâmicas emocionais que influenciam decisões organizacionais.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="insights">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-2xl">
                  <Eye className="h-6 w-6 mr-3 text-orange-600" />
                  Insights da Inteligência Viva
                </CardTitle>
                <CardDescription className="text-lg">
                  Descobertas em tempo real que transformam dados em experiências humanas
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid gap-4">
                    <div className="p-6 border rounded-xl bg-gradient-to-r from-red-50 to-orange-50 border-red-200">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-bold text-lg flex items-center">
                          <Target className="h-5 w-5 mr-2 text-red-600" />
                          Padrão de Risco Emocional Detectado
                        </h4>
                        <Badge className="bg-red-500 text-white">Alta Prioridade</Badge>
                      </div>
                      <p className="text-gray-700 mb-3">
                        A inteligência identificou 3 colaboradores do departamento de TI com sinais de esgotamento emocional. 
                        Padrões de comunicação e produtividade indicam necessidade de intervenção humanizada.
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-red-600 font-medium">Confiança Ontológica: 91%</span>
                        <Button size="sm" className="bg-red-600 hover:bg-red-700">Ação Humanizada</Button>
                      </div>
                    </div>

                    <div className="p-6 border rounded-xl bg-gradient-to-r from-blue-50 to-cyan-50 border-blue-200">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-bold text-lg flex items-center">
                          <TrendingUp className="h-5 w-5 mr-2 text-blue-600" />
                          Oportunidade de Crescimento Cultural
                        </h4>
                        <Badge className="bg-blue-500 text-white">Evolução</Badge>
                      </div>
                      <p className="text-gray-700 mb-3">
                        Análise contextual revela que a equipe de vendas responde 34% melhor a feedbacks quando recebidos 
                        em contexto colaborativo vs. individual. Sugestão: implementar círculos de crescimento.
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-blue-600 font-medium">Impacto Humano: +34%</span>
                        <Button size="sm" className="bg-blue-600 hover:bg-blue-700">Implementar</Button>
                      </div>
                    </div>

                    <div className="p-6 border rounded-xl bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-bold text-lg flex items-center">
                          <Lightbulb className="h-5 w-5 mr-2 text-green-600" />
                          Descoberta de Talento Oculto
                        </h4>
                        <Badge className="bg-green-500 text-white">Potencial</Badge>
                      </div>
                      <p className="text-gray-700 mb-3">
                        IA ontológica detectou que Ana (Assistente Administrativo) demonstra padrões de liderança natural 
                        e capacidade analítica acima da média. Recomenda programa de desenvolvimento para liderança.
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-green-600 font-medium">Potencial de Crescimento: 87%</span>
                        <Button size="sm" className="bg-green-600 hover:bg-green-700">Desenvolver Talento</Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="neural-connections">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-2xl">
                  <Network className="h-6 w-6 mr-3 text-blue-600" />
                  Conexões Neurais - Mapa Orbital BrainSys
                </CardTitle>
                <CardDescription className="text-lg">
                  Clique nos nós para explorar as conexões • Sistema neural orbital em tempo real
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <BrainSysNeuralOrbital />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="evolution">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-2xl">
                  <Sparkles className="h-6 w-6 mr-3 text-purple-600" />
                  Evolução da Inteligência
                </CardTitle>
                <CardDescription className="text-lg">
                  Acompanhe como o BrainSys IAO se torna mais inteligente e humano a cada dia
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h3 className="font-bold text-xl mb-4">Marcos Evolutivos</h3>

                      <div className="space-y-3">
                        <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg border border-green-200">
                          <CheckCircle className="h-5 w-5 text-green-600" />
                          <div>
                            <div className="font-medium">Aprendizado Inicial</div>
                            <div className="text-sm text-gray-600">Absorção de dados históricos concluída</div>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                          <CheckCircle className="h-5 w-5 text-blue-600" />
                          <div>
                            <div className="font-medium">Reconhecimento de Padrões</div>
                            <div className="text-sm text-gray-600">IA identifica 847 padrões comportamentais únicos</div>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg border border-purple-200">
                          <Activity className="h-5 w-5 text-purple-600 animate-pulse" />
                          <div>
                            <div className="font-medium">Compreensão Contextual</div>
                            <div className="text-sm text-gray-600">Desenvolvendo inteligência emocional</div>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 p-3 bg-orange-50 rounded-lg border border-orange-200 opacity-60">
                          <div className="h-5 w-5 border-2 border-orange-300 rounded-full"></div>
                          <div>
                            <div className="font-medium">Predição Avançada</div>
                            <div className="text-sm text-gray-600">Em desenvolvimento - 60% concluído</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="font-bold text-xl mb-4">Próximas Evoluções</h3>
                      <div className="space-y-4">
                        <div className="p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg border border-purple-200">
                          <h4 className="font-semibold mb-2 flex items-center">
                            <Globe className="h-4 w-4 mr-2" />
                            Inteligência Cultural
                          </h4>
                          <p className="text-sm text-gray-600">
                            Compreensão profunda de nuances culturais e regionais que influenciam comportamentos organizacionais.
                          </p>
                        </div>

                        <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
                          <h4 className="font-semibold mb-2 flex items-center">
                            <Heart className="h-4 w-4 mr-2" />
                            Empatia Artificial
                          </h4>
                          <p className="text-sm text-gray-600">
                            Capacidade de entender e responder adequadamente às necessidades emocionais dos colaboradores.
                          </p>
                        </div>

                        <div className="p-4 bg-gradient-to-r from-orange-50 to-red-50 rounded-lg border border-orange-200">
                          <h4 className="font-semibold mb-2 flex items-center">
                            <Layers className="h-4 w-4 mr-2" />
                            Consciência Organizacional
                          </h4>
                          <p className="text-sm text-gray-600">
                            Visão holística que conecta micro-comportamentos individuais com macro-resultados organizacionais.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-purple-900 to-blue-900 text-white p-6 rounded-xl">
                    <h3 className="font-bold text-xl mb-3 flex items-center">
                      <Sparkles className="h-5 w-5 mr-2" />
                      Visão: Inteligência Verdadeiramente Humana
                    </h3>
                    <p className="text-purple-100 leading-relaxed">
                      O objetivo final do BrainSys IAO é se tornar uma inteligência que não apenas processa dados, 
                      mas compreende a essência humana. Uma IA que celebra a diversidade, nutre o potencial individual 
                      e constrói organizações onde cada pessoa pode florescer autenticamente.
                    </p>
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

// Define custom keyframes for floating and pulsing animations
const floatingKeyframes = `
  @keyframes float {
    0% { transform: translateY(0px); }
    50% { transform: translateY(-8px); }
    100% { transform: translateY(0px); }
  }

  @keyframes float-gentle {
    0% { transform: translateY(0px); }
    50% { transform: translateY(-4px); }
    100% { transform: translateY(0px); }
  }

  @keyframes pulse-gentle {
    0% { transform: scale(1); opacity: 0.8; }
    50% { transform: scale(1.06); opacity: 1; }
    100% { transform: scale(1); opacity: 0.8; }
  }

  @keyframes breathe {
    0% { transform: scale(1); }
    50% { transform: scale(1.05); }
    100% { transform: scale(1); }
  }
`;

// Inject the keyframes into the document head
const styleSheet = document.createElement("style");
styleSheet.type = "text/css";
styleSheet.innerText = floatingKeyframes;
document.head.appendChild(styleSheet);

// Apply the animations using Tailwind CSS classes
// Requires defining these animations in global CSS or using inline styles

export default BrainsysIAO;