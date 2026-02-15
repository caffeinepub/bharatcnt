import { useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';

export default function QrCode() {
  const { identity } = useAuth();
  const qrRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!identity || !qrRef.current) return;

    const businessUrl = `${window.location.origin}/customer/business/${identity.getPrincipal().toString()}`;

    // Simple QR code generation using canvas
    const generateQRCode = async () => {
      try {
        // Use a CDN-based QR code generator
        const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(businessUrl)}`;
        
        const img = document.createElement('img');
        img.src = qrCodeUrl;
        img.alt = 'Business QR Code';
        img.className = 'w-full h-auto rounded-lg border';
        
        if (qrRef.current) {
          qrRef.current.innerHTML = '';
          qrRef.current.appendChild(img);
        }
      } catch (error) {
        console.error('Failed to generate QR code:', error);
      }
    };

    generateQRCode();
  }, [identity]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">QR Code</h2>
        <p className="text-muted-foreground">Share this QR code with customers</p>
      </div>

      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Your Business QR Code</CardTitle>
          <CardDescription>Customers can scan this to view your business</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center">
          <div ref={qrRef} className="w-[300px] h-[300px] flex items-center justify-center bg-muted rounded-lg">
            <p className="text-sm text-muted-foreground">Loading QR code...</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
