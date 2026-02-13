
import React, { useNavigate } from 'react-router-dom';
import React, { useToast } from '@/hooks/use-toast';

export const useDashboardActions = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleStatsClick = (type: string) => {
    switch (type) {
      case 'collaborators':
        navigate('/collaborators');
        break;
      case 'new-hires':
        navigate('/onboarding');
        break;
      case 'feedback':
        navigate('/feedback');
        break;
      case 'goals':
        navigate('/goals');
        break;
      default:
        break;
    }
  };

  const handleActivityView = (id: number) => {
    toast({
      title: "Visualizar Atividade",
      description: `Abrindo detalhes da atividade #${id}`
    });
    // Aqui você pode implementar a navegação específica baseada no tipo
  };

  const handleTaskView = (id: number) => {
    toast({
      title: "Visualizar Tarefa",
      description: `Abrindo detalhes da tarefa #${id}`
    });
  };

  const handleTaskComplete = (id: number) => {
    toast({
      title: "Tarefa Concluída",
      description: `Tarefa #${id} foi marcada como concluída`
    });
  };

  const handleQuickAction = (action: string) => {
    switch (action) {
      case 'new-collaborator':
        navigate('/collaborators');
        break;
      case 'feedback':
        navigate('/feedback');
        break;
      case 'training':
        navigate('/training');
        break;
      case 'reports':
        navigate('/goals');
        break;
      default:
        break;
    }
  };

  return {
    handleStatsClick,
    handleActivityView,
    handleTaskView,
    handleTaskComplete,
    handleQuickAction
  };
};
