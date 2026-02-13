
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { GoalProgress } from '@/types/gamification';
import { Target, Calendar, TrendingUp, Award, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ModernGoalProgressProps {
  goal: GoalProgress;
  onUpdateProgress?: (goalId: string, newProgress: number) => void;
  onCompleteGoal?: (goalId: string) => void;
  className?: string;
}

export const ModernGoalProgress: React.FC<ModernGoalProgressProps> = ({
  goal,
  onUpdateProgress,
  onCompleteGoal,
  className
}) => {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-red-500';
      case 'high': return 'bg-orange-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-50';
      case 'in-progress': return 'text-blue-600 bg-blue-50';
      case 'overdue': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const isOverdue = new Date(goal.due_date) < new Date() && goal.status !== 'completed';
  const daysUntilDue = Math.ceil((new Date(goal.due_date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));

  return (
    <Card className={cn(
      "hover:shadow-lg transition-all duration-300",
      goal.status === 'completed' && "border-green-200 bg-green-50/30",
      isOverdue && "border-red-200 bg-red-50/30",
      className
    )}>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <CardTitle className="text-lg flex items-center gap-2">
              <Target className="h-5 w-5 text-blue-600" />
              {goal.title}
              {goal.status === 'completed' && (
                <CheckCircle className="h-5 w-5 text-green-500" />
              )}
            </CardTitle>
            <p className="text-sm text-muted-foreground">{goal.description}</p>
          </div>
          <div className="flex items-center gap-2">
            <Badge className={getPriorityColor(goal.priority)}>
              {goal.priority === 'critical' && 'Crítica'}
              {goal.priority === 'high' && 'Alta'}
              {goal.priority === 'medium' && 'Média'}
              {goal.priority === 'low' && 'Baixa'}
            </Badge>
            <Badge variant="outline" className={getStatusColor(goal.status)}>
              {goal.status === 'completed' && 'Concluída'}
              {goal.status === 'in-progress' && 'Em Progresso'}
              {goal.status === 'overdue' && 'Atrasada'}
              {goal.status === 'not-started' && 'Não Iniciada'}
            </Badge>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Progress Bar com Animação */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Progresso</span>
            <span className="text-sm text-muted-foreground">
              {goal.current_value} / {goal.target_value}
            </span>
          </div>
          <div className="relative">
            <Progress 
              value={goal.progress_percentage} 
              className={cn(
                "h-3 transition-all duration-700",
                goal.status === 'completed' && "bg-green-100"
              )}
            />
            <div 
              className="absolute top-0 left-0 h-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-700 ease-out"
              style={{ width: `${goal.progress_percentage}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>{goal.progress_percentage.toFixed(1)}% concluído</span>
            {goal.status === 'completed' ? (
              <span className="text-green-600 font-medium">✓ Meta atingida!</span>
            ) : (
              <span>
                {daysUntilDue > 0 ? `${daysUntilDue} dias restantes` : 
                 daysUntilDue === 0 ? 'Vence hoje' : 
                 `${Math.abs(daysUntilDue)} dias em atraso`}
              </span>
            )}
          </div>
        </div>

        {/* Milestones */}
        {goal.milestones && goal.milestones.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium flex items-center gap-2">
              <Award className="h-4 w-4" />
              Marcos
            </h4>
            <div className="space-y-1">
              {goal.milestones.map((milestone) => (
                <div key={milestone.id} className="flex items-center gap-2 text-sm">
                  <div className={cn(
                    "w-2 h-2 rounded-full",
                    milestone.completed ? "bg-green-500" : "bg-gray-300"
                  )} />
                  <span className={milestone.completed ? "line-through text-muted-foreground" : ""}>
                    {milestone.title}
                  </span>
                  {milestone.completed && milestone.completed_at && (
                    <span className="text-xs text-green-600">
                      ({new Date(milestone.completed_at).toLocaleDateString('pt-BR')})
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Info e Ações */}
        <div className="flex justify-between items-center pt-2 border-t">
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              <span>Prazo: {new Date(goal.due_date).toLocaleDateString('pt-BR')}</span>
            </div>
            <div className="flex items-center gap-1">
              <TrendingUp className="h-3 w-3" />
              <span>{goal.category}</span>
            </div>
          </div>
          
          {goal.status !== 'completed' && (
            <div className="flex gap-2">
              {onUpdateProgress && (
                <Button 
                  variant="outline" 
                  size="sm"
                  data-testid={`update-progress-${goal.id}`}
                  onClick={() => onUpdateProgress(goal.id, goal.progress_percentage + 10)}
                >
                  Atualizar
                </Button>
              )}
              {goal.progress_percentage >= 100 && onCompleteGoal && (
                <Button 
                  size="sm" 
                  onClick={() => onCompleteGoal(goal.id)}
                  className="bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-800"
                  data-testid={`complete-goal-${goal.id}`}
                >
                  Finalizar
                </Button>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
