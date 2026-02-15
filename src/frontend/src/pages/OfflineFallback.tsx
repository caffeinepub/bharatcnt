import { WifiOff } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function OfflineFallback() {
  const handleRetry = () => {
    window.location.reload();
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <div className="text-center space-y-4 max-w-md">
        <WifiOff className="h-16 w-16 text-muted-foreground mx-auto" />
        <h1 className="text-2xl font-bold">You're Offline</h1>
        <p className="text-muted-foreground">
          Please check your internet connection and try again. Some features may not be available offline.
        </p>
        <Button onClick={handleRetry}>Retry</Button>
      </div>
    </div>
  );
}
