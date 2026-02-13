

import { DashboardStats } from '@/types/dashboard';

export const fetchDashboardStats = async (userId: string): Promise<DashboardStats> => {
  // Total de colaboradores


  // Processos ativos de onboarding


  // Taxa de conclusão (usando training enrollments como proxy)




  const completionRate = totalEnrollments ? Math.round((completedEnrollments || 0) / totalEnrollments * 100) : 0;

  // Pontos de gamificação do localStorage
  const gamificationData = localStorage.getItem(`@humansys:gamification-${userId}`);
  const gamificationPoints = gamificationData ? JSON.parse(gamificationData).totalPoints || 100 : 100;

  return {
    totalCollaborators: totalCollaborators || 0,
    activeProcesses: activeProcesses || 0,
    completionRate,
    gamificationPoints
  };
};
