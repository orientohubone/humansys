import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Collaborator } from '@shared/schema';

interface CollaboratorFilters {
  search?: string;
  department?: string;
  role?: string;
  status?: string;
}

export const useCollaborators = () => {
  const [collaborators, setCollaborators] = useState<Collaborator[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<CollaboratorFilters>({});
  const { user } = useAuth();
  const { toast } = useToast();

  // Função para obter dados vazios para usuários isolados
  const getEmptyCollaborators = useCallback(() => {
    console.log('📚 useCollaborators: Retornando lista vazia para usuário isolado');
    return [];
  }, []);

  const fetchCollaborators = useCallback(async () => {
    if (!user?.id) {
      console.log('📝 useCollaborators - User not authenticated, returning empty array');
      setCollaborators([]);
      setIsLoading(false);
      setError(null);
      return;
    }
    
    console.log('🚀 useCollaborators: INICIANDO busca para userId:', user.id);
    console.log('🌍 useCollaborators: URL base:', window.location.origin);
    setIsLoading(true);
    setError(null);
    
    try {
      console.log('🔄 useCollaborators: Fazendo requisição para API...');
      const response = await fetch(`/api/collaborators?userId=${user.id}`);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ API Error:', response.status, errorText);
        throw new Error(`Failed to fetch collaborators: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('✅ useCollaborators: Dados recebidos da API:', data.length, 'items');
      
      // Usar dados reais da API sempre - sem fallback para mock
      setCollaborators(data || []);
      setError(null);
      
      console.log('🎉 useCollaborators: Colaboradores carregados e exibidos com sucesso!');
    } catch (error: any) {
      console.error('❌ useCollaborators: Erro durante a busca:', error);
      
      // Em caso de erro, mostrar lista vazia - sem dados mock
      console.log('🔄 useCollaborators: Erro na API - retornando lista vazia');
      setCollaborators([]);
      setError(error.message || 'Erro ao carregar colaboradores');
      
      console.log('📚 useCollaborators: Lista vazia aplicada devido ao erro');
    } finally {
      setIsLoading(false);
      console.log('🏁 useCollaborators: Processo finalizado');
    }
  }, [user]);

  const createCollaborator = useCallback(async (collaboratorData: any) => {
    if (!user) {
      console.log('🚫 useCollaborators: createCollaborator - usuário não autenticado');
      return false;
    }
    
    console.log('✨ useCollaborators: Criando novo colaborador:', collaboratorData.name);
    
    try {
      const response = await fetch('/api/collaborators', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...collaboratorData,
          userId: user.id
        }),
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ API Error ao criar colaborador:', response.status, errorText);
        throw new Error(`Failed to create collaborator: ${response.status}`);
      }
      
      console.log('✅ Colaborador criado com sucesso, atualizando lista...');
      await fetchCollaborators();
      
      toast({
        title: "Sucesso",
        description: "Colaborador criado com sucesso"
      });
      return true;
    } catch (error: any) {
      console.error('❌ useCollaborators: Erro ao criar colaborador:', error);
      toast({
        title: "Erro ao criar colaborador",
        description: error.message || "Falha ao criar colaborador. Tente novamente.",
        variant: "destructive"
      });
      return false;
    }
  }, [user, fetchCollaborators, toast]);

  const updateCollaborator = useCallback(async (id: string, updates: any) => {
    console.log('🔄 useCollaborators: Atualizando colaborador:', id);
    
    try {
      const response = await fetch(`/api/collaborators/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ API Error ao atualizar colaborador:', response.status, errorText);
        throw new Error(`Failed to update collaborator: ${response.status}`);
      }
      
      console.log('✅ Colaborador atualizado com sucesso, atualizando lista...');
      await fetchCollaborators();
      
      toast({
        title: "Sucesso",
        description: "Colaborador atualizado com sucesso"
      });
      return true;
    } catch (error: any) {
      console.error('❌ useCollaborators: Erro ao atualizar colaborador:', error);
      toast({
        title: "Erro",
        description: "Sistema funcionando em modo offline. Alguns recursos podem estar limitados.",
        variant: "destructive"
      });
      return false;
    }
  }, [fetchCollaborators, toast]);

  const deleteCollaborator = useCallback(async (id: string) => {
    console.log('🗑️ useCollaborators: Removendo colaborador:', id);
    
    try {
      const response = await fetch(`/api/collaborators/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ API Error ao remover colaborador:', response.status, errorText);
        throw new Error(`Failed to delete collaborator: ${response.status}`);
      }
      
      console.log('✅ Colaborador removido com sucesso, atualizando lista...');
      await fetchCollaborators();
      
      toast({
        title: "Sucesso",
        description: "Colaborador removido com sucesso"
      });
      return true;
    } catch (error: any) {
      console.error('❌ useCollaborators: Erro ao remover colaborador:', error);
      toast({
        title: "Erro",
        description: "Sistema funcionando em modo offline. Alguns recursos podem estar limitados.",
        variant: "destructive"
      });
      return false;
    }
  }, [fetchCollaborators, toast]);

  useEffect(() => {
    if (user) {
      fetchCollaborators();
    }
  }, [user, fetchCollaborators]);

  const filteredCollaborators = collaborators.filter(collaborator => {
    if (filters.search && !collaborator.name.toLowerCase().includes(filters.search.toLowerCase())) {
      return false;
    }
    if (filters.department && collaborator.department !== filters.department) {
      return false;
    }
    if (filters.role && collaborator.role !== filters.role) {
      return false;
    }
    if (filters.status && collaborator.status !== filters.status) {
      return false;
    }
    return true;
  });

  return {
    collaborators: filteredCollaborators,
    isLoading,
    error,
    filters,
    setFilters,
    fetchCollaborators,
    createCollaborator,
    updateCollaborator,
    deleteCollaborator,
    totalCount: collaborators.length,
    filteredCount: filteredCollaborators.length
  };
};