
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Star, Save, Send, Users, Crown, Code, MessageCircle } from 'lucide-react';
import { useCompetencies } from '@/hooks/useCompetencies';
import { CompetencyEvaluation, StructuredFeedback } from '@/types/competencies';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

interface StructuredFeedbackFormProps {
  collaboratorId: string;
  collaboratorName: string;
  onSave?: (feedback: StructuredFeedback) => void;
  onSubmit?: (feedback: StructuredFeedback) => void;
  existingFeedback?: StructuredFeedback;
}

const CATEGORY_ICONS = {
  'Técnicas': Code,
  'Comportamentais': Users,
  'Liderança': Crown,
  'Comunicação': MessageCircle
};

export const StructuredFeedbackForm: React.FC<StructuredFeedbackFormProps> = ({
  collaboratorId,
  collaboratorName,
  onSave,
  onSubmit,
  existingFeedback
}) => {
  const { competencies, categories, templates, getTemplateById, defaultRatingScale } = useCompetencies();
  const { toast } = useToast();
  
  const [selectedTemplate, setSelectedTemplate] = useState(templates[0]?.id || '');
  const [evaluations, setEvaluations] = useState<Record<string, CompetencyEvaluation>>({});
  const [generalComments, setGeneralComments] = useState('');
  const [developmentAreas, setDevelopmentAreas] = useState('');
  const [strengths, setStrengths] = useState('');

  const template = getTemplateById(selectedTemplate);
  const templateCompetencies = template ? 
    competencies.filter(comp => template.competencies.includes(comp.id)) : [];

  const handleRatingChange = (competencyId: string, rating: number) => {
    setEvaluations(prev => ({
      ...prev,
      [competencyId]: {
        ...prev[competencyId],
        competencyId,
        rating
      }
    }));
  };

  const handleCommentChange = (competencyId: string, comment: string) => {
    setEvaluations(prev => ({
      ...prev,
      [competencyId]: {
        ...prev[competencyId],
        competencyId,
        comment
      }
    }));
  };

  const calculateOverallRating = () => {
    const evaluatedCompetencies = Object.values(evaluations).filter(evaluation => evaluation.rating > 0);
    if (evaluatedCompetencies.length === 0) return 0;
    
    const totalWeight = evaluatedCompetencies.reduce((sum, evaluation) => {
      const comp = competencies.find(c => c.id === evaluation.competencyId);
      return sum + (comp?.weight || 0.2);
    }, 0);
    
    const weightedSum = evaluatedCompetencies.reduce((sum, evaluation) => {
      const comp = competencies.find(c => c.id === evaluation.competencyId);
      return sum + (evaluation.rating * (comp?.weight || 0.2));
    }, 0);
    
    return Math.round((weightedSum / totalWeight) * 100) / 100;
  };

  const handleSave = () => {
    const feedback: StructuredFeedback = {
      id: existingFeedback?.id || `feedback_${Date.now()}`,
      collaboratorId,
      evaluatorId: 'current_user', // Em produção viria do contexto de auth
      templateId: selectedTemplate,
      evaluations: Object.values(evaluations),
      overallRating: calculateOverallRating(),
      generalComments,
      developmentAreas: developmentAreas.split('\n').filter(area => area.trim()),
      strengths: strengths.split('\n').filter(strength => strength.trim()),
      status: 'draft',
      createdAt: existingFeedback?.createdAt || new Date().toISOString()
    };

    onSave?.(feedback);
    toast({
      title: "Feedback Salvo",
      description: "O rascunho do feedback foi salvo com sucesso."
    });
  };

  const handleSubmit = () => {
    const feedback: StructuredFeedback = {
      id: existingFeedback?.id || `feedback_${Date.now()}`,
      collaboratorId,
      evaluatorId: 'current_user',
      templateId: selectedTemplate,
      evaluations: Object.values(evaluations),
      overallRating: calculateOverallRating(),
      generalComments,
      developmentAreas: developmentAreas.split('\n').filter(area => area.trim()),
      strengths: strengths.split('\n').filter(strength => strength.trim()),
      status: 'submitted',
      createdAt: existingFeedback?.createdAt || new Date().toISOString(),
      submittedAt: new Date().toISOString()
    };

    onSubmit?.(feedback);
    toast({
      title: "Feedback Enviado",
      description: "O feedback foi enviado com sucesso para o colaborador."
    });
  };

  const getRatingColor = (rating: number) => {
    return defaultRatingScale.colors[rating] || 'bg-gray-100 text-gray-800';
  };

  const groupedCompetencies = categories.map(category => ({
    category,
    competencies: templateCompetencies.filter(comp => comp.category.id === category.id)
  })).filter(group => group.competencies.length > 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Feedback Estruturado - {collaboratorName}</span>
            <div className="flex items-center space-x-2">
              {calculateOverallRating() > 0 && (
                <Badge variant="secondary" className="text-sm">
                  Nota Geral: {calculateOverallRating()}/5
                </Badge>
              )}
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label htmlFor="template">Template de Avaliação</Label>
              <Select value={selectedTemplate} onValueChange={setSelectedTemplate}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um template" />
                </SelectTrigger>
                <SelectContent>
                  {templates.map(template => (
                    <SelectItem key={template.id} value={template.id}>
                      <div className="flex flex-col">
                        <span className="font-medium">{template.name}</span>
                        <span className="text-sm text-muted-foreground">{template.description}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Competencies Evaluation */}
      {groupedCompetencies.map(({ category, competencies: categoryCompetencies }) => {
        const IconComponent = CATEGORY_ICONS[category.name as keyof typeof CATEGORY_ICONS];
        
        return (
          <Card key={category.id}>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                {IconComponent && <IconComponent className="h-5 w-5" />}
                <span>{category.name}</span>
                <Badge variant="secondary" className={category.color}>
                  {categoryCompetencies.length} competência{categoryCompetencies.length > 1 ? 's' : ''}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {categoryCompetencies.map(competency => (
                <div key={competency.id} className="space-y-3">
                  <div>
                    <h4 className="font-medium">{competency.name}</h4>
                    <p className="text-sm text-muted-foreground">{competency.description}</p>
                    {competency.weight && (
                      <Badge variant="outline" className="mt-1">
                        Peso: {Math.round(competency.weight * 100)}%
                      </Badge>
                    )}
                  </div>
                  
                  {/* Rating Scale */}
                  <div className="space-y-2">
                    <Label>Avaliação</Label>
                    <div className="flex space-x-2">
                        <button
                          key={rating}
                          onClick={() => handleRatingChange(competency.id, rating)}
                          className={cn(
                            "flex flex-col items-center space-y-1 p-3 rounded-lg border transition-all",
                            evaluations[competency.id]?.rating === rating
                              ? getRatingColor(rating) + " border-primary"
                              : "border-border hover:border-primary/50"
                          )}
                        >
                          <Star 
                            className={cn(
                              "h-4 w-4",
                              evaluations[competency.id]?.rating === rating
                                ? "fill-current"
                                : "text-muted-foreground"
                            )} 
                          />
                          <span className="text-xs font-medium">{rating}</span>
                          <span className="text-xs text-center leading-tight">
                            {defaultRatingScale.labels[rating]}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Comment */}
                  <div className="space-y-2">
                    <Label htmlFor={`comment-${competency.id}`}>Comentários (opcional)</Label>
                    <Textarea
                      id={`comment-${competency.id}`}
                      placeholder="Adicione observações específicas sobre esta competência..."
                      value={evaluations[competency.id]?.comment || ''}
                      onChange={(e) => handleCommentChange(competency.id, e.target.value)}
                      className="min-h-[80px]"
                    />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        );
      })}

      {/* General Comments */}
      <Card>
        <CardHeader>
          <CardTitle>Comentários Gerais</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="strengths">Pontos Fortes</Label>
            <Textarea
              id="strengths"
              placeholder="Liste os principais pontos fortes do colaborador (um por linha)..."
              value={strengths}
              onChange={(e) => setStrengths(e.target.value)}
              className="min-h-[100px]"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="development">Áreas de Desenvolvimento</Label>
            <Textarea
              id="development"
              placeholder="Liste as áreas que precisam de desenvolvimento (uma por linha)..."
              value={developmentAreas}
              onChange={(e) => setDevelopmentAreas(e.target.value)}
              className="min-h-[100px]"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="general">Comentários Adicionais</Label>
            <Textarea
              id="general"
              placeholder="Adicione comentários gerais sobre a performance do colaborador..."
              value={generalComments}
              onChange={(e) => setGeneralComments(e.target.value)}
              className="min-h-[120px]"
            />
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex justify-end space-x-3">
        <Button variant="outline" onClick={handleSave}>
          <Save className="mr-2 h-4 w-4" />
          Salvar Rascunho
        </Button>
        <Button onClick={handleSubmit}>
          <Send className="mr-2 h-4 w-4" />
          Enviar Feedback
        </Button>
      </div>
    </div>
  );
};
