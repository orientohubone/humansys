
import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
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

export const useFounderAnalytics = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [analytics, setAnalytics] = useState<FounderAnalytics>({
    revenue: {
      total_mrr: 0,
      total_arr: 0,
      mrr_growth: 0,
      churn_rate: 0,
      ltv: 0,
      cac: 0
    },
    customers: {
      total_customers: 0,
      active_customers: 0,
      trial_customers: 0,
      churned_customers: 0,
      new_customers_this_month: 0
    },
    engagement: {
      dau: 0,
      mau: 0,
      avg_session_duration: 0,
      feature_adoption_rate: 0
    },
    health: {
      healthy_customers: 0,
      at_risk_customers: 0,
      critical_customers: 0,
      avg_health_score: 0
    }
  });
  
  const [companies, setCompanies] = useState<Company[]>([]);
  const [healthScores, setHealthScores] = useState<CustomerHealthScore[]>([]);
  const [revenueChart, setRevenueChart] = useState<RevenueChartData[]>([]);
  const [churnAnalysis, setChurnAnalysis] = useState<ChurnAnalysis[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFounder, setIsFounder] = useState(false);

  // Load all analytics data
  const loadAllAnalytics = async () => {
    if (!isFounder) return;
    
    setIsLoading(true);
    try {
      const [companiesData, healthData] = await Promise.all([
        founderAnalyticsService.loadCompanies(),
        founderAnalyticsService.loadHealthScores()
      ]);
      
      setCompanies(companiesData);
      setHealthScores(healthData);
      
      // Calculate analytics
      const revenueAnalytics = analyticsCalculators.calculateRevenueAnalytics(companiesData);
      const customerAnalytics = analyticsCalculators.calculateCustomerAnalytics(companiesData);
      const healthAnalytics = analyticsCalculators.calculateHealthAnalytics(healthData);
      const engagementAnalytics = analyticsCalculators.getMockEngagementAnalytics();
      
      setAnalytics({
        revenue: revenueAnalytics,
        customers: customerAnalytics,
        engagement: engagementAnalytics,
        health: healthAnalytics
      });
      
      // Generate charts
      const [revenueChartData, churnAnalysisData] = await Promise.all([
        founderAnalyticsService.generateRevenueChart(),
        founderAnalyticsService.calculateChurnAnalysis()
      ]);
      
      setRevenueChart(revenueChartData);
      setChurnAnalysis(churnAnalysisData);
      
    } catch (error) {
      console.error('Error loading analytics:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar analytics.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Initialize
  useEffect(() => {
    const init = async () => {
      if (user) {
        const hasFounderRole = await founderAnalyticsService.checkFounderRole(user.id);
        setIsFounder(hasFounderRole);
        
        if (hasFounderRole) {
          await loadAllAnalytics();
        }
      }
    };
    
    init();
  }, [user]);

  return {
    analytics,
    companies,
    healthScores,
    revenueChart,
    churnAnalysis,
    isLoading,
    isFounder,
    refetch: loadAllAnalytics,
    exportToCSV: csvExporter.exportToCSV
  };
};
