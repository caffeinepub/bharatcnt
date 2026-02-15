import { useAuth } from '@/hooks/useAuth';
import { useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { LogIn, LogOut, Loader2 } from 'lucide-react';

export default function LoginButton() {
  const { login, logout, loginStatus, isAuthenticated } = useAuth();
  const queryClient = useQueryClient();

  const handleAuth = async () => {
    if (isAuthenticated) {
      await logout();
      queryClient.clear();
    } else {
      try {
        await login();
      } catch (error: any) {
        console.error('Login error:', error);
        if (error.message === 'User is already authenticated') {
          await logout();
          setTimeout(() => login(), 300);
        }
      }
    }
  };

  const disabled = loginStatus === 'logging-in';
  const text = loginStatus === 'logging-in' ? 'Logging in...' : isAuthenticated ? 'Logout' : 'Login';

  return (
    <Button onClick={handleAuth} disabled={disabled} variant={isAuthenticated ? 'outline' : 'default'}>
      {loginStatus === 'logging-in' ? (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      ) : isAuthenticated ? (
        <LogOut className="mr-2 h-4 w-4" />
      ) : (
        <LogIn className="mr-2 h-4 w-4" />
      )}
      {text}
    </Button>
  );
}
