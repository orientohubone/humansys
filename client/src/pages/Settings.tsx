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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { useToast } from '@/hooks/use-toast';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
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
  WifiOff,
  Brain,
  Building2,
  Globe,
  Target,
  Users2,
  TrendingUp
} from 'lucide-react';
import { CreditsCard } from '@/components/dashboard/CreditsCard';
import { useCredits } from '@/hooks/useCredits';
import { OpenAIConfig } from '@/components/settings/OpenAIConfig';
import { UserManagementDialog } from '@/components/settings/UserManagementDialog';

export const Settings = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { setTheme } = useTheme();
  const navigate = useNavigate();
  const { credits, updateCredits } = useCredits();
  const [searchParams] = useSearchParams();
  const tabFromUrl = searchParams.get('tab');

  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showUserManagement, setShowUserManagement] = useState(false);
  const [activeTab, setActiveTab] = useState(tabFromUrl || "profile");
  const [businessContext, setBusinessContext] = useState({
    company_industry: '',
    company_size: '',
    company_culture: '',
    business_goals: '',
    target_audience: '',
    core_values: '',
    organizational_structure: '',
    communication_style: '',
    management_approach: '',
    performance_metrics: '',
    training_priorities: '',
    compliance_requirements: '',
    technology_stack: '',
    market_position: '',
    competitive_advantages: '',
    growth_stage: '',
    geographical_presence: '',
    language_preferences: 'pt-BR'
  });
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
    loadBusinessContext();
  }, []);

  // Aplicar tema quando muda
  useEffect(() => {
    applyTheme(settings.appearance.theme);
  }, [settings.appearance.theme]);

  const applyTheme = (theme: string) => {
    const html = document.documentElement;
    
    if (theme === 'dark') {
      html.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else if (theme === 'light') {
      html.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    } else {
      // system
      if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        html.classList.add('dark');
      } else {
        html.classList.remove('dark');
      }
      localStorage.setItem('theme', 'system');
    }
    
    // Atualizar o ThemeContext para refletir na Header
    setTheme(theme as 'light' | 'dark' | 'auto');
  };

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
      // Mock system check since we don't have supabase
      const connectivity = true;
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

      // Aplicar tema imediatamente
      applyTheme(settings.appearance.theme);

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

  // Load business context for the current user
  const loadBusinessContext = async () => {
    if (!user?.id) return;
    
    try {
      const response = await fetch(`/api/business-context/${user.id}`);
      if (response.ok) {
        const result = await response.json();
        if (result.success && result.data) {
          setBusinessContext(result.data);
        }
      }
    } catch (error) {
      console.error('Error loading business context:', error);
    }
  };

  // Save business context
  const saveBusinessContext = async () => {
    if (!user?.id) return;
    
    setIsSaving(true);
    try {
      const contextData = {
        ...businessContext,
        user_id: user.id
      };

      // Try to update first, if not found, create new
      let response = await fetch(`/api/business-context/${user.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(contextData),
      });

      if (!response.ok && response.status === 404) {
        // Create new context if not found
        response = await fetch('/api/business-context', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(contextData),
        });
      }

      if (response.ok) {
        toast({
          title: "Contexto salvo",
          description: "O contexto empresarial foi salvo com sucesso. O BrainSys IAO está agora calibrado.",
        });
      } else {
        throw new Error('Failed to save context');
      }
    } catch (error) {
      console.error('Error saving business context:', error);
      toast({
        title: "Erro ao salvar",
        description: "Não foi possível salvar o contexto empresarial.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
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

  const handleNewUser = () => {
    setShowUserManagement(true);
    toast({
      title: "Gerenciamento de Usuários",
      description: "Abrindo painel para criar novo usuário.",
    });
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
      <div className="space-y-4 xs:space-y-6">
        <div className="flex flex-col xs:flex-row xs:items-center xs:justify-between gap-3 xs:gap-4">
          <div>
            <h1 className="text-2xl xs:text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">Configurações</h1>
            <p className="text-xs xs:text-sm text-muted-foreground mt-1">
              Gerencie suas preferências e configurações
            </p>
          </div>
          <Button 
            onClick={handleSaveSettings} 
            disabled={isSaving}
            className="text-xs xs:text-sm w-full xs:w-auto whitespace-nowrap bg-gradient-to-r from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-700"
          >
            <Save className="h-3 xs:h-4 w-3 xs:w-4 mr-1 xs:mr-2" />
            <span className="hidden xs:inline">{isSaving ? 'Salvando...' : 'Salvar Configurações'}</span>
            <span className="xs:hidden">{isSaving ? 'Salvando' : 'Salvar'}</span>
          </Button>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-3 xs:space-y-6 w-full">
          {/* Mobile: Select Dropdown */}
          <div className="sm:hidden">
            <Select value={activeTab} onValueChange={setActiveTab}>
              <SelectTrigger className="w-full h-12 text-sm dark:bg-gray-800 dark:border-gray-700 dark:text-white">
                <SelectValue placeholder="Selecione uma aba" />
              </SelectTrigger>
              <SelectContent className="dark:bg-gray-800 dark:border-gray-700">
                <SelectItem value="profile" className="text-sm py-2">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Perfil
                  </div>
                </SelectItem>
                <SelectItem value="business-context" className="text-sm py-2">
                  <div className="flex items-center gap-2">
                    <Building2 className="h-4 w-4" />
                    Contexto
                  </div>
                </SelectItem>
                <SelectItem value="openai" className="text-sm py-2">
                  <div className="flex items-center gap-2">
                    <Brain className="h-4 w-4" />
                    OpenAI
                  </div>
                </SelectItem>
                <SelectItem value="notifications" className="text-sm py-2">
                  <div className="flex items-center gap-2">
                    <Bell className="h-4 w-4" />
                    Notificações
                  </div>
                </SelectItem>
                <SelectItem value="privacy" className="text-sm py-2">
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4" />
                    Privacidade
                  </div>
                </SelectItem>
                <SelectItem value="appearance" className="text-sm py-2">
                  <div className="flex items-center gap-2">
                    <Palette className="h-4 w-4" />
                    Aparência
                  </div>
                </SelectItem>
                <SelectItem value="sistema" className="text-sm py-2">
                  <div className="flex items-center gap-2">
                    <Activity className="h-4 w-4" />
                    Sistema
                  </div>
                </SelectItem>
                <SelectItem value="advanced" className="text-sm py-2">
                  <div className="flex items-center gap-2">
                    <SettingsIcon className="h-4 w-4" />
                    Avançado
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Desktop: Horizontal Tabs */}
          <TabsList className="hidden sm:flex w-full gap-1 p-1 bg-gray-100 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
            <TabsTrigger value="profile" className="flex items-center gap-2 text-sm px-4 py-3 whitespace-nowrap dark:text-white data-[state=active]:dark:bg-gray-700 rounded-md">
              <User className="h-4 w-4" />
              <span className="font-medium">Perfil</span>
            </TabsTrigger>
            <TabsTrigger value="business-context" className="flex items-center gap-2 text-sm px-4 py-3 whitespace-nowrap dark:text-white data-[state=active]:dark:bg-gray-700 rounded-md">
              <Building2 className="h-4 w-4" />
              <span className="font-medium">Contexto</span>
            </TabsTrigger>
            <TabsTrigger value="openai" className="flex items-center gap-2 text-sm px-4 py-3 whitespace-nowrap dark:text-white data-[state=active]:dark:bg-gray-700 rounded-md">
              <Brain className="h-4 w-4" />
              <span className="font-medium">OpenAI</span>
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center gap-2 text-sm px-4 py-3 whitespace-nowrap dark:text-white data-[state=active]:dark:bg-gray-700 rounded-md">
              <Bell className="h-4 w-4" />
              <span className="font-medium">Notificações</span>
            </TabsTrigger>
            <TabsTrigger value="privacy" className="flex items-center gap-2 text-sm px-4 py-3 whitespace-nowrap dark:text-white data-[state=active]:dark:bg-gray-700 rounded-md">
              <Shield className="h-4 w-4" />
              <span className="font-medium">Privacidade</span>
            </TabsTrigger>
            <TabsTrigger value="appearance" className="flex items-center gap-2 text-sm px-4 py-3 whitespace-nowrap dark:text-white data-[state=active]:dark:bg-gray-700 rounded-md">
              <Palette className="h-4 w-4" />
              <span className="font-medium">Aparência</span>
            </TabsTrigger>
            <TabsTrigger value="sistema" className="flex items-center gap-2 text-sm px-4 py-3 whitespace-nowrap dark:text-white data-[state=active]:dark:bg-gray-700 rounded-md">
              <Activity className="h-4 w-4" />
              <span className="font-medium">Sistema</span>
            </TabsTrigger>
            <TabsTrigger value="advanced" className="flex items-center gap-2 text-sm px-4 py-3 whitespace-nowrap dark:text-white data-[state=active]:dark:bg-gray-700 rounded-md">
              <SettingsIcon className="h-4 w-4" />
              <span className="font-medium">Avançado</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="space-y-3 xs:space-y-6">
            <Card className="dark:bg-gray-800 dark:border-gray-700">
              <CardHeader className="pb-2 xs:pb-6">
                <CardTitle className="text-base xs:text-lg text-gray-900 dark:text-white">Perfil do Usuário</CardTitle>
                <CardDescription className="text-xs xs:text-sm">
                  Acesse sua página de perfil completa
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2 xs:space-y-4 px-3 xs:px-6 py-3 xs:py-6">
                <div className="text-center py-4 xs:py-8">
                  <User className="h-8 xs:h-12 w-8 xs:w-12 mx-auto text-muted-foreground mb-2 xs:mb-4" />
                  <h3 className="text-sm xs:text-lg font-medium mb-1 xs:mb-2 text-gray-900 dark:text-white">Gerencie seu Perfil</h3>
                  <p className="text-xs xs:text-sm text-muted-foreground mb-3 xs:mb-6">
                    Acesse a página completa do perfil com foto e informações.
                  </p>
                  <Button onClick={() => navigate('/app/profile')} size="sm" className="text-xs xs:text-sm w-full xs:w-auto dark:bg-blue-600">
                    <User className="h-3 xs:h-4 w-3 xs:w-4 mr-1 xs:mr-2" />
                    Ir para Perfil
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="dark:bg-gray-800 dark:border-gray-700">
              <CardHeader className="pb-2 xs:pb-6">
                <CardTitle className="flex items-center gap-2 text-base xs:text-lg text-gray-900 dark:text-white">
                  <CreditCard className="h-4 xs:h-5 w-4 xs:w-5" />
                  Gestão de Créditos
                </CardTitle>
                <CardDescription className="text-xs xs:text-sm">
                  Gerencie seus créditos para colaboradores
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 xs:space-y-6 px-3 xs:px-6 py-3 xs:py-6">
                <CreditsCard />

                <Separator className="dark:bg-gray-700" />

                <div className="space-y-2 xs:space-y-4">
                  <div className="flex flex-col xs:flex-row xs:items-center xs:justify-between gap-2 xs:gap-4">
                    <h4 className="font-medium text-sm xs:text-base text-gray-900 dark:text-white">Cadastro de Usuários</h4>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={handleNewUser}
                      className="text-xs xs:text-sm w-full xs:w-auto bg-blue-50 dark:bg-gray-700 hover:bg-blue-100 dark:hover:bg-gray-600 border-blue-200 dark:border-gray-600 text-blue-700 dark:text-blue-400"
                    >
                      <User className="h-3 xs:h-4 w-3 xs:w-4 mr-1 xs:mr-2" />
                      Novo Usuário
                    </Button>
                  </div>
                  <p className="text-xs xs:text-sm text-muted-foreground">
                    Cadastre novos usuários usando seus créditos disponíveis
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="business-context" className="space-y-3 xs:space-y-6">
            <Card className="dark:bg-gray-800 dark:border-gray-700">
              <CardHeader className="pb-2 xs:pb-6">
                <CardTitle className="flex items-center gap-2 text-base xs:text-lg text-gray-900 dark:text-white">
                  <Building2 className="h-4 xs:h-5 w-4 xs:w-5" />
                  Contexto Empresarial
                </CardTitle>
                <CardDescription className="text-xs xs:text-sm">
                  Configure o contexto da sua empresa para calibrar o BrainSys IAO
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 xs:space-y-6 px-3 xs:px-6 py-3 xs:py-6">
                <div className="grid gap-2 xs:gap-3 sm:gap-4 md:gap-6 grid-cols-1 xs:grid-cols-2">
                  <div className="space-y-1 xs:space-y-2">
                    <Label htmlFor="company_industry" className="text-xs xs:text-sm font-medium text-gray-900 dark:text-white">Setor da Empresa</Label>
                    <Input
                      id="company_industry"
                      placeholder="Ex: Tecnologia..."
                      value={businessContext.company_industry}
                      onChange={(e) => setBusinessContext(prev => ({ ...prev, company_industry: e.target.value }))}
                      className="text-xs xs:text-sm px-2 xs:px-3 py-1.5 xs:py-2 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
                    />
                  </div>
                  
                  <div className="space-y-1 xs:space-y-2">
                    <Label htmlFor="company_size" className="text-xs xs:text-sm font-medium text-gray-900 dark:text-white">Tamanho da Empresa</Label>
                    <Input
                      id="company_size"
                      placeholder="Ex: Startup..."
                      value={businessContext.company_size}
                      onChange={(e) => setBusinessContext(prev => ({ ...prev, company_size: e.target.value }))}
                      className="text-xs xs:text-sm px-2 xs:px-3 py-1.5 xs:py-2 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
                    />
                  </div>
                  
                  <div className="space-y-1 xs:space-y-2">
                    <Label htmlFor="growth_stage" className="text-xs xs:text-sm font-medium text-gray-900 dark:text-white">Estágio de Crescimento</Label>
                    <Input
                      id="growth_stage"
                      placeholder="Ex: Seed..."
                      value={businessContext.growth_stage}
                      onChange={(e) => setBusinessContext(prev => ({ ...prev, growth_stage: e.target.value }))}
                      className="text-xs xs:text-sm px-2 xs:px-3 py-1.5 xs:py-2 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
                    />
                  </div>
                  
                  <div className="space-y-1 xs:space-y-2">
                    <Label htmlFor="geographical_presence" className="text-xs xs:text-sm font-medium text-gray-900 dark:text-white">Presença Geográfica</Label>
                    <Input
                      id="geographical_presence"
                      placeholder="Ex: Local..."
                      value={businessContext.geographical_presence}
                      onChange={(e) => setBusinessContext(prev => ({ ...prev, geographical_presence: e.target.value }))}
                      className="text-xs xs:text-sm px-2 xs:px-3 py-1.5 xs:py-2 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
                    />
                  </div>
                </div>

                <Separator className="dark:bg-gray-700" />

                <div className="space-y-2 xs:space-y-4">
                  <div className="flex items-center gap-2 mb-2 xs:mb-4">
                    <Target className="h-4 xs:h-5 w-4 xs:w-5 text-blue-500" />
                    <h3 className="text-sm xs:text-lg font-semibold text-gray-900 dark:text-white">Objetivos e Valores</h3>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="business_goals">Objetivos do Negócio</Label>
                    <textarea
                      id="business_goals"
                      className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      placeholder="Descreva os principais objetivos e metas da empresa..."
                      value={businessContext.business_goals}
                      onChange={(e) => setBusinessContext(prev => ({ ...prev, business_goals: e.target.value }))}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="core_values">Valores Fundamentais</Label>
                    <textarea
                      id="core_values"
                      className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      placeholder="Liste os valores principais da empresa..."
                      value={businessContext.core_values}
                      onChange={(e) => setBusinessContext(prev => ({ ...prev, core_values: e.target.value }))}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="company_culture">Cultura da Empresa</Label>
                    <textarea
                      id="company_culture"
                      className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      placeholder="Descreva a cultura organizacional..."
                      value={businessContext.company_culture}
                      onChange={(e) => setBusinessContext(prev => ({ ...prev, company_culture: e.target.value }))}
                    />
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <div className="flex items-center gap-2 mb-4">
                    <Users2 className="h-5 w-5 text-green-500" />
                    <h3 className="text-lg font-semibold">Estrutura e Gestão</h3>
                  </div>
                  
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="communication_style">Estilo de Comunicação</Label>
                      <Input
                        id="communication_style"
                        placeholder="Ex: Formal, Informal, Direto..."
                        value={businessContext.communication_style}
                        onChange={(e) => setBusinessContext(prev => ({ ...prev, communication_style: e.target.value }))}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="management_approach">Abordagem de Gestão</Label>
                      <Input
                        id="management_approach"
                        placeholder="Ex: Hierárquica, Horizontal, Ágil..."
                        value={businessContext.management_approach}
                        onChange={(e) => setBusinessContext(prev => ({ ...prev, management_approach: e.target.value }))}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="organizational_structure">Estrutura Organizacional</Label>
                    <textarea
                      id="organizational_structure"
                      className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      placeholder="Descreva como a empresa está organizada..."
                      value={businessContext.organizational_structure}
                      onChange={(e) => setBusinessContext(prev => ({ ...prev, organizational_structure: e.target.value }))}
                    />
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <div className="flex items-center gap-2 mb-4">
                    <TrendingUp className="h-5 w-5 text-purple-500" />
                    <h3 className="text-lg font-semibold">Performance e Mercado</h3>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="performance_metrics">Métricas de Performance</Label>
                    <textarea
                      id="performance_metrics"
                      className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      placeholder="Principais KPIs e métricas utilizadas..."
                      value={businessContext.performance_metrics}
                      onChange={(e) => setBusinessContext(prev => ({ ...prev, performance_metrics: e.target.value }))}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="market_position">Posição no Mercado</Label>
                    <textarea
                      id="market_position"
                      className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      placeholder="Como a empresa se posiciona no mercado..."
                      value={businessContext.market_position}
                      onChange={(e) => setBusinessContext(prev => ({ ...prev, market_position: e.target.value }))}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="competitive_advantages">Vantagens Competitivas</Label>
                    <textarea
                      id="competitive_advantages"
                      className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      placeholder="Principais diferenciais competitivos..."
                      value={businessContext.competitive_advantages}
                      onChange={(e) => setBusinessContext(prev => ({ ...prev, competitive_advantages: e.target.value }))}
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-4">
                  <Button
                    onClick={saveBusinessContext}
                    disabled={isSaving}
                    className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    {isSaving ? 'Salvando...' : 'Salvar Contexto'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="openai" className="space-y-6">
            <OpenAIConfig />
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
                        Notificações do sistema operacional
                      </p>
                    </div>
                    <Switch
                      checked={settings.notifications.desktop}
                      onCheckedChange={(checked) => updateSetting('notifications', 'desktop', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Marketing</h4>
                      <p className="text-sm text-muted-foreground">
                        Receber emails promocionais e novidades
                      </p>
                    </div>
                    <Switch
                      checked={settings.notifications.marketing}
                      onCheckedChange={(checked) => updateSetting('notifications', 'marketing', checked)}
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
                  Controle como seus dados são usados e compartilhados
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Perfil Visível</h4>
                      <p className="text-sm text-muted-foreground">
                        Permitir que outros usuários vejam seu perfil
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
                        Permitir coleta de dados de uso para melhorias
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
                        Permitir coleta de dados para análise
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
                  <h4 className="font-medium">Exportação de Dados</h4>
                  <p className="text-sm text-muted-foreground">
                    Baixe uma cópia de todos os seus dados
                  </p>
                  <Button
                    variant="outline"
                    onClick={handleExportData}
                    disabled={isLoading}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    {isLoading ? 'Exportando...' : 'Exportar Dados'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="appearance" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Aparência</CardTitle>
                <CardDescription>
                  Personalize a aparência da interface
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Tema</h4>
                    <div className="grid grid-cols-3 gap-2">
                      {['system', 'light', 'dark'].map((theme) => (
                        <Button
                          key={theme}
                          variant={settings.appearance.theme === theme ? "default" : "outline"}
                          onClick={() => updateSetting('appearance', 'theme', theme)}
                          className="capitalize"
                        >
                          {theme === 'system' ? 'Sistema' : theme === 'light' ? 'Claro' : 'Escuro'}
                        </Button>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Modo Compacto</h4>
                      <p className="text-sm text-muted-foreground">
                        Interface mais condensada
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
                        Ativar animações da interface
                      </p>
                    </div>
                    <Switch
                      checked={settings.appearance.animations}
                      onCheckedChange={(checked) => updateSetting('appearance', 'animations', checked)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="sistema" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Status do Sistema</CardTitle>
                <CardDescription>
                  Monitore o status dos serviços e conexões
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <StatusIndicator status={systemStatus.connectivity} label="Conectividade" />
                  <StatusIndicator status={systemStatus.authentication} label="Autenticação" />
                  <StatusIndicator status={systemStatus.database} label="Banco de Dados" />
                  <StatusIndicator status={systemStatus.cache} label="Cache" />
                </div>

                <div className="text-xs text-muted-foreground">
                  Última verificação: {new Date(systemStatus.lastCheck).toLocaleString()}
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={checkSystemStatus}
                    size="sm"
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Verificar Status
                  </Button>
                  <Button
                    variant="outline"
                    onClick={clearCache}
                    size="sm"
                  >
                    <Database className="h-4 w-4 mr-2" />
                    Limpar Cache
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="advanced" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Configurações Avançadas</CardTitle>
                <CardDescription>
                  Configurações para usuários avançados
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Modo Desenvolvedor</h4>
                      <p className="text-sm text-muted-foreground">
                        Ativar ferramentas de desenvolvimento
                      </p>
                    </div>
                    <Switch
                      checked={settings.advanced.developerMode}
                      onCheckedChange={(checked) => updateSetting('advanced', 'developerMode', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Modo Debug</h4>
                      <p className="text-sm text-muted-foreground">
                        Mostrar informações de debug
                      </p>
                    </div>
                    <Switch
                      checked={settings.advanced.debugMode}
                      onCheckedChange={(checked) => updateSetting('advanced', 'debugMode', checked)}
                    />
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <div className="p-4 border border-destructive/20 rounded-lg bg-destructive/5">
                    <h4 className="font-medium text-destructive mb-2">Zona de Perigo</h4>
                    <p className="text-sm text-muted-foreground mb-4">
                      Ações irreversíveis que afetam permanentemente sua conta
                    </p>
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
        </Tabs>

        {/* User Management Dialog */}
        <UserManagementDialog
          open={showUserManagement}
          onOpenChange={setShowUserManagement}
        />
      </div>
    </DashboardLayout>
  );
};