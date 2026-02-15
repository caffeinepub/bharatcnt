import { useListApprovals, useSetApproval } from '@/hooks/useQueries';
import { LoadingScreen, ErrorScreen, EmptyScreen } from '@/lib/StateScreens';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, UserCheck } from 'lucide-react';
import { toast } from 'sonner';
import type { ApprovalStatus } from '@/backend';

export default function UserApprovals() {
  const { data: approvals, isLoading, error, refetch } = useListApprovals();
  const setApproval = useSetApproval();

  const handleSetApproval = async (principal: any, status: ApprovalStatus) => {
    try {
      await setApproval.mutateAsync({ user: principal, status });
      toast.success(`User ${status}`);
    } catch (error) {
      toast.error('Failed to update approval status');
    }
  };

  if (isLoading) return <LoadingScreen message="Loading approvals..." />;
  if (error) return <ErrorScreen message="Failed to load approvals" onRetry={() => refetch()} />;
  if (!approvals || approvals.length === 0)
    return <EmptyScreen message="No approval requests" icon={<UserCheck className="h-12 w-12 text-muted-foreground" />} />;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">User Approvals</h2>
        <p className="text-muted-foreground">Manage seller approval requests</p>
      </div>

      <div className="grid gap-4">
        {approvals.map((approval) => (
          <Card key={approval.principal.toString()}>
            <CardContent className="flex items-center justify-between p-4">
              <div className="flex-1">
                <p className="font-mono text-sm">{approval.principal.toString()}</p>
                <Badge variant={approval.status === 'approved' ? 'default' : approval.status === 'rejected' ? 'destructive' : 'outline'} className="mt-1">
                  {approval.status}
                </Badge>
              </div>
              {approval.status === 'pending' && (
                <div className="flex gap-2">
                  <Button
                    onClick={() => handleSetApproval(approval.principal, 'approved' as ApprovalStatus)}
                    disabled={setApproval.isPending}
                    size="sm"
                  >
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Approve
                  </Button>
                  <Button
                    onClick={() => handleSetApproval(approval.principal, 'rejected' as ApprovalStatus)}
                    disabled={setApproval.isPending}
                    variant="destructive"
                    size="sm"
                  >
                    <XCircle className="mr-2 h-4 w-4" />
                    Reject
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
