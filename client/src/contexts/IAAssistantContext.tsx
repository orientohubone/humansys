import React, { createContext, useContext, useState } from 'react';

interface IAAssistantContextType {
  isOpen: boolean;
  open: () => void;
  close: () => void;
}

const IAAssistantContext = createContext<IAAssistantContextType | undefined>(undefined);

export const IAAssistantProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);

  const open = () => setIsOpen(true);
  const close = () => setIsOpen(false);

  return (
    <IAAssistantContext.Provider value={{ isOpen, open, close }}>
      {children}
    </IAAssistantContext.Provider>
  );
};

export const useIAAssistant = () => {
  const context = useContext(IAAssistantContext);
  if (!context) {
    throw new Error('useIAAssistant must be used within IAAssistantProvider');
  }
  return context;
};
