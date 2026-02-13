import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  MapPin, 
  Clock, 
  Building2, 
  Users, 
  Globe, 
  Mail, 
  Upload,
  CheckCircle,
  Star,
  Calendar
} from 'lucide-react';

interface JobApplication {
  candidate_name: string;
  candidate_email: string;
  candidate_phone: string;
  linkedin_url: string;
  portfolio_url: string;
  cover_letter: string;
  experience_years: number;
  current_salary: number;
  expected_salary: number;
  availability: string;
}

export const PublicJobPage = () => {
  const { jobId } = useParams<{ jobId: string }>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [application, setApplication] = useState<JobApplication>({
    candidate_name: '',
    candidate_email: '',
    candidate_phone: '',
    linkedin_url: '',
    portfolio_url: '',
    cover_letter: '',
    experience_years: 0,
    current_salary: 0,
    expected_salary: 0,
    availability: 'immediate'
  });

  // Mock job data for testing
  const displayJobData = {
    id: jobId || 'dev-frontend-1',
    title: 'Desenvolvedor Frontend React',
    company: {
      name: 'HumanSys Tech',
      logo: '/logo.png',
      description: 'Empresa líder em soluções de RH',
      website: 'https://humansys.com.br',
      location: 'São Paulo, SP',
      size: '51-200 funcionários'
    },
    department: 'Tecnologia',
    location: 'São Paulo, SP',
    type: 'full-time',
    level: 'Pleno/Senior',
    salary_range: 'R$ 8.000 - R$ 12.000',
    description: 'Procuramos um desenvolvedor frontend experiente em React e TypeScript para integrar nossa equipe.',
    requirements: [
      '3+ anos de experiência com React',
      'Conhecimento em TypeScript',
      'Experiência com Tailwind CSS',
      'Git e metodologias ágeis'
    ],
    benefits: [
      'Plano de saúde',
      'Vale refeição',
      'Home office',
      'Horário flexível'
    ],
    posted_date: '2025-01-20',
    deadline: '2025-02-20'
  };

  const updateApplication = (field: keyof JobApplication, value: string | number) => {
    setApplication(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmitApplication = async () => {
    if (!application.candidate_name || !application.candidate_email) {
      alert('Nome e e-mail são obrigatórios.');
      return;
    }

    setIsSubmitting(true);
    
    // Simular envio
    setTimeout(() => {
      alert('Candidatura enviada com sucesso! Entraremos em contato em breve.');
      setIsSubmitting(false);
      // Reset form
      setApplication({
        candidate_name: '',
        candidate_email: '',
        candidate_phone: '',
        linkedin_url: '',
        portfolio_url: '',
        cover_letter: '',
        experience_years: 0,
        current_salary: 0,
        expected_salary: 0,
        availability: 'immediate'
      });
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <div className="bg-white dark:bg-gray-900 shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <img 
                src={displayJobData.company.logo} 
                alt={displayJobData.company.name}
                className="h-12 w-12 rounded-lg object-cover"
                onError={(e) => {
                  e.currentTarget.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='48' height='48' viewBox='0 0 24 24' fill='none' stroke='%236B7280' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z'%3E%3C/path%3E%3Cpolyline points='9,22 9,12 15,12 15,22'%3E%3C/polyline%3E%3C/svg%3E";
                }}
              />
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{displayJobData.title}</h1>
                <p className="text-gray-600 dark:text-gray-400">{displayJobData.company.name}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                Vaga Ativa
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Job Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Job Info */}
            <Card>
              <CardHeader>
                <CardTitle>Detalhes da Vaga</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center space-x-3">
                    <MapPin className="h-5 w-5 text-gray-500" />
                    <span className="text-gray-700 dark:text-gray-300">{displayJobData.location}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Building2 className="h-5 w-5 text-gray-500" />
                    <span className="text-gray-700 dark:text-gray-300">{displayJobData.type}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Users className="h-5 w-5 text-gray-500" />
                    <span className="text-gray-700 dark:text-gray-300">{displayJobData.level}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Clock className="h-5 w-5 text-gray-500" />
                    <span className="text-gray-700 dark:text-gray-300">{displayJobData.salary_range}</span>
                  </div>
                </div>
                
                <Separator />
                
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Descrição</h3>
                  <p className="text-gray-700 dark:text-gray-300">{displayJobData.description}</p>
                </div>
                
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Requisitos</h3>
                  <ul className="list-disc list-inside space-y-1">
                    {displayJobData.requirements.map((req, index) => (
                      <li key={index} className="text-gray-700 dark:text-gray-300">{req}</li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Benefícios</h3>
                  <ul className="list-disc list-inside space-y-1">
                    {displayJobData.benefits.map((benefit, index) => (
                      <li key={index} className="text-gray-700 dark:text-gray-300">{benefit}</li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Application Form */}
            <Card>
              <CardHeader>
                <CardTitle>Candidatar-se à Vaga</CardTitle>
                <CardDescription>
                  Preencha o formulário abaixo para enviar sua candidatura
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="candidate_name">Nome Completo *</Label>
                    <Input
                      id="candidate_name"
                      value={application.candidate_name}
                      onChange={(e) => updateApplication('candidate_name', e.target.value)}
                      placeholder="Seu nome completo"
                    />
                  </div>
                  <div>
                    <Label htmlFor="candidate_email">E-mail *</Label>
                    <Input
                      id="candidate_email"
                      type="email"
                      value={application.candidate_email}
                      onChange={(e) => updateApplication('candidate_email', e.target.value)}
                      placeholder="seu.email@exemplo.com"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="candidate_phone">Telefone</Label>
                    <Input
                      id="candidate_phone"
                      value={application.candidate_phone}
                      onChange={(e) => updateApplication('candidate_phone', e.target.value)}
                      placeholder="(11) 99999-9999"
                    />
                  </div>
                  <div>
                    <Label htmlFor="linkedin_url">LinkedIn</Label>
                    <Input
                      id="linkedin_url"
                      value={application.linkedin_url}
                      onChange={(e) => updateApplication('linkedin_url', e.target.value)}
                      placeholder="https://linkedin.com/in/seuperfil"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="portfolio_url">Portfólio/GitHub</Label>
                  <Input
                    id="portfolio_url"
                    value={application.portfolio_url}
                    onChange={(e) => updateApplication('portfolio_url', e.target.value)}
                    placeholder="https://github.com/seuusuario"
                  />
                </div>

                <div>
                  <Label htmlFor="cover_letter">Carta de Apresentação</Label>
                  <Textarea
                    id="cover_letter"
                    value={application.cover_letter}
                    onChange={(e) => updateApplication('cover_letter', e.target.value)}
                    placeholder="Conte-nos por que você é o candidato ideal para esta vaga..."
                    rows={5}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="experience_years">Anos de Experiência</Label>
                    <Input
                      id="experience_years"
                      type="number"
                      value={application.experience_years}
                      onChange={(e) => updateApplication('experience_years', parseInt(e.target.value) || 0)}
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <Label htmlFor="current_salary">Salário Atual (R$)</Label>
                    <Input
                      id="current_salary"
                      type="number"
                      value={application.current_salary}
                      onChange={(e) => updateApplication('current_salary', parseInt(e.target.value) || 0)}
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <Label htmlFor="expected_salary">Pretensão Salarial (R$)</Label>
                    <Input
                      id="expected_salary"
                      type="number"
                      value={application.expected_salary}
                      onChange={(e) => updateApplication('expected_salary', parseInt(e.target.value) || 0)}
                      placeholder="0"
                    />
                  </div>
                </div>

                <Button 
                  onClick={handleSubmitApplication}
                  disabled={isSubmitting}
                  className="w-full"
                >
                  {isSubmitting ? 'Enviando...' : 'Enviar Candidatura'}
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Company Info */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Sobre a Empresa</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <img 
                    src={displayJobData.company.logo} 
                    alt={displayJobData.company.name}
                    className="h-16 w-16 rounded-lg object-cover mx-auto mb-4"
                    onError={(e) => {
                      e.currentTarget.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='64' height='64' viewBox='0 0 24 24' fill='none' stroke='%236B7280' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z'%3E%3C/path%3E%3Cpolyline points='9,22 9,12 15,12 15,22'%3E%3C/polyline%3E%3C/svg%3E";
                    }}
                  />
                  <h3 className="font-semibold text-gray-900 dark:text-white">{displayJobData.company.name}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{displayJobData.company.size}</p>
                </div>
                
                <Separator />
                
                <div>
                  <p className="text-gray-700 dark:text-gray-300 text-sm">{displayJobData.company.description}</p>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center space-x-3">
                    <MapPin className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-700 dark:text-gray-300">{displayJobData.company.location}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Globe className="h-4 w-4 text-gray-500" />
                    <a 
                      href={displayJobData.company.website} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 hover:underline"
                    >
                      Ver site da empresa
                    </a>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Informações da Vaga</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Publicada em:</span>
                  <span className="text-sm font-medium">{new Date(displayJobData.posted_date).toLocaleDateString('pt-BR')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Prazo:</span>
                  <span className="text-sm font-medium">{new Date(displayJobData.deadline).toLocaleDateString('pt-BR')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Departamento:</span>
                  <span className="text-sm font-medium">{displayJobData.department}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PublicJobPage;