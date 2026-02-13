
import React, { useToast } from '@/hooks/use-toast';
import React, { useNavigate } from 'react-router-dom';

export const useTrainingActions = () => {
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleStartCourse = (courseId: string, courseName: string) => {
    toast({
      title: "Iniciando Curso",
      description: `Você será redirecionado para: ${courseName}`
    });
  };

  const handleViewCourse = (courseId: string) => {
    toast({
      title: "Visualizar Curso",
      description: "Abrindo detalhes do curso"
    });
  };

  const handleCreateCourse = () => {
    toast({
      title: "Criar Novo Curso",
      description: "Formulário de criação será aberto"
    });
  };

  const handleStatsClick = (type: string) => {
    toast({
      title: "Estatísticas",
      description: `Visualizando dados de: ${type}`
    });
  };

  return {
    handleStartCourse,
    handleViewCourse,
    handleCreateCourse,
    handleStatsClick
  };
};
