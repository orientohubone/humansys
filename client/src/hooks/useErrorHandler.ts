
import { useSystemLogs } from './useSystemLogs';
import { useToast } from '@/components/ui/use-toast';

export const useErrorHandler = () => {
  const { logError } = useSystemLogs();
  const { toast } = useToast();

  const handleError = (
    error: any,
    source: string,
    userFriendlyMessage?: string,
    showToast: boolean = true
  ) => {
    console.error(`[${source}] Erro capturado:`, error);
    
    // Determinar mensagem de erro baseada no tipo
    let finalMessage = userFriendlyMessage || "Ocorreu um erro inesperado. Tente novamente.";
    
    if (error?.message?.includes('Failed to fetch')) {
      finalMessage = "Erro de conectividade. Verifique sua conexão com a internet e tente novamente.";
    } else if (error?.code === '42501') {
      finalMessage = "Erro de permissão. Verifique se você tem acesso para realizar esta ação.";
    } else if (error?.code === '23505') {
      finalMessage = "Já existe um registro com esses dados.";
    }

    // Log apenas no console para evitar problemas de conectividade
    logError(
      error?.message || 'Erro desconhecido',
      source,
      {
        error: error,
        stack: error?.stack,
        timestamp: new Date().toISOString()
      }
    );

    // Mostrar toast para o usuário se solicitado
    if (showToast) {
      toast({
        title: "Erro",
        description: finalMessage,
        variant: "destructive"
      });
    }
  };

  const handleAsyncError = async (
    asyncFunction: () => Promise<any>,
    source: string,
    userFriendlyMessage?: string
  ) => {
    try {
      return await asyncFunction();
    } catch (error) {
      handleError(error, source, userFriendlyMessage);
      throw error;
    }
  };

  return {
    handleError,
    handleAsyncError
  };
};
