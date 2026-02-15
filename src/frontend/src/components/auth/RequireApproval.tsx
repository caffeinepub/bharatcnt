import { ReactNode } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from '@tanstack/react-router';
import { useEffect } from 'react';
import { Loader2 } from 'lucide-react';

interface RequireApprovalProps {
  children: ReactNode;
}

export default function RequireApproval({ children }: RequireApprovalProps) {
  const { isApproved, approvalLoading, isAdmin } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!approvalLoading && !isApproved && !isAdmin) {
      navigate({ to: '/seller/approval' });
    }
  }, [isApproved, approvalLoading, isAdmin, navigate]);

  if (approvalLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isApproved && !isAdmin) {
    return null;
  }

  return <>{children}</>;
}
