import { Outlet, useNavigate, useLocation } from '@tanstack/react-router';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import LoginButton from '@/components/auth/LoginButton';
import { Search as SearchIcon, History, Gift, QrCode as QrCodeIcon } from 'lucide-react';

export default function CustomerLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  const tabs = [
    { value: '/customer/search', label: 'Search', icon: SearchIcon },
    { value: '/customer/history', label: 'History', icon: History },
    { value: '/customer/rewards', label: 'Rewards', icon: Gift },
    { value: '/customer/scan', label: 'Scan QR', icon: QrCodeIcon },
  ];

  const currentTab = tabs.find((tab) => location.pathname.startsWith(tab.value))?.value || '/customer/search';

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold">BHARATcnt</h1>
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
