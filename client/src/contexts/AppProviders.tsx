
import React from 'react';
import { ThemeProvider } from './ThemeContext';
import { AuthProvider } from './AuthContext';
import { IAAssistantProvider } from './IAAssistantContext';

interface AppProvidersProps {
  children: React.ReactNode;
}

export const AppProviders: React.FC<AppProvidersProps> = ({ children }) => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <IAAssistantProvider>
          {children}
        </IAAssistantProvider>
      </AuthProvider>
    </ThemeProvider>
  );
};
