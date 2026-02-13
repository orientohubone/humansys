
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { TrainingFormData } from '@/hooks/useTrainingForm';

interface TrainingFormFieldsProps {
  formData: TrainingFormData;
  validationErrors: string[];
  isSubmitting: boolean;
  onInputChange: (field: keyof TrainingFormData, value: string) => void;
}

export const TrainingFormFields = ({ 
  formData, 
  validationErrors, 
  isSubmitting, 
  onInputChange 
}: TrainingFormFieldsProps) => {
  return (
    <div className="grid gap-4 py-4">
      <div className="grid gap-2">
        <Label htmlFor="title">Título do Curso *</Label>
        <Input 
          id="title" 
          placeholder="Digite o título do curso"
          value={formData.title}
          onChange={(e) => onInputChange('title', e.target.value)}
          disabled={isSubmitting}
          className={validationErrors.some(e => e.includes('Título')) ? 'border-destructive' : ''}
        />
      </div>
      
      <div className="grid gap-2">
        <Label htmlFor="description">Descrição *</Label>
        <Textarea 
          id="description" 
          placeholder="Descreva o conteúdo do curso..."
          value={formData.description}
          onChange={(e) => onInputChange('description', e.target.value)}
          rows={3}
          disabled={isSubmitting}
          className={validationErrors.some(e => e.includes('Descrição')) ? 'border-destructive' : ''}
        />
      </div>
      
      <div className="grid gap-2">
        <Label htmlFor="duration">Duração *</Label>
        <Input 
          id="duration" 
          placeholder="Ex: 8 horas, 2 semanas..."
          value={formData.duration}
          onChange={(e) => onInputChange('duration', e.target.value)}
          disabled={isSubmitting}
          className={validationErrors.some(e => e.includes('Duração')) ? 'border-destructive' : ''}
        />
      </div>
      
      <div className="grid gap-2">
        <Label htmlFor="instructor">Instrutor</Label>
        <Input 
          id="instructor" 
          placeholder="Nome do instrutor"
          value={formData.instructor}
          onChange={(e) => onInputChange('instructor', e.target.value)}
          disabled={isSubmitting}
        />
      </div>
    </div>
  );
};
