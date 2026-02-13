
import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';

interface SecurityEvent {
  id: string;
  type: 'login_attempt' | 'suspicious_activity' | 'data_access';
  timestamp: string;
  severity: 'low' | 'medium' | 'high';
}

export const useSecurityProtection = () => {
  const { user } = useAuth();
  const [securityEvents, setSecurityEvents] = useState<SecurityEvent[]>([]);
  const [isMonitoring, setIsMonitoring] = useState(false);

  useEffect(() => {
    if (user) {
      startMonitoring();
    } else {
      stopMonitoring();
    }
  }, [user]);

  const startMonitoring = () => {
    setIsMonitoring(true);
    logSecurityEvent('login_attempt', 'User logged in successfully', 'low');
  };

  const stopMonitoring = () => {
    setIsMonitoring(false);
  };

  const logSecurityEvent = (
    type: SecurityEvent['type'], 
    severity: SecurityEvent['severity'] = 'low'
  ) => {
    const event: SecurityEvent = {
      id: Date.now().toString(),
      type,
      timestamp: new Date().toISOString(),
      details,
      severity
    };

    setSecurityEvents(prev => [event, ...prev.slice(0, 99)]); // Keep last 100 events

    // In a real app, this would send to a security monitoring service
    console.log('Security event logged:', event);
  };

  const getSecuritySummary = () => {
    const recentEvents = securityEvents.filter(
      event => Date.now() - new Date(event.timestamp).getTime() < 24 * 60 * 60 * 1000
    );

    return {
      totalEvents: securityEvents.length,
      recentEvents: recentEvents.length,
      highSeverityEvents: recentEvents.filter(e => e.severity === 'high').length,
      lastActivity: securityEvents[0]?.timestamp || null
    };
  };

  return {
    securityEvents,
    isMonitoring,
    logSecurityEvent,
    getSecuritySummary,
    startMonitoring,
    stopMonitoring
  };
};
