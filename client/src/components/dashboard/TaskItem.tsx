import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Clock, AlertCircle, CheckCircle } from 'lucide-react';

interface Task {
  id: number;
  title: string;
  priority: 'low' | 'medium' | 'high';
  dueDate: string;
  status: 'pending' | 'in_progress' | 'completed';
}

interface TaskItemProps {
  task: Task;
  onStatusChange?: (id: number, status: string) => void;
}

export const TaskItem: React.FC<TaskItemProps> = ({
  task,
  onStatusChange
}) => {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      case 'medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'low': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'in_progress': return <Clock className="h-4 w-4 text-blue-500" />;
      case 'pending': return <AlertCircle className="h-4 w-4 text-orange-500" />;
      default: return <AlertCircle className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed': return 'Concluída';
      case 'in_progress': return 'Em andamento';
      case 'pending': return 'Pendente';
      default: return 'Desconhecido';
    }
  };

  return (
    <div className="flex flex-col xs:flex-row items-start xs:items-center gap-2 xs:gap-3 p-2 xs:p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
      <div className="flex items-center gap-2 xs:gap-3 flex-1 w-full xs:w-auto">
        <div className="flex-shrink-0">
          {getStatusIcon(task.status)}
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="text-xs xs:text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
            {task.title}
          </h4>
          <div className="flex items-center gap-1 xs:gap-2 mt-0.5 xs:mt-1 flex-wrap">
            <Badge 
              variant="secondary" 
              className={`text-xs ${getPriorityColor(task.priority)}`}
            >
              {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
            </Badge>
            <span className="text-xs text-gray-500 dark:text-gray-400 truncate">
              {task.dueDate}
            </span>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-1 xs:gap-2 text-xs flex-shrink-0">
        <span className="text-xs text-gray-500 dark:text-gray-400 hidden xs:inline">
          {getStatusText(task.status)}
        </span>
        <Button 
          variant="ghost" 
          size="sm"
          className="text-xs px-1 xs:px-2 h-7 xs:h-8"
          onClick={() => onStatusChange?.(task.id, 'completed')}
        >
          <span className="hidden xs:inline">Concluir</span>
          <span className="xs:hidden">OK</span>
        </Button>
      </div>
    </div>
  );
};