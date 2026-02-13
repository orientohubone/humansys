import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { OnboardingStep } from '@/hooks/useOnboarding';

interface EditStepDialogProps {
  step: OnboardingStep | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (stepData: Partial<OnboardingStep>) => void;
}

export const EditStepDialog = ({ step, open, onOpenChange, onSave }: EditStepDialogProps) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'task' as 'document' | 'training' | 'meeting' | 'task',
    due_date: '',
    order: 1
  });

  useEffect(() => {
    if (step) {
      setFormData({
        title: step.title || '',
        description: step.description || '',
        type: step.type || 'task',
        due_date: step.due_date || '',
        order: step.order || 1
      });
    } else {
      setFormData({
        title: '',
        description: '',
        type: 'task',
        due_date: '',
        order: 1
      });
    }
  }, [step]);

  const handleSave = () => {
    onSave(formData);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {step ? 'Editar Etapa' : 'Nova Etapa'}
          </DialogTitle>
          <DialogDescription>
            Configure os detalhes da etapa do processo de onboarding
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="title">Título da Etapa</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Ex: Documentação Pessoal"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="description">Descrição</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Descreva o que precisa ser feito nesta etapa"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="type">Tipo da Etapa</Label>
              <Select
                value={formData.type}
                onValueChange={(value) => setFormData({ ...formData, type: value as any })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="document">Documento</SelectItem>
                  <SelectItem value="training">Treinamento</SelectItem>
                  <SelectItem value="meeting">Reunião</SelectItem>
                  <SelectItem value="task">Tarefa</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="order">Ordem</Label>
              <Input
                id="order"
                type="number"
                value={formData.order}
                onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 1 })}
                min="1"
              />
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="due_date">Data de Vencimento (Opcional)</Label>
            <Input
              id="due_date"
              type="date"
              value={formData.due_date}
              onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
            />
          </div>
        </div>

        <div className="flex justify-end space-x-2 pt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleSave}>
            {step ? 'Salvar Alterações' : 'Criar Etapa'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};