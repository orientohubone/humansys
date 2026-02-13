import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';

interface Milestone {
  id: string;
  title: string;
  department: string;
  headcount: number;
  targetDate: string;
  status: 'planned' | 'in-progress' | 'completed';
}

export function Roadmaps() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [milestones, setMilestones] = useState<Milestone[]>([
    {
      id: '1',
      title: 'Expandir Engenharia para 8 pessoas',
      department: 'Engenharia',
      headcount: 3,
      targetDate: '2025-06-30',
      status: 'in-progress',
    },
    {
      id: '2',
      title: 'Contratar VP de Vendas',
      department: 'Vendas',
      headcount: 1,
      targetDate: '2025-05-31',
      status: 'planned',
    },
    {
      id: '3',
      title: 'Estabelecer Equipe de Produto',
      department: 'Produto',
      headcount: 2,
      targetDate: '2025-07-31',
      status: 'planned',
    },
  ]);
  const [newMilestoneTitle, setNewMilestoneTitle] = useState('');

  const addMilestone = () => {
    if (newMilestoneTitle.trim()) {
      const newMilestone: Milestone = {
        id: Date.now().toString(),
        title: newMilestoneTitle,
        department: 'Geral',
        headcount: 1,
        targetDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        status: 'planned',
      };
      setMilestones([...milestones, newMilestone]);
      setNewMilestoneTitle('');
      toast({
        title: '✅ Milestone Adicionada',
        description: `${newMilestoneTitle} foi adicionada ao roadmap`,
      });
    }
  };

  const removeMilestone = (id: string) => {
    setMilestones(milestones.filter(m => m.id !== id));
    toast({
      title: '✅ Milestone Removida',
      description: 'Milestone foi removida do roadmap',
    });
  };

  const goBack = () => {
    navigate('/app/founder', { state: { tab: 'strategic-vision' } });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'planned': return 'bg-blue-50 dark:bg-blue-950/20 border-blue-300 dark:border-blue-700';
      case 'in-progress': return 'bg-yellow-50 dark:bg-yellow-950/20 border-yellow-300 dark:border-yellow-700';
      case 'completed': return 'bg-green-50 dark:bg-green-950/20 border-green-300 dark:border-green-700';
      default: return 'bg-slate-50 dark:bg-slate-950/20';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'planned': return 'Planejado';
      case 'in-progress': return 'Em Progresso';
      case 'completed': return 'Concluído';
      default: return status;
    }
  };

  const totalHeadcount = milestones.reduce((sum, m) => sum + m.headcount, 0);
  const daysLeft = (targetDate: string) => {
    const target = new Date(targetDate);
    const today = new Date();
    const diff = Math.ceil((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return diff;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/30 to-indigo-50 dark:from-slate-950 dark:via-indigo-950/20 dark:to-indigo-950/20 p-4">
      <div className="container mx-auto max-w-7xl">
        <div className="mb-8 flex items-center gap-4">
          <Button
            variant="outline"
            size="icon"
            onClick={goBack}
            className="dark:border-slate-700"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-4xl font-bold text-emerald-600 dark:text-emerald-400">Roadmaps de Crescimento</h1>
        </div>

        <div className="space-y-6">
          {/* Add New Milestone */}
          <Card className="dark:border-slate-700">
            <CardHeader>
              <CardTitle>Adicionar Nova Milestone</CardTitle>
              <CardDescription>Planeje seu crescimento com timelines estruturadas</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                <Input
                  placeholder="Ex: Contratar 3 Engenheiros"
                  value={newMilestoneTitle}
                  onChange={(e) => setNewMilestoneTitle(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addMilestone()}
                  data-testid="input-milestone-title"
                />
                <Button 
                  onClick={addMilestone}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white"
                  data-testid="button-add-milestone"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Growth Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="dark:border-slate-700">
              <CardContent className="pt-6">
                <div className="text-center">
                  <p className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">{milestones.length}</p>
                  <p className="text-sm text-muted-foreground">Milestones Planejadas</p>
                </div>
              </CardContent>
            </Card>
            <Card className="dark:border-slate-700">
              <CardContent className="pt-6">
                <div className="text-center">
                  <p className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">+{totalHeadcount}</p>
                  <p className="text-sm text-muted-foreground">Novos Talentos</p>
                </div>
              </CardContent>
            </Card>
            <Card className="dark:border-slate-700">
              <CardContent className="pt-6">
                <div className="text-center">
                  <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">{milestones.filter(m => m.status === 'in-progress').length}</p>
                  <p className="text-sm text-muted-foreground">Em Progresso</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Timeline */}
          <Card className="dark:border-slate-700">
            <CardHeader>
              <CardTitle>Timeline de Crescimento</CardTitle>
              <CardDescription>Planejamento de contratações e expansão</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {milestones
                  .sort((a, b) => new Date(a.targetDate).getTime() - new Date(b.targetDate).getTime())
                  .map((milestone) => (
                    <div key={milestone.id} className={`border-2 rounded-lg p-4 ${getStatusColor(milestone.status)}`}>
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-bold text-lg">{milestone.title}</h3>
                            <Badge variant={milestone.status === 'completed' ? 'outline' : 'default'}>
                              {getStatusBadge(milestone.status)}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-3">{milestone.department} • {milestone.headcount} pessoa{milestone.headcount !== 1 ? 's' : ''}</p>
                          <div className="flex items-center justify-between text-xs text-muted-foreground">
                            <span>Data Meta: {new Date(milestone.targetDate).toLocaleDateString('pt-BR')}</span>
                            <span className={daysLeft(milestone.targetDate) < 0 ? 'text-red-600' : 'text-emerald-600'}>
                              {daysLeft(milestone.targetDate) < 0 ? '⏰ Atrasado' : `${daysLeft(milestone.targetDate)}d restantes`}
                            </span>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeMilestone(milestone.id)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                          data-testid={`button-remove-${milestone.id}`}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>

          {milestones.length === 0 && (
            <Card className="dark:border-slate-700">
              <CardContent className="pt-6">
                <p className="text-center text-muted-foreground">Nenhuma milestone criada. Comece planejando seu crescimento!</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
