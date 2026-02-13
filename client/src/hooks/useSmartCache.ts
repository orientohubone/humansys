
import { useState, useEffect, useCallback, useMemo, useRef } from 'react';

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
}

interface CacheConfig {
  defaultTTL: number;
  maxSize: number;
  enabled: boolean;
}

export const useSmartCache = <T>(config: Partial<CacheConfig> = {}) => {
  const defaultConfig: CacheConfig = {
    defaultTTL: 5 * 60 * 1000, // 5 minutes
    maxSize: 100,
    enabled: true,
    ...config
  };

  const [cache, setCache] = useState<Map<string, CacheEntry<T>>>(new Map());
  const [stats, setStats] = useState({
    hits: 0,
    misses: 0,
    size: 0
  });

  const isExpired = useCallback((entry: CacheEntry<T>): boolean => {
    return Date.now() - entry.timestamp > entry.ttl;
  }, []);

  const cleanupExpired = useCallback(() => {
    if (!defaultConfig.enabled) return;

    setCache(prevCache => {
      const newCache = new Map(prevCache);
      let removed = 0;

      for (const [key, entry] of newCache.entries()) {
        if (isExpired(entry)) {
          newCache.delete(key);
          removed++;
        }
      }

      if (removed > 0) {
        console.log(`Smart cache cleanup: removed ${removed} expired entries`);
      }

      return newCache;
    });
  }, [defaultConfig.enabled, isExpired]);

  const enforceMaxSize = useCallback(() => {
    if (!defaultConfig.enabled) return;

    setCache(prevCache => {
      if (prevCache.size <= defaultConfig.maxSize) return prevCache;

      const newCache = new Map(prevCache);
      
      // Sort by timestamp (oldest first)
      entries.sort((a, b) => a[1].timestamp - b[1].timestamp);
      
      // Remove oldest entries
      const toRemove = entries.length - defaultConfig.maxSize;
      for (let i = 0; i < toRemove; i++) {
        newCache.delete(entries[i][0]);
      }

      console.log(`Smart cache size enforcement: removed ${toRemove} oldest entries`);
      return newCache;
    });
  }, [defaultConfig.enabled, defaultConfig.maxSize]);

  const get = useCallback((key: string): T | null => {
    if (!defaultConfig.enabled) return null;

    const entry = cache.get(key);
    
    if (!entry) {
      setStats(prev => ({ ...prev, misses: prev.misses + 1 }));
      return null;
    }

    if (isExpired(entry)) {
      cache.delete(key);
      setStats(prev => ({ ...prev, misses: prev.misses + 1 }));
      return null;
    }

    setStats(prev => ({ ...prev, hits: prev.hits + 1 }));
    return entry.data;
  }, [cache, defaultConfig.enabled, isExpired]);

  const set = useCallback((key: string, data: T, customTTL?: number): void => {
    if (!defaultConfig.enabled) return;

    const entry: CacheEntry<T> = {
      data,
      timestamp: Date.now(),
      ttl: customTTL || defaultConfig.defaultTTL
    };

    setCache(prevCache => {
      const newCache = new Map(prevCache);
      newCache.set(key, entry);
      return newCache;
    });
  }, [defaultConfig.enabled, defaultConfig.defaultTTL]);

  const remove = useCallback((key: string): void => {
    setCache(prevCache => {
      const newCache = new Map(prevCache);
      newCache.delete(key);
      return newCache;
    });
  }, []);

  const clear = useCallback((): void => {
    setCache(new Map());
    setStats({ hits: 0, misses: 0, size: 0 });
  }, []);

  const getStats = useCallback(() => {
    const hitRate = stats.hits + stats.misses > 0 
      ? (stats.hits / (stats.hits + stats.misses) * 100).toFixed(2)
      : '0.00';

    return {
      ...stats,
      size: cache.size,
      hitRate: `${hitRate}%`,
      enabled: defaultConfig.enabled
    };
  }, [stats, cache.size, defaultConfig.enabled]);

  // Cleanup effect
  useEffect(() => {
    if (!defaultConfig.enabled) return;

    const interval = setInterval(() => {
      cleanupExpired();
      enforceMaxSize();
    }, 60000); // Every minute

    return () => clearInterval(interval);
  }, [defaultConfig.enabled, cleanupExpired, enforceMaxSize]);

  // Update stats when cache changes
  useEffect(() => {
    setStats(prev => ({ ...prev, size: cache.size }));
  }, [cache.size]);

  return {
    get,
    set,
    remove,
    clear,
    getStats,
    cleanupExpired,
    cache: cache as ReadonlyMap<string, CacheEntry<T>>
  };
};
