
import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';


export const useAuthGuard = (requireAuth: boolean = true) => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isValidating, setIsValidating] = useState(true);

  useEffect(() => {
    const validateSession = async () => {
      if (loading) return;
      
      setIsValidating(true);
      
      try {
        // Se não precisa de auth, liberar acesso
        if (!requireAuth) {
          setIsValidating(false);
          return;
        }

        // Se não tem usuário, redirecionar para login
        if (!user) {
          console.log('No user found, redirecting to login');
          navigate('/login', { replace: true });
          setIsValidating(false);
          return;
        }

        // Verificar se a sessão ainda é válida

        
        if (error || !session || !session.expires_at || (session.expires_at * 1000) <= Date.now()) {
          console.log('Invalid or expired session, redirecting to login');
          
          // Limpar tudo
          localStorage.clear();
          sessionStorage.clear();
          
          navigate('/login', { replace: true });
          setIsValidating(false);
          return;
        }

        // Sessão válida
        setIsValidating(false);
        
      } catch (error) {
        console.error('Session validation error:', error);
        navigate('/login', { replace: true });
        setIsValidating(false);
      }
    };

    validateSession();
  }, [user, loading, requireAuth, navigate, location.pathname]);

  return {
    isValidating,
    isAuthenticated: !!user && !isValidating,
    user
  };
};
