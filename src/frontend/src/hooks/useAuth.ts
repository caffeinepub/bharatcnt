import { useInternetIdentity } from './useInternetIdentity';
import { useGetCallerUserProfile, useGetCallerUserRole, useIsCallerAdmin, useIsCallerApproved } from './useQueries';

export function useAuth() {
  const { identity, login, clear, loginStatus, isLoggingIn } = useInternetIdentity();
  const { data: profile, isLoading: profileLoading, isFetched: profileFetched } = useGetCallerUserProfile();
  const { data: role, isLoading: roleLoading } = useGetCallerUserRole();
  const { data: isAdmin, isLoading: adminLoading } = useIsCallerAdmin();
  const { data: isApproved, isLoading: approvalLoading } = useIsCallerApproved();

  const isAuthenticated = !!identity;

  return {
    identity,
    login,
    logout: clear,
    loginStatus,
    isLoggingIn,
    isAuthenticated,
    profile,
    profileLoading,
    profileFetched,
    role,
    roleLoading,
    isAdmin: isAdmin ?? false,
    adminLoading,
    isApproved: isApproved ?? false,
    approvalLoading,
  };
}
