
import { useState, useEffect, useCallback } from 'react';
import { brainSysService, BrainSysStatus, BrainSysResponse } from '@/services/brainSysService';
import { useAuth } from '@/contexts/AuthContext';

export function useBrainSys() {
  const { user } = useAuth();
  const [status, setStatus] = useState<BrainSysStatus | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // Inicializar BrainSys
  const initialize = useCallback(async () => {
    setIsLoading(true);
    try {
      const success = await brainSysService.initialize();
      setIsInitialized(success);
      if (success) {
        await refreshStatus();
      }
    } catch (error) {
      console.error('❌ Erro ao inicializar BrainSys:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Atualizar status
  const refreshStatus = useCallback(async () => {
    try {
      const systemStatus = await brainSysService.getSystemStatus();
      setStatus(systemStatus);
      setIsInitialized(systemStatus?.initialized || false);
    } catch (error) {
      console.error('❌ Erro ao obter status:', error);
    }
  }, []);

  // Analisar entidade
  const analyzeEntity = useCallback(async (entityId: string, context?: string): Promise<BrainSysResponse> => {
    setIsLoading(true);
    try {
      const result = await brainSysService.analyzeEntity(entityId, context);
      return result;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Analisar equipe
  const analyzeTeam = useCallback(async (teamId: string): Promise<BrainSysResponse> => {
    setIsLoading(true);
    try {
      const result = await brainSysService.analyzeTeam(teamId);
      return result;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Registrar ação do usuário
  const recordAction = useCallback(async (actionType: string, actionData?: any) => {
    if (user?.id) {
      return await brainSysService.recordUserAction(user.id, actionType, actionData);
    }
    return false;
  }, [user]);

  // Auto-registrar ação (chamada automática)
  const autoRecord = useCallback(async (action: string, data?: any) => {
    if (user?.id && isInitialized) {
      await brainSysService.autoRecordAction(user.id, action, data);
    }
  }, [user, isInitialized]);

  // Obter insights de entidade
  const getEntityInsights = useCallback(async (entityId: string, context?: string) => {
    return await brainSysService.getEntityInsights(entityId, context);
  }, []);

  // Obter insights de memória
  const getMemoryInsights = useCallback(async () => {
    return await brainSysService.getMemoryInsights();
  }, []);

  // Obter métricas de feedback
  const getFeedbackMetrics = useCallback(async () => {
    return await brainSysService.getFeedbackMetrics();
  }, []);

  // Inicializar automaticamente quando o usuário estiver disponível
  useEffect(() => {
    if (user && !isInitialized) {
      initialize();
    }
  }, [user, isInitialized, initialize]);

  // Atualizar status periodicamente
  useEffect(() => {
    if (isInitialized) {
      const interval = setInterval(refreshStatus, 30000); // A cada 30 segundos
      return () => clearInterval(interval);
    }
  }, [isInitialized, refreshStatus]);

  return {
    // Estado
    status,
    isLoading,
    isInitialized,
    isActive: brainSysService.isActive(),
    
    // Ações
    initialize,
    refreshStatus,
    analyzeEntity,
    analyzeTeam,
    recordAction,
    autoRecord,
    getEntityInsights,
    getMemoryInsights,
    getFeedbackMetrics,
  };
}
