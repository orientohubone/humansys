
import React, { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import {
  Target,
  Brain,
  Users,
  TrendingUp,
  Star,
  Award,
  Plus,
  Eye,
  Edit,
  BarChart3,
  Zap,
  CheckCircle,
  AlertTriangle,
  Clock,
  ArrowLeft
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Competency {
  id: string;
  name: string;
  description: string;
  category: string;
  level: number;
  maxLevel: number;
  employees: number;
  averageScore: number;
  trending: 'up' | 'down' | 'stable';
  priority: 'high' | 'medium' | 'low';
}

interface Employee {
  id: string;
  name: string;
  role: string;
  department: string;
  competencies: {
    competencyId: string;
    currentLevel: number;
    targetLevel: number;
    progress: number;
  }[];
  overallScore: number;
}

interface CompetencyGap {
  competencyId: string;
  competencyName: string;
  currentAverage: number;
  targetAverage: number;
  gap: number;
  employeesAffected: number;
  priority: 'critical' | 'high' | 'medium' | 'low';
}

export const BrainSysCompetencies: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState('overview');
  const [selectedEmployee, setSelectedEmployee] = useState<string | null>(null);
  const { toast } = useToast();

  // Mock data
  const competencies: Competency[] = [
    {
      id: '1',
      name: 'Liderança',
      description: 'Capacidade de liderar e influenciar equipes',
      category: 'Comportamental',
      level: 4,
      maxLevel: 5,
      employees: 25,
      averageScore: 3.2,
      trending: 'up',
      priority: 'high'
    },
    {
      id: '2',
      name: 'Comunicação',
      description: 'Habilidades de comunicação verbal e escrita',
      category: 'Comportamental',
      level: 3,
      maxLevel: 5,
      employees: 45,
      averageScore: 3.8,
      trending: 'stable',
      priority: 'high'
    },
    {
      id: '3',
      name: 'Programação Python',
      description: 'Conhecimento em linguagem Python',
      category: 'Técnica',
      level: 4,
      maxLevel: 5,
      employees: 18,
      averageScore: 3.5,
      trending: 'up',
      priority: 'medium'
    },
    {
      id: '4',
      name: 'Análise de Dados',
      description: 'Capacidade de analisar e interpretar dados',
      category: 'Técnica',
      level: 3,
      maxLevel: 5,
      employees: 22,
      averageScore: 2.9,
      trending: 'down',
      priority: 'critical'
    }
  ];

  const employees: Employee[] = [
    {
      id: '1',
      name: 'Ana Silva',
      role: 'Desenvolvedora Senior',
      department: 'Tecnologia',
      competencies: [
        { competencyId: '1', currentLevel: 3, targetLevel: 4, progress: 75 },
        { competencyId: '2', currentLevel: 4, targetLevel: 4, progress: 100 },
        { competencyId: '3', currentLevel: 5, targetLevel: 5, progress: 100 },
        { competencyId: '4', currentLevel: 3, targetLevel: 4, progress: 60 }
      ],
      overallScore: 84
    },
    {
      id: '2',
      name: 'Carlos Mendes',
      role: 'Designer UX',
      department: 'Design',
      competencies: [
        { competencyId: '1', currentLevel: 2, targetLevel: 3, progress: 40 },
        { competencyId: '2', currentLevel: 5, targetLevel: 5, progress: 100 },
        { competencyId: '3', currentLevel: 1, targetLevel: 2, progress: 20 },
        { competencyId: '4', currentLevel: 4, targetLevel: 4, progress: 100 }
      ],
      overallScore: 76
    }
  ];

  const competencyGaps: CompetencyGap[] = [
    {
      competencyId: '4',
      competencyName: 'Análise de Dados',
      currentAverage: 2.9,
      targetAverage: 4.0,
      gap: 1.1,
      employeesAffected: 22,
      priority: 'critical'
    },
    {
      competencyId: '1',
      competencyName: 'Liderança',
      currentAverage: 3.2,
      targetAverage: 4.0,
      gap: 0.8,
      employeesAffected: 25,
      priority: 'high'
    }
  ];

  const getTrendingIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'down': return <TrendingUp className="h-4 w-4 text-red-500 rotate-180" />;
      default: return <BarChart3 className="h-4 w-4 text-gray-500" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-red-500 text-white';
      case 'high': return 'bg-orange-500 text-white';
      case 'medium': return 'bg-yellow-500 text-white';
      case 'low': return 'bg-green-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Técnica': return <Zap className="h-4 w-4" />;
      case 'Comportamental': return <Users className="h-4 w-4" />;
      case 'Liderança': return <Award className="h-4 w-4" />;
      default: return <Target className="h-4 w-4" />;
    }
  };

  const handleGenerateAIRecommendations = () => {
    toast({
      title: "🧠 IA Analisando Competências",
      description: "Gerando recomendações personalizadas de desenvolvimento...",
    });
    
    setTimeout(() => {
      toast({
        title: "✅ Recomendações Geradas",
        description: "12 planos de desenvolvimento criados e 5 gaps críticos identificados.",
      });
    }, 2000);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => window.history.back()}
              className="hover:bg-slate-100 dark:hover:bg-slate-800"
              title="Voltar"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold">🎯 Competências & Desenvolvimento</h1>
              <p className="text-muted-foreground">
                Mapeamento inteligente de competências e planos de desenvolvimento
              </p>
            </div>
          </div>
          <div className="flex space-x-2">
            <Button 
              onClick={handleGenerateAIRecommendations}
              className="bg-purple-600 hover:bg-purple-700"
            >
              <Brain className="mr-2 h-4 w-4" />
              Gerar Recomendações IA
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Competências</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{competencies.length}</div>
              <div className="text-xs text-muted-foreground">
                +2 novas este mês
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Score Médio Geral</CardTitle>
              <Star className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">3.4</div>
              <div className="text-xs text-muted-foreground">
                +0.2 vs trimestre anterior
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Gaps Críticos</CardTitle>
              <AlertTriangle className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">3</div>
              <div className="text-xs text-muted-foreground">
                Precisam atenção imediata
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Em Desenvolvimento</CardTitle>
              <Clock className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">28</div>
              <div className="text-xs text-muted-foreground">
                Funcionários ativos
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Visão Geral</TabsTrigger>
            <TabsTrigger value="competencies">Competências</TabsTrigger>
            <TabsTrigger value="employees">Funcionários</TabsTrigger>
            <TabsTrigger value="gaps">Análise de Gaps</TabsTrigger>
            <TabsTrigger value="development">Planos</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Competencies Overview */}
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>📊 Distribuição por Categoria</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="flex items-center space-x-2">
                        <Users className="h-4 w-4 text-blue-500" />
                        <span>Comportamentais</span>
                      </span>
                      <div className="flex items-center space-x-2">
                        <Progress value={65} className="w-24" />
                        <span className="text-sm">65%</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="flex items-center space-x-2">
                        <Zap className="h-4 w-4 text-purple-500" />
                        <span>Técnicas</span>
                      </span>
                      <div className="flex items-center space-x-2">
                        <Progress value={35} className="w-24" />
                        <span className="text-sm">35%</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>🏆 Top Competências</CardTitle>
                  <CardDescription>Melhores scores médios</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {competencies
                      .sort((a, b) => b.averageScore - a.averageScore)
                      .slice(0, 3)
                      .map((comp, index) => (
                        <div key={comp.id} className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white ${
                              index === 0 ? 'bg-yellow-500' : index === 1 ? 'bg-gray-400' : 'bg-amber-600'
                            }`}>
                              {index + 1}
                            </div>
                            <span className="font-medium">{comp.name}</span>
                          </div>
                          <div className="text-right">
                            <div className="font-bold">{comp.averageScore.toFixed(1)}</div>
                            <div className="text-xs text-muted-foreground">/{comp.maxLevel}</div>
                          </div>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Critical Gaps Alert */}
            <Card className="border-red-200 bg-red-50">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-red-700">
                  <AlertTriangle className="h-5 w-5" />
                  <span>Gaps Críticos Identificados</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {competencyGaps.filter(gap => gap.priority === 'critical').map((gap) => (
                    <div key={gap.competencyId} className="flex items-center justify-between p-3 bg-white rounded-lg border">
                      <div>
                        <h4 className="font-semibold text-red-700">{gap.competencyName}</h4>
                        <p className="text-sm text-muted-foreground">
                          {gap.employeesAffected} funcionários afetados
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-red-600">-{gap.gap.toFixed(1)}</div>
                        <div className="text-xs text-muted-foreground">gap médio</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="competencies" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Mapa de Competências</h2>
              <Dialog>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Nova Competência
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Criar Nova Competência</DialogTitle>
                    <DialogDescription>
                      Defina uma nova competência para mapeamento
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="comp-name">Nome da Competência</Label>
                      <Input id="comp-name" placeholder="Ex: Liderança de Equipes" />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="comp-category">Categoria</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione a categoria" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="behavioral">Comportamental</SelectItem>
                          <SelectItem value="technical">Técnica</SelectItem>
                          <SelectItem value="leadership">Liderança</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="comp-description">Descrição</Label>
                      <Textarea 
                        id="comp-description" 
                        placeholder="Descreva a competência e como ela é avaliada..."
                        rows={3}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="min-level">Nível Mínimo</Label>
                        <Input id="min-level" type="number" defaultValue="1" />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="max-level">Nível Máximo</Label>
                        <Input id="max-level" type="number" defaultValue="5" />
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button variant="outline">Cancelar</Button>
                    <Button>Criar Competência</Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid gap-4">
              {competencies.map((competency) => (
                <Card key={competency.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div className="flex items-start space-x-3">
                        <div className="p-2 rounded-lg bg-blue-100">
                          {getCategoryIcon(competency.category)}
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg">{competency.name}</h3>
                          <p className="text-muted-foreground text-sm">{competency.description}</p>
                          <div className="flex items-center space-x-2 mt-1">
                            <Badge variant="outline">{competency.category}</Badge>
                            <div className={`h-2 w-2 rounded-full ${getPriorityColor(competency.priority)}`} />
                            <span className="text-xs capitalize">{competency.priority}</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center space-x-1">
                          {getTrendingIcon(competency.trending)}
                          <span className="text-2xl font-bold">{competency.averageScore}</span>
                          <span className="text-muted-foreground">/{competency.maxLevel}</span>
                        </div>
                        <p className="text-xs text-muted-foreground">{competency.employees} funcionários</p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="flex-1 mr-4">
                        <div className="flex items-center justify-between text-sm mb-1">
                          <span>Progresso médio</span>
                          <span>{Math.round((competency.averageScore / competency.maxLevel) * 100)}%</span>
                        </div>
                        <Progress value={(competency.averageScore / competency.maxLevel) * 100} />
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">
                          <Eye className="mr-2 h-4 w-4" />
                          Ver Detalhes
                        </Button>
                        <Button variant="outline" size="sm">
                          <Edit className="mr-2 h-4 w-4" />
                          Editar
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="employees" className="space-y-6">
            <div className="grid gap-4">
              {employees.map((employee) => (
                <Card key={employee.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold text-lg">{employee.name}</h3>
                        <p className="text-muted-foreground">{employee.role} • {employee.department}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold">{employee.overallScore}%</div>
                        <p className="text-xs text-muted-foreground">Score Geral</p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <h4 className="font-medium">Competências em Desenvolvimento</h4>
                      {employee.competencies.map((comp) => {
                        const competency = competencies.find(c => c.id === comp.competencyId);
                        return (
                          <div key={comp.competencyId} className="flex items-center justify-between">
                            <div className="flex-1">
                              <div className="flex items-center justify-between text-sm mb-1">
                                <span className="font-medium">{competency?.name}</span>
                                <span>{comp.currentLevel}/{comp.targetLevel}</span>
                              </div>
                              <Progress value={comp.progress} />
                            </div>
                            <div className="ml-4 text-sm text-muted-foreground">
                              {comp.progress}%
                            </div>
                          </div>
                        );
                      })}
                      <div className="flex justify-end">
                        <Button size="sm">Ver Plano de Desenvolvimento</Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="gaps" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>🔍 Análise de Gaps de Competências</CardTitle>
                <CardDescription>
                  Identificação de lacunas e priorização de desenvolvimento
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {competencyGaps.map((gap) => (
                    <div key={gap.competencyId} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h4 className="font-semibold">{gap.competencyName}</h4>
                          <p className="text-sm text-muted-foreground">
                            {gap.employeesAffected} funcionários precisam de desenvolvimento
                          </p>
                        </div>
                        <Badge variant="destructive">
                          {gap.priority.toUpperCase()}
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-4 text-center">
                        <div>
                          <p className="text-xs text-muted-foreground">Nível Atual</p>
                          <p className="text-lg font-bold">{gap.currentAverage.toFixed(1)}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Meta</p>
                          <p className="text-lg font-bold">{gap.targetAverage.toFixed(1)}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Gap</p>
                          <p className="text-lg font-bold text-red-600">-{gap.gap.toFixed(1)}</p>
                        </div>
                      </div>

                      <div className="mt-4 flex justify-end space-x-2">
                        <Button variant="outline" size="sm">Ver Funcionários</Button>
                        <Button size="sm">Criar Plano de Ação</Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="development" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>📚 Planos de Desenvolvimento</CardTitle>
                <CardDescription>
                  Planos personalizados gerados pela IA para fechamento de gaps
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-muted-foreground">
                  <Award className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Planos de desenvolvimento em construção</p>
                  <p className="text-sm">IA está analisando dados para criar recomendações personalizadas</p>
                  <Button className="mt-4" onClick={handleGenerateAIRecommendations}>
                    <Brain className="mr-2 h-4 w-4" />
                    Gerar Planos com IA
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default BrainSysCompetencies;
