# Multi-Tenant & Business Type Migration Tracker

This document tracks the phased migration from the V1 single-tenant (Beauty Salon only) schema to the V2 unified multi-tenant schema that supports multiple business types.

## Phase 1: Database Unification
- [x] **Phase 1.1 (Entities):** Merge V1 fields into V2 entities.
- [x] **Phase 1.5 (Cleanup):** Remove V1 entities and `v2_sync.ts`.
- [x] **Phase 1.3 (Services Repositories):** Refactor `service.repository.ts` and `category.repository.ts` to use V2 `EventType` and `Category`. Update Manager UI.
- [x] **Phase 1.4 (Booking Repositories):** Wire Customer Booking Engine (`booking.controller.ts`, `booking.service.ts`) directly to V2 `Event` and `ScheduleRule` records.
- [x] **Phase 1.2 (User & Org Repositories):** Refactor `user.repository.ts` to use V2 `User` and `Organization` exclusively. Migrate Inbox, Transactions, Staff, and Dashboard stats.

## Phase 2: Dynamic Terminology System
- [x] Create `Telegram/src/core/dictionary.ts`.
- [x] Extend `MyContext` with `businessCategory`.
- [x] Refactor core `MESSAGES` to use dynamic dictionary strings.
- [x] Create `context.middleware.ts` for global injection.
- [x] Update Manager Dashboard Views/Keyboards to consume the dictionary seamlessly.
- [x] Update Views/Keyboards in Customer features to consume the dictionary seamlessly.

## Phase 3: Onboarding Expansion
- [x] Add Business Type selection step to Manager Onboarding.
- [x] Save `business_category` to `Organization` during registration.
- [x] Admin stats pointing directly to Unified Schema.

## Phase 4: UI/UX Refinement
- [x] Inject `Organization` context in middleware for both managers and customers.
- [x] Ensure customer scenes load correct category from targeted Organization.
- [ ] Final end-to-end testing of dynamic terms (e.g., booking a "Visit" with a "Doctor" in a "Clinic").
