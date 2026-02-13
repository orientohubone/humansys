
import React from 'react';
import { Button } from '@/components/ui/button';
import { CheckCircle } from 'lucide-react';

interface TrainingDialogActionsProps {
  isSubmitting: boolean;
  isFormValid: boolean;
  onCancel: () => void;
  onSubmit: () => void;
}

export const TrainingDialogActions = ({ 
  isSubmitting, 
  isFormValid, 
  onCancel, 
  onSubmit 
}: TrainingDialogActionsProps) => {
  return (
    <div className="flex justify-end space-x-2">
      <Button 
        variant="outline" 
        onClick={onCancel}
        disabled={isSubmitting}
      >
        Cancelar
      </Button>
      <Button 
        onClick={onSubmit}
        disabled={isSubmitting || !isFormValid}
        className="min-w-[140px]"
      >
        {isSubmitting ? (
          <>
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
            Criando...
          </>
        ) : (
          <>
            <CheckCircle className="mr-2 h-4 w-4" />
            Criar Treinamento
          </>
        )}
      </Button>
    </div>
  );
};
