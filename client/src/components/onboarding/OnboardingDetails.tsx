
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Edit, Video, MessageSquare, Trophy, Sparkles, Star, ThumbsUp, ThumbsDown, Send, FileText, Award, Target, TrendingUp, Calendar, Clock, CheckCircle, AlertCircle, MessageCircle, Heart, UserCheck, BookOpen, PlayCircle, Users, Zap, Play } from 'lucide-react';
import { useOnboarding, OnboardingStep } from '@/hooks/useOnboarding';
import { useOnboardingGamification } from '@/hooks/useOnboardingGamification';
import { GamificationPanel } from './GamificationPanel';
import { OnboardingSteps } from './OnboardingSteps';
import { EditStepDialog } from './EditStepDialog';
import { VideoPlayer } from './VideoPlayer';
import { useToast } from '@/hooks/use-toast';
import { OnboardingProgress, GamificationStats, LeaderboardEntry } from '@/types/gamification';

interface OnboardingDetailsProps {
  process: any;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const OnboardingDetails = ({ process, open, onOpenChange }: OnboardingDetailsProps) => {
  const { getProcessSteps, updateStepStatus } = useOnboarding();
  const [steps, setSteps] = useState<OnboardingStep[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editStep, setEditStep] = useState<OnboardingStep | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const { toast } = useToast();
  
  // Feedback state
  const [feedbackText, setFeedbackText] = useState('');
  const [feedbackRating, setFeedbackRating] = useState<number>(0);
  const [feedbackCategory, setFeedbackCategory] = useState('');
  const [feedbackHistory, setFeedbackHistory] = useState<any[]>([]);
  const [submittingFeedback, setSubmittingFeedback] = useState(false);

  // Mock feedback data - replace with real API calls
  const mockFeedbackHistory = [
    {
      id: 1,
      author: 'Fernando Ramalho',
      role: 'Manager',
      rating: 5,
      category: 'Desempenho',
      comment: 'Excelente adaptação ao ambiente de trabalho. Demonstra proatividade e facilidade de aprendizado.',
      date: '2025-01-10T14:30:00Z',
      type: 'positive'
    },
    {
      id: 2,
      author: 'Ana Silva',
      role: 'HR',
      rating: 4,
      category: 'Integração',
      comment: 'Boa integração com a equipe. Sugerimos mais tempo para conhecer os processos internos.',
      date: '2025-01-08T10:15:00Z',
      type: 'constructive'
    },
    {
      id: 3,
      author: 'Carlos Santos',
      role: 'Mentor',
      rating: 5,
      category: 'Aprendizado',
      comment: 'Muito dedicado e sempre faz perguntas relevantes. Está superando as expectativas.',
      date: '2025-01-05T16:45:00Z',
      type: 'positive'
    }
  ];

  // Initialize feedback history
  useEffect(() => {
    setFeedbackHistory(mockFeedbackHistory);
  }, []);

  // Feedback functions
  const submitFeedback = async () => {
    if (!feedbackText.trim() || !feedbackRating || !feedbackCategory) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha todos os campos antes de enviar o feedback.",
        variant: "destructive"
      });
      return;
    }

    setSubmittingFeedback(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newFeedback = {
        id: Date.now(),
        author: 'Você',
        role: 'Avaliador',
        rating: feedbackRating,
        category: feedbackCategory,
        comment: feedbackText,
        date: new Date().toISOString(),
        type: feedbackRating >= 4 ? 'positive' : feedbackRating >= 3 ? 'constructive' : 'negative'
      };

      setFeedbackHistory(prev => [newFeedback, ...prev]);
      setFeedbackText('');
      setFeedbackRating(0);
      setFeedbackCategory('');

      toast({
        title: "Feedback enviado!",
        description: "Seu feedback foi registrado com sucesso.",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível enviar o feedback. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setSubmittingFeedback(false);
    }
  };

  const renderStarRating = (rating: number, interactive: boolean = false) => {
    return (
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-4 w-4 ${
              star <= rating 
                ? 'fill-yellow-400 text-yellow-400' 
                : 'text-gray-300'
            } ${interactive ? 'cursor-pointer hover:text-yellow-400' : ''}`}
            onClick={interactive ? () => setFeedbackRating(star) : undefined}
          />
        ))}
      </div>
    );
  };

  const getFeedbackTypeColor = (type: string) => {
    switch (type) {
      case 'positive': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'constructive': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'negative': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  // Integração com gamificação - with protection against process undefined
  const { 
    progress, 
    availableBadges, 
    achievements, 
    awardBonusPoints, 
    refetch: refetchGamification 
  } = useOnboardingGamification(process?.id || '', steps);

  const loadProcessSteps = async () => {
    if (!process?.id) {
      setSteps([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      const processSteps = await getProcessSteps(process.id);
      setSteps(Array.isArray(processSteps) ? processSteps : []);
    } catch (error) {
      console.error('Erro ao carregar etapas:', error);
      setSteps([]);
      toast({
        title: "Erro",
        description: "Não foi possível carregar as etapas do onboarding",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (process?.id && open) {
      loadProcessSteps();
    } else {
      setSteps([]);
      setIsLoading(false);
    }
  }, [process?.id, open]);

  const toggleStep = async (stepId: string, currentCompleted: boolean) => {
    if (!process?.id) {
      toast({
        title: "Erro",
        description: "Processo não encontrado",
        variant: "destructive"
      });
      return;
    }

    try {
      await updateStepStatus(stepId, !currentCompleted, process.id);
      await loadProcessSteps();

      // Gamificação: Award bonus points for completing a step
      if (!currentCompleted) {
        awardBonusPoints(50, 'Etapa concluída');
        toast({
          title: "🎉 Etapa Concluída!",
          description: "+50 pontos de gamificação",
        });
      }

      // Atualizar dados de gamificação
      setTimeout(refetchGamification, 100);
    } catch (error) {
      console.error('Erro ao atualizar etapa:', error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar a etapa.",
        variant: "destructive"
      });
    }
  };

  const handleEditStep = (step: OnboardingStep) => {
    setEditStep(step);
    setEditDialogOpen(true);
  };

  const handleSaveStep = (stepData: Partial<OnboardingStep>) => {
    console.log('Salvando etapa:', stepData);
    loadProcessSteps();
    refetchGamification();
    toast({
      title: "Etapa atualizada",
      description: "As alterações foram salvas com sucesso",
    });
  };

  const handleVideoComplete = () => {
    // Award bonus for completing video
    awardBonusPoints(25, 'Vídeo assistido');
    toast({
      title: "📹 Vídeo Concluído!",
      description: "+25 pontos de gamificação",
    });
    refetchGamification();
  };

  if (!process) return null;

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-7xl max-h-[95vh] overflow-hidden bg-white dark:bg-gray-800">
          <DialogHeader className="pb-4">
            <DialogTitle className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <span className="text-xl font-bold">Onboarding - {process.collaborator?.name || process.collaborator_name || 'Colaborador'}</span>
                {progress && (
                  <Badge className="bg-gradient-to-r from-purple-500 to-blue-500 text-white">
                    <Trophy className="h-3 w-3 mr-1" />
                    {progress.gamification_score} pontos
                  </Badge>
                )}
              </div>
              <Button variant="outline" size="sm">
                <Edit className="h-4 w-4 mr-2" />
                Configurar
              </Button>
            </DialogTitle>
            <DialogDescription className="flex items-center justify-between">
              <span className="text-muted-foreground">{process.position} • {process.department}</span>
              {progress && progress.performance_rating === 'excellent' && (
                <Badge variant="outline" className="text-green-600 border-green-200">
                  <Sparkles className="h-3 w-3 mr-1" />
                  Performance Excelente
                </Badge>
              )}
            </DialogDescription>
          </DialogHeader>

          <div className="flex-1 overflow-hidden">
            <Tabs defaultValue="steps" className="h-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="steps">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Etapas
                </TabsTrigger>
                <TabsTrigger value="gamification">
                  <Trophy className="h-4 w-4 mr-2" />
                  Gamificação
                </TabsTrigger>
                <TabsTrigger value="videos">
                  <Video className="h-4 w-4 mr-2" />
                  Vídeos
                </TabsTrigger>
                <TabsTrigger value="feedback">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Feedback
                </TabsTrigger>
              </TabsList>

              <ScrollArea className="h-[calc(95vh-180px)] mt-4">
                <TabsContent value="steps" className="space-y-4">
                  {isLoading ? (
                    <div className="flex items-center justify-center h-64">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    </div>
                  ) : (
                    <OnboardingSteps 
                      steps={steps}
                      onToggleStep={toggleStep}
                      onEditStep={handleEditStep}
                    />
                  )}
                </TabsContent>

                <TabsContent value="gamification" className="space-y-4">
                  {progress && (
                    <GamificationPanel 
                      progress={progress}
                      achievements={achievements || []}
                      availableBadges={availableBadges || []}
                    />
                  )}
                </TabsContent>

                <TabsContent value="videos" className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center">
                          <PlayCircle className="h-5 w-5 mr-2" />
                          Vídeos de Treinamento
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                            <div className="flex items-center space-x-3">
                              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                                <Play className="h-4 w-4 text-white" />
                              </div>
                              <div>
                                <p className="font-medium">Boas-vindas à Empresa</p>
                                <p className="text-sm text-muted-foreground">5 min</p>
                              </div>
                            </div>
                            <Badge variant="secondary">Obrigatório</Badge>
                          </div>
                          
                          <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                            <div className="flex items-center space-x-3">
                              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                                <CheckCircle className="h-4 w-4 text-white" />
                              </div>
                              <div>
                                <p className="font-medium">Cultura Organizacional</p>
                                <p className="text-sm text-muted-foreground">8 min</p>
                              </div>
                            </div>
                            <Badge variant="secondary" className="bg-green-100 text-green-800">Concluído</Badge>
                          </div>
                          
                          <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                            <div className="flex items-center space-x-3">
                              <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                                <Play className="h-4 w-4 text-white" />
                              </div>
                              <div>
                                <p className="font-medium">Políticas de Segurança</p>
                                <p className="text-sm text-muted-foreground">12 min</p>
                              </div>
                            </div>
                            <Badge variant="secondary">Obrigatório</Badge>
                          </div>
                          
                          <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                            <div className="flex items-center space-x-3">
                              <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                                <Play className="h-4 w-4 text-white" />
                              </div>
                              <div>
                                <p className="font-medium">Ferramentas de Trabalho</p>
                                <p className="text-sm text-muted-foreground">15 min</p>
                              </div>
                            </div>
                            <Badge variant="outline">Opcional</Badge>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center">
                          <BookOpen className="h-5 w-5 mr-2" />
                          Progresso dos Vídeos
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="text-center">
                            <div className="text-3xl font-bold text-green-600 mb-2">75%</div>
                            <p className="text-sm text-muted-foreground mb-4">
                              3 de 4 vídeos concluídos
                            </p>
                            <Progress value={75} className="h-2" />
                          </div>
                          
                          <Separator />
                          
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <span className="text-sm">Tempo total assistido</span>
                              <span className="text-sm font-medium">25 min</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-sm">Próximo vídeo</span>
                              <span className="text-sm font-medium">Políticas de Segurança</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-sm">Pontos ganhos</span>
                              <span className="text-sm font-medium text-green-600">+75 pontos</span>
                            </div>
                          </div>
                          
                          <Button className="w-full" onClick={handleVideoComplete}>
                            <PlayCircle className="h-4 w-4 mr-2" />
                            Continuar Assistindo
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                <TabsContent value="feedback" className="space-y-6">
                  {/* Feedback Overview */}
                  <div className="grid gap-4 md:grid-cols-3">
                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-medium flex items-center">
                          <Star className="h-4 w-4 mr-2 text-yellow-500" />
                          Avaliação Média
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center space-x-2">
                          <span className="text-2xl font-bold">4.7</span>
                          {renderStarRating(Math.round(4.7))}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          Baseado em {feedbackHistory.length} avaliações
                        </p>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-medium flex items-center">
                          <TrendingUp className="h-4 w-4 mr-2 text-green-500" />
                          Performance
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold text-green-600">Excelente</div>
                        <p className="text-xs text-muted-foreground mt-1">
                          Acima da média esperada
                        </p>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-medium flex items-center">
                          <Target className="h-4 w-4 mr-2 text-blue-500" />
                          Progresso
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold text-blue-600">{process.progress || 0}%</div>
                        <Progress value={process.progress || 0} className="mt-2" />
                      </CardContent>
                    </Card>
                  </div>

                  {/* Add New Feedback */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <MessageCircle className="h-5 w-5 mr-2" />
                        Adicionar Feedback
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor="feedback-rating">Avaliação</Label>
                          <div className="flex items-center space-x-2">
                            {renderStarRating(feedbackRating, true)}
                            <span className="text-sm text-muted-foreground">
                              {feedbackRating > 0 ? `${feedbackRating} estrela${feedbackRating > 1 ? 's' : ''}` : 'Selecione uma avaliação'}
                            </span>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="feedback-category">Categoria</Label>
                          <Select value={feedbackCategory} onValueChange={setFeedbackCategory}>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione uma categoria" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Desempenho">Desempenho</SelectItem>
                              <SelectItem value="Integração">Integração</SelectItem>
                              <SelectItem value="Aprendizado">Aprendizado</SelectItem>
                              <SelectItem value="Comunicação">Comunicação</SelectItem>
                              <SelectItem value="Colaboração">Colaboração</SelectItem>
                              <SelectItem value="Proatividade">Proatividade</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="feedback-text">Comentário</Label>
                        <Textarea
                          id="feedback-text"
                          placeholder="Descreva sua avaliação sobre o desempenho no onboarding..."
                          value={feedbackText}
                          onChange={(e) => setFeedbackText(e.target.value)}
                          className="min-h-[100px]"
                        />
                      </div>

                      <Button 
                        onClick={submitFeedback}
                        disabled={submittingFeedback || !feedbackText.trim() || !feedbackRating || !feedbackCategory}
                        className="w-full"
                      >
                        {submittingFeedback ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                            Enviando...
                          </>
                        ) : (
                          <>
                            <Send className="h-4 w-4 mr-2" />
                            Enviar Feedback
                          </>
                        )}
                      </Button>
                    </CardContent>
                  </Card>

                  {/* Feedback History */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <FileText className="h-5 w-5 mr-2" />
                        Histórico de Feedback
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {feedbackHistory.map((feedback) => (
                          <div key={feedback.id} className="border rounded-lg p-4 bg-white dark:bg-gray-800">
                            <div className="flex items-start justify-between mb-3">
                              <div className="flex items-center space-x-3">
                                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white text-sm font-bold">
                                  {feedback.author.charAt(0)}
                                </div>
                                <div>
                                  <p className="font-medium">{feedback.author}</p>
                                  <p className="text-sm text-muted-foreground">{feedback.role}</p>
                                </div>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Badge className={getFeedbackTypeColor(feedback.type)}>
                                  {feedback.category}
                                </Badge>
                                <span className="text-sm text-muted-foreground">
                                  {new Date(feedback.date).toLocaleDateString('pt-BR')}
                                </span>
                              </div>
                            </div>
                            
                            <div className="mb-3">
                              {renderStarRating(feedback.rating)}
                            </div>
                            
                            <p className="text-sm leading-relaxed">{feedback.comment}</p>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </ScrollArea>
            </Tabs>
          </div>
        </DialogContent>
      </Dialog>

      <EditStepDialog
        step={editStep}
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        onSave={handleSaveStep}
      />
    </>
  );
};
