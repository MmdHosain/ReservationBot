# 🗄 Database Schema Refactoring Plan

## Objective
Migrate the existing flat database schema (`users`, `services`, `appointments`, etc.) to the new multi-tenant, event-driven schema defined in the DBML. The new schema introduces `organizations`, separate `users` entities, `schedules`, `event_types`, and `resources`.

Because this refactor touches almost every layer of the application (Database Init, Repositories, Core Logic, Telegram Controllers, and Instagram Webhooks), it must be done in sequential phases to prevent total system breakage.

---

## Phase 1: Database Foundation (Done ✅)
- [x] **1.1 Define Enums & Schema Init** 
  - Extracted SQL schema to `Telegram/src/db/schema.ts`.
  - Added robust ENUM creation blocks for `user_org_role`, `booking_mode`, `event_status`, and `participant_role`.
  - Set up `organizations`, `users`, `organization_members`, `event_types`, `user_event_types`, `schedules`, `schedule_rules`, `schedule_exceptions`, `events`, `event_participants`, `resources`, `event_resources` tables.
  - Replaced flat `index.ts` table logic with modular `schema.ts` execution.
- [x] **1.2 Connection & Types Update**
  - Created `Telegram/src/db/types.ts` containing strict TypeScript interfaces representing the new SQL tables.

## Phase 2: Data Access Layer (Repositories) (Done ✅)
- [x] **2.1 Users & Organizations**
  - Created `user_v2.repository.ts` and `organization.repository.ts` to handle creating a `user` and linking them to an `organization` via `organization_members`.
- [x] **2.2 Event Types & Capabilities**
  - Created `event_type.repository.ts` mapped to `event_types` and `user_event_types`.
- [x] **2.3 Scheduling Engine**
  - Created `schedule.repository.ts` to manage `schedules`, `schedule_rules`, and `schedule_exceptions`.
- [x] **2.4 Events & Appointments**
  - Created `event.repository.ts` mapped to `events` and `event_participants`.
- [x] **2.5 Resources (New Feature)**
  - Created `resource.repository.ts` for managing physical resources like chairs, rooms, or equipment.

## Phase 3: Core Domain & Booking Logic (Next Steps)
- [ ] **3.1 Availability Engine (`src/core/utils/booking.ts`)**
  - Refactor `getAvailableDays` and `getAvailableSlots` to dynamically query the new `schedules` and `schedule_rules` rather than parsing static JSON arrays.
  - Include logic to account for `schedule_exceptions` (e.g., holidays, sick leaves).
- [ ] **3.2 Context & Middlewares**
  - Update Telegraf contexts to attach the active `organization_id` along with the `user_id`.
  - Update `subscription.guard.ts` to check subscription status at the `organization` level rather than the `user` level.

## Phase 4: UI / Controllers Refactoring (Telegram)
- [ ] **4.1 Manager Onboarding (`features/manager/onboarding`)**
  - Update onboarding flow to create an Organization, an Admin User, and a base Schedule.
- [ ] **4.2 Manager Dashboard & Settings**
  - Adapt the services menu to modify `event_types`.
  - Adapt the settings menu to modify `schedule_rules` (working hours and breaks).
  - Adapt the staff menu to add users and link them via `organization_members`.
- [ ] **4.3 Customer Booking Flow (`features/customer/booking`)**
  - Update booking steps to fetch `event_types`, determine slots from `schedules`, and insert rows into `events` and `event_participants`.
- [ ] **4.4 Customer Dashboard (`features/customer/reservations`)**
  - Update queries to fetch `events` joined with `event_participants`.

## Phase 5: Instagram Microservice Update
- [ ] **5.1 Bridge Adapters (`Instagram/src/db/bridge.ts`)**
  - Update the bridge queries to interact with the new schema (fetching users, sync Meta IDs to the new `users` table).
- [ ] **5.2 Handlers**
  - Ensure Instagram IGContext accurately maps to the new `event` creation structure.

## Phase 6: Testing & Migration
- [ ] **6.1 Data Migration Script (Optional)**
  - Write a one-time script to map old `users` to `organizations` + `users` if backward compatibility is required.
- [ ] **6.2 End-to-End Testing**
  - Test Organization creation, multi-staff booking, schedule exception handling, and concurrent timezone logic.
