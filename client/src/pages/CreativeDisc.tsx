
import React, { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import {
  Download,
  Brain,
  ArrowLeft,
  Target,
  Clock,
  Users,
  TrendingUp,
  CheckCircle,
  Star,
  Zap
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface DiscCreative {
  id: string;
  name: string;
  description: string;
  category: string;
  primaryColor: string;
  secondaryColor: string;
  textStyle: string;
  features: string[];
  stats: { label: string; value: string; color: string }[];
}

const CreativeDisc = () => {
  console.log('🎨 CreativeDisc: Componente iniciando...');
  
  // Hooks com fallbacks de segurança
  const { toast } = useToast();
  const navigate = useNavigate();
  const [selectedCreative, setSelectedCreative] = useState<string | null>(null);
  
  console.log('🎨 CreativeDisc: Hooks inicializados com sucesso');

  const discCreatives: DiscCreative[] = [
    {
      id: 'disc-1',
      name: 'Análise DISC em 5 Minutos',
      description: 'Mapeamento comportamental completo com 94% de precisão usando IA',
      category: 'DISC',
      primaryColor: '#6366f1',
      secondaryColor: '#8b5cf6',
      textStyle: 'Moderno e Impactante',
      features: [
        'Análise comportamental em 5 min',
        '94% de precisão comprovada',
        'Relatórios automáticos',
        'Dashboard interativo',
        'Insights personalizados'
      ],
      stats: [
        { label: 'Precisão', value: '94%', color: '#10b981' },
        { label: 'Tempo', value: '5 min', color: '#f59e0b' },
        { label: 'Empresas', value: '127+', color: '#6366f1' }
      ]
    },
    {
      id: 'disc-2',
      name: 'DISC 4.0 com IA Avançada',
      description: 'Metodologia DISC revolucionada com machine learning e predições comportamentais',
      category: 'DISC',
      primaryColor: '#8b5cf6',
      secondaryColor: '#06b6d4',
      textStyle: 'Tecnológico Avançado',
      features: [
        'IA preditiva comportamental',
        'Análise de compatibilidade em equipes',
        'Sugestões de desenvolvimento',
        'Monitoramento contínuo',
        'Relatórios executivos'
      ],
      stats: [
        { label: 'Equipes Analisadas', value: '500+', color: '#8b5cf6' },
        { label: 'ROI Médio', value: '280%', color: '#10b981' },
        { label: 'Satisfação', value: '98%', color: '#f59e0b' }
      ]
    },
    {
      id: 'disc-3',
      name: 'DISC para Liderança',
      description: 'Desenvolvimento de líderes através do mapeamento comportamental personalizado',
      category: 'DISC',
      primaryColor: '#dc2626',
      secondaryColor: '#f59e0b',
      textStyle: 'Executivo Premium',
      features: [
        'Perfil de liderança completo',
        'Estratégias de comunicação',
        'Gestão de conflitos',
        'Coaching personalizado',
        'Planos de desenvolvimento'
      ],
      stats: [
        { label: 'Líderes Formados', value: '1.2K+', color: '#dc2626' },
        { label: 'Melhoria Performance', value: '+67%', color: '#10b981' },
        { label: 'Retenção', value: '89%', color: '#8b5cf6' }
      ]
    }
  ];

  const downloadCreative = (creative: DiscCreative) => {
    const canvas = document.createElement('canvas');
    canvas.width = 1080;
    canvas.height = 1320;
    const ctx = canvas.getContext('2d');
    
    if (ctx) {
      // Configurar qualidade alta
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      
      // Criar fundo com gradiente personalizado
      const gradient = ctx.createLinearGradient(0, 0, 1080, 1320);
      gradient.addColorStop(0, creative.primaryColor);
      gradient.addColorStop(0.6, creative.secondaryColor);
      gradient.addColorStop(1, '#1a1a2e');
      
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 1080, 1320);
      
      // Adicionar padrão geométrico de fundo
      ctx.globalAlpha = 0.1;
      ctx.strokeStyle = 'white';
      ctx.lineWidth = 2;
      for (let i = 0; i < 12; i++) {
        ctx.beginPath();
        ctx.arc(540 + Math.cos(i * 30 * Math.PI / 180) * 400, 660 + Math.sin(i * 30 * Math.PI / 180) * 400, 200, 0, 2 * Math.PI);
        ctx.stroke();
      }
      ctx.globalAlpha = 1;
      
      // Header com logo
      ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
      ctx.fillRect(0, 0, 1080, 120);
      
      // Logo simulado (círculo com ícone)
      ctx.fillStyle = creative.primaryColor;
      ctx.beginPath();
      ctx.arc(100, 60, 35, 0, 2 * Math.PI);
      ctx.fill();
      
      // Desenhar ícone do cérebro simplificado
      ctx.strokeStyle = 'white';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(100, 55, 15, 0, Math.PI);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(95, 60, 10, 0, Math.PI);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(105, 60, 10, 0, Math.PI);
      ctx.stroke();
      
      // Nome da marca
      ctx.fillStyle = '#1a1a2e';
      ctx.font = 'bold 42px Arial, sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText('HumanSys', 160, 75);
      
      // Slogan
      ctx.font = '20px Arial, sans-serif';
      ctx.fillStyle = '#666';
      ctx.fillText('IA Organizacional', 160, 100);
      
      // Título principal
      ctx.fillStyle = 'white';
      ctx.font = 'bold 64px Arial, sans-serif';
      ctx.textAlign = 'center';
      ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
      ctx.shadowBlur = 10;
      ctx.shadowOffsetY = 5;
      
      // Quebrar título em múltiplas linhas se necessário
      const titleWords = creative.name.split(' ');
      let currentLine = '';
      let lineHeight = 70;
      let startY = 220;
      
      for (let word of titleWords) {
        const testLine = currentLine + word + ' ';
        const metrics = ctx.measureText(testLine);
        if (metrics.width > 950 && currentLine !== '') {
          ctx.fillText(currentLine.trim(), 540, startY);
          currentLine = word + ' ';
          startY += lineHeight;
        } else {
          currentLine = testLine;
        }
      }
      ctx.fillText(currentLine.trim(), 540, startY);
      
      // Reset shadow
      ctx.shadowBlur = 0;
      ctx.shadowOffsetY = 0;
      
      // Descrição
      ctx.font = '32px Arial, sans-serif';
      ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
      const descY = startY + 80;
      const descWords = creative.description.split(' ');
      let descLine = '';
      let descStartY = descY;
      
      for (let word of descWords) {
        const testLine = descLine + word + ' ';
        const metrics = ctx.measureText(testLine);
        if (metrics.width > 900 && descLine !== '') {
          ctx.fillText(descLine.trim(), 540, descStartY);
          descLine = word + ' ';
          descStartY += 40;
        } else {
          descLine = testLine;
        }
      }
      ctx.fillText(descLine.trim(), 540, descStartY);
      
      // Seção de benefícios/recursos
      const benefitsY = descStartY + 80;
      
      ctx.font = '28px Arial, sans-serif';
      ctx.fillStyle = 'white';
      let benefitY = benefitsY;
      
      for (let feature of creative.features) {
        ctx.fillText(`✓ ${feature}`, 540, benefitY);
        benefitY += 45;
      }
      
      // Métricas em destaque
      const metricsY = benefitY + 60;
      ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
      ctx.fillRect(80, metricsY - 40, 920, 160);
      
      ctx.font = 'bold 48px Arial, sans-serif';
      ctx.textAlign = 'left';
      
      let metricX = 140;
      for (let stat of creative.stats) {
        ctx.fillStyle = stat.color;
        ctx.fillText(stat.value, metricX, metricsY);
        ctx.font = '20px Arial, sans-serif';
        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        ctx.fillText(stat.label, metricX, metricsY + 30);
        ctx.font = 'bold 48px Arial, sans-serif';
        metricX += 280;
      }
      
      // Call to Action
      const ctaY = metricsY + 140;
      ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
      ctx.fillRect(140, ctaY, 800, 100);
      
      ctx.fillStyle = creative.primaryColor;
      ctx.font = 'bold 36px Arial, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('Transforme seu RH com DISC Inteligente', 540, ctaY + 45);
      
      ctx.font = '24px Arial, sans-serif';
      ctx.fillStyle = '#666';
      ctx.fillText('fernando@humansys.com.br • (11) 98765-4321', 540, ctaY + 75);
      
      // Footer
      ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
      ctx.fillRect(0, 1220, 1080, 100);
      
      ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
      ctx.font = '18px Arial, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('www.humansys.com.br', 540, 1250);
      ctx.fillText('Mapeamento Comportamental com IA', 540, 1280);
      
      // Converter para blob e fazer download
      canvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `HumanSys_DISC_${creative.name.replace(/\s+/g, '_')}_1080x1320.png`;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
          
          toast({
            title: "Criativo DISC Gerado!",
            description: `${creative.name} - Design profissional baixado com sucesso`,
          });
        }
      }, 'image/png', 0.95);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 h-full overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              onClick={() => navigate('/app/founder-dashboard')}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Voltar
            </Button>
            <div>
              <h1 className="text-3xl font-bold flex items-center gap-2">
                <Target className="h-8 w-8 text-indigo-600" />
                Criativos DISC
              </h1>
              <p className="text-muted-foreground">
                Materiais profissionais para análise comportamental
              </p>
            </div>
          </div>
          <Badge className="bg-indigo-100 text-indigo-800 border-indigo-200">
            {discCreatives.length} criativos disponíveis
          </Badge>
        </div>

        {/* Visão Geral DISC */}
        <Card className="bg-gradient-to-r from-indigo-50 to-purple-50 border-indigo-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-indigo-800">
              <Brain className="h-6 w-6" />
              Análise DISC com Inteligência Artificial
            </CardTitle>
            <CardDescription className="text-indigo-600">
              Mapeamento comportamental revolucionário que identifica perfis em minutos, não semanas
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-4">
              <div className="text-center p-4 bg-white/50 rounded-lg">
                <Clock className="h-8 w-8 text-indigo-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-indigo-800">5 min</p>
                <p className="text-sm text-indigo-600">Tempo de análise</p>
              </div>
              <div className="text-center p-4 bg-white/50 rounded-lg">
                <TrendingUp className="h-8 w-8 text-green-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-green-800">94%</p>
                <p className="text-sm text-green-600">Precisão</p>
              </div>
              <div className="text-center p-4 bg-white/50 rounded-lg">
                <Users className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-purple-800">15K+</p>
                <p className="text-sm text-purple-600">Análises realizadas</p>
              </div>
              <div className="text-center p-4 bg-white/50 rounded-lg">
                <Star className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-yellow-800">4.9</p>
                <p className="text-sm text-yellow-600">Avaliação média</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Grid de Criativos */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {discCreatives.map((creative) => (
            <Card 
              key={creative.id} 
              className={`overflow-hidden hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer ${
                selectedCreative === creative.id ? 'ring-2 ring-indigo-500' : ''
              }`}
              onClick={() => setSelectedCreative(selectedCreative === creative.id ? null : creative.id)}
            >
              <div 
                className="h-48 relative flex items-center justify-center text-white overflow-hidden"
                style={{
                  background: `linear-gradient(135deg, ${creative.primaryColor}, ${creative.secondaryColor})`
                }}
              >
                {/* Padrão de fundo animado */}
                <div className="absolute inset-0 opacity-20">
                  <div className="grid grid-cols-6 gap-3 h-full p-4">
                    {Array.from({ length: 18 }).map((_, i) => (
                      <div 
                        key={i} 
                        className="bg-white rounded-full animate-pulse" 
                        style={{ animationDelay: `${i * 0.2}s` }}
                      ></div>
                    ))}
                  </div>
                </div>
                
                <div className="text-center relative z-10">
                  <div className="bg-white/25 backdrop-blur-sm rounded-full p-4 mx-auto mb-4 w-fit">
                    <Target className="h-10 w-10" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">DISC IA</h3>
                  <p className="text-sm opacity-90 font-medium">{creative.textStyle}</p>
                </div>
                
                {/* Preview label */}
                <div className="absolute top-3 right-3 bg-black/30 backdrop-blur-sm rounded px-3 py-1">
                  <span className="text-xs text-white font-medium">1080x1320</span>
                </div>
                
                {/* Badge de seleção */}
                {selectedCreative === creative.id && (
                  <div className="absolute top-3 left-3 bg-green-500 rounded-full p-1">
                    <CheckCircle className="h-4 w-4 text-white" />
                  </div>
                )}
              </div>
              
              <CardHeader>
                <CardTitle className="text-lg">{creative.name}</CardTitle>
                <CardDescription>{creative.description}</CardDescription>
              </CardHeader>
              
              <CardContent>
                <div className="space-y-4">
                  {/* Features */}
                  <div>
                    <h4 className="font-semibold text-sm mb-2">Recursos inclusos:</h4>
                    <div className="space-y-1">
                      {creative.features.slice(0, 3).map((feature, index) => (
                        <div key={index} className="flex items-center gap-2 text-xs text-gray-600">
                          <Zap className="h-3 w-3 text-indigo-500" />
                          {feature}
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Stats */}
                  <div className="flex items-center gap-3">
                    {creative.stats.map((stat, index) => (
                      <div key={index} className="text-center">
                        <p className="text-sm font-bold" style={{ color: stat.color }}>
                          {stat.value}
                        </p>
                        <p className="text-xs text-gray-500">{stat.label}</p>
                      </div>
                    ))}
                  </div>
                  
                  <Button 
                    onClick={(e) => {
                      e.stopPropagation();
                      downloadCreative(creative);
                    }}
                    className="w-full"
                    style={{
                      background: `linear-gradient(135deg, ${creative.primaryColor}, ${creative.secondaryColor})`
                    }}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Baixar Criativo
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Informações Técnicas */}
        <Card>
          <CardHeader>
            <CardTitle>Especificações Técnicas dos Criativos DISC</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <h4 className="font-semibold mb-3">Características do Design</h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Design responsivo e moderno
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Cores psicologicamente otimizadas
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Tipografia profissional
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Elementos visuais impactantes
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-3">Aplicações Recomendadas</h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center gap-2">
                    <Target className="h-4 w-4 text-indigo-500" />
                    Campanhas de marketing digital
                  </li>
                  <li className="flex items-center gap-2">
                    <Target className="h-4 w-4 text-indigo-500" />
                    Apresentações comerciais
                  </li>
                  <li className="flex items-center gap-2">
                    <Target className="h-4 w-4 text-indigo-500" />
                    Redes sociais corporativas
                  </li>
                  <li className="flex items-center gap-2">
                    <Target className="h-4 w-4 text-indigo-500" />
                    Material educativo
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

// Wrapper com Error Boundary
const CreativeDiscWithErrorBoundary = () => {
  try {
    return <CreativeDisc />;
  } catch (error) {
    console.error('❌ Erro no CreativeDisc:', error);
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-full">
          <div className="text-center space-y-4">
            <h2 className="text-2xl font-bold text-red-600">Erro ao carregar Criativos DISC</h2>
            <p className="text-gray-600">Ocorreu um erro inesperado. Tente recarregar a página.</p>
            <Button onClick={() => window.location.reload()}>
              Recarregar Página
            </Button>
          </div>
        </div>
      </DashboardLayout>
    );
  }
};

export { CreativeDisc, CreativeDiscWithErrorBoundary };
export default CreativeDiscWithErrorBoundary;
