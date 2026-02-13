
import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export const RedirectHandler = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Redirect legacy routes to /app/[route]
    const legacyRoutes = [
      '/dashboard',
      '/founder-dashboard', 
      '/collaborators',
      '/brainsys-iao',
      '/recruitment',
      '/onboarding',
      '/training',
      '/feedback',
      '/goals',
      '/analytics',
      '/changelog',
      '/settings',
      '/profile',
      '/certificates',
      '/documents',
      '/meetings',
      '/surveys',
      '/disc',
      '/documentation'
    ];

    const currentPath = location.pathname;
    const matchedRoute = legacyRoutes.find(route => currentPath === route);
    
    if (matchedRoute) {
      const newPath = `/app${matchedRoute}`;
      console.log(`🔄 Redirecionando ${currentPath} → ${newPath}`);
      navigate(newPath, { replace: true });
    }

    // Special redirect for founder routes
    if (currentPath === '/founder/dashboard') {
      console.log('🔄 Redirecionando /founder/dashboard → /app/founder-dashboard');
      navigate('/app/founder-dashboard', { replace: true });
    }
  }, [location.pathname, navigate]);

  return null;
};
