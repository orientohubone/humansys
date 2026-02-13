
import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useIntelligentCache } from './useIntelligentCache';

interface PerformanceMetrics {
  componentLoadTime: Record<string, number>;
  cacheHitRate: number;
  memoryUsage: number;
  lastUpdate: Date;
  alerts: string[];
}

export const usePerformanceMonitor = (componentName?: string) => {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    componentLoadTime: {},
    cacheHitRate: 0,
    memoryUsage: 0,
    lastUpdate: new Date(),
    alerts: []
  });

  const { stats } = useIntelligentCache();
  const startTimeRef = useRef<number>(Date.now());
  const alertsRef = useRef<Set<string>>(new Set());

  // Medir tempo de carregamento do componente
  useEffect(() => {
    if (componentName) {
      const loadTime = Date.now() - startTimeRef.current;
      
      setMetrics(prev => ({
        ...prev,
        componentLoadTime: {
          ...prev.componentLoadTime,
          [componentName]: loadTime
        },
        lastUpdate: new Date()
      }));

      // Alerta se componente demora mais que 2s para carregar
      if (loadTime > 2000 && !alertsRef.current.has(`slow-${componentName}`)) {
        alertsRef.current.add(`slow-${componentName}`);
        setMetrics(prev => ({
          ...prev,
          alerts: [...prev.alerts, `Componente ${componentName} demorou ${loadTime}ms para carregar`]
        }));
      }
    }
  }, [componentName]);

  // Monitorar métricas do cache
  useEffect(() => {
    setMetrics(prev => ({
      ...prev,
      cacheHitRate: stats.hitRate,
      memoryUsage: stats.memoryUsage,
      lastUpdate: new Date()
    }));

    // Alerta se hit rate do cache está baixo
    if (stats.hitRate < 60 && stats.totalEntries > 10 && !alertsRef.current.has('low-cache-hit')) {
      alertsRef.current.add('low-cache-hit');
      setMetrics(prev => ({
        ...prev,
        alerts: [...prev.alerts, `Cache hit rate baixo: ${stats.hitRate.toFixed(1)}%`]
      }));
    }

    // Alerta se uso de memória está alto
    if (stats.memoryUsage > 5000000 && !alertsRef.current.has('high-memory')) { // 5MB
      alertsRef.current.add('high-memory');
      setMetrics(prev => ({
        ...prev,
        alerts: [...prev.alerts, `Uso de memória alto: ${(stats.memoryUsage / 1024 / 1024).toFixed(1)}MB`]
      }));
    }
  }, [stats]);

  const clearAlerts = useCallback(() => {
    alertsRef.current.clear();
    setMetrics(prev => ({
      ...prev,
      alerts: []
    }));
  }, []);

  const getComponentPerformanceReport = useCallback(() => {
    const components = Object.entries(metrics.componentLoadTime);
    
    return {
      total: components.length,
      average: components.length > 0 
        ? components.reduce((sum, [, time]) => sum + time, 0) / components.length 
        : 0,
      slowest: components.reduce((slowest, [name, time]) => 
        time > slowest.time ? { name, time } : slowest, 
        { name: '', time: 0 }
      ),
      fastest: components.reduce((fastest, [name, time]) => 
        time < fastest.time ? { name, time } : fastest, 
        { name: '', time: Infinity }
      )
    };
  }, [metrics.componentLoadTime]);

  return {
    metrics,
    clearAlerts,
    getComponentPerformanceReport
  };
};
