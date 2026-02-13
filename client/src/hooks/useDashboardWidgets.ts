
import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useToast } from '@/hooks/use-toast';

export interface DashboardWidget {
  id: string;
  title: string;
  description?: string;
  type: 'stats' | 'chart' | 'list' | 'action';
  position: { x: number; y: number };
  size: { width: number; height: number };
  isExpanded?: boolean;
  configuration?: Record<string, any>;
}

const DEFAULT_WIDGETS: DashboardWidget[] = [
  {
    id: 'stats-main',
    title: 'Estatísticas Principais',
    description: 'Métricas chave do sistema',
    type: 'stats',
    position: { x: 0, y: 0 },
    size: { width: 4, height: 1 }
  },
  {
    id: 'trends-chart',
    title: 'Tendências',
    description: 'Evolução ao longo do tempo',
    type: 'chart',
    position: { x: 0, y: 1 },
    size: { width: 2, height: 2 }
  },
  {
    id: 'recent-activities',
    title: 'Atividades Recentes',
    description: 'Últimas movimentações',
    type: 'list',
    position: { x: 2, y: 1 },
    size: { width: 1, height: 2 }
  },
  {
    id: 'quick-actions',
    title: 'Ações Rápidas',
    description: 'Acesso direto às funcionalidades',
    type: 'action',
    position: { x: 3, y: 1 },
    size: { width: 1, height: 2 }
  }
];

export const useDashboardWidgets = () => {
  const { toast } = useToast();
  const [widgets, setWidgets] = useState<DashboardWidget[]>(() => {
    const saved = localStorage.getItem('@humansys:dashboard-widgets');
    return saved ? JSON.parse(saved) : DEFAULT_WIDGETS;
  });

  const saveWidgets = useCallback((newWidgets: DashboardWidget[]) => {
    setWidgets(newWidgets);
    localStorage.setItem('@humansys:dashboard-widgets', JSON.stringify(newWidgets));
  }, []);

  const addWidget = useCallback((widget: Omit<DashboardWidget, 'id'>) => {
    const newWidget: DashboardWidget = {
      ...widget,
      id: `widget-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    };
    
    const newWidgets = [...widgets, newWidget];
    saveWidgets(newWidgets);
    
    toast({
      title: "Widget Adicionado",
      description: `${widget.title} foi adicionado ao dashboard.`
    });
  }, [widgets, saveWidgets, toast]);

  const removeWidget = useCallback((widgetId: string) => {
    const widget = widgets.find(w => w.id === widgetId);
    const newWidgets = widgets.filter(w => w.id !== widgetId);
    saveWidgets(newWidgets);
    
    toast({
      title: "Widget Removido",
      description: widget ? `${widget.title} foi removido do dashboard.` : "Widget removido."
    });
  }, [widgets, saveWidgets, toast]);

  const updateWidget = useCallback((widgetId: string, updates: Partial<DashboardWidget>) => {
    const newWidgets = widgets.map(widget => 
      widget.id === widgetId 
        ? { ...widget, ...updates }
        : widget
    );
    saveWidgets(newWidgets);
  }, [widgets, saveWidgets]);

  const expandWidget = useCallback((widgetId: string) => {
    updateWidget(widgetId, { 
      isExpanded: !widgets.find(w => w.id === widgetId)?.isExpanded 
    });
  }, [widgets, updateWidget]);

  const moveWidget = useCallback((widgetId: string, newPosition: { x: number; y: number }) => {
    updateWidget(widgetId, { position: newPosition });
  }, [updateWidget]);

  const resizeWidget = useCallback((widgetId: string, newSize: { width: number; height: number }) => {
    updateWidget(widgetId, { size: newSize });
  }, [updateWidget]);

  const resetWidgets = useCallback(() => {
    saveWidgets(DEFAULT_WIDGETS);
    toast({
      title: "Dashboard Resetado",
      description: "O layout foi restaurado para o padrão."
    });
  }, [saveWidgets, toast]);

  const configureWidget = useCallback((widgetId: string, configuration: Record<string, any>) => {
    updateWidget(widgetId, { configuration });
    toast({
      title: "Widget Configurado",
      description: "As configurações foram salvas."
    });
  }, [updateWidget, toast]);

  return {
    widgets,
    addWidget,
    removeWidget,
    updateWidget,
    expandWidget,
    moveWidget,
    resizeWidget,
    resetWidgets,
    configureWidget
  };
};
