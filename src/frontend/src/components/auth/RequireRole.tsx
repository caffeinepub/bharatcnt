import { ReactNode } from 'react';
import { useAuth } from '@/hooks/useAuth';
import AccessDeniedScreen from './AccessDeniedScreen';
import { Loader2 } from 'lucide-react';
import type { UserRole__1 } from '@/backend';

interface RequireRoleProps {
  children: ReactNode;
  allowedRole: 'admin' | 'seller' | 'customer';
}

function hasRole(role: UserRole__1 | undefined, requiredRole: string): boolean {
  if (!role) return false;
  // UserRole__1 is an enum, check if the required role exists as a key
  const roleObj = role as unknown as Record<string, null>;
  return requiredRole in roleObj;
}

export default function RequireRole({ children, allowedRole }: RequireRoleProps) {
  const { role, roleLoading, isAdmin } = useAuth();

  if (roleLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (allowedRole === 'admin' && !isAdmin) {
    return <AccessDeniedScreen />;
  }

  if (allowedRole === 'seller' && !hasRole(role, 'seller')) {
    return <AccessDeniedScreen />;
  }

  if (allowedRole === 'customer' && !hasRole(role, 'customer')) {
    return <AccessDeniedScreen />;
  }

  return <>{children}</>;
}
