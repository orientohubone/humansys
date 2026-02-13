import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export interface JobVacancy {
  id: string;
  user_id: string;
  title: string;
  department?: string;
  location?: string;
  type: 'full-time' | 'part-time' | 'contract';
  level?: string;
  description: string;
  requirements?: string[];
  salary_range?: string;
  benefits?: string[];
  status: 'active' | 'paused' | 'closed';
  company_logo?: string;
  application_deadline?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateJobVacancyData {
  title: string;
  department?: string;
  location?: string;
  type: 'full-time' | 'part-time' | 'contract';
  level?: string;
  description: string;
  requirements?: string[];
  salary_range?: string;
  benefits?: string[];
  status?: 'active' | 'paused' | 'closed';
  company_logo?: string;
  application_deadline?: string;
}

export const useJobVacancies = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [vacancies, setVacancies] = useState<JobVacancy[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchVacancies = useCallback(async () => {
    if (!user?.id) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/job-vacancies/user/${encodeURIComponent(user.id)}`);
      
      if (response.ok) {
        const data = await response.json();
        setVacancies(data || []);
      } else {
        console.error('Failed to fetch job vacancies');
        setVacancies([]);
      }
    } catch (fetchError) {
      console.error('Error fetching job vacancies:', fetchError);
      setVacancies([]);
      setError('Falha ao carregar vagas');
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  const createVacancy = async (vacancyData: CreateJobVacancyData) => {
    if (!user?.id) return false;

    try {
      const response = await fetch('/api/job-vacancies', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...vacancyData,
          user_id: user.id
        })
      });

      if (!response.ok) throw new Error('Failed to create job vacancy');

      toast({
        title: "✅ Vaga Criada",
        description: "A vaga foi criada com sucesso!",
        duration: 4000
      });

      await fetchVacancies();
      return true;
    } catch (error) {
      console.error('Error creating job vacancy:', error);
      toast({
        title: "❌ Erro",
        description: "Não foi possível criar a vaga. Tente novamente.",
        variant: "destructive"
      });
      return false;
    }
  };

  const updateVacancy = async (id: string, updates: Partial<CreateJobVacancyData>) => {
    if (!user?.id) return false;

    try {
      const response = await fetch(`/api/job-vacancies/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });

      if (!response.ok) throw new Error('Failed to update job vacancy');

      toast({
        title: "✅ Vaga Atualizada",
        description: "A vaga foi atualizada com sucesso!",
        duration: 4000
      });

      await fetchVacancies();
      return true;
    } catch (error) {
      console.error('Error updating job vacancy:', error);
      toast({
        title: "❌ Erro",
        description: "Não foi possível atualizar a vaga. Tente novamente.",
        variant: "destructive"
      });
      return false;
    }
  };

  const deleteVacancy = async (id: string) => {
    if (!user?.id) return false;

    try {
      const response = await fetch(`/api/job-vacancies/${id}`, {
        method: 'DELETE'
      });

      if (!response.ok) throw new Error('Failed to delete job vacancy');

      toast({
        title: "✅ Vaga Removida",
        description: "A vaga foi removida com sucesso!",
        duration: 4000
      });

      setVacancies(prev => prev.filter(v => v.id !== id));
      return true;
    } catch (error) {
      console.error('Error deleting job vacancy:', error);
      toast({
        title: "❌ Erro",
        description: "Não foi possível remover a vaga. Tente novamente.",
        variant: "destructive"
      });
      return false;
    }
  };

  useEffect(() => {
    fetchVacancies();
  }, [fetchVacancies]);

  return {
    vacancies,
    loading,
    error,
    fetchVacancies,
    createVacancy,
    updateVacancy,
    deleteVacancy
  };
};
