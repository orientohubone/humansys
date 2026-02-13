
import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { DashboardData } from '@/types/dashboard';
import { fetchDashboardStats } from '@/services/dashboardStatsService';
import { fetchRecentActivities, logActivity as logActivityService } from '@/services/dashboardActivitiesService';
import { fetchPendingTasks, fetchTrends } from '@/services/dashboardDataService';

export const useOptimizedDashboardData = () => {
  const { user } = useAuth();
  const { toast } = useToast();

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
  const [loadingStage, setLoadingStage] = useState<'initial' | 'stats' | 'activities' | 'complete'>('initial');

  // Simplified sequential loading
  const loadAllData = useCallback(async () => {
    if (!user?.id) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setLoadingStage('stats');

      // Load stats first
      const stats = await fetchDashboardStats(user.id);
      setData(prev => ({ ...prev, stats: stats || prev.stats }));

      setLoadingStage('activities');

      // Load activities second
      const activities = await fetchRecentActivities(user.id);
      setData(prev => ({ ...prev, recentActivities: activities || [] }));

      // Load static data last (no loading state change)
      const [tasks, trends] = await Promise.all([
        fetchPendingTasks().catch(() => []),
        fetchTrends().catch(() => [])
      ]);

      setData(prev => ({
        ...prev,
        pendingTasks: tasks,
        trends: trends
      }));

      setLoadingStage('complete');

    } catch (error) {
      console.error('Dashboard loading error:', error);
      // Don't show toast for loading errors - too intrusive
    } finally {
      setIsLoading(false);
    }
  }, [user?.id]);

  // Debounced effect to prevent rapid reloads
  useEffect(() => {
    const timer = setTimeout(() => {
      if (user?.id) {
        loadAllData();
      } else {
        setIsLoading(false);
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [user?.id, loadAllData]);

  const logActivity = useCallback(
    async (
      type: string,
      description: string,
      entityType?: string,
      entityId?: string
    ) => {
      if (!user?.id) return;

      try {
        await logActivityService(user.id, type, description, entityType, entityId);
        // Reload activities after logging
        const newActivities = await fetchRecentActivities(user.id);
        setData(prev => ({
          ...prev,
          recentActivities: newActivities || prev.recentActivities
        }));
      } catch (error) {
        console.error('Error logging activity:', error);
      }
    },
    [user?.id]
  );

  return {
    data,
    isLoading,
    loadingStage,
    refetch: loadAllData,
    logActivity
  };
};
