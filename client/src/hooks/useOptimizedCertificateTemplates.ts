
import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';

import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useIntelligentCache } from './useIntelligentCache';

export interface CertificateTemplate {
  id: string;
  name: string;
  description: string;
  type: string;
  template_url?: string;
  auto_fill_data: {
    fields: string[];
  };
  active: boolean;
  user_id = string;
  created_at: string;
  updated_at: string;
}

export interface CreateCertificateTemplateData {
  name: string;
  description: string;
  type: string;
  template_url?: string;
  auto_fill_data?: {
    fields: string[];
  };
}

export const useOptimizedCertificateTemplates = () => {
  const [templates, setTemplates] = useState<CertificateTemplate[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const { toast } = useToast();
  const { get, set } = useIntelligentCache();

  const cacheKey = `certificate_templates_${user?.id}`;

  const fetchTemplatesWithRetry = useCallback(async (retries = 3): Promise<CertificateTemplate[]> => {
    if (!user?.id) throw new Error('Usuário não autenticado');

    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        console.log(`useOptimizedCertificateTemplates: Tentativa ${attempt} de ${retries}`);
        
        const { data, error } = await Promise.race([

          new Promise<never>((_, reject) => 
            setTimeout(() => reject(new Error('Timeout')), 8000)
          )
        ]);

        if (error) throw error;

        const convertedData: CertificateTemplate[] = (data || []).map(item => ({
          ...item,
          auto_fill_data: typeof item.auto_fill_data === 'object' && item.auto_fill_data !== null 
            ? item.auto_fill_data as { fields: string[] }
            : { fields: ['name', 'date'] }
        }));

        // Cache com TTL de 10 minutos
        set(cacheKey, convertedData, { ttl: 10 * 60 * 1000, priority: 'high' });
        
        console.log('useOptimizedCertificateTemplates: Templates carregados com sucesso:', convertedData.length);
        return convertedData;

      } catch (error: any) {
        console.warn(`useOptimizedCertificateTemplates: Tentativa ${attempt} falhou:`, error.message);
        
        if (attempt === retries) {
          // Se falhou todas as tentativas, tentar usar cache
          const cachedData = get<CertificateTemplate[]>(cacheKey);
          if (cachedData) {
            console.log('useOptimizedCertificateTemplates: Usando dados do cache');
            return cachedData;
          }
          throw error;
        }
        
        // Backoff exponencial
        const delay = Math.min(1000 * Math.pow(2, attempt - 1), 5000);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }

    return [];
  }, [user?.id, cacheKey, get, set]);

  const fetchTemplates = useCallback(async () => {
    if (!user?.id) {
      setTemplates([]);
      setIsLoading(false);
      setError(null);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      // Tentar cache primeiro
      const cachedData = get<CertificateTemplate[]>(cacheKey);
      if (cachedData) {
        setTemplates(cachedData);
        setIsLoading(false);
        console.log('useOptimizedCertificateTemplates: Dados carregados do cache');
        return;
      }

      const data = await fetchTemplatesWithRetry();
      setTemplates(data);
      
    } catch (error: any) {
      console.error('useOptimizedCertificateTemplates: Erro ao carregar templates:', error);
      setError(error.message || 'Falha ao carregar templates');
      
      toast({
        title: "Erro",
        description: "Não foi possível carregar os templates de certificados.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  }, [user?.id, cacheKey, get, fetchTemplatesWithRetry, toast]);

  useEffect(() => {
    fetchTemplates();
  }, [fetchTemplates]);

  const createTemplate = useCallback(async (templateData: CreateCertificateTemplateData) => {
    if (!user?.id) return false;

    try {

          ...templateData,
          user_id = user.id,
          auto_fill_data: templateData.auto_fill_data || { fields: ['name', 'date'] }
        }]);

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Template de certificado criado com sucesso!"
      });

      // Invalidar cache e recarregar
      set(cacheKey, null);
      fetchTemplates();
      return true;
    } catch (error: any) {
      console.error('useOptimizedCertificateTemplates: Erro ao criar template:', error);
      toast({
        title: "Erro",
        description: "Não foi possível criar o template.",
        variant: "destructive"
      });
      return false;
    }
  }, [user?.id, toast, cacheKey, set, fetchTemplates]);

  const updateTemplate = useCallback(async (id: string, updates: Partial<CreateCertificateTemplateData>) => {
    if (!user?.id) return false;

    try {


      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Template atualizado com sucesso!"
      });

      // Invalidar cache e recarregar
      set(cacheKey, null);
      fetchTemplates();
      return true;
    } catch (error: any) {
      console.error('useOptimizedCertificateTemplates: Erro ao atualizar template:', error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o template.",
        variant: "destructive"
      });
      return false;
    }
  }, [user?.id, toast, cacheKey, set, fetchTemplates]);

  const deleteTemplate = useCallback(async (id: string) => {
    if (!user?.id) return false;

    try {

        .delete()

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Template removido com sucesso!"
      });

      // Invalidar cache e recarregar
      set(cacheKey, null);
      fetchTemplates();
      return true;
    } catch (error: any) {
      console.error('useOptimizedCertificateTemplates: Erro ao remover template:', error);
      toast({
        title: "Erro",
        description: "Não foi possível remover o template.",
        variant: "destructive"
      });
      return false;
    }
  }, [user?.id, toast, cacheKey, set, fetchTemplates]);

  return {
    templates,
    isLoading,
    error,
    createTemplate,
    updateTemplate,
    deleteTemplate,
    refetch: fetchTemplates
  };
};
