import { useAuth } from '@/hooks/useAuth';
import { useRequestApproval } from '@/hooks/useQueries';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, CheckCircle, XCircle } from 'lucide-react';
import { toast } from 'sonner';

export default function ApprovalStatus() {
  const { isApproved, approvalLoading } = useAuth();
  const requestApproval = useRequestApproval();

  const handleRequestApproval = async () => {
    try {
      await requestApproval.mutateAsync();
      toast.success('Approval requested successfully');
    } catch (error) {
      toast.error('Failed to request approval');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Approval Status</h2>
        <p className="text-muted-foreground">Your seller account approval status</p>
      </div>

      <Card className="max-w-md mx-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              {isApproved ? (
                <CheckCircle className="h-5 w-5 text-emerald-600" />
              ) : (
                <Clock className="h-5 w-5 text-orange-600" />
              )}
              Approval Status
            </CardTitle>
            <Badge variant={isApproved ? 'default' : 'outline'}>{isApproved ? 'Approved' : 'Pending'}</Badge>
          </div>
          <CardDescription>
            {isApproved
              ? 'Your account is approved. You can access all seller features.'
              : 'Your account is pending approval. An admin will review your request soon.'}
          </CardDescription>
        </CardHeader>
        {!isApproved && (
          <CardContent>
            <Button onClick={handleRequestApproval} disabled={requestApproval.isPending} className="w-full">
              {requestApproval.isPending ? 'Requesting...' : 'Request Approval'}
            </Button>
          </CardContent>
        )}
      </Card>
    </div>
  );
}
