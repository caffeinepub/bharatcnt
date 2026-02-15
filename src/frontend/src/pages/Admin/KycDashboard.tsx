import { useGetAllPendingKYC, useApproveKYC, useRejectKYC } from '@/hooks/useQueries';
import { LoadingScreen, ErrorScreen, EmptyScreen } from '@/lib/StateScreens';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, FileText, Image as ImageIcon } from 'lucide-react';
import { toast } from 'sonner';
import { Principal } from '@dfinity/principal';

export default function KycDashboard() {
  const { data: pendingKYC, isLoading, error, refetch } = useGetAllPendingKYC();
  const approveKYC = useApproveKYC();
  const rejectKYC = useRejectKYC();

  const handleApprove = async (principal: Principal) => {
    try {
      await approveKYC.mutateAsync(principal);
      toast.success('KYC approved successfully');
    } catch (error) {
      toast.error('Failed to approve KYC');
    }
  };

  const handleReject = async (principal: Principal) => {
    try {
      await rejectKYC.mutateAsync(principal);
      toast.success('KYC rejected');
    } catch (error) {
      toast.error('Failed to reject KYC');
    }
  };

  if (isLoading) return <LoadingScreen message="Loading pending KYC submissions..." />;
  if (error) return <ErrorScreen message="Failed to load KYC submissions" onRetry={() => refetch()} />;
  if (!pendingKYC || pendingKYC.length === 0)
    return <EmptyScreen message="No pending KYC submissions" icon={<FileText className="h-12 w-12 text-muted-foreground" />} />;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">KYC Verification Dashboard</h2>
        <p className="text-muted-foreground">Review and approve seller KYC submissions</p>
      </div>

      <div className="grid gap-6">
        {pendingKYC.map((business) => (
          <Card key={business.principal.toString()}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle>{business.name}</CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">{business.principal.toString()}</p>
                </div>
                <Badge variant="outline">Pending</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Business Details</h4>
                <p className="text-sm text-muted-foreground">{business.description}</p>
                <p className="text-sm text-muted-foreground mt-1">
                  <strong>Address:</strong> {business.address}
                </p>
                <p className="text-sm text-muted-foreground">
                  <strong>Contact:</strong> {business.contactInfo}
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                {business.kycDocs && (
                  <div>
                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      Aadhaar Document
                    </h4>
                    <img
                      src={business.kycDocs.getDirectURL()}
                      alt="Aadhaar"
                      className="w-full h-48 object-cover rounded border"
                    />
                  </div>
                )}
                {business.kycPhoto && (
                  <div>
                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                      <ImageIcon className="h-4 w-4" />
                      Live Photo
                    </h4>
                    <img
                      src={business.kycPhoto.getDirectURL()}
                      alt="Live Photo"
                      className="w-full h-48 object-cover rounded border"
                    />
                  </div>
                )}
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={() => handleApprove(business.principal)}
                  disabled={approveKYC.isPending}
                  className="flex-1"
                >
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Approve
                </Button>
                <Button
                  onClick={() => handleReject(business.principal)}
                  disabled={rejectKYC.isPending}
                  variant="destructive"
                  className="flex-1"
                >
                  <XCircle className="mr-2 h-4 w-4" />
                  Reject
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
