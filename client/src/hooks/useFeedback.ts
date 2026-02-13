import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export interface Feedback {
  id: string;
  title: string;
  description?: string;
  category: string;
  priority: 'low' | 'medium' | 'high';
  status: 'pending' | 'in_progress' | 'completed' | 'closed';
  user_id: string;
  created_at: string;
  updated_at: string;
}

export const useFeedback = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchFeedbacks = useCallback(async () => {
    if (!user?.id) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/feedbacks?userId=${encodeURIComponent(user.id)}`);
      
      if (response.ok) {
        const data = await response.json();
        setFeedbacks(data || []);
      } else {
        console.error('Failed to fetch feedbacks');
        setFeedbacks([]);
      }
    } catch (fetchError) {
      console.error('Error fetching feedbacks:', fetchError);
      setFeedbacks([]);
      setError('Failed to load feedbacks');
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  const createFeedback = async (feedbackData: Omit<Feedback, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    if (!user?.id) return false;

    try {
      const response = await fetch('/api/feedbacks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...feedbackData,
          user_id: user.id
        })
      });

      if (!response.ok) throw new Error('Failed to create feedback');

      const newFeedback = await response.json();
      setFeedbacks(prev => [...prev, newFeedback]);
      
      toast({
        title: "Feedback criado",
        description: "Seu feedback foi enviado com sucesso!"
      });

      return true;
    } catch (error) {
      console.error('Error creating feedback:', error);
      toast({
        title: "Erro",
        description: "Não foi possível enviar o feedback. Tente novamente.",
        variant: "destructive"
      });
      return false;
    }
  };

  const updateFeedback = async (id: string, updates: Partial<Feedback>) => {
    if (!user?.id) return false;

    try {
      const response = await fetch(`/api/feedbacks/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });

      if (!response.ok) throw new Error('Failed to update feedback');

      await fetchFeedbacks(); // Refresh the list
      
      toast({
        title: "Feedback atualizado",
        description: "O feedback foi atualizado com sucesso!"
      });

      return true;
    } catch (error) {
      console.error('Error updating feedback:', error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o feedback. Tente novamente.",
        variant: "destructive"
      });
      return false;
    }
  };

  const deleteFeedback = async (id: string) => {
    if (!user?.id) return false;

    try {
      const response = await fetch(`/api/feedbacks/${id}`, {
        method: 'DELETE'
      });

      if (!response.ok) throw new Error('Failed to delete feedback');

      setFeedbacks(prev => prev.filter(f => f.id !== id));
      
      toast({
        title: "Feedback removido",
        description: "O feedback foi removido com sucesso!"
      });

      return true;
    } catch (error) {
      console.error('Error deleting feedback:', error);
      toast({
        title: "Erro",
        description: "Não foi possível remover o feedback. Tente novamente.",
        variant: "destructive"
      });
      return false;
    }
  };

  useEffect(() => {
    if (user?.id) {
      fetchFeedbacks();
    }
  }, [user?.id, fetchFeedbacks]);

  return {
    feedbacks,
    loading,
    error,
    createFeedback,
    updateFeedback,
    deleteFeedback,
    fetchFeedbacks,
    refetch: fetchFeedbacks
  };
};