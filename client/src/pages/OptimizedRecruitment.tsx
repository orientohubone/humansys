
import React, { useState, useEffect, useMemo } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { Briefcase, Plus, Users, FileText, Brain, Filter } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useJobVacancies } from '@/hooks/useJobVacancies';
import { useJobApplications } from '@/hooks/useJobApplications';

interface CandidateView {
  id: string;
  name: string;
  email: string;
  position: string;
  vacancyId: string;
  status: 'applied' | 'reviewing' | 'interview' | 'approved' | 'rejected';
  score: number;
  resumeUrl?: string;
  appliedDate: string;
}

export const OptimizedRecruitment = () => {
  const { toast } = useToast();
  const [isCreatingVacancy, setIsCreatingVacancy] = useState(false);
  const { vacancies, loading: loadingVacancies, createVacancy } = useJobVacancies();
  const { applications, loading: loadingApplications, fetchAllApplications } = useJobApplications();

  const [newVacancy, setNewVacancy] = useState({
    title: '',
    department: '',
    location: '',
    type: 'full-time' as 'full-time' | 'part-time' | 'contract',
    description: ''
  });

  useEffect(() => {
    fetchAllApplications();
  }, [fetchAllApplications]);

  const candidates = useMemo((): CandidateView[] => {
    return applications.map(app => {
      const vacancy = vacancies.find(v => v.id === app.vacancy_id);
      const mockScore = Math.floor(Math.random() * 30) + 70;
      
      return {
        id: app.id,
        name: app.candidate_name,
        email: app.candidate_email,
        position: vacancy?.title || 'Vaga não encontrada',
        vacancyId: app.vacancy_id,
        status: app.status,
        score: mockScore,
        resumeUrl: app.resume_url,
        appliedDate: app.applied_at
      };
    });
  }, [applications, vacancies]);

  const loading = loadingVacancies || loadingApplications;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'paused': return 'bg-yellow-500';
      case 'closed': return 'bg-red-500';
      case 'approved': return 'bg-green-500';
      case 'rejected': return 'bg-red-500';
      case 'interview': return 'bg-blue-500';
      case 'reviewing': return 'bg-purple-500';
      case 'applied': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'Ativa';
      case 'paused': return 'Pausada';
      case 'closed': return 'Fechada';
      case 'approved': return 'Aprovado';
      case 'rejected': return 'Reprovado';
      case 'interview': return 'Entrevista';
      case 'reviewing': return 'Em Análise';
      case 'applied': return 'Novo';
      default: return status;
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const handleCreateVacancy = async () => {
    if (!newVacancy.title.trim() || !newVacancy.description.trim()) {
      return;
    }

    const success = await createVacancy({
      title: newVacancy.title.trim(),
      department: newVacancy.department.trim() || undefined,
      location: newVacancy.location.trim() || undefined,
      type: newVacancy.type,
      description: newVacancy.description.trim(),
      status: 'active'
    });

    if (success) {
      setNewVacancy({
        title: '',
        department: '',
        location: '',
        type: 'full-time',
        description: ''
      });
      setIsCreatingVacancy(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-4 xs:space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl xs:text-3xl font-bold text-gray-900 dark:text-white">Recrutamento e Seleção</h1>
          <p className="text-xs xs:text-sm text-muted-foreground dark:text-gray-400">
            Gerencie vagas e candidatos com IA
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 xs:gap-4">
          <Card className="bg-white dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-3 xs:p-4">
              <CardTitle className="text-xs xs:text-sm font-medium text-gray-900 dark:text-white">Vagas Ativas</CardTitle>
              <Briefcase className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent className="p-3 xs:p-4">
              {loading ? (
                <Skeleton className="h-8 w-16" />
              ) : (
                <div className="text-xl xs:text-2xl font-bold text-gray-900 dark:text-white">
                  {vacancies.filter(v => v.status === 'active').length}
                </div>
              )}
            </CardContent>
          </Card>
          
          <Card className="bg-white dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-3 xs:p-4">
              <CardTitle className="text-xs xs:text-sm font-medium text-gray-900 dark:text-white">Candidatos</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent className="p-3 xs:p-4">
              {loading ? (
                <Skeleton className="h-8 w-16" />
              ) : (
                <div className="text-xl xs:text-2xl font-bold text-gray-900 dark:text-white">{candidates.length}</div>
              )}
            </CardContent>
          </Card>
          
          <Card className="bg-white dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-3 xs:p-4">
              <CardTitle className="text-xs xs:text-sm font-medium text-gray-900 dark:text-white">Em Processo</CardTitle>
              <Filter className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent className="p-3 xs:p-4">
              {loading ? (
                <Skeleton className="h-8 w-16" />
              ) : (
                <div className="text-xl xs:text-2xl font-bold text-gray-900 dark:text-white">
                  {candidates.filter(c => c.status === 'reviewing' || c.status === 'interview').length}
                </div>
              )}
            </CardContent>
          </Card>
          
          <Card className="bg-white dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-3 xs:p-4">
              <CardTitle className="text-xs xs:text-sm font-medium text-gray-900 dark:text-white">IA Ativa</CardTitle>
              <Brain className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent className="p-3 xs:p-4">
              <div className="text-xl xs:text-2xl font-bold text-blue-500">ON</div>
              <p className="text-xs text-muted-foreground dark:text-gray-400">Triagem</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="vacancies" className="space-y-3 xs:space-y-4">
          <TabsList className="grid w-full grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-1 xs:gap-2 h-auto p-1 bg-white dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800">
            <TabsTrigger value="vacancies" className="text-xs xs:text-sm py-1 xs:py-2 px-2 xs:px-3">Vagas</TabsTrigger>
            <TabsTrigger value="candidates" className="text-xs xs:text-sm py-1 xs:py-2 px-2 xs:px-3">Candidatos</TabsTrigger>
            <TabsTrigger value="public-pages" className="text-xs xs:text-sm py-1 xs:py-2 px-2 xs:px-3">Página de Vagas</TabsTrigger>
            <TabsTrigger value="ai-settings" className="text-xs xs:text-sm py-1 xs:py-2 px-2 xs:px-3">Config IA</TabsTrigger>
          </TabsList>

          <TabsContent value="vacancies">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Vagas Disponíveis</h2>
                <Dialog open={isCreatingVacancy} onOpenChange={setIsCreatingVacancy}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="mr-2 h-4 w-4" />
                      Nova Vaga
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>Criar Nova Vaga</DialogTitle>
                      <DialogDescription>
                        Preencha as informações da nova vaga
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid gap-2">
                        <Label htmlFor="job-title">Título da Vaga *</Label>
                        <Input 
                          id="job-title" 
                          placeholder="Ex: Desenvolvedor Full Stack"
                          value={newVacancy.title}
                          onChange={(e) => setNewVacancy({...newVacancy, title: e.target.value})}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                          <Label htmlFor="department">Departamento</Label>
                          <Input 
                            id="department" 
                            placeholder="Tecnologia"
                            value={newVacancy.department}
                            onChange={(e) => setNewVacancy({...newVacancy, department: e.target.value})}
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="location">Localização</Label>
                          <Input 
                            id="location" 
                            placeholder="São Paulo, SP"
                            value={newVacancy.location}
                            onChange={(e) => setNewVacancy({...newVacancy, location: e.target.value})}
                          />
                        </div>
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="type">Tipo de Contrato</Label>
                        <Select value={newVacancy.type} onValueChange={(value: any) => setNewVacancy({...newVacancy, type: value})}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="full-time">Tempo Integral</SelectItem>
                            <SelectItem value="part-time">Meio Período</SelectItem>
                            <SelectItem value="contract">Contrato</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="description">Descrição *</Label>
                        <Textarea 
                          id="description" 
                          placeholder="Descreva a vaga, requisitos e responsabilidades..."
                          rows={4}
                          value={newVacancy.description}
                          onChange={(e) => setNewVacancy({...newVacancy, description: e.target.value})}
                        />
                      </div>
                    </div>
                    <div className="flex justify-end space-x-2">
                      <Button variant="outline" onClick={() => setIsCreatingVacancy(false)}>
                        Cancelar
                      </Button>
                      <Button onClick={handleCreateVacancy}>
                        Criar Vaga
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>

              {loading ? (
                <div className="grid gap-4">
                  {[1, 2, 3].map((i) => (
                    <Card key={i}>
                      <CardHeader>
                        <Skeleton className="h-6 w-3/4 mb-2" />
                        <Skeleton className="h-4 w-1/2" />
                      </CardHeader>
                      <CardContent>
                        <Skeleton className="h-10 w-full" />
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="grid gap-4">
                  {vacancies.map((vacancy) => {
                    const applicationsCount = applications.filter(app => app.vacancy_id === vacancy.id).length;
                    return (
                      <Card key={vacancy.id}>
                        <CardHeader>
                          <div className="flex justify-between items-start">
                            <div>
                              <CardTitle className="text-lg">{vacancy.title}</CardTitle>
                              <CardDescription>
                                {vacancy.department || 'Sem departamento'} • {vacancy.location || 'Localização não informada'}
                              </CardDescription>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Badge variant="outline">
                                {vacancy.type === 'full-time' ? 'Tempo Integral' : 
                                 vacancy.type === 'part-time' ? 'Meio Período' : 'Contrato'}
                              </Badge>
                              <div className={`h-3 w-3 rounded-full ${getStatusColor(vacancy.status)}`} />
                              <span className="text-sm">{getStatusText(vacancy.status)}</span>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="flex justify-between items-center">
                            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                              <span>{applicationsCount} candidatos</span>
                              <span>Publicada em {new Date(vacancy.created_at).toLocaleDateString('pt-BR')}</span>
                            </div>
                            <div className="flex space-x-2">
                              <Button variant="outline" size="sm">Ver Candidatos</Button>
                              <Button size="sm">Editar</Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                  {vacancies.length === 0 && (
                    <Card>
                      <CardContent className="py-8 text-center">
                        <p className="text-muted-foreground">Nenhuma vaga cadastrada ainda. Crie sua primeira vaga!</p>
                      </CardContent>
                    </Card>
                  )}
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="candidates">
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Candidatos</h2>
              
              {loading ? (
                <div className="grid gap-4">
                  {[1, 2, 3].map((i) => (
                    <Card key={i}>
                      <CardHeader>
                        <Skeleton className="h-6 w-1/2 mb-2" />
                        <Skeleton className="h-4 w-1/3 mb-2" />
                        <Skeleton className="h-4 w-2/3" />
                      </CardHeader>
                      <CardContent>
                        <Skeleton className="h-10 w-full" />
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="grid gap-4">
                  {candidates.map((candidate) => (
                    <Card key={candidate.id}>
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="text-lg">{candidate.name}</CardTitle>
                            <CardDescription>{candidate.email}</CardDescription>
                            <p className="text-sm text-muted-foreground mt-1">
                              Aplicou para: {candidate.position}
                            </p>
                          </div>
                          <div className="flex items-center space-x-3">
                            <div className="text-right">
                              <div className={`text-2xl font-bold ${getScoreColor(candidate.score)}`}>
                                {candidate.score}%
                              </div>
                              <p className="text-xs text-muted-foreground">Score IA</p>
                            </div>
                            <Badge className={getStatusColor(candidate.status)}>
                              {getStatusText(candidate.status)}
                            </Badge>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="flex justify-between items-center">
                          <div className="text-sm text-muted-foreground">
                            Aplicou em {new Date(candidate.appliedDate).toLocaleDateString('pt-BR')}
                          </div>
                          <div className="flex space-x-2">
                            <Button variant="outline" size="sm">
                              <FileText className="mr-2 h-4 w-4" />
                              Ver Currículo
                            </Button>
                            <Button variant="outline" size="sm">
                              Agendar Entrevista
                            </Button>
                            <Button size="sm">
                              Avaliar
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                  {candidates.length === 0 && (
                    <Card>
                      <CardContent className="py-8 text-center">
                        <p className="text-muted-foreground">Nenhum candidato registrado ainda.</p>
                      </CardContent>
                    </Card>
                  )}
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="ai-settings">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Brain className="mr-2 h-5 w-5" />
                  Configurações da IA
                </CardTitle>
                <CardDescription>
                  Configure os parâmetros da triagem inteligente de currículos
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h4 className="font-medium mb-2">Critérios de Triagem</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span>Experiência mínima (anos)</span>
                      <Input type="number" defaultValue="2" className="w-20" />
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Score mínimo para aprovação</span>
                      <Input type="number" defaultValue="70" className="w-20" />
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Palavras-chave obrigatórias</span>
                      <Input placeholder="React, Node.js, JavaScript" className="w-64" />
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">Categorização Automática</h4>
                  <div className="grid gap-2 text-sm">
                    <div className="flex justify-between">
                      <span>Score 90-100%:</span>
                      <Badge className="bg-green-500">Perfil Alinhado</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Score 70-89%:</span>
                      <Badge className="bg-yellow-500">Perfil em Potencial</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Score 0-69%:</span>
                      <Badge className="bg-red-500">Sem Perfil</Badge>
                    </div>
                  </div>
                </div>

                <Button onClick={() => toast({ title: "Configurações salvas!" })}>
                  Salvar Configurações
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="public-pages">
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-semibold">Página Pública de Vagas</h2>
                  <p className="text-muted-foreground">
                    Configure páginas personalizadas onde candidatos externos podem se inscrever
                  </p>
                </div>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Nova Página de Vaga
                </Button>
              </div>

              {/* Configuration Card */}
              <Card>
                <CardHeader>
                  <CardTitle>Configuração da Página</CardTitle>
                  <CardDescription>
                    Personalize a aparência e funcionalidade da sua página de vagas
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="company-name">Nome da Empresa</Label>
                        <Input 
                          id="company-name" 
                          placeholder="Digite o nome da empresa"
                          defaultValue="HumanSys"
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="company-logo">Logo da Empresa</Label>
                        <div className="flex items-center space-x-2">
                          <Input 
                            id="company-logo" 
                            type="file" 
                            accept="image/*"
                            className="flex-1"
                          />
                          <Button variant="outline" size="sm">Upload</Button>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          PNG, JPG até 2MB. Recomendado: 200x200px
                        </p>
                      </div>

                      <div>
                        <Label htmlFor="company-description">Descrição da Empresa</Label>
                        <Textarea 
                          id="company-description"
                          placeholder="Fale sobre sua empresa, missão e valores..."
                          rows={4}
                        />
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="contact-email">E-mail de Contato</Label>
                        <Input 
                          id="contact-email" 
                          type="email"
                          placeholder="rh@empresa.com"
                        />
                      </div>

                      <div>
                        <Label htmlFor="company-website">Site da Empresa</Label>
                        <Input 
                          id="company-website" 
                          placeholder="https://www.empresa.com"
                        />
                      </div>

                      <div>
                        <Label htmlFor="company-location">Localização</Label>
                        <Input 
                          id="company-location" 
                          placeholder="São Paulo, SP"
                        />
                      </div>

                      <div>
                        <Label>Cor Principal da Página</Label>
                        <div className="flex space-x-2 mt-2">
                          <div className="w-8 h-8 bg-blue-500 rounded cursor-pointer border-2 border-gray-300"></div>
                          <div className="w-8 h-8 bg-green-500 rounded cursor-pointer"></div>
                          <div className="w-8 h-8 bg-purple-500 rounded cursor-pointer"></div>
                          <div className="w-8 h-8 bg-red-500 rounded cursor-pointer"></div>
                          <div className="w-8 h-8 bg-yellow-500 rounded cursor-pointer"></div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <h4 className="font-medium mb-3">Configurações de Candidatura</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-center space-x-2">
                        <input type="checkbox" id="require-resume" defaultChecked />
                        <Label htmlFor="require-resume">Exigir currículo (PDF)</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input type="checkbox" id="require-linkedin" />
                        <Label htmlFor="require-linkedin">Solicitar LinkedIn</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input type="checkbox" id="require-portfolio" />
                        <Label htmlFor="require-portfolio">Solicitar portfólio</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input type="checkbox" id="require-cover-letter" />
                        <Label htmlFor="require-cover-letter">Carta de apresentação</Label>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end space-x-2">
                    <Button variant="outline">Visualizar Página</Button>
                    <Button>Salvar Configurações</Button>
                  </div>
                </CardContent>
              </Card>

              {/* Active Job Pages */}
              <Card>
                <CardHeader>
                  <CardTitle>Páginas de Vagas Ativas</CardTitle>
                  <CardDescription>
                    Vagas que estão disponíveis para candidatura externa
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {vacancies.filter(v => v.status === 'active').map((vacancy) => {
                      const applicationsCount = applications.filter(app => app.vacancy_id === vacancy.id).length;
                      return (
                        <div key={vacancy.id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex-1">
                            <h4 className="font-medium">{vacancy.title}</h4>
                            <p className="text-sm text-muted-foreground">
                              {vacancy.department || 'Sem departamento'} • {vacancy.location || 'Localização não informada'} • {applicationsCount} candidatos
                            </p>
                            <div className="flex items-center space-x-2 mt-2">
                              <Badge variant="outline" className="bg-green-50 text-green-700">
                                Página Ativa
                              </Badge>
                              <span className="text-xs text-muted-foreground">
                                URL: /vagas/{vacancy.id}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => window.open(`/vagas/${vacancy.id}`, '_blank')}
                            >
                              Ver Página
                            </Button>
                            <Button variant="outline" size="sm">
                              Candidatos
                            </Button>
                            <Button variant="outline" size="sm">
                              Editar
                            </Button>
                          </div>
                        </div>
                      );
                    })}
                    {vacancies.filter(v => v.status === 'active').length === 0 && (
                      <p className="text-muted-foreground text-center py-4">Nenhuma vaga ativa no momento.</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};
