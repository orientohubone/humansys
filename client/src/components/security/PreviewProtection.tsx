import React from 'react';

export const PreviewProtection: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Componente simplificado - apenas renderiza children sem proteções visuais
  return <>{children}</>;
};