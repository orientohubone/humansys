import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Wand2, 
  Sparkles, 
  Brain, 
  Target, 
  Clock, 
  Users,
  BookOpen,
  Lightbulb,
  CheckCircle2
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface GenerationRequest {
  topic: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  training_type: 'course' | 'simulation' | 'workshop';
  duration: string;
  target_audience: string;
  specific_objectives: string[];
  organizational_context: {
    industry: string;
    company_size: string;
    communication_style: string;
    training_priorities: string[];
    common_challenges: string[];
  };
}

interface AITrainingGeneratorProps {
  onGenerate: (training: any) => void;
  organizationalContext: any;
}

export const AITrainingGenerator: React.FC<AITrainingGeneratorProps> = ({ 
  onGenerate, 
  organizationalContext 
}) => {
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);
  const [request, setRequest] = useState<GenerationRequest>({
    topic: '',
    difficulty: 'intermediate',
    training_type: 'course',
    duration: '60 min',
    target_audience: '',
    specific_objectives: [],
    organizational_context: organizationalContext || {}
  });
  
  const [currentObjective, setCurrentObjective] = useState('');

  const addObjective = () => {
    if (currentObjective.trim() && !request.specific_objectives.includes(currentObjective.trim())) {
      setRequest(prev => ({
        ...prev,
        specific_objectives: [...prev.specific_objectives, currentObjective.trim()]
      }));
      setCurrentObjective('');
    }
  };

  const removeObjective = (index: number) => {
    setRequest(prev => ({
      ...prev,
      specific_objectives: prev.specific_objectives.filter((_, i) => i !== index)
    }));
  };

  const handleGenerate = async () => {
    if (!request.topic || !request.target_audience) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha o tópico e o público-alvo.",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);
    
    try {
      const response = await fetch('/api/training/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(request)
      });

      if (!response.ok) {
        throw new Error('Falha ao gerar treinamento');
      }

      const generatedTraining = await response.json();
      onGenerate(generatedTraining);
      
      toast({
        title: "Treinamento gerado com sucesso!",
        description: "Seu treinamento personalizado foi criado com IA.",
      });

      // Reset form
      setRequest({
        topic: '',
        difficulty: 'intermediate',
        training_type: 'course',
        duration: '60 min',
        target_audience: '',
        specific_objectives: [],
        organizational_context: organizationalContext || {}
      });

    } catch (error) {
      console.error('Erro ao gerar treinamento:', error);
      toast({
        title: "Erro na geração",
        description: "Não foi possível gerar o treinamento. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-5 w-5 text-purple-600" />
          Gerador de Treinamento com IA
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Crie treinamentos personalizados automaticamente usando inteligência artificial
        </p>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Basic Information */}
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="topic">
              <Target className="inline h-4 w-4 mr-1" />
              Tópico do Treinamento *
            </Label>
            <Input
              id="topic"
              placeholder="Ex: Liderança, Comunicação, Produtividade..."
              value={request.topic}
              onChange={(e) => setRequest(prev => ({ ...prev, topic: e.target.value }))}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Dificuldade</Label>
              <Select 
                value={request.difficulty} 
                onValueChange={(value: any) => setRequest(prev => ({ ...prev, difficulty: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="beginner">Iniciante</SelectItem>
                  <SelectItem value="intermediate">Intermediário</SelectItem>
                  <SelectItem value="advanced">Avançado</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Tipo de Treinamento</Label>
              <Select 
                value={request.training_type} 
                onValueChange={(value: any) => setRequest(prev => ({ ...prev, training_type: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="course">Curso</SelectItem>
                  <SelectItem value="simulation">Simulação</SelectItem>
                  <SelectItem value="workshop">Workshop</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>
                <Clock className="inline h-4 w-4 mr-1" />
                Duração
              </Label>
              <Select 
                value={request.duration} 
                onValueChange={(value) => setRequest(prev => ({ ...prev, duration: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="30 min">30 minutos</SelectItem>
                  <SelectItem value="60 min">1 hora</SelectItem>
                  <SelectItem value="90 min">1h30min</SelectItem>
                  <SelectItem value="2 hours">2 horas</SelectItem>
                  <SelectItem value="4 hours">4 horas</SelectItem>
                  <SelectItem value="1 day">1 dia</SelectItem>
                  <SelectItem value="2 days">2 dias</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="target_audience">
              <Users className="inline h-4 w-4 mr-1" />
              Público-Alvo *
            </Label>
            <Input
              id="target_audience"
              placeholder="Ex: Gerentes, Desenvolvedores, Equipe de vendas..."
              value={request.target_audience}
              onChange={(e) => setRequest(prev => ({ ...prev, target_audience: e.target.value }))}
            />
          </div>
        </div>

        <Separator />

        {/* Learning Objectives */}
        <div className="space-y-4">
          <Label className="text-base font-medium">
            <Lightbulb className="inline h-4 w-4 mr-1" />
            Objetivos Específicos de Aprendizagem
          </Label>
          
          <div className="flex gap-2">
            <Input
              placeholder="Adicionar objetivo específico..."
              value={currentObjective}
              onChange={(e) => setCurrentObjective(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addObjective()}
            />
            <Button type="button" variant="outline" onClick={addObjective}>
              Adicionar
            </Button>
          </div>

          {request.specific_objectives.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {request.specific_objectives.map((objective, index) => (
                <Badge 
                  key={index} 
                  variant="secondary" 
                  className="cursor-pointer hover:bg-destructive hover:text-destructive-foreground"
                  onClick={() => removeObjective(index)}
                >
                  {objective} ×
                </Badge>
              ))}
            </div>
          )}
        </div>

        <Separator />

        {/* Organizational Context Display */}
        {organizationalContext && (
          <div className="space-y-4">
            <Label className="text-base font-medium">
              <BookOpen className="inline h-4 w-4 mr-1" />
              Contexto Organizacional
            </Label>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-muted rounded-lg">
              <div>
                <p className="text-sm font-medium">Indústria:</p>
                <p className="text-sm text-muted-foreground">{organizationalContext.industry}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Tamanho da Empresa:</p>
                <p className="text-sm text-muted-foreground">{organizationalContext.company_size}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Estilo de Comunicação:</p>
                <p className="text-sm text-muted-foreground">{organizationalContext.communication_style}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Prioridades de Treinamento:</p>
                <div className="flex flex-wrap gap-1 mt-1">
                  {organizationalContext.training_priorities?.slice(0, 3).map((priority: string, index: number) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {priority}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Generate Button */}
        <Button 
          onClick={handleGenerate} 
          disabled={isGenerating || !request.topic || !request.target_audience}
          className="w-full"
          size="lg"
        >
          {isGenerating ? (
            <>
              <Sparkles className="mr-2 h-4 w-4 animate-spin" />
              Gerando Treinamento...
            </>
          ) : (
            <>
              <Wand2 className="mr-2 h-4 w-4" />
              Gerar Treinamento com IA
            </>
          )}
        </Button>

        {/* Features Info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6 p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
          <div className="text-center">
            <CheckCircle2 className="h-6 w-6 text-blue-600 mx-auto mb-2" />
            <p className="text-sm font-medium">100% Personalizado</p>
            <p className="text-xs text-muted-foreground">Adaptado ao seu contexto</p>
          </div>
          <div className="text-center">
            <CheckCircle2 className="h-6 w-6 text-blue-600 mx-auto mb-2" />
            <p className="text-sm font-medium">Simulações Realistas</p>
            <p className="text-xs text-muted-foreground">Cenários do mundo real</p>
          </div>
          <div className="text-center">
            <CheckCircle2 className="h-6 w-6 text-blue-600 mx-auto mb-2" />
            <p className="text-sm font-medium">Pronto para Usar</p>
            <p className="text-xs text-muted-foreground">Implementação imediata</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};