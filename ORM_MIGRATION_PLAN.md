# 🛠 TypeORM Migration Plan

Migrating from raw SQL (`pg` pool) to **TypeORM** requires a careful, phased approach to avoid breaking the existing bot and the ongoing V1-to-V2 dual-write transition.

## Phase 1: Setup & Initial Entities (Done ✅)
- [x] Update `tsconfig.json` to enable `experimentalDecorators` and `emitDecoratorMetadata`.
- [x] Import `reflect-metadata` at the top of the application entry point (`bot.ts`).
- [x] Create TypeORM `DataSource` configuration (`orm.config.ts`).
- [x] Create foundational V2 Entities: `Organization`, `UserV2`, and `OrganizationMember`.

## Phase 2: Complete V2 Entities & Initialization (Next Steps)
- [ ] Create remaining V2 Entities: `EventType`, `Schedule`, `ScheduleRule`, `ScheduleException`, `Event`, `EventParticipant`, `Resource`, `EventResource`.
- [ ] Update `Telegram/src/db/index.ts` to call `AppDataSource.initialize()` alongside the raw SQL pool.

## Phase 3: Migrate V2 Repositories to ORM
- [ ] Refactor `organization.repository.ts` and `user_v2.repository.ts` to use `AppDataSource.getRepository()` instead of raw SQL.
- [ ] Refactor `event_type.repository.ts`, `schedule.repository.ts`, and `event.repository.ts`.

## Phase 4: Migrate V1 Repositories (Legacy)
- [ ] Create V1 Entities (`User`, `Service`, `Appointment`, `Transaction`, `InboxMessage`, `Staff`, etc.).
- [ ] Refactor V1 Repositories to use TypeORM.

## Phase 5: Transaction Management & Cleanup
- [ ] Refactor `v2_sync.ts` and `appointment.repository.ts` to use TypeORM's `DataSource.transaction()` for atomic dual-writes.
- [ ] Remove `pool.ts` and the `pg` dependency entirely.
- [ ] Use TypeORM migrations or `synchronize` instead of raw `schema.ts`.
