import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { UnifiedReportModal } from './UnifiedReportModal';
import { 
  Brain,
  DollarSign,
  Heart,
  Zap,
  TrendingUp,
  Users,
  Target,
  Briefcase,
  Award,
  Sparkles
} from 'lucide-react';

interface BrainSysModulesPanelProps {
  onModuleSelect?: (moduleId: string) => void;
}

export const BrainSysModulesPanel: React.FC<BrainSysModulesPanelProps> = ({ onModuleSelect }) => {
  const navigate = useNavigate();
  const [isUnifiedReportOpen, setIsUnifiedReportOpen] = useState(false);

  const modules = [
    {
      id: 'careers-salaries',
      title: 'Careers & Salários',
      description: 'Gestão inteligente de carreiras e remunerações',
      icon: DollarSign,
      color: 'from-green-500 to-emerald-600',
      status: 'Ativo',
      insights: 'R$ 12K economia identificada'
    },
    {
      id: 'brainpeople',
      title: 'BrainPeople',
      description: 'Bem-estar e desenvolvimento humano',
      icon: Heart,
      color: 'from-pink-500 to-rose-600',
      status: 'Ativo',
      insights: '94% satisfação da equipe'
    },
    {
      id: 'motiva',
      title: 'Motiva',
      description: 'Sistema de motivação e engajamento',
      icon: Zap,
      color: 'from-yellow-500 to-orange-600',
      status: 'Ativo',
      insights: '+35% produtividade'
    },
    {
      id: 'performance',
      title: 'Performance Analytics',
      description: 'Análises preditivas de performance',
      icon: TrendingUp,
      color: 'from-blue-500 to-indigo-600',
      status: 'Beta',
      insights: 'Precisão de 89%'
    },
    {
      id: 'recruitment',
      title: 'Smart Recruitment',
      description: 'Recrutamento inteligente com IA',
      icon: Users,
      color: 'from-purple-500 to-violet-600',
      status: 'Ativo',
      insights: 'Redução de 60% no tempo'
    },
    {
      id: 'competencies',
      title: 'Competências',
      description: 'Mapeamento e desenvolvimento de competências',
      icon: Award,
      color: 'from-teal-500 to-cyan-600',
      status: 'Ativo',
      insights: 'Gap analysis automático'
    }
  ];

  const handleModuleClick = (moduleId: string, status: string) => {
    console.log(`🔄 handleModuleClick chamado - módulo: ${moduleId}, status: ${status}`);

    if (status === 'Em Breve') {
      console.log(`⚠️ Módulo ${moduleId} está "Em Breve", navegação bloqueada`);
      return; // Não navegar se o módulo está "Em Breve"
    }

    const moduleRoutes: Record<string, string> = {
      'careers-salaries': '/app/brainsys/careers',
      'brainpeople': '/app/brainsys/wellness',
      'motiva': '/app/brainsys/motivation',
      'performance': '/app/analytics',
      'recruitment': '/app/brainsys/smart-recruitment',
      'competencies': '/app/brainsys/competencies'
    };

    const route = moduleRoutes[moduleId];
    console.log(`🗺️ Mapeamento de rotas:`, moduleRoutes);
    console.log(`🎯 Rota encontrada para ${moduleId}: ${route}`);

    if (route) {
      try {
        console.log(`🚀 Tentando navegar para: ${route}`);
        navigate(route);
        console.log(`✅ Navegação executada com sucesso para: ${route}`);
      } catch (error) {
        console.error(`❌ Erro na navegação para ${route}:`, error);
      }
    } else {
      console.warn(`⚠️ Rota não encontrada para módulo: ${moduleId}`);
      console.warn(`📋 Rotas disponíveis:`, Object.keys(moduleRoutes));
    }

    if (onModuleSelect) {
      console.log(`📞 Chamando onModuleSelect para: ${moduleId}`);
      onModuleSelect(moduleId);
    }
  };

  return (
    <>
      <Card className="overflow-hidden bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900/50 dark:to-blue-900/50 border-blue-200 dark:border-blue-700">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                <Brain className="h-5 w-5 text-white" />
              </div>
              <div>
                <CardTitle className="flex items-center space-x-2">
                  <span>BrainSys Modules</span>
                  <Badge className="bg-blue-500">IA Powered</Badge>
                </CardTitle>
                <CardDescription>
                  Módulos especializados de inteligência artificial
                </CardDescription>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-blue-600 font-medium">6 Módulos</div>
              <div className="text-xs text-muted-foreground">6 Ativos</div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-2 xs:gap-3 sm:gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {modules.map((module) => (
              <div
                key={module.id}
                className={`relative p-2 xs:p-3 sm:p-4 rounded-lg xs:rounded-xl border-2 transition-all duration-300 ${
                  module.status === 'Em Breve' 
                    ? 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 opacity-60 cursor-not-allowed' 
                    : 'border-white dark:border-gray-700 bg-white dark:bg-gray-800/50 hover:border-blue-300 dark:hover:border-blue-600 hover:shadow-lg cursor-pointer transform hover:scale-105'
                }`}
                onClick={() => handleModuleClick(module.id, module.status)}
              >
                <div className="flex items-start justify-between mb-2 xs:mb-3">
                  <div className={`w-10 xs:w-12 h-10 xs:h-12 bg-gradient-to-br ${module.color} rounded-lg xs:rounded-xl flex items-center justify-center shadow-lg flex-shrink-0`}>
                    <module.icon className="h-5 xs:h-6 w-5 xs:w-6 text-white" />
                  </div>
                  <Badge 
                    variant={module.status === 'Ativo' ? 'default' : module.status === 'Beta' ? 'secondary' : 'outline'}
                    className={
                      module.status === 'Ativo' ? 'bg-green-500' :
                      module.status === 'Beta' ? 'bg-orange-500' : ''
                    }
                  >
                    {module.status}
                  </Badge>
                </div>

                <h3 className="font-semibold text-sm xs:text-base text-gray-900 dark:text-gray-100 mb-0.5 xs:mb-1 line-clamp-2">{module.title}</h3>
                <p className="text-xs xs:text-sm text-gray-600 dark:text-gray-300 mb-2 xs:mb-3 line-clamp-2">{module.description}</p>

                <div className="flex items-center justify-between gap-1">
                  <div className="text-xs text-gray-500 dark:text-gray-400 truncate">{module.insights}</div>
                  {module.status !== 'Em Breve' && (
                    <Sparkles className="h-4 w-4 text-blue-500" />
                  )}
                </div>

                {module.status === 'Em Breve' && (
                  <div className="absolute inset-0 bg-white/50 dark:bg-gray-900/50 rounded-xl flex items-center justify-center">
                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Em Breve</span>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="mt-3 xs:mt-4 sm:mt-6 p-2 xs:p-3 sm:p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/30 dark:to-purple-900/30 rounded-lg xs:rounded-xl border border-blue-200 dark:border-blue-700">
            <div className="flex flex-col xs:flex-row items-start xs:items-center justify-between gap-2 xs:gap-3">
              <div className="flex items-start xs:items-center gap-2 xs:gap-3 flex-1">
                <Brain className="h-4 xs:h-5 w-4 xs:w-5 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                <div className="min-w-0">
                  <h4 className="font-medium text-sm xs:text-base text-gray-900 dark:text-gray-100 truncate">Inteligência Conectada</h4>
                  <p className="text-xs xs:text-sm text-gray-600 dark:text-gray-300 line-clamp-2">Todos os módulos compartilham insights em tempo real</p>
                </div>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                className="border-blue-300 dark:border-blue-600 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 text-xs xs:text-sm whitespace-nowrap flex-shrink-0"
                onClick={() => setIsUnifiedReportOpen(true)}
              >
                Ver Relatório
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <UnifiedReportModal 
        open={isUnifiedReportOpen}
        onOpenChange={setIsUnifiedReportOpen}
      />
    </>
  );
};