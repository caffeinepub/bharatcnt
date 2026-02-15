import { Heart } from 'lucide-react';
import { DISCLAIMER_TEXT } from '@/constants/legal';

export default function AppFooter() {
  const currentYear = new Date().getFullYear();
  const appIdentifier = encodeURIComponent(window.location.hostname || 'bharatcnt');

  return (
    <footer className="border-t bg-card mt-auto">
      <div className="container mx-auto px-4 py-6 space-y-4">
        <div className="text-center text-sm text-muted-foreground">
          <p className="font-medium">{DISCLAIMER_TEXT}</p>
        </div>
        <div className="text-center text-sm text-muted-foreground">
          <p>
            © {currentYear} BHARATcnt. Built with{' '}
            <Heart className="inline h-4 w-4 text-red-500 fill-red-500" /> using{' '}
            <a
              href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${appIdentifier}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
