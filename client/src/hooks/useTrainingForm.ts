
import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useTrainings } from '@/hooks/useTrainings';
import { useSystemLogs } from '@/hooks/useSystemLogs';

export interface TrainingFormData {
  title: string;
  description: string;
  duration: string;
  instructor: string;
}

export const useTrainingForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [formData, setFormData] = useState<TrainingFormData>({
    title: '',
    description: '',
    duration: '',
    instructor: ''
  });
  const { createTraining } = useTrainings();
  const { logInfo, logError } = useSystemLogs();

  const validateForm = () => {
    const errors: string[] = [];
    
    if (!formData.title.trim() || formData.title.trim().length < 3) {
      errors.push('Título deve ter pelo menos 3 caracteres');
    }
    
    if (!formData.description.trim() || formData.description.trim().length < 10) {
      errors.push('Descrição deve ter pelo menos 10 caracteres');
    }
    
    if (!formData.duration.trim()) {
      errors.push('Duração é obrigatória');
    }
    
    setValidationErrors(errors);
    return errors.length === 0;
  };

  const handleInputChange = (field: keyof TrainingFormData, value: string) => {
    console.log(`Campo ${field} alterado para:`, value);
    setFormData(prev => ({ ...prev, [field]: value }));
    if (validationErrors.length > 0) {
      setValidationErrors([]);
    }
  };

  const handleSubmit = async () => {
    console.log('Iniciando submissão do formulário:', formData);
    
    if (!validateForm()) {
      console.warn('Formulário inválido, não submetendo');
      return false;
    }

    setIsSubmitting(true);
    
    try {
      logInfo('Tentativa de submissão de formulário de treinamento', 'useTrainingForm.handleSubmit', formData);
      
      const success = await createTraining(formData);
      
      if (success) {
        console.log('Treinamento criado com sucesso, resetando formulário');
        resetForm();
        return true;
      } else {
        console.warn('Falha na criação do treinamento');
        return false;
      }
    } catch (error) {
      console.error('Erro durante submissão:', error);
      logError('Erro durante submissão do formulário', 'useTrainingForm.handleSubmit', { error });
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    console.log('Resetando formulário');
    setFormData({ title: '', description: '', duration: '', instructor: '' });
    setValidationErrors([]);
  };

  const isFormValid = formData.title.trim().length >= 3 && 
                     formData.description.trim().length >= 10 && 
                     formData.duration.trim().length > 0;

  return {
    formData,
    isSubmitting,
    validationErrors,
    isFormValid,
    handleInputChange,
    handleSubmit,
    resetForm
  };
};
