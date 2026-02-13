
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Wifi, WifiOff, Clock, Database, RefreshCw } from 'lucide-react';
import { useSessionHealthCheck } from '@/hooks/useSessionHealthCheck';
import { useSmartCache } from '@/hooks/useSmartCache';
import { Button } from '@/components/ui/button';

export const SystemHealthIndicator = () => {
  const { sessionHealth, forceRefresh } = useSessionHealthCheck();
  const { getStats } = useSmartCache();
  const stats = getStats();

  const getStatusColor = () => {
    if (!sessionHealth.isHealthy) return 'destructive';
    if (sessionHealth.networkStatus === 'slow') return 'secondary';
    return 'default';
  };

  const getStatusIcon = () => {
    if (!sessionHealth.isHealthy) return <WifiOff className="h-3 w-3" />;
    if (sessionHealth.networkStatus === 'slow') return <Clock className="h-3 w-3" />;
    return <Wifi className="h-3 w-3" />;
  };

  const getStatusText = () => {
    if (!sessionHealth.isHealthy) return 'Sistema Offline';
    if (sessionHealth.networkStatus === 'slow') return 'Conexão Lenta';
    return 'Sistema Online';
  };

  return (
    <Card className="w-full max-w-sm">
      <CardContent className="p-4">
        <div className="space-y-3">
          {/* Status Principal */}
          <div className="flex items-center justify-between">
            <Badge variant={getStatusColor()} className="flex items-center space-x-1">
              {getStatusIcon()}
              <span>{getStatusText()}</span>
            </Badge>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={forceRefresh}
              className="h-7 w-7 p-0"
            >
              <RefreshCw className="h-3 w-3" />
            </Button>
          </div>

          {/* Estatísticas do Cache */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="flex items-center space-x-1">
              <Database className="h-3 w-3 text-muted-foreground" />
              <span className="text-muted-foreground">Cache:</span>
              <span className="font-medium">{stats.size}</span>
            </div>
            
            <div className="flex items-center space-x-1">
              <span className="text-muted-foreground">Hit Rate:</span>
              <span className="font-medium">{stats.hitRate}</span>
            </div>
          </div>

          {/* Últimas Verificações */}
          <div className="text-xs text-muted-foreground">
            Última verificação: {sessionHealth.lastCheck.toLocaleTimeString()}
            {sessionHealth.consecutiveFailures > 0 && (
              <span className="text-destructive">
                {' '}({sessionHealth.consecutiveFailures} falhas)
              </span>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
