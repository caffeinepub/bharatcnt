import { ReactNode } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from '@tanstack/react-router';
import { useEffect } from 'react';
import { Loader2 } from 'lucide-react';

interface RequireAuthProps {
  children: ReactNode;
}

export default function RequireAuth({ children }: RequireAuthProps) {
  const { isAuthenticated, loginStatus } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (loginStatus !== 'initializing' && !isAuthenticated) {
      navigate({ to: '/' });
    }
  }, [isAuthenticated, loginStatus, navigate]);

  if (loginStatus === 'initializing') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}
