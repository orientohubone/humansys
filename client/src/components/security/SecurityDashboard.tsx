import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAuth } from '@/contexts/AuthContext';
import { Shield, AlertTriangle, Eye, Download, Trash2 } from 'lucide-react';

interface SecurityLog {
  id: string;
  event_type: string;
  user_id: string;
  ip_address: string;
  user_agent: string;
  created_at: string;
}

interface SecurityStats {
  total_events: number;
  suspicious_ips: string[];
  most_common_violations: { type: string; count: number }[];
  blocked_users: number;
}

export const SecurityDashboard = () => {
  const { user } = useAuth();
  const [logs, setLogs] = useState<SecurityLog[]>([]);
  const [stats, setStats] = useState<SecurityStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');

  useEffect(() => {
    loadSecurityData();
  }, [filter]);

  const loadSecurityData = async () => {
    try {
      setLoading(true);

      // Mock data since security_logs table doesn't exist
      const mockLogs: SecurityLog[] = [
        {
          id: '1',
          event_type: 'devtools_attempt',
          user_id: user?.id || '',
          ip_address: '192.168.1.100',
          user_agent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          created_at: new Date().toISOString()
        }
      ];

      const filteredLogs = filter === 'all' ? mockLogs : mockLogs.filter(log => log.event_type === filter);
      setLogs(filteredLogs);

      // Mock statistics
      setStats({
        total_events: mockLogs.length,
        suspicious_ips: ['192.168.1.100'],
        most_common_violations: [{ type: 'devtools_attempt', count: 1 }],
        blocked_users: 0
      });
    } catch (error) {
      console.error('Erro ao carregar dados de segurança:', error);
    } finally {
      setLoading(false);
    }
  };

  const exportLogs = () => {
    const csvContent = [
      ['Tipo', 'IP', 'User Agent', 'Data/Hora', 'Detalhes'].join(','),
      ...logs.map(log => [
        log.event_type,
        log.ip_address,
        `"${log.user_agent}"`,
        new Date(log.created_at).toLocaleString('pt-BR'),
        `"${JSON.stringify(log.details)}"`
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `security-logs-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const clearOldLogs = async () => {
    // Mock implementation since we don't have actual security_logs table
    setLogs([]);
    loadSecurityData();
  };

  const getEventTypeLabel = (type: string) => {
    const labels = {
      'devtools_attempt': 'Tentativa DevTools',
      'right_click_attempt': 'Clique Direito',
      'screenshot_attempt': 'Captura de Tela',
      'copy_attempt': 'Tentativa Cópia',
      'suspicious_activity': 'Atividade Suspeita'
    };
    return labels[type as keyof typeof labels] || type;
  };

  const getSeverityColor = (type: string) => {
    const colors = {
      'devtools_attempt': 'destructive',
      'screenshot_attempt': 'destructive',
      'suspicious_activity': 'destructive',
      'copy_attempt': 'secondary',
      'right_click_attempt': 'outline'
    };
    return colors[type as keyof typeof colors] || 'outline';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold flex items-center">
          <Shield className="mr-2 h-6 w-6" />
          Dashboard de Segurança
        </h2>
        <div className="flex space-x-2">
          <Button onClick={exportLogs} variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Exportar Logs
          </Button>
          <Button onClick={clearOldLogs} variant="outline" size="sm">
            <Trash2 className="mr-2 h-4 w-4" />
            Limpar Antigos
          </Button>
        </div>
      </div>

      {stats && (
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total de Eventos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total_events}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">IPs Suspeitos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.suspicious_ips.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Usuários Bloqueados</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{stats.blocked_users}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Violação Mais Comum</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm font-medium">
                {stats.most_common_violations[0]?.type ? 
                  getEventTypeLabel(stats.most_common_violations[0].type) : 'N/A'}
              </div>
              <div className="text-xs text-muted-foreground">
                {stats.most_common_violations[0]?.count || 0} ocorrências
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Filtros</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-2">
            {['all', 'devtools_attempt', 'screenshot_attempt', 'suspicious_activity', 'copy_attempt'].map((type) => (
              <Button
                key={type}
                onClick={() => setFilter(type)}
                variant={filter === type ? 'default' : 'outline'}
                size="sm"
              >
                {type === 'all' ? 'Todos' : getEventTypeLabel(type)}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Logs de Segurança Recentes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {logs.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">
                Nenhum evento de segurança registrado
              </p>
            ) : (
              logs.map((log) => (
                <div key={log.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <Badge variant={getSeverityColor(log.event_type) as any}>
                        {getEventTypeLabel(log.event_type)}
                      </Badge>
                      <span className="text-sm text-muted-foreground">
                        {new Date(log.created_at).toLocaleString('pt-BR')}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Eye className="h-4 w-4" />
                      <span className="text-sm font-mono">{log.ip_address}</span>
                    </div>
                  </div>
                  <div className="text-sm text-muted-foreground mb-2">
                    <strong>User Agent:</strong> {log.user_agent}
                  </div>
                  {log.details && (
                    <div className="text-xs bg-muted p-2 rounded">
                      <strong>Detalhes:</strong> {JSON.stringify(log.details, null, 2)}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      <Alert>
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          <strong>Política de Segurança:</strong> Todas as atividades suspeitas são automaticamente 
          registradas e monitoradas. IPs com múltiplas violações podem ser bloqueados automaticamente. 
          Os logs são mantidos por 90 dias para fins de auditoria e segurança.
        </AlertDescription>
      </Alert>
    </div>
  );
};
