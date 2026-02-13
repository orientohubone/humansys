
import React, { useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { 
  RefreshCw, 
  Database, 
  Wifi, 
  User, 
  HardDrive,
  Activity,
  Settings,
  AlertTriangle,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { useSystemManagement } from '@/hooks/useSystemManagement';
import { AuthDebugPanel } from '@/components/debug/AuthDebugPanel';
import { SystemLogsViewer } from '@/components/debug/SystemLogsViewer';
import { CacheManagementPanel } from '@/components/debug/CacheManagementPanel';
import { ConnectionStatus } from '@/components/feedback/ConnectionStatus';

const StatusIcon = ({ status }: { status: boolean }) => {
  return status ? (
    <CheckCircle className="h-4 w-4 text-green-500" />
  ) : (
    <XCircle className="h-4 w-4 text-red-500" />
  );
};

export const SystemDebugPanel = () => {
  const {
    systemHealth,
    isMonitoring,
    checkSystemHealth,
    addAlert,
    clearResolvedAlerts,
    getSystemStats,
    restartSystem,
    startMonitoring,
    stopMonitoring
  } = useSystemManagement();

  useEffect(() => {
    checkSystemHealth();
  }, []);

  const handleFullRefresh = async () => {
    await restartSystem();
  };

  const handleClearCache = async () => {
    try {
      localStorage.clear();
      sessionStorage.clear();
      addAlert('info', 'Cache limpo com sucesso');
    } catch (error) {
      addAlert('error', 'Erro ao limpar cache');
    }
  };

  const handleRunDiagnostics = async () => {
    const diagnostics = {
      system: systemHealth,
      stats: getSystemStats(),
      timestamp: new Date().toISOString()
    };
    console.table(diagnostics);
    addAlert('info', 'Diagnósticos executados - verifique o console');
  };

  // Create system status from health data
  const systemStatus = {
    connectivity: systemHealth.status === 'healthy',
    authentication: true, // Mock - assume authenticated if using the panel
    cache: true, // Mock - assume cache is working
    lastCheck: new Date().toISOString()
  };

  return (
    <div className="space-y-6">
      {/* Status do Sistema */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center space-x-2">
                <Activity className="h-5 w-5" />
                <span>Status do Sistema</span>
              </CardTitle>
              <CardDescription>
                Monitore a saúde e conectividade do sistema
              </CardDescription>
            </div>
            <div className="flex items-center space-x-2">
              <ConnectionStatus />
              <Button
                onClick={checkSystemHealth}
                variant="outline"
                size="sm"
                disabled={false}
              >
                <RefreshCw className={`h-4 w-4`} />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div className="flex items-center space-x-3 p-3 border rounded-lg">
              <div className="flex items-center space-x-2">
                <Wifi className="h-4 w-4" />
                <StatusIcon status={systemStatus.connectivity} />
              </div>
              <div>
                <p className="text-sm font-medium">Conectividade</p>
                <p className="text-xs text-muted-foreground">
                  {systemStatus.connectivity ? 'Online' : 'Offline'}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3 p-3 border rounded-lg">
              <div className="flex items-center space-x-2">
                <User className="h-4 w-4" />
                <StatusIcon status={systemStatus.authentication} />
              </div>
              <div>
                <p className="text-sm font-medium">Autenticação</p>
                <p className="text-xs text-muted-foreground">
                  {systemStatus.authentication ? 'Logado' : 'Deslogado'}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3 p-3 border rounded-lg">
              <div className="flex items-center space-x-2">
                <HardDrive className="h-4 w-4" />
                <StatusIcon status={systemStatus.cache} />
              </div>
              <div>
                <p className="text-sm font-medium">Cache</p>
                <p className="text-xs text-muted-foreground">
                  {systemStatus.cache ? 'Ativo' : 'Inativo'}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3 p-3 border rounded-lg">
              <div className="flex items-center space-x-2">
                <Database className="h-4 w-4" />
                <StatusIcon status={systemStatus.connectivity} />
              </div>
              <div>
                <p className="text-sm font-medium">Database</p>
                <p className="text-xs text-muted-foreground">
                  {systemStatus.connectivity ? 'Conectado' : 'Desconectado'}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-4 text-xs text-muted-foreground">
            Última verificação: {new Date(systemStatus.lastCheck).toLocaleString('pt-BR')}
          </div>
        </CardContent>
      </Card>

      {/* Ações do Sistema */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Settings className="h-5 w-5" />
            <span>Ações do Sistema</span>
          </CardTitle>
          <CardDescription>
            Ferramentas para manutenção e diagnóstico do sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Button
              onClick={handleFullRefresh}
              disabled={false}
              className="flex items-center space-x-2"
            >
              <RefreshCw className={`h-4 w-4`} />
              <span>Refresh Completo</span>
            </Button>

            <Button
              onClick={handleClearCache}
              variant="outline"
              className="flex items-center space-x-2"
            >
              <HardDrive className="h-4 w-4" />
              <span>Limpar Cache</span>
            </Button>

            <Button
              onClick={handleRunDiagnostics}
              variant="outline"
              className="flex items-center space-x-2"
            >
              <Activity className="h-4 w-4" />
              <span>Executar Diagnósticos</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Panel de Gerenciamento de Cache */}
      <CacheManagementPanel />

      {/* Panel de Debug de Autenticação */}
      <AuthDebugPanel />

      {/* Visualizador de Logs */}
      <SystemLogsViewer />

      {/* Informações Técnicas */}
      <Card>
        <CardHeader>
          <CardTitle>Informações Técnicas</CardTitle>
          <CardDescription>
            Detalhes técnicos sobre o ambiente e configurações
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Versão do Sistema</Label>
              <Input value="v2.1.0" readOnly />
            </div>
            
            <div className="space-y-2">
              <Label>Ambiente</Label>
              <Input value="Produção" readOnly />
            </div>
            
            <div className="space-y-2">
              <Label>Build</Label>
              <Input value={new Date().toISOString().split('T')[0]} readOnly />
            </div>
            
            <div className="space-y-2">
              <Label>Navegador</Label>
              <Input value={navigator.userAgent.split(' ')[0]} readOnly />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
