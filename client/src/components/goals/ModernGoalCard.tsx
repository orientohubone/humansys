
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { GoalProgress } from '@/types/gamification';
import { ProgressBar } from '@/components/gamification/ProgressBar';
import { 
  Target, 
  Calendar, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle2,
  Clock
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { format, isAfter, differenceInDays } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface ModernGoalCardProps {
  goal: GoalProgress;
  onUpdate?: (goalId: string) => void;
  onViewDetails?: (goalId: string) => void;
  className?: string;
}

export const ModernGoalCard: React.FC<ModernGoalCardProps> = ({
  goal,
  onUpdate,
  onViewDetails,
  className
}) => {
  const dueDate = new Date(goal.due_date);
  const daysUntilDue = differenceInDays(dueDate, new Date());
  const isOverdue = isAfter(new Date(), dueDate);
  
  const getStatusIcon = () => {
    switch (goal.status) {
      case 'completed': return CheckCircle2;
      case 'overdue': return AlertTriangle;
      case 'in-progress': return TrendingUp;
      default: return Clock;
    }
  };

  const getStatusColor = () => {
    switch (goal.status) {
      case 'completed': return 'text-green-600';
      case 'overdue': return 'text-red-600';
      case 'in-progress': return 'text-blue-600';
      default: return 'text-gray-600';
    }
  };

  const getPriorityColor = () => {
    switch (goal.priority) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getProgressColor = () => {
    if (goal.progress_percentage >= 80) return 'green';
    if (goal.progress_percentage >= 60) return 'blue';
    if (goal.progress_percentage >= 40) return 'orange';
    return 'red';
  };

  const StatusIcon = getStatusIcon();

  return (
    <Card className={cn(
      "relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:scale-[1.02]",
      goal.status === 'completed' && "bg-green-50 border-green-200",
      goal.status === 'overdue' && "bg-red-50 border-red-200",
      className
    )}>
      {/* Priority Indicator */}
      <div className={cn(
        "absolute top-0 left-0 w-1 h-full",
        goal.priority === 'critical' && "bg-red-500",
        goal.priority === 'high' && "bg-orange-500",
        goal.priority === 'medium' && "bg-yellow-500",
        goal.priority === 'low' && "bg-green-500"
      )} />

      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <CardTitle className="flex items-center space-x-2 text-lg">
              <Target className="h-5 w-5 text-muted-foreground" />
              <span className="truncate">{goal.title}</span>
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
              {goal.description}
            </p>
          </div>
          <div className="flex items-center space-x-2 ml-4">
            <Badge className={getPriorityColor()}>
              {goal.priority}
            </Badge>
            <StatusIcon className={cn("h-5 w-5", getStatusColor())} />
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Progress Section */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Progresso</span>
            <span className="text-sm text-muted-foreground">
              {goal.current_value} / {goal.target_value}
            </span>
          </div>
          
          <ProgressBar
            value={goal.progress_percentage}
            color={getProgressColor()}
            animated={goal.status === 'in-progress'}
            showPercentage
          />
        </div>

        {/* Milestones */}
        {goal.milestones.length > 0 && (
          <div className="space-y-2">
            <span className="text-sm font-medium">Marcos</span>
            <div className="space-y-1">
              {goal.milestones.slice(0, 3).map((milestone) => (
                <div key={milestone.id} className="flex items-center space-x-2 text-sm">
                  <CheckCircle2 className={cn(
                    "h-4 w-4",
                    milestone.completed ? "text-green-500" : "text-gray-300"
                  )} />
                  <span className={cn(
                    milestone.completed && "line-through text-muted-foreground"
                  )}>
                    {milestone.title}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Due Date */}
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center space-x-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">
              {format(dueDate, 'dd/MM/yyyy', { locale: ptBR })}
            </span>
          </div>
          
          <div className={cn(
            "flex items-center space-x-1",
            isOverdue ? "text-red-600" : daysUntilDue <= 7 ? "text-orange-600" : "text-green-600"
          )}>
            <Clock className="h-4 w-4" />
            <span className="font-medium">
              {isOverdue 
                ? `${Math.abs(daysUntilDue)} dias atrasado`
                : daysUntilDue === 0 
                ? 'Vence hoje'
                : `${daysUntilDue} dias restantes`
              }
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex space-x-2 pt-2">
          {onUpdate && goal.status !== 'completed' && (
            <Button size="sm" onClick={() => onUpdate(goal.id)}>
              Atualizar
            </Button>
          )}
          {onViewDetails && (
            <Button variant="outline" size="sm" onClick={() => onViewDetails(goal.id)}>
              Detalhes
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
