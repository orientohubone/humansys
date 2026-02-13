
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { BookOpen } from 'lucide-react';
import { TrainingDialog } from '@/components/dashboard/TrainingDialog';

export const EmptyTrainingState = () => {
  return (
    <Card>
      <CardContent className="flex flex-col items-center justify-center py-12">
        <BookOpen className="h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium mb-2">Nenhum treinamento encontrado</h3>
        <p className="text-muted-foreground text-center mb-4">
          Você ainda não criou nenhum treinamento. Comece criando seu primeiro curso.
        </p>
        <TrainingDialog />
      </CardContent>
    </Card>
  );
};
