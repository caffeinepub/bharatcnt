import { useGetMyBusinessProfile, useRenewSubscription } from '@/hooks/useQueries';
import { LoadingScreen, ErrorScreen } from '@/lib/StateScreens';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CreditCard, CheckCircle, XCircle } from 'lucide-react';
import { toast } from 'sonner';

export default function Subscription() {
  const { data: profile, isLoading, error, refetch } = useGetMyBusinessProfile();
  const renewSubscription = useRenewSubscription();

  const handleRenew = async () => {
    try {
      const amount = BigInt(99);
      const duration = BigInt(30 * 24 * 60 * 60 * 1_000_000_000);
      await renewSubscription.mutateAsync({ amount, duration });
      toast.success('Subscription renewed successfully!');
    } catch (error) {
      toast.error('Failed to renew subscription');
    }
  };

  if (isLoading) return <LoadingScreen message="Loading subscription status..." />;
  if (error) return <ErrorScreen message="Failed to load subscription" onRetry={() => refetch()} />;

  const isActive = profile?.subscriptionExpiry && profile.subscriptionExpiry > BigInt(Date.now() * 1_000_000);
  const expiryDate = profile?.subscriptionExpiry
    ? new Date(Number(profile.subscriptionExpiry) / 1_000_000).toLocaleDateString()
    : 'N/A';

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Subscription</h2>
        <p className="text-muted-foreground">Manage your seller subscription</p>
      </div>

      <Card className="max-w-md mx-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Subscription Status
            </CardTitle>
            <Badge variant={isActive ? 'default' : 'destructive'}>
              {isActive ? (
                <>
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Active
                </>
              ) : (
                <>
                  <XCircle className="h-3 w-3 mr-1" />
                  Expired
                </>
              )}
            </Badge>
          </div>
          <CardDescription>₹99 per month</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-sm text-muted-foreground">Expiry Date</p>
            <p className="text-lg font-semibold">{expiryDate}</p>
          </div>
          <Button onClick={handleRenew} disabled={renewSubscription.isPending} className="w-full">
            {renewSubscription.isPending ? 'Processing...' : 'Renew Subscription (₹99)'}
          </Button>
          <p className="text-xs text-muted-foreground text-center">
            Note: This is a placeholder payment flow. Real UPI integration will be added later.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
