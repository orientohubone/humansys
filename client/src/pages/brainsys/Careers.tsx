import React, { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Users,
  TrendingUp,
  AlertTriangle,
  Brain,
  DollarSign,
  Target,
  BarChart3,
  Settings,
  Plus,
  Search,
  Filter,
  ArrowLeft
} from 'lucide-react';

const BrainSysCareers: React.FC = () => {
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Mock data para desenvolvimento
  const mockPositions = [
    {
      id: '1',
      title: 'Desenvolvedor Frontend',
      level: 2,
      department: 'TI',
      currentSalary: 8500,
      marketAverage: 9200,
      equityScore: 85,
      riskLevel: 'medium',
      employees: 3
    },
    {
      id: '2',
      title: 'Analista de Marketing',
      level: 1,
      department: 'Marketing',
      currentSalary: 6500,
      marketAverage: 6800,
      equityScore: 92,
      riskLevel: 'low',
      employees: 2
    },
    {
      id: '3',
      title: 'Gerente de Vendas',
      level: 3,
      department: 'Vendas',
      currentSalary: 12000,
      marketAverage: 13500,
      equityScore: 70,
      riskLevel: 'high',
      employees: 1
    }
  ];

  const mockCareerPaths = [
    {
      id: '1',
      currentPosition: 'Desenvolvedor Junior',
      nextPosition: 'Desenvolvedor Pleno',
      estimatedTime: 18,
      skillsNeeded: ['React Avançado', 'Node.js', 'TypeScript'],
      salaryIncrease: 35
    },
    {
      id: '2',
      currentPosition: 'Analista Marketing Jr',
      nextPosition: 'Analista Marketing Pleno',
      estimatedTime: 24,
      skillsNeeded: ['Google Analytics', 'SEO Avançado', 'Automação'],
      salaryIncrease: 40
    }
  ];

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
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
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <Users className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Cargos e Salários</h1>
              <p className="text-muted-foreground">
                Gestão inteligente de trilhas de carreira e estrutura salarial
              </p>
            </div>
          </div>
          <div className="flex space-x-2">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Novo Cargo
            </Button>
            <Button variant="outline">
              <Settings className="h-4 w-4 mr-2" />
              Configurações
            </Button>
          </div>
        </div>

        {/* BrainSys IAO Insights */}
        <Card className="bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Brain className="h-5 w-5 text-purple-600" />
                <CardTitle>Insights BrainSys IAO</CardTitle>
                <Badge className="bg-purple-500">Análise Preditiva</Badge>
              </div>
              <div className="text-right">
                <div className="text-sm text-purple-600">Confiança: 94.2%</div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="flex items-center space-x-3 p-4 bg-white rounded-lg">
                <AlertTriangle className="h-8 w-8 text-red-500" />
                <div>
                  <h4 className="font-medium">Desalinhamento Crítico</h4>
                  <p className="text-sm text-muted-foreground">3 cargos com salários 15% abaixo do mercado</p>
                  <div className="text-xs text-red-600 mt-1">Risco de turnover: Alto</div>
                </div>
              </div>

              <div className="flex items-center space-x-3 p-4 bg-white rounded-lg">
                <TrendingUp className="h-8 w-8 text-green-500" />
                <div>
                  <h4 className="font-medium">Oportunidade de Crescimento</h4>
                  <p className="text-sm text-muted-foreground">5 colaboradores prontos para promoção</p>
                  <div className="text-xs text-green-600 mt-1">Economia estimada: R$ 12.5K</div>
                </div>
              </div>

              <div className="flex items-center space-x-3 p-4 bg-white rounded-lg">
                <Target className="h-8 w-8 text-blue-500" />
                <div>
                  <h4 className="font-medium">Planejamento Estratégico</h4>
                  <p className="text-sm text-muted-foreground">Nova estrutura recomendada para Q2</p>
                  <div className="text-xs text-blue-600 mt-1">ROI projetado: 185%</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Content */}
        <Tabs defaultValue="positions" className="space-y-6">
          <TabsList>
            <TabsTrigger value="positions">Cargos e Salários</TabsTrigger>
            <TabsTrigger value="careers">Trilhas de Carreira</TabsTrigger>
            <TabsTrigger value="simulator">Simulador de Impacto</TabsTrigger>
            <TabsTrigger value="equity">Análise de Equidade</TabsTrigger>
          </TabsList>

          <TabsContent value="positions" className="space-y-6">
            {/* Filters */}
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-4">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Buscar cargos..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-9"
                      />
                    </div>
                  </div>
                  <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Departamento" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos os Departamentos</SelectItem>
                      <SelectItem value="ti">TI</SelectItem>
                      <SelectItem value="marketing">Marketing</SelectItem>
                      <SelectItem value="vendas">Vendas</SelectItem>
                      <SelectItem value="rh">RH</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button variant="outline">
                    <Filter className="h-4 w-4 mr-2" />
                    Filtros Avançados
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Positions List */}
            <div className="grid gap-4">
              {mockPositions.map((position) => (
                <Card key={position.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-lg font-semibold">{position.title}</h3>
                          <Badge variant="outline">Nível {position.level}</Badge>
                          <Badge variant="secondary">{position.department}</Badge>
                          <div className={`w-3 h-3 rounded-full ${getRiskColor(position.riskLevel)}`}></div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                          <div>
                            <div className="text-sm text-muted-foreground">Salário Atual</div>
                            <div className="font-semibold">R$ {position.currentSalary.toLocaleString()}</div>
                          </div>
                          <div>
                            <div className="text-sm text-muted-foreground">Média do Mercado</div>
                            <div className="font-semibold">R$ {position.marketAverage.toLocaleString()}</div>
                          </div>
                          <div>
                            <div className="text-sm text-muted-foreground">Score de Equidade</div>
                            <div className="flex items-center space-x-2">
                              <div className="font-semibold">{position.equityScore}%</div>
                              <Progress value={position.equityScore} className="w-16" />
                            </div>
                          </div>
                          <div>
                            <div className="text-sm text-muted-foreground">Colaboradores</div>
                            <div className="font-semibold">{position.employees}</div>
                          </div>
                        </div>
                      </div>

                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">
                          <BarChart3 className="h-4 w-4 mr-2" />
                          Análise
                        </Button>
                        <Button size="sm">
                          <Settings className="h-4 w-4 mr-2" />
                          Editar
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="careers" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Target className="h-5 w-5" />
                  <span>Trilhas de Progressão</span>
                </CardTitle>
                <CardDescription>
                  Caminhos de carreira recomendados pelo BrainSys IAO
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockCareerPaths.map((path) => (
                    <div key={path.id} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <div className="text-sm font-medium">{path.currentPosition}</div>
                          <div className="text-muted-foreground">→</div>
                          <div className="text-sm font-medium text-green-600">{path.nextPosition}</div>
                        </div>
                        <Badge className="bg-green-500">+{path.salaryIncrease}% salário</Badge>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <div className="text-muted-foreground">Tempo Estimado</div>
                          <div className="font-medium">{path.estimatedTime} meses</div>
                        </div>
                        <div className="md:col-span-2">
                          <div className="text-muted-foreground mb-1">Skills Necessárias</div>
                          <div className="flex flex-wrap gap-1">
                            {path.skillsNeeded.map((skill, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {skill}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="simulator" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <DollarSign className="h-5 w-5" />
                  <span>Simulador de Impacto Orçamentário</span>
                </CardTitle>
                <CardDescription>
                  Simule o impacto financeiro de mudanças na estrutura salarial
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-muted-foreground">
                  <DollarSign className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Simulador em desenvolvimento</p>
                  <p className="text-sm">Funcionalidade será implementada na próxima versão</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="equity" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BarChart3 className="h-5 w-5" />
                  <span>Análise de Equidade Salarial</span>
                </CardTitle>
                <CardDescription>
                  Identificação de desalinhamentos e recomendações de ajustes
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-muted-foreground">
                  <BarChart3 className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Análise de equidade em desenvolvimento</p>
                  <p className="text-sm">Algoritmos de ML sendo calibrados</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export { BrainSysCareers as default };