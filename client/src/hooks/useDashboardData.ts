
import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { DashboardData } from '@/types/dashboard';
import { fetchDashboardStats } from '@/services/dashboardStatsService';
import { fetchRecentActivities, logActivity as logActivityService } from '@/services/dashboardActivitiesService';
import { fetchPendingTasks, fetchTrends } from '@/services/dashboardDataService';

export const useDashboardData = () => {
  const [data, setData] = useState<DashboardData>({
    stats: {
      totalCollaborators: 0,
      activeProcesses: 0,
      completionRate: 0,
      gamificationPoints: 100
    },
    recentActivities: [],
    pendingTasks: [],
    trends: []
  });
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  const loadDashboardStats = async () => {
    if (!user) return;

    try {
      const stats = await fetchDashboardStats(user.id);
      setData(prev => ({
        ...prev,
        stats
      }));
    } catch (error) {
      console.error('Erro ao carregar estatísticas:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar as estatísticas do dashboard.",
        variant: "destructive"
      });
    }
  };

  const loadRecentActivities = async () => {
    if (!user) return;

    try {
      const activities = await fetchRecentActivities(user.id);
      setData(prev => ({
        ...prev,
        recentActivities: activities
      }));
    } catch (error) {
      console.error('Erro ao carregar atividades:', error);
    }
  };

  const loadPendingTasks = async () => {
    try {
      const tasks = await fetchPendingTasks();
      setData(prev => ({
        ...prev,
        pendingTasks: tasks
      }));
    } catch (error) {
      console.error('Erro ao carregar tarefas:', error);
    }
  };

  const loadTrends = async () => {
    try {
      const trends = await fetchTrends();
      setData(prev => ({
        ...prev,
        trends
      }));
    } catch (error) {
      console.error('Erro ao carregar trends:', error);
    }
  };

  const loadAllData = async () => {
    if (!user) return;

    try {
      setIsLoading(true);
      await Promise.all([
        loadDashboardStats(),
        loadRecentActivities(),
        loadPendingTasks(),
        loadTrends()
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const logActivity = async (type: string, description: string, entityType?: string, entityId?: string) => {
    if (!user) return;

    try {
      await logActivityService(user.id, type, description, entityType, entityId);
      loadRecentActivities();
    } catch (error) {
      console.error('Erro ao registrar atividade:', error);
    }
  };

  useEffect(() => {
    if (user) {
      loadAllData();
    }
  }, [user]);

  return {
    data,
    isLoading,
    refetch: loadAllData,
    logActivity
  };
};
