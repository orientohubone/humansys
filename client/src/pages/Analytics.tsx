
import React from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Brain, 
  TrendingUp, 
  Users, 
  Target,
  AlertTriangle,
  FileText,
  ArrowLeft
} from 'lucide-react';
import { SmartAlerts } from '@/components/analytics/SmartAlerts';
import { AutoReportGenerator } from '@/components/analytics/AutoReportGenerator';
import { 
  LazyPredictiveAnalytics,
  LazyEngagementAnalytics,
  LazyProductivityAnalytics,
  LazyMLInsights
} from '@/components/common/LazyWrapper';

export const Analytics = () => {
  return (
    <DashboardLayout>
      <div className="space-y-4 xs:space-y-6">
        <div className="flex flex-col xs:flex-row xs:justify-between xs:items-start gap-2 xs:gap-4">
          <div className="flex items-center gap-3">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => window.history.back()}
              className="hover:bg-slate-100 dark:hover:bg-slate-800"
              title="Voltar"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-2xl xs:text-3xl font-bold text-gray-900 dark:text-white">Analytics Avançados</h1>
              <p className="text-xs xs:text-sm text-muted-foreground dark:text-gray-400 mt-1 xs:mt-2">
                IA Preditiva e insights inteligentes para estratégia
              </p>
            </div>
          </div>
        </div>

        <Tabs defaultValue="predictive" className="space-y-4 xs:space-y-6">
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-1 xs:gap-2 h-auto p-1 bg-white dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800">
            <TabsTrigger value="predictive" className="flex items-center gap-1 xs:gap-2 text-xs xs:text-sm py-1 xs:py-2 px-2 xs:px-3">
              <Brain className="h-4 w-4" />
              <span>IA Preditiva</span>
            </TabsTrigger>
            <TabsTrigger value="engagement" className="flex items-center gap-1 xs:gap-2 text-xs xs:text-sm py-1 xs:py-2 px-2 xs:px-3">
              <Users className="h-4 w-4" />
              <span>Engajamento</span>
            </TabsTrigger>
            <TabsTrigger value="productivity" className="flex items-center gap-1 xs:gap-2 text-xs xs:text-sm py-1 xs:py-2 px-2 xs:px-3">
              <TrendingUp className="h-4 w-4" />
              <span>Produtividade</span>
            </TabsTrigger>
            <TabsTrigger value="alerts" className="flex items-center gap-1 xs:gap-2 text-xs xs:text-sm py-1 xs:py-2 px-2 xs:px-3">
              <AlertTriangle className="h-4 w-4" />
              <span>Alertas</span>
            </TabsTrigger>
            <TabsTrigger value="reports" className="flex items-center gap-1 xs:gap-2 text-xs xs:text-sm py-1 xs:py-2 px-2 xs:px-3">
              <FileText className="h-4 w-4" />
              <span>Relatórios</span>
            </TabsTrigger>
            <TabsTrigger value="ml" className="flex items-center gap-1 xs:gap-2 text-xs xs:text-sm py-1 xs:py-2 px-2 xs:px-3">
              <Target className="h-4 w-4" />
              <span>ML Insights</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="predictive">
            <LazyPredictiveAnalytics />
          </TabsContent>

          <TabsContent value="engagement">
            <LazyEngagementAnalytics />
          </TabsContent>

          <TabsContent value="productivity">
            <LazyProductivityAnalytics />
          </TabsContent>

          <TabsContent value="alerts">
            <SmartAlerts />
          </TabsContent>

          <TabsContent value="reports">
            <AutoReportGenerator />
          </TabsContent>

          <TabsContent value="ml">
            <LazyMLInsights />
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};
