

import React from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Users, Heart, Trophy, CheckCircle } from 'lucide-react';

export const TestModules: React.FC = () => {
  const navigate = useNavigate();

  const modules = [
    {
      id: 'careers',
      name: 'Cargos e Salários',
      path: '/app/brainsys/careers',
      icon: Users,
      description: 'Gestão inteligente de trilhas de carreira',
      status: 'ready'
    },
    {
      id: 'wellness',
      name: 'BrainPeople - Wellness',
      path: '/app/brainsys/wellness',
      icon: Heart,
      description: 'Monitoramento de saúde mental',
      status: 'ready'
    },
    {
      id: 'motivation',
      name: 'BrainSys Motiva',
      path: '/app/brainsys/motivation',
      icon: Trophy,
      description: 'Gamificação e reconhecimento',
      status: 'ready'
    }
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Teste dos Módulos BrainSys</h1>
          <p className="text-muted-foreground">
            Validação das telas e rotas dos módulos implementados
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {modules.map((module) => {
            const IconComponent = module.icon;
            return (
              <Card key={module.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <IconComponent className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{module.name}</CardTitle>
                      <div className="flex items-center space-x-2 mt-1">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span className="text-sm text-green-600 font-medium">Pronto</span>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">{module.description}</p>
                  <div className="space-y-2">
                    <Button 
                      onClick={() => navigate(module.path)}
                      className="w-full"
                    >
                      Testar Módulo
                    </Button>
                    <div className="text-xs text-muted-foreground">
                      Rota: {module.path}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <Card className="bg-green-50 border-green-200">
          <CardHeader>
            <CardTitle className="text-green-800">Status do Sistema</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <span className="text-green-800">Módulos Implementados</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <span className="text-green-800">Componentes Funcionais</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <span className="text-green-800">Rotas Configuradas</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Debug Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm font-mono bg-gray-100 p-4 rounded-lg">
              <div>Rota atual: {window.location.pathname}</div>
              <div>Timestamp: {new Date().toISOString()}</div>
              <div>Módulos disponíveis: {modules.length}</div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default TestModules;
