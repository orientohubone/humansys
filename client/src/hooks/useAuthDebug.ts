
import { useState, useEffect, useCallback, useMemo, useRef } from 'react';

import { useAuth } from '@/contexts/AuthContext';

export interface AuthDebugInfo {
  frontendUser: any;

  session: any;
  isConnected: boolean;
  lastChecked: string;
  errors: string[];
}

export const useAuthDebug = () => {
  const [debugInfo, setDebugInfo] = useState<AuthDebugInfo>({
    frontendUser: null,

    session: null,
    isConnected: false,
    lastChecked: '',
    errors: []
  });

  const { user } = useAuth();

  const checkAuth = async () => {
    const errors: string[] = [];

    let session = null;
    let isConnected = false;

    try {
      // Verificar sessão do Supabase

      
      if (sessionError) {
        errors.push(`Session Error: ${sessionError.message}`);
      } else {
        session = currentSession;

        isConnected = !!currentSession;
      }

      // Testar conectividade básica

      if (testError) {
        errors.push(`Connectivity Error: ${testError.message}`);
        isConnected = false;
      }

    } catch (error: any) {
      errors.push(`General Error: ${error.message}`);
      isConnected = false;
    }

    setDebugInfo({
      frontendUser: user,

      session,
      isConnected,
      lastChecked: new Date().toISOString(),
      errors
    });
  };

  useEffect(() => {
    checkAuth();
  }, [user]);

  return {
    debugInfo,
    refreshDebug: checkAuth
  };
};
