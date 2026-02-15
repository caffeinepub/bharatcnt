import { Outlet, useNavigate, useLocation } from '@tanstack/react-router';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import LoginButton from '@/components/auth/LoginButton';
import { Store, FileCheck, Users, QrCode as QrCodeIcon, CreditCard, BarChart3 } from 'lucide-react';

export default function SellerLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  const tabs = [
    { value: '/seller/profile', label: 'Profile', icon: Store },
    { value: '/seller/kyc', label: 'KYC', icon: FileCheck },
    { value: '/seller/leads', label: 'Leads', icon: Users },
    { value: '/seller/qr', label: 'QR Code', icon: QrCodeIcon },
    { value: '/seller/subscription', label: 'Subscription', icon: CreditCard },
    { value: '/seller/analytics', label: 'Analytics', icon: BarChart3 },
  ];

  const currentTab = tabs.find((tab) => location.pathname.startsWith(tab.value))?.value || '/seller/profile';

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold">Seller Dashboard</h1>
            <LoginButton />
          </div>
          <Tabs value={currentTab} className="w-full">
            <TabsList className="w-full justify-start overflow-x-auto">
              {tabs.map((tab) => (
                <TabsTrigger
                  key={tab.value}
                  value={tab.value}
                  onClick={() => navigate({ to: tab.value })}
                  className="flex items-center gap-2"
                >
                  <tab.icon className="h-4 w-4" />
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>
      </header>
      <div className="container mx-auto px-4 py-6">
        <Outlet />
      </div>
    </div>
  );
}
