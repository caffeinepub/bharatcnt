import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Lock } from 'lucide-react';
import VerifiedBadge from './VerifiedBadge';
import type { BusinessData } from '@/backend';

interface BusinessCardProps {
  business: BusinessData;
  onClick?: () => void;
  isVerified?: boolean;
}

export default function BusinessCard({ business, onClick, isVerified }: BusinessCardProps) {
  return (
    <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={onClick}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-semibold text-lg">{business.name}</h3>
          {isVerified && <VerifiedBadge />}
        </div>
        <div className="flex items-center text-sm text-muted-foreground mb-2">
          <MapPin className="h-4 w-4 mr-1" />
          {business.address}
        </div>
        <Badge variant="outline" className="text-xs">
          <Lock className="h-3 w-3 mr-1" />
          Unlock for ₹10
        </Badge>
      </CardContent>
    </Card>
  );
}
