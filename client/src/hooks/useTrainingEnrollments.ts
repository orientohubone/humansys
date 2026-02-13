import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export interface TrainingEnrollment {
  id: string;
  training_id: string;
  collaborator_id: string;
  enrolled_at: string;
  status: 'enrolled' | 'in_progress' | 'completed' | 'dropped';
  progress: number;
  completed_at?: string;
  user_id: string;
  created_at: string;
  updated_at: string;
  collaborator?: {
    id: string;
    name: string;
    email: string;
  };
  training?: {
    id: string;
    title: string;
    description: string;
  };
}

export const useTrainingEnrollments = () => {
  const [enrollments, setEnrollments] = useState<TrainingEnrollment[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchEnrollments = useCallback(async () => {
    if (!user) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/training-enrollments');
      if (!response.ok) {
        throw new Error('Failed to fetch training enrollments');
      }
      
      const data = await response.json();
      
      // Convert the data to match our interface
      const convertedData: TrainingEnrollment[] = (data || []).map((item: any) => ({
        id: item.id,
        training_id: item.training_id,
        collaborator_id: item.collaborator_id,
        enrolled_at: item.enrolled_at,
        status: item.status,
        progress: item.progress || 0,
        completed_at: item.completed_at,
        user_id: item.user_id,
        created_at: item.created_at,
        updated_at: item.updated_at,
        collaborator: item.collaborator ? {
          id: item.collaborator.id,
          name: item.collaborator.name,
          email: item.collaborator.email
        } : undefined,
        training: item.training ? {
          id: item.training.id,
          title: item.training.title,
          description: item.training.description
        } : undefined
      }));
      
      setEnrollments(convertedData);
    } catch (error: any) {
      console.error('Error fetching training enrollments:', error);
      setError(error.message);
      setEnrollments([]);
      toast({
        title: "Erro",
        description: "Erro ao carregar matrículas de treinamento",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  }, [user, toast]);

  const createEnrollment = useCallback(async (enrollmentData: any) => {
    if (!user) return false;
    
    try {
      const response = await fetch('/api/training-enrollments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...enrollmentData,
          user_id: user.id,
          enrolled_at: new Date().toISOString(),
          status: 'enrolled',
          progress: 0
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to create training enrollment');
      }
      
      await fetchEnrollments();
      toast({
        title: "Sucesso",
        description: "Matrícula criada com sucesso"
      });
      return true;
    } catch (error: any) {
      console.error('Error creating training enrollment:', error);
      toast({
        title: "Erro",
        description: "Erro ao criar matrícula",
        variant: "destructive"
      });
      return false;
    }
  }, [user, fetchEnrollments, toast]);

  const updateEnrollment = useCallback(async (id: string, updates: any) => {
    try {
      const response = await fetch(`/api/training-enrollments/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update training enrollment');
      }
      
      await fetchEnrollments();
      toast({
        title: "Sucesso",
        description: "Matrícula atualizada com sucesso"
      });
      return true;
    } catch (error: any) {
      console.error('Error updating training enrollment:', error);
      toast({
        title: "Erro",
        description: "Erro ao atualizar matrícula",
        variant: "destructive"
      });
      return false;
    }
  }, [fetchEnrollments, toast]);

  const deleteEnrollment = useCallback(async (id: string) => {
    try {
      const response = await fetch(`/api/training-enrollments/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete training enrollment');
      }
      
      await fetchEnrollments();
      toast({
        title: "Sucesso",
        description: "Matrícula removida com sucesso"
      });
      return true;
    } catch (error: any) {
      console.error('Error deleting training enrollment:', error);
      toast({
        title: "Erro",
        description: "Erro ao remover matrícula",
        variant: "destructive"
      });
      return false;
    }
  }, [fetchEnrollments, toast]);

  useEffect(() => {
    if (user) {
      fetchEnrollments();
    }
  }, [user, fetchEnrollments]);

  return {
    enrollments,
    isLoading,
    error,
    fetchEnrollments,
    createEnrollment,
    updateEnrollment,
    deleteEnrollment,
    totalCount: enrollments.length,
    completedCount: enrollments.filter(e => e.status === 'completed').length,
    inProgressCount: enrollments.filter(e => e.status === 'in_progress').length
  };
};