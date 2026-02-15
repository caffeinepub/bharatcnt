import List "mo:core/List";
import Map "mo:core/Map";
import Text "mo:core/Text";
import Time "mo:core/Time";
import Blob "mo:core/Blob";
import Order "mo:core/Order";
import Nat "mo:core/Nat";
import Runtime "mo:core/Runtime";
import Principal "mo:core/Principal";
import UserApproval "user-approval/approval";
import Storage "blob-storage/Storage";
import MixinStorage "blob-storage/Mixin";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);
  include MixinStorage();

  let userApprovalState = UserApproval.initState(accessControlState);

  //------------------- Types -------------------
  public type ApprovalStatus = UserApproval.ApprovalStatus;

  public type UserRole = {
    #admin;
    #seller;
    #customer;
  };

  public type UserProfile = {
    name : Text;
    role : UserRole;
    isBlocked : Bool;
  };

  public type BusinessProfile = {
    principal : Principal;
    name : Text;
    description : Text;
    verifyImage : ?Storage.ExternalBlob;
    address : Text;
    contactInfo : Text;
    kycDocs : ?Storage.ExternalBlob;
    kycPhoto : ?Storage.ExternalBlob;
    kycStatus : ApprovalStatus;
    subscriptionExpiry : ?Time.Time;
    isBlocked : Bool;
    createdAt : Time.Time;
    updatedAt : Time.Time;
  };

  public type UnlockDetails = {
    expiry : Time.Time;
    hasExpired : Bool;
  };

  public type TokenPurchase = {
    user : Principal;
    business : Principal;
    amount : Nat;
    timestamp : Time.Time;
    expiry : Time.Time;
  };

  public type Subscription = {
    business : Principal;
    amount : Nat;
    expiry : Time.Time;
  };

  public type BusinessData = {
    id : Text;
    name : Text;
    address : Text;
  };

  public type SuggestedMatch = {
    id : Text;
    name : Text;
    address : Text;
    isPartial : Bool;
  };

  public type RewardStatus = {
    #active;
    #redeemed;
    #expired;
  };

  public type Reward = {
    principal : Principal;
    id : Text;
    points : Nat;
    status : RewardStatus;
    createdAt : Time.Time;
    expiresAt : Time.Time;
    lastUpdated : Time.Time;
    businessName : Text;
    businessLocation : Text;
    rewardEntered : Bool;
    isTestReward : Bool;
    wasManuallyAdded : Bool;
    redemptionActivityCount : Nat;
    testRewardActivityCount : Nat;
    lastActivityTime : Time.Time;
  };

  module PrincipalPair {
    public func compare(pair1 : (Principal, Principal), pair2 : (Principal, Principal)) : Order.Order {
      switch (Principal.compare(pair1.0, pair2.0)) {
        case (#equal) {
          Principal.compare(pair1.1, pair2.1);
        };
        case (order) { order };
      };
    };
  };

  //------------------- Persistent Stores -------------------
  let userProfiles = Map.empty<Principal, UserProfile>();
  let businessProfiles = Map.empty<Principal, BusinessProfile>();
  let unlockDetails = Map.empty<(Principal, Principal), UnlockDetails>();
  let tokenPurchases = Map.empty<Principal, List.List<TokenPurchase>>();
  let subscriptions = Map.empty<Principal, List.List<Subscription>>();
  let rewards = Map.empty<Principal, Reward>();
  let rewardIdToPrincipal = Map.empty<Text, Principal>();

  //------------------- Helper Functions -------------------
  func isSeller(caller : Principal) : Bool {
    switch (userProfiles.get(caller)) {
      case (?profile) { profile.role == #seller };
      case (null) { false };
    };
  };

  func isCustomer(caller : Principal) : Bool {
    switch (userProfiles.get(caller)) {
      case (?profile) { profile.role == #customer };
      case (null) { false };
    };
  };

  func isBlocked(caller : Principal) : Bool {
    switch (userProfiles.get(caller)) {
      case (?profile) { profile.isBlocked };
      case (null) { false };
    };
  };

  func checkNotBlocked(caller : Principal) {
    if (isBlocked(caller)) {
      Runtime.trap("Unauthorized: Account is blocked");
    };
  };

  //------------------- User Approval Functions -------------------
  public query ({ caller }) func isCallerApproved() : async Bool {
    AccessControl.isAdmin(accessControlState, caller) or UserApproval.isApproved(userApprovalState, caller);
  };

  public shared ({ caller }) func requestApproval() : async () {
    UserApproval.requestApproval(userApprovalState, caller);
  };

  public shared ({ caller }) func setApproval(user : Principal, status : ApprovalStatus) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };
    UserApproval.setApproval(userApprovalState, user, status);
  };

  public query ({ caller }) func listApprovals() : async [UserApproval.UserApprovalInfo] {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };
    UserApproval.listApprovals(userApprovalState);
  };

  //------------------- User Profile Management -------------------
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    checkNotBlocked(caller);
    userProfiles.add(caller, profile);
  };

  //------------------- Admin Functions -------------------
  public shared ({ caller }) func approveKYC(businessPrincipal : Principal) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can approve KYC");
    };

    switch (businessProfiles.get(businessPrincipal)) {
      case (?profile) {
        let updatedProfile = {
          profile with
          kycStatus = #approved;
          updatedAt = Time.now();
        };
        businessProfiles.add(businessPrincipal, updatedProfile);
      };
      case (null) {
        Runtime.trap("Business profile not found");
      };
    };
  };

  public shared ({ caller }) func rejectKYC(businessPrincipal : Principal) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can reject KYC");
    };

    switch (businessProfiles.get(businessPrincipal)) {
      case (?profile) {
        let updatedProfile = {
          profile with
          kycStatus = #rejected;
          updatedAt = Time.now();
        };
        businessProfiles.add(businessPrincipal, updatedProfile);
      };
      case (null) {
        Runtime.trap("Business profile not found");
      };
    };
  };

  public shared ({ caller }) func blockUser(userPrincipal : Principal) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can block users");
    };

    switch (userProfiles.get(userPrincipal)) {
      case (?profile) {
        let updatedProfile = {
          profile with
          isBlocked = true;
        };
        userProfiles.add(userPrincipal, updatedProfile);
      };
      case (null) {
        Runtime.trap("User profile not found");
      };
    };
  };

  public shared ({ caller }) func unblockUser(userPrincipal : Principal) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can unblock users");
    };

    switch (userProfiles.get(userPrincipal)) {
      case (?profile) {
        let updatedProfile = {
          profile with
          isBlocked = false;
        };
        userProfiles.add(userPrincipal, updatedProfile);
      };
      case (null) {
        Runtime.trap("User profile not found");
      };
    };
  };

  public query ({ caller }) func getAllPendingKYC() : async [BusinessProfile] {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can view pending KYC");
    };

    let pendingList = List.empty<BusinessProfile>();
    for ((_, profile) in businessProfiles.entries()) {
      if (profile.kycStatus == #pending) {
        pendingList.add(profile);
      };
    };
    pendingList.toArray();
  };

  public query ({ caller }) func getRevenueStats() : async { tokenRevenue : Nat; subscriptionRevenue : Nat } {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can view revenue");
    };

    var tokenRevenue = 0;
    var subscriptionRevenue = 0;

    for ((_, purchases) in tokenPurchases.entries()) {
      for (purchase in purchases.values()) {
        tokenRevenue += purchase.amount;
      };
    };

    for ((_, subs) in subscriptions.entries()) {
      for (sub in subs.values()) {
        subscriptionRevenue += sub.amount;
      };
    };

    { tokenRevenue; subscriptionRevenue };
  };

  //------------------- Seller Functions -------------------
  public shared ({ caller }) func createBusinessProfile(profile : BusinessProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can create business profiles");
    };
    checkNotBlocked(caller);

    if (not isSeller(caller)) {
      Runtime.trap("Unauthorized: Only sellers can create business profiles");
    };

    let newProfile = {
      profile with
      principal = caller;
      createdAt = Time.now();
      updatedAt = Time.now();
    };
    businessProfiles.add(caller, newProfile);
  };

  public shared ({ caller }) func updateBusinessProfile(profile : BusinessProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can update business profiles");
    };
    checkNotBlocked(caller);

    if (not isSeller(caller)) {
      Runtime.trap("Unauthorized: Only sellers can update business profiles");
    };

    switch (businessProfiles.get(caller)) {
      case (?existingProfile) {
        let updatedProfile = {
          profile with
          principal = caller;
          createdAt = existingProfile.createdAt;
          updatedAt = Time.now();
        };
        businessProfiles.add(caller, updatedProfile);
      };
      case (null) {
        Runtime.trap("Business profile not found");
      };
    };
  };

  public query ({ caller }) func getMyBusinessProfile() : async ?BusinessProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view business profiles");
    };

    if (not isSeller(caller)) {
      Runtime.trap("Unauthorized: Only sellers can view their business profile");
    };

    businessProfiles.get(caller);
  };

  public query ({ caller }) func getMyLeads() : async [TokenPurchase] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view leads");
    };
    checkNotBlocked(caller);

    if (not isSeller(caller)) {
      Runtime.trap("Unauthorized: Only sellers can view leads");
    };

    let leadsList = List.empty<TokenPurchase>();
    for ((_, purchases) in tokenPurchases.entries()) {
      for (purchase in purchases.values()) {
        if (purchase.business == caller) {
          leadsList.add(purchase);
        };
      };
    };
    leadsList.toArray();
  };

  public shared ({ caller }) func renewSubscription(amount : Nat, duration : Time.Time) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can renew subscriptions");
    };
    checkNotBlocked(caller);

    if (not isSeller(caller)) {
      Runtime.trap("Unauthorized: Only sellers can renew subscriptions");
    };

    let newSubscription : Subscription = {
      business = caller;
      amount = amount;
      expiry = Time.now() + duration;
    };

    // Update subscriptions
    let currentSubscriptions = switch (subscriptions.get(caller)) {
      case (?existing) { existing };
      case (null) { List.empty<Subscription>() };
    };
    currentSubscriptions.add(newSubscription);
    subscriptions.add(caller, currentSubscriptions);

    // Update business profile subscription expiry
    switch (businessProfiles.get(caller)) {
      case (?profile) {
        let updatedProfile = {
          profile with
          subscriptionExpiry = ?newSubscription.expiry;
          updatedAt = Time.now();
        };
        businessProfiles.add(caller, updatedProfile);
      };
      case (null) {};
    };
  };

  //------------------- Customer Functions -------------------
  public query ({ caller }) func searchBusinessObjectsByPrefix(searchTerm : Text) : async [BusinessData] {
    // Public search - no auth required, but only show approved businesses
    let searchTermLower = searchTerm.toLower();

    let businessDataList = List.empty<BusinessData>();
    for ((id, business) in businessProfiles.entries()) {
      if (business.kycStatus == #approved and not business.isBlocked) {
        if (searchTermLower.size() == 0 or business.name.toLower().contains(#text searchTermLower)) {
          let businessData : BusinessData = {
            id = id.toText();
            name = business.name;
            address = business.address;
          };
          businessDataList.add(businessData);
        };
      };
    };
    businessDataList.toArray();
  };

  public query ({ caller }) func getSuggestedMatches(businessName : Text, location : Text) : async [SuggestedMatch] {
    // Public search - no auth required, but only show approved businesses
    let suggestedMatchesList = List.empty<SuggestedMatch>();

    for ((id, business) in businessProfiles.entries()) {
      if (business.kycStatus == #approved and not business.isBlocked) {
        if (business.name.toLower().contains(#text (businessName.toLower()))) {
          let suggestedMatch : SuggestedMatch = {
            id = id.toText();
            name = business.name;
            address = business.address;
            isPartial = false;
          };
          suggestedMatchesList.add(suggestedMatch);
        } else if (business.address.toLower().contains(#text (location.toLower()))) {
          let suggestedMatch : SuggestedMatch = {
            id = id.toText();
            name = business.name;
            address = business.address;
            isPartial = true;
          };
          suggestedMatchesList.add(suggestedMatch);
        };
      };
    };

    suggestedMatchesList.toArray();
  };

  public shared ({ caller }) func unlockBusiness(
    businessPrincipal : Principal,
    amount : Nat,
    expiryDuration : Time.Time,
  ) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can unlock businesses");
    };
    checkNotBlocked(caller);

    if (not isCustomer(caller)) {
      Runtime.trap("Unauthorized: Only customers can unlock businesses");
    };

    // Verify business exists and is approved
    switch (businessProfiles.get(businessPrincipal)) {
      case (?profile) {
        if (profile.kycStatus != #approved) {
          Runtime.trap("Business is not approved");
        };
        if (profile.isBlocked) {
          Runtime.trap("Business is blocked");
        };
      };
      case (null) {
        Runtime.trap("Business not found");
      };
    };

    let expiry = Time.now() + expiryDuration;

    // Record token purchase
    let purchase : TokenPurchase = {
      user = caller;
      business = businessPrincipal;
      amount = amount;
      timestamp = Time.now();
      expiry = expiry;
    };

    // Update token purchases
    let currentPurchases = switch (tokenPurchases.get(caller)) {
      case (?existing) { existing };
      case (null) { List.empty<TokenPurchase>() };
    };
    currentPurchases.add(purchase);
    tokenPurchases.add(caller, currentPurchases);

    // Create unlock details
    let unlock : UnlockDetails = {
      expiry = expiry;
      hasExpired = false;
    };
    unlockDetails.add((caller, businessPrincipal), unlock);
  };

  public query ({ caller }) func getBusinessDetails(businessPrincipal : Principal) : async ?BusinessProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view business details");
    };
    checkNotBlocked(caller);

    if (not isCustomer(caller)) {
      Runtime.trap("Unauthorized: Only customers can view business details");
    };

    // Check if customer has unlocked this business
    switch (unlockDetails.get((caller, businessPrincipal))) {
      case (?unlock) {
        if (unlock.expiry < Time.now()) {
          Runtime.trap("Unlock has expired");
        };
        businessProfiles.get(businessPrincipal);
      };
      case (null) {
        Runtime.trap("Business not unlocked");
      };
    };
  };

  public query ({ caller }) func getMyUnlockHistory() : async [TokenPurchase] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view unlock history");
    };
    checkNotBlocked(caller);

    if (not isCustomer(caller)) {
      Runtime.trap("Unauthorized: Only customers can view unlock history");
    };

    switch (tokenPurchases.get(caller)) {
      case (?purchases) { purchases.toArray() };
      case (null) { [] };
    };
  };

  public query ({ caller }) func getAvailableRewardPool() : async [Reward] {
    // Public query - no auth required
    let availableRewards = List.empty<Reward>();

    for ((_, reward) in rewards.entries()) {
      if (reward.status == #active) {
        availableRewards.add(reward);
      };
    };

    let allAvailableRewards : [Reward] = availableRewards.toArray();
    allAvailableRewards;
  };

  public query ({ caller }) func getRewardById(rewardId : Text) : async ?Reward {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view rewards");
    };

    switch (rewardIdToPrincipal.get(rewardId)) {
      case (?principal) {
        rewards.get(principal);
      };
      case (null) {
        for ((principal, reward) in rewards.entries()) {
          if (reward.id == rewardId) {
            rewardIdToPrincipal.add(rewardId, principal);
            return ?reward;
          };
        };
        null;
      };
    };
  };

  public query ({ caller }) func getMyRewards() : async [Reward] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view their rewards");
    };
    checkNotBlocked(caller);

    if (not isCustomer(caller)) {
      Runtime.trap("Unauthorized: Only customers can view rewards");
    };

    switch (rewards.get(caller)) {
      case (?reward) { [reward] };
      case (null) { [] };
    };
  };
};
