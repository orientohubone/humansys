
import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useOptimizedCache } from './useOptimizedCache';
import { 
  FounderAnalytics, 
  Company, 
  CustomerHealthScore, 
  RevenueChartData, 
  ChurnAnalysis
} from '@/types/founder';
import { founderAnalyticsService } from '@/services/founderAnalyticsService';
import { analyticsCalculators } from '@/utils/founderAnalyticsCalculators';
import { csvExporter } from '@/utils/csvExporter';

interface CachedAnalyticsData {
  companies: Company[];
  healthScores: CustomerHealthScore[];
  analytics: FounderAnalytics;
  revenueChart: RevenueChartData[];
  churnAnalysis: ChurnAnalysis[];
}

export const useOptimizedFounderAnalytics = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const cache = useOptimizedCache();
  
  const founderRoleTTL = process.env.NODE_ENV === "development" ? 15 * 1000 : 60 * 1000;
  
  const [analytics, setAnalytics] = useState<FounderAnalytics>({
    revenue: { total_mrr: 0, total_arr: 0, mrr_growth: 0, churn_rate: 0, ltv: 0, cac: 0 },
    customers: { total_customers: 0, active_customers: 0, trial_customers: 0, churned_customers: 0, new_customers_this_month: 0 },
    engagement: { dau: 0, mau: 0, avg_session_duration: 0, feature_adoption_rate: 0 },
    health: { healthy_customers: 0, at_risk_customers: 0, critical_customers: 0, avg_health_score: 0 }
  });
  
  const [companies, setCompanies] = useState<Company[]>([]);
  const [healthScores, setHealthScores] = useState<CustomerHealthScore[]>([]);
  const [revenueChart, setRevenueChart] = useState<RevenueChartData[]>([]);
  const [churnAnalysis, setChurnAnalysis] = useState<ChurnAnalysis[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFounder, setIsFounder] = useState<boolean | null>(null);

  // Clear cache when user changes
  useEffect(() => {
    if (user?.id) {
      cache.clear();
      localStorage.removeItem(`@humansys:founder-role-${user.id}`);
    }
  }, [user?.id, cache]);

  // Verificar role de founder de forma otimizada
  const checkFounderRole = useCallback(async () => {
    if (!user?.id) return false;
    
    // Simplified founder role check to prevent timeouts
    try {
      // For now, return false to prevent blocking the UI
      // This can be enhanced later with proper backend implementation
      return false;
    } catch (error) {
      console.error('Error checking founder role:', error);
      return false;
    }
  }, [user?.id]);

  // Carregar dados de forma otimizada e paralela
  const loadAnalyticsData = useCallback(async () => {
    if (!user?.id) return;
    
    const cacheKey = `analytics-${user.id}`;
    const cachedData = cache.get(cacheKey) as CachedAnalyticsData | null;
    
    if (cachedData) {
      console.log('Analytics: Usando dados do cache');
      setCompanies(cachedData.companies || []);
      setHealthScores(cachedData.healthScores || []);
      setAnalytics(cachedData.analytics);
      setRevenueChart(cachedData.revenueChart || []);
      setChurnAnalysis(cachedData.churnAnalysis || []);
      return;
    }

    try {
      console.log('Analytics: Carregando dados frescos...');
      
      // Carregar dados básicos em paralelo
      const [companiesData, healthData] = await Promise.all([
        founderAnalyticsService.loadCompanies(),
        founderAnalyticsService.loadHealthScores()
      ]);
      
      // Calcular analytics localmente (mais rápido)
      const revenueAnalytics = analyticsCalculators.calculateRevenueAnalytics(companiesData);
      const customerAnalytics = analyticsCalculators.calculateCustomerAnalytics(companiesData);
      const healthAnalytics = analyticsCalculators.calculateHealthAnalytics(healthData);
      const engagementAnalytics = analyticsCalculators.getMockEngagementAnalytics();
      
      const calculatedAnalytics = {
        revenue: revenueAnalytics,
        customers: customerAnalytics,
        engagement: engagementAnalytics,
        health: healthAnalytics
      };

      // Gerar charts em background
      const [revenueChartData, churnAnalysisData] = await Promise.all([
        founderAnalyticsService.generateRevenueChart(),
        founderAnalyticsService.calculateChurnAnalysis()
      ]);

      const result: CachedAnalyticsData = {
        companies: companiesData,
        healthScores: healthData,
        analytics: calculatedAnalytics,
        revenueChart: revenueChartData,
        churnAnalysis: churnAnalysisData
      };

      // Atualizar estado
      setCompanies(companiesData);
      setHealthScores(healthData);
      setAnalytics(calculatedAnalytics);
      setRevenueChart(revenueChartData);
      setChurnAnalysis(churnAnalysisData);

      // Cache por 5 minutos
      cache.set(cacheKey, result, 5 * 60 * 1000);
      
    } catch (error) {
      console.error('Error loading analytics:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar analytics.",
        variant: "destructive"
      });
    }
  }, [user?.id, cache, toast]);

  // Inicialização otimizada
  useEffect(() => {
    const initializeFounderDashboard = async () => {
      if (!user?.id) {
        setIsLoading(false);
        setIsFounder(false);
        return;
      }
      
      setIsLoading(true);
      
      try {
        // Verificar role primeiro
        const hasFounderRole = await checkFounderRole();
        setIsFounder(hasFounderRole);
        setIsLoading(false); // Libera painel logo após identificar founder
        
        if (hasFounderRole) {
          // Carrega dados em background, não trava o painel
          loadAnalyticsData(); // Não precisa de await
        }
      } catch (error) {
        console.error('Error initializing founder dashboard:', error);
        setIsFounder(false);
        setIsLoading(false);
      }
    };

    initializeFounderDashboard();
  }, [user?.id, checkFounderRole, loadAnalyticsData]);

  const refetch = useCallback(async () => {
    if (!user?.id) return;
    
    // Limpar cache para forçar reload
    cache.clear();
    localStorage.removeItem(`@humansys:founder-role-${user.id}`);
    
    await loadAnalyticsData();
  }, [user?.id, cache, loadAnalyticsData]);

  return {
    analytics,
    companies,
    healthScores,
    revenueChart,
    churnAnalysis,
    isLoading,
    isFounder: isFounder ?? false,
    refetch,
    exportToCSV: csvExporter.exportToCSV,
    cacheStats: cache.stats
  };
};
