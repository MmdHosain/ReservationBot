import { DataSource } from "typeorm";
import config from "../core/config.ts";

// V2 Entities
import { Organization } from "./entities/Organization.ts";
import { UserV2 } from "./entities/UserV2.ts";
import { OrganizationMember } from "./entities/OrganizationMember.ts";
import { EventType } from "./entities/EventType.ts";
import { UserEventType } from "./entities/UserEventType.ts";
import { Schedule } from "./entities/Schedule.ts";
import { ScheduleRule } from "./entities/ScheduleRule.ts";
import { Resource } from "./entities/Resource.ts";
import { ScheduleException } from "./entities/ScheduleException.ts";
import { Event } from "./entities/Event.ts";
import { EventParticipant } from "./entities/EventParticipant.ts";
import { EventResource } from "./entities/EventResource.ts";

// V1 Legacy Entities
import * as V1Entities from "./entities/v1/index.ts";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: config.db.host,
  port: config.db.port,
  username: config.db.user,
  password: config.db.password,
  database: config.db.database,
  // Keep synchronize false during migration so it doesn't drop/modify raw SQL tables unexpectedly
  synchronize: false, 
  logging: false,
  entities: [
    Organization,
    UserV2,
    OrganizationMember,
    EventType,
    UserEventType,
    Schedule,
    ScheduleRule,
    Resource,
    ScheduleException,
    Event,
    EventParticipant,
    EventResource,
    ...Object.values(V1Entities)
  ],
  subscribers: [],
  migrations: [],
});
