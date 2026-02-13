
import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';



export const useSupabaseAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // Detectar se é mobile
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

  useEffect(() => {
    let mounted = true;
    let sessionCheckInterval: NodeJS.Timeout;

    // Verificar sessão atual
    const getSession = async () => {
      try {

        if (error) {
          console.error('Error getting session:', error);
        }
        
        if (mounted) {
          // Verificar se a sessão não expirou
          const isValidSession = session && session.expires_at && (session.expires_at * 1000) > Date.now();
          setUser(isValidSession ? session.user : null);
          setIsLoading(false);
        }
      } catch (error) {
        console.error('Error in getSession:', error);
        if (mounted) {
          setUser(null);
          setIsLoading(false);
        }
      }
    };

    getSession();

    // Escutar mudanças de autenticação
    const {
      data: { subscription },

      console.log('Auth state changed:', event, session?.user?.id);
      
      if (mounted) {
        // Para logout, limpar tudo imediatamente
        if (event === 'SIGNED_OUT' || !session) {
          setUser(null);
          setIsLoading(false);
          setIsLoggingOut(false);
          
          // Limpar storage local
          localStorage.clear();
          sessionStorage.clear();
          
          return;
        }

        // Verificar se a sessão é válida
        const isValidSession = session && session.expires_at && (session.expires_at * 1000) > Date.now();
        setUser(isValidSession ? session.user : null);
        setIsLoading(false);
      }
    });

    // Verificação periódica de sessão para mobile (mais frequente)
    if (isMobile) {
      sessionCheckInterval = setInterval(async () => {
        if (!mounted) return;
        
        try {

          const isValidSession = session && session.expires_at && (session.expires_at * 1000) > Date.now();
          
          if (!isValidSession && user) {
            console.log('Session expired, logging out...');
            setUser(null);
            localStorage.clear();
            sessionStorage.clear();
          }
        } catch (error) {
          console.error('Session check failed:', error);
        }
      }, 30000); // Check every 30 seconds on mobile
    }

    return () => {
      mounted = false;
      subscription.unsubscribe();
      if (sessionCheckInterval) {
        clearInterval(sessionCheckInterval);
      }
    };
  }, [isMobile, user]);

  const signUp = async (email: string, password: string, name: string) => {
    try {

        email,
        password,
        options: {
          data: {
            name: name,
            full_name: name,
          },
        },
      });
      return { data, error };
    } catch (error: any) {
      return { data: null, error };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      setIsLoading(true);

        email,
        password,
      });
      return { data, error };
    } catch (error: any) {
      return { data: null, error };
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    try {
      console.log('Starting logout process...');
      setIsLoggingOut(true);
      setIsLoading(true);
      
      // Limpar tudo ANTES do logout
      localStorage.clear();
      sessionStorage.clear();
      
      // Limpar estado imediatamente
      setUser(null);
      

      
      // Timeout adicional para mobile
      if (isMobile) {
        await new Promise(resolve => setTimeout(resolve, 500));
      }
      
      return { error };
    } catch (error: any) {
      console.error('Logout error:', error);
      // Mesmo com erro, considerar logout bem-sucedido
      setUser(null);
      localStorage.clear();
      sessionStorage.clear();
      return { error: null };
    } finally {
      setIsLoggingOut(false);
      setIsLoading(false);
    }
  };

  return {
    user,
    isLoading: isLoading || isLoggingOut,
    isLoggingOut,
    signUp,
    signIn,
    signOut,
  };
};
