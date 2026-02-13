
import { Company, CustomerHealthScore, FounderAnalytics } from '@/types/founder';

export const analyticsCalculators = {
  // Calculate revenue analytics
  calculateRevenueAnalytics(companies: Company[]) {
    const activeCompanies = companies.filter(c => c.status === 'active');
    const total_mrr = activeCompanies.reduce((sum, c) => sum + (c.mrr || 0), 0);
    const total_arr = total_mrr * 12;
    
    // Calculate MRR growth (mock calculation)
    const mrr_growth = Math.round((total_mrr * 0.15) * 100) / 100; // 15% growth assumption
    
    return {
      total_mrr,
      total_arr,
      mrr_growth,
      churn_rate: 0, // Will be calculated from function
      ltv: total_arr / activeCompanies.length || 0,
      cac: 150 // Mock CAC
    };
  },

  // Calculate customer analytics
  calculateCustomerAnalytics(companies: Company[]) {
    const now = new Date();
    const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    
    return {
      total_customers: companies.length,
      active_customers: companies.filter(c => c.status === 'active').length,
      trial_customers: companies.filter(c => c.trial_ends_at && new Date(c.trial_ends_at) > now).length,
      churned_customers: companies.filter(c => c.status === 'churned').length,
      new_customers_this_month: companies.filter(c => 
        new Date(c.created_at) >= thisMonth
      ).length
    };
  },

  // Calculate health analytics
  calculateHealthAnalytics(healthScores: CustomerHealthScore[]) {
    if (healthScores.length === 0) {
      return {
        healthy_customers: 0,
        at_risk_customers: 0,
        critical_customers: 0,
        avg_health_score: 0
      };
    }

    const healthy = healthScores.filter(h => h.health_score >= 70).length;
    const at_risk = healthScores.filter(h => h.health_score >= 40 && h.health_score < 70).length;
    const critical = healthScores.filter(h => h.health_score < 40).length;
    const avg_score = healthScores.reduce((sum, h) => sum + h.health_score, 0) / healthScores.length;

    return {
      healthy_customers: healthy,
      at_risk_customers: at_risk,
      critical_customers: critical,
      avg_health_score: Math.round(avg_score)
    };
  },

  // Get mock engagement analytics
  getMockEngagementAnalytics() {
    return {
      dau: 450,
      mau: 2800,
      avg_session_duration: 25, // minutes
      feature_adoption_rate: 73 // percentage
    };
  }
};
