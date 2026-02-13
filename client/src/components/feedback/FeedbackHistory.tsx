
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Star, Eye, Calendar, User, TrendingUp } from 'lucide-react';
import { StructuredFeedback } from '@/types/competencies';
import { useCompetencies } from '@/hooks/useCompetencies';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '@/lib/utils';

interface FeedbackHistoryProps {
  feedbacks: StructuredFeedback[];
  onViewDetails?: (feedback: StructuredFeedback) => void;
  className?: string;
}

export const FeedbackHistory: React.FC<FeedbackHistoryProps> = ({
  feedbacks,
  onViewDetails,
  className
}) => {
  const { getTemplateById, defaultRatingScale } = useCompetencies();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'bg-gray-100 text-gray-800';
      case 'submitted': return 'bg-blue-100 text-blue-800';
      case 'reviewed': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'draft': return 'Rascunho';
      case 'submitted': return 'Enviado';
      case 'reviewed': return 'Revisado';
      default: return 'Desconhecido';
    }
  };

  const getRatingColor = (rating: number) => {
    return defaultRatingScale.colors[Math.round(rating)] || 'bg-gray-100 text-gray-800';
  };

  const sortedFeedbacks = [...feedbacks].sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  if (feedbacks.length === 0) {
    return (
      <Card className={className}>
        <CardContent className="py-12 text-center">
          <TrendingUp className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">Nenhum feedback encontrado</h3>
          <p className="text-muted-foreground">
            Este colaborador ainda não possui feedbacks registrados.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className={cn("space-y-4", className)}>
      {sortedFeedbacks.map(feedback => {
        const template = getTemplateById(feedback.templateId);
        
        return (
          <Card key={feedback.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <CardTitle className="text-lg">
                    {template?.name || 'Template Personalizado'}
                  </CardTitle>
                  <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-4 w-4" />
                      <span>
                        {format(new Date(feedback.createdAt), 'dd/MM/yyyy', { locale: ptBR })}
                      </span>
                    </div>
                    {feedback.submittedAt && (
                      <div className="flex items-center space-x-1">
                        <User className="h-4 w-4" />
                        <span>
                          Enviado em {format(new Date(feedback.submittedAt), 'dd/MM/yyyy', { locale: ptBR })}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Badge variant="secondary" className={getStatusColor(feedback.status)}>
                    {getStatusLabel(feedback.status)}
                  </Badge>
                  {feedback.overallRating && (
                    <Badge variant="secondary" className={getRatingColor(feedback.overallRating)}>
                      <Star className="mr-1 h-3 w-3 fill-current" />
                      {feedback.overallRating.toFixed(1)}
                    </Badge>
                  )}
                </div>
              </div>
            </CardHeader>
            
            <CardContent>
              <div className="space-y-4">
                {/* Quick Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">
                      {feedback.evaluations.length}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Competências Avaliadas
                    </div>
                  </div>
                  
                  {feedback.strengths && (
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">
                        {feedback.strengths.length}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Pontos Fortes
                      </div>
                    </div>
                  )}
                  
                  {feedback.developmentAreas && (
                    <div className="text-center">
                      <div className="text-2xl font-bold text-orange-600">
                        {feedback.developmentAreas.length}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Áreas de Desenvolvimento
                      </div>
                    </div>
                  )}
                  
                  {feedback.actionItems && (
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">
                        {feedback.actionItems.length}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Ações Planejadas
                      </div>
                    </div>
                  )}
                </div>

                {/* Preview of General Comments */}
                {feedback.generalComments && (
                  <div className="bg-muted/50 p-3 rounded-lg">
                    <h4 className="text-sm font-medium mb-1">Comentários Gerais</h4>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {feedback.generalComments}
                    </p>
                  </div>
                )}

                {/* Actions */}
                <div className="flex justify-end">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => onViewDetails?.(feedback)}
                  >
                    <Eye className="mr-2 h-4 w-4" />
                    Ver Detalhes
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};
