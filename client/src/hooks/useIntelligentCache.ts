
import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  accessCount: number;
  lastAccess: number;
  ttl: number;
  priority: 'high' | 'medium' | 'low';
}

interface CacheStats {
  totalEntries: number;
  hitRate: number;
  memoryUsage: number;
  lastCleanup: number;
}

class IntelligentCacheManager {
  private cache = new Map<string, CacheEntry<any>>();
  private maxEntries = 1000;
  private cleanupInterval: NodeJS.Timeout | null = null;
  private isDestroyed = false;
  private hitCount = 0;
  private missCount = 0;

  constructor() {
    this.startCleanupTimer();
    this.loadFromIndexedDB();
  }

  private startCleanupTimer() {
    // Limpeza automática a cada 5 minutos
    this.cleanupInterval = setInterval(() => {
      if (!this.isDestroyed) {
        this.cleanup();
      }
    }, 5 * 60 * 1000);
  }

  private async loadFromIndexedDB() {
    if (this.isDestroyed) return;
    
    try {
      const request = indexedDB.open('HumansysCache', 1);
      
      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains('cache')) {
          db.createObjectStore('cache', { keyPath: 'key' });
        }
      };

      request.onsuccess = (event) => {
        if (this.isDestroyed) return;
        
        const db = (event.target as IDBOpenDBRequest).result;
        const transaction = db.transaction(['cache'], 'readonly');
        const store = transaction.objectStore('cache');
        const getAllRequest = store.getAll();

        getAllRequest.onsuccess = () => {
          if (this.isDestroyed) return;
          
          const items = getAllRequest.result;
          items.forEach((item: any) => {
            if (this.isValidEntry(item.value)) {
              this.cache.set(item.key, item.value);
            }
          });
          console.log(`Loaded ${items.length} cache entries from IndexedDB`);
        };
      };
    } catch (error) {
      console.warn('Failed to load cache from IndexedDB:', error);
    }
  }

  private async saveToIndexedDB(key: string, entry: CacheEntry<any>) {
    if (this.isDestroyed) return;
    
    try {
      const request = indexedDB.open('HumansysCache', 1);
      request.onsuccess = (event) => {
        if (this.isDestroyed) return;
        
        const db = (event.target as IDBOpenDBRequest).result;
        const transaction = db.transaction(['cache'], 'readwrite');
        const store = transaction.objectStore('cache');
        store.put({ key, value: entry });
      };
    } catch (error) {
      console.warn('Failed to save to IndexedDB:', error);
    }
  }

  private isValidEntry(entry: CacheEntry<any>): boolean {
    const now = Date.now();
    return (now - entry.timestamp) < entry.ttl;
  }

  set<T>(key: string, data: T, options: {
    ttl?: number;
    priority?: 'high' | 'medium' | 'low';
  } = {}) {
    if (this.isDestroyed) return;
    
    const entry: CacheEntry<T> = {
      data,
      timestamp: Date.now(),
      accessCount: 1,
      lastAccess: Date.now(),
      ttl: options.ttl || 5 * 60 * 1000, // 5 min default
      priority: options.priority || 'medium'
    };

    this.cache.set(key, entry);
    this.saveToIndexedDB(key, entry);

    // Limpar cache se exceder limite
    if (this.cache.size > this.maxEntries) {
      this.evictLeastUsed();
    }
  }

  get<T>(key: string): T | null {
    if (this.isDestroyed) return null;
    
    const entry = this.cache.get(key);
    
    if (!entry || !this.isValidEntry(entry)) {
      this.cache.delete(key);
      this.missCount++;
      return null;
    }

    // Atualizar estatísticas de acesso
    entry.accessCount++;
    entry.lastAccess = Date.now();
    this.cache.set(key, entry);
    this.hitCount++;

    return entry.data;
  }

  private evictLeastUsed() {
    if (this.isDestroyed) return;
    
    const entries = Array.from(this.cache.entries());
    
    // Ordenar por prioridade e frequência de acesso
    entries.sort(([, a], [, b]) => {
      const priorityWeight: Record<string, number> = { high: 3, medium: 2, low: 1 };
      const aScore = a.accessCount * (priorityWeight[a.priority] || 1);
      const bScore = b.accessCount * (priorityWeight[b.priority] || 1);
      return aScore - bScore;
    });

    // Remover 20% dos itens menos usados
    const toRemove = Math.floor(entries.length * 0.2);
    for (let i = 0; i < toRemove; i++) {
      this.cache.delete(entries[i][0]);
    }

    console.log(`Evicted ${toRemove} cache entries`);
  }

  private cleanup() {
    if (this.isDestroyed) return;
    
    const now = Date.now();
    const beforeSize = this.cache.size;
    
    for (const [key, entry] of Array.from(this.cache.entries())) {
      if (!this.isValidEntry(entry)) {
        this.cache.delete(key);
      }
    }

    const removed = beforeSize - this.cache.size;
    if (removed > 0) {
      console.log(`Cache cleanup: removed ${removed} expired entries`);
    }
  }

  clear() {
    if (this.isDestroyed) return;
    
    this.cache.clear();
    this.hitCount = 0;
    this.missCount = 0;
    
    // Limpar IndexedDB também
    try {
      const request = indexedDB.open('HumansysCache', 1);
      request.onsuccess = (event) => {
        if (this.isDestroyed) return;
        
        const db = (event.target as IDBOpenDBRequest).result;
        const transaction = db.transaction(['cache'], 'readwrite');
        const store = transaction.objectStore('cache');
        store.clear();
      };
    } catch (error) {
      console.warn('Failed to clear IndexedDB:', error);
    }
  }

  private estimateMemoryUsage(): number {
    let totalSize = 0;
    for (const [key, entry] of Array.from(this.cache.entries())) {
      // Rough estimate: key size + JSON stringify of data
      totalSize += key.length * 2; // UTF-16 characters
      try {
        totalSize += JSON.stringify(entry.data).length * 2;
      } catch {
        totalSize += 1000; // fallback estimate for non-serializable data
      }
    }
    return totalSize;
  }

  getStats(): CacheStats {
    if (this.isDestroyed) {
      return {
        totalEntries: 0,
        hitRate: 0,
        memoryUsage: 0,
        lastCleanup: Date.now()
      };
    }
    
    const totalRequests = this.hitCount + this.missCount;
    
    return {
      totalEntries: this.cache.size,
      hitRate: totalRequests > 0 ? (this.hitCount / totalRequests) * 100 : 0,
      memoryUsage: this.estimateMemoryUsage(),
      lastCleanup: Date.now()
    };
  }

  destroy() {
    this.isDestroyed = true;
    
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
      this.cleanupInterval = null;
    }
    
    this.cache.clear();
    this.hitCount = 0;
    this.missCount = 0;
  }
}

// Singleton instance com destruição adequada
let cacheManager: IntelligentCacheManager | null = null;

const getCacheManager = () => {
  if (!cacheManager) {
    cacheManager = new IntelligentCacheManager();
  }
  return cacheManager;
};

export const useIntelligentCache = () => {
  const [stats, setStats] = useState<CacheStats>(() => getCacheManager().getStats());
  const updateStatsRef = useRef<NodeJS.Timeout | null>(null);

  const updateStats = useCallback(() => {
    const manager = getCacheManager();
    setStats(manager.getStats());
  }, []);

  useEffect(() => {
    updateStatsRef.current = setInterval(updateStats, 10000); // Update stats every 10s
    
    return () => {
      if (updateStatsRef.current) {
        clearInterval(updateStatsRef.current);
        updateStatsRef.current = null;
      }
    };
  }, [updateStats]);

  const set = useCallback(<T>(key: string, data: T, options?: {
    ttl?: number;
    priority?: 'high' | 'medium' | 'low';
  }) => {
    const manager = getCacheManager();
    manager.set(key, data, options);
    updateStats();
  }, [updateStats]);

  const get = useCallback(<T>(key: string): T | null => {
    const manager = getCacheManager();
    const result = manager.get<T>(key);
    updateStats();
    return result;
  }, [updateStats]);

  const clear = useCallback(() => {
    const manager = getCacheManager();
    manager.clear();
    updateStats();
  }, [updateStats]);

  return {
    set,
    get,
    clear,
    stats
  };
};

// Limpar quando usuário sair - com verificação de existência
window.addEventListener('beforeunload', () => {
  if (cacheManager) {
    cacheManager.destroy();
    cacheManager = null;
  }
});
