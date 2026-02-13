
import { useEffect, useCallback } from 'react';
import { useBrainSys } from './useBrainSys';
import { useAuth } from '@/contexts/AuthContext';

interface BrainSysIntegrationOptions {
  moduleName: string;
  autoRecord?: boolean;
  trackActions?: string[];
}

export function useBrainSysIntegration(options: BrainSysIntegrationOptions) {
  const { user } = useAuth();
  const { 
    isInitialized, 
    recordAction, 
    autoRecord, 
    analyzeEntity,
    getEntityInsights 
  } = useBrainSys();

  // Registrar acesso ao módulo
  useEffect(() => {
    if (user && isInitialized && options.autoRecord !== false) {
      autoRecord('module_access', {
        module: options.moduleName,
        timestamp: new Date().toISOString()
      });
    }
  }, [user, isInitialized, options.moduleName, options.autoRecord, autoRecord]);

  // Função para registrar ação específica do módulo
  const trackModuleAction = useCallback(async (action: string, data?: any) => {
    if (user && isInitialized) {
      await recordAction(`${options.moduleName}_${action}`, {
        module: options.moduleName,
        ...data
      });
    }
  }, [user, isInitialized, options.moduleName, recordAction]);

  // Função para obter insights da entidade
  const getModuleInsights = useCallback(async (entityId?: string) => {
    if (!isInitialized) return null;
    
    const targetEntityId = entityId || user?.id;
    if (!targetEntityId) return null;

    return await getEntityInsights(targetEntityId, 'MODULE_INTERACTION');
  }, [isInitialized, user, getEntityInsights]);

  // Função para analisar entidade no contexto do módulo
  const analyzeInModule = useCallback(async (entityId?: string) => {
    if (!isInitialized) return null;
    
    const targetEntityId = entityId || user?.id;
    if (!targetEntityId) return null;

    return await analyzeEntity(targetEntityId, 'MODULE_ANALYSIS');
  }, [isInitialized, user, analyzeEntity]);

  return {
    isActive: isInitialized,
    trackAction: trackModuleAction,
    getInsights: getModuleInsights,
    analyze: analyzeInModule,
  };
}
