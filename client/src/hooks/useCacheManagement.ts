
import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';

interface CacheIntegrityCheck {
  isValid: boolean;
  errors: string[];
  timestamp: number;
}

export const useCacheManagement = () => {
  const [isClearing, setIsClearing] = useState(false);
  const [lastCleared, setLastCleared] = useState<number | null>(null);
  const { user } = useAuth();

  const clearAllCaches = useCallback(async () => {
    setIsClearing(true);
    console.log('Iniciando limpeza completa do cache...');

    try {
      // 1. Limpar localStorage
      const keysToRemove = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && (

          key.includes('auth') || 
          key.includes('cache') ||
          key.includes('trainings') ||
          key.includes('dashboard') ||
          key.includes('founder')
        )) {
          keysToRemove.push(key);
        }
      }
      
      keysToRemove.forEach(key => {
        localStorage.removeItem(key);
        console.log(`Cache removido: ${key}`);
      });

      // 2. Limpar sessionStorage
      sessionStorage.clear();
      console.log('SessionStorage limpo');

      // 3. Limpar cache do browser se disponível
      if ('caches' in window) {
        const cacheNames = await caches.keys();
        await Promise.all(
          cacheNames.map(cacheName => caches.delete(cacheName))
        );
        console.log('Cache do browser limpo');
      }

      // 4. Forçar garbage collection se disponível
      if (window.gc) {
        window.gc();
        console.log('Garbage collection executado');
      }

      setLastCleared(Date.now());
      console.log('Limpeza completa do cache concluída');

      return true;
    } catch (error) {
      console.error('Erro durante limpeza do cache:', error);
      return false;
    } finally {
      setIsClearing(false);
    }
  }, []);

  const checkCacheIntegrity = useCallback((): CacheIntegrityCheck => {
    const errors: string[] = [];
    let isValid = true;

    try {
      // Verificar consistência do localStorage


      
      if (authData && !userData) {
        errors.push('Auth token exists but user data is missing');
        isValid = false;
      }

      // Verificar dados corrompidos
      const cacheKeys = Object.keys(localStorage).filter(key => 
        key.includes('cache') || key.includes('trainings') || key.includes('dashboard')
      );

      for (const key of cacheKeys) {
        try {
          const data = localStorage.getItem(key);
          if (data) {
            JSON.parse(data);
          }
        } catch (e) {
          errors.push(`Corrupted cache data in ${key}`);
          isValid = false;
        }
      }

      console.log('Verificação de integridade do cache:', { isValid, errors });
      
      return {
        isValid,
        errors,
        timestamp: Date.now()
      };
    } catch (error) {
      console.error('Erro durante verificação de integridade:', error);
      return {
        isValid: false,
        errors: ['Failed to check cache integrity'],
        timestamp: Date.now()
      };
    }
  }, []);

  const repairCache = useCallback(async () => {
    console.log('Iniciando reparo do cache...');
    
    const integrity = checkCacheIntegrity();
    
    if (!integrity.isValid) {
      console.log('Cache corrompido detectado, iniciando limpeza...');
      await clearAllCaches();
      
      // Aguardar um momento para estabilizar
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log('Reparo do cache concluído');
      return true;
    }
    
    console.log('Cache íntegro, nenhum reparo necessário');
    return false;
  }, [clearAllCaches, checkCacheIntegrity]);

  const forceRefresh = useCallback(() => {
    console.log('Forçando refresh da aplicação...');
    window.location.reload();
  }, []);

  // Verificação automática de integridade na inicialização
  useEffect(() => {
    const autoCheck = setTimeout(() => {
      const integrity = checkCacheIntegrity();
      if (!integrity.isValid) {
        console.warn('Cache corrompido detectado na inicialização');
        repairCache();
      }
    }, 1000);

    return () => clearTimeout(autoCheck);
  }, [checkCacheIntegrity, repairCache]);

  // Limpeza automática quando usuário faz logout
  useEffect(() => {
    if (!user && lastCleared) {
      const timeSinceLastClear = Date.now() - lastCleared;
      if (timeSinceLastClear > 5 * 60 * 1000) { // 5 minutos
        clearAllCaches();
      }
    }
  }, [user, lastCleared, clearAllCaches]);

  return {
    clearAllCaches,
    checkCacheIntegrity,
    repairCache,
    forceRefresh,
    isClearing,
    lastCleared
  };
};
