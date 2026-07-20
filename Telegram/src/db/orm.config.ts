import { DataSource } from "typeorm";
import config from "../core/config.ts";
import { Organization } from "./entities/Organization.ts";
import { UserV2 } from "./entities/UserV2.ts";
import { OrganizationMember } from "./entities/OrganizationMember.ts";

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
    OrganizationMember
    // More entities will be added in the next phases
  ],
  subscribers: [],
  migrations: [],
});
