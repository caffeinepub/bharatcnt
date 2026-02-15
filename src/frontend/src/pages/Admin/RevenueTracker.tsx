import { useGetRevenueStats } from '@/hooks/useQueries';
import { LoadingScreen, ErrorScreen } from '@/lib/StateScreens';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DollarSign, CreditCard } from 'lucide-react';

export default function RevenueTracker() {
  const { data: stats, isLoading, error, refetch } = useGetRevenueStats();

  if (isLoading) return <LoadingScreen message="Loading revenue statistics..." />;
  if (error) return <ErrorScreen message="Failed to load revenue stats" onRetry={() => refetch()} />;

  const tokenRevenue = Number(stats?.tokenRevenue || 0n);
  const subscriptionRevenue = Number(stats?.subscriptionRevenue || 0n);
  const totalRevenue = tokenRevenue + subscriptionRevenue;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Revenue Tracker</h2>
        <p className="text-muted-foreground">Monitor platform revenue from tokens and subscriptions</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Token Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{tokenRevenue}</div>
            <p className="text-xs text-muted-foreground">From business unlocks</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Subscription Revenue</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{subscriptionRevenue}</div>
            <p className="text-xs text-muted-foreground">From seller subscriptions</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{totalRevenue}</div>
            <p className="text-xs text-muted-foreground">Combined platform revenue</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
