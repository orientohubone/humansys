
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useProfile } from '@/hooks/useProfile';
import { useRoleManager } from '@/hooks/useRoleManager';
import { useCredits } from '@/hooks/useCredits';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { User, Building, CreditCard, Save, Upload, Camera } from 'lucide-react';

interface TabData {
  personal: {
    full_name: string;
    position: string;
  };
  company: {
    company_name: string;
    company_cnpj: string;
  };
  credits: {
    current_credits: number;
    total_spent: number;
  };
}

const Profile = () => {
  const { user } = useAuth();
  const { profile, loading, saving, saveProfile, uploadAvatar, updateField } = useProfile();
  const { roleInfo, loading: roleLoading } = useRoleManager();
  const { credits, loading: creditsLoading, error: creditsError, refetch: refetchCredits } = useCredits(user?.id);
  const { toast } = useToast();

  // Estados para dados das abas
  const [tabData, setTabData] = useState<TabData>({
    personal: { full_name: '', position: '' },
    company: { company_name: '', company_cnpj: '' },
    credits: { current_credits: 0, total_spent: 0 }
  });

  const [activeTab, setActiveTab] = useState('personal');
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  // Carregar dados do perfil nas abas quando disponível
  useEffect(() => {
    if (profile) {
      console.log('📥 Carregando dados do perfil nas abas:', profile);
      
      setTabData({
        personal: {
          full_name: profile.full_name || '',
          position: profile.position || ''
        },
        company: {
          company_name: profile.company_name || '',
          company_cnpj: profile.company_cnpj || ''
        },
        credits: {
          current_credits: credits?.remaining_credits || 0,
          total_spent: credits?.used_credits || 0
        }
      });
    }
  }, [profile, credits]);

  // Persistir dados da aba atual no localStorage
  const persistTabData = useCallback((tab: string, data: any) => {
    if (!user?.id) return;
    
    try {
      const key = `profile_${tab}_${user.id}`;
      localStorage.setItem(key, JSON.stringify(data));
      console.log(`💾 Dados salvos para aba ${tab}:`, data);
    } catch (error) {
      console.warn('Erro ao persistir dados da aba:', error);
    }
  }, [user?.id]);

  // Carregar dados persistidos das abas
  useEffect(() => {
    if (!user?.id) return;

    try {
      const personalKey = `profile_personal_${user.id}`;
      const companyKey = `profile_company_${user.id}`;
      const creditsKey = `profile_credits_${user.id}`;

      const savedPersonal = localStorage.getItem(personalKey);
      const savedCompany = localStorage.getItem(companyKey);
      const savedCredits = localStorage.getItem(creditsKey);

      if (savedPersonal) {
        const personalData = JSON.parse(savedPersonal);
        setTabData(prev => ({ ...prev, personal: personalData }));
      }

      if (savedCompany) {
        const companyData = JSON.parse(savedCompany);
        setTabData(prev => ({ ...prev, company: companyData }));
      }

      if (savedCredits) {
        const creditsData = JSON.parse(savedCredits);
        setTabData(prev => ({ ...prev, credits: creditsData }));
      }
    } catch (error) {
      console.warn('Erro ao carregar dados persistidos:', error);
    }
  }, [user?.id]);

  // Atualizar dados da aba
  const updateTabData = useCallback((tab: keyof TabData, field: string, value: any) => {
    setTabData(prev => {
      const updated = {
        ...prev,
        [tab]: {
          ...prev[tab],
          [field]: value
        }
      };
      
      // Persistir imediatamente
      persistTabData(tab, updated[tab]);
      
      return updated;
    });
  }, [persistTabData]);

  // Salvar dados da aba atual no perfil
  const handleSaveTab = async () => {
    if (!profile) return;

    try {
      let dataToSave = {};

      switch (activeTab) {
        case 'personal':
          dataToSave = {
            full_name: tabData.personal.full_name,
            position: tabData.personal.position
          };
          break;
        case 'company':
          dataToSave = {
            company_name: tabData.company.company_name,
            company_cnpj: tabData.company.company_cnpj
          };
          break;
        case 'credits':
          // Credits são read-only por enquanto
          return;
      }

      console.log(`💾 Salvando dados da aba ${activeTab}:`, dataToSave);
      
      await saveProfile(dataToSave);
      
      toast({
        title: "Sucesso",
        description: "Dados salvos com sucesso!",
        variant: "default"
      });

    } catch (error: any) {
      console.error('❌ Erro ao salvar:', error);
      toast({
        title: "Erro",
        description: error.message || "Não foi possível salvar os dados",
        variant: "destructive"
      });
    }
  };

  // Upload de avatar
  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setAvatarFile(file);
    setUploading(true);

    try {
      const avatarUrl = await uploadAvatar(file);
      
      if (avatarUrl) {
        toast({
          title: "Sucesso",
          description: "Avatar atualizado com sucesso!",
          variant: "default"
        });
      }
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message || "Não foi possível fazer upload da imagem",
        variant: "destructive"
      });
    } finally {
      setUploading(false);
      setAvatarFile(null);
    }
  };

  // Renderizar badge do role
  const renderRoleTag = useMemo(() => {
    if (roleLoading || !roleInfo) {
      return <Skeleton className="h-6 w-20" />;
    }

    return (
      <Badge 
        variant="secondary" 
        className={`${roleInfo.badgeClass} font-medium text-sm px-3 py-1`}
      >
        {roleInfo.displayText}
      </Badge>
    );
  }, [roleInfo, roleLoading]);

  if (loading) {
    return (
      <div className="container mx-auto p-6 space-y-6">
        <div className="grid gap-6">
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-96 w-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header do Perfil */}
      <Card>
        <CardHeader className="pb-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="relative">
              <Avatar className="h-24 w-24">
                <AvatarImage 
                  src={profile?.avatar_url} 
                  alt={profile?.full_name || 'Avatar'} 
                />
                <AvatarFallback className="text-2xl">
                  {profile?.full_name?.charAt(0) || user?.email?.charAt(0) || 'U'}
                </AvatarFallback>
              </Avatar>
              
              <label 
                htmlFor="avatar-upload" 
                className="absolute bottom-0 right-0 p-2 bg-primary text-primary-foreground rounded-full cursor-pointer hover:bg-primary/90 transition-colors"
              >
                <Camera className="h-4 w-4" />
                <input
                  id="avatar-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarUpload}
                  className="hidden"
                />
              </label>
              
              {uploading && (
                <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                </div>
              )}
            </div>

            <div className="flex-1 space-y-2">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                <h1 className="text-2xl font-bold">
                  {profile?.full_name || 'Nome não informado'}
                </h1>
                {renderRoleTag}
              </div>
              
              <p className="text-muted-foreground">
                {profile?.email || user?.email}
              </p>
              
              {profile?.position && (
                <p className="text-sm text-muted-foreground">
                  {profile.position}
                </p>
              )}
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Abas do Perfil */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="personal" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            Informações Pessoais
          </TabsTrigger>
          <TabsTrigger value="company" className="flex items-center gap-2">
            <Building className="h-4 w-4" />
            Empresa
          </TabsTrigger>
          <TabsTrigger value="credits" className="flex items-center gap-2">
            <CreditCard className="h-4 w-4" />
            Gestão de Créditos
          </TabsTrigger>
        </TabsList>

        {/* Aba Informações Pessoais */}
        <TabsContent value="personal">
          <Card>
            <CardHeader>
              <CardTitle>Informações Pessoais</CardTitle>
              <CardDescription>
                Gerencie suas informações pessoais e preferências da conta
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4">
                <div className="space-y-2">
                  <Label htmlFor="full_name">Nome Completo</Label>
                  <Input
                    id="full_name"
                    value={tabData.personal.full_name}
                    onChange={(e) => updateTabData('personal', 'full_name', e.target.value)}
                    placeholder="Digite seu nome completo"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="position">Cargo</Label>
                  <Input
                    id="position"
                    value={tabData.personal.position}
                    onChange={(e) => updateTabData('personal', 'position', e.target.value)}
                    placeholder="Digite seu cargo"
                  />
                </div>
              </div>

              <Separator />

              <div className="flex justify-end">
                <Button 
                  onClick={handleSaveTab}
                  disabled={saving}
                  className="min-w-[120px]"
                >
                  {saving ? (
                    <div className="flex items-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Salvando...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Save className="h-4 w-4" />
                      Salvar Alterações
                    </div>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Aba Empresa */}
        <TabsContent value="company">
          <Card>
            <CardHeader>
              <CardTitle>Informações da Empresa</CardTitle>
              <CardDescription>
                Dados da sua empresa ou organização
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4">
                <div className="space-y-2">
                  <Label htmlFor="company_name">Nome da Empresa</Label>
                  <Input
                    id="company_name"
                    value={tabData.company.company_name}
                    onChange={(e) => updateTabData('company', 'company_name', e.target.value)}
                    placeholder="Digite o nome da empresa"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="company_cnpj">CNPJ</Label>
                  <Input
                    id="company_cnpj"
                    value={tabData.company.company_cnpj}
                    onChange={(e) => updateTabData('company', 'company_cnpj', e.target.value)}
                    placeholder="00.000.000/0001-00"
                  />
                </div>
              </div>

              <Separator />

              <div className="flex justify-end">
                <Button 
                  onClick={handleSaveTab}
                  disabled={saving}
                  className="min-w-[120px]"
                >
                  {saving ? (
                    <div className="flex items-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Salvando...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Save className="h-4 w-4" />
                      Salvar Alterações
                    </div>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Aba Créditos */}
        <TabsContent value="credits">
          <Card>
            <CardHeader>
              <CardTitle>Gestão de Créditos</CardTitle>
              <CardDescription>
                Visualize e gerencie seus créditos e histórico de uso
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Créditos Disponíveis</p>
                        <p className="text-3xl font-bold text-green-600">
                          {creditsLoading ? '...' : (credits?.remaining_credits || 0)}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {credits?.plan_type || 'trial'} | Total: {credits?.total_credits || 0}
                        </p>
                      </div>
                      <CreditCard className="h-8 w-8 text-green-600" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Créditos Utilizados</p>
                        <p className="text-3xl font-bold text-blue-600">
                          {creditsLoading ? '...' : (credits?.used_credits || 0)}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Última atualização: {credits?.updated_at ? new Date(credits.updated_at).toLocaleDateString() : 'N/A'}
                        </p>
                      </div>
                      <CreditCard className="h-8 w-8 text-blue-600" />
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Separator />

              {creditsError && (
                <div className="text-center text-red-600 bg-red-50 p-4 rounded">
                  <p className="font-medium">Erro ao carregar créditos</p>
                  <p className="text-sm">{creditsError}</p>
                  <Button 
                    onClick={refetchCredits}
                    variant="outline" 
                    size="sm" 
                    className="mt-2"
                  >
                    Tentar Novamente
                  </Button>
                </div>
              )}

              {!creditsError && credits && (
                <div className="space-y-4">
                  <div className="bg-blue-50 p-4 rounded border">
                    <h4 className="font-medium text-blue-900 mb-2">Informações do Plano</h4>
                    <div className="text-sm text-blue-700 space-y-1">
                      <p>• Plano: <strong>{credits.plan_type.toUpperCase()}</strong></p>
                      <p>• Créditos totais: <strong>{credits.total_credits}</strong></p>
                      <p>• Créditos restantes: <strong>{credits.remaining_credits}</strong></p>
                      <p>• Porcentagem utilizada: <strong>{Math.round((credits.used_credits / credits.total_credits) * 100)}%</strong></p>
                    </div>
                  </div>

                  <div className="text-center">
                    <Button 
                      onClick={refetchCredits}
                      variant="outline"
                      disabled={creditsLoading}
                    >
                      {creditsLoading ? 'Atualizando...' : 'Atualizar Dados de Créditos'}
                    </Button>
                  </div>
                </div>
              )}

              {!creditsError && !credits && !creditsLoading && (
                <div className="text-center text-muted-foreground">
                  <p>Nenhum dado de créditos encontrado</p>
                  <Button 
                    onClick={refetchCredits}
                    variant="outline" 
                    className="mt-2"
                  >
                    Inicializar Créditos
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Profile;
