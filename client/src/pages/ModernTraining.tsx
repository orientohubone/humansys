import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Sparkles, 
  BookOpen, 
  PlayCircle, 
  Users, 
  Target,
  Brain,
  TrendingUp,
  Clock,
  Star,
  Plus,
  RefreshCw
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { PageTransition, TabTransition, StaggerContainer, StaggerItem } from '@/components/common/PageTransition';

// Lazy load training components para melhor performance
const AITrainingGenerator = React.lazy(() => 
  import('@/components/training/AITrainingGenerator').then(module => ({ default: module.AITrainingGenerator }))
);
const ModernTrainingCard = React.lazy(() => 
  import('@/components/training/ModernTrainingCard').then(module => ({ default: module.ModernTrainingCard }))
);
const InteractiveSimulation = React.lazy(() => 
  import('@/components/training/InteractiveSimulation').then(module => ({ default: module.InteractiveSimulation }))
);

interface TrainingData {
  id: string;
  title: string;
  description: string;
  instructor?: string;
  duration: string;
  participants: number;
  rating?: number;
  thumbnail?: string;
  category?: string;
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  training_type?: 'course' | 'simulation' | 'workshop';
  ai_generated?: boolean;
  learning_objectives?: string[];
  content_modules?: any[];
  simulations?: any[];
}

interface OrganizationalContext {
  industry: string;
  company_size: string;
  communication_style: string;
  training_priorities: string[];
  common_challenges: string[];
}

// Optimize with React.memo for better performance
const ModernTrainingComponent: React.FC = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<string>('browse');
  const [trainings, setTrainings] = useState<TrainingData[]>([]);
  const [organizationalContext, setOrganizationalContext] = useState<OrganizationalContext | null>(null);
  const [selectedSimulation, setSelectedSimulation] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Memoized loading functions para evitar re-renders desnecessários
  const loadTrainings = useCallback(async (showRefreshing = false) => {
    if (!user?.id) {
      setTrainings([]);
      setIsLoading(false);
      return;
    }

    if (showRefreshing) {
      setRefreshing(true);
    } else {
      setIsLoading(true);
    }

    try {
      const response = await fetch(`/api/trainings?userId=${user.id}`);
      if (response.ok) {
        const data = await response.json();
        setTrainings(data);
      }
    } catch (error) {
      console.error('Erro ao carregar treinamentos:', error);
      setTrainings([]);
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  }, [user?.id]);

  const loadOrganizationalContext = useCallback(async () => {
    if (!user?.id) return;
    
    try {
      const response = await fetch(`/api/organizational-context?userId=${user.id}`);
      if (response.ok) {
        const data = await response.json();
        setOrganizationalContext(data);
      }
    } catch (error) {
      console.error('Erro ao carregar contexto organizacional:', error);
    }
  }, [user?.id]);

  useEffect(() => {
    if (user?.id) {
      loadTrainings();
      loadOrganizationalContext();
    }
  }, [user?.id, loadTrainings, loadOrganizationalContext]);

  // Memoized handlers para melhor performance
  const handleGenerateTraining = useCallback(async (generatedTraining: any) => {
    if (!user?.id) return;
    
    try {
      const response = await fetch('/api/trainings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          user_id: user.id,
          title: generatedTraining.title,
          description: generatedTraining.description,
          duration: generatedTraining.estimated_completion_time,
          instructor: 'IA HumanSys',
          category: generatedTraining.organizational_context?.industry || 'Geral',
          difficulty: generatedTraining.difficulty_level,
          training_type: generatedTraining.training_type,
          participants: 0,
          ai_generated: true,
          learning_objectives: generatedTraining.learning_objectives,
          content_modules: generatedTraining.content_modules,
          simulations: generatedTraining.simulations,
          assessment_criteria: generatedTraining.assessment_criteria,
          organizational_context: generatedTraining.organizational_context
        })
      });

      if (response.ok) {
        toast({
          title: "Treinamento criado com sucesso!",
          description: "O novo treinamento foi adicionado à sua biblioteca.",
        });
        
        await loadTrainings();
        setActiveTab('browse');
      }
    } catch (error) {
      console.error('Erro ao salvar treinamento:', error);
      toast({
        title: "Erro ao salvar",
        description: "Não foi possível salvar o treinamento. Tente novamente.",
        variant: "destructive"
      });
    }
  }, [user?.id, loadTrainings, toast]);

  const handleRefresh = useCallback(() => {
    loadTrainings(true);
  }, [loadTrainings]);

  const handleStartTraining = useCallback(async (training: TrainingData) => {
    if (!user?.id) {
      toast({
        title: "Erro",
        description: "Usuário não autenticado",
        variant: "destructive"
      });
      return;
    }

    // Check enrollment status
    const enrollment = training.enrollment || { status: 'not-enrolled' };
    
    try {
      // If not enrolled, create enrollment first
      if (enrollment.status === 'not-enrolled') {
        const enrollmentResponse = await fetch('/api/training-enrollments', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            training_id: training.id,
            user_id: user.id,
            status: 'enrolled',
            progress: 0
          }),
        });

        if (!enrollmentResponse.ok) {
          const errorData = await enrollmentResponse.json();
          throw new Error(errorData.error || 'Failed to enroll in training');
        }

        toast({
          title: "Inscrição realizada!",
          description: `Você foi inscrito no treinamento: ${training.title}`,
        });

        // Refresh trainings to update enrollment status
        await loadTrainings();
        return;
      }

      // If enrolled or in progress, start the training
      if (training.simulations && training.simulations.length > 0) {
        setSelectedSimulation(training.simulations[0]);
      } else {
        toast({
          title: "Treinamento iniciado",
          description: `Continuando o treinamento: ${training.title}`,
        });
      }
    } catch (error) {
      console.error('Error handling training start:', error);
      toast({
        title: "Erro",
        description: error instanceof Error ? error.message : "Erro ao processar inscrição",
        variant: "destructive"
      });
    }
  }, [user?.id, toast, loadTrainings]);

  const handleSimulationComplete = useCallback((results: any) => {
    toast({
      title: "Simulação concluída!",
      description: `Pontuação: ${results.score}% (${results.correctAnswers}/${results.totalQuestions})`,
    });
    setSelectedSimulation(null);
  }, [toast]);

  const handleSimulationClose = useCallback(() => {
    setSelectedSimulation(null);
  }, []);

  // Memoized training cards para performance
  const trainingCards = useMemo(() => {
    if (!trainings.length) return [];
    
    return trainings.map((training) => (
      <React.Suspense key={training.id} fallback={<div className="h-48 bg-gray-100 animate-pulse rounded-lg" />}>
        <ModernTrainingCard
          training={training}
          onStart={() => handleStartTraining(training)}
        />
      </React.Suspense>
    ));
  }, [trainings, handleStartTraining]);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-100';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-950 dark:text-yellow-100';
      case 'advanced': return 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-100';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-950 dark:text-gray-100';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'course': return <BookOpen className="h-4 w-4" />;
      case 'simulation': return <PlayCircle className="h-4 w-4" />;
      case 'workshop': return <Users className="h-4 w-4" />;
      default: return <BookOpen className="h-4 w-4" />;
    }
  };

  if (selectedSimulation) {
    return (
      <DashboardLayout>
        <React.Suspense fallback={<div className="flex items-center justify-center h-96"><RefreshCw className="h-8 w-8 animate-spin" /></div>}>
          <InteractiveSimulation
            simulation={selectedSimulation}
            onComplete={handleSimulationComplete}
            onClose={handleSimulationClose}
          />
        </React.Suspense>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <PageTransition>
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Treinamentos</h1>
              <p className="text-muted-foreground">
                Gerencie cursos e desenvolvimento de competências
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                onClick={handleRefresh}
                variant="outline"
                size="sm"
                disabled={refreshing}
              >
                <RefreshCw className={`mr-2 h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
                Atualizar
              </Button>
              <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                <Sparkles className="mr-1 h-3 w-3" />
                Novo Treinamento
              </Badge>
            </div>
          </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6 text-center">
            <div className="text-2xl font-bold text-blue-600">{trainings.length}</div>
            <p className="text-sm text-muted-foreground">Treinamentos Disponíveis</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6 text-center">
            <div className="text-2xl font-bold text-green-600">
              {trainings.filter(t => t.ai_generated).length}
            </div>
            <p className="text-sm text-muted-foreground">Gerados por IA</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6 text-center">
            <div className="text-2xl font-bold text-purple-600">
              {trainings.reduce((acc, t) => acc + (t.simulations?.length || 0), 0)}
            </div>
            <p className="text-sm text-muted-foreground">Simulações Interativas</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6 text-center">
            <div className="text-2xl font-bold text-orange-600">
              {organizationalContext ? '100%' : '0%'}
            </div>
            <p className="text-sm text-muted-foreground">Personalização</p>
          </CardContent>
        </Card>
      </div>

      {/* Organizational Context Info */}
      {organizationalContext && (
        <Card className="border-purple-200 bg-purple-50/50 dark:bg-purple-950/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-purple-700">
              <Target className="h-5 w-5" />
              Contexto Organizacional Ativo
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <p className="font-medium">Indústria:</p>
                <p className="text-muted-foreground">{organizationalContext.industry}</p>
              </div>
              <div>
                <p className="font-medium">Tamanho:</p>
                <p className="text-muted-foreground">{organizationalContext.company_size}</p>
              </div>
              <div>
                <p className="font-medium">Estilo de Comunicação:</p>
                <p className="text-muted-foreground">{organizationalContext.communication_style}</p>
              </div>
            </div>
            <div className="mt-4">
              <p className="font-medium mb-2">Prioridades de Treinamento:</p>
              <div className="flex flex-wrap gap-2">
                {organizationalContext.training_priorities?.map((priority, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {priority}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="browse" className="flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            Navegar Treinamentos
          </TabsTrigger>
          <TabsTrigger value="generate" className="flex items-center gap-2">
            <Sparkles className="h-4 w-4" />
            Gerar com IA
          </TabsTrigger>
        </TabsList>

        <TabsContent value="browse" className="space-y-6">
          <TabTransition>
            {isLoading ? (
              <StaggerContainer>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[1, 2, 3].map((i) => (
                    <StaggerItem key={i}>
                      <Card className="animate-pulse">
                        <CardContent className="pt-6">
                          <div className="h-4 bg-gray-200 rounded mb-4"></div>
                          <div className="h-3 bg-gray-200 rounded mb-2"></div>
                          <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                        </CardContent>
                      </Card>
                    </StaggerItem>
                  ))}
                </div>
              </StaggerContainer>
            ) : trainings.length === 0 ? (
              <Card className="text-center py-12">
                <CardContent>
                  <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Nenhum treinamento encontrado</h3>
                  <p className="text-muted-foreground mb-4">
                    Comece gerando seu primeiro treinamento personalizado com IA
                  </p>
                  <Button onClick={() => setActiveTab('generate')}>
                    <Plus className="mr-2 h-4 w-4" />
                    Criar Primeiro Treinamento
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <StaggerContainer>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {trainingCards.map((card, index) => (
                    <StaggerItem key={index}>
                      {card}
                    </StaggerItem>
                  ))}
                </div>
              </StaggerContainer>
            )}
          </TabTransition>
        </TabsContent>

        <TabsContent value="generate">
          <TabTransition>
            <React.Suspense fallback={<div className="flex items-center justify-center h-64"><RefreshCw className="h-6 w-6 animate-spin" /></div>}>
              <AITrainingGenerator
                onGenerate={handleGenerateTraining}
                organizationalContext={organizationalContext}
              />
            </React.Suspense>
          </TabTransition>
        </TabsContent>
      </Tabs>
        </div>
      </PageTransition>
    </DashboardLayout>
  );
};

// Memoized export for better performance
export const ModernTraining = React.memo(ModernTrainingComponent);