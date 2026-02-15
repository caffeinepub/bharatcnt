import { useGetMyRewards } from '@/hooks/useQueries';
import { LoadingScreen, ErrorScreen, EmptyScreen } from '@/lib/StateScreens';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Gift, QrCode, Keyboard } from 'lucide-react';
import { useNavigate } from '@tanstack/react-router';

export default function RewardsWallet() {
  const navigate = useNavigate();
  const { data: rewards, isLoading, error, refetch } = useGetMyRewards();

  if (isLoading) return <LoadingScreen message="Loading rewards..." />;
  if (error) return <ErrorScreen message="Failed to load rewards" onRetry={() => refetch()} />;

  const totalPoints = rewards?.reduce((sum, reward) => sum + Number(reward.points), 0) || 0;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Rewards Wallet</h2>
        <p className="text-muted-foreground">Earn points by scanning QR codes</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Gift className="h-5 w-5" />
            Total Points
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-4xl font-bold text-primary">{totalPoints}</div>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 gap-4">
        <Button onClick={() => navigate({ to: '/customer/scan' })} size="lg" className="h-20">
          <QrCode className="mr-2 h-6 w-6" />
          Scan QR Code
        </Button>
        <Button variant="outline" size="lg" className="h-20">
          <Keyboard className="mr-2 h-6 w-6" />
          Enter Code Manually
        </Button>
      </div>

      {rewards && rewards.length > 0 ? (
        <div className="space-y-4">
          <h3 className="font-semibold">Reward History</h3>
          {rewards.map((reward) => (
            <Card key={reward.id}>
              <CardContent className="flex items-center justify-between p-4">
                <div>
                  <p className="font-semibold">{reward.businessName}</p>
                  <p className="text-sm text-muted-foreground">{reward.businessLocation}</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(Number(reward.createdAt) / 1_000_000).toLocaleDateString()}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-primary">+{Number(reward.points)}</p>
                  <Badge variant={reward.status === 'active' ? 'default' : 'outline'}>{reward.status}</Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <EmptyScreen message="No rewards yet. Start scanning QR codes!" icon={<Gift className="h-12 w-12 text-muted-foreground" />} />
      )}
    </div>
  );
}
