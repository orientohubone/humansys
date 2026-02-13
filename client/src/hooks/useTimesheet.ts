import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export interface TimesheetEntry {
  id: string;
  user_id: string;
  collaborator_id: string;
  date: Date;
  clock_in?: Date;
  clock_out?: Date;
  break_start?: Date;
  break_end?: Date;
  total_hours?: number;
  overtime_hours?: number;
  location?: string;
  ip_address?: string;
  status: 'pending' | 'approved' | 'rejected';
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateTimesheetData {
  collaborator_id: string;
  date: Date | string;
  clock_in?: Date | string;
  clock_out?: Date | string;
  break_start?: Date | string;
  break_end?: Date | string;
  total_hours?: number;
  overtime_hours?: number;
  location?: string;
  ip_address?: string;
  status?: 'pending' | 'approved' | 'rejected';
  notes?: string;
}

export const useTimesheet = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [timesheets, setTimesheets] = useState<TimesheetEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTimesheets = useCallback(async () => {
    if (!user?.id) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/timesheet?userId=${encodeURIComponent(user.id)}`);
      
      if (response.ok) {
        const data = await response.json();
        setTimesheets(data || []);
      } else {
        console.error('Failed to fetch timesheets');
        setTimesheets([]);
      }
    } catch (fetchError) {
      console.error('Error fetching timesheets:', fetchError);
      setTimesheets([]);
      setError('Failed to load timesheet data');
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  const createTimesheet = async (timesheetData: CreateTimesheetData) => {
    if (!user?.id) return false;

    try {
      const response = await fetch('/api/timesheet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...timesheetData,
          user_id: user.id
        })
      });

      if (!response.ok) throw new Error('Failed to create timesheet');

      toast({
        title: "Registro Criado",
        description: "O registro de ponto foi criado com sucesso!"
      });

      await fetchTimesheets();
      return true;
    } catch (error) {
      console.error('Error creating timesheet:', error);
      toast({
        title: "Erro",
        description: "Não foi possível criar o registro de ponto. Tente novamente.",
        variant: "destructive"
      });
      return false;
    }
  };

  const updateTimesheet = async (id: string, updates: Partial<CreateTimesheetData>) => {
    if (!user?.id) return false;

    try {
      const response = await fetch(`/api/timesheet/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });

      if (!response.ok) throw new Error('Failed to update timesheet');

      toast({
        title: "Registro Atualizado",
        description: "O registro de ponto foi atualizado com sucesso!"
      });

      await fetchTimesheets();
      return true;
    } catch (error) {
      console.error('Error updating timesheet:', error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o registro de ponto. Tente novamente.",
        variant: "destructive"
      });
      return false;
    }
  };

  const deleteTimesheet = async (id: string) => {
    if (!user?.id) return false;

    try {
      const response = await fetch(`/api/timesheet/${id}`, {
        method: 'DELETE'
      });

      if (!response.ok) throw new Error('Failed to delete timesheet');

      toast({
        title: "Registro Removido",
        description: "O registro de ponto foi removido com sucesso!"
      });

      setTimesheets(prev => prev.filter(t => t.id !== id));
      return true;
    } catch (error) {
      console.error('Error deleting timesheet:', error);
      toast({
        title: "Erro",
        description: "Não foi possível remover o registro de ponto. Tente novamente.",
        variant: "destructive"
      });
      return false;
    }
  };

  useEffect(() => {
    fetchTimesheets();
  }, [fetchTimesheets]);

  return {
    timesheets,
    loading,
    error,
    fetchTimesheets,
    createTimesheet,
    updateTimesheet,
    deleteTimesheet
  };
};
