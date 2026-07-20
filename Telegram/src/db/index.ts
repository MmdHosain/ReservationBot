// src/db/index.ts
import { AppDataSource } from "./orm.config.ts";
import pkg from "pg";
const { Client } = pkg;
import config from "../core/config.ts";

export async function initDB() {
  try {
    // Temporary cleanup of orphaned V2 data to allow TypeORM synchronize to succeed
    // during this hard migration from V1 to V2 tables.
    const client = new Client({
      host: config.db.host,
      port: config.db.port,
      user: config.db.user,
      password: config.db.password,
      database: config.db.database,
    });
    await client.connect();
    
    await client.query(`DELETE FROM organization_members WHERE user_id NOT IN (SELECT id FROM users_unified);`).catch(() => {});
    await client.query(`DELETE FROM event_participants WHERE user_id NOT IN (SELECT id FROM users_unified);`).catch(() => {});
    await client.query(`DELETE FROM user_event_types WHERE user_id NOT IN (SELECT id FROM users_unified);`).catch(() => {});
    
    await client.end();

    await AppDataSource.initialize();
    console.log("🔥 TypeORM AppDataSource initialized.");
  } catch (err) {
    console.error("❌ Database initialization failed:", err);
    process.exit(1);
  }
}
