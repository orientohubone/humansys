import React, { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CheckCircle, Clock, User, FileText, Briefcase, Users, Play, RefreshCw } from 'lucide-react';
import { NewOnboardingDialog } from '@/components/onboarding/NewOnboardingDialog';
import { OnboardingDetails } from '@/components/onboarding/OnboardingDetails';
import { useOnboarding } from '@/hooks/useOnboarding';

export const Onboarding = () => {
  const { processes, isLoading, error, mutate } = useOnboarding();
  const [selectedProcess, setSelectedProcess] = useState(null);
  const [detailsOpen, setDetailsOpen] = useState(false);

  // Garantir que processes seja sempre um array
  const safeProcesses = Array.isArray(processes) ? processes : [];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500';
      case 'in-progress': return 'bg-blue-500';
      case 'pending': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed': return 'Concluído';
      case 'in-progress': return 'Em Andamento';
      case 'pending': return 'Pendente';
      default: return status;
    }
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return 'bg-green-500';
    if (progress >= 50) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const handleRefresh = () => {
    mutate();
  };

  // Filtrar processos por status
  const pendingProcesses = safeProcesses.filter(p => p.status === 'pending');
  const inProgressProcesses = safeProcesses.filter(p => p.status === 'in-progress');
  const completedProcesses = safeProcesses.filter(p => p.status === 'completed');

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <h3 className="text-lg font-medium text-red-600 mb-2">Erro ao carregar onboardings</h3>
            <p className="text-muted-foreground">{error}</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-4 xs:space-y-6">
        {/* Header simplificado - removido debug */}
        <div className="flex flex-col xs:flex-row justify-between items-start xs:items-center gap-3 xs:gap-0">
          <div>
            <h1 className="text-2xl xs:text-3xl font-bold text-gray-900 dark:text-white">Onboarding</h1>
            <p className="text-xs xs:text-sm text-muted-foreground dark:text-gray-400">
              Gerencie a integração de novos colaboradores
            </p>
          </div>
          <div className="flex gap-2 w-full xs:w-auto flex-col xs:flex-row">
            <Button
              variant="outline"
              onClick={handleRefresh}
              disabled={isLoading}
              className="w-full xs:w-auto"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              Atualizar
            </Button>
            <div className="w-full xs:w-auto">
              <NewOnboardingDialog />
            </div>
          </div>
        </div>

        {/* Stats rápidas */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 xs:gap-4">
          <Card className="bg-white dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-3 xs:p-4">
              <CardTitle className="text-xs xs:text-sm font-medium text-gray-900 dark:text-white">Total</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent className="p-3 xs:p-4">
              <div className="text-xl xs:text-2xl font-bold text-gray-900 dark:text-white">{safeProcesses.length}</div>
            </CardContent>
          </Card>
          <Card className="bg-white dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-3 xs:p-4">
              <CardTitle className="text-xs xs:text-sm font-medium text-gray-900 dark:text-white">Pendentes</CardTitle>
              <Clock className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent className="p-3 xs:p-4">
              <div className="text-xl xs:text-2xl font-bold text-gray-900 dark:text-white">{pendingProcesses.length}</div>
            </CardContent>
          </Card>
          <Card className="bg-white dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-3 xs:p-4">
              <CardTitle className="text-xs xs:text-sm font-medium text-gray-900 dark:text-white">Andamento</CardTitle>
              <Play className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent className="p-3 xs:p-4">
              <div className="text-xl xs:text-2xl font-bold text-gray-900 dark:text-white">{inProgressProcesses.length}</div>
            </CardContent>
          </Card>
          <Card className="bg-white dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-3 xs:p-4">
              <CardTitle className="text-xs xs:text-sm font-medium text-gray-900 dark:text-white">Concluídos</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent className="p-3 xs:p-4">
              <div className="text-xl xs:text-2xl font-bold text-gray-900 dark:text-white">{completedProcesses.length}</div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs para organizar processos */}
        <Tabs defaultValue="all" className="space-y-3 xs:space-y-4">
          <TabsList className="w-full h-auto flex flex-wrap gap-1 xs:gap-2 p-1 xs:p-2 bg-gray-100 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800 rounded-lg">
            <TabsTrigger value="all" className="text-xs xs:text-sm py-1 xs:py-2 px-2 xs:px-3 flex-1 xs:flex-initial min-w-fit text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-800">Todos ({safeProcesses.length})</TabsTrigger>
            <TabsTrigger value="pending" className="text-xs xs:text-sm py-1 xs:py-2 px-2 xs:px-3 flex-1 xs:flex-initial min-w-fit text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-800">Pendentes ({pendingProcesses.length})</TabsTrigger>
            <TabsTrigger value="in-progress" className="text-xs xs:text-sm py-1 xs:py-2 px-2 xs:px-3 flex-1 xs:flex-initial min-w-fit text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-800">Andamento ({inProgressProcesses.length})</TabsTrigger>
            <TabsTrigger value="completed" className="text-xs xs:text-sm py-1 xs:py-2 px-2 xs:px-3 flex-1 xs:flex-initial min-w-fit text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-800">Concluídos ({completedProcesses.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="all">
            {safeProcesses.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 xs:gap-4">
                {safeProcesses.map((process) => (
                  <Card 
                    key={process.id} 
                    className="bg-white dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800 hover:shadow-lg dark:hover:shadow-lg/50 transition-shadow cursor-pointer"
                    onClick={() => {
                      setSelectedProcess(process);
                      setDetailsOpen(true);
                    }}
                  >
                    <CardHeader className="pb-3 p-3 xs:p-4">
                      <div className="flex items-center justify-between gap-2">
                        <CardTitle className="text-sm xs:text-lg text-gray-900 dark:text-white truncate">{process.collaborator_name}</CardTitle>
                        <Badge 
                          variant="secondary" 
                          className={`${getStatusColor(process.status)} text-white text-xs`}
                        >
                          {getStatusText(process.status)}
                        </Badge>
                      </div>
                      <CardDescription className="text-xs xs:text-sm dark:text-gray-400">
                        {process.position} • {process.department}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-2 xs:space-y-3 p-3 xs:p-4">
                      <div className="flex items-center text-xs xs:text-sm text-muted-foreground dark:text-gray-400 gap-1">
                        <User className="h-4 w-4 flex-shrink-0" />
                        {new Date(process.start_date).toLocaleDateString('pt-BR')}
                      </div>
                      <div className="space-y-1 xs:space-y-2">
                        <div className="flex items-center justify-between text-xs xs:text-sm">
                          <span>Progresso</span>
                          <span className="text-gray-900 dark:text-white">{process.progress || 0}%</span>
                        </div>
                        <Progress 
                          value={process.progress || 0} 
                          className="h-2"
                        />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="bg-white dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800">
                <CardContent className="py-6 xs:py-8">
                  <div className="text-center">
                    <Users className="h-10 xs:h-12 w-10 xs:w-12 text-muted-foreground dark:text-gray-500 mx-auto mb-3 xs:mb-4" />
                    <h3 className="text-base xs:text-lg font-medium mb-2 text-gray-900 dark:text-white">Nenhum processo</h3>
                    <p className="text-xs xs:text-sm text-muted-foreground dark:text-gray-400 mb-3 xs:mb-4">
                      Comece criando o primeiro
                    </p>
                    <NewOnboardingDialog />
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="pending">
            {pendingProcesses.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 xs:gap-4">
                {pendingProcesses.map((process) => (
                  <Card 
                    key={process.id} 
                    className="bg-white dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800 hover:shadow-lg dark:hover:shadow-lg/50 transition-shadow cursor-pointer"
                    onClick={() => {
                      setSelectedProcess(process);
                      setDetailsOpen(true);
                    }}
                  >
                    <CardHeader className="pb-3 p-3 xs:p-4">
                      <div className="flex items-center justify-between gap-2">
                        <CardTitle className="text-sm xs:text-lg text-gray-900 dark:text-white truncate">{process.collaborator_name}</CardTitle>
                        <Badge variant="secondary" className="bg-yellow-500 text-white">
                          Pendente
                        </Badge>
                      </div>
                      <CardDescription>
                        {process.position} • {process.department}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex items-center text-sm text-muted-foreground">
                          <User className="h-4 w-4 mr-2" />
                          Início: {new Date(process.start_date).toLocaleDateString('pt-BR')}
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span>Progresso</span>
                            <span>{process.progress || 0}%</span>
                          </div>
                          <Progress 
                            value={process.progress || 0} 
                            className="h-2"
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 xs:py-8">
                <Clock className="h-10 xs:h-12 w-10 xs:w-12 text-muted-foreground dark:text-gray-500 mx-auto mb-3 xs:mb-4" />
                <h3 className="text-base xs:text-lg font-medium mb-2 text-gray-900 dark:text-white">Nenhum pendente</h3>
                <p className="text-xs xs:text-sm text-muted-foreground dark:text-gray-400">Todos estão em andamento</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="in-progress">
            {inProgressProcesses.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 xs:gap-4">
                {inProgressProcesses.map((process) => (
                  <Card 
                    key={process.id} 
                    className="bg-white dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800 hover:shadow-lg dark:hover:shadow-lg/50 transition-shadow cursor-pointer"
                    onClick={() => {
                      setSelectedProcess(process);
                      setDetailsOpen(true);
                    }}
                  >
                    <CardHeader className="pb-3 p-3 xs:p-4">
                      <div className="flex items-center justify-between gap-2">
                        <CardTitle className="text-sm xs:text-lg text-gray-900 dark:text-white truncate">{process.collaborator_name}</CardTitle>
                        <Badge variant="secondary" className="bg-blue-500 text-white text-xs">
                          Andamento
                        </Badge>
                      </div>
                      <CardDescription className="text-xs xs:text-sm dark:text-gray-400">
                        {process.position} • {process.department}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-2 xs:space-y-3 p-3 xs:p-4">
                      <div className="flex items-center text-xs xs:text-sm text-muted-foreground dark:text-gray-400 gap-1">
                        <User className="h-4 w-4 flex-shrink-0" />
                        {new Date(process.start_date).toLocaleDateString('pt-BR')}
                      </div>
                      <div className="space-y-1 xs:space-y-2">
                        <div className="flex items-center justify-between text-xs xs:text-sm">
                          <span>Progresso</span>
                          <span className="text-gray-900 dark:text-white">{process.progress || 0}%</span>
                        </div>
                        <Progress 
                          value={process.progress || 0} 
                          className="h-2"
                        />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 xs:py-8">
                <Play className="h-10 xs:h-12 w-10 xs:w-12 text-muted-foreground dark:text-gray-500 mx-auto mb-3 xs:mb-4" />
                <h3 className="text-base xs:text-lg font-medium mb-2 text-gray-900 dark:text-white">Nenhum em andamento</h3>
                <p className="text-xs xs:text-sm text-muted-foreground dark:text-gray-400">Inicie novos processos</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="completed">
            {completedProcesses.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 xs:gap-4">
                {completedProcesses.map((process) => (
                  <Card 
                    key={process.id} 
                    className="bg-white dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800 hover:shadow-lg dark:hover:shadow-lg/50 transition-shadow cursor-pointer"
                    onClick={() => {
                      setSelectedProcess(process);
                      setDetailsOpen(true);
                    }}
                  >
                    <CardHeader className="pb-3 p-3 xs:p-4">
                      <div className="flex items-center justify-between gap-2">
                        <CardTitle className="text-sm xs:text-lg text-gray-900 dark:text-white truncate">{process.collaborator_name}</CardTitle>
                        <Badge variant="secondary" className="bg-green-500 text-white text-xs">
                          Concluído
                        </Badge>
                      </div>
                      <CardDescription className="text-xs xs:text-sm dark:text-gray-400">
                        {process.position} • {process.department}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-2 xs:space-y-3 p-3 xs:p-4">
                      <div className="flex items-center text-xs xs:text-sm text-muted-foreground dark:text-gray-400 gap-1">
                        <User className="h-4 w-4 flex-shrink-0" />
                        {new Date(process.start_date).toLocaleDateString('pt-BR')}
                      </div>
                      <div className="space-y-1 xs:space-y-2">
                        <div className="flex items-center justify-between text-xs xs:text-sm">
                          <span>Progresso</span>
                          <span className="text-gray-900 dark:text-white">{process.progress || 0}%</span>
                        </div>
                        <Progress 
                          value={process.progress || 0} 
                          className="h-2"
                        />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 xs:py-8">
                <CheckCircle className="h-10 xs:h-12 w-10 xs:w-12 text-muted-foreground dark:text-gray-500 mx-auto mb-3 xs:mb-4" />
                <h3 className="text-base xs:text-lg font-medium mb-2 text-gray-900 dark:text-white">Nenhum concluído</h3>
                <p className="text-xs xs:text-sm text-muted-foreground dark:text-gray-400">Aparecerão aqui</p>
              </div>
            )}
          </TabsContent>
        </Tabs>

        <OnboardingDetails 
          process={selectedProcess}
          open={detailsOpen}
          onOpenChange={setDetailsOpen}
        />
      </div>
    </DashboardLayout>
  );
};