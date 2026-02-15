import { Loader2, AlertCircle, CheckCircle2, Inbox } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function LoadingScreen({ message = 'Loading...' }: { message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
      <Loader2 className="h-12 w-12 animate-spin text-primary" />
      <p className="text-muted-foreground">{message}</p>
    </div>
  );
}

export function ErrorScreen({ message = 'Something went wrong', onRetry }: { message?: string; onRetry?: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
      <AlertCircle className="h-12 w-12 text-destructive" />
      <p className="text-muted-foreground">{message}</p>
      {onRetry && (
        <Button onClick={onRetry} variant="outline">
          Try Again
        </Button>
      )}
    </div>
  );
}

export function EmptyScreen({ message = 'No data available', icon }: { message?: string; icon?: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
      {icon || <Inbox className="h-12 w-12 text-muted-foreground" />}
      <p className="text-muted-foreground">{message}</p>
    </div>
  );
}

export function SuccessScreen({ message = 'Success!' }: { message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
      <CheckCircle2 className="h-12 w-12 text-emerald-600" />
      <p className="text-muted-foreground">{message}</p>
    </div>
  );
}
