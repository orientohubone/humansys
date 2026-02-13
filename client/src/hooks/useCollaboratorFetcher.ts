
import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import React, { useAuth } from '@/contexts/AuthContext';
import React, { useSessionHealthCheck } from './useSessionHealthCheck';

import type { Collaborator } from '@/types/collaborators';

export const useCollaboratorFetcher = () => {
  const { user } = useAuth();
  const { sessionHealth } = useSessionHealthCheck();

  const fetchCollaborators = useCallback(async (): Promise<Collaborator[]> => {
    if (!user?.id) throw new Error('Usuário não autenticado');

    const maxRetries = sessionHealth.networkStatus === 'slow' ? 2 : 3;
    let lastError;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        const timeout = sessionHealth.networkStatus === 'slow' ? 10000 : 5000;
        
        const { data, error } = await Promise.race([

          new Promise<never>((_, reject) => 
            setTimeout(() => reject(new Error('Timeout')), timeout)
          )
        ]);

        if (error) throw error;
        
        const typedData: Collaborator[] = (data || []).map(item => ({
          ...item,
          status: item.status as 'active' | 'inactive' | 'vacation',
          skills: [],
          hireDate: item.join_date
        }));
        
        return typedData;

      } catch (error: any) {
        lastError = error;
        console.warn(`Attempt ${attempt} failed:`, error.message);
        
        if (attempt < maxRetries) {
          const delay = Math.min(1000 * Math.pow(2, attempt - 1), 5000);
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      }
    }

    throw lastError;
  }, [user?.id, sessionHealth.networkStatus]);

  return { fetchCollaborators };
};
