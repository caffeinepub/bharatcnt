# Specification

## Summary
**Goal:** Build BHARATcnt as an installable PWA on Internet Computer with Internet Identity login and role-based (Admin/Seller/Customer) modules for a local business marketplace.

**Planned changes:**
- Create a responsive PWA shell: web app manifest, service worker offline app-shell caching, install prompt support, and an offline fallback screen.
- Implement Internet Identity sign-in/sign-out and role-based route gating for Admin, Seller, and Customer, including onboarding as Customer and Admin-only seller approval flow.
- Build Admin module: KYC verification (Aadhaar + live photo) approve/reject with notes, City/Category CRUD, revenue totals for token (₹10) and subscription (₹99) transactions, block/unblock user/seller accounts, and view reports/help tickets.
- Build Seller module: business profile management (text fields + photos), KYC submission/status, lead dashboard (unlock events with privacy rules), QR code generation linking to the business page, subscription status + renew action, and basic analytics (views/unlocks) with time ranges.
- Build Customer module: browse/search by City + Category, business list/detail with locked sensitive fields, token-based unlock flow with time-based auto-expiry (24h default, configurable up to 48h), unlock history, QR scan/manual entry reward wallet (points ledger), and report/help submission.
- Add a consistent BHARATcnt visual theme (avoid blue/purple as primary colors) and style key UI states (loading/empty/error/disabled/success).
- Display the exact legal disclaimer in the app footer across major screens and on every unlock confirmation/receipt screen.
- Implement a single-actor Motoko backend data model and APIs for cities, categories, users/roles, sellers/businesses, KYC, blocks, transactions (tokens/subscriptions) with expiry, unlocks with expiry, reward ledger, reports, and analytics counters—enforcing authorization by role/ownership.

**User-visible outcome:** Users can install BHARATcnt as a PWA, sign in with Internet Identity, and use Admin/Seller/Customer features appropriate to their role: admins manage KYC/cities/categories/revenue/blocks; sellers manage profiles, KYC, leads, QR, subscriptions, and analytics; customers find businesses by city/category, unlock details for a limited time, track history and rewards, and submit reports.
