# Phase 3 & 4 Refactoring Plan - Core Domain & UI Migration

Now that Phase 2 (V2 Repositories) is complete side-by-side with the old ones, we can safely start migrating the business logic and UI controllers step by step.

## Step 1: Core Domain & Engine Updates
- Rewrite `src/core/utils/booking.ts` to use `schedules` and `schedule_rules` instead of the old JSON-based logic.
- Implement timezone handling in `getAvailableSlots`.

## Step 2: Context and Middlewares
- Update the `MyContext` to store both `user_id` (V2) and `organization_id` instead of just using `ctx.from.id` globally.
- Adapt `subscription.guard.ts` to check the `organization` table if necessary, or the V2 user.

## Step 3: Manager Onboarding Flow (Phase 4.1)
- Modify `/manager` command to create:
  1. A V2 `user`.
  2. A new `organization`.
  3. Link them via `organization_members` as `admin`.
  4. Create an initial `schedule` and `event_type`.

## Step 4: Manager Dashboard & Settings (Phase 4.2)
- Adapt the settings menu to save schedule rules.
- Adapt the services menu to save `event_types`.

## Step 5: Customer Flow (Phase 4.3 & 4.4)
- Deep link resolution to fetch the `organization` instead of `user`.
- Create V2 `user` for the customer.
- Insert rows into `events` and `event_participants`.

*Execute these steps in subsequent requests to safely migrate without breaking functionality.*