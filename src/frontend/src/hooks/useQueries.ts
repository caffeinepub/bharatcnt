import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { UserProfile, BusinessProfile, TokenPurchase, Reward, ApprovalStatus } from '../backend';
import { Principal } from '@dfinity/principal';

export function useGetCallerUserProfile() {
  const { actor, isFetching: actorFetching } = useActor();

  const query = useQuery<UserProfile | null>({
    queryKey: ['currentUserProfile'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });

  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && query.isFetched,
  };
}

export function useSaveCallerUserProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profile: UserProfile) => {
      if (!actor) throw new Error('Actor not available');
      return actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
    },
  });
}

export function useGetCallerUserRole() {
  const { actor, isFetching } = useActor();

  return useQuery({
    queryKey: ['currentUserRole'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getCallerUserRole();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useIsCallerAdmin() {
  const { actor, isFetching } = useActor();

  return useQuery({
    queryKey: ['isAdmin'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.isCallerAdmin();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useIsCallerApproved() {
  const { actor, isFetching } = useActor();

  return useQuery({
    queryKey: ['isApproved'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.isCallerApproved();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useRequestApproval() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.requestApproval();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['isApproved'] });
      queryClient.invalidateQueries({ queryKey: ['approvals'] });
    },
  });
}

export function useListApprovals() {
  const { actor, isFetching } = useActor();

  return useQuery({
    queryKey: ['approvals'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.listApprovals();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSetApproval() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ user, status }: { user: Principal; status: ApprovalStatus }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.setApproval(user, status);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['approvals'] });
    },
  });
}

export function useGetMyBusinessProfile() {
  const { actor, isFetching } = useActor();

  return useQuery<BusinessProfile | null>({
    queryKey: ['myBusinessProfile'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getMyBusinessProfile();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCreateBusinessProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profile: BusinessProfile) => {
      if (!actor) throw new Error('Actor not available');
      return actor.createBusinessProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myBusinessProfile'] });
    },
  });
}

export function useUpdateBusinessProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profile: BusinessProfile) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateBusinessProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myBusinessProfile'] });
    },
  });
}

export function useGetAllPendingKYC() {
  const { actor, isFetching } = useActor();

  return useQuery<BusinessProfile[]>({
    queryKey: ['pendingKYC'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getAllPendingKYC();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useApproveKYC() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (businessPrincipal: Principal) => {
      if (!actor) throw new Error('Actor not available');
      return actor.approveKYC(businessPrincipal);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pendingKYC'] });
    },
  });
}

export function useRejectKYC() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (businessPrincipal: Principal) => {
      if (!actor) throw new Error('Actor not available');
      return actor.rejectKYC(businessPrincipal);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pendingKYC'] });
    },
  });
}

export function useGetRevenueStats() {
  const { actor, isFetching } = useActor();

  return useQuery({
    queryKey: ['revenueStats'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getRevenueStats();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useBlockUser() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (userPrincipal: Principal) => {
      if (!actor) throw new Error('Actor not available');
      return actor.blockUser(userPrincipal);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['approvals'] });
    },
  });
}

export function useUnblockUser() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (userPrincipal: Principal) => {
      if (!actor) throw new Error('Actor not available');
      return actor.unblockUser(userPrincipal);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['approvals'] });
    },
  });
}

export function useGetMyLeads() {
  const { actor, isFetching } = useActor();

  return useQuery<TokenPurchase[]>({
    queryKey: ['myLeads'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getMyLeads();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useRenewSubscription() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ amount, duration }: { amount: bigint; duration: bigint }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.renewSubscription(amount, duration);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myBusinessProfile'] });
    },
  });
}

export function useSearchBusinesses() {
  const { actor, isFetching } = useActor();

  return useQuery({
    queryKey: ['businesses'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.searchBusinessObjectsByPrefix('');
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetBusinessDetails() {
  const { actor } = useActor();

  return useMutation({
    mutationFn: async (businessPrincipal: Principal) => {
      if (!actor) throw new Error('Actor not available');
      return actor.getBusinessDetails(businessPrincipal);
    },
  });
}

export function useUnlockBusiness() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      businessPrincipal,
      amount,
      expiryDuration,
    }: {
      businessPrincipal: Principal;
      amount: bigint;
      expiryDuration: bigint;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.unlockBusiness(businessPrincipal, amount, expiryDuration);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['unlockHistory'] });
    },
  });
}

export function useGetMyUnlockHistory() {
  const { actor, isFetching } = useActor();

  return useQuery<TokenPurchase[]>({
    queryKey: ['unlockHistory'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getMyUnlockHistory();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetMyRewards() {
  const { actor, isFetching } = useActor();

  return useQuery<Reward[]>({
    queryKey: ['myRewards'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getMyRewards();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetRewardById() {
  const { actor } = useActor();

  return useMutation({
    mutationFn: async (rewardId: string) => {
      if (!actor) throw new Error('Actor not available');
      return actor.getRewardById(rewardId);
    },
  });
}
