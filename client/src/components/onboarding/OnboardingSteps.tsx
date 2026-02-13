import React from 'react';
import { CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, Clock, User, FileText, Briefcase, Users, Play, Edit2 } from 'lucide-react';
import { OnboardingStep } from '@/hooks/useOnboarding';

interface OnboardingStepsProps {
  steps: OnboardingStep[];
  onToggleStep: (stepId: string, currentCompleted: boolean) => void;
  onEditStep: (step: OnboardingStep) => void;
}

export const OnboardingSteps = ({ steps, onToggleStep, onEditStep }: OnboardingStepsProps) => {
  const getStepIcon = (type: string) => {
    switch (type) {
      case 'document': return FileText;
      case 'training': return Play;
      case 'meeting': return Users;
      case 'task': return Briefcase;
      default: return FileText;
    }
  };

  const getStepTypeLabel = (type: string) => {
    switch (type) {
      case 'document': return 'Documento';
      case 'training': return 'Treinamento';
      case 'meeting': return 'Reunião';
      case 'task': return 'Tarefa';
      default: return type;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500';
      case 'in-progress': return 'bg-blue-500';
      case 'pending': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  if (!steps || steps.length === 0) {
    return (
      <div className="text-center py-8">
        <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-medium mb-2">Nenhuma etapa encontrada</h3>
        <p className="text-muted-foreground">As etapas do onboarding aparecerão aqui</p>
      </div>
    );
  }

  const completedSteps = steps.filter(step => step.completed || step.status === 'completed').length;
  const progressPercentage = Math.round((completedSteps / steps.length) * 100);

  return (
    <div className="space-y-6">
      {/* Progress Overview */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg border">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-medium">Progresso do Onboarding</h3>
            <p className="text-sm text-muted-foreground">
              {completedSteps} de {steps.length} etapas concluídas
            </p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-primary">{progressPercentage}%</div>
            <div className="text-sm text-muted-foreground">Completo</div>
          </div>
        </div>
        <Progress value={progressPercentage} className="h-3" />
      </div>

      {/* Steps List */}
      <div className="space-y-4">
        {steps.map((step, index) => {
          const Icon = getStepIcon(step.type);
          const isCompleted = step.completed || step.status === 'completed';

          return (
            <div 
              key={step.id}
              className={`relative flex items-start space-x-4 p-4 rounded-lg border transition-all duration-200 ${
                isCompleted 
                  ? 'bg-green-50 border-green-200' 
                  : step.status === 'in-progress'
                  ? 'bg-blue-50 border-blue-200'
                  : 'bg-gray-50 border-gray-200'
              }`}
            >
              {/* Step Number & Icon */}
              <div className="flex-shrink-0">
                <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
                  isCompleted 
                    ? 'bg-green-500 text-white' 
                    : step.status === 'in-progress'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-300 text-gray-600'
                }`}>
                  {isCompleted ? (
                    <CheckCircle className="h-5 w-5" />
                  ) : (
                    <span className="text-sm font-medium">{index + 1}</span>
                  )}
                </div>
              </div>

              {/* Step Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <Icon className="h-4 w-4 text-muted-foreground" />
                      <h4 className="font-medium text-gray-900">{step.title}</h4>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      {step.description}
                    </p>

                    <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                      <Badge variant="outline" className="text-xs">
                        {getStepTypeLabel(step.type)}
                      </Badge>

                      {step.due_date && (
                        <span className="flex items-center space-x-1">
                          <Clock className="h-3 w-3" />
                          <span>Prazo: {new Date(step.due_date).toLocaleDateString('pt-BR')}</span>
                        </span>
                      )}

                      {step.completed_at && (
                        <span className="flex items-center space-x-1 text-green-600">
                          <CheckCircle className="h-3 w-3" />
                          <span>Concluído em {new Date(step.completed_at).toLocaleDateString('pt-BR')}</span>
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center space-x-2 ml-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEditStep(step)}
                      className="h-8 w-8 p-0"
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>

                    <Button
                      variant={isCompleted ? "outline" : "default"}
                      size="sm"
                      onClick={() => onToggleStep(step.id, isCompleted)}
                      className="text-xs"
                    >
                      {isCompleted ? 'Reabrir' : 'Concluir'}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Summary */}
      <div className="bg-muted/50 p-4 rounded-lg">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-lg font-semibold text-green-600">{completedSteps}</div>
            <div className="text-xs text-muted-foreground">Concluídas</div>
          </div>
          <div>
            <div className="text-lg font-semibold text-blue-600">
              {steps.filter(s => s.status === 'in-progress').length}
            </div>
            <div className="text-xs text-muted-foreground">Em Andamento</div>
          </div>
          <div>
            <div className="text-lg font-semibold text-gray-600">
              {steps.filter(s => s.status === 'pending').length}
            </div>
            <div className="text-xs text-muted-foreground">Pendentes</div>
          </div>
        </div>
      </div>
    </div>
  );
};