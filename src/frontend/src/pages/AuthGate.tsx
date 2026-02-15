import { useEffect, useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useAuth } from '@/hooks/useAuth';
import LoginButton from '@/components/auth/LoginButton';
import ProfileSetupModal from '@/components/auth/ProfileSetupModal';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Store, ShoppingBag, Shield, Download } from 'lucide-react';
import { LoadingScreen } from '@/lib/StateScreens';
import type { UserRole__1 } from '@/backend';

function hasRole(role: UserRole__1 | undefined, requiredRole: string): boolean {
  if (!role) return false;
  const roleObj = role as unknown as Record<string, null>;
  return requiredRole in roleObj;
}

export default function AuthGate() {
  const navigate = useNavigate();
  const { isAuthenticated, profile, profileLoading, profileFetched, role, roleLoading, isAdmin } = useAuth();
  const [showProfileSetup, setShowProfileSetup] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  useEffect(() => {
    const handler = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  useEffect(() => {
    if (isAuthenticated && profileFetched && profile === null) {
      setShowProfileSetup(true);
    }
  }, [isAuthenticated, profileFetched, profile]);

  useEffect(() => {
    if (isAuthenticated && profile && !roleLoading && role) {
      if (isAdmin) {
        navigate({ to: '/admin/kyc' });
      } else if (hasRole(role, 'seller')) {
        navigate({ to: '/seller/profile' });
      } else if (hasRole(role, 'customer')) {
        navigate({ to: '/customer/search' });
      }
    }
  }, [isAuthenticated, profile, role, roleLoading, isAdmin, navigate]);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    await deferredPrompt.userChoice;
    setDeferredPrompt(null);
  };

  if (profileLoading || roleLoading) {
    return <LoadingScreen message="Loading your profile..." />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-green-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-orange-600 to-green-600 bg-clip-text text-transparent">
            BHARATcnt
          </h1>
          <p className="text-xl text-muted-foreground">Connect Local Businesses with Customers Across India</p>
        </div>

        <div className="max-w-4xl mx-auto space-y-8">
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <Shield className="h-12 w-12 text-orange-600 mb-2" />
                <CardTitle>Admin Panel</CardTitle>
                <CardDescription>Manage verifications, revenue, and users</CardDescription>
              </CardHeader>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <Store className="h-12 w-12 text-green-600 mb-2" />
                <CardTitle>For Sellers</CardTitle>
                <CardDescription>List your business and connect with customers</CardDescription>
              </CardHeader>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <ShoppingBag className="h-12 w-12 text-blue-600 mb-2" />
                <CardTitle>For Customers</CardTitle>
                <CardDescription>Discover verified local businesses</CardDescription>
              </CardHeader>
            </Card>
          </div>

          <Card className="max-w-md mx-auto">
            <CardHeader>
              <CardTitle>Get Started</CardTitle>
              <CardDescription>Sign in to access the platform</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <LoginButton />
              {deferredPrompt && (
                <Button onClick={handleInstall} variant="outline" className="w-full">
                  <Download className="mr-2 h-4 w-4" />
                  Install App
                </Button>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <ProfileSetupModal open={showProfileSetup} onComplete={() => setShowProfileSetup(false)} />
    </div>
  );
}
