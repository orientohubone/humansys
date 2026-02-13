import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Users, UserPlus, Search, Filter, Mail, Phone, MapPin, AlertCircle, RefreshCw } from 'lucide-react';
import { useCollaborators } from '@/hooks/useCollaborators';
import { CollaboratorActions } from '@/components/collaborators/CollaboratorActions';
import { ConnectionStatus } from '@/components/feedback/ConnectionStatus';
import { ConnectionDiagnostic } from '@/components/debug/ConnectionDiagnostic';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

export const Collaborators = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddingCollaborator, setIsAddingCollaborator] = useState(false);
  const { collaborators, isLoading, error, createCollaborator, refetch } = useCollaborators();
  const { toast } = useToast();
  const { user } = useAuth();

  // Debug info para entender o problema
  useEffect(() => {
    console.log('Collaborators Component Debug:', {
      userId: user?.id,
      userEmail: user?.email,
      collaboratorsCount: collaborators.length,
      isLoading,
      error,
      collaboratorsData: collaborators
    });
  }, [user, collaborators, isLoading, error]);

  // Auto-refresh a cada 30 segundos para garantir dados atualizados
  useEffect(() => {
    const interval = setInterval(() => {
      if (user?.id && !isLoading) {
        console.log('Auto-refresh colaboradores...');
        refetch();
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [user?.id, isLoading, refetch]);

  // Força carregamento inicial quando usuário for autenticado
  useEffect(() => {
    if (user?.id && !isLoading && collaborators.length === 0 && !error) {
      console.log('Forçando carregamento inicial dos colaboradores...');
      setTimeout(() => refetch(), 100);
    }
  }, [user?.id, collaborators.length, isLoading, error, refetch]);

  const [newCollaborator, setNewCollaborator] = useState({
    name: '',
    email: '',
    role: '',
    department: '',
    phone: '',
    location: ''
  });

  const handleAddCollaborator = async () => {
    // Prevenir submissão dupla
    if (isLoading) {
      console.log('⏳ Processo já em andamento, aguarde...');
      return;
    }

    // Validação mais robusta dos campos obrigatórios
    if (!newCollaborator.name?.trim()) {
      toast({
        title: "❌ Campo obrigatório",
        description: "O nome é obrigatório.",
        variant: "destructive"
      });
      return;
    }

    if (!newCollaborator.email?.trim()) {
      toast({
        title: "❌ Campo obrigatório", 
        description: "O email é obrigatório.",
        variant: "destructive"
      });
      return;
    }

    // Validar formato do email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newCollaborator.email.trim())) {
      toast({
        title: "❌ Email inválido",
        description: "Por favor, insira um email válido.",
        variant: "destructive"
      });
      return;
    }

    if (!newCollaborator.role?.trim()) {
      toast({
        title: "❌ Campo obrigatório",
        description: "O cargo é obrigatório.",
        variant: "destructive"
      });
      return;
    }

    if (!newCollaborator.department?.trim()) {
      toast({
        title: "❌ Campo obrigatório",
        description: "O departamento é obrigatório.",
        variant: "destructive"
      });
      return;
    }

    console.log('🚀 Iniciando processo de criação de colaborador...');
    console.log('👤 Usuário logado:', user?.email);
    console.log('📊 Estado atual - Colaboradores:', collaborators.length);

    const collaboratorData = {
      name: newCollaborator.name.trim(),
      email: newCollaborator.email.trim().toLowerCase(),
      role: newCollaborator.role.trim(),
      department: newCollaborator.department.trim(),
      phone: newCollaborator.phone?.trim() || undefined,
      location: newCollaborator.location?.trim() || undefined,
      status: 'active' as const
    };

    console.log('📝 Dados do colaborador a serem enviados:', collaboratorData);

    try {
      // Mostrar feedback visual imediato
      toast({
        title: "⏳ Processando...",
        description: "Criando colaborador, aguarde...",
      });

      const result = await createCollaborator(collaboratorData);

      if (result) {
        console.log('✅ Colaborador criado com sucesso:', result);

        // Resetar formulário
        setNewCollaborator({
          name: '',
          email: '',
          role: '',
          department: '',
          phone: '',
          location: ''
        });

        // Fechar modal
        setIsAddingCollaborator(false);

        toast({
          title: "🎉 Colaborador adicionado!",
          description: `${result.name} foi cadastrado com sucesso.`,
          duration: 4000
        });

        // A lista será atualizada automaticamente pelo hook
        console.log('✅ Processo concluído com sucesso');
      } else {
        console.error('❌ Falha na criação do colaborador - resultado nulo');
        toast({
          title: "❌ Erro",
          description: "Não foi possível criar o colaborador. Verifique os dados e tente novamente.",
          variant: "destructive"
        });
      }
    } catch (error: any) {
      console.error('🚨 Erro no processo de criação:', error);
      
      let errorMessage = "Falha no sistema. Tente novamente em alguns segundos.";
      
      if (error.message) {
        if (error.message.includes('duplicate') || error.message.includes('unique')) {
          errorMessage = "Já existe um colaborador com este email.";
        } else if (error.message.includes('permission') || error.message.includes('policy')) {
          errorMessage = "Você não tem permissão para criar colaboradores.";
        } else if (error.message.includes('network') || error.message.includes('fetch')) {
          errorMessage = "Erro de conexão. Verifique sua internet e tente novamente.";
        } else if (error.message.includes('credits') || error.message.includes('crédito')) {
          errorMessage = error.message;
        }
      }

      toast({
        title: "❌ Erro ao criar colaborador",
        description: errorMessage,
        variant: "destructive"
      });
    }
  };

  const handleStatsClick = (type: string) => {
    const filteredByStatus = collaborators.filter(c => {
      switch (type) {
        case 'active':
          return c.status === 'active';
        case 'vacation':
          return c.status === 'vacation';
        case 'inactive':
          return c.status === 'inactive';
        default:
          return true;
      }
    });

    toast({
      title: `Colaboradores ${type}`,
      description: `${filteredByStatus.length} colaboradores encontrados`
    });
  };

  const handleRetry = () => {
    console.log('Manual retry triggered by user:', user?.email);
    toast({
      title: "Tentando novamente",
      description: "Recarregando dados..."
    });

    // Força um refresh completo
    setTimeout(() => {
      refetch();
    }, 100);
  };

  const handleForceRefresh = () => {
    console.log('Force refresh triggered for user:', user?.email);
    toast({
      title: "Atualizando dados",
      description: "Forçando recarregamento completo..."
    });

    // Limpa o cache e força um novo carregamento
    window.location.reload();
  };

  const filteredCollaborators = collaborators.filter(collaborator =>
    collaborator.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    collaborator.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    collaborator.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
    collaborator.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'inactive': return 'bg-red-500';
      case 'vacation': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'Ativo';
      case 'inactive': return 'Inativo';
      case 'vacation': return 'Férias';
      default: return 'Desconhecido';
    }
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center h-64 space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <p className="text-muted-foreground">Carregando colaboradores...</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header com Status de Conexão */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Colaboradores</h1>
            <p className="text-muted-foreground">
              Gerencie todos os colaboradores da empresa ({collaborators.length} encontrados)
            </p>
            {process.env.NODE_ENV === 'development' && (
              <div className="text-xs text-blue-600 mt-1 space-y-1">
                <p>Debug Info:</p>
                <p>• User ID: {user?.id}</p>
                <p>• User Email: {user?.email}</p>
                <p>• Colaboradores: {collaborators.length}</p>
                <p>• Loading: {isLoading.toString()}</p>
                <p>• Error: {error || 'none'}</p>
                <p>• Last Update: {new Date().toLocaleTimeString()}</p>
              </div>
            )}
          </div>

          <div className="flex items-center space-x-4">
            <ConnectionStatus />
            <div className="flex space-x-2">
              <Button 
                variant="outline" 
                onClick={handleRetry}
                size="sm"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Atualizar
              </Button>
              <Button 
                variant="outline" 
                onClick={handleForceRefresh}
                size="sm"
                className="text-orange-600 hover:text-orange-700"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Força Reset
              </Button>
            </div>
            <Dialog open={isAddingCollaborator} onOpenChange={setIsAddingCollaborator}>
              <DialogTrigger asChild>
                <Button className="bg-green-600 hover:bg-green-700 text-white">
                  <UserPlus className="mr-2 h-4 w-4" />
                  Novo Colaborador
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Adicionar Novo Colaborador</DialogTitle>
                  <DialogDescription>
                    Preencha as informações do novo colaborador
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="name">Nome Completo *</Label>
                    <Input 
                      id="name" 
                      placeholder="Digite o nome completo"
                      value={newCollaborator.name}
                      onChange={(e) => setNewCollaborator(prev => ({...prev, name: e.target.value}))}
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="email">Email *</Label>
                    <Input 
                      id="email" 
                      type="email" 
                      placeholder="Digite o email"
                      value={newCollaborator.email}
                      onChange={(e) => setNewCollaborator(prev => ({...prev, email: e.target.value}))}
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="role">Cargo *</Label>
                    <Input 
                      id="role" 
                      placeholder="Digite o cargo"
                      value={newCollaborator.role}
                      onChange={(e) => setNewCollaborator(prev => ({...prev, role: e.target.value}))}
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="department">Departamento *</Label>
                    <Input 
                      id="department" 
                      placeholder="Digite o departamento"
                      value={newCollaborator.department}
                      onChange={(e) => setNewCollaborator(prev => ({...prev, department: e.target.value}))}
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="phone">Telefone</Label>
                    <Input 
                      id="phone" 
                      placeholder="Digite o telefone"
                      value={newCollaborator.phone}
                      onChange={(e) => setNewCollaborator(prev => ({...prev, phone: e.target.value}))}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="location">Localização</Label>
                    <Input 
                      id="location" 
                      placeholder="Digite a localização"
                      value={newCollaborator.location}
                      onChange={(e) => setNewCollaborator(prev => ({...prev, location: e.target.value}))}
                    />
                  </div>
                </div>
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setIsAddingCollaborator(false)}>
                    Cancelar
                  </Button>
                  <Button 
                    onClick={handleAddCollaborator}
                    disabled={isLoading}
                    className="bg-green-600 hover:bg-green-700 text-white border-green-600 hover:border-green-700 disabled:opacity-50"
                  >
                    {isLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Criando...
                      </>
                    ) : (
                      'Criar Colaborador'
                    )}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Alert de Erro */}
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="flex items-center justify-between">
              <span>{error}</span>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleRetry}
                className="ml-2"
              >
                <RefreshCw className="h-3 w-3 mr-1" />
                Tentar Novamente
              </Button>
            </AlertDescription>
          </Alert>
        )}

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => handleStatsClick('total')}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{collaborators.length}</div>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => handleStatsClick('active')}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Ativos</CardTitle>
              <div className="h-2 w-2 bg-green-500 rounded-full"></div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {collaborators.filter(c => c.status === 'active').length}
              </div>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => handleStatsClick('vacation')}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Em Férias</CardTitle>
              <div className="h-2 w-2 bg-yellow-500 rounded-full"></div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {collaborators.filter(c => c.status === 'vacation').length}
              </div>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => handleStatsClick('departments')}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Departamentos</CardTitle>
              <Filter className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {new Set(collaborators.map(c => c.department)).size}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <Card>
          <CardHeader>
            <CardTitle>Buscar Colaboradores</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <Search className="h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por nome, email, cargo ou departamento..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1"
              />
            </div>
          </CardContent>
        </Card>

        {/* Collaborators List */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredCollaborators.map((collaborator) => (
            <Card key={collaborator.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <Avatar>
                      <AvatarFallback>
                        {collaborator.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold">{collaborator.name}</h3>
                      <p className="text-sm text-muted-foreground">{collaborator.role}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className={`h-3 w-3 rounded-full ${getStatusColor(collaborator.status)}`} />
                    <CollaboratorActions 
                      collaboratorId={collaborator.id}
                      collaboratorName={collaborator.name}
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  <Badge variant="secondary">{collaborator.department}</Badge>
                  <Badge variant="outline">{getStatusText(collaborator.status)}</Badge>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex items-center text-muted-foreground">
                    <Mail className="mr-2 h-3 w-3" />
                    {collaborator.email}
                  </div>
                  {collaborator.phone && (
                    <div className="flex items-center text-muted-foreground">
                      <Phone className="mr-2 h-3 w-3" />
                      {collaborator.phone}
                    </div>
                  )}
                  {collaborator.location && (
                    <div className="flex items-center text-muted-foreground">
                      <MapPin className="mr-2 h-3 w-3" />
                      {collaborator.location}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredCollaborators.length === 0 && !error && (
          <Card>
            <CardContent className="py-8">
              <div className="text-center">
                <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">Nenhum colaborador encontrado</h3>
                <p className="text-muted-foreground mb-4">
                  {searchTerm ? 'Tente ajustar sua busca' : 'Comece adicionando seu primeiro colaborador'}
                </p>

                {process.env.NODE_ENV === 'development' && (
                  <div className="max-w-2xl mx-auto space-y-4">
                    <ConnectionDiagnostic />
                    <div className="text-xs text-left bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-semibold mb-2">Debug Info Detalhado:</h4>
                      <p>• Total colaboradores: {collaborators.length}</p>
                      <p>• Filtrados: {filteredCollaborators.length}</p>
                      <p>• Busca: "{searchTerm}"</p>
                      <p>• User ID: {user?.id}</p>
                      <p>• User Email: {user?.email}</p>
                      <p>• Loading: {isLoading.toString()}</p>
                      <p>• Error: {error || 'nenhum'}</p>
                      <p>• Auth State: {user ? 'autenticado' : 'não autenticado'}</p>
                      <p>• Hook Loaded: {typeof useCollaborators === 'function' ? 'sim' : 'não'}</p>
                      <div className="mt-2 pt-2 border-t">
                        <p className="font-semibold">Dados brutos:</p>
                        <pre className="text-xs bg-white p-2 rounded border overflow-auto max-h-32">
                          {JSON.stringify({ collaborators, user: { id: user?.id, email: user?.email } }, null, 2)}
                        </pre>
                      </div>
                    </div>
                  </div>
                )}

                {!searchTerm && (
                  <div className="space-y-2">
                    <Button 
                      onClick={() => setIsAddingCollaborator(true)}
                      className="bg-green-600 hover:bg-green-700 text-white"
                    >
                      <UserPlus className="mr-2 h-4 w-4" />
                      Adicionar Primeiro Colaborador
                    </Button>
                    <br />
                    <Button variant="outline" onClick={handleRetry} size="sm">
                      <RefreshCw className="mr-2 h-3 w-3" />
                      Verificar Novamente
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
};