
import React, { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SurveyBuilder } from '@/components/surveys/SurveyBuilder';
import { RealTimeSurveyAnalytics } from '@/components/surveys/RealTimeSurveyAnalytics';
import { Survey, SurveyAnalytics } from '@/types/surveys';
import { Plus, BarChart3, Users, Clock, MessageSquare, Star, TrendingUp, Activity, Calendar, PieChart, Target, Award, Brain, Shield, FileText, CheckCircle, Copy, Download, Eye, Search, Filter, ArrowUpDown, Zap, Globe, Sparkles } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export const ModernSurveys = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('surveys');
  const [editingSurvey, setEditingSurvey] = useState<Survey | undefined>();
  const [showBuilder, setShowBuilder] = useState(false);
  const [selectedSurveyForAnalytics, setSelectedSurveyForAnalytics] = useState<Survey | undefined>();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Survey Templates Data
  const surveyTemplates = [
    {
      id: 'template-1',
      title: 'Pesquisa de Clima Organizacional',
      description: 'Avalie o ambiente de trabalho, cultura empresarial e satisfação dos colaboradores',
      category: 'climate',
      difficulty: 'intermediate',
      duration: '10-15 min',
      questions: 25,
      rating: 4.8,
      uses: 1247,
      features: ['Análise de Sentimento', 'Relatório Automático', 'Benchmarking'],
      tags: ['clima', 'satisfação', 'cultura', 'rh'],
      icon: '🌤️'
    },
    {
      id: 'template-2',
      title: 'Avaliação de Treinamento',
      description: 'Meça a eficácia e o impacto dos programas de treinamento e desenvolvimento',
      category: 'training',
      difficulty: 'easy',
      duration: '5-8 min',
      questions: 15,
      rating: 4.6,
      uses: 892,
      features: ['Medição de ROI', 'Análise de Aprendizado', 'Certificados'],
      tags: ['treinamento', 'desenvolvimento', 'aprendizado', 'avaliação'],
      icon: '📚'
    },
    {
      id: 'template-3',
      title: 'Feedback 360°',
      description: 'Coleta feedback completo de supervisores, pares e subordinados',
      category: 'feedback',
      difficulty: 'advanced',
      duration: '15-20 min',
      questions: 35,
      rating: 4.9,
      uses: 634,
      features: ['Análise Multidirecional', 'Gráficos Radar', 'Plano de Desenvolvimento'],
      tags: ['feedback', '360', 'avaliação', 'desenvolvimento'],
      icon: '🎯'
    },
    {
      id: 'template-4',
      title: 'Pesquisa de Engajamento',
      description: 'Identifique níveis de motivação e comprometimento dos funcionários',
      category: 'engagement',
      difficulty: 'intermediate',
      duration: '8-12 min',
      questions: 20,
      rating: 4.7,
      uses: 1056,
      features: ['Índice de Engajamento', 'Análise Preditiva', 'Alertas de Risco'],
      tags: ['engajamento', 'motivação', 'comprometimento', 'retenção'],
      icon: '⚡'
    },
    {
      id: 'template-5',
      title: 'Onboarding Experience',
      description: 'Avalie a experiência de integração de novos colaboradores',
      category: 'onboarding',
      difficulty: 'easy',
      duration: '6-10 min',
      questions: 18,
      rating: 4.5,
      uses: 723,
      features: ['Melhoria Contínua', 'Tracking de Progresso', 'Insights Personalizados'],
      tags: ['onboarding', 'integração', 'novos', 'experiência'],
      icon: '🚀'
    },
    {
      id: 'template-6',
      title: 'Bem-estar no Trabalho',
      description: 'Monitore a saúde mental e física dos colaboradores',
      category: 'wellness',
      difficulty: 'intermediate',
      duration: '12-18 min',
      questions: 28,
      rating: 4.8,
      uses: 945,
      features: ['Índice de Bem-estar', 'Recomendações Personalizadas', 'Alertas de Saúde'],
      tags: ['bem-estar', 'saúde', 'mental', 'física'],
      icon: '🧘'
    },
    {
      id: 'template-7',
      title: 'Diversidade e Inclusão',
      description: 'Avalie práticas de diversidade e inclusão na organização',
      category: 'diversity',
      difficulty: 'advanced',
      duration: '15-25 min',
      questions: 32,
      rating: 4.9,
      uses: 567,
      features: ['Análise de Bias', 'Índices de Inclusão', 'Benchmarking DEI'],
      tags: ['diversidade', 'inclusão', 'equidade', 'cultura'],
      icon: '🌈'
    },
    {
      id: 'template-8',
      title: 'Satisfação do Cliente Interno',
      description: 'Meça a satisfação entre departamentos e áreas',
      category: 'satisfaction',
      difficulty: 'intermediate',
      duration: '10-15 min',
      questions: 22,
      rating: 4.6,
      uses: 678,
      features: ['Net Promoter Score', 'Análise de Relacionamento', 'Mapas de Calor'],
      tags: ['satisfação', 'cliente interno', 'departamentos', 'relacionamento'],
      icon: '🤝'
    }
  ];

  // Template Categories
  const templateCategories = [
    { id: 'all', name: 'Todos os Templates', count: surveyTemplates.length },
    { id: 'climate', name: 'Clima Organizacional', count: surveyTemplates.filter(t => t.category === 'climate').length },
    { id: 'training', name: 'Treinamento', count: surveyTemplates.filter(t => t.category === 'training').length },
    { id: 'feedback', name: 'Feedback', count: surveyTemplates.filter(t => t.category === 'feedback').length },
    { id: 'engagement', name: 'Engajamento', count: surveyTemplates.filter(t => t.category === 'engagement').length },
    { id: 'onboarding', name: 'Onboarding', count: surveyTemplates.filter(t => t.category === 'onboarding').length },
    { id: 'wellness', name: 'Bem-estar', count: surveyTemplates.filter(t => t.category === 'wellness').length },
    { id: 'diversity', name: 'Diversidade', count: surveyTemplates.filter(t => t.category === 'diversity').length },
    { id: 'satisfaction', name: 'Satisfação', count: surveyTemplates.filter(t => t.category === 'satisfaction').length }
  ];

  // Helper functions
  const filteredTemplates = surveyTemplates.filter(template => {
    const matchesSearch = template.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'advanced': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getDifficultyText = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'Fácil';
      case 'intermediate': return 'Intermediário';
      case 'advanced': return 'Avançado';
      default: return difficulty;
    }
  };

  const useTemplate = (templateId: string) => {
    const template = surveyTemplates.find(t => t.id === templateId);
    if (template) {
      toast({
        title: 'Template Selecionado',
        description: `Usando template: ${template.title}`,
      });
      setShowBuilder(true);
    }
  };

  const previewTemplate = (templateId: string) => {
    const template = surveyTemplates.find(t => t.id === templateId);
    if (template) {
      toast({
        title: 'Preview do Template',
        description: `Visualizando: ${template.title}`,
      });
    }
  };

  // Mock data
  const mockSurveys: Survey[] = [
    {
      id: '1',
      title: 'Pesquisa de Clima Organizacional 2024',
      description: 'Avaliação anual do clima organizacional da empresa',
      type: 'climate',
      status: 'active',
      questions: [],
      target_audience: ['all'],
      start_date: '2024-01-15T09:00:00Z',
      end_date: '2024-02-15T18:00:00Z',
      anonymous: true,
      created_by: 'admin',
      created_at: '2024-01-10T10:00:00Z',
      updated_at: '2024-01-10T10:00:00Z'
    },
    {
      id: '2',
      title: 'Feedback sobre Treinamento de Liderança',
      description: 'Avaliação do treinamento de liderança realizado em janeiro',
      type: 'feedback',
      status: 'completed',
      questions: [],
      target_audience: ['leaders'],
      start_date: '2024-01-20T09:00:00Z',
      end_date: '2024-01-25T18:00:00Z',
      anonymous: false,
      created_by: 'admin',
      created_at: '2024-01-18T14:00:00Z',
      updated_at: '2024-01-25T18:00:00Z'
    }
  ];

  const mockAnalytics: SurveyAnalytics = {
    total_responses: 89,
    completion_rate: 67.5,
    average_completion_time: 420,
    real_time_responses: [
      {
        id: '1',
        survey_id: '1',
        answers: [],
        completed_at: new Date(Date.now() - 300000).toISOString()
      },
      {
        id: '2',
        survey_id: '1',
        answers: [],
        completed_at: new Date(Date.now() - 600000).toISOString()
      }
    ],
    sentiment_analysis: {
      positive: 65,
      neutral: 25,
      negative: 10
    },
    response_trends: [
      { date: '2024-01-15', count: 12 },
      { date: '2024-01-16', count: 18 },
      { date: '2024-01-17', count: 25 },
      { date: '2024-01-18', count: 22 },
      { date: '2024-01-19', count: 15 }
    ]
  };

  const handleSaveSurvey = (survey: Survey) => {
    console.log('Salvando pesquisa:', survey);
    toast({
      title: "Pesquisa salva",
      description: "Pesquisa criada com sucesso!"
    });
    setShowBuilder(false);
    setEditingSurvey(undefined);
  };

  const handlePreviewSurvey = (survey: Survey) => {
    console.log('Visualizando pesquisa:', survey);
    toast({
      title: "Gerando preview",
      description: "Preview da pesquisa será exibido em breve."
    });
  };

  const editSurvey = (survey: Survey) => {
    setEditingSurvey(survey);
    setShowBuilder(true);
  };

  const createNewSurvey = () => {
    setEditingSurvey(undefined);
    setShowBuilder(true);
  };

  const viewAnalytics = (survey: Survey) => {
    setSelectedSurveyForAnalytics(survey);
    setActiveTab('analytics');
  };

  if (showBuilder) {
    return (
      <DashboardLayout>
        <SurveyBuilder
          survey={editingSurvey}
          onSave={handleSaveSurvey}
          onPreview={handlePreviewSurvey}
        />
      </DashboardLayout>
    );
  }

  if (selectedSurveyForAnalytics) {
    return (
      <DashboardLayout>
        <div className="space-y-4">
          <Button 
            variant="outline" 
            onClick={() => {
              setSelectedSurveyForAnalytics(undefined);
              setActiveTab('surveys');
            }}
          >
            ← Voltar para Pesquisas
          </Button>
          <RealTimeSurveyAnalytics
            survey={selectedSurveyForAnalytics}
            analytics={mockAnalytics}
            isLive={selectedSurveyForAnalytics.status === 'active'}
          />
        </div>
      </DashboardLayout>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'completed': return 'bg-blue-500';
      case 'draft': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'Ativa';
      case 'completed': return 'Finalizada';
      case 'draft': return 'Rascunho';
      default: return status;
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-4 xs:space-y-6">
        <div className="flex flex-col xs:flex-row xs:items-start xs:justify-between gap-4 xs:gap-6">
          <div>
            <h1 className="text-2xl xs:text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">Pesquisas Inteligentes</h1>
            <p className="text-xs xs:text-sm text-muted-foreground mt-1">
              Crie pesquisas com análise em tempo real
            </p>
          </div>
          <Button 
            onClick={createNewSurvey}
            className="text-xs xs:text-sm w-full xs:w-auto whitespace-nowrap"
          >
            <Plus className="h-3 xs:h-4 w-3 xs:w-4 mr-1 xs:mr-2" />
            <span className="hidden xs:inline">Nova Pesquisa</span>
            <span className="xs:hidden">Nova</span>
          </Button>
        </div>

        {/* Stats Overview */}
        <div className="grid gap-3 xs:gap-4 grid-cols-2 xs:grid-cols-2 sm:grid-cols-4">
          <Card className="dark:bg-gray-800 dark:border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 xs:pb-3">
              <CardTitle className="text-xs xs:text-sm font-medium">Pesquisas Ativas</CardTitle>
              <BarChart3 className="h-3 xs:h-4 w-3 xs:w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-lg xs:text-2xl font-bold">
                {mockSurveys.filter(s => s.status === 'active').length}
              </div>
            </CardContent>
          </Card>
          
          <Card className="dark:bg-gray-800 dark:border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 xs:pb-3">
              <CardTitle className="text-xs xs:text-sm font-medium">Respostas Totais</CardTitle>
              <Users className="h-3 xs:h-4 w-3 xs:w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-lg xs:text-2xl font-bold">{mockAnalytics.total_responses}</div>
            </CardContent>
          </Card>
          
          <Card className="dark:bg-gray-800 dark:border-gray-700 col-span-1">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 xs:pb-3">
              <CardTitle className="text-xs xs:text-sm font-medium">Taxa</CardTitle>
              <Clock className="h-3 xs:h-4 w-3 xs:w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-lg xs:text-2xl font-bold">{mockAnalytics.completion_rate}%</div>
            </CardContent>
          </Card>
          
          <Card className="dark:bg-gray-800 dark:border-gray-700 col-span-1">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 xs:pb-3">
              <CardTitle className="text-xs xs:text-sm font-medium">Positivo</CardTitle>
              <MessageSquare className="h-3 xs:h-4 w-3 xs:w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-lg xs:text-2xl font-bold text-green-600">
                {mockAnalytics.sentiment_analysis.positive}%
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-3 xs:space-y-4">
          <TabsList className="dark:bg-gray-800 dark:border-gray-700 w-full xs:w-auto overflow-x-auto">
            <TabsTrigger value="surveys" className="text-xs xs:text-sm dark:text-white">Minhas Pesquisas</TabsTrigger>
            <TabsTrigger value="templates" className="text-xs xs:text-sm dark:text-white">Templates</TabsTrigger>
            <TabsTrigger value="analytics" className="text-xs xs:text-sm dark:text-white">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="surveys" className="space-y-4">
            <div className="space-y-4">
              {mockSurveys.map((survey) => (
                <Card key={survey.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-lg">{survey.title}</h3>
                          <Badge className={getStatusColor(survey.status)}>
                            {getStatusText(survey.status)}
                          </Badge>
                          {survey.status === 'active' && (
                            <Badge variant="secondary" className="animate-pulse">
                              <div className="w-2 h-2 bg-green-500 rounded-full mr-1"></div>
                              Ao vivo
                            </Badge>
                          )}
                        </div>
                        <p className="text-muted-foreground">{survey.description}</p>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span>📊 {survey.type}</span>
                          <span>👥 {survey.anonymous ? 'Anônima' : 'Identificada'}</span>
                          <span>📅 {new Date(survey.start_date).toLocaleDateString('pt-BR')}</span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => editSurvey(survey)}>
                          Editar
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => viewAnalytics(survey)}>
                          <BarChart3 className="h-4 w-4 mr-1" />
                          Analytics
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="templates" className="space-y-6">
            {/* Templates Header */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Templates de Pesquisa
                </CardTitle>
                <p className="text-muted-foreground">
                  Escolha entre nossos templates profissionais para criar pesquisas eficazes rapidamente
                </p>
              </CardHeader>
            </Card>

            {/* Search and Filters */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4">
                  {/* Search */}
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <input
                        type="text"
                        placeholder="Buscar templates..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-9 pr-4 py-2 w-full border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                  </div>
                  
                  {/* Category Filter */}
                  <div className="flex-none">
                    <select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      {templateCategories.map(category => (
                        <option key={category.id} value={category.id}>
                          {category.name} ({category.count})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Templates Grid */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredTemplates.map((template) => (
                <Card key={template.id} className="group hover:shadow-lg transition-all duration-200 bg-white dark:bg-gray-800">
                  <CardHeader className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="text-2xl">{template.icon}</div>
                        <div>
                          <h3 className="font-semibold text-lg leading-tight">{template.title}</h3>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge className={getDifficultyColor(template.difficulty)}>
                              {getDifficultyText(template.difficulty)}
                            </Badge>
                            <div className="flex items-center gap-1 text-sm text-muted-foreground">
                              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                              {template.rating}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {template.description}
                    </p>
                    
                    {/* Template Stats */}
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {template.duration}
                      </span>
                      <span className="flex items-center gap-1">
                        <MessageSquare className="h-3 w-3" />
                        {template.questions} perguntas
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        {template.uses} usos
                      </span>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    {/* Features */}
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium text-muted-foreground">Recursos Inclusos:</h4>
                      <div className="flex flex-wrap gap-1">
                        {template.features.map((feature, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            {feature}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    {/* Tags */}
                    <div className="flex flex-wrap gap-1">
                      {template.tags.map((tag, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          #{tag}
                        </Badge>
                      ))}
                    </div>
                    
                    {/* Actions */}
                    <div className="flex gap-2 pt-2">
                      <Button 
                        size="sm" 
                        className="flex-1"
                        onClick={() => useTemplate(template.id)}
                      >
                        <Copy className="h-4 w-4 mr-1" />
                        Usar Template
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => previewTemplate(template.id)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* No Results */}
            {filteredTemplates.length === 0 && (
              <Card>
                <CardContent className="py-12 text-center">
                  <Search className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                  <h3 className="text-lg font-semibold mb-2">Nenhum template encontrado</h3>
                  <p className="text-muted-foreground">
                    Tente ajustar sua busca ou filtros para encontrar templates relevantes
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            {/* Global Analytics Header */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5" />
                  Analytics Globais
                </CardTitle>
                <p className="text-muted-foreground">
                  Visão consolidada de todas as pesquisas com insights avançados e análise preditiva
                </p>
              </CardHeader>
            </Card>

            {/* Key Metrics Overview */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total de Respostas</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">1,247</div>
                  <p className="text-xs text-muted-foreground">
                    <span className="text-green-600">+12%</span> este mês
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Taxa de Conclusão</CardTitle>
                  <Target className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">87.3%</div>
                  <p className="text-xs text-muted-foreground">
                    <span className="text-green-600">+2.4%</span> vs. trimestre anterior
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Engajamento Médio</CardTitle>
                  <Activity className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">94.7%</div>
                  <p className="text-xs text-muted-foreground">
                    <span className="text-green-600">+5.1%</span> engajamento ativo
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Satisfação Geral</CardTitle>
                  <Award className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">4.6/5</div>
                  <p className="text-xs text-muted-foreground">
                    <span className="text-green-600">+0.3</span> pontos
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Analytics Dashboard */}
            <div className="grid gap-6 lg:grid-cols-2">
              {/* Trend Analysis */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Tendências de Resposta
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Últimos 30 dias</span>
                      <Badge variant="secondary">+15% crescimento</Badge>
                    </div>
                    <div className="grid grid-cols-7 gap-1">
                      {[67, 82, 91, 76, 89, 95, 88].map((value, index) => (
                        <div key={index} className="text-center">
                          <div className="h-20 bg-gray-200 dark:bg-gray-700 rounded-sm relative">
                            <div 
                              className="absolute bottom-0 left-0 right-0 bg-primary rounded-sm"
                              style={{ height: `${value}%` }}
                            />
                          </div>
                          <span className="text-xs text-muted-foreground mt-1">
                            {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'][index]}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Sentiment Analysis */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Brain className="h-5 w-5" />
                    Análise de Sentimento
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Positivo</span>
                      <div className="flex items-center gap-2">
                        <div className="w-32 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div className="bg-green-500 h-2 rounded-full" style={{ width: '68%' }} />
                        </div>
                        <span className="text-sm font-medium">68%</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Neutro</span>
                      <div className="flex items-center gap-2">
                        <div className="w-32 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '25%' }} />
                        </div>
                        <span className="text-sm font-medium">25%</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Negativo</span>
                      <div className="flex items-center gap-2">
                        <div className="w-32 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div className="bg-red-500 h-2 rounded-full" style={{ width: '7%' }} />
                        </div>
                        <span className="text-sm font-medium">7%</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Top Performing Surveys */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Star className="h-5 w-5" />
                    Pesquisas com Melhor Performance
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      { name: 'Clima Organizacional Q1', completion: 94, responses: 156 },
                      { name: 'Feedback de Treinamento', completion: 89, responses: 134 },
                      { name: 'Engajamento Remoto', completion: 87, responses: 98 },
                      { name: 'Onboarding Experience', completion: 85, responses: 76 }
                    ].map((survey, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                        <div>
                          <p className="font-medium text-sm">{survey.name}</p>
                          <p className="text-xs text-muted-foreground">{survey.responses} respostas</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-sm">{survey.completion}%</p>
                          <p className="text-xs text-muted-foreground">conclusão</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Response Time Analysis */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    Análise de Tempo de Resposta
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Tempo médio</span>
                      <span className="font-medium">7min 23s</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Tempo ideal</span>
                      <span className="font-medium">5-10min</span>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Distribuição por tempo</span>
                      </div>
                      <div className="grid grid-cols-4 gap-2 text-xs">
                        <div className="text-center">
                          <div className="h-8 bg-blue-500 rounded-sm mb-1" />
                          <span>0-5min</span>
                          <div className="font-medium">23%</div>
                        </div>
                        <div className="text-center">
                          <div className="h-12 bg-green-500 rounded-sm mb-1" />
                          <span>5-10min</span>
                          <div className="font-medium">45%</div>
                        </div>
                        <div className="text-center">
                          <div className="h-6 bg-yellow-500 rounded-sm mb-1" />
                          <span>10-15min</span>
                          <div className="font-medium">24%</div>
                        </div>
                        <div className="text-center">
                          <div className="h-4 bg-red-500 rounded-sm mb-1" />
                          <span>15min+</span>
                          <div className="font-medium">8%</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* AI Insights */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5" />
                  Insights Inteligentes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Shield className="h-4 w-4 text-blue-600" />
                      <span className="font-medium text-sm">Oportunidade de Melhoria</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Pesquisas com mais de 20 perguntas têm 15% menos taxa de conclusão. 
                      Considere dividir em seções menores.
                    </p>
                  </div>
                  
                  <div className="p-4 bg-green-50 dark:bg-green-950 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingUp className="h-4 w-4 text-green-600" />
                      <span className="font-medium text-sm">Tendência Positiva</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Engajamento aumentou 12% após implementação de pesquisas anônimas. 
                      Continue este padrão.
                    </p>
                  </div>
                  
                  <div className="p-4 bg-yellow-50 dark:bg-yellow-950 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Calendar className="h-4 w-4 text-yellow-600" />
                      <span className="font-medium text-sm">Timing Ideal</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Terças e quartas-feiras às 14h têm as melhores taxas de resposta. 
                      Agende pesquisas nestes horários.
                    </p>
                  </div>
                  
                  <div className="p-4 bg-purple-50 dark:bg-purple-950 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Brain className="h-4 w-4 text-purple-600" />
                      <span className="font-medium text-sm">Previsão IA</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Baseado nos padrões atuais, próxima pesquisa de clima terá 
                      taxa de conclusão estimada em 91%.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Export and Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Relatórios e Exportação
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Exportar PDF
                  </Button>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Exportar Excel
                  </Button>
                  <Button variant="outline" size="sm">
                    <Calendar className="h-4 w-4 mr-2" />
                    Relatório Agendado
                  </Button>
                  <Button variant="outline" size="sm">
                    <BarChart3 className="h-4 w-4 mr-2" />
                    Dashboard Personalizado
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};
