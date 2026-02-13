
import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';

interface SystemHealth {
  status: 'healthy' | 'warning' | 'critical';
  uptime: number;
  memoryUsage: number;
  activeUsers: number;
  lastCheck: string;
}

interface SystemAlert {
  id: string;
  type: 'info' | 'warning' | 'error';
  message: string;
  timestamp: string;
  resolved: boolean;
}

export const useSystemManagement = () => {
  const { user } = useAuth();
  const [systemHealth, setSystemHealth] = useState<SystemHealth>({
    status: 'healthy',
    uptime: 0,
    memoryUsage: 0,
    activeUsers: 1,
    lastCheck: new Date().toISOString()
  });
  const [alerts, setAlerts] = useState<SystemAlert[]>([]);
  const [isMonitoring, setIsMonitoring] = useState(false);

  useEffect(() => {
    if (user) {
      startMonitoring();
    } else {
      stopMonitoring();
    }

    return () => stopMonitoring();
  }, [user]);

  const startMonitoring = () => {
    if (isMonitoring) return;
    
    setIsMonitoring(true);
    
    // Simulate system health checks
    const interval = setInterval(() => {
      checkSystemHealth();
    }, 30000); // Every 30 seconds

    // Initial check
    checkSystemHealth();

    return () => {
      clearInterval(interval);
      setIsMonitoring(false);
    };
  };

  const stopMonitoring = () => {
    setIsMonitoring(false);
  };

  const checkSystemHealth = () => {
    // Simulate health metrics
    const memoryUsage = Math.random() * 100;
    const uptime = Date.now() - (Date.now() % (24 * 60 * 60 * 1000)); // Simulate uptime
    
    let status: SystemHealth['status'] = 'healthy';
    
    if (memoryUsage > 90) {
      status = 'critical';
      addAlert('error', 'Uso de memória crítico: ' + memoryUsage.toFixed(1) + '%');
    } else if (memoryUsage > 75) {
      status = 'warning';
      addAlert('warning', 'Uso de memória alto: ' + memoryUsage.toFixed(1) + '%');
    }

    setSystemHealth({
      status,
      uptime,
      memoryUsage,
      activeUsers: Math.floor(Math.random() * 10) + 1,
      lastCheck: new Date().toISOString()
    });
  };

  const addAlert = (type: SystemAlert['type'], message: string) => {
    const alert: SystemAlert = {
      id: Date.now().toString(),
      type,
      message,
      timestamp: new Date().toISOString(),
      resolved: false
    };

    setAlerts(prev => [alert, ...prev.slice(0, 49)]); // Keep last 50 alerts
  };

  const resolveAlert = (alertId: string) => {
    setAlerts(prev => 
      prev.map(alert => 
        alert.id === alertId ? { ...alert, resolved: true } : alert
      )
    );
  };

  const clearResolvedAlerts = () => {
    setAlerts(prev => prev.filter(alert => !alert.resolved));
  };

  const getSystemStats = () => {
    const unresolvedAlerts = alerts.filter(alert => !alert.resolved);
    const criticalAlerts = unresolvedAlerts.filter(alert => alert.type === 'error');
    const warningAlerts = unresolvedAlerts.filter(alert => alert.type === 'warning');

    return {
      health: systemHealth,
      totalAlerts: alerts.length,
      unresolvedAlerts: unresolvedAlerts.length,
      criticalAlerts: criticalAlerts.length,
      warningAlerts: warningAlerts.length,
      isMonitoring
    };
  };

  const restartSystem = async () => {
    try {
      addAlert('info', 'Sistema reiniciado pelo administrador');
      
      // Simulate restart
      setSystemHealth(prev => ({
        ...prev,
        status: 'healthy',
        memoryUsage: Math.random() * 30, // Lower after restart
        lastCheck: new Date().toISOString()
      }));

      return { success: true };
    } catch (error) {
      console.error('Erro ao reiniciar sistema:', error);
      addAlert('error', 'Falha ao reiniciar o sistema');
      return { success: false, error };
    }
  };

  return {
    systemHealth,
    alerts,
    isMonitoring,
    checkSystemHealth,
    addAlert,
    resolveAlert,
    clearResolvedAlerts,
    getSystemStats,
    restartSystem,
    startMonitoring,
    stopMonitoring
  };
};
