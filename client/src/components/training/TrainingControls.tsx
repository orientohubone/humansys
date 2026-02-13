
import React from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCw, Wifi, WifiOff, Trash2 } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useTrainingCache } from '@/hooks/useTrainingCache';

interface TrainingControlsProps {
  isLoading: boolean;
  isUsingCache: boolean;
  error: string | null;
  onForceRefresh: () => void;
}

export const TrainingControls = ({ 
  isLoading, 
  isUsingCache, 
  error, 
  onForceRefresh 
}: TrainingControlsProps) => {
  const { clearAppData } = useTrainingCache();

  const handleClearAppData = () => {
    if (confirm('Isso irá limpar todos os dados da aplicação e recarregar a página. Continuar?')) {
      clearAppData();
    }
  };

  return (
    <div className="space-y-4">
      {/* Status de Conectividade */}
      {isUsingCache && (
        <Alert>
          <WifiOff className="h-4 w-4" />
          <AlertDescription>
            Exibindo dados salvos localmente. Alguns dados podem estar desatualizados.
          </AlertDescription>
        </Alert>
      )}

      {error && !isUsingCache && (
        <Alert variant="destructive">
          <WifiOff className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Controles */}
      <div className="flex gap-2 flex-wrap">
        <Button
          onClick={onForceRefresh}
          disabled={isLoading}
          variant="outline"
          size="sm"
        >
          <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          {isLoading ? 'Carregando...' : 'Forçar Recarregamento'}
        </Button>

        <Button
          onClick={handleClearAppData}
          variant="outline"
          size="sm"
          className="text-destructive hover:text-destructive"
        >
          <Trash2 className="mr-2 h-4 w-4" />
          Limpar Dados da App
        </Button>

        {!isUsingCache && !error && (
          <div className="flex items-center text-sm text-muted-foreground">
            <Wifi className="mr-1 h-4 w-4 text-green-500" />
            Conectado
          </div>
        )}
      </div>
    </div>
  );
};
