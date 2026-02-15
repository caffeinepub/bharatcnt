import { Outlet, useNavigate, useLocation } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import LoginButton from '@/components/auth/LoginButton';
import { FileCheck, MapPin, DollarSign, Users, UserCheck, Shield, Flag } from 'lucide-react';

export default function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  const tabs = [
    { value: '/admin/kyc', label: 'KYC', icon: FileCheck },
    { value: '/admin/cities', label: 'Cities', icon: MapPin },
    { value: '/admin/revenue', label: 'Revenue', icon: DollarSign },
    { value: '/admin/users', label: 'Users', icon: Users },
    { value: '/admin/approvals', label: 'Approvals', icon: UserCheck },
    { value: '/admin/roles', label: 'Roles', icon: Shield },
    { value: '/admin/reports', label: 'Reports', icon: Flag },
  ];

  const currentTab = tabs.find((tab) => location.pathname.startsWith(tab.value))?.value || '/admin/kyc';

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold">Admin Panel</h1>
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
