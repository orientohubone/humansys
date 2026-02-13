
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { UserPlus } from 'lucide-react';
import { useCollaborators } from '@/hooks/useCollaborators';
import { useTrainingEnrollments } from '@/hooks/useTrainingEnrollments';

interface TrainingEnrollmentDialogProps {
  trainingId: string;
  trainingTitle: string;
}

export const TrainingEnrollmentDialog = ({ trainingId, trainingTitle }: TrainingEnrollmentDialogProps) => {
  const [open, setOpen] = useState(false);
  const [selectedCollaborator, setSelectedCollaborator] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { collaborators } = useCollaborators();
  const { enrollCollaborator } = useTrainingEnrollments();

  const handleSubmit = async () => {
    if (!selectedCollaborator) return;

    setIsSubmitting(true);
    const success = await enrollCollaborator(trainingId, selectedCollaborator);
    
    if (success) {
      setSelectedCollaborator('');
      setOpen(false);
    }
    setIsSubmitting(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <UserPlus className="mr-2 h-4 w-4" />
          Matricular Colaborador
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Matricular Colaborador</DialogTitle>
          <DialogDescription>
            Selecione um colaborador para matricular no treinamento: {trainingTitle}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Colaborador</Label>
            <Select value={selectedCollaborator} onValueChange={setSelectedCollaborator}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione um colaborador" />
              </SelectTrigger>
              <SelectContent>
                {collaborators.map((collaborator) => (
                  <SelectItem key={collaborator.id} value={collaborator.id}>
                    {collaborator.name} - {collaborator.role}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex justify-end space-x-2">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancelar
          </Button>
          <Button 
            onClick={handleSubmit} 
            disabled={!selectedCollaborator || isSubmitting}
          >
            {isSubmitting ? 'Matriculando...' : 'Matricular'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
