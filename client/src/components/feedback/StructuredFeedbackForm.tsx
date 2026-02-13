import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Star, Send, ArrowLeft } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CompetencyCategory {
  id: string;
  name: string;
  description: string;
}

interface Competency {
  id: string;
  name: string;
  description: string;
  category: CompetencyCategory;
}

interface FeedbackTemplate {
  id: string;
  name: string;
  description: string;
  competencies: Competency[];
}

interface FeedbackEvaluation {
  competencyId: string;
  rating: number;
  comment?: string;
}

const defaultRatingScale = {
  labels: {
    1: "Muito Abaixo",
    2: "Abaixo",
    3: "Adequado", 
    4: "Acima",
    5: "Muito Acima"
  }
};

const mockTemplates: FeedbackTemplate[] = [
  {
    id: "leadership",
    name: "Liderança",
    description: "Avaliação de competências de liderança",
    competencies: [
      { id: "communication", name: "Comunicação", description: "Habilidade de comunicação clara e efetiva", category: { id: "leadership", name: "Liderança", description: "Competências de liderança" } },
      { id: "decision-making", name: "Tomada de Decisão", description: "Capacidade de tomar decisões assertivas", category: { id: "leadership", name: "Liderança", description: "Competências de liderança" } }
    ]
  }
];

const mockCategories: CompetencyCategory[] = [
  { id: "leadership", name: "Liderança", description: "Competências de liderança" },
  { id: "technical", name: "Técnica", description: "Competências técnicas" }
];

export const StructuredFeedbackForm: React.FC = () => {
  const [selectedTemplate, setSelectedTemplate] = useState<string>("");
  const [templates] = useState<FeedbackTemplate[]>(mockTemplates);
  const [categories] = useState<CompetencyCategory[]>(mockCategories);
  const [evaluations, setEvaluations] = useState<Record<string, FeedbackEvaluation>>({});
  const [generalComments, setGeneralComments] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    const totalRating = evaluatedCompetencies.reduce((sum, evaluation) => sum + evaluation.rating, 0);
    return Math.round((totalRating / evaluatedCompetencies.length) * 10) / 10;
  };

  const handleSubmit = async () => {
    if (!selectedTemplate) return;
    
    setIsSubmitting(true);
    try {
      const feedbackData = {
        templateId: selectedTemplate,
        evaluations: Object.values(evaluations),
        generalComments,
        overallRating: calculateOverallRating()
      };
      
      console.log('Submitting feedback:', feedbackData);
      // Here you would typically send to your backend
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      
      // Reset form
      setEvaluations({});
      setGeneralComments("");
      setSelectedTemplate("");
      
    } catch (error) {
      console.error('Error submitting feedback:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedTemplateData = templates.find(t => t.id === selectedTemplate);
  const templateCompetencies = selectedTemplateData?.competencies || [];

  // Group competencies by category
  const groupedCompetencies = categories.map(category => ({
    category,
    competencies: templateCompetencies.filter(comp => comp.category.id === category.id)
  })).filter(group => group.competencies.length > 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="h-5 w-5" />
            Feedback Estruturado
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label htmlFor="template">Selecione o Template de Avaliação</Label>
              <Select value={selectedTemplate} onValueChange={setSelectedTemplate}>
                <SelectTrigger>
                  <SelectValue placeholder="Escolha um template..." />
                </SelectTrigger>
                <SelectContent>
                  {templates.map((template) => (
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

      {/* Competency Evaluation */}
      {selectedTemplate && groupedCompetencies.map((group) => {
        return (
          <Card key={group.category.id}>
            <CardHeader>
              <CardTitle className="text-lg">{group.category.name}</CardTitle>
              <p className="text-sm text-muted-foreground">{group.category.description}</p>
            </CardHeader>
            <CardContent className="space-y-6">
              {group.competencies.map((competency) => (
                <div key={competency.id} className="space-y-4 p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">{competency.name}</h4>
                    <p className="text-sm text-muted-foreground">{competency.description}</p>
                  </div>

                  {/* Rating Scale */}
                  <div className="space-y-2">
                    <Label>Avaliação</Label>
                    <div className="grid grid-cols-5 gap-2">
                      {[1, 2, 3, 4, 5].map((rating) => (
                        <button
                          key={rating}
                          type="button"
                          onClick={() => handleRatingChange(competency.id, rating)}
                          className={cn(
                            "flex flex-col items-center p-2 rounded-lg border transition-colors",
                            evaluations[competency.id]?.rating === rating
                              ? "bg-primary text-primary-foreground border-primary"
                              : "hover:bg-muted border-border"
                          )}
                        >
                          <Star
                            className={cn(
                              "h-4 w-4 mb-1",
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
      {selectedTemplate && (
        <Card>
          <CardHeader>
            <CardTitle>Comentários Gerais</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Textarea
                placeholder="Adicione comentários gerais sobre o desempenho..."
                value={generalComments}
                onChange={(e) => setGeneralComments(e.target.value)}
                className="min-h-[120px]"
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Summary and Submit */}
      {selectedTemplate && (
        <Card>
          <CardHeader>
            <CardTitle>Resumo da Avaliação</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-medium">Avaliação Geral:</span>
                <Badge variant="secondary" className="text-lg px-3 py-1">
                  {calculateOverallRating().toFixed(1)}/5.0
                </Badge>
              </div>
              
              <div className="flex gap-2">
                <Button 
                  onClick={handleSubmit}
                  disabled={isSubmitting || Object.keys(evaluations).length === 0}
                  className="flex-1"
                >
                  <Send className="h-4 w-4 mr-2" />
                  {isSubmitting ? 'Enviando...' : 'Enviar Feedback'}
                </Button>
                
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setEvaluations({});
                    setGeneralComments("");
                    setSelectedTemplate("");
                  }}
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Limpar
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};