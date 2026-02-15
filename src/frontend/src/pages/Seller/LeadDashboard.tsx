import { useGetMyLeads } from '@/hooks/useQueries';
import { LoadingScreen, ErrorScreen, EmptyScreen } from '@/lib/StateScreens';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, Clock } from 'lucide-react';

export default function LeadDashboard() {
  const { data: leads, isLoading, error, refetch } = useGetMyLeads();

  if (isLoading) return <LoadingScreen message="Loading your leads..." />;
  if (error) return <ErrorScreen message="Failed to load leads" onRetry={() => refetch()} />;
  if (!leads || leads.length === 0)
    return <EmptyScreen message="No leads yet" icon={<Users className="h-12 w-12 text-muted-foreground" />} />;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Lead Dashboard</h2>
        <p className="text-muted-foreground">Customers who unlocked your business</p>
      </div>

      <div className="grid gap-4">
        {leads.map((lead, index) => {
          const isExpired = lead.expiry < BigInt(Date.now() * 1_000_000);
          return (
            <Card key={index}>
              <CardContent className="flex items-center justify-between p-4">
                <div>
                  <p className="font-mono text-sm">{lead.user.toString()}</p>
                  <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                    <Clock className="h-3 w-3" />
                    {new Date(Number(lead.timestamp) / 1_000_000).toLocaleString()}
                  </p>
                </div>
                <Badge variant={isExpired ? 'outline' : 'default'}>{isExpired ? 'Expired' : 'Active'}</Badge>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
