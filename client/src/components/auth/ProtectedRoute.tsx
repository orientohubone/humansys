
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  requiredRole?: string;
}

export const ProtectedRoute = ({ 
  children, 
  requireAuth = true,
  requiredRole
}: ProtectedRouteProps) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    console.log('🔄 ProtectedRoute - Loading state, showing spinner');
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Carregando...</p>
        </div>
      </div>
    );
  }

  if (requireAuth && !user) {
    console.log('🔄 ProtectedRoute - No user, redirecting to login');
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Role validation for founder access
  if (requiredRole) {
    console.log('🔍 ProtectedRoute - Validando role:', {
      requiredRole,
      userRole: user?.role,
      userEmail: user?.email,
      hasAccess: user?.role === requiredRole || (requiredRole === 'founder' && user?.email === 'fernandoluizsouzaramalho@gmail.com')
    });

    const hasFounderAccess = user?.role === 'founder' || user?.email === 'fernandoluizsouzaramalho@gmail.com';
    
    if (requiredRole === 'founder' && !hasFounderAccess) {
      console.log('❌ ProtectedRoute - Acesso negado para founder');
      return <Navigate to="/app" replace />;
    }
  }

  console.log('✅ ProtectedRoute - Access granted, rendering children');
  return <>{children}</>;
};
