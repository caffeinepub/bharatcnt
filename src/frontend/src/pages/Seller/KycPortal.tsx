import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useGetMyBusinessProfile } from '@/hooks/useQueries';
import { LoadingScreen } from '@/lib/StateScreens';
import { Badge } from '@/components/ui/badge';
import { FileCheck, CheckCircle, XCircle, Clock } from 'lucide-react';

export default function KycPortal() {
  const { data: profile, isLoading } = useGetMyBusinessProfile();

  if (isLoading) return <LoadingScreen message="Loading KYC status..." />;

  const getStatusIcon = () => {
    if (!profile) return <Clock className="h-5 w-5" />;
    switch (profile.kycStatus) {
      case 'approved':
        return <CheckCircle className="h-5 w-5 text-emerald-600" />;
      case 'rejected':
        return <XCircle className="h-5 w-5 text-destructive" />;
      default:
        return <Clock className="h-5 w-5 text-orange-600" />;
    }
  };

  const getStatusBadge = () => {
    if (!profile) return <Badge variant="outline">Not Submitted</Badge>;
    switch (profile.kycStatus) {
      case 'approved':
        return <Badge className="bg-emerald-600">Approved</Badge>;
      case 'rejected':
        return <Badge variant="destructive">Rejected</Badge>;
      default:
        return <Badge variant="outline">Pending Review</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">KYC Verification</h2>
        <p className="text-muted-foreground">Submit your documents for verification</p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              {getStatusIcon()}
              KYC Status
            </CardTitle>
            {getStatusBadge()}
          </div>
          <CardDescription>
            {profile?.kycStatus === 'approved'
              ? 'Your KYC has been approved. You can now access all seller features.'
              : profile?.kycStatus === 'rejected'
                ? 'Your KYC was rejected. Please contact support for more information.'
                : 'Your KYC is pending review. An admin will review your submission soon.'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            KYC document upload functionality (Aadhaar + live photo capture) requires integration with the camera
            component and blob storage. This feature will be fully functional in the next iteration.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
