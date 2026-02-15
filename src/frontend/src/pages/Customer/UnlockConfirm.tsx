import { useNavigate } from '@tanstack/react-router';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle } from 'lucide-react';
import { DISCLAIMER_TEXT } from '@/constants/legal';

export default function UnlockConfirm() {
  const navigate = useNavigate();

  return (
    <div className="space-y-6 max-w-md mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-emerald-600">
            <CheckCircle className="h-6 w-6" />
            Unlock Successful!
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            You have successfully unlocked this business. You can now view the full contact details.
          </p>
          <div className="p-4 bg-muted rounded-lg">
            <p className="text-sm font-medium">{DISCLAIMER_TEXT}</p>
          </div>
          <Button onClick={() => navigate({ to: '/customer/search' })} className="w-full">
            Back to Search
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
