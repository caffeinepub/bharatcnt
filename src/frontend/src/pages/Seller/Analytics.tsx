import { useState } from 'react';
import { useGetMyLeads } from '@/hooks/useQueries';
import { LoadingScreen, ErrorScreen } from '@/lib/StateScreens';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BarChart3, Eye, Unlock } from 'lucide-react';

export default function Analytics() {
  const { data: leads, isLoading, error, refetch } = useGetMyLeads();
  const [timeRange, setTimeRange] = useState('7');

  if (isLoading) return <LoadingScreen message="Loading analytics..." />;
  if (error) return <ErrorScreen message="Failed to load analytics" onRetry={() => refetch()} />;

  const filterLeadsByRange = () => {
    if (!leads) return [];
    const now = Date.now();
    const rangeMs = parseInt(timeRange) * 24 * 60 * 60 * 1000;
    return leads.filter((lead) => {
      const leadTime = Number(lead.timestamp) / 1_000_000;
      return now - leadTime <= rangeMs;
    });
  };

  const filteredLeads = timeRange === 'all' ? leads || [] : filterLeadsByRange();
  const totalUnlocks = filteredLeads.length;
  const totalRevenue = totalUnlocks * 10;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold mb-2">Analytics</h2>
          <p className="text-muted-foreground">Track your business performance</p>
        </div>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7">Last 7 days</SelectItem>
            <SelectItem value="30">Last 30 days</SelectItem>
            <SelectItem value="all">All time</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Views</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">-</div>
            <p className="text-xs text-muted-foreground">View tracking coming soon</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Unlocks</CardTitle>
            <Unlock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalUnlocks}</div>
            <p className="text-xs text-muted-foreground">Customers unlocked your business</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenue from Unlocks</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{totalRevenue}</div>
            <p className="text-xs text-muted-foreground">From token purchases</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
