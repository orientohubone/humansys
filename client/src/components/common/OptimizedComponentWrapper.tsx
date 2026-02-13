import React, { useState, useEffect, ReactNode } from 'react';
import { AlertCircle, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface OptimizedComponentWrapperProps {
  children: ReactNode;
  timeout?: number;
  fallback?: ReactNode;
  moduleTitle?: string;
}

export const OptimizedComponentWrapper: React.FC<OptimizedComponentWrapperProps> = ({
  children,
  timeout = 8000,
  fallback,
  moduleTitle = 'Módulo'
}) => {
  const [isTimedOut, setIsTimedOut] = useState(false);
  const [key, setKey] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsTimedOut(true);
    }, timeout);

    return () => clearTimeout(timer);
  }, [timeout, key]);

  if (isTimedOut) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 flex items-center justify-center p-4">
        <Card className="w-full max-w-md border-2">
          <div className="p-8 space-y-6 text-center">
            <AlertCircle className="w-16 h-16 text-yellow-600 dark:text-yellow-400 mx-auto" />
            <div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-50 mb-2">
                {moduleTitle} está sendo otimizado
              </h3>
              <p className="text-slate-600 dark:text-slate-400 mb-4">
                O carregamento demorou mais que o esperado. Vamos tentar novamente com uma versão otimizada.
              </p>
            </div>
            <Button 
              onClick={() => {
                setIsTimedOut(false);
                setKey(prev => prev + 1);
              }}
              className="w-full"
            >
              <RotateCcw className="mr-2 h-4 w-4" />
              Recarregar Módulo
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return <>{children}</>;
};

export default OptimizedComponentWrapper;
