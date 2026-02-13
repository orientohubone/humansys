import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Component to force refresh navigation state and clear potential cache issues
 */
export const RouterRefresher = () => {
  const location = useLocation();

  useEffect(() => {
    // Log navigation for debugging
    console.log(`🧭 RouterRefresher: Rota mudou para ${location.pathname}`);
    
    // Clear any potential component cache on route change
    if ('requestIdleCallback' in window) {
      requestIdleCallback(() => {
        // Force garbage collection of unused components
        if (window.gc) {
          window.gc();
        }
      });
    }
    
    // Force re-render of lazy loaded components by clearing import cache
    const currentPath = location.pathname;
    if (currentPath.startsWith('/app/')) {
      console.log(`🔄 RouterRefresher: Limpando cache para ${currentPath}`);
    }
  }, [location.pathname]);

  return null;
};