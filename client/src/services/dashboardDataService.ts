
import { PendingTask, TrendData } from '@/types/dashboard';

export const fetchPendingTasks = async (): Promise<PendingTask[]> => {
  // Mock data para tarefas pendentes
  const mockTasks: PendingTask[] = [
    {
      id: 1,
      title: "Revisar feedback de João Silva",
      priority: "high",
      deadline: "Hoje"
    },
    {
      id: 2,
      title: "Aprovar certificado de Maria",
      priority: "medium",
      deadline: "Amanhã"
    },
    {
      id: 3,
      title: "Atualizar meta trimestral",
      priority: "low",
      deadline: "Esta semana"
    }
  ];

  return mockTasks;
};

export const fetchTrends = async (): Promise<TrendData[]> => {
  // Mock data para trends with correct date format
  const mockTrends: TrendData[] = [
    { date: '2024-01-01', value: 65 },
    { date: '2024-02-01', value: 70 },
    { date: '2024-03-01', value: 68 },
    { date: '2024-04-01', value: 75 },
    { date: '2024-05-01', value: 80 },
    { date: '2024-06-01', value: 85 }
  ];

  return mockTrends;
};
