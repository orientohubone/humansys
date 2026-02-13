import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';

interface DevelopmentPlan {
  id: string;
  name: string;
  role: string;
  goals: string[];
  status: 'on-track' | 'at-risk' | 'completed';
  progress: number;
  dueDate: string;
}

export function Development() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [plans, setPlans] = useState<DevelopmentPlan[]>([
    {
      id: '1',
      name: 'João Silva',
      role: 'Senior Engineer',
      goals: ['Liderança Técnica', 'Mentoría', 'Arquitetura de Sistemas'],
      status: 'on-track',
      progress: 65,
      dueDate: '2025-12-31',
    },
    {
      id: '2',
      name: 'Maria Santos',
      role: 'Product Manager',
      goals: ['Estratégia de Produto', 'Visão 2025', 'Liderança de Equipe'],
      status: 'on-track',
      progress: 45,
      dueDate: '2025-12-31',
    },
  ]);
  const [newPersonName, setNewPersonName] = useState('');

  const addPlan = () => {
    if (newPersonName.trim()) {
      const newPlan: DevelopmentPlan = {
        id: Date.now().toString(),
        name: newPersonName,
        role: 'Posição',
        goals: [],
        status: 'on-track',
        progress: 0,
        dueDate: '2025-12-31',
      };
      setPlans([...plans, newPlan]);
      setNewPersonName('');
      toast({
        title: '✅ Plano Criado',
        description: `PDI para ${newPersonName} foi criado`,
      });
    }
  };

  const removePlan = (id: string) => {
    setPlans(plans.filter(p => p.id !== id));
    toast({
      title: '✅ Plano Removido',
      description: 'PDI foi removido',
    });
  };

  const goBack = () => {
    navigate('/app/founder', { state: { tab: 'strategic-vision' } });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'on-track': return 'bg-green-50 dark:bg-green-950/20 border-green-300 dark:border-green-700';
      case 'at-risk': return 'bg-yellow-50 dark:bg-yellow-950/20 border-yellow-300 dark:border-yellow-700';
      case 'completed': return 'bg-blue-50 dark:bg-blue-950/20 border-blue-300 dark:border-blue-700';
      default: return 'bg-slate-50 dark:bg-slate-950/20';
    }
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'on-track': return 'default';
      case 'at-risk': return 'secondary';
      case 'completed': return 'outline';
      default: return 'outline';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-orange-50/30 to-orange-50 dark:from-slate-950 dark:via-orange-950/20 dark:to-orange-950/20 p-4">
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
          <h1 className="text-4xl font-bold text-emerald-600 dark:text-emerald-400">Planos de Desenvolvimento Individual</h1>
        </div>

        <div className="space-y-6">
          {/* Add New Plan */}
          <Card className="dark:border-slate-700">
            <CardHeader>
              <CardTitle>Criar Novo PDI</CardTitle>
              <CardDescription>Desenvolva seus talentos com planos estruturados</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                <Input
                  placeholder="Nome da pessoa"
                  value={newPersonName}
                  onChange={(e) => setNewPersonName(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addPlan()}
                  data-testid="input-person-name"
                />
                <Button 
                  onClick={addPlan}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white"
                  data-testid="button-add-plan"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Development Plans */}
          <div className="space-y-4">
            {plans.map((plan) => (
              <Card key={plan.id} className={`dark:border-slate-700 border-2 ${getStatusColor(plan.status)}`}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-2xl">{plan.name}</CardTitle>
                      <CardDescription>{plan.role}</CardDescription>
                    </div>
                    <Badge variant={getStatusVariant(plan.status)}>
                      {plan.status === 'on-track' && 'No Caminho ✓'}
                      {plan.status === 'at-risk' && 'Em Risco ⚠️'}
                      {plan.status === 'completed' && 'Concluído ✓'}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Progress */}
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <p className="text-sm font-semibold">Progresso do Desenvolvimento</p>
                        <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">{plan.progress}%</span>
                      </div>
                      <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-emerald-500"
                          style={{ width: `${plan.progress}%` }}
                        />
                      </div>
                    </div>

                    {/* Goals */}
                    <div>
                      <p className="text-sm font-semibold mb-2">Objetivos de Desenvolvimento:</p>
                      <div className="flex flex-wrap gap-2">
                        {plan.goals.map((goal, idx) => (
                          <Badge key={idx} variant="secondary">{goal}</Badge>
                        ))}
                      </div>
                    </div>

                    {/* Meta */}
                    <div className="flex justify-between items-center pt-2 border-t dark:border-slate-700">
                      <p className="text-sm text-muted-foreground">Data Meta: {new Date(plan.dueDate).toLocaleDateString('pt-BR')}</p>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removePlan(plan.id)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                        data-testid={`button-remove-${plan.id}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {plans.length === 0 && (
            <Card className="dark:border-slate-700">
              <CardContent className="pt-6">
                <p className="text-center text-muted-foreground">Nenhum PDI criado. Comece criando um plano de desenvolvimento!</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
