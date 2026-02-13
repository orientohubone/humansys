import { useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';

// Cache para páginas já carregadas
const pageCache = new Map<string, Promise<any>>();

// Routes mais comuns que devem ser preloaded
const COMMON_ROUTES = [
  '/app/dashboard',
  '/app/training',
  '/app/collaborators',
  '/app/profile'
];

// Routes por prioridade
const ROUTE_PRIORITIES: Record<string, 'high' | 'medium' | 'low'> = {
  '/app/dashboard': 'high',
  '/app/training': 'high',
  '/app/collaborators': 'medium',
  '/app/profile': 'medium',
  '/app/founder-dashboard': 'low',
  '/app/analytics': 'low'
};

export const useRouterOptimization = () => {
  const location = useLocation();

  // Função para preload de uma rota específica (não invasiva)
  const preloadRoute = useCallback(async (routePath: string) => {
    // Só fazer preload se a rota não está sendo atualmente carregada
    if (pageCache.has(routePath) || location.pathname === routePath) {
      return pageCache.get(routePath);
    }

    let importPromise: Promise<any>;
    
    try {
      switch (routePath) {
        case '/app/dashboard':
          importPromise = import('@/pages/Dashboard');
          break;
        case '/app/training':
          importPromise = import('@/pages/ModernTraining');
          break;
        case '/app/collaborators':
          importPromise = import('@/pages/Collaborators');
          break;
        case '/app/profile':
          importPromise = import('@/pages/Profile');
          break;
        case '/app/founder-dashboard':
          importPromise = import('@/pages/FounderDashboard');
          break;
        case '/app/analytics':
          importPromise = import('@/pages/Analytics');
          break;
        default:
          return;
      }

      pageCache.set(routePath, importPromise);
      await importPromise;
      console.log(`✅ Route preloaded: ${routePath}`);
    } catch (error) {
      console.log(`❌ Failed to preload route: ${routePath}`, error);
      pageCache.delete(routePath);
    }
  }, [location.pathname]);

  // Preload inteligente baseado na rota atual
  const preloadRelatedRoutes = useCallback((currentPath: string) => {
    const relatedRoutes: Record<string, string[]> = {
      '/app/dashboard': ['/app/training', '/app/collaborators'],
      '/app/training': ['/app/collaborators', '/app/analytics'],
      '/app/collaborators': ['/app/training', '/app/profile'],
      '/app/profile': ['/app/dashboard', '/app/collaborators']
    };

    const routes = relatedRoutes[currentPath] || [];
    routes.forEach(route => {
      // Usar requestIdleCallback para não bloquear UI
      if ('requestIdleCallback' in window) {
        requestIdleCallback(() => preloadRoute(route));
      } else {
        setTimeout(() => preloadRoute(route), 100);
      }
    });
  }, [preloadRoute]);

  // Preload inicial das rotas mais comuns
  useEffect(() => {
    const preloadCommonRoutes = async () => {
      for (const route of COMMON_ROUTES) {
        const priority = ROUTE_PRIORITIES[route] || 'low';
        const delay = priority === 'high' ? 0 : priority === 'medium' ? 200 : 500;
        
        setTimeout(() => preloadRoute(route), delay);
      }
    };

    // Aguardar um pouco antes de fazer preload para não afetar carregamento inicial
    const timeout = setTimeout(preloadCommonRoutes, 1000);
    return () => clearTimeout(timeout);
  }, [preloadRoute]);

  // Preload baseado na rota atual com debounce
  useEffect(() => {
    const timeout = setTimeout(() => {
      preloadRelatedRoutes(location.pathname);
    }, 500); // Aguarda 500ms após mudança de rota
    
    return () => clearTimeout(timeout);
  }, [location.pathname, preloadRelatedRoutes]);

  // Função para prefetch manual de uma rota
  const prefetchRoute = useCallback((routePath: string) => {
    preloadRoute(routePath);
  }, [preloadRoute]);

  return {
    prefetchRoute,
    isRouteCached: (route: string) => pageCache.has(route)
  };
};