
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { DiscProfile, DiscReport } from '@/types/disc';
import { Download, Share2, Brain, Trophy, Target, Users } from 'lucide-react';

interface DiscResultsProps {
  profile: DiscProfile;
  report: DiscReport;
  onDownloadReport: () => void;
  onShareResults: () => void;
  onBackToList: () => void;
}

export const DiscResults: React.FC<DiscResultsProps> = ({
  profile,
  report,
  onDownloadReport,
  onShareResults,
  onBackToList
}) => {
  const getStyleColor = (style: string) => {
    const colors = {
      D: 'bg-red-500',
      I: 'bg-yellow-500',
      S: 'bg-green-500',
      C: 'bg-blue-500'
    };
    return colors[style as keyof typeof colors] || 'bg-gray-500';
  };

  const getStyleDescription = (style: string) => {
    const descriptions = {
      D: 'Dominante - Orientado para resultados, direto e determinado',
      I: 'Influente - Sociável, otimista e persuasivo',  
      S: 'Estável - Paciente, confiável e colaborativo',
      C: 'Consciencioso - Preciso, analítico e sistemático'
    };
    return descriptions[style as keyof typeof descriptions] || '';
  };

  const profileScores = [
    { label: 'Dominância', value: profile.dominance, color: 'bg-red-500' },
    { label: 'Influência', value: profile.influence, color: 'bg-yellow-500' },
    { label: 'Estabilidade', value: profile.steadiness, color: 'bg-green-500' },
    { label: 'Conformidade', value: profile.conscientiousness, color: 'bg-blue-500' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold">Seus Resultados DISC</h2>
          <p className="text-muted-foreground">
            Análise completa do seu perfil comportamental
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={onShareResults}>
            <Share2 className="h-4 w-4 mr-2" />
            Compartilhar
          </Button>
          <Button onClick={onDownloadReport}>
            <Download className="h-4 w-4 mr-2" />
            Download Relatório
          </Button>
        </div>
      </div>

      {/* Perfil Principal */}
      <Card className={`border-l-4 ${getStyleColor(profile.primary_style)} bg-gradient-to-r from-white to-gray-50`}>
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-full ${getStyleColor(profile.primary_style)} flex items-center justify-center text-white font-bold text-xl`}>
              {profile.primary_style}
            </div>
            <div>
              <div className="text-2xl font-bold">Perfil {profile.primary_style}</div>
              <div className="text-sm text-muted-foreground">
                {getStyleDescription(profile.primary_style)}
              </div>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <h4 className="font-medium mb-2">Estilo Secundário</h4>
              <Badge variant="secondary" className="text-sm">
                {profile.secondary_style} - {getStyleDescription(profile.secondary_style || '')}
              </Badge>
            </div>
            <div>
              <h4 className="font-medium mb-2">Data da Análise</h4>
              <p className="text-sm text-muted-foreground">
                {new Date(profile.completed_at).toLocaleDateString('pt-BR')}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Pontuações */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Pontuações por Categoria
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            {profileScores.map((score, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-medium">{score.label}</span>
                  <span className="text-sm text-muted-foreground">{score.value}%</span>
                </div>
                <Progress value={score.value} className="h-3" />
                <div className={`h-1 rounded-full ${score.color} opacity-20`}></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Insights de IA */}
      <Card className="bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-purple-600" />
            Insights de Inteligência Artificial
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {profile.insights.map((insight, index) => (
            <div key={index} className="p-4 bg-white rounded-lg border">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium">{insight.category}</h4>
                <Badge variant="outline" className="text-xs">
                  {insight.strength_level}% de força
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground mb-3">
                {insight.description}
              </p>
              <div className="bg-purple-50 p-3 rounded border border-purple-200">
                <p className="text-sm text-purple-700">
                  <strong>IA Prevê:</strong> {insight.ai_prediction}
                </p>
              </div>
              <div className="mt-3">
                <h5 className="text-xs font-medium text-muted-foreground mb-1">
                  Áreas de Desenvolvimento:
                </h5>
                <div className="flex flex-wrap gap-1">
                  {insight.development_areas.map((area, areaIndex) => (
                    <Badge key={areaIndex} variant="secondary" className="text-xs">
                      {area}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Recomendações */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-yellow-500" />
              Recomendações de Carreira
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {report.career_recommendations.map((career, index) => (
                <li key={index} className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  <span className="text-sm">{career}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-blue-500" />
              Estilo de Comunicação
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {report.communication_preferences.map((pref, index) => (
                <li key={index} className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-sm">{pref}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Análise Detalhada */}
      <Card>
        <CardHeader>
          <CardTitle>Análise Comportamental Completa</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-medium mb-2">Perfil Geral</h4>
            <p className="text-sm text-muted-foreground">{report.detailed_analysis}</p>
          </div>
          
          <div>
            <h4 className="font-medium mb-2">Estilo de Liderança</h4>
            <p className="text-sm text-muted-foreground">{report.leadership_style}</p>
          </div>

          <div>
            <h4 className="font-medium mb-2">Compatibilidade em Equipe</h4>
            <p className="text-sm text-muted-foreground">{report.team_compatibility}</p>
          </div>

          <div>
            <h4 className="font-medium mb-2">Indicadores de Estresse</h4>
            <div className="flex flex-wrap gap-2">
              {report.stress_indicators.map((indicator, index) => (
                <Badge key={index} variant="outline" className="text-xs border-red-200 text-red-700">
                  {indicator}
                </Badge>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-medium mb-2">Oportunidades de Crescimento</h4>
            <div className="space-y-2">
              {report.growth_opportunities.map((opportunity, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm">{opportunity}</span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-center">
        <Button variant="outline" onClick={onBackToList}>
          Voltar para Lista de Perfis
        </Button>
      </div>
    </div>
  );
};
