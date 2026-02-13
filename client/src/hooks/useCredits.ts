import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { UserCredits } from '@/shared/schema';

const PLAN_CREDITS = {
  inicial: 10,
  crescimento: 50,
  profissional: 200,
  trial: 999999
};

export const useCredits = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [credits, setCredits] = useState<UserCredits | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [transactions, setTransactions] = useState<any[]>([]);

  const fetchCredits = useCallback(async () => {
    if (!user?.id) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/credits/${user.id}`);
      
      if (response.ok) {
        const data = await response.json();
        setCredits(data);
      } else {
        // If no credits found, create default trial credits
        const defaultCredits: UserCredits = {
          id: 'default',
          user_id: user.id,
          plan_type: 'trial',
          total_credits: 999999,
          used_credits: 0,
          remaining_credits: 999999,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        
        // Try to create in database, fall back to localStorage
        try {
          const createResponse = await fetch(`/api/credits/${user.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ total_credits: 999999 })
          });
          
          if (createResponse.ok) {
            const createdCredits = await createResponse.json();
            setCredits(createdCredits);
          } else {
            localStorage.setItem(`user_credits_${user.id}`, JSON.stringify(defaultCredits));
            setCredits(defaultCredits);
          }
        } catch (createError) {
          localStorage.setItem(`user_credits_${user.id}`, JSON.stringify(defaultCredits));
          setCredits(defaultCredits);
        }
      }
    } catch (fetchError) {
      // Fallback to localStorage
      const cached = localStorage.getItem(`user_credits_${user.id}`);
      if (cached) {
        setCredits(JSON.parse(cached));
      } else {
        const defaultCredits: UserCredits = {
          id: 'error-fallback',
          user_id: user.id,
          plan_type: 'trial',
          total_credits: 999999,
          used_credits: 0,
          remaining_credits: 999999,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        localStorage.setItem(`user_credits_${user.id}`, JSON.stringify(defaultCredits));
        setCredits(defaultCredits);
      }
    } finally {
      setIsLoading(false);
    }
  }, [user?.id]);

  const addTransaction = async (amount: number, type: 'purchase' | 'usage', description: string) => {
    if (!user?.id) return;

    // Store transaction locally since we don't have a transactions table
    const transaction = {
      id: `transaction_${Date.now()}_${Math.random()}`,
      user_id: user.id,
      amount,
      type,
      description,
      created_at: new Date().toISOString()
    };

    const existingTransactions = JSON.parse(localStorage.getItem(`transactions_${user.id}`) || '[]');
    existingTransactions.push(transaction);
    localStorage.setItem(`transactions_${user.id}`, JSON.stringify(existingTransactions));
    
    setTransactions(existingTransactions);
    localStorage.setItem(`credits_timestamp_${user.id}`, Date.now().toString());
  };

  const updateCredits = async (planType: 'inicial' | 'crescimento' | 'profissional') => {
    if (!user?.id) return false;

    try {
      const newTotalCredits = PLAN_CREDITS[planType];

      // Update in localStorage
      const updatedCredits = {
        id: user.id,
        user_id: user.id,
        plan_type: planType,
        total_credits: newTotalCredits,
        remaining_credits: newTotalCredits,
        used_credits: 0,
        created_at: credits?.created_at || new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      localStorage.setItem(`user_credits_${user.id}`, JSON.stringify(updatedCredits));
      setCredits(updatedCredits);

      await fetchCredits();

      toast({
        title: "Plano atualizado com sucesso!",
        description: `Você agora tem ${newTotalCredits} créditos disponíveis.`
      });

      return true;
    } catch (error) {
      console.error('Erro ao atualizar plano:', error);
      toast({
        title: "Erro ao atualizar plano",
        description: "Não foi possível atualizar o plano. Tente novamente.",
        variant: "destructive"
      });
      return false;
    }
  };

  const useCredits = async (amount: number, description: string = 'Uso de créditos') => {
    if (!user || !credits) return false;

    if (credits.remaining_credits < amount) {
      toast({
        title: "Créditos insuficientes",
        description: "Você não possui créditos suficientes para esta operação.",
        variant: "destructive"
      });
      return false;
    }

    try {
      const newUsedCredits = credits.used_credits + amount;
      const newRemainingCredits = credits.remaining_credits - amount;

      const updatedCredits = {
        ...credits,
        used_credits: newUsedCredits,
        remaining_credits: newRemainingCredits,
        updated_at: new Date().toISOString()
      };

      localStorage.setItem(`user_credits_${user.id}`, JSON.stringify(updatedCredits));
      setCredits(updatedCredits);

      await addTransaction(amount, 'usage', description);
      await fetchCredits();

      toast({
        title: "Créditos utilizados",
        description: `${amount} crédito(s) foram utilizados. Restam ${newRemainingCredits}.`
      });

      return true;
    } catch (error) {
      console.error('Erro ao usar créditos:', error);
      toast({
        title: "Erro ao usar créditos",
        description: "Não foi possível processar a operação. Tente novamente.",
        variant: "destructive"
      });
      return false;
    }
  };

  const useCredit = async (description: string = 'Cadastro de colaborador') => {
    if (!user?.id || !credits) return false;

    if (credits.remaining_credits <= 0 && credits.plan_type !== 'trial') {
      toast({
        title: "Créditos esgotados",
        description: "Você não tem mais créditos disponíveis para cadastrar colaboradores",
        variant: "destructive",
      });
      return false;
    }

    try {
      const newRemainingCredits = credits.remaining_credits - 1;
      const newUsedCredits = credits.used_credits + 1;

      const updatedCredits = {
        ...credits,
        remaining_credits: newRemainingCredits,
        used_credits: newUsedCredits,
        updated_at: new Date().toISOString()
      };

      localStorage.setItem(`user_credits_${user.id}`, JSON.stringify(updatedCredits));
      setCredits(updatedCredits);

      await fetchCredits();
      return true;
    } catch (error) {
      console.error('Error using credit:', error);
      toast({
        title: "Erro ao usar crédito",
        description: "Não foi possível processar o uso do crédito",
        variant: "destructive",
      });
      return false;
    }
  };

  const refreshCredits = async () => {
    if (!user) return;
    await fetchCredits();
  };

  useEffect(() => {
    if (user) {
      fetchCredits();
    }
  }, [user, fetchCredits]);

  return {
    credits,
    transactions,
    isLoading,
    error,
    updateCredits,
    useCredits,
    useCredit,
    refreshCredits,
    addTransaction,
    refetchCredits: fetchCredits
  };
};