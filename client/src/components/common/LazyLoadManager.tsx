import React, { Suspense, useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';

interface LazyLoadManagerProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  preload?: boolean;
  priority?: 'high' | 'medium' | 'low';
}

const FastLoadingSpinner = () => (
  <div className="flex items-center justify-center min-h-[200px] bg-background/50 backdrop-blur-sm">
    <div className="flex flex-col items-center space-y-4">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
      <p className="text-sm text-muted-foreground animate-pulse">Carregando...</p>
    </div>
  </div>
);

// Cache para componentes já carregados
const componentCache = new Map<string, React.ComponentType<any>>();

export const LazyLoadManager: React.FC<LazyLoadManagerProps> = ({
  children,
  fallback = <FastLoadingSpinner />,
  preload = false,
  priority = 'medium'
}) => {
  const [isPreloaded, setIsPreloaded] = useState(false);

  useEffect(() => {
    if (preload && priority === 'high') {
      // Preload imediatamente para componentes de alta prioridade
      setIsPreloaded(true);
    } else if (preload && priority === 'medium') {
      // Preload após um pequeno delay para prioridade média
      const timeout = setTimeout(() => setIsPreloaded(true), 100);
      return () => clearTimeout(timeout);
    } else if (preload && priority === 'low') {
      // Preload após idle para prioridade baixa
      const timeout = setTimeout(() => setIsPreloaded(true), 500);
      return () => clearTimeout(timeout);
    }
  }, [preload, priority]);

  return (
    <Suspense fallback={fallback}>
      {children}
    </Suspense>
  );
};

// Hook para preloading inteligente baseado na navegação
export const usePreloadRoutes = () => {
  useEffect(() => {
    // Preload das rotas mais comuns após a aplicação carregar
    const preloadCommonRoutes = async () => {
      try {
        // Preload das páginas mais acessadas
        await Promise.all([
          import('@/pages/Dashboard'),
          import('@/pages/ModernTraining'),
          import('@/pages/Profile'),
          import('@/pages/Collaborators')
        ]);
      } catch (error) {
        console.log('Preload routes failed:', error);
      }
    };

    // Executar preload após a aplicação estar estável
    const timeout = setTimeout(preloadCommonRoutes, 2000);
    return () => clearTimeout(timeout);
  }, []);
};

// Sistema de cache para componentes
export const withCache = <T extends Record<string, any>>(
  Component: React.ComponentType<T>,
  cacheKey: string
) => {
  if (componentCache.has(cacheKey)) {
    return componentCache.get(cacheKey) as React.ComponentType<T>;
  }

  const CachedComponent = (props: T) => <Component {...props} />;
  componentCache.set(cacheKey, CachedComponent);
  return CachedComponent;
};