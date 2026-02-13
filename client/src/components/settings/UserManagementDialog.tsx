import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Users, UserPlus, Search, Filter, Trash2, RefreshCw, AlertCircle, Wifi, WifiOff } from 'lucide-react';

interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'user' | 'founder';
  created_at: string;
  status: 'active' | 'inactive';
}

interface UserManagementDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// Robust API call utility with systematic retry and fallback
class RobustAPIClient {
  private maxRetries = 3;
  private baseDelay = 1000;

  private async delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private async makeRequest(url: string, options: RequestInit = {}): Promise<Response> {
    const defaultOptions: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Cache-Control': 'no-cache',
        'X-Requested-With': 'XMLHttpRequest',
        ...options.headers
      },
      ...options
    };

    let lastError: Error | null = null;

    for (let attempt = 1; attempt <= this.maxRetries; attempt++) {
      try {
        console.log(`🔄 API Attempt ${attempt}/${this.maxRetries}: ${options.method || 'GET'} ${url}`);

        const response = await fetch(url, defaultOptions);

        // Check if response is HTML (Vite interception detection)
        const contentType = response.headers.get('content-type') || '';

        if (contentType.includes('text/html')) {
          throw new Error('API_INTERCEPTED: Received HTML instead of JSON - Vite is intercepting API calls');
        }

        // For successful responses, return immediately
        if (response.ok) {
          console.log(`✅ API Success on attempt ${attempt}: ${response.status}`);
          return response;
        }

        // For error responses, try to parse JSON error
        let errorData: any = {};
        try {
          const text = await response.text();
          if (text) {
            errorData = JSON.parse(text);
          }
        } catch (parseError) {
          console.warn('Failed to parse error response as JSON');
        }

        const error = new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
        (error as any).status = response.status;
        (error as any).response = errorData;

        // Don't retry for client errors (4xx), except 408, 429
        if (response.status >= 400 && response.status < 500 && 
            response.status !== 408 && response.status !== 429) {
          console.error(`❌ Client error, not retrying: ${response.status}`);
          throw error;
        }

        lastError = error;

      } catch (error) {
        lastError = error as Error;
        console.warn(`⚠️ Attempt ${attempt} failed:`, lastError.message);

        // Special handling for network errors
        if (lastError.message.includes('Failed to fetch')) {
          lastError.message = 'Erro de conectividade. Verifique sua conexão com a internet.';
        }

        // Don't retry for certain errors
        if (lastError.message.includes('API_INTERCEPTED')) {
          console.error('🚨 Critical: API being intercepted by Vite');
          throw new Error('Erro de configuração do servidor. Tente recarregar a página.');
        }
      }

      // Wait before retry (exponential backoff)
      if (attempt < this.maxRetries) {
        const delay = this.baseDelay * Math.pow(2, attempt - 1);
        console.log(`⏳ Waiting ${delay}ms before retry...`);
        await this.delay(delay);
      }
    }

    throw lastError || new Error('Maximum retry attempts exceeded');
  }

  async get(url: string): Promise<any> {
    const response = await this.makeRequest(url, { method: 'GET' });
    const text = await response.text();

    if (!text.trim()) {
      throw new Error('Empty response from server');
    }

    try {
      return JSON.parse(text);
    } catch (parseError) {
      console.error('Failed to parse response as JSON:', text.substring(0, 200));
      throw new Error('Invalid JSON response from server');
    }
  }

  async post(url: string, data: any): Promise<any> {
    const response = await this.makeRequest(url, {
      method: 'POST',
      body: JSON.stringify(data)
    });

    const text = await response.text();

    if (!text.trim()) {
      throw new Error('Empty response from server');
    }

    try {
      return JSON.parse(text);
    } catch (parseError) {
      console.error('Failed to parse response as JSON:', text.substring(0, 200));
      throw new Error('Invalid JSON response from server');
    }
  }

  async put(url: string, data: any): Promise<any> {
    const response = await this.makeRequest(url, {
      method: 'PUT',
      body: JSON.stringify(data)
    });

    const text = await response.text();

    if (!text.trim()) {
      throw new Error('Empty response from server');
    }

    try {
      return JSON.parse(text);
    } catch (parseError) {
      console.error('Failed to parse response as JSON:', text.substring(0, 200));
      throw new Error('Invalid JSON response from server');
    }
  }

  async delete(url: string): Promise<void> {
    await this.makeRequest(url, { method: 'DELETE' });
  }
}

export const UserManagementDialog = ({ open, onOpenChange }: UserManagementDialogProps) => {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'disconnected' | 'connecting'>('connecting');
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    role: 'user' as 'admin' | 'user' | 'founder'
  });
  const [showNewUserForm, setShowNewUserForm] = useState(false);
  const { toast } = useToast();
  const [editingUser, setEditingUser] = useState<User | null>(null);

  const apiClient = new RobustAPIClient();

  // Load users with robust error handling
  const loadUsers = async () => {
    setIsLoading(true);
    setConnectionStatus('connecting');

    try {
      console.log('🔄 Loading users with robust client...');
      const apiUsers = await apiClient.get('/api/users');

      console.log('✅ Users loaded successfully:', apiUsers);
      setUsers(apiUsers);
      setConnectionStatus('connected');

      toast({
        title: "Usuários carregados",
        description: `${apiUsers.length} usuários encontrados no sistema.`,
        variant: "default"
      });

    } catch (error: any) {
      console.error('❌ Erro ao carregar usuários:', error);
      setConnectionStatus('disconnected');
      setUsers([]);

      let errorMessage = 'Não foi possível carregar os usuários.';

      if (error.message.includes('conectividade') || error.message.includes('Failed to fetch')) {
        errorMessage = 'Erro de conectividade. Verifique sua conexão e tente novamente.';
      } else if (error.message.includes('configuração do servidor')) {
        errorMessage = 'Erro de configuração do servidor. Tente recarregar a página.';
      } else if (error.status === 500) {
        errorMessage = 'Erro interno do servidor. Tente novamente em alguns instantes.';
      }

      toast({
        title: "Erro de conexão",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Create user with robust error handling
  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newUser.name || !newUser.email) {
      toast({
        title: "Erro",
        description: "Por favor, preencha todos os campos",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);

    try {
      console.log('🔄 Creating user with robust client:', newUser);

      const responseData = await apiClient.post('/api/users', {
        name: newUser.name,
        email: newUser.email,
        role: newUser.role
      });

      console.log('✅ User created successfully:', responseData);

      const user: User = {
        id: responseData.id,
        name: responseData.name,
        email: responseData.email,
        role: responseData.role,
        created_at: responseData.created_at,
        status: responseData.status
      };

      setUsers(prev => [user, ...prev]);
      setNewUser({ name: '', email: '', role: 'user' });
      setShowNewUserForm(false);

      toast({
        title: "Usuário criado",
        description: `O usuário ${responseData.name} foi criado com sucesso!`,
      });

      // Refresh the user list to ensure consistency
      setTimeout(() => {
        loadUsers();
      }, 500);

    } catch (error: any) {
      console.error('❌ Erro ao criar usuário:', error);

      let errorMessage = 'Não foi possível criar o usuário.';

      if (error.message.includes('conectividade')) {
        errorMessage = 'Erro de conectividade. Verifique sua conexão e tente novamente.';
      } else if (error.message.includes('configuração do servidor')) {
        errorMessage = 'Erro de configuração do servidor. Tente recarregar a página.';
      } else if (error.status === 400) {
        errorMessage = error.message || 'Dados inválidos. Verifique os campos preenchidos.';
      } else if (error.status === 500) {
        errorMessage = 'Erro interno do servidor. Tente novamente em alguns instantes.';
      }

      toast({
        title: "Erro ao criar usuário",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateUserStatus = async (userId: string, newStatus: 'active' | 'inactive') => {
    try {
      console.log('🔄 Updating user status with robust client:', userId, newStatus);

      const updatedUser = await apiClient.put(`/api/users/${userId}/status`, { 
        status: newStatus 
      });

      console.log('✅ User status updated:', updatedUser);

      setUsers(prev => prev.map(user => 
        user.id === userId ? { ...user, status: newStatus } : user
      ));

      toast({
        title: "Status atualizado",
        description: "O status do usuário foi alterado com sucesso",
      });
    } catch (error: any) {
      console.error('❌ Erro ao atualizar status:', error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o status",
        variant: "destructive"
      });
    }
  };

  const handleUpdateUserRole = async (userId: string, newRole: 'admin' | 'user' | 'founder') => {
    try {
      console.log('🔄 Updating user role with robust client:', userId, newRole);

      const updatedUser = await apiClient.put(`/api/users/${userId}/role`, { 
        role: newRole 
      });

      console.log('✅ User role updated:', updatedUser);

      setUsers(prev => prev.map(user => 
        user.id === userId ? { ...user, role: newRole } : user
      ));

      toast({
        title: "Role atualizada",
        description: "A role do usuário foi alterada com sucesso",
      });
    } catch (error: any) {
      console.error('❌ Erro ao atualizar role:', error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar a role",
        variant: "destructive"
      });
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm('Tem certeza que deseja excluir este usuário? Esta ação não pode ser desfeita.')) {
      return;
    }

    try {
      console.log('🔄 Deleting user with robust client:', userId);

      await apiClient.delete(`/api/users/${userId}`);

      console.log('✅ User deleted successfully');

      setUsers(prev => prev.filter(user => user.id !== userId));

      toast({
        title: "Usuário excluído",
        description: "O usuário foi removido com sucesso",
      });
    } catch (error: any) {
      console.error('❌ Erro ao excluir usuário:', error);
      toast({
        title: "Erro",
        description: "Não foi possível excluir o usuário",
        variant: "destructive"
      });
    }
  };

  // Load users when dialog opens
  useEffect(() => {
    if (open) {
      loadUsers();
    }
  }, [open]);

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter;

    return matchesSearch && matchesRole && matchesStatus;
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-full xs:max-w-2xl sm:max-w-3xl md:max-w-4xl max-h-[90vh] overflow-y-auto p-3 xs:p-6 dark:bg-gray-900 dark:border-gray-700">
        <DialogHeader className="space-y-1 xs:space-y-2">
          <DialogTitle className="flex flex-col xs:flex-row xs:items-center gap-2 xs:space-x-2 text-base xs:text-lg text-gray-900 dark:text-white">
            <Users className="h-4 xs:h-5 w-4 xs:w-5 flex-shrink-0" />
            <span>Gerenciamento de Usuários</span>
            <div className="flex items-center gap-1 xs:ml-auto">
              {connectionStatus === 'connected' && (
                <Wifi className="h-3 xs:h-4 w-3 xs:w-4 text-green-500" title="Conectado" />
              )}
              {connectionStatus === 'disconnected' && (
                <WifiOff className="h-3 xs:h-4 w-3 xs:w-4 text-red-500" title="Desconectado" />
              )}
              {connectionStatus === 'connecting' && (
                <RefreshCw className="h-3 xs:h-4 w-3 xs:w-4 text-yellow-500 animate-spin" title="Conectando..." />
              )}
            </div>
          </DialogTitle>
          <DialogDescription className="text-xs xs:text-sm">
            Gerencie usuários, roles e permissões
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 xs:space-y-6">
          {/* Connection Status Banner */}
          {connectionStatus === 'disconnected' && (
            <div className="flex flex-col xs:flex-row xs:items-center gap-2 xs:gap-3 p-2 xs:p-3 bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-800 rounded-lg">
              <AlertCircle className="h-3 xs:h-4 w-3 xs:w-4 text-red-500 flex-shrink-0" />
              <span className="text-xs xs:text-sm text-red-700 dark:text-red-200">
                Problema de conectividade. 
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={loadUsers}
                className="text-xs xs:text-sm xs:ml-auto w-full xs:w-auto dark:bg-red-800"
              >
                <RefreshCw className="h-2.5 xs:h-3 w-2.5 xs:w-3 mr-1" />
                Tentar Novamente
              </Button>
            </div>
          )}

          {/* Header Actions */}
          <div className="flex flex-col gap-2 xs:gap-3">
            <div className="flex flex-col gap-2 xs:gap-3">
              {/* Search */}
              <div className="relative w-full">
                <Search className="absolute left-2 top-2 xs:top-2.5 h-3 xs:h-4 w-3 xs:w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-7 xs:pl-8 text-xs xs:text-sm h-8 xs:h-10 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600"
                />
              </div>

              {/* Filters */}
              <div className="grid grid-cols-2 gap-2 xs:gap-3">
                <Select value={roleFilter} onValueChange={setRoleFilter}>
                  <SelectTrigger className="text-xs xs:text-sm h-8 xs:h-10 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600">
                    <SelectValue placeholder="Role" />
                  </SelectTrigger>
                  <SelectContent className="dark:bg-gray-800">
                    <SelectItem value="all">Todas</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="user">Usuário</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="text-xs xs:text-sm h-8 xs:h-10 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent className="dark:bg-gray-800">
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="active">Ativo</SelectItem>
                    <SelectItem value="inactive">Inativo</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex gap-2 w-full">
              <Button 
                variant="outline" 
                onClick={loadUsers}
                disabled={isLoading}
                size="sm"
                className="flex-1 xs:flex-none text-xs xs:text-sm h-8 xs:h-10 dark:bg-gray-800 dark:border-gray-600"
              >
                <RefreshCw className={`h-2.5 xs:h-3 w-2.5 xs:w-3 mr-1 xs:mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                <span className="hidden xs:inline">Atualizar</span>
              </Button>

              <Button onClick={() => setShowNewUserForm(true)} size="sm" className="flex-1 xs:flex-none text-xs xs:text-sm h-8 xs:h-10">
                <UserPlus className="h-2.5 xs:h-3 w-2.5 xs:w-3 mr-1 xs:mr-2" />
                <span className="hidden xs:inline">Novo</span>
                <span className="xs:hidden">+</span>
              </Button>
            </div>
          </div>

          {/* New User Form */}
          {showNewUserForm && (
            <Card className="dark:bg-gray-800 dark:border-gray-700">
              <CardHeader className="pb-2 xs:pb-4">
                <CardTitle className="text-sm xs:text-base text-gray-900 dark:text-white">Criar Novo Usuário</CardTitle>
              </CardHeader>
              <CardContent className="px-3 xs:px-6 py-3 xs:py-6">
                <form onSubmit={handleCreateUser} className="space-y-2 xs:space-y-4">
                  <div className="grid grid-cols-1 xs:grid-cols-2 gap-2 xs:gap-4">
                    <div className="space-y-1 xs:space-y-2">
                      <Label htmlFor="new-name" className="text-xs xs:text-sm font-medium text-gray-900 dark:text-white">Nome</Label>
                      <Input
                        id="new-name"
                        type="text"
                        placeholder="Nome"
                        value={newUser.name}
                        onChange={(e) => setNewUser(prev => ({ ...prev, name: e.target.value }))}
                        required
                        className="text-xs xs:text-sm h-8 xs:h-10 px-2 xs:px-3 py-1 xs:py-2 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600"
                      />
                    </div>
                    <div className="space-y-1 xs:space-y-2">
                      <Label htmlFor="new-email" className="text-xs xs:text-sm font-medium text-gray-900 dark:text-white">Email</Label>
                      <Input
                        id="new-email"
                        type="email"
                        placeholder="email@exemplo.com"
                        value={newUser.email}
                        onChange={(e) => setNewUser(prev => ({ ...prev, email: e.target.value }))}
                        required
                        className="text-xs xs:text-sm h-8 xs:h-10 px-2 xs:px-3 py-1 xs:py-2 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600"
                      />
                    </div>
                  </div>
                  <div className="space-y-1 xs:space-y-2">
                    <Label htmlFor="new-role" className="text-xs xs:text-sm font-medium text-gray-900 dark:text-white">Role</Label>
                    <Select 
                      value={newUser.role} 
                      onValueChange={(value: 'admin' | 'user' | 'founder') => setNewUser(prev => ({ ...prev, role: value }))}
                    >
                      <SelectTrigger className="text-xs xs:text-sm h-8 xs:h-10 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="dark:bg-gray-700">
                        <SelectItem value="user">Usuário</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                        <SelectItem value="founder">Founder</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex gap-2 pt-2 xs:pt-4">
                    <Button type="submit" disabled={isLoading} size="sm" className="flex-1 xs:flex-none text-xs xs:text-sm h-8 xs:h-10">
                      {isLoading ? 'Criando...' : 'Criar'}
                    </Button>
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => setShowNewUserForm(false)}
                      size="sm"
                      className="flex-1 xs:flex-none text-xs xs:text-sm h-8 xs:h-10 dark:bg-gray-700 dark:border-gray-600"
                    >
                      Cancelar
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          {/* Users List */}
          <Card className="dark:bg-gray-800 dark:border-gray-700">
            <CardHeader className="pb-2 xs:pb-4">
              <CardTitle className="text-sm xs:text-base text-gray-900 dark:text-white">
                Usuários ({filteredUsers.length})
                {isLoading && (
                  <RefreshCw className="inline h-3 xs:h-4 w-3 xs:w-4 ml-2 animate-spin" />
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="px-3 xs:px-6 py-3 xs:py-6">
              <div className="space-y-2 xs:space-y-4">
                {filteredUsers.map((user) => (
                  <div key={user.id} className="flex flex-col xs:flex-row xs:items-center xs:justify-between gap-2 xs:gap-4 p-2 xs:p-4 border border-gray-200 dark:border-gray-600 rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-700 dark:to-gray-750">
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs xs:text-sm font-semibold text-gray-900 dark:text-white truncate">{user.name}</h4>
                      <p className="text-xs text-gray-600 dark:text-gray-300 truncate">{user.email}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {new Date(user.created_at).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                    
                    <div className="flex flex-col xs:flex-row items-start xs:items-center gap-1.5 xs:gap-2 flex-wrap xs:flex-nowrap">
                      {/* Status Badge */}
                      <Badge variant={user.status === 'active' ? 'default' : 'secondary'} className="text-xs whitespace-nowrap">
                        {user.status === 'active' ? '✓ Ativo' : '✕ Inativo'}
                      </Badge>
                      
                      {/* Status Selector */}
                      <Select 
                        value={user.status} 
                        onValueChange={(value: 'active' | 'inactive') => handleUpdateUserStatus(user.id, value)}
                        disabled={isLoading}
                      >
                        <SelectTrigger className="text-xs xs:text-sm h-8 xs:h-9 w-24 xs:w-28 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="dark:bg-gray-800">
                          <SelectItem value="active">Ativo</SelectItem>
                          <SelectItem value="inactive">Inativo</SelectItem>
                        </SelectContent>
                      </Select>
                      
                      {/* Role Badge */}
                      <Badge variant={
                        user.role === 'founder' ? 'destructive' : 
                        user.role === 'admin' ? 'default' : 'secondary'
                      } className="text-xs whitespace-nowrap">
                        {user.role === 'founder' ? '👑 Founder' : 
                         user.role === 'admin' ? 'Admin' : 'Usuário'}
                      </Badge>
                      
                      {/* Role Selector */}
                      <Select 
                        value={user.role} 
                        onValueChange={(value: 'admin' | 'user' | 'founder') => handleUpdateUserRole(user.id, value)}
                        disabled={isLoading}
                      >
                        <SelectTrigger className="text-xs xs:text-sm h-8 xs:h-9 w-28 xs:w-32 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="dark:bg-gray-800">
                          <SelectItem value="user">Usuário</SelectItem>
                          <SelectItem value="admin">Admin</SelectItem>
                          {(user.email === 'fernandoluizsouzaramalho@gmail.com' || user.id === '00000000-0000-0000-0000-000000000001') && (
                            <SelectItem value="founder">Founder</SelectItem>
                          )}
                        </SelectContent>
                      </Select>
                      
                      {/* Delete Button */}
                      {user.id !== '00000000-0000-0000-0000-000000000001' && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteUser(user.id)}
                          className="text-xs h-8 xs:h-9 px-2 xs:px-3 text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20"
                          disabled={isLoading}
                        >
                          <Trash2 className="h-3 xs:h-4 w-3 xs:w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
                {filteredUsers.length === 0 && !isLoading && (
                  <div className="text-center py-4 xs:py-8 text-xs xs:text-sm text-muted-foreground">
                    {connectionStatus === 'disconnected' ? 
                      'Não foi possível carregar os usuários.' :
                      'Nenhum usuário encontrado'
                    }
                  </div>
                )}
                {isLoading && (
                  <div className="text-center py-4 xs:py-8">
                    <RefreshCw className="h-4 xs:h-6 w-4 xs:w-6 animate-spin mx-auto mb-2" />
                    <p className="text-xs xs:text-sm text-muted-foreground">Carregando...</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};