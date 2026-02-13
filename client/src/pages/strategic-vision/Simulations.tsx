import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Trash2, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

interface Simulation {
  id: string;
  name: string;
  description: string;
  scenario: 'growth' | 'contraction' | 'pivot' | 'expansion';
  impactScore: number;
  cascadeEffect: string;
  createdAt: Date;
}

export function Simulations() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [simulations, setSimulations] = useState<Simulation[]>([
    {
      id: '1',
      name: 'Expansão para Europeu',
      description: 'Entrar no mercado europeu com 3 novas posições',
      scenario: 'expansion',
      impactScore: 8.5,
      cascadeEffect: 'Aumento de custo operacional de 35%, receita potencial de 120%',
      createdAt: new Date(),
    },
  ]);
  const [newSimName, setNewSimName] = useState('');

  const addSimulation = () => {
    if (newSimName.trim()) {
      const newSim: Simulation = {
        id: Date.now().toString(),
        name: newSimName,
        description: 'Descrição da simulação',
        scenario: 'growth',
        impactScore: Math.random() * 10,
        cascadeEffect: 'Análise de impacto em cascata',
        createdAt: new Date(),
      };
      setSimulations([...simulations, newSim]);
      setNewSimName('');
      toast({
        title: '✅ Simulação Criada',
        description: `${newSimName} foi criada com sucesso`,
      });
    }
  };

  const removeSimulation = (id: string) => {
    setSimulations(simulations.filter(s => s.id !== id));
    toast({
      title: '✅ Simulação Removida',
      description: 'Simulação foi removida',
    });
  };

  const runSimulation = (id: string) => {
    const sim = simulations.find(s => s.id === id);
    if (sim) {
      toast({
        title: '🚀 Simulação em Execução',
        description: `Executando: ${sim.name}`,
      });
    }
  };

  const goBack = () => {
    navigate('/app/founder', { state: { tab: 'strategic-vision' } });
  };

  const getScenarioColor = (scenario: string) => {
    switch (scenario) {
      case 'growth': return 'bg-green-50 dark:bg-green-950/20 border-green-300 dark:border-green-700';
      case 'contraction': return 'bg-red-50 dark:bg-red-950/20 border-red-300 dark:border-red-700';
      case 'pivot': return 'bg-yellow-50 dark:bg-yellow-950/20 border-yellow-300 dark:border-yellow-700';
      case 'expansion': return 'bg-blue-50 dark:bg-blue-950/20 border-blue-300 dark:border-blue-700';
      default: return 'bg-slate-50 dark:bg-slate-950/20 border-slate-300 dark:border-slate-700';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50/30 to-emerald-50 dark:from-slate-950 dark:via-emerald-950/20 dark:to-emerald-950/20 p-4">
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
          <h1 className="text-4xl font-bold text-emerald-600 dark:text-emerald-400">Laboratório de Simulações</h1>
        </div>

        <div className="space-y-6">
          {/* Create New Simulation */}
          <Card className="dark:border-slate-700">
            <CardHeader>
              <CardTitle>Criar Nova Simulação</CardTitle>
              <CardDescription>Simule cenários e veja efeitos em cascata com IA</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                <Input
                  placeholder="Ex: Reduzir tempo de onboarding em 50%"
                  value={newSimName}
                  onChange={(e) => setNewSimName(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addSimulation()}
                  data-testid="input-simulation-name"
                />
                <Button 
                  onClick={addSimulation}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white"
                  data-testid="button-add-simulation"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Simulations List */}
          <div className="space-y-4">
            {simulations.map((sim) => (
              <Card key={sim.id} className={`dark:border-slate-700 border-2 ${getScenarioColor(sim.scenario)}`}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle>{sim.name}</CardTitle>
                      <CardDescription>{sim.description}</CardDescription>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{sim.impactScore.toFixed(1)}</p>
                      <p className="text-xs text-muted-foreground">Impact Score</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm font-semibold text-muted-foreground mb-2">Efeito em Cascata:</p>
                      <p className="text-sm">{sim.cascadeEffect}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        onClick={() => runSimulation(sim.id)}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white"
                        data-testid={`button-run-${sim.id}`}
                      >
                        <Play className="h-4 w-4 mr-2" />
                        Executar
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => removeSimulation(sim.id)}
                        className="text-red-600 hover:text-red-700"
                        data-testid={`button-remove-${sim.id}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {simulations.length === 0 && (
            <Card className="dark:border-slate-700">
              <CardContent className="pt-6">
                <p className="text-center text-muted-foreground">Nenhuma simulação criada ainda. Crie uma para começar!</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
