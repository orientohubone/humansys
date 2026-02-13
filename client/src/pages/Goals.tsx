
import React, { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { NewGoalDialog } from '@/components/goals/NewGoalDialog';
import { ModernGoalProgress } from '@/components/goals/ModernGoalProgress';
import { GoalProgress } from '@/types/gamification';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Target, TrendingUp, CheckCircle, Award, Users, BarChart3, Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export const Goals = () => {
  const { toast } = useToast();
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showCreateTemplateDialog, setShowCreateTemplateDialog] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState<any>(null);
  const [editFormData, setEditFormData] = useState<any>(null);
  const [templateFormData, setTemplateFormData] = useState({ title: '', description: '', category: '', duration: '', milestones: '' });
  const [goals, setGoals] = useState<GoalProgress[]>([]);
  const [templates, setTemplates] = useState<any[]>([]);

  // Mock data with modern goal structure
  const mockGoals: GoalProgress[] = [
    {
      id: '1',
      title: 'Aumentar vendas em 20%',
      description: 'Meta trimestral de crescimento nas vendas da equipe',
      target_value: 100,
      current_value: 75,
      progress_percentage: 75,
      due_date: '2024-03-31',
      status: 'in-progress',
      priority: 'high',
      category: 'Vendas',
      milestones: [
        {
          id: '1a',
          title: 'Primeiro trimestre +15%',
          target_value: 50,
          completed: true,
          completed_at: '2024-01-31'
        },
        {
          id: '1b',
          title: 'Segundo trimestre +20%',
          target_value: 100,
          completed: false
        }
      ]
    },
    {
      id: '2',
      title: 'Concluir curso de liderança',
      description: 'Programa de desenvolvimento em liderança executiva',
      target_value: 100,
      current_value: 100,
      progress_percentage: 100,
      due_date: '2024-02-15',
      status: 'completed',
      priority: 'medium',
      category: 'Desenvolvimento',
      milestones: [
        {
          id: '2a',
          title: 'Módulo 1: Fundamentos',
          target_value: 25,
          completed: true,
          completed_at: '2024-01-15'
        },
        {
          id: '2b',
          title: 'Módulo 2: Comunicação',
          target_value: 50,
          completed: true,
          completed_at: '2024-01-30'
        },
        {
          id: '2c',
          title: 'Módulo 3: Gestão de Equipe',
          target_value: 75,
          completed: true,
          completed_at: '2024-02-10'
        },
        {
          id: '2d',
          title: 'Projeto Final',
          target_value: 100,
          completed: true,
          completed_at: '2024-02-15'
        }
      ]
    },
    {
      id: '3',
      title: 'Melhorar satisfação do cliente',
      description: 'Elevar o NPS da equipe para 8.5+',
      target_value: 85,
      current_value: 72,
      progress_percentage: 84.7,
      due_date: '2024-06-30',
      status: 'in-progress',
      priority: 'critical',
      category: 'Qualidade',
      milestones: [
        {
          id: '3a',
          title: 'Implementar novo processo',
          target_value: 30,
          completed: true,
          completed_at: '2024-01-20'
        },
        {
          id: '3b',
          title: 'Treinamento da equipe',
          target_value: 60,
          completed: true,
          completed_at: '2024-02-01'
        },
        {
          id: '3c',
          title: 'Análise e ajustes',
          target_value: 85,
          completed: false
        }
      ]
    },
    {
      id: '4',
      title: 'Certificação em Product Management',
      description: 'Obter certificação internacional em gestão de produtos',
      target_value: 100,
      current_value: 25,
      progress_percentage: 25,
      due_date: '2024-12-31',
      status: 'in-progress',
      priority: 'medium',
      category: 'Certificação',
      milestones: [
        {
          id: '4a',
          title: 'Inscrição no curso',
          target_value: 10,
          completed: true,
          completed_at: '2024-01-10'
        },
        {
          id: '4b',
          title: 'Primeira fase do curso',
          target_value: 40,
          completed: false
        },
        {
          id: '4c',
          title: 'Projeto prático',
          target_value: 80,
          completed: false
        },
        {
          id: '4d',
          title: 'Exame final',
          target_value: 100,
          completed: false
        }
      ]
    }
  ];

  const allGoals = [...goals, ...mockGoals];
  const activeGoals = allGoals.filter(g => g.status !== 'completed');
  const completedGoals = allGoals.filter(g => g.status === 'completed');
  const overdueGoals = allGoals.filter(g => new Date(g.due_date) < new Date() && g.status !== 'completed');
  const successRate = Math.round((completedGoals.length / allGoals.length) * 100) || 0;

  const handleEditGoal = (goal: any) => {
    setSelectedGoal(goal);
    setEditFormData({
      title: goal.title,
      description: goal.description,
      target: goal.target_value,
      deadline: goal.due_date
    });
    setShowEditDialog(true);
  };

  const handleSaveGoal = () => {
    if (selectedGoal && editFormData) {
      setGoals(goals.map(g =>
        g.id === selectedGoal.id
          ? { ...g, title: editFormData.title, description: editFormData.description }
          : g
      ));
      toast({
        title: "Meta atualizada!",
        description: "As alterações foram salvas com sucesso."
      });
      setShowEditDialog(false);
      setSelectedGoal(null);
      setEditFormData(null);
    }
  };

  const handleCreateTemplate = () => {
    if (!templateFormData.title || !templateFormData.description || !templateFormData.category) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha título, descrição e categoria.",
        variant: "destructive"
      });
      return;
    }

    const newTemplate = {
      id: Date.now().toString(),
      title: templateFormData.title,
      description: templateFormData.description,
      category: templateFormData.category,
      duration: templateFormData.duration || '90 dias',
      milestones: parseInt(templateFormData.milestones) || 4
    };

    setTemplates([...templates, newTemplate]);
    toast({
      title: "Template criado!",
      description: `Template "${templateFormData.title}" foi criado com sucesso.`
    });

    setTemplateFormData({ title: '', description: '', category: '', duration: '', milestones: '' });
    setShowCreateTemplateDialog(false);
  };

  const handleUpdateProgress = (goalId: string, newProgress: number) => {
    toast({
      title: "Progresso atualizado",
      description: "O progresso da meta foi atualizado com sucesso."
    });
  };

  const handleCompleteGoal = (goalId: string) => {
    toast({
      title: "Meta concluída!",
      description: "Parabéns! Você concluiu sua meta. 🎉"
    });
  };

  return (
    <DashboardLayout>
      <div className="space-y-4 xs:space-y-6 p-2 xs:p-0">
        <div className="flex flex-col xs:flex-row justify-between items-start xs:items-center gap-4 xs:gap-0">
          <div>
            <h1 className="text-xl xs:text-2xl sm:text-3xl font-bold">Metas & PDI</h1>
            <p className="text-xs xs:text-sm text-muted-foreground mt-1">
              Plano de Desenvolvimento Individual com gamificação
            </p>
          </div>
          <NewGoalDialog />
        </div>

        {/* KPIs Modernos */}
        <div className="grid gap-2 xs:gap-3 grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 lg:grid-cols-5">
          <Card className="hover:shadow-lg transition-shadow dark:bg-gray-800 dark:border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs xs:text-sm font-medium">Ativas</CardTitle>
              <Target className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-lg xs:text-2xl font-bold text-blue-600">{activeGoals.length}</div>
              <p className="text-xs text-muted-foreground">
                {overdueGoals.length > 0 && `${overdueGoals.length} atrasadas`}
              </p>
            </CardContent>
          </Card>
          
          <Card className="hover:shadow-lg transition-shadow dark:bg-gray-800 dark:border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs xs:text-sm font-medium">Concluídas</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-lg xs:text-2xl font-bold text-green-600">{completedGoals.length}</div>
              <p className="text-xs text-muted-foreground">
                {completedGoals.length} período
              </p>
            </CardContent>
          </Card>
          
          <Card className="hover:shadow-lg transition-shadow dark:bg-gray-800 dark:border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs xs:text-sm font-medium">Progresso</CardTitle>
              <TrendingUp className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-lg xs:text-2xl font-bold text-orange-600">
                {activeGoals.filter(g => g.status === 'in-progress').length}
              </div>
              <p className="text-xs text-muted-foreground">
                Média: {Math.round(activeGoals.reduce((acc, g) => acc + g.progress_percentage, 0) / activeGoals.length || 0)}%
              </p>
            </CardContent>
          </Card>
          
          <Card className="hover:shadow-lg transition-shadow dark:bg-gray-800 dark:border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs xs:text-sm font-medium">Sucesso</CardTitle>
              <Award className="h-4 w-4 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="text-lg xs:text-2xl font-bold text-purple-600">{successRate}%</div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5 mt-1">
                <div 
                  className="bg-purple-500 h-1.5 rounded-full transition-all duration-500"
                  style={{ width: `${successRate}%` }}
                />
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow dark:bg-gray-800 dark:border-gray-700 hidden sm:block lg:hidden">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs xs:text-sm font-medium">Badges</CardTitle>
              <Users className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-lg xs:text-2xl font-bold text-yellow-600">12</div>
              <p className="text-xs text-muted-foreground">+3 mês</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="active" className="space-y-3 xs:space-y-4">
          <TabsList className="flex flex-wrap gap-1 xs:gap-2 w-full bg-transparent p-0 h-auto">
            <TabsTrigger value="active" className="text-xs xs:text-sm flex-1 xs:flex-initial" data-testid="tab-active">Ativas</TabsTrigger>
            <TabsTrigger value="completed" className="text-xs xs:text-sm flex-1 xs:flex-initial" data-testid="tab-completed">Concluídas</TabsTrigger>
            <TabsTrigger value="analytics" className="text-xs xs:text-sm flex-1 xs:flex-initial" data-testid="tab-analytics">Analytics</TabsTrigger>
            <TabsTrigger value="templates" className="text-xs xs:text-sm flex-1 xs:flex-initial" data-testid="tab-templates">Templates</TabsTrigger>
          </TabsList>

          <TabsContent value="active" className="space-y-3 xs:space-y-4">
            <div className="grid gap-3 xs:gap-4 grid-cols-1 lg:grid-cols-2">
              {activeGoals.map((goal) => (
                <div key={goal.id} onClick={() => handleEditGoal(goal)} className="cursor-pointer">
                  <ModernGoalProgress
                    goal={goal}
                    onUpdateProgress={handleUpdateProgress}
                    onCompleteGoal={handleCompleteGoal}
                  />
                </div>
              ))}
            </div>
            
            {activeGoals.length === 0 && (
              <Card>
                <CardContent className="py-8">
                  <div className="text-center">
                    <Target className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">Nenhuma meta ativa</h3>
                    <p className="text-muted-foreground mb-4">Comece criando uma nova meta para seu PDI</p>
                    <NewGoalDialog />
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="completed" className="space-y-3 xs:space-y-4">
            <div className="grid gap-3 xs:gap-4 grid-cols-1 lg:grid-cols-2">
              {completedGoals.map((goal) => (
                <div key={goal.id} onClick={() => handleEditGoal(goal)} className="cursor-pointer">
                  <ModernGoalProgress
                    goal={goal}
                  />
                </div>
              ))}
            </div>
            
            {completedGoals.length === 0 && (
              <Card>
                <CardContent className="py-8">
                  <div className="text-center">
                    <CheckCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">Nenhuma meta concluída ainda</h3>
                    <p className="text-muted-foreground">As metas concluídas aparecerão aqui</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="analytics" className="space-y-3 xs:space-y-4">
            {/* Performance Overview */}
            <div className="grid gap-3 xs:gap-4 grid-cols-1 xs:grid-cols-2 lg:grid-cols-3">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Performance Geral</CardTitle>
                  <BarChart3 className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">78%</div>
                  <p className="text-xs text-muted-foreground">
                    +12% vs mês anterior
                  </p>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full"
                      style={{ width: '78%' }}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Tempo Médio</CardTitle>
                  <Target className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">42 dias</div>
                  <p className="text-xs text-muted-foreground">
                    Para conclusão de metas
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Eficiência</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">89%</div>
                  <p className="text-xs text-muted-foreground">
                    Metas dentro do prazo
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Category Performance */}
            <Card className="lg:col-span-3">
              <CardHeader>
                <CardTitle className="text-sm xs:text-base">Performance por Categoria</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 xs:space-y-4">
                  {[
                    { category: 'Vendas', progress: 85, total: 3, completed: 2 },
                    { category: 'Desenvolvimento', progress: 92, total: 2, completed: 2 },
                    { category: 'Qualidade', progress: 67, total: 1, completed: 0 },
                    { category: 'Certificação', progress: 45, total: 1, completed: 0 }
                  ].map((cat, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-xs xs:text-sm font-medium">{cat.category}</span>
                        <span className="text-xs xs:text-sm text-muted-foreground">
                          {cat.completed}/{cat.total}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div 
                          className="bg-green-500 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${cat.progress}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Monthly Trends */}
            <Card className="lg:col-span-3">
              <CardHeader>
                <CardTitle className="text-sm xs:text-base">Tendências Mensais</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-2 xs:gap-3 grid-cols-1 xs:grid-cols-3">
                  <div className="text-center p-3 xs:p-4 border rounded-lg dark:bg-gray-800 dark:border-gray-700">
                    <div className="text-lg xs:text-2xl font-bold text-green-600">6</div>
                    <p className="text-xs xs:text-sm text-muted-foreground mt-1">Criadas</p>
                  </div>
                  <div className="text-center p-3 xs:p-4 border rounded-lg dark:bg-gray-800 dark:border-gray-700">
                    <div className="text-lg xs:text-2xl font-bold text-blue-600">4</div>
                    <p className="text-xs xs:text-sm text-muted-foreground mt-1">Concluídas</p>
                  </div>
                  <div className="text-center p-3 xs:p-4 border rounded-lg dark:bg-gray-800 dark:border-gray-700">
                    <div className="text-lg xs:text-2xl font-bold text-purple-600">2</div>
                    <p className="text-xs xs:text-sm text-muted-foreground mt-1">Badges</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="templates" className="space-y-3 xs:space-y-4">
            {/* Templates Grid */}
            <div className="grid gap-3 xs:gap-4 grid-cols-1 xs:grid-cols-2 lg:grid-cols-3">
              {[
                {
                  title: 'Crescimento de Vendas',
                  description: 'Template para metas de aumento de vendas e revenue',
                  category: 'Vendas',
                  icon: TrendingUp,
                  color: 'bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800',
                  iconColor: 'text-blue-600',
                  milestones: 4,
                  duration: '90 dias'
                },
                {
                  title: 'Desenvolvimento Técnico',
                  description: 'Plano de desenvolvimento de habilidades técnicas',
                  category: 'Desenvolvimento',
                  icon: Target,
                  color: 'bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800',
                  iconColor: 'text-green-600',
                  milestones: 5,
                  duration: '120 dias'
                },
                {
                  title: 'Certificação Profissional',
                  description: 'Roteiro para obtenção de certificações',
                  category: 'Certificação',
                  icon: Award,
                  color: 'bg-purple-50 dark:bg-purple-950 border-purple-200 dark:border-purple-800',
                  iconColor: 'text-purple-600',
                  milestones: 6,
                  duration: '180 dias'
                },
                {
                  title: 'Liderança e Gestão',
                  description: 'Desenvolvimento de competências de liderança',
                  category: 'Liderança',
                  icon: Users,
                  color: 'bg-orange-50 dark:bg-orange-950 border-orange-200 dark:border-orange-800',
                  iconColor: 'text-orange-600',
                  milestones: 4,
                  duration: '150 dias'
                },
                {
                  title: 'Melhoria de Processos',
                  description: 'Otimização de processos e procedimentos',
                  category: 'Qualidade',
                  icon: BarChart3,
                  color: 'bg-teal-50 dark:bg-teal-950 border-teal-200 dark:border-teal-800',
                  iconColor: 'text-teal-600',
                  milestones: 3,
                  duration: '60 dias'
                },
                {
                  title: 'Satisfação do Cliente',
                  description: 'Metas focadas em experiência do cliente',
                  category: 'Qualidade',
                  icon: CheckCircle,
                  color: 'bg-pink-50 dark:bg-pink-950 border-pink-200 dark:border-pink-800',
                  iconColor: 'text-pink-600',
                  milestones: 4,
                  duration: '90 dias'
                }
              ].map((template, index) => {
                const IconComponent = template.icon;
                return (
                  <Card key={index} className={`hover:shadow-lg transition-all duration-200 cursor-pointer border-2 ${template.color}`}>
                    <CardHeader className="pb-2 xs:pb-3">
                      <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-2">
                          <div className={`p-2 rounded-lg bg-white dark:bg-gray-700`}>
                            <IconComponent className={`h-4 xs:h-5 w-4 xs:w-5 ${template.iconColor}`} />
                          </div>
                          <CardTitle className="text-sm xs:text-base line-clamp-2">{template.title}</CardTitle>
                        </div>
                        <span className="text-xs bg-white dark:bg-gray-700 dark:text-gray-200 px-2 py-1 rounded-full border dark:border-gray-600 w-fit">
                          {template.category}
                        </span>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <p className="text-xs xs:text-sm text-muted-foreground mb-3 line-clamp-2">
                        {template.description}
                      </p>
                      <div className="flex justify-between items-center text-xs text-muted-foreground mb-3 border-t dark:border-gray-700 pt-2">
                        <div className="flex items-center gap-1">
                          <Award className="h-3 w-3" />
                          <span>{template.milestones} marcos</span>
                        </div>
                        <span>{template.duration}</span>
                      </div>
                      <Button
                        className="w-full text-xs xs:text-sm py-2"
                        data-testid={`use-template-${template.title.replace(/\s+/g, '-').toLowerCase()}`}
                        onClick={() => {
                          toast({
                            title: "Template selecionado!",
                            description: `Template "${template.title}" está pronto para usar.`
                          });
                        }}
                      >
                        <Plus className="h-3 w-3 mr-1" />
                        Usar Template
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Custom Template Section */}
            <Card className="dark:bg-gray-800 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="text-sm xs:text-base">Criar Template Personalizado</CardTitle>
                <p className="text-xs xs:text-sm text-muted-foreground mt-1">
                  Develop templates baseados em suas metas
                </p>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-center py-6 xs:py-8 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg">
                  <div className="text-center">
                    <Target className="h-6 xs:h-8 w-6 xs:w-8 text-muted-foreground mx-auto mb-2" />
                    <p className="text-xs xs:text-sm text-muted-foreground mb-4 max-w-xs">
                      Crie templates personalizados para suas metas
                    </p>
                    <Button 
                      className="text-xs xs:text-sm"
                      data-testid="create-custom-template"
                      onClick={() => setShowCreateTemplateDialog(true)}
                    >
                      <Plus className="h-3 w-3 mr-1" />
                      Criar Template
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Edit Goal Dialog */}
        <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
          <DialogContent className="w-full max-w-md sm:max-w-lg mx-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Editar Meta
              </DialogTitle>
              <DialogDescription className="text-xs xs:text-sm">
                Atualize os detalhes da sua meta de desenvolvimento
              </DialogDescription>
            </DialogHeader>
            
            {editFormData && (
              <div className="space-y-4 py-4">
                <div>
                  <label className="text-sm font-medium">Título *</label>
                  <input 
                    type="text"
                    value={editFormData.title}
                    onChange={(e) => setEditFormData({...editFormData, title: e.target.value})}
                    className="w-full px-3 py-2 border rounded-md text-sm bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white mt-1"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">Descrição</label>
                  <textarea 
                    value={editFormData.description}
                    onChange={(e) => setEditFormData({...editFormData, description: e.target.value})}
                    className="w-full px-3 py-2 border rounded-md text-sm bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white mt-1"
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-sm font-medium">Meta Numérica</label>
                    <input 
                      type="number"
                      value={editFormData.target}
                      onChange={(e) => setEditFormData({...editFormData, target: e.target.value})}
                      className="w-full px-3 py-2 border rounded-md text-sm bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white mt-1"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Prazo</label>
                    <input 
                      type="date"
                      value={editFormData.deadline}
                      onChange={(e) => setEditFormData({...editFormData, deadline: e.target.value})}
                      className="w-full px-3 py-2 border rounded-md text-sm bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white mt-1"
                    />
                  </div>
                </div>
              </div>
            )}

            <DialogFooter className="gap-2 flex flex-col xs:flex-row">
              <Button variant="outline" onClick={() => setShowEditDialog(false)} className="w-full xs:w-auto text-xs xs:text-sm">
                Cancelar
              </Button>
              <Button onClick={handleSaveGoal} className="w-full xs:w-auto text-xs xs:text-sm" data-testid="save-goal">
                Salvar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Create Template Dialog */}
        <Dialog open={showCreateTemplateDialog} onOpenChange={setShowCreateTemplateDialog}>
          <DialogContent className="w-full max-w-md sm:max-w-lg mx-auto max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-sm xs:text-base">
                <Plus className="h-5 w-5" />
                Criar Template Personalizado
              </DialogTitle>
              <DialogDescription className="text-xs xs:text-sm">
                Crie um template reutilizável para suas metas
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-3 xs:space-y-4 py-4">
              <div>
                <label className="text-xs xs:text-sm font-medium">Título *</label>
                <input 
                  type="text"
                  value={templateFormData.title}
                  onChange={(e) => setTemplateFormData({...templateFormData, title: e.target.value})}
                  placeholder="Ex: Plano de Aprendizado"
                  className="w-full px-3 py-2 border rounded-md text-sm bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white mt-1"
                />
              </div>

              <div>
                <label className="text-xs xs:text-sm font-medium">Descrição *</label>
                <textarea 
                  value={templateFormData.description}
                  onChange={(e) => setTemplateFormData({...templateFormData, description: e.target.value})}
                  placeholder="Descreva para que serve este template..."
                  className="w-full px-3 py-2 border rounded-md text-sm bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white mt-1"
                  rows={2}
                />
              </div>

              <div className="grid grid-cols-2 gap-2 xs:gap-3">
                <div>
                  <label className="text-xs xs:text-sm font-medium">Categoria *</label>
                  <input 
                    type="text"
                    value={templateFormData.category}
                    onChange={(e) => setTemplateFormData({...templateFormData, category: e.target.value})}
                    placeholder="Ex: Desenvolvimento"
                    className="w-full px-3 py-2 border rounded-md text-sm bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white mt-1"
                  />
                </div>

                <div>
                  <label className="text-xs xs:text-sm font-medium">Duração</label>
                  <input 
                    type="text"
                    value={templateFormData.duration}
                    onChange={(e) => setTemplateFormData({...templateFormData, duration: e.target.value})}
                    placeholder="Ex: 90 dias"
                    className="w-full px-3 py-2 border rounded-md text-sm bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white mt-1"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs xs:text-sm font-medium">Marcos/Etapas</label>
                <input 
                  type="number"
                  value={templateFormData.milestones}
                  onChange={(e) => setTemplateFormData({...templateFormData, milestones: e.target.value})}
                  placeholder="Quantidade de marcos"
                  min="1"
                  max="10"
                  className="w-full px-3 py-2 border rounded-md text-sm bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white mt-1"
                />
              </div>
            </div>

            <DialogFooter className="gap-2 flex flex-col xs:flex-row">
              <Button 
                variant="outline" 
                onClick={() => setShowCreateTemplateDialog(false)} 
                className="w-full xs:w-auto text-xs xs:text-sm"
              >
                Cancelar
              </Button>
              <Button 
                onClick={handleCreateTemplate} 
                className="w-full xs:w-auto text-xs xs:text-sm"
                data-testid="save-custom-template"
              >
                Criar Template
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
};
