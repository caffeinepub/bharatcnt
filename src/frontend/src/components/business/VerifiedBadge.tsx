import { BadgeCheck } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export default function VerifiedBadge() {
  return (
    <Badge variant="default" className="bg-emerald-600 hover:bg-emerald-700">
      <BadgeCheck className="h-3 w-3 mr-1" />
      Verified
    </Badge>
  );
}
