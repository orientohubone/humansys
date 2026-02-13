import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export interface SystemVersion {
  id: string;
  tenant_id: string;
  version: string;
  title: string;
  summary: string;
  release_date: string;
  impact_tags: string[] | null;
  changes: Array<{
    type: 'added' | 'changed' | 'fixed' | 'removed' | 'security' | 'deprecated';
    description: string;
    module?: string;
  }>;
  author_id: string | null;
  created_at: string;
}

export interface CreateSystemVersionData {
  version: string;
  title: string;
  summary: string;
  release_date?: Date;
  impact_tags?: string[];
  changes: Array<{
    type: 'added' | 'changed' | 'fixed' | 'removed' | 'security' | 'deprecated';
    description: string;
    module?: string;
  }>;
}

export const useSystemVersions = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [versions, setVersions] = useState<SystemVersion[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchVersions = useCallback(async (params?: {
    limit?: number;
    category?: string;
    search?: string;
  }) => {
    if (!user?.id) return;

    setLoading(true);
    setError(null);

    try {
      const queryParams = new URLSearchParams();
      if (params?.limit) queryParams.append('limit', params.limit.toString());
      if (params?.category) queryParams.append('category', params.category);
      if (params?.search) queryParams.append('search', params.search);

      const url = `/api/founder/system-versions${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
      
      const response = await fetch(url, {
        headers: {
          'x-user-id': user.id
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setVersions(data || []);
      } else {
        console.error('Failed to fetch system versions');
        setVersions([]);
      }
    } catch (fetchError) {
      console.error('Error fetching system versions:', fetchError);
      setVersions([]);
      setError('Failed to load system versions');
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  const createVersion = async (versionData: CreateSystemVersionData) => {
    if (!user?.id) return false;

    try {
      const response = await fetch('/api/founder/system-versions', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'x-user-id': user.id
        },
        body: JSON.stringify(versionData)
      });

      if (!response.ok) throw new Error('Failed to create version');

      toast({
        title: "Versão Criada",
        description: `Versão ${versionData.version} criada com sucesso!`
      });

      await fetchVersions();
      return true;
    } catch (error) {
      console.error('Error creating version:', error);
      toast({
        title: "Erro",
        description: "Não foi possível criar a versão. Tente novamente.",
        variant: "destructive"
      });
      return false;
    }
  };

  useEffect(() => {
    if (user?.role === 'founder') {
      fetchVersions();
    }
  }, [fetchVersions, user?.role]);

  return {
    versions,
    loading,
    error,
    fetchVersions,
    createVersion
  };
};
