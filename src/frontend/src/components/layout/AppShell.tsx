import { ReactNode } from 'react';
import AppFooter from './AppFooter';

interface AppShellProps {
  children: ReactNode;
}

export default function AppShell({ children }: AppShellProps) {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <main className="flex-1">{children}</main>
      <AppFooter />
    </div>
  );
}
