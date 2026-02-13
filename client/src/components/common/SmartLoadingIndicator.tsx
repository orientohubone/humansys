
import React from 'react';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2, Wifi, WifiOff, Clock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface SmartLoadingIndicatorProps {
  progress: number;
  stage: 'initial' | 'collaborators' | 'stats' | 'complete';
  networkStatus?: 'online' | 'offline' | 'slow';
  showDetails?: boolean;
  className?: string;
}

export const SmartLoadingIndicator: React.FC<SmartLoadingIndicatorProps> = ({
  progress,
  stage,
  networkStatus = 'online',
  showDetails = false,
  className = ''
}) => {
  const getStageMessage = () => {
    switch (stage) {
      case 'initial':
        return 'Iniciando carregamento...';
      case 'collaborators':
        return 'Carregando dados essenciais...';
      case 'stats':
        return 'Carregando dados adicionais...';
      case 'complete':
        return 'Carregamento concluído!';
      default:
        return 'Carregando...';
    }
  };

  const getNetworkIcon = () => {
    switch (networkStatus) {
      case 'offline':
        return <WifiOff className="h-4 w-4 text-red-500" />;
      case 'slow':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      default:
        return <Wifi className="h-4 w-4 text-green-500" />;
    }
  };

  const getNetworkBadge = () => {
    switch (networkStatus) {
      case 'offline':
        return <Badge variant="destructive" className="text-xs">Offline</Badge>;
      case 'slow':
        return <Badge variant="secondary" className="text-xs">Conexão Lenta</Badge>;
      default:
        return <Badge variant="default" className="text-xs">Online</Badge>;
    }
  };

  if (stage === 'complete' && !showDetails) {
    return null;
  }

  return (
    <Card className={`w-full max-w-md mx-auto ${className}`}>
      <CardContent className="p-6">
        <div className="space-y-4">
          {/* Header com ícone e status */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Loader2 className="h-5 w-5 animate-spin text-primary" />
              <span className="text-sm font-medium">{getStageMessage()}</span>
            </div>
            
            <div className="flex items-center space-x-2">
              {getNetworkIcon()}
              {showDetails && getNetworkBadge()}
            </div>
          </div>

          {/* Barra de progresso */}
          <div className="space-y-2">
            <Progress value={progress} className="h-2" />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{Math.round(progress)}%</span>
              <span>
                {stage === 'collaborators' ? 'Dados essenciais' : 
                 stage === 'stats' ? 'Dados adicionais' : 
                 stage === 'complete' ? 'Concluído' : 'Iniciando'}
              </span>
            </div>
          </div>

          {/* Detalhes adicionais */}
          {showDetails && (
            <div className="text-xs text-muted-foreground space-y-1">
              {networkStatus === 'slow' && (
                <p>⚠️ Conexão lenta detectada - priorizando dados essenciais</p>
              )}
              {networkStatus === 'offline' && (
                <p>📱 Modo offline - usando dados em cache</p>
              )}
              {stage === 'collaborators' && (
                <p>🚀 Carregando o mínimo necessário para você começar a usar</p>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
