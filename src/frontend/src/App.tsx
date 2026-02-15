import { RouterProvider, createRouter, createRoute, createRootRoute, Outlet } from '@tanstack/react-router';
import { ThemeProvider } from 'next-themes';
import { Toaster } from '@/components/ui/sonner';
import AuthGate from './pages/AuthGate';
import OfflineFallback from './pages/OfflineFallback';
import RequireAuth from './components/auth/RequireAuth';
import RequireRole from './components/auth/RequireRole';
import RequireApproval from './components/auth/RequireApproval';
import AppShell from './components/layout/AppShell';

// Admin Pages
import AdminLayout from './pages/Admin/AdminLayout';
import KycDashboard from './pages/Admin/KycDashboard';
import CityCategoryManager from './pages/Admin/CityCategoryManager';
import RevenueTracker from './pages/Admin/RevenueTracker';
import UserManagement from './pages/Admin/UserManagement';
import UserApprovals from './pages/Admin/UserApprovals';
import RoleAssignment from './pages/Admin/RoleAssignment';
import Reports from './pages/Admin/Reports';

// Seller Pages
import SellerLayout from './pages/Seller/SellerLayout';
import BusinessProfileEditor from './pages/Seller/BusinessProfileEditor';
import KycPortal from './pages/Seller/KycPortal';
import LeadDashboard from './pages/Seller/LeadDashboard';
import QrCode from './pages/Seller/QrCode';
import Subscription from './pages/Seller/Subscription';
import Analytics from './pages/Seller/Analytics';
import ApprovalStatus from './pages/Seller/ApprovalStatus';

// Customer Pages
import CustomerLayout from './pages/Customer/CustomerLayout';
import Search from './pages/Customer/Search';
import BusinessDetail from './pages/Customer/BusinessDetail';
import UnlockConfirm from './pages/Customer/UnlockConfirm';
import UnlockHistory from './pages/Customer/UnlockHistory';
import RewardsWallet from './pages/Customer/RewardsWallet';
import QRScan from './pages/Customer/QRScan';
import ReportHelp from './pages/Customer/ReportHelp';

const rootRoute = createRootRoute({
  component: () => (
    <AppShell>
      <Outlet />
    </AppShell>
  ),
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: AuthGate,
});

const offlineRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/offline',
  component: OfflineFallback,
});

// Admin Routes
const adminRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin',
  component: () => (
    <RequireAuth>
      <RequireRole allowedRole="admin">
        <AdminLayout />
      </RequireRole>
    </RequireAuth>
  ),
});

const adminKycRoute = createRoute({
  getParentRoute: () => adminRoute,
  path: '/kyc',
  component: KycDashboard,
});

const adminCityRoute = createRoute({
  getParentRoute: () => adminRoute,
  path: '/cities',
  component: CityCategoryManager,
});

const adminRevenueRoute = createRoute({
  getParentRoute: () => adminRoute,
  path: '/revenue',
  component: RevenueTracker,
});

const adminUsersRoute = createRoute({
  getParentRoute: () => adminRoute,
  path: '/users',
  component: UserManagement,
});

const adminApprovalsRoute = createRoute({
  getParentRoute: () => adminRoute,
  path: '/approvals',
  component: UserApprovals,
});

const adminRolesRoute = createRoute({
  getParentRoute: () => adminRoute,
  path: '/roles',
  component: RoleAssignment,
});

const adminReportsRoute = createRoute({
  getParentRoute: () => adminRoute,
  path: '/reports',
  component: Reports,
});

// Seller Routes
const sellerRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/seller',
  component: () => (
    <RequireAuth>
      <RequireRole allowedRole="seller">
        <SellerLayout />
      </RequireRole>
    </RequireAuth>
  ),
});

const sellerProfileRoute = createRoute({
  getParentRoute: () => sellerRoute,
  path: '/profile',
  component: () => (
    <RequireApproval>
      <BusinessProfileEditor />
    </RequireApproval>
  ),
});

const sellerKycRoute = createRoute({
  getParentRoute: () => sellerRoute,
  path: '/kyc',
  component: KycPortal,
});

const sellerLeadsRoute = createRoute({
  getParentRoute: () => sellerRoute,
  path: '/leads',
  component: () => (
    <RequireApproval>
      <LeadDashboard />
    </RequireApproval>
  ),
});

const sellerQrRoute = createRoute({
  getParentRoute: () => sellerRoute,
  path: '/qr',
  component: () => (
    <RequireApproval>
      <QrCode />
    </RequireApproval>
  ),
});

const sellerSubscriptionRoute = createRoute({
  getParentRoute: () => sellerRoute,
  path: '/subscription',
  component: () => (
    <RequireApproval>
      <Subscription />
    </RequireApproval>
  ),
});

const sellerAnalyticsRoute = createRoute({
  getParentRoute: () => sellerRoute,
  path: '/analytics',
  component: () => (
    <RequireApproval>
      <Analytics />
    </RequireApproval>
  ),
});

const sellerApprovalRoute = createRoute({
  getParentRoute: () => sellerRoute,
  path: '/approval',
  component: ApprovalStatus,
});

// Customer Routes
const customerRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/customer',
  component: () => (
    <RequireAuth>
      <RequireRole allowedRole="customer">
        <CustomerLayout />
      </RequireRole>
    </RequireAuth>
  ),
});

const customerSearchRoute = createRoute({
  getParentRoute: () => customerRoute,
  path: '/search',
  component: Search,
});

const customerBusinessRoute = createRoute({
  getParentRoute: () => customerRoute,
  path: '/business/$businessId',
  component: BusinessDetail,
});

const customerUnlockConfirmRoute = createRoute({
  getParentRoute: () => customerRoute,
  path: '/unlock-confirm',
  component: UnlockConfirm,
});

const customerHistoryRoute = createRoute({
  getParentRoute: () => customerRoute,
  path: '/history',
  component: UnlockHistory,
});

const customerRewardsRoute = createRoute({
  getParentRoute: () => customerRoute,
  path: '/rewards',
  component: RewardsWallet,
});

const customerQrScanRoute = createRoute({
  getParentRoute: () => customerRoute,
  path: '/scan',
  component: QRScan,
});

const customerReportRoute = createRoute({
  getParentRoute: () => customerRoute,
  path: '/report/$businessId',
  component: ReportHelp,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  offlineRoute,
  adminRoute.addChildren([
    adminKycRoute,
    adminCityRoute,
    adminRevenueRoute,
    adminUsersRoute,
    adminApprovalsRoute,
    adminRolesRoute,
    adminReportsRoute,
  ]),
  sellerRoute.addChildren([
    sellerProfileRoute,
    sellerKycRoute,
    sellerLeadsRoute,
    sellerQrRoute,
    sellerSubscriptionRoute,
    sellerAnalyticsRoute,
    sellerApprovalRoute,
  ]),
  customerRoute.addChildren([
    customerSearchRoute,
    customerBusinessRoute,
    customerUnlockConfirmRoute,
    customerHistoryRoute,
    customerRewardsRoute,
    customerQrScanRoute,
    customerReportRoute,
  ]),
]);

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <RouterProvider router={router} />
      <Toaster />
    </ThemeProvider>
  );
}
