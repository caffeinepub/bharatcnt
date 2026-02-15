import { useState } from 'react';
import { useParams, useNavigate } from '@tanstack/react-router';
import { useGetBusinessDetails, useUnlockBusiness } from '@/hooks/useQueries';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import VerifiedBadge from '@/components/business/VerifiedBadge';
import { Lock, Unlock, MapPin, Phone, Flag } from 'lucide-react';
import { toast } from 'sonner';
import { Principal } from '@dfinity/principal';
import { getUnlockDurationNanoseconds, UNLOCK_CONFIG } from '@/config/unlock';

export default function BusinessDetail() {
  const { businessId } = useParams({ from: '/customer/business/$businessId' });
  const navigate = useNavigate();
  const getBusinessDetails = useGetBusinessDetails();
  const unlockBusiness = useUnlockBusiness();
  const [isUnlocked, setIsUnlocked] = useState(false);

  const handleUnlock = async () => {
    try {
      const principal = Principal.fromText(businessId);
      const amount = BigInt(UNLOCK_CONFIG.TOKEN_PRICE);
      const duration = getUnlockDurationNanoseconds();
      await unlockBusiness.mutateAsync({ businessPrincipal: principal, amount, expiryDuration: duration });
      const details = await getBusinessDetails.mutateAsync(principal);
      setIsUnlocked(true);
      toast.success('Business unlocked successfully!');
      navigate({ to: '/customer/unlock-confirm' });
    } catch (error) {
      toast.error('Failed to unlock business');
    }
  };

  return (
    <div className="space-y-6">
      <Button variant="outline" onClick={() => navigate({ to: '/customer/search' })}>
        ← Back to Search
      </Button>

      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-2xl mb-2">Business Name</CardTitle>
              <VerifiedBadge />
            </div>
            <Badge variant="outline">
              <Lock className="h-3 w-3 mr-1" />
              Locked
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-semibold mb-2">Description</h4>
            <p className="text-muted-foreground">Business description will appear here after unlock</p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-muted-foreground">
              <MapPin className="h-4 w-4" />
              <span className="blur-sm select-none">123 Hidden Street, City</span>
              <Lock className="h-3 w-3" />
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Phone className="h-4 w-4" />
              <span className="blur-sm select-none">+91 XXXXXXXXXX</span>
              <Lock className="h-3 w-3" />
            </div>
          </div>

          <div className="pt-4 space-y-2">
            <Button onClick={handleUnlock} disabled={unlockBusiness.isPending} className="w-full" size="lg">
              <Unlock className="mr-2 h-4 w-4" />
              {unlockBusiness.isPending ? 'Unlocking...' : `Unlock for ₹${UNLOCK_CONFIG.TOKEN_PRICE}`}
            </Button>
            <Button
              variant="outline"
              onClick={() => navigate({ to: `/customer/report/${businessId}` })}
              className="w-full"
            >
              <Flag className="mr-2 h-4 w-4" />
              Report Issue
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
