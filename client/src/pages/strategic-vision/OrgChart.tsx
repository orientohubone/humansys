import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

interface OrgPosition {
  id: string;
  title: string;
  level: number;
  headcount: number;
  reportsTo: string | null;
}

export function OrgChart() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [positions, setPositions] = useState<OrgPosition[]>([
    { id: '1', title: 'CEO', level: 0, headcount: 1, reportsTo: null },
    { id: '2', title: 'CTO', level: 1, headcount: 1, reportsTo: '1' },
    { id: '3', title: 'Head of Sales', level: 1, headcount: 1, reportsTo: '1' },
  ]);
  const [newPositionTitle, setNewPositionTitle] = useState('');

  const addPosition = () => {
    if (newPositionTitle.trim()) {
      const newPosition: OrgPosition = {
        id: Date.now().toString(),
        title: newPositionTitle,
        level: 1,
        headcount: 1,
        reportsTo: '1',
      };
      setPositions([...positions, newPosition]);
      setNewPositionTitle('');
      toast({
        title: '✅ Posição Adicionada',
        description: `${newPositionTitle} foi adicionada ao organograma`,
      });
    }
  };

  const removePosition = (id: string) => {
    setPositions(positions.filter(p => p.id !== id));
    toast({
      title: '✅ Posição Removida',
      description: 'Posição foi removida do organograma',
    });
  };

  const goBack = () => {
    navigate('/app/founder', { state: { tab: 'strategic-vision' } });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-blue-50 dark:from-slate-950 dark:via-blue-950/20 dark:to-blue-950/20 p-4">
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
          <h1 className="text-4xl font-bold text-emerald-600 dark:text-emerald-400">Organograma Dinâmico</h1>
        </div>

        <div className="space-y-6">
          {/* Add New Position */}
          <Card className="dark:border-slate-700">
            <CardHeader>
              <CardTitle>Adicionar Nova Posição</CardTitle>
              <CardDescription>Expanda sua estrutura organizacional</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                <Input
                  placeholder="Ex: Product Manager"
                  value={newPositionTitle}
                  onChange={(e) => setNewPositionTitle(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addPosition()}
                  data-testid="input-position-title"
                />
                <Button 
                  onClick={addPosition}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white"
                  data-testid="button-add-position"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Org Structure Visualization */}
          <Card className="dark:border-slate-700">
            <CardHeader>
              <CardTitle>Estrutura Organizacional</CardTitle>
              <CardDescription>{positions.length} posições na organização</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* CEO Level */}
                <div className="flex justify-center pb-6 border-b-2 border-slate-200 dark:border-slate-700">
                  <div className="bg-gradient-to-r from-purple-100 to-purple-200 dark:from-purple-900/30 dark:to-purple-800/30 px-6 py-3 rounded-lg border-2 border-purple-300 dark:border-purple-700">
                    <p className="font-bold text-purple-900 dark:text-purple-100">CEO</p>
                    <p className="text-sm text-purple-700 dark:text-purple-300">1 pessoa</p>
                  </div>
                </div>

                {/* Other Positions */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {positions.filter(p => p.reportsTo === '1').map((position) => (
                    <div key={position.id} className="bg-blue-50 dark:bg-blue-950/20 p-4 rounded-lg border-2 border-blue-300 dark:border-blue-700">
                      <div className="flex justify-between items-start gap-2">
                        <div className="flex-1">
                          <p className="font-bold text-blue-900 dark:text-blue-100">{position.title}</p>
                          <p className="text-sm text-blue-700 dark:text-blue-300">{position.headcount} pessoa{position.headcount !== 1 ? 's' : ''}</p>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removePosition(position.id)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                          data-testid={`button-remove-${position.id}`}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>

                {positions.filter(p => p.reportsTo === '1').length === 0 && (
                  <p className="text-muted-foreground text-center py-4">Adicione posições para estruturar sua organização</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Growth Projection */}
          <Card className="dark:border-slate-700">
            <CardHeader>
              <CardTitle>Projeção de Crescimento</CardTitle>
              <CardDescription>Total de headcount planejado</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <p className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">{positions.length}</p>
                  <p className="text-sm text-muted-foreground">Posições Totais</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">{positions.reduce((sum, p) => sum + p.headcount, 0)}</p>
                  <p className="text-sm text-muted-foreground">Headcount</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">{(positions.length / 1).toFixed(1)}x</p>
                  <p className="text-sm text-muted-foreground">Tamanho vs Hoje</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
