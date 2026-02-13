import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export interface PayrollData {
  id: string;
  user_id: string;
  collaborator_id: string;
  period_month: number;
  period_year: number;
  base_salary: number;
  overtime_hours: number;
  overtime_rate: number;
  bonuses: number;
  commissions: number;
  gross_salary: number;
  inss_deduction: number;
  irrf_deduction: number;
  other_deductions: number;
  total_deductions: number;
  net_salary: number;
  status: 'pending' | 'approved' | 'paid';
  payment_date?: Date;
  created_at: string;
  updated_at: string;
}

export interface CreatePayrollData {
  collaborator_id: string;
  period_month: number;
  period_year: number;
  base_salary: number;
  overtime_hours?: number;
  overtime_rate?: number;
  bonuses?: number;
  commissions?: number;
  gross_salary: number;
  inss_deduction?: number;
  irrf_deduction?: number;
  other_deductions?: number;
  total_deductions?: number;
  net_salary: number;
  status?: 'pending' | 'approved' | 'paid';
  payment_date?: Date;
}

export const usePayroll = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [payrolls, setPayrolls] = useState<PayrollData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPayrolls = useCallback(async () => {
    if (!user?.id) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/payroll?userId=${encodeURIComponent(user.id)}`);
      
      if (response.ok) {
        const data = await response.json();
        setPayrolls(data || []);
      } else {
        console.error('Failed to fetch payrolls');
        setPayrolls([]);
      }
    } catch (fetchError) {
      console.error('Error fetching payrolls:', fetchError);
      setPayrolls([]);
      setError('Failed to load payroll data');
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  const createPayroll = async (payrollData: CreatePayrollData) => {
    if (!user?.id) return false;

    try {
      const response = await fetch('/api/payroll', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...payrollData,
          user_id: user.id
        })
      });

      if (!response.ok) throw new Error('Failed to create payroll');

      toast({
        title: "Folha de Pagamento Criada",
        description: "A folha de pagamento foi criada com sucesso!"
      });

      await fetchPayrolls();
      return true;
    } catch (error) {
      console.error('Error creating payroll:', error);
      toast({
        title: "Erro",
        description: "Não foi possível criar a folha de pagamento. Tente novamente.",
        variant: "destructive"
      });
      return false;
    }
  };

  const updatePayroll = async (id: string, updates: Partial<CreatePayrollData>) => {
    if (!user?.id) return false;

    try {
      const response = await fetch(`/api/payroll/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });

      if (!response.ok) throw new Error('Failed to update payroll');

      toast({
        title: "Folha Atualizada",
        description: "A folha de pagamento foi atualizada com sucesso!"
      });

      await fetchPayrolls();
      return true;
    } catch (error) {
      console.error('Error updating payroll:', error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar a folha de pagamento. Tente novamente.",
        variant: "destructive"
      });
      return false;
    }
  };

  const deletePayroll = async (id: string) => {
    if (!user?.id) return false;

    try {
      const response = await fetch(`/api/payroll/${id}`, {
        method: 'DELETE'
      });

      if (!response.ok) throw new Error('Failed to delete payroll');

      toast({
        title: "Folha Removida",
        description: "A folha de pagamento foi removida com sucesso!"
      });

      setPayrolls(prev => prev.filter(p => p.id !== id));
      return true;
    } catch (error) {
      console.error('Error deleting payroll:', error);
      toast({
        title: "Erro",
        description: "Não foi possível remover a folha de pagamento. Tente novamente.",
        variant: "destructive"
      });
      return false;
    }
  };

  useEffect(() => {
    fetchPayrolls();
  }, [fetchPayrolls]);

  return {
    payrolls,
    loading,
    error,
    fetchPayrolls,
    createPayroll,
    updatePayroll,
    deletePayroll
  };
};
