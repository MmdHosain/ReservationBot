# 🛠 TypeORM Migration Plan

Migrating from raw SQL (`pg` pool) to **TypeORM** requires a careful, phased approach to avoid breaking the existing bot and the ongoing V1-to-V2 dual-write transition.

## Phase 1: Setup & Initial Entities (Done ✅)
- [x] Update `tsconfig.json` to enable `experimentalDecorators` and `emitDecoratorMetadata`.
- [x] Import `reflect-metadata` at the top of the application entry point (`bot.ts`).
- [x] Create TypeORM `DataSource` configuration (`orm.config.ts`).
- [x] Create foundational V2 Entities: `Organization`, `UserV2`, and `OrganizationMember`.

## Phase 2: Complete V2 Entities & Initialization (Done ✅)
- [x] Create remaining V2 Entities: `EventType`, `UserEventType`, `Schedule`, `ScheduleRule`, `ScheduleException`, `Event`, `EventParticipant`, `Resource`, `EventResource`.
- [x] Update `Telegram/src/db/orm.config.ts` to include all V2 entities.
- [x] Update `Telegram/src/db/index.ts` to call `AppDataSource.initialize()` alongside the raw SQL pool.

## Phase 3: Migrate V2 Repositories to ORM (Done ✅)
- [x] Refactored `organization.repository.ts` and `user_v2.repository.ts` to use `AppDataSource.getRepository()` instead of raw SQL.
- [x] Refactored `event_type.repository.ts`, `schedule.repository.ts`, `event.repository.ts`, and `resource.repository.ts`.

## Phase 4: Migrate V1 Repositories (Legacy) (In Progress ⏳)
- [x] Created V1 Entities (`V1User`, `Service`, `Appointment`, `Transaction`, `InboxMessage`, `Staff`, etc.) compactly in `v1/index.ts`.
- [x] Refactored core V1 Repositories (`user`, `service`, `category`, `staff`, `transaction`) to use TypeORM.
- [ ] Refactor remaining V1 Repositories (`appointment`, `inbox`) to use TypeORM.

## Phase 5: Transaction Management & Cleanup
- [ ] Refactor `v2_sync.ts` to use TypeORM.
- [ ] Remove `pool.ts` and the `pg` dependency entirely.
- [ ] Refactor `cron.ts` to use TypeORM.
- [ ] Use TypeORM migrations or `synchronize` instead of raw `schema.ts`.
