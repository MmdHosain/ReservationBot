// src/db/index.ts
import { AppDataSource } from "./orm.config.ts";
import pkg from "pg";
const { Client } = pkg;
import config from "../core/config.ts";

export async function initDB() {
  try {
    // Robust cleanup of orphaned V2 data to allow TypeORM synchronize to succeed
    // during this hard migration phase.
    const client = new Client({
      host: config.db.host,
      port: config.db.port,
      user: config.db.user,
      password: config.db.password,
      database: config.db.database,
    });
    await client.connect();
    
    try {
      await client.query(`
        DO $$
        BEGIN
          -- Clean organization_members
          IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'users_unified') 
             AND EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'organization_members') THEN
            DELETE FROM organization_members WHERE user_id NOT IN (SELECT id FROM users_unified);
          END IF;
          
          IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'organizations') 
             AND EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'organization_members') THEN
            DELETE FROM organization_members WHERE organization_id NOT IN (SELECT id FROM organizations);
          END IF;

          -- Clean event_participants
          IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'users_unified') 
             AND EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'event_participants') THEN
            DELETE FROM event_participants WHERE user_id NOT IN (SELECT id FROM users_unified);
          END IF;

          -- Clean user_event_types
          IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'users_unified') 
             AND EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'user_event_types') THEN
            DELETE FROM user_event_types WHERE user_id NOT IN (SELECT id FROM users_unified);
          END IF;
        END $$;
      `);
    } catch(e) {
      console.error("⚠️ Pre-sync cleanup warning (can be ignored if fresh DB):", e);
    }
    
    await client.end();

    await AppDataSource.initialize();
    console.log("🔥 TypeORM AppDataSource initialized.");
  } catch (err) {
    console.error("❌ Database initialization failed:", err);
    process.exit(1);
  }
}
