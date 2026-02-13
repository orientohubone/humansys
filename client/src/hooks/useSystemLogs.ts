import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';

export type LogLevel = 'info' | 'warning' | 'error' | 'debug';

export interface SystemLog {
  id: string;
  user_id: string;
  level: LogLevel;
  message: string;
  details?: any;
  source: string;
  created_at: string;
}

export const useSystemLogs = () => {
  const [logs, setLogs] = useState<SystemLog[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const fetchLogs = useCallback(async () => {
    if (!user) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/system-logs');
      if (!response.ok) {
        throw new Error('Failed to fetch system logs');
      }
      
      const data = await response.json();
      setLogs(data);
    } catch (error: any) {
      console.error('Error fetching system logs:', error);
      setError(error.message);
      setLogs([]);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  const createLog = useCallback(async (
    level: LogLevel,
    message: string,
    source: string,
    details?: any
  ) => {
    if (!user) return;

    try {
      const response = await fetch('/api/system-logs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: user.id,
          level,
          message,
          source,
          details
        }),
      });

      if (!response.ok) {
        console.error('Failed to create system log');
        return;
      }

      // Optionally refresh logs
      await fetchLogs();
    } catch (error: any) {
      console.error('Error creating system log:', error);
    }
  }, [user, fetchLogs]);

  const logInfo = useCallback((message: string, source: string = 'system', details?: any) => {
    return createLog('info', message, source, details);
  }, [createLog]);

  const logWarning = useCallback((message: string, source: string = 'system', details?: any) => {
    return createLog('warning', message, source, details);
  }, [createLog]);

  const logError = useCallback((message: string, source: string = 'system', details?: any) => {
    return createLog('error', message, source, details);
  }, [createLog]);

  const logDebug = useCallback((message: string, source: string = 'system', details?: any) => {
    return createLog('debug', message, source, details);
  }, [createLog]);

  useEffect(() => {
    if (user) {
      fetchLogs();
    }
  }, [user, fetchLogs]);

  return {
    logs,
    isLoading,
    error,
    fetchLogs,
    createLog,
    logInfo,
    logWarning,
    logError,
    logDebug
  };
};