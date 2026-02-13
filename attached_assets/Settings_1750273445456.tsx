
import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { Progress } from '@/components/ui/progress';
import { 
  User, 
  Bell, 
  Shield, 
  Palette, 
  Database, 
  Key, 
  Mail, 
  Smartphone,
  Settings as SettingsIcon,
  AlertTriangle,
  CheckCircle,
  CreditCard,
  RefreshCw,
  Download,
  Trash2,
  Save,
  FileText,
  Activity,
  Clock,
  Wifi,
  WifiOff
} from 'lucide-react';
import { CreditsCard } from '@/components/dashboard/CreditsCard';
import { useCredits } from '@/hooks/useCredits';
import { UserManagementDialog } from '@/components/settings/UserManagementDialog';
import { AdminPanel } from '@/components/settings/AdminPanel';
import { SystemRecovery } from '@/components/debug/SystemRecovery';
import { supabase } from '@/integrations/supabase/client';

export const Settings = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const { credits, updateCredits } = useCredits();
  
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [systemStatus, setSystemStatus] = useState({
    connectivity: true,
    authentication: true,
    database: true,
    cache: true,
    lastCheck: new Date().toISOString()
  });

  const [settings, setSettings] = useState({
    notifications: {
      email: true,
      push: false,
      desktop: true,
      marketing: false
    },
    privacy: {
      profileVisible: true,
      activityTracking: true,
      dataCollection: false
    },
    appearance: {
      theme: 'system',
      compactMode: false,
      animations: true
    },
    advanced: {
      developerMode: false,
      debugMode: false
    }
  });

  // Carregar configurações do usuário
  useEffect(() => {
    loadUserSettings();
    checkSystemStatus();
  }, []);

  const loadUserSettings = async () => {
    try {
      const savedSettings = localStorage.getItem(`settings_${user?.id}`);
      if (savedSettings) {
        setSettings(JSON.parse(savedSettings));
      }
    } catch (error) {
      console.error('Erro ao carregar configurações:', error);
    }
  };

  const checkSystemStatus = async () => {
    try {
      const { data, error } = await supabase.from('profiles').select('id').limit(1);
      const connectivity = !error;
      const authentication = !!user?.id;
      
      setSystemStatus({
        connectivity,
        authentication,
        database: connectivity,
        cache: true,
        lastCheck: new Date().toISOString()
      });
    } catch (error) {
      console.error('Erro ao verificar status do sistema:', error);
      setSystemStatus(prev => ({
        ...prev,
        connectivity: false,
        database: false,
        lastCheck: new Date().toISOString()
      }));
    }
  };

  const handleSaveSettings = async () => {
    setIsSaving(true);
    try {
      // Salvar no localStorage
      localStorage.setItem(`settings_${user?.id}`, JSON.stringify(settings));
      
      // Simular salvamento no servidor
      await new Promise(resolve => setTimeout(resolve, 1000));

      toast({
        title: "Configurações salvas",
        description: "Suas preferências foram atualizadas com sucesso.",
      });
    } catch (error) {
      toast({
        title: "Erro ao salvar",
        description: "Não foi possível salvar as configurações. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const updateSetting = (category: string, key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category as keyof typeof prev],
        [key]: value
      }
    }));
  };

  const handleExportData = async () => {
    setIsLoading(true);
    try {
      const userData = {
        profile: user,
        settings,
        exportDate: new Date().toISOString()
      };
      
      const blob = new Blob([JSON.stringify(userData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `dados_usuario_${user?.email}_${new Date().getDate()}-${new Date().getMonth() + 1}-${new Date().getFullYear()}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast({
        title: "Dados exportados",
        description: "Seus dados foram exportados com sucesso.",
      });
    } catch (error) {
      toast({
        title: "Erro na exportação",
        description: "Não foi possível exportar os dados.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!confirm('Tem certeza que deseja excluir sua conta? Esta ação não pode ser desfeita.')) {
      return;
    }

    setIsLoading(true);
    try {
      // Simular exclusão da conta
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "Conta excluída",
        description: "Sua conta foi excluída com sucesso.",
        variant: "destructive",
      });
      
      // Redirecionar para login após 3 segundos
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (error) {
      toast({
        title: "Erro na exclusão",
        description: "Não foi possível excluir a conta.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const clearCache = () => {
    try {
      // Limpar cache específico do usuário
      const keysToRemove = Object.keys(localStorage).filter(key => 
        key.includes(user?.id || '') || key.includes('cache_')
      );
      
      keysToRemove.forEach(key => localStorage.removeItem(key));
      
      toast({
        title: "Cache limpo",
        description: "Cache do sistema foi limpo com sucesso.",
      });
      
      checkSystemStatus();
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível limpar o cache.",
        variant: "destructive",
      });
    }
  };

  const StatusIndicator = ({ status, label }: { status: boolean; label: string }) => (
    <div className="flex items-center space-x-2">
      {status ? (
        <CheckCircle className="h-4 w-4 text-green-500" />
      ) : (
        <AlertTriangle className="h-4 w-4 text-red-500" />
      )}
      <span className="text-sm">{label}</span>
      <Badge variant={status ? "default" : "destructive"}>
        {status ? "OK" : "Erro"}
      </Badge>
    </div>
  );

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Configurações</h1>
            <p className="text-muted-foreground">
              Gerencie suas preferências e configurações da conta
            </p>
          </div>
          <Button 
            onClick={handleSaveSettings} 
            disabled={isSaving}
            className="bg-gradient-to-r from-blue-500 to-blue-600"
          >
            <Save className="h-4 w-4 mr-2" />
            {isSaving ? 'Salvando...' : 'Salvar Configurações'}
          </Button>
        </div>

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Perfil
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center gap-2">
              <Bell className="h-4 w-4" />
              Notificações
            </TabsTrigger>
            <TabsTrigger value="privacy" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Privacidade
            </TabsTrigger>
            <TabsTrigger value="appearance" className="flex items-center gap-2">
              <Palette className="h-4 w-4" />
              Aparência
            </TabsTrigger>
            <TabsTrigger value="sistema" className="flex items-center gap-2">
              <Activity className="h-4 w-4" />
              Sistema
            </TabsTrigger>
            <TabsTrigger value="advanced" className="flex items-center gap-2">
              <SettingsIcon className="h-4 w-4" />
              Avançado
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Perfil do Usuário</CardTitle>
                <CardDescription>
                  Acesse sua página de perfil completa para gerenciar todas as suas informações
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center py-8">
                  <User className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">Gerencie seu Perfil</h3>
                  <p className="text-sm text-muted-foreground mb-6">
                    Acesse a página completa do perfil com foto, informações pessoais, empresa e muito mais.
                  </p>
                  <Button onClick={() => navigate('/app/profile')} size="lg">
                    <User className="h-4 w-4 mr-2" />
                    Ir para Página de Perfil
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Gestão de Créditos
                </CardTitle>
                <CardDescription>
                  Gerencie seus créditos para cadastro de colaboradores
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <CreditsCard />

                <Separator />

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">Cadastro de Usuários</h4>
                    <UserManagementDialog />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Cadastre novos usuários na plataforma usando seus créditos disponíveis
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Preferências de Notificação</CardTitle>
                <CardDescription>
                  Configure como e quando deseja receber notificações
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Email</h4>
                      <p className="text-sm text-muted-foreground">
                        Receber notificações por email
                      </p>
                    </div>
                    <Switch
                      checked={settings.notifications.email}
                      onCheckedChange={(checked) => updateSetting('notifications', 'email', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Push Notifications</h4>
                      <p className="text-sm text-muted-foreground">
                        Notificações push no navegador
                      </p>
                    </div>
                    <Switch
                      checked={settings.notifications.push}
                      onCheckedChange={(checked) => updateSetting('notifications', 'push', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Notificações Desktop</h4>
                      <p className="text-sm text-muted-foreground">
                        Alertas na área de trabalho
                      </p>
                    </div>
                    <Switch
                      checked={settings.notifications.desktop}
                      onCheckedChange={(checked) => updateSetting('notifications', 'desktop', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Marketing e Novidades</h4>
                      <p className="text-sm text-muted-foreground">
                        Receber updates sobre produtos e funcionalidades
                      </p>
                    </div>
                    <Switch
                      checked={settings.notifications.marketing}
                      onCheckedChange={(checked) => updateSetting('notifications', 'marketing', checked)}
                    />
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h4 className="font-medium">Status das Notificações</h4>
                  <div className="grid gap-2">
                    <StatusIndicator 
                      status={settings.notifications.email} 
                      label="Email ativo" 
                    />
                    <StatusIndicator 
                      status={settings.notifications.desktop} 
                      label="Desktop ativo" 
                    />
                    <StatusIndicator 
                      status={!settings.notifications.marketing} 
                      label="Spam bloqueado" 
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="privacy" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Configurações de Privacidade</CardTitle>
                <CardDescription>
                  Controle como seus dados são utilizados
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Perfil Visível</h4>
                      <p className="text-sm text-muted-foreground">
                        Outros usuários podem ver seu perfil
                      </p>
                    </div>
                    <Switch
                      checked={settings.privacy.profileVisible}
                      onCheckedChange={(checked) => updateSetting('privacy', 'profileVisible', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Rastreamento de Atividade</h4>
                      <p className="text-sm text-muted-foreground">
                        Permitir análise de uso para melhorar o produto
                      </p>
                    </div>
                    <Switch
                      checked={settings.privacy.activityTracking}
                      onCheckedChange={(checked) => updateSetting('privacy', 'activityTracking', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Coleta de Dados</h4>
                      <p className="text-sm text-muted-foreground">
                        Compartilhar dados anonimizados para pesquisa
                      </p>
                    </div>
                    <Switch
                      checked={settings.privacy.dataCollection}
                      onCheckedChange={(checked) => updateSetting('privacy', 'dataCollection', checked)}
                    />
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h4 className="font-medium">Exportar ou Excluir Dados</h4>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      onClick={handleExportData}
                      disabled={isLoading}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      {isLoading ? 'Exportando...' : 'Exportar Dados'}
                    </Button>
                    <Button 
                      variant="destructive" 
                      onClick={handleDeleteAccount}
                      disabled={isLoading}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      {isLoading ? 'Excluindo...' : 'Excluir Conta'}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="appearance" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Personalizar Aparência</CardTitle>
                <CardDescription>
                  Ajuste a interface conforme sua preferência
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <Label>Tema</Label>
                    <div className="grid grid-cols-3 gap-2 mt-2">
                      <Button 
                        variant={settings.appearance.theme === 'light' ? 'default' : 'outline'} 
                        size="sm"
                        onClick={() => updateSetting('appearance', 'theme', 'light')}
                      >
                        Claro
                      </Button>
                      <Button 
                        variant={settings.appearance.theme === 'dark' ? 'default' : 'outline'} 
                        size="sm"
                        onClick={() => updateSetting('appearance', 'theme', 'dark')}
                      >
                        Escuro
                      </Button>
                      <Button 
                        variant={settings.appearance.theme === 'system' ? 'default' : 'outline'} 
                        size="sm"
                        onClick={() => updateSetting('appearance', 'theme', 'system')}
                      >
                        Sistema
                      </Button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Modo Compacto</h4>
                      <p className="text-sm text-muted-foreground">
                        Interface mais densa com menos espaçamento
                      </p>
                    </div>
                    <Switch
                      checked={settings.appearance.compactMode}
                      onCheckedChange={(checked) => updateSetting('appearance', 'compactMode', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Animações</h4>
                      <p className="text-sm text-muted-foreground">
                        Efeitos de transição e animações
                      </p>
                    </div>
                    <Switch
                      checked={settings.appearance.animations}
                      onCheckedChange={(checked) => updateSetting('appearance', 'animations', checked)}
                    />
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h4 className="font-medium">Prévia das Configurações</h4>
                  <div className="p-4 border rounded-lg bg-muted/50">
                    <p className="text-sm">
                      <strong>Tema:</strong> {settings.appearance.theme} | 
                      <strong> Compacto:</strong> {settings.appearance.compactMode ? 'Sim' : 'Não'} | 
                      <strong> Animações:</strong> {settings.appearance.animations ? 'Ativadas' : 'Desativadas'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="sistema" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Activity className="h-5 w-5" />
                    Status do Sistema
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={checkSystemStatus}
                    disabled={isLoading}
                  >
                    <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                  </Button>
                </CardTitle>
                <CardDescription>
                  Monitore a saúde e conectividade do sistema
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-3">
                    <StatusIndicator 
                      status={systemStatus.connectivity} 
                      label="Conectividade" 
                    />
                    <StatusIndicator 
                      status={systemStatus.authentication} 
                      label="Autenticação" 
                    />
                  </div>
                  <div className="space-y-3">
                    <StatusIndicator 
                      status={systemStatus.database} 
                      label="Base de Dados" 
                    />
                    <StatusIndicator 
                      status={systemStatus.cache} 
                      label="Cache" 
                    />
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Status Geral</h4>
                      <p className="text-sm text-muted-foreground">
                        Última verificação: {new Date(systemStatus.lastCheck).toLocaleString('pt-BR')}
                      </p>
                    </div>
                    <Badge variant={
                      systemStatus.connectivity && systemStatus.database ? "default" : "destructive"
                    }>
                      {systemStatus.connectivity && systemStatus.database ? "Sistema OK" : "Sistema com Problemas"}
                    </Badge>
                  </div>

                  <div className="space-y-2">
                    <Label>Saúde do Sistema</Label>
                    <Progress 
                      value={
                        (Number(systemStatus.connectivity) + 
                         Number(systemStatus.authentication) + 
                         Number(systemStatus.database) + 
                         Number(systemStatus.cache)) * 25
                      } 
                      className="w-full"
                    />
                  </div>
                </div>

                <Separator />

                <SystemRecovery />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="advanced" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Configurações Avançadas</CardTitle>
                <CardDescription>
                  Opções para usuários avançados
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <div className="flex items-center">
                    <AlertTriangle className="h-5 w-5 text-yellow-600 mr-2" />
                    <h4 className="font-medium text-yellow-800">Atenção</h4>
                  </div>
                  <p className="text-sm text-yellow-700 mt-1">
                    As configurações desta seção podem afetar o funcionamento da plataforma. 
                    Altere apenas se souber o que está fazendo.
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Modo Desenvolvedor</Label>
                      <p className="text-sm text-muted-foreground">
                        Habilita logs detalhados e ferramentas de debug
                      </p>
                    </div>
                    <Switch
                      checked={settings.advanced.developerMode}
                      onCheckedChange={(checked) => updateSetting('advanced', 'developerMode', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Modo Debug</Label>
                      <p className="text-sm text-muted-foreground">
                        Ativa informações de depuração avançadas
                      </p>
                    </div>
                    <Switch
                      checked={settings.advanced.debugMode}
                      onCheckedChange={(checked) => updateSetting('advanced', 'debugMode', checked)}
                    />
                  </div>

                  <div>
                    <Label>Cache do Sistema</Label>
                    <p className="text-sm text-muted-foreground mb-2">
                      Limpar cache pode resolver problemas de performance
                    </p>
                    <Button variant="outline" size="sm" onClick={clearCache}>
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Limpar Cache
                    </Button>
                  </div>

                  <div>
                    <Label>Exportar Configurações</Label>
                    <p className="text-sm text-muted-foreground mb-2">
                      Fazer backup das suas configurações
                    </p>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => {
                        const blob = new Blob([JSON.stringify(settings, null, 2)], { type: 'application/json' });
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = `configuracoes_${new Date().getTime()}.json`;
                        a.click();
                        URL.revokeObjectURL(url);
                      }}
                    >
                      <FileText className="h-4 w-4 mr-2" />
                      Exportar
                    </Button>
                  </div>
                </div>

                <Separator />

                <AdminPanel />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};
