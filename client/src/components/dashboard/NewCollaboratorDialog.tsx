import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { UserPlus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useCredits } from '@/hooks/useCredits';

export const NewCollaboratorDialog = () => {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const { credits, useCredit } = useCredits();
  const navigate = useNavigate();

  const handleNavigate = () => {
    setOpen(false);
    navigate('/collaborators');
    toast({
      title: "Redirecionando",
      description: "Abrindo página de colaboradores para adicionar novo membro.",
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="justify-start h-auto p-4">
          <UserPlus className="mr-2 h-5 w-5" />
          <div className="text-left">
            <div className="font-medium">Novo Colaborador</div>
            <div className="text-xs text-muted-foreground">Iniciar onboarding</div>
          </div>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Novo Colaborador</DialogTitle>
          <DialogDescription>
            Você será redirecionado para a página de colaboradores onde poderá adicionar um novo membro à equipe.
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-end space-x-2">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancelar
          </Button>
          <Button onClick={handleNavigate}>
            Ir para Colaboradores
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};