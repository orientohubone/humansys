import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from './use-toast';

export interface OnboardingProcess {
  id: string;
  collaborator_id: string;
  collaborator?: {
    id: string;
    name: string;
    email: string;
  };
  status: 'not-started' | 'in-progress' | 'completed';
  progress: number;
  current_step: string;
  start_date: string;
  position: string;
  department: string;
}

export interface OnboardingStep {
  id: string;
  process_id: string;
  title: string;
  description: string;
  type: 'document' | 'training' | 'meeting' | 'task';
  status: 'pending' | 'in-progress' | 'completed';
  due_date?: string;
  completed_at?: string;
  order: number;
  completed?: boolean;
}

// Template de steps mock - usado para criar steps para novos processos
// NÃO EXISTE no backend, mantido apenas localmente
const mockStepsTemplate: Omit<OnboardingStep, 'id' | 'process_id'>[] = [
  {
    title: 'Documentação Pessoal',
    description: 'Envio de documentos pessoais e contratuais',
    type: 'document',
    status: 'pending',
    order: 1,
    completed: false
  },
  {
    title: 'Apresentação da Empresa',
    description: 'Conhecer a história, missão e valores',
    type: 'training',
    status: 'pending',
    order: 2,
    completed: false
  },
  {
    title: 'Treinamento de Segurança',
    description: 'Curso obrigatório sobre políticas de segurança',
    type: 'training',
    status: 'pending',
    order: 3,
    completed: false
  },
  {
    title: 'Setup do Ambiente',
    description: 'Configuração de equipamentos e acessos',
    type: 'task',
    status: 'pending',
    order: 4,
    completed: false
  },
  {
    title: 'Reunião com Gestor',
    description: 'Primeira reunião com o gestor direto',
    type: 'meeting',
    status: 'pending',
    order: 5,
    completed: false
  },
  {
    title: 'Conhecer a Equipe',
    description: 'Apresentação aos membros do time',
    type: 'meeting',
    status: 'pending',
    order: 6,
    completed: false
  }
];

// Armazenamento local de steps por processo (mock)
const processStepsStorage: Record<string, OnboardingStep[]> = {};

export const useOnboarding = () => {
  const [processes, setProcesses] = useState<OnboardingProcess[]>([]);
  const [collaborators, setCollaborators] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const { toast } = useToast();

  // Buscar colaboradores reais da API para enriquecer os processos
  const fetchCollaborators = useCallback(async () => {
    if (!user?.id) return;
    
    try {
      console.log('📡 useOnboarding: Buscando colaboradores da API');
      const response = await fetch(`/api/collaborators?userId=${user.id}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch collaborators');
      }
      
      const data = await response.json();
      console.log('✅ useOnboarding: Colaboradores carregados:', data.length);
      setCollaborators(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('❌ useOnboarding: Erro ao buscar colaboradores:', err);
      setCollaborators([]);
    }
  }, [user?.id]);

  // Buscar processos reais da API
  const fetchProcesses = useCallback(async () => {
    if (!user?.id) {
      console.log('📝 useOnboarding: User not authenticated');
      setProcesses([]);
      setIsLoading(false);
      setError(null);
      return;
    }

    console.log('🚀 useOnboarding: Buscando processos da API para userId:', user.id);
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/onboarding?userId=${user.id}`);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ API Error:', response.status, errorText);
        throw new Error(`Failed to fetch processes: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('✅ useOnboarding: Processos recebidos da API:', data);

      // Enriquecer processos com dados de colaboradores
      const enrichedProcesses = data.map((process: any) => {
        const collaborator = collaborators.find(c => c.id === process.collaborator_id);
        return {
          ...process,
          collaborator: collaborator ? {
            id: collaborator.id,
            name: collaborator.name,
            email: collaborator.email
          } : undefined
        };
      });

      setProcesses(enrichedProcesses);
      setError(null);
      console.log('✅ useOnboarding: Processos carregados e enriquecidos:', enrichedProcesses.length);
    } catch (err: any) {
      console.error('❌ useOnboarding: Erro ao buscar processos:', err);
      setProcesses([]);
      setError(err.message || 'Erro ao carregar processos de onboarding');

      toast({
        title: "Erro ao carregar dados",
        description: "Não foi possível carregar os processos de onboarding",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  }, [user?.id, collaborators, toast]);

  // Inicializar: buscar colaboradores e depois processos
  useEffect(() => {
    if (user?.id) {
      fetchCollaborators();
    }
  }, [user?.id, fetchCollaborators]);

  useEffect(() => {
    if (user?.id && collaborators.length >= 0) {
      fetchProcesses();
    }
  }, [user?.id, collaborators, fetchProcesses]);

  // Atualizar progresso do processo via API
  const updateProcessProgress = useCallback(async (processId: string, progress: number) => {
    console.log(`📊 useOnboarding: Atualizando progresso do processo ${processId} para ${progress}%`);

    try {
      const response = await fetch(`/api/onboarding/${processId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ progress }),
      });

      if (!response.ok) {
        throw new Error('Failed to update progress');
      }

      // Atualizar localmente
      setProcesses(current =>
        current.map(process =>
          process.id === processId ? { ...process, progress } : process
        )
      );

      toast({
        title: "Progresso atualizado",
        description: `Progresso atualizado para ${progress}%`,
      });
    } catch (err) {
      console.error('❌ useOnboarding: Erro ao atualizar progresso:', err);
      
      // Atualizar localmente mesmo se a API falhar
      setProcesses(current =>
        current.map(process =>
          process.id === processId ? { ...process, progress } : process
        )
      );
      
      toast({
        title: "Progresso atualizado localmente",
        description: "Alterações serão sincronizadas quando possível",
      });
    }
  }, [toast]);

  // Criar novo processo via API
  const createProcess = useCallback(async (processData: any) => {
    if (!user?.id) {
      console.log('🚫 useOnboarding: User not authenticated');
      toast({
        title: "Erro",
        description: "Usuário não autenticado",
        variant: "destructive"
      });
      return null;
    }

    console.log('✨ useOnboarding: Criando novo processo via API:', processData);

    try {
      const response = await fetch('/api/onboarding', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: user.id,
          collaborator_id: processData.collaborator_id,
          position: processData.position,
          department: processData.department,
          start_date: processData.start_date || new Date().toISOString(),
          status: 'in-progress',
          progress: 0,
          current_step: 'Documentação Pessoal'
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ API Error ao criar processo:', response.status, errorText);
        throw new Error(`Failed to create process: ${response.status}`);
      }

      const newProcess = await response.json();
      console.log('✅ useOnboarding: Processo criado via API:', newProcess);

      // Enriquecer com dados do colaborador
      const collaborator = collaborators.find(c => c.id === newProcess.collaborator_id);
      const enrichedProcess = {
        ...newProcess,
        collaborator: collaborator ? {
          id: collaborator.id,
          name: collaborator.name,
          email: collaborator.email
        } : undefined
      };

      // Inicializar steps mock para o novo processo
      const processSteps = mockStepsTemplate.map((step, index) => ({
        ...step,
        id: `step-${newProcess.id}-${index}`,
        process_id: newProcess.id
      }));
      processStepsStorage[newProcess.id] = processSteps;

      // Atualizar lista de processos
      setProcesses(current => [...current, enrichedProcess]);

      toast({
        title: "Processo criado",
        description: `Onboarding iniciado para ${collaborator?.name || 'colaborador'}`,
      });

      return enrichedProcess;
    } catch (err: any) {
      console.error('❌ useOnboarding: Erro ao criar processo:', err);
      toast({
        title: "Erro",
        description: "Não foi possível criar o processo de onboarding",
        variant: "destructive"
      });
      return null;
    }
  }, [user?.id, collaborators, toast]);

  // Obter steps mock para um processo (NÃO EXISTE no backend)
  const getProcessSteps = useCallback(async (processId: string): Promise<OnboardingStep[]> => {
    console.log('📋 useOnboarding: Obtendo steps mock para processo:', processId);

    // Se já existem steps para este processo, retornar
    if (processStepsStorage[processId]) {
      console.log('✅ Steps encontrados em cache:', processStepsStorage[processId].length);
      return processStepsStorage[processId];
    }

    // Criar steps mock para este processo
    const processSteps = mockStepsTemplate.map((step, index) => ({
      ...step,
      id: `step-${processId}-${index}`,
      process_id: processId
    }));

    processStepsStorage[processId] = processSteps;
    console.log('✅ Steps mock criados:', processSteps.length);
    return processSteps;
  }, []);

  // Atualizar status de um step (apenas local - mock)
  const updateStepStatus = useCallback(async (
    stepId: string,
    completed: boolean,
    processId: string
  ) => {
    console.log(`📝 useOnboarding: Atualizando step ${stepId} para completed=${completed}`);

    if (!processStepsStorage[processId]) {
      console.error('❌ Processo não encontrado no storage:', processId);
      return;
    }

    // Atualizar step localmente
    processStepsStorage[processId] = processStepsStorage[processId].map(step => {
      if (step.id === stepId) {
        return {
          ...step,
          status: completed ? 'completed' : 'pending',
          completed,
          completed_at: completed ? new Date().toISOString() : undefined
        };
      }
      return step;
    });

    // Calcular novo progresso baseado nos steps completados
    const steps = processStepsStorage[processId];
    const completedSteps = steps.filter(s => s.completed).length;
    const totalSteps = steps.length;
    const newProgress = Math.round((completedSteps / totalSteps) * 100);

    // Atualizar progresso do processo
    await updateProcessProgress(processId, newProgress);

    console.log('✅ Step atualizado e progresso recalculado:', newProgress);
  }, [updateProcessProgress]);

  // Função mutate para revalidação manual
  const mutate = useCallback(() => {
    fetchProcesses();
  }, [fetchProcesses]);

  return {
    processes,
    collaborators,
    isLoading,
    error,
    fetchProcesses,
    createProcess,
    getProcessSteps,
    updateStepStatus,
    updateProcessProgress,
    refetch: fetchProcesses,
    refetchCollaborators: fetchCollaborators,
    mutate
  };
};