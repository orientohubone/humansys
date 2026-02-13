
import React, { useState, useEffect, useMemo } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { Users, UserPlus, Search, Mail, Phone, MapPin, Calendar, Briefcase } from 'lucide-react';
import { useJobVacancies } from '@/hooks/useJobVacancies';
import { useJobApplications } from '@/hooks/useJobApplications';

interface CandidateView {
  id: string;
  name: string;
  email: string;
  phone?: string;
  position: string;
  vacancyId: string;
  experience: string;
  location?: string;
  status: 'applied' | 'reviewing' | 'interview' | 'approved' | 'rejected';
  applied_at: string;
  notes?: string;
}

export const Recruitment = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddingCandidate, setIsAddingCandidate] = useState(false);
  const [selectedVacancyForApp, setSelectedVacancyForApp] = useState('');
  const { vacancies, loading: loadingVacancies } = useJobVacancies();
  const { applications, loading: loadingApplications, createApplication, fetchAllApplications } = useJobApplications();

  const [newCandidate, setNewCandidate] = useState({
    name: '',
    email: '',
    phone: '',
    vacancy_id: '',
    experience_years: '',
    availability: '',
    notes: ''
  });

  useEffect(() => {
    fetchAllApplications();
  }, [fetchAllApplications]);

  const candidates = useMemo((): CandidateView[] => {
    return applications.map(app => {
      const vacancy = vacancies.find(v => v.id === app.vacancy_id);
      return {
        id: app.id,
        name: app.candidate_name,
        email: app.candidate_email,
        phone: app.candidate_phone,
        position: vacancy?.title || 'Vaga não encontrada',
        vacancyId: app.vacancy_id,
        experience: app.experience_years ? `${app.experience_years} anos` : 'Não informado',
        location: app.availability || undefined,
        status: app.status,
        applied_at: app.applied_at,
        notes: app.notes
      };
    });
  }, [applications, vacancies]);

  const handleAddCandidate = async () => {
    if (!newCandidate.name.trim() || !newCandidate.email.trim() || !newCandidate.vacancy_id) {
      return;
    }

    const success = await createApplication({
      vacancy_id: newCandidate.vacancy_id,
      candidate_name: newCandidate.name.trim(),
      candidate_email: newCandidate.email.trim(),
      candidate_phone: newCandidate.phone.trim() || undefined,
      experience_years: newCandidate.experience_years ? parseInt(newCandidate.experience_years) : undefined,
      availability: newCandidate.availability.trim() || undefined,
      notes: newCandidate.notes.trim() || undefined,
      status: 'applied'
    });

    if (success) {
      setNewCandidate({
        name: '',
        email: '',
        phone: '',
        vacancy_id: '',
        experience_years: '',
        availability: '',
        notes: ''
      });
      setIsAddingCandidate(false);
      await fetchAllApplications();
    }
  };

  const filteredCandidates = candidates.filter(candidate =>
    candidate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    candidate.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    candidate.position.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'applied': return 'bg-blue-500';
      case 'reviewing': return 'bg-purple-500';
      case 'interview': return 'bg-yellow-500';
      case 'approved': return 'bg-green-500';
      case 'rejected': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'applied': return 'Novo';
      case 'reviewing': return 'Em Análise';
      case 'interview': return 'Entrevista';
      case 'approved': return 'Aprovado';
      case 'rejected': return 'Rejeitado';
      default: return 'Desconhecido';
    }
  };

  const newCount = candidates.filter(c => c.status === 'applied').length;
  const interviewCount = candidates.filter(c => c.status === 'interview').length;
  const activePositionsCount = vacancies.filter(v => v.status === 'active').length;

  const loading = loadingVacancies || loadingApplications;

  return (
    <DashboardLayout>
      <div className="space-y-4 xs:space-y-6">
        {/* Header */}
        <div className="flex flex-col xs:flex-row justify-between items-start xs:items-center gap-3 xs:gap-0">
          <div>
            <h1 className="text-2xl xs:text-3xl font-bold text-gray-900 dark:text-white">Recrutamento</h1>
            <p className="text-xs xs:text-sm text-muted-foreground dark:text-gray-400">
              Gerencie candidatos e vagas abertas ({candidates.length} candidatos)
            </p>
          </div>

          <Dialog open={isAddingCandidate} onOpenChange={setIsAddingCandidate}>
            <DialogTrigger asChild>
              <Button className="bg-blue-600 hover:bg-blue-700 text-white w-full xs:w-auto">
                <UserPlus className="mr-2 h-4 w-4" />
                Novo Candidato
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Adicionar Novo Candidato</DialogTitle>
                <DialogDescription>
                  Preencha as informações do candidato
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Nome Completo *</Label>
                  <Input 
                    id="name" 
                    placeholder="Digite o nome completo"
                    value={newCandidate.name}
                    onChange={(e) => setNewCandidate({...newCandidate, name: e.target.value})}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="Digite o email"
                    value={newCandidate.email}
                    onChange={(e) => setNewCandidate({...newCandidate, email: e.target.value})}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="phone">Telefone</Label>
                  <Input 
                    id="phone" 
                    placeholder="Digite o telefone"
                    value={newCandidate.phone}
                    onChange={(e) => setNewCandidate({...newCandidate, phone: e.target.value})}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="vacancy">Vaga *</Label>
                  <Select value={newCandidate.vacancy_id} onValueChange={(value) => setNewCandidate({...newCandidate, vacancy_id: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a vaga" />
                    </SelectTrigger>
                    <SelectContent>
                      {vacancies.filter(v => v.status === 'active').map(vacancy => (
                        <SelectItem key={vacancy.id} value={vacancy.id}>
                          {vacancy.title} - {vacancy.department || 'Sem departamento'}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="experience_years">Anos de Experiência</Label>
                  <Input 
                    id="experience_years" 
                    type="number"
                    placeholder="Ex: 3"
                    value={newCandidate.experience_years}
                    onChange={(e) => setNewCandidate({...newCandidate, experience_years: e.target.value})}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="availability">Disponibilidade</Label>
                  <Input 
                    id="availability" 
                    placeholder="Ex: Imediato, 30 dias"
                    value={newCandidate.availability}
                    onChange={(e) => setNewCandidate({...newCandidate, availability: e.target.value})}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="notes">Observações</Label>
                  <Textarea 
                    id="notes" 
                    placeholder="Observações sobre o candidato"
                    value={newCandidate.notes}
                    onChange={(e) => setNewCandidate({...newCandidate, notes: e.target.value})}
                    rows={3}
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsAddingCandidate(false)}>
                  Cancelar
                </Button>
                <Button 
                  onClick={handleAddCandidate}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Criar
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 xs:gap-4">
          <Card className="bg-white dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-3 xs:p-4">
              <CardTitle className="text-xs xs:text-sm font-medium text-gray-900 dark:text-white">Total</CardTitle>
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
              <CardTitle className="text-xs xs:text-sm font-medium text-gray-900 dark:text-white">Novos</CardTitle>
              <div className="h-2 w-2 bg-blue-500 rounded-full"></div>
            </CardHeader>
            <CardContent className="p-3 xs:p-4">
              {loading ? (
                <Skeleton className="h-8 w-16" />
              ) : (
                <div className="text-xl xs:text-2xl font-bold text-gray-900 dark:text-white">{newCount}</div>
              )}
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-3 xs:p-4">
              <CardTitle className="text-xs xs:text-sm font-medium text-gray-900 dark:text-white">Entrevista</CardTitle>
              <div className="h-2 w-2 bg-yellow-500 rounded-full"></div>
            </CardHeader>
            <CardContent className="p-3 xs:p-4">
              {loading ? (
                <Skeleton className="h-8 w-16" />
              ) : (
                <div className="text-xl xs:text-2xl font-bold text-gray-900 dark:text-white">{interviewCount}</div>
              )}
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-3 xs:p-4">
              <CardTitle className="text-xs xs:text-sm font-medium text-gray-900 dark:text-white">Vagas</CardTitle>
              <Briefcase className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent className="p-3 xs:p-4">
              {loading ? (
                <Skeleton className="h-8 w-16" />
              ) : (
                <div className="text-xl xs:text-2xl font-bold text-gray-900 dark:text-white">{activePositionsCount}</div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Vagas Ativas */}
        <Card className="bg-white dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800">
          <CardHeader className="p-3 xs:p-4">
            <CardTitle className="text-base xs:text-lg text-gray-900 dark:text-white">Vagas Ativas</CardTitle>
            <CardDescription className="text-xs xs:text-sm dark:text-gray-400">Posições abertas</CardDescription>
          </CardHeader>
          <CardContent className="p-3 xs:p-4">
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 xs:gap-3">
                {[1, 2, 3, 4].map((i) => (
                  <Card key={i} className="border-l-4 border-l-blue-500 dark:bg-gray-800/50">
                    <CardContent className="pt-3 xs:pt-4">
                      <Skeleton className="h-6 w-3/4 mb-2" />
                      <Skeleton className="h-4 w-1/2 mb-3 xs:mb-4" />
                      <Skeleton className="h-6 w-24" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 xs:gap-3">
                {vacancies.filter(v => v.status === 'active').map((vacancy) => {
                  const applicationsCount = applications.filter(app => app.vacancy_id === vacancy.id).length;
                  return (
                    <Card key={vacancy.id} className="border-l-4 border-l-blue-500 bg-white dark:bg-gray-800/50 dark:border-gray-700">
                      <CardContent className="pt-3 xs:pt-4">
                        <div className="flex justify-between items-start gap-2">
                          <div className="min-w-0 flex-1">
                            <h3 className="font-semibold text-sm xs:text-base text-gray-900 dark:text-white truncate">{vacancy.title}</h3>
                            <p className="text-xs xs:text-sm text-muted-foreground dark:text-gray-400 truncate">{vacancy.department || 'Sem dept'}</p>
                            <Badge variant="outline" className="mt-2 text-xs">
                              {vacancy.type === 'full-time' ? 'Integral' : 
                               vacancy.type === 'part-time' ? 'Período' : 'Contrato'}
                            </Badge>
                          </div>
                          <div className="text-right flex-shrink-0">
                            <p className="text-xs xs:text-sm font-medium text-gray-900 dark:text-white">{applicationsCount}</p>
                            <Badge variant="secondary" className="mt-1 text-xs">
                              {vacancy.status === 'active' ? 'Ativa' : vacancy.status === 'paused' ? 'Pausada' : 'Fechada'}
                            </Badge>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
                {vacancies.filter(v => v.status === 'active').length === 0 && (
                  <p className="text-xs xs:text-sm text-muted-foreground dark:text-gray-400 text-center col-span-full py-4">
                    Nenhuma vaga ativa
                  </p>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Search */}
        <Card className="bg-white dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800">
          <CardHeader className="p-3 xs:p-4">
            <CardTitle className="text-base xs:text-lg text-gray-900 dark:text-white">Buscar Candidatos</CardTitle>
          </CardHeader>
          <CardContent className="p-3 xs:p-4">
            <div className="flex items-center space-x-2">
              <Search className="h-4 w-4 text-muted-foreground flex-shrink-0" />
              <Input
                placeholder="Nome, email ou vaga..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1 text-sm"
              />
            </div>
          </CardContent>
        </Card>

        {/* Lista de Candidatos */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 xs:gap-4">
          {filteredCandidates.map((candidate) => (
            <Card key={candidate.id} className="bg-white dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800 hover:shadow-lg dark:hover:shadow-lg/50 transition-shadow">
              <CardHeader className="p-3 xs:p-4">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <h3 className="font-semibold text-sm xs:text-base text-gray-900 dark:text-white truncate">{candidate.name}</h3>
                    <p className="text-xs xs:text-sm text-muted-foreground dark:text-gray-400 truncate">{candidate.position}</p>
                  </div>
                  <div className={`h-3 w-3 rounded-full flex-shrink-0 ${getStatusColor(candidate.status)}`} />
                </div>
              </CardHeader>
              <CardContent className="space-y-2 xs:space-y-3 p-3 xs:p-4">
                <div className="space-y-1 xs:space-y-2">
                  <Badge variant="outline" className="text-xs">{getStatusText(candidate.status)}</Badge>
                  {candidate.experience && (
                    <Badge variant="secondary" className="text-xs">{candidate.experience}</Badge>
                  )}
                </div>

                <div className="space-y-1 xs:space-y-2 text-xs xs:text-sm">
                  <div className="flex items-center text-muted-foreground dark:text-gray-400 gap-1 min-w-0">
                    <Mail className="h-3 w-3 flex-shrink-0" />
                    <span className="truncate">{candidate.email}</span>
                  </div>
                  {candidate.phone && (
                    <div className="flex items-center text-muted-foreground dark:text-gray-400 gap-1 min-w-0">
                      <Phone className="h-3 w-3 flex-shrink-0" />
                      <span className="truncate">{candidate.phone}</span>
                    </div>
                  )}
                  {candidate.location && (
                    <div className="flex items-center text-muted-foreground dark:text-gray-400 gap-1 min-w-0">
                      <MapPin className="h-3 w-3 flex-shrink-0" />
                      <span className="truncate">{candidate.location}</span>
                    </div>
                  )}
                  <div className="flex items-center text-muted-foreground dark:text-gray-400 gap-1">
                    <Calendar className="h-3 w-3 flex-shrink-0" />
                    <span className="text-xs">{new Date(candidate.applied_at).toLocaleDateString('pt-BR')}</span>
                  </div>
                </div>

                {candidate.notes && (
                  <div className="mt-2 xs:mt-3 p-2 bg-muted dark:bg-gray-800/50 rounded text-xs">
                    {candidate.notes}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Estado vazio */}
        {filteredCandidates.length === 0 && (
          <Card className="bg-white dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800">
            <CardContent className="py-6 xs:py-8">
              <div className="text-center">
                <Users className="h-10 xs:h-12 w-10 xs:w-12 text-muted-foreground dark:text-gray-500 mx-auto mb-3 xs:mb-4" />
                <h3 className="text-base xs:text-lg font-medium mb-2 text-gray-900 dark:text-white">Nenhum candidato</h3>
                <p className="text-xs xs:text-sm text-muted-foreground dark:text-gray-400 mb-3 xs:mb-4">
                  {searchTerm ? 'Tente ajustar sua busca' : 'Comece adicionando candidatos'}
                </p>
                {!searchTerm && (
                  <Button 
                    onClick={() => setIsAddingCandidate(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white text-sm"
                  >
                    <UserPlus className="mr-2 h-4 w-4" />
                    Adicionar Primeiro
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
};
