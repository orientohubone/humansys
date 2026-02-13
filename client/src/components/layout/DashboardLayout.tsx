import React from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { UpdateBanner } from './UpdateBanner';
import { TrialBanner } from '@/components/auth/TrialBanner';
import { usePagePreloader } from '@/hooks/usePagePreloader';
import { Loader2 } from 'lucide-react';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const isLoading = usePagePreloader(200);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
          <p className="text-sm text-muted-foreground">Carregando página...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-background overflow-x-hidden">
      <UpdateBanner />
      <div className="w-full flex min-h-screen bg-gray-50 dark:bg-gray-950">
        <Sidebar />
        <div 
          className="flex-1 flex flex-col overflow-hidden transition-all duration-300 ease-out ml-0 lg:ml-[var(--sidebar-width)]"
          style={{ 
            width: 'calc(100vw - var(--sidebar-width, 0px))'
          }}
        >
          <Header />
          <main className="flex-1 overflow-x-hidden overflow-y-auto bg-transparent p-1.5 sm:p-2 md:p-3 lg:p-4 xl:p-6">
            <div className="w-full max-w-none mx-auto">
              <div className="bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl rounded-lg sm:rounded-xl md:rounded-2xl lg:rounded-3xl shadow-2xl shadow-gray-200/20 dark:shadow-gray-900/20 border border-white/20 dark:border-gray-800/20 p-2 sm:p-3 md:p-4 lg:p-6 xl:p-8 min-h-screen sm:min-h-[calc(100vh-4rem)] md:min-h-[calc(100vh-5rem)] lg:min-h-[calc(100vh-8rem)]">
                <TrialBanner />
                {children}
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};