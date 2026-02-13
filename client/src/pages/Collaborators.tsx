import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Plus, Search, Filter, Download, Upload, MoreHorizontal, UserPlus, Eye, Edit, Trash2, Mail, Phone, MapPin, Building, Briefcase, Calendar, Star, Award, TrendingUp, Brain, CheckCircle, AlertCircle, Pause, RefreshCw } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { useBrainSysIntegration } from '@/hooks/useBrainSysIntegration';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useCollaborators } from '@/hooks/useCollaborators';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface Collaborator {
  id: string;
  name: string;
  email: string;
  role: string;
  department: string;
  status: 'active' | 'inactive' | 'vacation';
  userId: string;
  createdAt?: string;
}

interface CollaboratorStats {
  total: number;
  active: number;
  inactive: number;
  vacation: number;
  departments: number;
}

export const Collaborators = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [collaborators, setCollaborators] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDepartment, setFilterDepartment] = useState('all');
  const [filterRole, setFilterRole] = useState('all');
  const [isNewCollaboratorOpen, setIsNewCollaboratorOpen] = useState(false);
  const [selectedCollaborator, setSelectedCollaborator] = useState(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);

  // BrainSys Integration
  const brainSys = useBrainSysIntegration({
    moduleName: 'collaborators',
    autoRecord: true,
    trackActions: ['view_collaborator', 'create_collaborator', 'search_collaborators', 'filter_collaborators']
  });

  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive' | 'vacation'>('all');
  const [isNewDialogOpen, setIsNewDialogOpen] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [newCollaborator, setNewCollaborator] = useState({
    name: '',
    email: '',
    role: '',
    department: '',
    status: 'active' as const
  });

  // Use the optimized hook for data management
  const {
    collaborators: optimizedCollaborators,
    isLoading,
    error,
    fetchCollaborators,
    createCollaborator
  } = useCollaborators();

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchCollaborators();
    setRefreshing(false);
  };

  const handleCreateCollaborator = async () => {
    if (!user?.id) {
      toast({
        title: "Sessão inválida",
        description: "Por favor, faça login novamente",
        variant: "destructive",
      });
      return;
    }

    // Validação básica
    if (!newCollaborator.name || !newCollaborator.email || !newCollaborator.role || !newCollaborator.department) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha todos os campos obrigatórios",
        variant: "destructive",
      });
      return;
    }

    console.log('📤 Enviando dados do colaborador:', newCollaborator.name);

    const success = await createCollaborator({
      ...newCollaborator,
      user_id: user.id
    });

    if (success) {
      setIsNewDialogOpen(false);
      setNewCollaborator({ name: '', email: '', role: '', department: '', status: 'active' });
    }
  };

  const handleViewCollaborator = (id: string, name: string) => {
    toast({
      title: "Visualizando colaborador",
      description: `Carregando detalhes de: ${name}`,
    });
  };



  // Filter collaborators
  const filteredCollaborators = optimizedCollaborators.filter((collaborator) => {
    const matchesSearch = collaborator.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         collaborator.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         collaborator.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         collaborator.department.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'all' || collaborator.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const stats: CollaboratorStats = {
    total: optimizedCollaborators.length,
    active: optimizedCollaborators.filter((c) => c.status === 'active').length,
    inactive: optimizedCollaborators.filter((c) => c.status === 'inactive').length,
    vacation: optimizedCollaborators.filter((c) => c.status === 'vacation').length,
    departments: new Set(optimizedCollaborators.map((c) => c.department)).size
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'inactive': return <AlertCircle className="h-4 w-4 text-red-500" />;
      case 'vacation': return <Pause className="h-4 w-4 text-yellow-500" />;
      default: return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800';
      case 'inactive': return 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800';
      case 'vacation': return 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400 dark:border-yellow-800';
      default: return 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-900/20 dark:text-gray-400 dark:border-gray-800';
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
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold">Colaboradores</h1>
              <p className="text-muted-foreground">Carregando colaboradores...</p>
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader>
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-full"></div>
                </CardHeader>
                <CardContent>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-4 sm:space-y-6">
        <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Colaboradores</h1>
            <p className="text-sm sm:text-base text-muted-foreground">
              Gerencie sua equipe e acompanhe o desempenho
            </p>
          </div>
          <div className="flex flex-col space-y-2 sm:flex-row sm:items-center sm:space-y-0 sm:space-x-2">
            <div className="w-full sm:w-auto">
              {/* <SmartFilters onFiltersChange={setActiveFilters} /> */}
            </div>
            <Button onClick={() => setIsNewDialogOpen(true)} className="w-full sm:w-auto">
              <UserPlus className="mr-2 h-4 w-4" />
              <span className="sm:hidden">Adicionar</span>
              <span className="hidden sm:inline">Novo Colaborador</span>
            </Button>
          </div>
        </div>



        {/* Estatísticas */}
        <div className="grid gap-3 sm:gap-4 grid-cols-2 lg:grid-cols-5">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium">Total</CardTitle>
              <Users className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-lg sm:text-2xl font-bold">{stats.total}</div>
              <p className="text-[10px] sm:text-xs text-muted-foreground">colaboradores</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium">Ativos</CardTitle>
              <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-lg sm:text-2xl font-bold text-green-600">{stats.active}</div>
              <p className="text-[10px] sm:text-xs text-muted-foreground">
                {stats.total > 0 ? Math.round((stats.active / stats.total) * 100) : 0}% do total
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium">Inativos</CardTitle>
              <AlertCircle className="h-3 w-3 sm:h-4 sm:w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-lg sm:text-2xl font-bold text-red-600">{stats.inactive}</div>
              <p className="text-[10px] sm:text-xs text-muted-foreground">
                {stats.total > 0 ? Math.round((stats.inactive / stats.total) * 100) : 0}% do total
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium">Férias</CardTitle>
              <Pause className="h-3 w-3 sm:h-4 sm:w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-lg sm:text-2xl font-bold text-yellow-600">{stats.vacation}</div>
              <p className="text-[10px] sm:text-xs text-muted-foreground">em período de férias</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium">Departamentos</CardTitle>
              <Building className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-lg sm:text-2xl font-bold">{stats.departments}</div>
              <p className="text-[10px] sm:text-xs text-muted-foreground">áreas ativas</p>
            </CardContent>
          </Card>
        </div>

        {/* Filtros e Busca */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Filtros e Busca</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="Buscar por nome, email, cargo ou departamento..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                {(['all', 'active', 'inactive', 'vacation'] as const).map((status) => (
                  <Button
                    key={status}
                    variant={statusFilter === status ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setStatusFilter(status)}
                    className="flex items-center gap-1"
                  >
                    {status !== 'all' && getStatusIcon(status)}
                    {status === 'all' ? 'Todos' : getStatusText(status)}
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Lista de Colaboradores */}
        {filteredCollaborators.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              {isLoading ? (
                <>
                  <RefreshCw className="h-12 w-12 text-muted-foreground mb-4 animate-spin" />
                  <h3 className="text-lg font-medium mb-2">Carregando colaboradores...</h3>
                  <p className="text-muted-foreground text-center">
                    Buscando dados mais recentes
                  </p>
                </>
              ) : (
                <>
                  <Users className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">
                    {searchTerm || statusFilter !== 'all' 
                      ? 'Nenhum colaborador encontrado' 
                      : 'Nenhum colaborador cadastrado'
                    }
                  </h3>
                  <p className="text-muted-foreground text-center mb-4">
                    {searchTerm || statusFilter !== 'all'
                      ? 'Tente ajustar os filtros de busca'
                      : 'Comece adicionando seu primeiro colaborador'
                    }
                  </p>
                  {!searchTerm && statusFilter === 'all' && (
                    <Button onClick={() => setIsNewDialogOpen(true)}>
                      <UserPlus className="h-4 w-4 mr-2" />
                      Adicionar Colaborador
                    </Button>
                  )}
                </>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredCollaborators.map((collaborator) => (
              <Card key={collaborator.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <CardTitle className="text-lg mb-2">{collaborator.name}</CardTitle>
                      <div className="space-y-2">
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Mail className="mr-2 h-4 w-4" />
                          {collaborator.email}
                        </div>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Briefcase className="mr-2 h-4 w-4" />
                          {collaborator.role}
                        </div>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Building className="mr-2 h-4 w-4" />
                          {collaborator.department}
                        </div>
                      </div>
                    </div>
                    <Badge variant="outline" className={getStatusColor(collaborator.status)}>
                      {getStatusIcon(collaborator.status)}
                      <span className="ml-1">{getStatusText(collaborator.status)}</span>
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-2 flex-wrap">
                    <Button 
                      size="sm" 
                      onClick={() => handleViewCollaborator(collaborator.id, collaborator.name)}
                    >
                      <Eye className="mr-2 h-4 w-4" />
                      Visualizar
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleViewCollaborator(collaborator.id, collaborator.name)}
                    >
                      <Edit className="mr-2 h-4 w-4" />
                      Editar
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Dialog para Novo Colaborador */}
        <Dialog open={isNewDialogOpen} onOpenChange={setIsNewDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Novo Colaborador</DialogTitle>
              <DialogDescription>
                Adicione um novo colaborador à sua equipe.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <Input
                placeholder="Nome completo"
                value={newCollaborator.name}
                onChange={(e) => setNewCollaborator(prev => ({ ...prev, name: e.target.value }))}
              />
              <Input
                placeholder="Email"
                type="email"
                value={newCollaborator.email}
                onChange={(e) => setNewCollaborator(prev => ({ ...prev, email: e.target.value }))}
              />
              <Input
                placeholder="Cargo"
                value={newCollaborator.role}
                onChange={(e) => setNewCollaborator(prev => ({ ...prev, role: e.target.value }))}
              />
              <Input
                placeholder="Departamento"
                value={newCollaborator.department}
                onChange={(e) => setNewCollaborator(prev => ({ ...prev, department: e.target.value }))}
              />
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsNewDialogOpen(false)}>
                Cancelar
              </Button>
              <Button 
                onClick={handleCreateCollaborator}
                disabled={!newCollaborator.name || !newCollaborator.email}
              >
                Criar Colaborador
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
};