
import React, { Suspense, lazy } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

interface LazyWrapperProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  minHeight?: string;
}

const DefaultFallback = ({ minHeight = "200px" }: { minHeight?: string }) => (
  <Card style={{ minHeight }}>
    <CardContent className="p-6">
      <div className="space-y-4">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-32 w-full" />
        <div className="flex space-x-2">
          <Skeleton className="h-8 w-20" />
          <Skeleton className="h-8 w-20" />
        </div>
      </div>
    </CardContent>
  </Card>
);

export const LazyWrapper: React.FC<LazyWrapperProps> = ({ 
  children, 
  fallback,
  minHeight = "200px" 
}) => {
  return (
    <Suspense fallback={fallback || <DefaultFallback minHeight={minHeight} />}>
      {children}
    </Suspense>
  );
};

// HOC para tornar componentes lazy com tipos corretos
export const withLazyLoading = <P extends Record<string, any>>(
  importFunc: () => Promise<{ default: React.ComponentType<P> }>,
  fallback?: React.ReactNode
) => {
  const LazyComponent = lazy(importFunc);
  
  return React.forwardRef<any, P>((props, ref) => (
    <LazyWrapper fallback={fallback}>
      <LazyComponent {...props} ref={ref} />
    </LazyWrapper>
  ));
};

// Lazy load dos componentes de analytics com exports nomeados
export const LazyPredictiveAnalytics = withLazyLoading(
  () => import('@/components/analytics/PredictiveAnalytics').then(module => ({ default: module.PredictiveAnalytics }))
);

export const LazyEngagementAnalytics = withLazyLoading(
  () => import('@/components/analytics/EngagementAnalytics').then(module => ({ default: module.EngagementAnalytics }))
);

export const LazyProductivityAnalytics = withLazyLoading(
  () => import('@/components/analytics/ProductivityAnalytics').then(module => ({ default: module.ProductivityAnalytics }))
);

export const LazyMLInsights = withLazyLoading(
  () => import('@/components/analytics/MLInsights').then(module => ({ default: module.MLInsights }))
);
