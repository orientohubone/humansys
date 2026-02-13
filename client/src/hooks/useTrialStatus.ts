
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface TrialStatus {
  isActive: boolean;
  daysRemaining: number;
  isExpired: boolean;
  isNearExpiration: boolean;
  trialEndsAt: Date | null;
}

export const useTrialStatus = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [trialStatus, setTrialStatus] = useState<TrialStatus>({
    isActive: false,
    daysRemaining: 0,
    isExpired: false,
    isNearExpiration: false,
    trialEndsAt: null
  });

  const checkTrialStatus = () => {
    if (!user) return;

    // Se for founder, não verificar trial
    if (user.email === 'fernandoluizsouzaramalho@gmail.com') {
      return;
    }

    // Para novos usuários, simular um trial que acabou de começar
    const now = new Date();
    const trialStarted = user.created_at ? new Date(user.created_at) : now;
    const trialEnd = new Date(trialStarted.getTime() + (30 * 24 * 60 * 60 * 1000)); // 30 dias
    
    const timeDiff = trialEnd.getTime() - now.getTime();
    const daysRemaining = Math.ceil(timeDiff / (1000 * 3600 * 24));
    const daysSinceStart = Math.ceil((now.getTime() - trialStarted.getTime()) / (1000 * 3600 * 24));

    const isActive = true; // Assumir que o trial está sempre ativo para novos usuários
    const isExpired = daysRemaining <= 0 && daysSinceStart > 30; // Só considerar expirado após 30 dias
    const isNearExpiration = daysRemaining <= 3 && daysRemaining > 0;
    const isNewUser = daysSinceStart <= 1; // Usuário criado hoje ou ontem

    setTrialStatus({
      isActive,
      daysRemaining: Math.max(0, daysRemaining < 0 ? 30 + daysRemaining : daysRemaining),
      isExpired,
      isNearExpiration,
      trialEndsAt: trialEnd
    });

    // Mostrar mensagem de boas-vindas para novos usuários
    if (isNewUser) {
      toast({
        title: "🎉 Parabéns! Seu teste grátis começou",
        description: `Você tem 30 dias para explorar todos os recursos da plataforma HumanSys.`,
        variant: "default",
      });
    } else if (isExpired) {
      toast({
        title: "⚠️ Teste grátis expirado",
        description: "Seu período de teste grátis terminou. Contrate um plano para continuar usando a plataforma.",
        variant: "destructive",
      });
    } else if (isNearExpiration) {
      toast({
        title: "⏰ Teste grátis expirando",
        description: `Seu teste grátis expira em ${daysRemaining} dia(s). Contrate um plano para não perder o acesso.`,
      });
    }
  };

  useEffect(() => {
    checkTrialStatus();
    
    // Verificar a cada hora
    const interval = setInterval(checkTrialStatus, 60 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, [user]);

  return {
    ...trialStatus,
    checkTrialStatus
  };
};
