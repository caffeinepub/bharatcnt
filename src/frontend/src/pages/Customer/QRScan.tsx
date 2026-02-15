import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { QrCode } from 'lucide-react';

export default function QRScan() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Scan QR Code</h2>
        <p className="text-muted-foreground">Scan business QR codes to earn rewards</p>
      </div>

      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <QrCode className="h-5 w-5" />
            QR Scanner
          </CardTitle>
          <CardDescription>Point your camera at a QR code</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            QR scanning functionality requires integration with the qr-code useQRScanner hook. This feature will be
            fully functional in the next iteration with camera preview and scan detection.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
