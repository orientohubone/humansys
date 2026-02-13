
import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useProgressiveLoader } from './useProgressiveLoader';
import { useSessionHealthCheck } from './useSessionHealthCheck';
import { useCollaboratorFetcher } from './useCollaboratorFetcher';
import { useCollaboratorStats } from './useCollaboratorStats';
import { useCollaboratorCreator } from './useCollaboratorCreator';
import type { 
  Collaborator, 
  CollaboratorsData, 
  LoadingState,
  CreateCollaboratorData 
} from '@/types/collaborators';

export const useOptimizedCollaborators = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { sessionHealth } = useSessionHealthCheck();
  const { fetchCollaborators } = useCollaboratorFetcher();
  const { calculateStats } = useCollaboratorStats();
  const { createCollaborator: createCollaboratorAPI } = useCollaboratorCreator();
  
  const {
    loadingState: baseLoadingState,
    data,
    addStage,
    loadProgressively,
    refresh,
    reset
  } = useProgressiveLoader<CollaboratorsData>();

  const [error, setError] = useState<string | null>(null);

  const loadingState: LoadingState = {
    isLoading: baseLoadingState.isLoading,
    currentStage: baseLoadingState.currentStage,
    progress: baseLoadingState.progress
  };

  // Configurar estágios de carregamento - FIXED: removed data.collaborators dependency causing infinite loop
  useEffect(() => {
    if (!user?.id) return;

    reset();

    // Estágio 1: Dados essenciais (colaboradores básicos)
    addStage('collaborators', {
      name: 'collaborators',
      priority: 'high',
      loader: fetchCollaborators
    });

    // Estágio 2: Estatísticas (calculadas dos dados essenciais)
    addStage('stats', {
      name: 'stats',
      priority: 'medium',
      loader: async () => {
        const collaborators = data.collaborators || [];
        return calculateStats(collaborators);
      },
      dependencies: ['collaborators']
    });

  }, [user?.id]); // FIXED: removed problematic dependencies

  // Iniciar carregamento quando usuário estiver disponível
  useEffect(() => {
    if (user?.id && sessionHealth.isHealthy) {
      loadProgressively();
    }
  }, [user?.id, sessionHealth.isHealthy]); // FIXED: removed loadProgressively dependency

  // Criar colaborador otimizado
  const createCollaborator = useCallback(async (collaboratorData: CreateCollaboratorData) => {
    const newCollaborator = await createCollaboratorAPI(collaboratorData);
    
    if (newCollaborator) {
      // Atualizar dados localmente para resposta imediata
      const currentCollaborators = data.collaborators || [];
      const updatedCollaborators = [newCollaborator, ...currentCollaborators];
      
      // Atualizar cache com os novos dados
      const updatedData = {
        collaborators: updatedCollaborators,
        stats: calculateStats(updatedCollaborators)
      };

      // Força atualização local imediata
      Object.assign(data, updatedData);
    }

    return newCollaborator;
  }, [createCollaboratorAPI, data, calculateStats]);

  // Força refresh com feedback visual
  const forceRefresh = useCallback(() => {
    setError(null);
    toast({
      title: "Atualizando",
      description: "Recarregando dados mais recentes..."
    });
    refresh(true);
  }, [refresh, toast]);

  return {
    collaborators: data.collaborators || [],
    stats: data.stats || { total: 0, active: 0, inactive: 0, vacation: 0, departments: 0 },
    loadingState,
    error,
    createCollaborator,
    refresh: forceRefresh,
    isUsingCache: !sessionHealth.isHealthy
  };
};

// Re-export types for backward compatibility
export type { Collaborator, LoadingState } from '@/types/collaborators';
