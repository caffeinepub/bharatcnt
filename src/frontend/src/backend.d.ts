import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export class ExternalBlob {
    getBytes(): Promise<Uint8Array<ArrayBuffer>>;
    getDirectURL(): string;
    static fromURL(url: string): ExternalBlob;
    static fromBytes(blob: Uint8Array<ArrayBuffer>): ExternalBlob;
    withUploadProgress(onProgress: (percentage: number) => void): ExternalBlob;
}
export type Time = bigint;
export interface SuggestedMatch {
    id: string;
    name: string;
    address: string;
    isPartial: boolean;
}
export interface Reward {
    id: string;
    status: RewardStatus;
    principal: Principal;
    expiresAt: Time;
    rewardEntered: boolean;
    createdAt: Time;
    wasManuallyAdded: boolean;
    lastUpdated: Time;
    businessName: string;
    businessLocation: string;
    lastActivityTime: Time;
    redemptionActivityCount: bigint;
    testRewardActivityCount: bigint;
    isTestReward: boolean;
    points: bigint;
}
export interface UserApprovalInfo {
    status: ApprovalStatus;
    principal: Principal;
}
export interface TokenPurchase {
    user: Principal;
    business: Principal;
    timestamp: Time;
    expiry: Time;
    amount: bigint;
}
export interface BusinessProfile {
    principal: Principal;
    contactInfo: string;
    subscriptionExpiry?: Time;
    isBlocked: boolean;
    name: string;
    createdAt: Time;
    description: string;
    kycPhoto?: ExternalBlob;
    updatedAt: Time;
    kycStatus: ApprovalStatus;
    address: string;
    verifyImage?: ExternalBlob;
    kycDocs?: ExternalBlob;
}
export interface BusinessData {
    id: string;
    name: string;
    address: string;
}
export interface UserProfile {
    isBlocked: boolean;
    name: string;
    role: UserRole;
}
export enum ApprovalStatus {
    pending = "pending",
    approved = "approved",
    rejected = "rejected"
}
export enum RewardStatus {
    active = "active",
    expired = "expired",
    redeemed = "redeemed"
}
export enum UserRole {
    admin = "admin",
    customer = "customer",
    seller = "seller"
}
export enum UserRole__1 {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    approveKYC(businessPrincipal: Principal): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole__1): Promise<void>;
    blockUser(userPrincipal: Principal): Promise<void>;
    createBusinessProfile(profile: BusinessProfile): Promise<void>;
    getAllPendingKYC(): Promise<Array<BusinessProfile>>;
    getAvailableRewardPool(): Promise<Array<Reward>>;
    getBusinessDetails(businessPrincipal: Principal): Promise<BusinessProfile | null>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole__1>;
    getMyBusinessProfile(): Promise<BusinessProfile | null>;
    getMyLeads(): Promise<Array<TokenPurchase>>;
    getMyRewards(): Promise<Array<Reward>>;
    getMyUnlockHistory(): Promise<Array<TokenPurchase>>;
    getRevenueStats(): Promise<{
        subscriptionRevenue: bigint;
        tokenRevenue: bigint;
    }>;
    getRewardById(rewardId: string): Promise<Reward | null>;
    getSuggestedMatches(businessName: string, location: string): Promise<Array<SuggestedMatch>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    isCallerApproved(): Promise<boolean>;
    listApprovals(): Promise<Array<UserApprovalInfo>>;
    rejectKYC(businessPrincipal: Principal): Promise<void>;
    renewSubscription(amount: bigint, duration: Time): Promise<void>;
    requestApproval(): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    searchBusinessObjectsByPrefix(searchTerm: string): Promise<Array<BusinessData>>;
    setApproval(user: Principal, status: ApprovalStatus): Promise<void>;
    unblockUser(userPrincipal: Principal): Promise<void>;
    unlockBusiness(businessPrincipal: Principal, amount: bigint, expiryDuration: Time): Promise<void>;
    updateBusinessProfile(profile: BusinessProfile): Promise<void>;
}
