import React, { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  MessageSquare, 
  Plus, 
  Search, 
  Star, 
  TrendingUp, 
  Users, 
  Filter,
  Target,
  Award
} from 'lucide-react';
import { useFeedback } from '@/hooks/useFeedback';
import { useCollaborators } from '@/hooks/useCollaborators';
import { AdvancedFeedbackDialog } from '@/components/feedback/AdvancedFeedbackDialog';
import { ConnectionStatus } from '@/components/feedback/ConnectionStatus';
import { StructuredFeedbackForm } from '@/components/feedback/StructuredFeedbackForm';
import { FeedbackHistory } from '@/components/feedback/FeedbackHistory';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface FeedbackItem {
  id: string;
  fromUser: string;
  toUser: string;
  type: 'performance' | '360' | 'peer' | 'self';
  status: 'pending' | 'completed' | 'overdue';
  rating?: number;
  content?: string;
  createdDate: string;
  dueDate?: string;
  subject?: string;
  toEmail?: string;
  urgent?: boolean;
  sendEmail?: boolean;
  sendNotification?: boolean;
  anonymous?: boolean;
}

export const Feedback = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreatingFeedback, setIsCreatingFeedback] = useState(false);
  const [selectedCollaborator, setSelectedCollaborator] = useState<any>(null);
  const [feedbackType, setFeedbackType] = useState<'traditional' | 'structured'>('structured');
  
  const { feedbacks, isLoading, error, createFeedback } = useFeedback();
  const { collaborators } = useCollaborators();
  const { toast } = useToast();

  // Mock structured feedbacks para demonstração
  const [structuredFeedbacks, setStructuredFeedbacks] = useState<any[]>([]);

  const handleCreateFeedback = () => {
    setIsCreatingFeedback(true);
  };

  const handleSelectCollaborator = (collaborator: any) => {
    setSelectedCollaborator(collaborator);
    setIsCreatingFeedback(true);
  };

  const handleSaveStructuredFeedback = (feedback: any) => {
    setStructuredFeedbacks(prev => {
      const existing = prev.findIndex(f => f.id === feedback.id);
      if (existing >= 0) {
        const updated = [...prev];
        updated[existing] = feedback;
        return updated;
      }
      return [feedback, ...prev];
    });
  };

  const handleSubmitStructuredFeedback = (feedback: any) => {
    handleSaveStructuredFeedback(feedback);
    setIsCreatingFeedback(false);
    setSelectedCollaborator(null);
  };

  const filteredCollaborators = collaborators.filter(collaborator =>
    collaborator.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    collaborator.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const stats = {
    total: feedbacks.length + structuredFeedbacks.length,
    thisMonth: feedbacks.filter(f => 
      new Date(f.created_at).getMonth() === new Date().getMonth()
    ).length + structuredFeedbacks.filter(f =>
      new Date(f.createdAt).getMonth() === new Date().getMonth()
    ).length,
    pending: feedbacks.filter(f => f.status === 'pending').length + 
             structuredFeedbacks.filter(f => f.status === 'draft').length,
    avgRating: structuredFeedbacks.length > 0 
      ? structuredFeedbacks
          .filter(f => f.overallRating)
          .reduce((sum, f) => sum + f.overallRating, 0) / 
        structuredFeedbacks.filter(f => f.overallRating).length 
      : 0
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Sistema de Feedback</h1>
            <p className="text-muted-foreground">
              Gerencie avaliações e feedback estruturado por competências
            </p>
          </div>
          
          <div className="flex items-center space-x-4">
            <ConnectionStatus />
            <Dialog open={isCreatingFeedback} onOpenChange={setIsCreatingFeedback}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Novo Feedback
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Criar Novo Feedback</DialogTitle>
                  <DialogDescription>
                    Selecione o tipo de feedback e o colaborador para avaliação
                  </DialogDescription>
                </DialogHeader>
                
                {!selectedCollaborator ? (
                  <div className="space-y-4">
                    <div className="flex items-center space-x-4">
                      <div className="flex-1">
                        <Input
                          placeholder="Buscar colaborador..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="w-full"
                        />
                      </div>
                      <div className="flex space-x-2">
                        <Button
                          variant={feedbackType === 'structured' ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => setFeedbackType('structured')}
                        >
                          <Target className="mr-2 h-4 w-4" />
                          Por Competências
                        </Button>
                        <Button
                          variant={feedbackType === 'traditional' ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => setFeedbackType('traditional')}
                        >
                          <MessageSquare className="mr-2 h-4 w-4" />
                          Tradicional
                        </Button>
                      </div>
                    </div>
                    
                    <div className="grid gap-3 max-h-60 overflow-y-auto">
                      {filteredCollaborators.map(collaborator => (
                        <Card 
                          key={collaborator.id} 
                          className="cursor-pointer hover:shadow-md transition-shadow"
                          onClick={() => handleSelectCollaborator(collaborator)}
                        >
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                              <div>
                                <h4 className="font-medium">{collaborator.name}</h4>
                                <p className="text-sm text-muted-foreground">
                                  {collaborator.role} • {collaborator.department}
                                </p>
                              </div>
                              <Badge variant="secondary">{collaborator.status}</Badge>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div>
                    {feedbackType === 'structured' ? (
                      <StructuredFeedbackForm
                        collaboratorId={selectedCollaborator.id}
                        collaboratorName={selectedCollaborator.name}
                        onSave={handleSaveStructuredFeedback}
                        onSubmit={handleSubmitStructuredFeedback}
                      />
                    ) : (
                      <AdvancedFeedbackDialog
                        collaboratorId={selectedCollaborator.id}
                        collaboratorName={selectedCollaborator.name}
                        onClose={() => {
                          setIsCreatingFeedback(false);
                          setSelectedCollaborator(null);
                        }}
                      />
                    )}
                  </div>
                )}
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Feedbacks</CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
              <p className="text-xs text-muted-foreground">
                +{stats.thisMonth} este mês
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pendentes</CardTitle>
              <Filter className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.pending}</div>
              <p className="text-xs text-muted-foreground">
                Aguardando revisão
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avaliação Média</CardTitle>
              <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stats.avgRating > 0 ? stats.avgRating.toFixed(1) : '--'}
              </div>
              <p className="text-xs text-muted-foreground">
                De 5.0 pontos
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Colaboradores Ativos</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{collaborators.length}</div>
              <p className="text-xs text-muted-foreground">
                Disponíveis para feedback
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Content */}
        <Tabs defaultValue="structured" className="space-y-4">
          <TabsList>
            <TabsTrigger value="structured" className="flex items-center space-x-2">
              <Target className="h-4 w-4" />
              <span>Por Competências</span>
            </TabsTrigger>
            <TabsTrigger value="traditional" className="flex items-center space-x-2">
              <MessageSquare className="h-4 w-4" />
              <span>Tradicionais</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="structured">
            <FeedbackHistory 
              feedbacks={structuredFeedbacks}
              onViewDetails={(feedback) => {
                toast({
                  title: "Visualizar Feedback",
                  description: `Abrindo detalhes do feedback de ${feedback.collaboratorId}`
                });
              }}
            />
          </TabsContent>
          
          <TabsContent value="traditional">
            <div className="grid gap-4">
              {feedbacks.map((feedback) => (
                <Card key={feedback.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">{feedback.subject}</CardTitle>
                        <CardDescription>
                          Para: {feedback.collaborator?.name} • {feedback.type}
                        </CardDescription>
                      </div>
                      <Badge variant={feedback.status === 'sent' ? 'default' : 'secondary'}>
                        {feedback.status === 'sent' ? 'Enviado' : 'Pendente'}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                      {feedback.content}
                    </p>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>
                        {format(new Date(feedback.created_at), 'dd/MM/yyyy HH:mm', { locale: ptBR })}
                      </span>
                      {feedback.rating && (
                        <div className="flex items-center space-x-1">
                          <Star className="h-3 w-3 fill-current text-yellow-500" />
                          <span>{feedback.rating}/5</span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};
