
import React from 'react';
import { useTrialStatus } from '@/hooks/useTrialStatus';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Clock, CreditCard, AlertTriangle } from 'lucide-react';

export const TrialBanner = () => {
  const { isActive, daysRemaining, isExpired, isNearExpiration } = useTrialStatus();
  const navigate = useNavigate();

  if (!isActive) {
    return null; // Usuário pagante ou founder
  }

  // Para novos usuários, mostrar mensagem de boas-vindas mesmo quando tecnicamente "expirado"
  if (daysRemaining >= 25) {
    return (
      <Alert className="border-green-500 bg-green-50 mb-4">
        <AlertTriangle className="h-4 w-4 text-green-600" />
        <AlertDescription className="flex items-center justify-between">
          <span className="text-green-800">
            <strong>Parabéns! Seu teste grátis começou!</strong> Explore todos os recursos da plataforma HumanSys por 30 dias.
          </span>
          <Button 
            onClick={() => navigate('/checkout')}
            className="bg-green-600 hover:bg-green-700 text-white ml-4"
            size="sm"
          >
            <CreditCard className="h-4 w-4 mr-2" />
            Ver Planos
          </Button>
        </AlertDescription>
      </Alert>
    );
  }

  if (isNearExpiration) {
    return (
      <Alert className="border-orange-500 bg-orange-50 mb-4">
        <Clock className="h-4 w-4 text-orange-600" />
        <AlertDescription className="flex items-center justify-between">
          <span className="text-orange-800">
            <strong>Teste grátis expira em {daysRemaining} dia(s)!</strong> Contrate um plano para não perder o acesso.
          </span>
          <Button 
            onClick={() => navigate('/checkout')}
            className="bg-orange-600 hover:bg-orange-700 text-white ml-4"
            size="sm"
          >
            <CreditCard className="h-4 w-4 mr-2" />
            Ver Planos
          </Button>
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <Alert className="border-blue-500 bg-blue-50 mb-4">
      <Clock className="h-4 w-4 text-blue-600" />
      <AlertDescription className="flex items-center justify-between">
        <span className="text-blue-800">
          <strong>Teste grátis ativo!</strong> {daysRemaining} dias restantes para explorar todas as funcionalidades.
        </span>
        <Button 
          onClick={() => navigate('/checkout')}
          variant="outline"
          className="border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white ml-4"
          size="sm"
        >
          Ver Planos
        </Button>
      </AlertDescription>
    </Alert>
  );
};
