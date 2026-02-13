
export const validateTrainingData = (data: {
  title: string;
  description: string;
  duration: string;
  instructor?: string;
}): string[] => {
  const errors: string[] = [];
  
  if (!data.title || data.title.trim().length < 3) {
    errors.push('Título deve ter pelo menos 3 caracteres');
  }
  
  if (!data.description || data.description.trim().length < 10) {
    errors.push('Descrição deve ter pelo menos 10 caracteres');
  }
  
  if (!data.duration || data.duration.trim().length < 2) {
    errors.push('Duração é obrigatória');
  }
  
  return errors;
};
