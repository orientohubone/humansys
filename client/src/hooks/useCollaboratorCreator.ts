
import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import React, { useAuth } from '@/contexts/AuthContext';
import React, { useToast } from '@/hooks/use-toast';

import type { Collaborator, CreateCollaboratorData } from '@/types/collaborators';

export const useCollaboratorCreator = () => {
  const { user } = useAuth();
  const { toast } = useToast();

  const createCollaborator = useCallback(async (collaboratorData: CreateCollaboratorData): Promise<Collaborator | null> => {
    if (!user?.id) {
      toast({
        title: "Erro de Autenticação",
        description: "Você precisa estar logado para criar um colaborador.",
        variant: "destructive"
      });
      return null;
    }

    try {
      const dataToInsert = {
        ...collaboratorData,
        user_id: user.id,
        status: collaboratorData.status || 'active' as const,
      };


      const response = await fetch('/api/collaborators', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToInsert)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create collaborator');
      }

      const result = await response.json();

      const newCollaborator: Collaborator = {
        ...result,
        status: result.status as 'active' | 'inactive' | 'vacation',
        skills: [],
        hireDate: result.join_date
      };

      toast({
        title: "Sucesso",
        description: "Colaborador criado com sucesso."
      });

      return newCollaborator;
    } catch (error: any) {
      const errorMsg = error.message || 'Falha ao criar colaborador';
      toast({
        title: "Erro",
        description: errorMsg,
        variant: "destructive"
      });
      return null;
    }
  }, [user?.id, toast]);

  return { createCollaborator };
};
