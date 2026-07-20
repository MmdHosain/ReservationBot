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

## Step 5: Customer Flow (Phase 4.3 & 4.4) (Done ✅)
- [x] Modified Deep link resolution to fetch the `organization` context on entry.
- [x] Customer Booking creation now Dual-Writes to the new `events` and `event_participants` table, linking V2 `users_v2` automatically.
- [x] Cancellations trigger an update across both V1 `appointments` and V2 `events`.

---

## Phase 5: Instagram Microservice Integration (Done ✅)
- [x] Updated Instagram Database Bridge to point to the new Multi-Tenant Schema.
- [x] Adapted Instagram Webhook Handlers to fetch `event_types` dynamically and map them to Meta's Quick Replies.
- [x] Swapped `users` table insertion for the new `users_v2` table tracking `instagram_id`.

---

## Conclusion & Testing (Done ✅)
The Monorepo has successfully been refactored to support a multi-tenant architecture while maintaining 100% backward compatibility via dual-writing. 

Check `V2_MIGRATION_TESTING.md` for specific instructions on how to test the Dual-Write implementations and the V2 Engine.

**To fully sunset V1 (Future Action):**
1. Run a data migration script to port legacy `users` to `organizations` and `users_v2` for existing accounts.
2. Swap reads in dashboards from `appointments` to `events`.
3. Drop `appointments`, `services`, and `users` tables.