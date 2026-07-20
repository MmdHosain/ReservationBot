# Phase 3 & 4 Refactoring Plan - Core Domain & UI Migration

Now that Phase 2 (V2 Repositories) is complete side-by-side with the old ones, we can safely start migrating the business logic and UI controllers step by step.

## Step 1: Core Domain & Engine Updates (Done ✅)
- [x] Create V2 booking engine (`booking_v2.ts`) to calculate slots dynamically from `schedule_rules` and `schedule_exceptions`.

## Step 2: Context and Middlewares (Done ✅)
- [x] Update the `MyContext` to support `v2UserId` and `orgId` alongside V1.
- [x] Ensure `organizations` DB Schema supports `subscription_expires_at` for seamless migration.

## Step 3: Manager Onboarding Flow (Phase 4.1) (Done ✅)
- [x] Modified `/manager` command to create V2 structures via a Dual-Write Migration technique.
- [x] Automatically initializes `users`, `organizations`, `organization_members`, `event_types`, `schedules`, and `schedule_rules`.

## Step 4: Manager Dashboard & Settings (Phase 4.2) (Done ✅)
- [x] Created `v2_sync.ts` utility to automatically mirror configuration changes from V1 Settings & Services UI directly to the V2 PostgreSQL relational schema.
- [x] Integrated sync hooks into `services.service.ts` and `settings.service.ts`.

## Step 5: Customer Flow (Phase 4.3 & 4.4) (Next Steps)
- Deep link resolution to fetch the `organization` instead of `user`.
- Create V2 `user` for the customer.
- Insert rows into `events` and `event_participants`.