
import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
}

interface CacheStats {
  hits: number;
  misses: number;
  totalRequests: number;
}

export const useOptimizedCache = <T>(defaultTTL: number = 5 * 60 * 1000) => {
  const [cache] = useState(() => new Map<string, CacheEntry<T>>());
  const [stats, setStats] = useState<CacheStats>({ hits: 0, misses: 0, totalRequests: 0 });
  const { user } = useAuth();

  // Limpar cache quando usuário faz logout
  useEffect(() => {
    if (!user) {
      cache.clear();
      setStats({ hits: 0, misses: 0, totalRequests: 0 });
      console.log('Cache cleared due to logout');
    }
  }, [user, cache]);

  const get = useCallback((key: string, customTTL?: number): T | null => {
    setStats(prev => ({ ...prev, totalRequests: prev.totalRequests + 1 }));
    
    const entry = cache.get(key);
    if (!entry) {
      setStats(prev => ({ ...prev, misses: prev.misses + 1 }));
      return null;
    }

    const ttl = customTTL || defaultTTL;
    const isExpired = Date.now() - entry.timestamp > ttl;
    
    if (isExpired) {
      cache.delete(key);
      setStats(prev => ({ ...prev, misses: prev.misses + 1 }));
      return null;
    }

    setStats(prev => ({ ...prev, hits: prev.hits + 1 }));
    return entry.data;
  }, [cache, defaultTTL]);

  const set = useCallback((key: string, data: T, customTTL?: number) => {
    const ttl = customTTL || defaultTTL;
    cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl
    });
  }, [cache, defaultTTL]);

  const clear = useCallback(() => {
    cache.clear();
    setStats({ hits: 0, misses: 0, totalRequests: 0 });
  }, [cache]);

  const hitRate = useMemo(() => {
    return stats.totalRequests > 0 ? (stats.hits / stats.totalRequests) * 100 : 0;
  }, [stats]);

  return { get, set, clear, stats: { ...stats, hitRate } };
};
