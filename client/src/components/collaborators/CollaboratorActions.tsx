
import React from 'react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { MoreHorizontal, Eye, Edit, MessageSquare, UserCheck, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

interface CollaboratorActionsProps {
  collaboratorId: string;
  collaboratorName: string;
}

export const CollaboratorActions: React.FC<CollaboratorActionsProps> = ({
  collaboratorId,
  collaboratorName
}) => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleViewProfile = () => {
    toast({
      title: "Visualizar Perfil",
      description: `Abrindo perfil de ${collaboratorName}`
    });
  };

  const handleEdit = () => {
    toast({
      title: "Editar Colaborador",
      description: `Editando dados de ${collaboratorName}`
    });
  };

  const handleSendFeedback = () => {
    navigate('/feedback');
    toast({
      title: "Enviar Feedback",
      description: `Preparando feedback para ${collaboratorName}`
    });
  };

  const handleScheduleMeeting = () => {
    navigate('/meetings');
    toast({
      title: "Agendar Reunião",
      description: `Agendando 1:1 com ${collaboratorName}`
    });
  };

  const handleStartOnboarding = () => {
    navigate('/onboarding');
    toast({
      title: "Iniciar Onboarding",
      description: `Iniciando processo para ${collaboratorName}`
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={handleViewProfile}>
          <Eye className="mr-2 h-4 w-4" />
          Ver Perfil
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleEdit}>
          <Edit className="mr-2 h-4 w-4" />
          Editar
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleSendFeedback}>
          <MessageSquare className="mr-2 h-4 w-4" />
          Enviar Feedback
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleScheduleMeeting}>
          <Calendar className="mr-2 h-4 w-4" />
          Agendar 1:1
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleStartOnboarding}>
          <UserCheck className="mr-2 h-4 w-4" />
          Iniciar Onboarding
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
