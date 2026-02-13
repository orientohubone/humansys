
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Shield, Users, FileText, Settings, BarChart } from 'lucide-react';

interface Permission {
  id: string;
  name: string;
  description: string;
  category: string;
  icon: React.ReactNode;
}

interface Role {
  id: string;
  name: string;
  permissions: string[];
}

const permissions: Permission[] = [
  {
    id: 'view_users',
    name: 'Visualizar Usuários',
    description: 'Permite visualizar a lista de usuários',
    category: 'users',
    icon: <Users className="h-4 w-4" />
  },
  {
    id: 'manage_users',
    name: 'Gerenciar Usuários',
    description: 'Permite criar, editar e excluir usuários',
    category: 'users',
    icon: <Users className="h-4 w-4" />
  },
  {
    id: 'view_documents',
    name: 'Visualizar Documentos',
    description: 'Permite visualizar documentos',
    category: 'documents',
    icon: <FileText className="h-4 w-4" />
  },
  {
    id: 'manage_documents',
    name: 'Gerenciar Documentos',
    description: 'Permite criar, editar e excluir documentos',
    category: 'documents',
    icon: <FileText className="h-4 w-4" />
  },
  {
    id: 'view_analytics',
    name: 'Visualizar Analytics',
    description: 'Permite visualizar relatórios e analytics',
    category: 'analytics',
    icon: <BarChart className="h-4 w-4" />
  },
  {
    id: 'system_settings',
    name: 'Configurações do Sistema',
    description: 'Permite alterar configurações do sistema',
    category: 'system',
    icon: <Settings className="h-4 w-4" />
  }
];

const defaultRoles: Role[] = [
  {
    id: 'admin',
    name: 'Administrador',
    permissions: permissions.map(p => p.id)
  },
  {
    id: 'manager',
    name: 'Gerente',
    permissions: ['view_users', 'view_documents', 'manage_documents', 'view_analytics']
  },
  {
    id: 'user',
    name: 'Usuário',
    permissions: ['view_documents', 'view_analytics']
  }
];

export const PermissionsForm = () => {
  const [roles, setRoles] = useState<Role[]>(defaultRoles);
  const [selectedRole, setSelectedRole] = useState<string>('admin');
  const { toast } = useToast();

  const selectedRoleData = roles.find(r => r.id === selectedRole);

  const handlePermissionChange = (permissionId: string, checked: boolean) => {
    setRoles(prev => prev.map(role => {
      if (role.id === selectedRole) {
        return {
          ...role,
          permissions: checked 
            ? [...role.permissions, permissionId]
            : role.permissions.filter(p => p !== permissionId)
        };
      }
      return role;
    }));
  };

  const handleSave = async () => {
    try {
      // Mock save - in real app this would save to database
      toast({
        title: "Permissões salvas",
        description: "As permissões foram atualizadas com sucesso",
      });
    } catch (error) {
      console.error('Erro ao salvar permissões:', error);
      toast({
        title: "Erro",
        description: "Não foi possível salvar as permissões",
        variant: "destructive"
      });
    }
  };

  const getPermissionsByCategory = (category: string) => {
    return permissions.filter(p => p.category === category);
  };

  const categories = [...new Set(permissions.map(p => p.category))];

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Shield className="h-8 w-8 text-primary" />
        <div>
          <h2 className="text-2xl font-bold">Gerenciar Permissões</h2>
          <p className="text-muted-foreground">Configure as permissões para cada tipo de usuário</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Role Selection */}
        <Card>
          <CardHeader>
            <CardTitle>Roles</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {roles.map((role) => (
              <Button
                key={role.id}
                variant={selectedRole === role.id ? "default" : "outline"}
                className="w-full justify-start"
                onClick={() => setSelectedRole(role.id)}
              >
                {role.name}
              </Button>
            ))}
          </CardContent>
        </Card>

        {/* Permissions */}
        <div className="lg:col-span-3">
          <Card>
            <CardHeader>
              <CardTitle>
                Permissões para {selectedRoleData?.name}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {categories.map((category) => (
                <div key={category} className="space-y-4">
                  <h3 className="text-lg font-medium capitalize">{category}</h3>
                  <div className="space-y-3">
                    {getPermissionsByCategory(category).map((permission) => (
                      <div key={permission.id} className="flex items-start space-x-3">
                        <Checkbox
                          id={permission.id}
                          checked={selectedRoleData?.permissions.includes(permission.id) || false}
                          onCheckedChange={(checked) => 
                            handlePermissionChange(permission.id, checked as boolean)
                          }
                        />
                        <div className="grid gap-1.5 leading-none">
                          <Label
                            htmlFor={permission.id}
                            className="flex items-center space-x-2 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            {permission.icon}
                            <span>{permission.name}</span>
                          </Label>
                          <p className="text-xs text-muted-foreground">
                            {permission.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}

              <div className="pt-6 border-t">
                <Button onClick={handleSave}>
                  Salvar Permissões
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
