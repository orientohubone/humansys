import React from 'react';
import { IAAssistantDialog } from '@/components/dashboard/IAAssistantDialog';
import { useIAAssistant } from '@/contexts/IAAssistantContext';

export const GlobalIAAssistant: React.FC = () => {
  const { isOpen, close } = useIAAssistant();

  return (
    <IAAssistantDialog 
      open={isOpen} 
      onOpenChange={close} 
    />
  );
};
