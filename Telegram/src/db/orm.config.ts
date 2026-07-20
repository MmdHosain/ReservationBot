import { DataSource } from "typeorm";
import config from "../core/config.ts";

// Unified Entities
import { Organization } from "./entities/Organization.ts";
import { User } from "./entities/User.ts";
import { OrganizationMember } from "./entities/OrganizationMember.ts";
import { Category } from "./entities/Category.ts";
import { EventType } from "./entities/EventType.ts";
import { UserEventType } from "./entities/UserEventType.ts";
import { Schedule } from "./entities/Schedule.ts";
import { ScheduleRule } from "./entities/ScheduleRule.ts";
import { Resource } from "./entities/Resource.ts";
import { ScheduleException } from "./entities/ScheduleException.ts";
import { Event } from "./entities/Event.ts";
import { EventParticipant } from "./entities/EventParticipant.ts";
import { EventResource } from "./entities/EventResource.ts";
import { TransactionV2 } from "./entities/TransactionV2.ts";
import { InboxMessageV2 } from "./entities/InboxMessageV2.ts";

// V1 Legacy Entities (Kept temporarily to avoid breaking the build while refactoring repositories)
import * as V1Entities from "./entities/v1/index.ts";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: config.db.host,
  port: config.db.port,
  username: config.db.user,
  password: config.db.password,
  database: config.db.database,
  // Set to true to automatically create missing tables. In production, use migrations.
  synchronize: true, 
  logging: false,
  entities: [
    Organization,
    User,
    OrganizationMember,
    Category,
    EventType,
    UserEventType,
    Schedule,
    ScheduleRule,
    Resource,
    ScheduleException,
    Event,
    EventParticipant,
    EventResource,
    TransactionV2,
    InboxMessageV2,
    ...Object.values(V1Entities)
  ],
  subscribers: [],
  migrations: [],
});
