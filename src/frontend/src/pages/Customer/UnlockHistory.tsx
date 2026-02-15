import { useGetMyUnlockHistory } from '@/hooks/useQueries';
import { LoadingScreen, ErrorScreen, EmptyScreen } from '@/lib/StateScreens';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { History, Clock } from 'lucide-react';

export default function UnlockHistory() {
  const { data: history, isLoading, error, refetch } = useGetMyUnlockHistory();

  if (isLoading) return <LoadingScreen message="Loading unlock history..." />;
  if (error) return <ErrorScreen message="Failed to load history" onRetry={() => refetch()} />;
  if (!history || history.length === 0)
    return <EmptyScreen message="No unlock history" icon={<History className="h-12 w-12 text-muted-foreground" />} />;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Unlock History</h2>
        <p className="text-muted-foreground">Your business unlock history</p>
      </div>

      <div className="grid gap-4">
        {history.map((unlock, index) => {
          const isExpired = unlock.expiry < BigInt(Date.now() * 1_000_000);
          return (
            <Card key={index}>
              <CardContent className="flex items-center justify-between p-4">
                <div>
                  <p className="font-semibold">Business</p>
                  <p className="text-sm font-mono text-muted-foreground">{unlock.business.toString()}</p>
                  <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                    <Clock className="h-3 w-3" />
                    {new Date(Number(unlock.timestamp) / 1_000_000).toLocaleString()}
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
