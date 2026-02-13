import { useState, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export interface JobApplication {
  id: string;
  vacancy_id: string;
  candidate_name: string;
  candidate_email: string;
  candidate_phone?: string;
  linkedin_url?: string;
  portfolio_url?: string;
  resume_url?: string;
  cover_letter?: string;
  experience_years?: number;
  current_salary?: number;
  expected_salary?: number;
  availability?: string;
  status: 'applied' | 'reviewing' | 'interview' | 'approved' | 'rejected';
  applied_at: string;
  reviewed_at?: string;
  notes?: string;
}

export interface CreateJobApplicationData {
  vacancy_id: string;
  candidate_name: string;
  candidate_email: string;
  candidate_phone?: string;
  linkedin_url?: string;
  portfolio_url?: string;
  resume_url?: string;
  cover_letter?: string;
  experience_years?: number;
  current_salary?: number;
  expected_salary?: number;
  availability?: string;
  status?: 'applied' | 'reviewing' | 'interview' | 'approved' | 'rejected';
  notes?: string;
}

export const useJobApplications = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchApplicationsByVacancy = useCallback(async (vacancyId: string) => {
    if (!user?.id || !vacancyId) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/job-applications/vacancy/${encodeURIComponent(vacancyId)}`);
      
      if (response.ok) {
        const data = await response.json();
        setApplications(data || []);
      } else {
        console.error('Failed to fetch job applications');
        setApplications([]);
      }
    } catch (fetchError) {
      console.error('Error fetching job applications:', fetchError);
      setApplications([]);
      setError('Falha ao carregar candidaturas');
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  const fetchAllApplications = useCallback(async () => {
    if (!user?.id) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/job-applications?userId=${encodeURIComponent(user.id)}`);
      
      if (response.ok) {
        const data = await response.json();
        setApplications(data || []);
      } else {
        console.error('Failed to fetch all job applications');
        setApplications([]);
      }
    } catch (fetchError) {
      console.error('Error fetching all job applications:', fetchError);
      setApplications([]);
      setError('Falha ao carregar candidaturas');
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  const createApplication = async (applicationData: CreateJobApplicationData) => {
    if (!user?.id) return false;

    try {
      const response = await fetch('/api/job-applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(applicationData)
      });

      if (!response.ok) throw new Error('Failed to create job application');

      toast({
        title: "✅ Candidatura Registrada",
        description: "A candidatura foi registrada com sucesso!",
        duration: 4000
      });

      if (applicationData.vacancy_id) {
        await fetchApplicationsByVacancy(applicationData.vacancy_id);
      }
      return true;
    } catch (error) {
      console.error('Error creating job application:', error);
      toast({
        title: "❌ Erro",
        description: "Não foi possível registrar a candidatura. Tente novamente.",
        variant: "destructive"
      });
      return false;
    }
  };

  const updateApplication = async (id: string, updates: Partial<CreateJobApplicationData>) => {
    if (!user?.id) return false;

    try {
      const response = await fetch(`/api/job-applications/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });

      if (!response.ok) throw new Error('Failed to update job application');

      toast({
        title: "✅ Candidatura Atualizada",
        description: "A candidatura foi atualizada com sucesso!",
        duration: 4000
      });

      setApplications(prev => prev.map(app => 
        app.id === id ? { ...app, ...updates } : app
      ));
      return true;
    } catch (error) {
      console.error('Error updating job application:', error);
      toast({
        title: "❌ Erro",
        description: "Não foi possível atualizar a candidatura. Tente novamente.",
        variant: "destructive"
      });
      return false;
    }
  };

  const deleteApplication = async (id: string) => {
    if (!user?.id) return false;

    try {
      const response = await fetch(`/api/job-applications/${id}`, {
        method: 'DELETE'
      });

      if (!response.ok) throw new Error('Failed to delete job application');

      toast({
        title: "✅ Candidatura Removida",
        description: "A candidatura foi removida com sucesso!",
        duration: 4000
      });

      setApplications(prev => prev.filter(app => app.id !== id));
      return true;
    } catch (error) {
      console.error('Error deleting job application:', error);
      toast({
        title: "❌ Erro",
        description: "Não foi possível remover a candidatura. Tente novamente.",
        variant: "destructive"
      });
      return false;
    }
  };

  return {
    applications,
    loading,
    error,
    fetchApplicationsByVacancy,
    fetchAllApplications,
    createApplication,
    updateApplication,
    deleteApplication
  };
};
