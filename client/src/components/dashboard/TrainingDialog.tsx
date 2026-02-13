
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { BookOpen } from 'lucide-react';
import { useTrainingForm } from '@/hooks/useTrainingForm';
import { ValidationErrors } from './training/ValidationErrors';
import { TrainingFormFields } from './training/TrainingFormFields';
import { TrainingDialogActions } from './training/TrainingDialogActions';

export const TrainingDialog = () => {
  const [open, setOpen] = useState(false);
  const {
    formData,
    isSubmitting,
    validationErrors,
    isFormValid,
    handleInputChange,
    handleSubmit,
    resetForm
  } = useTrainingForm();

  const handleFormSubmit = async () => {
    const success = await handleSubmit();
    if (success) {
      setOpen(false);
    }
  };

  const handleOpenChange = (newOpen: boolean) => {
    console.log('Dialog open state changed:', newOpen);
    setOpen(newOpen);
    if (!newOpen) {
      resetForm();
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline" className="justify-start h-auto p-4">
          <BookOpen className="mr-2 h-5 w-5" />
          <div className="text-left">
            <div className="font-medium">Novo Treinamento</div>
            <div className="text-xs text-muted-foreground">Criar curso</div>
          </div>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Criar Novo Treinamento</DialogTitle>
          <DialogDescription>
            Configure um novo curso de treinamento para os colaboradores
          </DialogDescription>
        </DialogHeader>
        
        <ValidationErrors errors={validationErrors} />
        
        <TrainingFormFields 
          formData={formData}
          validationErrors={validationErrors}
          isSubmitting={isSubmitting}
          onInputChange={handleInputChange}
        />
        
        <TrainingDialogActions
          isSubmitting={isSubmitting}
          isFormValid={isFormValid}
          onCancel={() => handleOpenChange(false)}
          onSubmit={handleFormSubmit}
        />
      </DialogContent>
    </Dialog>
  );
};
