
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

import { Loader2 } from 'lucide-react';
import { Landing } from '@/pages/Landing';

const Index = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [showLanding, setShowLanding] = useState(false);
  const [redirecting, setRedirecting] = useState(false);

  useEffect(() => {
    const handleRedirection = async () => {
      console.log('🏠 Index - Handling redirection, loading:', loading, 'redirecting:', redirecting, 'user:', !!user);
      
      // Wait for auth to load
      if (loading || redirecting) return;

      // If not authenticated, show landing page
      if (!user) {
        console.log('🏠 Index - No user found, showing landing page');
        setShowLanding(true);
        return;
      }

      setRedirecting(true);

      try {
        console.log('🏠 Index - Redirecting authenticated user to dashboard');
        // Always redirect to main dashboard
        navigate('/app/dashboard', { replace: true });
      } catch (error) {
        console.error('🏠 Index - Error during redirect:', error);
        console.log('Redirecting to default dashboard due to error');
        navigate('/app/dashboard', { replace: true });
      } finally {
        setRedirecting(false);
      }
    };

    handleRedirection();
  }, [user, loading, navigate, redirecting]);

  // Show landing page for non-authenticated users
  if (showLanding) {
    return <Landing />;
  }

  // Show loading for authenticated users while redirecting
  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
        <p className="text-muted-foreground">Redirecionando...</p>
      </div>
    </div>
  );
};

export default Index;
