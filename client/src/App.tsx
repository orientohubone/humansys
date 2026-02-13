import React, { Suspense } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { GlobalErrorBoundary } from '@/components/common/GlobalErrorBoundary';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { AuthProvider } from '@/contexts/AuthContext';
import { Toaster } from '@/components/ui/toaster';
import AppRouter from '@/components/auth/AppRouter';
import DebugPanel from '@/components/debug/debugPanel';
import { AppProviders } from './contexts/AppProviders';
import { GlobalIAAssistant } from '@/components/common/GlobalIAAssistant';

function App() {
  try {
    return (
      <GlobalErrorBoundary>
        <AppProviders>
          <BrowserRouter>
            <AppRouter />
            <GlobalIAAssistant />
            <Toaster />
            <DebugPanel />
          </BrowserRouter>
        </AppProviders>
      </GlobalErrorBoundary>
    );
  } catch (error) {
    console.error('🚨 App crash:', error);
    return (
      <div className="min-h-screen flex items-center justify-center bg-red-50">
        <div className="text-center p-6">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Erro na Aplicação</h1>
          <p className="text-gray-600 mb-4">Ocorreu um erro inesperado. Tente recarregar a página.</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Recarregar Página
          </button>
        </div>
      </div>
    );
  }
}

export default App;