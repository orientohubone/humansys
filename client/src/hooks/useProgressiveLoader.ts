
import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useIntelligentCache } from './useIntelligentCache';

interface LoadingState {
  isLoading: boolean;
  progress: number;
  currentStage: 'initial' | 'collaborators' | 'stats' | 'complete';
  error: string | null;
}

interface LoadStage<T> {
  name: string;
  priority: 'high' | 'medium' | 'low';
  loader: () => Promise<T>;
  dependencies?: string[];
}

export const useProgressiveLoader = <T extends Record<string, any>>() => {
  const [loadingState, setLoadingState] = useState<LoadingState>({
    isLoading: false,
    progress: 0,
    currentStage: 'initial',
    error: null
  });
  
  const [data, setData] = useState<Partial<T>>({});
  const { get, set } = useIntelligentCache();
  const abortControllerRef = useRef<AbortController | null>(null);
  const stagesRef = useRef<LoadStage<any>[]>([]);

  const addStage = useCallback(<K extends keyof T>(
    key: K,
    stage: LoadStage<T[K]>
  ) => {
    stagesRef.current.push({ ...stage, name: key as string });
  }, []);

  const loadProgressively = useCallback(async () => {
    if (stagesRef.current.length === 0) return;

    // Cancelar carregamento anterior se existir
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    abortControllerRef.current = new AbortController();
    const signal = abortControllerRef.current.signal;

    setLoadingState({
      isLoading: true,
      progress: 0,
      currentStage: 'initial',
      error: null
    });

    try {
      const stages = stagesRef.current.sort((a, b) => {
        const priorityOrder = { high: 3, medium: 2, low: 1 };
        return priorityOrder[b.priority] - priorityOrder[a.priority];
      });

      // Carregar dados essenciais primeiro (high priority)
      setLoadingState(prev => ({ ...prev, currentStage: 'collaborators' }));
      const essentialStages = stages.filter(s => s.priority === 'high');
      
      for (let i = 0; i < essentialStages.length; i++) {
        if (signal.aborted) return;
        
        const stage = essentialStages[i];
        const cacheKey = `progressive_${stage.name}`;
        
        // Tentar cache primeiro
        let result = get(cacheKey);
        
        if (!result) {
          result = await stage.loader();
          set(cacheKey, result, { 
            ttl: 2 * 60 * 1000, // 2 min para dados essenciais
            priority: 'high' 
          });
        }
        
        setData(prev => ({ ...prev, [stage.name]: result }));
        setLoadingState(prev => ({ 
          ...prev, 
          progress: ((i + 1) / essentialStages.length) * 50 
        }));
      }

      // Carregar dados secundários (medium/low priority)
      setLoadingState(prev => ({ ...prev, currentStage: 'stats' }));
      const secondaryStages = stages.filter(s => s.priority !== 'high');
      
      for (let i = 0; i < secondaryStages.length; i++) {
        if (signal.aborted) return;
        
        const stage = secondaryStages[i];
        const cacheKey = `progressive_${stage.name}`;
        
        // Delay pequeno para não bloquear UI
        await new Promise(resolve => setTimeout(resolve, 50));
        
        let result = get(cacheKey);
        
        if (!result) {
          result = await stage.loader();
          set(cacheKey, result, { 
            ttl: 5 * 60 * 1000, // 5 min para dados secundários
            priority: stage.priority 
          });
        }
        
        setData(prev => ({ ...prev, [stage.name]: result }));
        setLoadingState(prev => ({ 
          ...prev, 
          progress: 50 + ((i + 1) / secondaryStages.length) * 50 
        }));
      }

      setLoadingState({
        isLoading: false,
        progress: 100,
        currentStage: 'complete',
        error: null
      });

    } catch (error: any) {
      if (!signal.aborted) {
        setLoadingState(prev => ({
          ...prev,
          isLoading: false,
          error: error.message || 'Erro no carregamento'
        }));
      }
    }
  }, [get, set]);

  const refresh = useCallback((forceReload = false) => {
    if (forceReload) {
      // Limpar cache relacionado
      stagesRef.current.forEach(stage => {
        const cacheKey = `progressive_${stage.name}`;
        // Cache manager will handle removal
      });
      setData({});
    }
    loadProgressively();
  }, [loadProgressively]);

  const reset = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    stagesRef.current = [];
    setData({});
    setLoadingState({
      isLoading: false,
      progress: 0,
      currentStage: 'initial',
      error: null
    });
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  return {
    loadingState,
    data,
    addStage,
    loadProgressively,
    refresh,
    reset
  };
};
