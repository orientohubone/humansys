import React, { createContext, useContext, useEffect, useState } from 'react';

interface SecurityContextType {
  isSecure: boolean;
  securityLevel: 'low' | 'medium' | 'high';
  blockAccess: (reason: string) => void;
}

const SecurityContext = createContext<SecurityContextType | null>(null);

export const useSecurityContext = () => {
  const context = useContext(SecurityContext);
  if (!context) {
    throw new Error('useSecurityContext must be used within SecurityProvider');
  }
  return context;
};

interface SecurityProviderProps {
  children: React.ReactNode;
}

export const SecurityProvider: React.FC<SecurityProviderProps> = ({ children }) => {
  const [isSecure, setIsSecure] = useState(true);
  const [securityLevel, setSecurityLevel] = useState<'low' | 'medium' | 'high'>('medium');

  const logSecurityEvent = async (eventData: {
    type: string;
    user_agent: string;
    timestamp: string;
    [key: string]: any;
  }) => {
    try {
      // Mock logging - in real app this would send to a security service
      console.log('Security event logged:', eventData);
    } catch (error) {
      console.error('Error logging security event:', error);
    }
  };

  useEffect(() => {
    // Verificação básica de integridade apenas
    const checkBasicSecurity = async () => {
      try {
        // Verificar se está rodando em iframe
        if (window.top !== window.self) {
          const isReplitDev = window.location.hostname.includes('replit') || 
                             window.location.hostname.includes('repl.co') ||
                             window.location.hostname.includes('replit.dev');

          if (!isReplitDev) {
            await logSecurityEvent({
              type: 'suspicious_activity',
              user_agent: navigator.userAgent,
              timestamp: new Date().toISOString(),
              reason: 'iframe_detected', 
              hostname: window.location.hostname,
              referrer: document.referrer,
              blocked: false
            });
          }
        }
      } catch (error) {
        console.error('Erro na verificação de segurança:', error);
      }
    };

    checkBasicSecurity();
  }, []);

  const blockAccess = async (reason: string) => {
    setIsSecure(false);

    await logSecurityEvent({
      type: 'suspicious_activity',
      user_agent: navigator.userAgent,
      timestamp: new Date().toISOString(),
    });

    // Apenas log, sem bloqueio visual
    console.warn(`Acesso bloqueado: ${reason}`);
  };

  const value: SecurityContextType = {
    isSecure,
    securityLevel,
    blockAccess,
  };

  return (
    <SecurityContext.Provider value={value}>
      {children}
    </SecurityContext.Provider>
  );
};