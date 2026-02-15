import { useState } from 'react';
import { useListApprovals, useBlockUser, useUnblockUser } from '@/hooks/useQueries';
import { LoadingScreen, ErrorScreen, EmptyScreen } from '@/lib/StateScreens';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Ban, CheckCircle, Users } from 'lucide-react';
import { toast } from 'sonner';
import { Principal } from '@dfinity/principal';

export default function UserManagement() {
  const { data: approvals, isLoading, error, refetch } = useListApprovals();
  const blockUser = useBlockUser();
  const unblockUser = useUnblockUser();
  const [principalInput, setPrincipalInput] = useState('');

  const handleBlock = async (principal: Principal) => {
    try {
      await blockUser.mutateAsync(principal);
      toast.success('User blocked successfully');
    } catch (error) {
      toast.error('Failed to block user');
    }
  };

  const handleUnblock = async (principal: Principal) => {
    try {
      await unblockUser.mutateAsync(principal);
      toast.success('User unblocked successfully');
    } catch (error) {
      toast.error('Failed to unblock user');
    }
  };

  const handleBlockByPrincipal = async () => {
    if (!principalInput.trim()) {
      toast.error('Please enter a principal ID');
      return;
    }
    try {
      const principal = Principal.fromText(principalInput.trim());
      await handleBlock(principal);
      setPrincipalInput('');
    } catch (error) {
      toast.error('Invalid principal ID');
    }
  };

  if (isLoading) return <LoadingScreen message="Loading users..." />;
  if (error) return <ErrorScreen message="Failed to load users" onRetry={() => refetch()} />;
  if (!approvals || approvals.length === 0)
    return <EmptyScreen message="No users found" icon={<Users className="h-12 w-12 text-muted-foreground" />} />;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">User Management</h2>
        <p className="text-muted-foreground">Block or unblock users and sellers</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Block User by Principal</CardTitle>
        </CardHeader>
        <CardContent className="flex gap-2">
          <Input
            placeholder="Enter principal ID"
            value={principalInput}
            onChange={(e) => setPrincipalInput(e.target.value)}
          />
          <Button onClick={handleBlockByPrincipal} disabled={blockUser.isPending}>
            Block
          </Button>
        </CardContent>
      </Card>

      <div className="grid gap-4">
        {approvals.map((approval) => (
          <Card key={approval.principal.toString()}>
            <CardContent className="flex items-center justify-between p-4">
              <div>
                <p className="font-mono text-sm">{approval.principal.toString()}</p>
                <p className="text-xs text-muted-foreground">Status: {approval.status}</p>
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={() => handleBlock(approval.principal)}
                  disabled={blockUser.isPending}
                  variant="destructive"
                  size="sm"
                >
                  <Ban className="mr-2 h-4 w-4" />
                  Block
                </Button>
                <Button
                  onClick={() => handleUnblock(approval.principal)}
                  disabled={unblockUser.isPending}
                  variant="outline"
                  size="sm"
                >
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Unblock
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
