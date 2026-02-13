import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useToast } from '@/hooks/use-toast';

interface QueryOptions {
  maxRetries?: number;
  retryDelay?: number;
  requireAuth?: boolean;
  timeout?: number;
  useCache?: boolean;
}

// Mock cache simples
const mockCache = new Map<string, any>();

export const useSupabaseQuery = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const executeQuery = useCallback(async <T>(
    queryFn: () => any,
    options: QueryOptions = {}
  ): Promise<T | null> => {
    const { 
      maxRetries = 3, 
      retryDelay = 1000, 
      requireAuth = false,
      timeout = 10000,
      useCache = false
    } = options;

    // Para desenvolvimento, simular sempre autenticado
    if (requireAuth) {
      console.log('useSupabaseQuery: Simulando usuário autenticado');
    }

    // Gerar chave de cache
    const cacheKey = useCache ? JSON.stringify(queryFn.toString()) : null;
    if (cacheKey && mockCache.has(cacheKey)) {
      console.log('useSupabaseQuery: Retornando dados do cache mock');
      return mockCache.get(cacheKey);
    }

    setIsLoading(true);
    let lastError: any = null;

    console.log('useSupabaseQuery: Executando query mock...');

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        console.log(`useSupabaseQuery: Tentativa ${attempt}/${maxRetries}`);

        // Simular delay de rede
        await new Promise(resolve => setTimeout(resolve, 200));

        // Executar a função mock fornecida
        const result = await Promise.race([
          Promise.resolve(queryFn()),
          new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Query timeout')), timeout)
          )
        ]);

        console.log(`useSupabaseQuery: Sucesso na tentativa ${attempt}`);

        // Armazenar no cache se solicitado
        if (cacheKey && result) {
          mockCache.set(cacheKey, result);
        }

        setIsLoading(false);
        return result as T;
      } catch (error: any) {
        console.error(`useSupabaseQuery: Erro na tentativa ${attempt}:`, error);
        lastError = error;

        if (attempt < maxRetries && !error.message?.includes('timeout')) {
          await new Promise(resolve => setTimeout(resolve, retryDelay * attempt));
        } else if (error.message?.includes('timeout')) {
          console.error('useSupabaseQuery: Timeout - parando tentativas');
          break;
        }
      }
    }

    // Se chegou aqui, todas as tentativas falharam
    setIsLoading(false);

    const errorMessage = lastError?.message || 'Erro desconhecido ao carregar dados';
    console.error('useSupabaseQuery: Todas as tentativas falharam:', lastError);

    let userMessage = errorMessage;
    if (errorMessage.includes('timeout')) {
      userMessage = 'Timeout na operação. Tente novamente.';
    }

    toast({
      title: "Erro ao carregar dados",
      description: `${userMessage} (${maxRetries} tentativas)`,
      variant: "destructive"
    });

    return null;
  }, [toast]);

  return {
    executeQuery,
    isLoading
  };
};