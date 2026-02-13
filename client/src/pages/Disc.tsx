
import React, { useState, useCallback, useMemo } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { DiscDashboard } from '@/components/disc/DiscDashboard';
import { DiscAssessment } from '@/components/disc/DiscAssessment';
import { DiscResults } from '@/components/disc/DiscResults';
import { DiscProfile, DiscAnswer, DiscReport } from '@/types/disc';
import { discService } from '@/services/discService';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

type ViewState = 'dashboard' | 'assessment' | 'results';

export const Disc = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [currentView, setCurrentView] = useState<ViewState>('dashboard');
  const [currentProfile, setCurrentProfile] = useState<DiscProfile | null>(null);
  const [currentReport, setCurrentReport] = useState<DiscReport | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleStartAssessment = useCallback(() => {
    setCurrentView('assessment');
    setCurrentProfile(null);
    setCurrentReport(null);
  }, []);

  const handleAssessmentComplete = useCallback(async (answers: DiscAnswer[]) => {
    if (isProcessing) return;
    
    setIsProcessing(true);
    try {
      if (!answers || answers.length === 0) {
        throw new Error('Respostas inválidas');
      }

      // Calcular perfil baseado nas respostas
      const profile = discService.calculateProfile(answers);
      
      // Gerar relatório completo
      const report = discService.generateReport(profile);

      // Salvar no banco de dados se houver usuário
      if (user?.id) {
        await discService.saveProfile(profile, user.id);
      }

      setCurrentProfile(profile);
      setCurrentReport(report);
      setCurrentView('results');

      toast({
        title: "Análise Concluída!",
        description: "Seu perfil DISC foi gerado com sucesso."
      });
    } catch (error) {
      console.error('Erro ao processar análise:', error);
      toast({
        title: "Erro",
        description: "Não foi possível processar sua análise. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  }, [isProcessing, user?.id, toast]);

  const handleCancelAssessment = useCallback(() => {
    setCurrentView('dashboard');
    setCurrentProfile(null);
    setCurrentReport(null);
  }, []);

  const handleViewProfile = useCallback((profile: DiscProfile) => {
    try {
      const report = discService.generateReport(profile);
      setCurrentProfile(profile);
      setCurrentReport(report);
      setCurrentView('results');
    } catch (error) {
      console.error('Erro ao visualizar perfil:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar o perfil.",
        variant: "destructive"
      });
    }
  }, [toast]);

  const getStyleName = useCallback((style: string) => {
    const names = {
      D: 'Dominante',
      I: 'Influente', 
      S: 'Estável',
      C: 'Consciencioso'
    };
    return names[style as keyof typeof names] || style;
  }, []);

  const getStyleColor = useCallback((style: string) => {
    const colors = {
      D: '#dc2626',
      I: '#eab308',
      S: '#16a34a',
      C: '#2563eb'
    };
    return colors[style as keyof typeof colors] || '#6b7280';
  }, []);

  const generateReportHTML = useCallback((profile: DiscProfile, report: DiscReport): string => {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>Relatório DISC - ${getStyleName(profile.primary_style)}</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 40px; color: #333; }
          .header { text-align: center; margin-bottom: 40px; }
          .profile-badge { display: inline-block; padding: 10px 20px; border-radius: 10px; color: white; font-weight: bold; }
          .section { margin-bottom: 30px; }
          .scores { display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; }
          .score-item { padding: 15px; border: 1px solid #ddd; border-radius: 8px; }
          .insights { background: #f8f9ff; padding: 20px; border-radius: 8px; margin: 20px 0; }
          ul { padding-left: 20px; }
          li { margin-bottom: 8px; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>Relatório de Análise DISC</h1>
          <div class="profile-badge" style="background: ${getStyleColor(profile.primary_style)}">
            Perfil ${profile.primary_style} - ${getStyleName(profile.primary_style)}
          </div>
          <p>Data: ${new Date(profile.completed_at).toLocaleDateString('pt-BR')}</p>
        </div>

        <div class="section">
          <h2>Pontuações por Categoria</h2>
          <div class="scores">
            <div class="score-item">
              <h3>Dominância: ${profile.dominance}%</h3>
              <div style="background: #dc2626; height: 10px; width: ${profile.dominance}%; border-radius: 5px;"></div>
            </div>
            <div class="score-item">
              <h3>Influência: ${profile.influence}%</h3>
              <div style="background: #eab308; height: 10px; width: ${profile.influence}%; border-radius: 5px;"></div>
            </div>
            <div class="score-item">
              <h3>Estabilidade: ${profile.steadiness}%</h3>
              <div style="background: #16a34a; height: 10px; width: ${profile.steadiness}%; border-radius: 5px;"></div>
            </div>
            <div class="score-item">
              <h3>Conformidade: ${profile.conscientiousness}%</h3>
              <div style="background: #2563eb; height: 10px; width: ${profile.conscientiousness}%; border-radius: 5px;"></div>
            </div>
          </div>
        </div>

        <div class="section">
          <h2>Análise Detalhada</h2>
          <p>${report.detailed_analysis}</p>
        </div>

        <div class="insights">
          <h2>Insights de Inteligência Artificial</h2>
          ${profile.insights.map(insight => `
            <div style="margin-bottom: 20px; padding: 15px; background: white; border-radius: 8px;">
              <h3>${insight.category}</h3>
              <p>${insight.description}</p>
              <p><strong>IA Prevê:</strong> ${insight.ai_prediction}</p>
            </div>
          `).join('')}
        </div>

        <div class="section">
          <h2>Recomendações de Carreira</h2>
          <ul>
            ${report.career_recommendations.map(rec => `<li>${rec}</li>`).join('')}
          </ul>
        </div>

        <div class="section">
          <h2>Estilo de Liderança</h2>
          <p>${report.leadership_style}</p>
        </div>

        <div class="section">
          <h2>Compatibilidade em Equipe</h2>
          <p>${report.team_compatibility}</p>
        </div>

        <div class="section">
          <h2>Oportunidades de Crescimento</h2>
          <ul>
            ${report.growth_opportunities.map(opp => `<li>${opp}</li>`).join('')}
          </ul>
        </div>
      </body>
      </html>
    `;
  }, [getStyleName, getStyleColor]);

  const handleDownloadReport = useCallback(() => {
    if (!currentProfile || !currentReport) {
      toast({
        title: "Erro",
        description: "Nenhum relatório disponível para download.",
        variant: "destructive"
      });
      return;
    }

    try {
      const reportContent = generateReportHTML(currentProfile, currentReport);
      const blob = new Blob([reportContent], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `disc-profile-${currentProfile.primary_style}-${new Date().toISOString().split('T')[0]}.html`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast({
        title: "Download Iniciado",
        description: "Seu relatório está sendo baixado."
      });
    } catch (error) {
      console.error('Erro ao fazer download:', error);
      toast({
        title: "Erro",
        description: "Não foi possível fazer o download do relatório.",
        variant: "destructive"
      });
    }
  }, [currentProfile, currentReport, generateReportHTML, toast]);

  const handleShareResults = useCallback(async () => {
    if (!currentProfile) {
      toast({
        title: "Erro",
        description: "Nenhum perfil disponível para compartilhar.",
        variant: "destructive"
      });
      return;
    }

    try {
      const shareText = `Acabei de descobrir que tenho perfil ${currentProfile.primary_style} (${getStyleName(currentProfile.primary_style)}) na análise DISC! 🧠✨`;
      
      if (navigator.share) {
        await navigator.share({
          title: 'Meu Perfil DISC',
          text: shareText,
          url: window.location.href
        });
      } else {
        await navigator.clipboard.writeText(shareText);
        toast({
          title: "Copiado!",
          description: "Texto copiado para a área de transferência."
        });
      }
    } catch (error) {
      console.error('Erro ao compartilhar:', error);
      toast({
        title: "Erro",
        description: "Não foi possível compartilhar os resultados.",
        variant: "destructive"
      });
    }
  }, [currentProfile, getStyleName, toast]);

  const handleBackToList = useCallback(() => {
    setCurrentView('dashboard');
    setCurrentProfile(null);
    setCurrentReport(null);
  }, []);

  const renderCurrentView = useMemo(() => {
    switch (currentView) {
      case 'dashboard':
        return (
          <DiscDashboard
            onStartAssessment={handleStartAssessment}
            onViewProfile={handleViewProfile}
          />
        );
      case 'assessment':
        return (
          <DiscAssessment
            onComplete={handleAssessmentComplete}
            onCancel={handleCancelAssessment}
          />
        );
      case 'results':
        if (currentProfile && currentReport) {
          return (
            <DiscResults
              profile={currentProfile}
              report={currentReport}
              onDownloadReport={handleDownloadReport}
              onShareResults={handleShareResults}
              onBackToList={handleBackToList}
            />
          );
        }
        return null;
      default:
        return null;
    }
  }, [
    currentView,
    currentProfile,
    currentReport,
    handleStartAssessment,
    handleViewProfile,
    handleAssessmentComplete,
    handleCancelAssessment,
    handleDownloadReport,
    handleShareResults,
    handleBackToList
  ]);

  return (
    <DashboardLayout>
      {renderCurrentView}
    </DashboardLayout>
  );
};
