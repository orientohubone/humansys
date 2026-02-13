import React, { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { SecurityDashboard } from '@/components/security/SecurityDashboard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Shield, Settings, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export const SecurityManagement = () => {
  const { toast } = useToast();
  const [securitySettings, setSecuritySettings] = useState({
    basicMonitoring: true,
    logEvents: true,
    alertsEnabled: true,
    realTimeMonitoring: false,
    autoBlock: false
  });

  const updateSetting = (key: keyof typeof securitySettings, value: boolean) => {
    setSecuritySettings(prev => ({ ...prev, [key]: value }));
    toast({
      title: "Configuração Atualizada",
      description: `${key} foi ${value ? 'ativado' : 'desativado'}`,
    });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center">
              <Shield className="mr-3 h-8 w-8" />
              Monitoramento de Segurança
            </h1>
            <p className="text-muted-foreground">
              Sistema simplificado de monitoramento e logs
            </p>
          </div>
        </div>

        <Tabs defaultValue="dashboard" className="space-y-6">
          <TabsList>
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="settings">Configurações</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard">
            <SecurityDashboard />
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Settings className="mr-2 h-5 w-5" />
                  Configurações de Monitoramento
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Monitoramento Básico</h3>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="basicMonitoring">Monitoramento Básico</Label>
                      <p className="text-sm text-muted-foreground">
                        Registro de atividades básicas
                      </p>
                    </div>
                    <Switch
                      id="basicMonitoring"
                      checked={securitySettings.basicMonitoring}
                      onCheckedChange={(checked) => updateSetting('basicMonitoring', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="logEvents">Log de Eventos</Label>
                      <p className="text-sm text-muted-foreground">
                        Registrar eventos de segurança
                      </p>
                    </div>
                    <Switch
                      id="logEvents"
                      checked={securitySettings.logEvents}
                      onCheckedChange={(checked) => updateSetting('logEvents', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="alertsEnabled">Alertas</Label>
                      <p className="text-sm text-muted-foreground">
                        Notificações de eventos importantes
                      </p>
                    </div>
                    <Switch
                      id="alertsEnabled"
                      checked={securitySettings.alertsEnabled}
                      onCheckedChange={(checked) => updateSetting('alertsEnabled', checked)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <strong>Sistema Simplificado:</strong> O sistema de segurança foi simplificado 
                para focar apenas em monitoramento básico e logs, sem interferir na experiência do usuário.
              </AlertDescription>
            </Alert>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};