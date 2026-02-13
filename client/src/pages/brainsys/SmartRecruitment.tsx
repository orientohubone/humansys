
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
  Users,
  Brain,
  Search,
  Filter,
  FileText,
  Target,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle,
  Plus,
  Zap,
  Star,
  Eye,
  Download,
  ArrowLeft
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Candidate {
  id: string;
  name: string;
  email: string;
  position: string;
  aiScore: number;
  status: 'new' | 'analyzing' | 'interview' | 'approved' | 'rejected';
  skills: string[];
  experience: string;
  resumeUrl?: string;
  appliedDate: string;
  culturalFit: number;
  technicalFit: number;
  motivationLevel: number;
}

interface JobPosition {
  id: string;
  title: string;
  department: string;
  requirements: string[];
  status: 'active' | 'paused' | 'closed';
  candidatesCount: number;
  aiCriteria: {
    minScore: number;
    requiredSkills: string[];
    culturalFit: boolean;
  };
}

export const BrainSysSmartRecruitment: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState('dashboard');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();

  // Mock data
  const candidates: Candidate[] = [
    {
      id: '1',
      name: 'Ana Silva',
      email: 'ana.silva@email.com',
      position: 'Desenvolvedor Full Stack Senior',
      aiScore: 92,
      status: 'approved',
      skills: ['React', 'Node.js', 'TypeScript', 'PostgreSQL'],
      experience: '5 anos',
      appliedDate: '2024-01-15',
      culturalFit: 88,
      technicalFit: 95,
      motivationLevel: 89
    },
    {
      id: '2',
      name: 'Carlos Mendes',
      email: 'carlos.mendes@email.com',
      position: 'Designer UX/UI',
      aiScore: 78,
      status: 'interview',
      skills: ['Figma', 'Adobe XD', 'Prototyping', 'User Research'],
      experience: '3 anos',
      appliedDate: '2024-01-16',
      culturalFit: 82,
      technicalFit: 75,
      motivationLevel: 77
    },
    {
      id: '3',
      name: 'Mariana Costa',
      email: 'mariana.costa@email.com',
      position: 'Data Scientist',
      aiScore: 85,
      status: 'analyzing',
      skills: ['Python', 'Machine Learning', 'TensorFlow', 'SQL'],
      experience: '4 anos',
      appliedDate: '2024-01-17',
      culturalFit: 79,
      technicalFit: 90,
      motivationLevel: 86
    }
  ];

  const positions: JobPosition[] = [
    {
      id: '1',
      title: 'Desenvolvedor Full Stack Senior',
      department: 'Tecnologia',
      requirements: ['React', 'Node.js', 'TypeScript', '5+ anos experiência'],
      status: 'active',
      candidatesCount: 12,
      aiCriteria: {
        minScore: 80,
        requiredSkills: ['React', 'Node.js'],
        culturalFit: true
      }
    },
    {
      id: '2',
      title: 'Designer UX/UI',
      department: 'Design',
      requirements: ['Figma', 'Adobe Creative Suite', 'Portfolio'],
      status: 'active',
      candidatesCount: 8,
      aiCriteria: {
        minScore: 75,
        requiredSkills: ['Figma', 'UX Design'],
        culturalFit: true
      }
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-blue-500';
      case 'analyzing': return 'bg-yellow-500';
      case 'interview': return 'bg-purple-500';
      case 'approved': return 'bg-green-500';
      case 'rejected': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'new': return 'Novo';
      case 'analyzing': return 'Analisando';
      case 'interview': return 'Entrevista';
      case 'approved': return 'Aprovado';
      case 'rejected': return 'Rejeitado';
      default: return status;
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 80) return 'text-blue-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const handleRunAIAnalysis = () => {
    setIsAnalyzing(true);
    toast({
      title: "🧠 Análise IA Iniciada",
      description: "Processando perfis de candidatos com algoritmos avançados...",
    });
    
    setTimeout(() => {
      setIsAnalyzing(false);
      toast({
        title: "✅ Análise Concluída",
        description: "3 novos candidatos rankeados e 2 perfis atualizados.",
      });
    }, 3000);
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
              <h1 className="text-3xl font-bold">🧠 Smart Recruitment</h1>
              <p className="text-muted-foreground">
                Recrutamento inteligente com IA para identificação de talentos ideais
              </p>
            </div>
          </div>
          <div className="flex space-x-2">
            <Button 
              onClick={handleRunAIAnalysis}
              disabled={isAnalyzing}
              className="bg-purple-600 hover:bg-purple-700"
            >
              {isAnalyzing ? (
                <>
                  <Clock className="mr-2 h-4 w-4 animate-spin" />
                  Analisando...
                </>
              ) : (
                <>
                  <Brain className="mr-2 h-4 w-4" />
                  Executar IA
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Candidatos Ativos</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{candidates.length}</div>
              <div className="text-xs text-muted-foreground">
                +12% vs mês anterior
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Score Médio IA</CardTitle>
              <Brain className="h-4 w-4 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">85%</div>
              <div className="text-xs text-muted-foreground">
                Precisão da análise
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Taxa Aprovação</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">68%</div>
              <div className="text-xs text-muted-foreground">
                +15% com IA
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tempo Médio</CardTitle>
              <Clock className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">3.2d</div>
              <div className="text-xs text-muted-foreground">
                -60% vs manual
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-4">
          <TabsList>
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="candidates">Candidatos</TabsTrigger>
            <TabsTrigger value="positions">Vagas</TabsTrigger>
            <TabsTrigger value="ai-config">Configuração IA</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            {/* AI Analysis Status */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Brain className="h-5 w-5 text-purple-500" />
                  <span>Status da Análise IA</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span>Processamento de CVs</span>
                    <div className="flex items-center space-x-2">
                      <Progress value={100} className="w-32" />
                      <span className="text-sm">100%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Análise de Fit Cultural</span>
                    <div className="flex items-center space-x-2">
                      <Progress value={85} className="w-32" />
                      <span className="text-sm">85%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Matching com Vagas</span>
                    <div className="flex items-center space-x-2">
                      <Progress value={92} className="w-32" />
                      <span className="text-sm">92%</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Top Candidates */}
            <Card>
              <CardHeader>
                <CardTitle>🏆 Top Candidatos IA</CardTitle>
                <CardDescription>
                  Candidatos com maior potencial identificados pela IA
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {candidates
                    .sort((a, b) => b.aiScore - a.aiScore)
                    .slice(0, 3)
                    .map((candidate, index) => (
                      <div key={candidate.id} className="flex items-center space-x-4 p-4 border rounded-lg">
                        <div className="flex-shrink-0">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${
                            index === 0 ? 'bg-yellow-500' : index === 1 ? 'bg-gray-400' : 'bg-amber-600'
                          }`}>
                            {index + 1}
                          </div>
                        </div>
                        <div className="flex-grow">
                          <h4 className="font-semibold">{candidate.name}</h4>
                          <p className="text-sm text-muted-foreground">{candidate.position}</p>
                        </div>
                        <div className="text-right">
                          <div className={`text-2xl font-bold ${getScoreColor(candidate.aiScore)}`}>
                            {candidate.aiScore}%
                          </div>
                          <Badge variant="secondary">
                            {getStatusText(candidate.status)}
                          </Badge>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="candidates" className="space-y-6">
            {/* Search and Filters */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex space-x-4">
                  <div className="flex-1">
                    <Input
                      placeholder="Buscar candidatos..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full"
                    />
                  </div>
                  <Button variant="outline">
                    <Filter className="mr-2 h-4 w-4" />
                    Filtros
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Candidates List */}
            <div className="grid gap-6">
              {candidates.map((candidate) => (
                <Card key={candidate.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-semibold">{candidate.name}</h3>
                        <p className="text-muted-foreground">{candidate.email}</p>
                        <p className="text-sm font-medium text-blue-600">{candidate.position}</p>
                      </div>
                      <div className="text-right">
                        <div className={`text-3xl font-bold ${getScoreColor(candidate.aiScore)}`}>
                          {candidate.aiScore}%
                        </div>
                        <p className="text-xs text-muted-foreground">Score IA</p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {/* Skills */}
                      <div>
                        <h4 className="text-sm font-medium mb-2">Habilidades</h4>
                        <div className="flex flex-wrap gap-2">
                          {candidate.skills.map((skill, index) => (
                            <Badge key={index} variant="secondary">{skill}</Badge>
                          ))}
                        </div>
                      </div>

                      {/* AI Metrics */}
                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <p className="text-xs text-muted-foreground">Fit Cultural</p>
                          <div className="flex items-center space-x-2">
                            <Progress value={candidate.culturalFit} className="flex-1" />
                            <span className="text-sm font-medium">{candidate.culturalFit}%</span>
                          </div>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Fit Técnico</p>
                          <div className="flex items-center space-x-2">
                            <Progress value={candidate.technicalFit} className="flex-1" />
                            <span className="text-sm font-medium">{candidate.technicalFit}%</span>
                          </div>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Motivação</p>
                          <div className="flex items-center space-x-2">
                            <Progress value={candidate.motivationLevel} className="flex-1" />
                            <span className="text-sm font-medium">{candidate.motivationLevel}%</span>
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex justify-between items-center pt-4 border-t">
                        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                          <span>{candidate.experience}</span>
                          <span>•</span>
                          <span>Aplicou em {new Date(candidate.appliedDate).toLocaleDateString('pt-BR')}</span>
                        </div>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm">
                            <Eye className="mr-2 h-4 w-4" />
                            Ver Perfil
                          </Button>
                          <Button variant="outline" size="sm">
                            <FileText className="mr-2 h-4 w-4" />
                            Currículo
                          </Button>
                          <Button size="sm">
                            Agendar Entrevista
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="positions" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Vagas Ativas</h2>
              <Dialog>
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
                      Configure uma nova vaga com critérios de IA
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="job-title">Título da Vaga</Label>
                      <Input id="job-title" placeholder="Ex: Desenvolvedor Full Stack" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="department">Departamento</Label>
                        <Input id="department" placeholder="Tecnologia" />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="min-score">Score Mínimo IA</Label>
                        <Input id="min-score" type="number" placeholder="80" />
                      </div>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="required-skills">Habilidades Obrigatórias</Label>
                      <Input id="required-skills" placeholder="React, Node.js, TypeScript" />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="description">Descrição</Label>
                      <Textarea 
                        id="description" 
                        placeholder="Descreva a vaga e responsabilidades..."
                        rows={4}
                      />
                    </div>
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button variant="outline">Cancelar</Button>
                    <Button>Criar Vaga</Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid gap-4">
              {positions.map((position) => (
                <Card key={position.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{position.title}</CardTitle>
                        <CardDescription>{position.department}</CardDescription>
                      </div>
                      <Badge variant="outline" className="bg-green-50 text-green-700">
                        {position.candidatesCount} candidatos
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <h4 className="text-sm font-medium mb-2">Requisitos</h4>
                        <div className="flex flex-wrap gap-2">
                          {position.requirements.map((req, index) => (
                            <Badge key={index} variant="secondary">{req}</Badge>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="text-sm font-medium mb-2">Critérios IA</h4>
                        <div className="flex items-center space-x-4 text-sm">
                          <span>Score mínimo: <strong>{position.aiCriteria.minScore}%</strong></span>
                          <span>Fit cultural: <strong>{position.aiCriteria.culturalFit ? 'Obrigatório' : 'Opcional'}</strong></span>
                        </div>
                      </div>

                      <div className="flex justify-end space-x-2">
                        <Button variant="outline" size="sm">Ver Candidatos</Button>
                        <Button size="sm">Editar Critérios IA</Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="ai-config" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Brain className="h-5 w-5 text-purple-500" />
                  <span>Configurações de IA</span>
                </CardTitle>
                <CardDescription>
                  Configure os parâmetros de análise inteligente de candidatos
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h4 className="font-medium mb-3">Pesos dos Critérios</h4>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span>Experiência Técnica</span>
                      <div className="flex items-center space-x-2">
                        <Input type="range" min="0" max="100" defaultValue="40" className="w-32" />
                        <span className="text-sm w-12">40%</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Fit Cultural</span>
                      <div className="flex items-center space-x-2">
                        <Input type="range" min="0" max="100" defaultValue="30" className="w-32" />
                        <span className="text-sm w-12">30%</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Potencial de Crescimento</span>
                      <div className="flex items-center space-x-2">
                        <Input type="range" min="0" max="100" defaultValue="20" className="w-32" />
                        <span className="text-sm w-12">20%</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Soft Skills</span>
                      <div className="flex items-center space-x-2">
                        <Input type="range" min="0" max="100" defaultValue="10" className="w-32" />
                        <span className="text-sm w-12">10%</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-3">Parâmetros de Análise</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Score mínimo para aprovação automática</Label>
                      <Input type="number" defaultValue="90" />
                    </div>
                    <div>
                      <Label>Score mínimo para entrevista</Label>
                      <Input type="number" defaultValue="70" />
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-3">Palavras-chave Boost</h4>
                  <Textarea 
                    placeholder="Adicione palavras-chave que aumentam o score (uma por linha)"
                    rows={4}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Palavras-chave que são importantes para sua empresa e devem ter peso extra
                  </p>
                </div>

                <Button className="w-full">
                  <Zap className="mr-2 h-4 w-4" />
                  Salvar Configurações
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default BrainSysSmartRecruitment;
