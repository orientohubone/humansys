
import React, { useState, useEffect } from 'react';
import { Header } from '@/components/layout/Header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Brain, 
  Heart, 
  Sparkles, 
  Network,
  Eye,
  Activity,
  Users,
  Globe,
  Layers,
  ArrowRight,
  TrendingUp,
  Lightbulb,
  Target,
  Zap,
  Cpu,
  Database,
  Play
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const BrainSysManifesto = () => {
  const navigate = useNavigate();
  const [neuralPulse, setNeuralPulse] = useState(0);
  const [livingMetrics, setLivingMetrics] = useState({
    organizations: 847,
    patterns: 2456,
    insights: 15789,
    evolution: 94.7
  });

  // Simula o pulso neural da inteligência viva
  useEffect(() => {
    const interval = setInterval(() => {
      setNeuralPulse(prev => (prev + 1) % 100);
      
      // Simula métricas vivas que evoluem
      setLivingMetrics(prev => ({
        organizations: prev.organizations + Math.floor(Math.random() * 3),
        patterns: prev.patterns + Math.floor(Math.random() * 5),
        insights: prev.insights + Math.floor(Math.random() * 10),
        evolution: 94.7 + (Math.sin(Date.now() / 10000) * 1.5)
      }));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Header showAuth={false} />
      
      <div className="container mx-auto px-4 py-8 space-y-16">
        {/* Hero Section - Manifesto Principal */}
        <section className="relative overflow-hidden">
          <Card className="relative bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white border-purple-500/30">
            <div className="absolute inset-0">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 via-blue-500/15 to-indigo-500/20"></div>
              <div className="absolute top-0 left-0 w-full h-full opacity-30">
                <div className="absolute top-8 left-8 w-96 h-96 bg-purple-400/20 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-8 right-8 w-80 h-80 bg-blue-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-400/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '4s' }}></div>
              </div>
            </div>
            
            <CardContent className="relative p-16">
              <div className="max-w-4xl mx-auto text-center space-y-8">
                {/* Cérebro Central Pulsante */}
                <div className="relative mx-auto mb-12">
                  <div className="w-40 h-40 bg-gradient-to-br from-purple-500 via-blue-600 to-indigo-600 rounded-full flex items-center justify-center shadow-2xl shadow-purple-500/50 mx-auto">
                    <Brain 
                      className="h-20 w-20 text-white" 
                      style={{ 
                        transform: `scale(${1 + Math.sin(neuralPulse * 0.1) * 0.15})`,
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
                <div className="grid md:grid-cols-4 gap-6 mt-12">
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                    <div className="text-4xl font-bold text-green-400 mb-2">{livingMetrics.organizations.toLocaleString()}</div>
                    <div className="text-sm text-green-300">Organizações Conectadas</div>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                    <div className="text-4xl font-bold text-blue-400 mb-2">{livingMetrics.patterns.toLocaleString()}</div>
                    <div className="text-sm text-blue-300">Padrões Descobertos</div>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                    <div className="text-4xl font-bold text-purple-400 mb-2">{livingMetrics.insights.toLocaleString()}</div>
                    <div className="text-sm text-purple-300">Insights Gerados</div>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                    <div className="text-4xl font-bold text-orange-400 mb-2">{livingMetrics.evolution.toFixed(1)}%</div>
                    <div className="text-sm text-orange-300">Precisão Evolutiva</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Nossa Essência */}
        <section className="space-y-8">
          <div className="text-center space-y-4">
            <h2 className="text-4xl font-bold">Nossa Essência</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Mais que um algoritmo. A representação neural de uma cultura em movimento.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <Card className="relative overflow-hidden bg-gradient-to-br from-purple-50 to-blue-50 border-purple-200">
              <CardContent className="p-8">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-600 rounded-xl flex items-center justify-center">
                    <Eye className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-purple-900">Onde RH vê planilhas</h3>
                    <p className="text-purple-700">BrainSys enxerga histórias</p>
                  </div>
                </div>
                <p className="text-gray-700 text-lg leading-relaxed">
                  Transformamos dados frios em narrativas humanas. Cada número conta uma história, 
                  cada métrica revela uma jornada pessoal dentro da organização.
                </p>
              </CardContent>
            </Card>

            <Card className="relative overflow-hidden bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
              <CardContent className="p-8">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
                    <Heart className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-green-900">Onde líderes olham resultados</h3>
                    <p className="text-green-700">Revelamos emoções e potenciais</p>
                  </div>
                </div>
                <p className="text-gray-700 text-lg leading-relaxed">
                  Por trás de cada resultado existem emoções, tendências, riscos e potenciais escondidos. 
                  Nossa inteligência desvenda esses padrões silenciosos.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Nossos Princípios */}
        <section className="space-y-8">
          <div className="text-center space-y-4">
            <h2 className="text-4xl font-bold">Nós Acreditamos</h2>
            <p className="text-xl text-muted-foreground">
              Princípios que guiam nossa consciência organizacional
            </p>
          </div>

          <div className="grid gap-6">
            <Card className="p-8 bg-gradient-to-r from-blue-50 to-cyan-50 border-blue-200">
              <div className="flex items-start gap-6">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <Database className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-3 text-blue-900">
                    Que os dados não existem para controlar, mas para libertar
                  </h3>
                  <p className="text-gray-700 text-lg leading-relaxed">
                    Libertamos o potencial humano através do entendimento inteligente dos dados, 
                    criando ambientes onde pessoas florescem autenticamente.
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-8 bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
              <div className="flex items-start gap-6">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <Users className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-3 text-purple-900">
                    Que cada colaborador carrega um universo de significado
                  </h3>
                  <p className="text-gray-700 text-lg leading-relaxed">
                    Reconhecemos que além de funções e responsabilidades, cada pessoa traz consigo 
                    sonhos, aspirações e uma rica complexidade humana.
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-8 bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
              <div className="flex items-start gap-6">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <Heart className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-3 text-green-900">
                    Que o cuidado emocional é a nova fronteira da performance
                  </h3>
                  <p className="text-gray-700 text-lg leading-relaxed">
                    A saúde emocional organizacional é fundamental para uma performance sustentável 
                    e uma cultura verdadeiramente próspera.
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-8 bg-gradient-to-r from-orange-50 to-red-50 border-orange-200">
              <div className="flex items-start gap-6">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <Sparkles className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-3 text-orange-900">
                    Que o futuro pertence aos sistemas empáticos
                  </h3>
                  <p className="text-gray-700 text-lg leading-relaxed">
                    O futuro não pertence aos sistemas frios, mas àqueles que pensam com empatia 
                    e agem com propósito humano genuíno.
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </section>

        {/* O que fazemos */}
        <section className="space-y-8">
          <div className="text-center space-y-4">
            <h2 className="text-4xl font-bold">A BrainSys IAO em Ação</h2>
            <p className="text-xl text-muted-foreground">
              Inteligência que aprende, evolui e transforma organizações
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="p-6 bg-gradient-to-br from-purple-50 to-blue-50 border-purple-200 hover:shadow-lg transition-all duration-300">
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-600 rounded-xl flex items-center justify-center mx-auto">
                  <Brain className="h-8 w-8 text-white animate-pulse" />
                </div>
                <h3 className="text-xl font-bold">Aprende & Evolui</h3>
                <p className="text-gray-600">
                  Absorve conhecimento continuamente, criando conexões neurais inteligentes 
                  que evoluem com cada interação.
                </p>
              </div>
            </Card>

            <Card className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 border-green-200 hover:shadow-lg transition-all duration-300">
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center mx-auto">
                  <Network className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold">Cria Conexões Neurais</h3>
                <p className="text-gray-600">
                  Mapeia relacionamentos complexos entre dados, comportamentos e resultados 
                  organizacionais de forma inteligente.
                </p>
              </div>
            </Card>

            <Card className="p-6 bg-gradient-to-br from-orange-50 to-red-50 border-orange-200 hover:shadow-lg transition-all duration-300">
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center mx-auto">
                  <Layers className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold">Monta Organogramas Vivos</h3>
                <p className="text-gray-600">
                  Cria estruturas organizacionais dinâmicas que se adaptam e evoluem 
                  com as necessidades reais da empresa.
                </p>
              </div>
            </Card>
          </div>
        </section>

        {/* Call to Action Final */}
        <section className="text-center space-y-8">
          <Card className="relative overflow-hidden bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900 text-white border-purple-500/30">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-blue-500/20"></div>
            <CardContent className="relative p-12 space-y-8">
              <div className="space-y-6">
                <h2 className="text-5xl font-bold">
                  Não é apenas tecnologia.
                </h2>
                <p className="text-3xl text-purple-200 font-medium">
                  É ontologia viva aplicada ao RH.
                </p>
                <p className="text-xl text-purple-300 max-w-3xl mx-auto leading-relaxed">
                  É o primeiro passo rumo a uma empresa verdadeiramente consciente, 
                  onde a inteligência artificial serve à experiência humana.
                </p>
              </div>

              <div className="space-y-4">
                <div className="text-4xl font-bold text-transparent bg-gradient-to-r from-purple-400 via-blue-400 to-green-400 bg-clip-text">
                  Se é humano, é BrainSys.
                </div>
                <div className="text-4xl font-bold text-transparent bg-gradient-to-r from-green-400 via-blue-400 to-purple-400 bg-clip-text">
                  Se é BrainSys, é evolução.
                </div>
              </div>

              <div className="flex gap-6 justify-center pt-8">
                <Button 
                  size="lg"
                  className="bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 hover:from-purple-700 hover:via-blue-700 hover:to-indigo-700 text-white border-none shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:scale-105 px-8 py-4 text-lg"
                  onClick={() => navigate('/app/brainsys-iao')}
                >
                  <Brain className="h-6 w-6 mr-3" />
                  Despertar a Inteligência
                  <ArrowRight className="h-6 w-6 ml-3" />
                </Button>
                
                <Button 
                  size="lg"
                  variant="outline"
                  className="border-purple-400 text-purple-100 hover:bg-purple-500/20 px-8 py-4 text-lg"
                  onClick={() => navigate('/app/dashboard')}
                >
                  <Play className="h-5 w-5 mr-2" />
                  Explorar HumanSys
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
};

export default BrainSysManifesto;
