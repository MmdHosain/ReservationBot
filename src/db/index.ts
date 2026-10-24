// src/db/index.ts
import { AppDataSource } from "./orm.config.ts";
import pkg from "pg";
const { Client } = pkg;
import config from "../config/index.ts";

export async function initDB() {
  try {
    // Robust cleanup and schema migration
    const client = new Client({
      host: config.db.host,
      port: config.db.port,
      user: config.db.user,
      password: config.db.password,
      database: config.db.database,
    });
    await client.connect();
    
    try {
      // 1. Ensure bale_id exists and copy existing legacy Bale user IDs from telegram_id
      await client.query(`
        DO $$
        BEGIN
          IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'users_unified') THEN
            IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'users_unified' AND column_name = 'bale_id') THEN
              ALTER TABLE users_unified ADD COLUMN bale_id bigint UNIQUE;
              -- Populate bale_id from telegram_id for existing Bale records
              UPDATE users_unified SET bale_id = telegram_id WHERE bale_id IS NULL AND telegram_id IS NOT NULL;
            END IF;
          END IF;
        END $$;
      `);
      await client.query(`
        DO $$
        BEGIN
          -- Clean organization_members
          IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'organization_members') THEN
            IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'users_unified') THEN
              DELETE FROM organization_members om WHERE NOT EXISTS (SELECT 1 FROM users_unified uu WHERE uu.id = om.user_id);
            ELSE
              DELETE FROM organization_members;
            END IF;
            
            IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'organizations') THEN
              DELETE FROM organization_members om WHERE NOT EXISTS (SELECT 1 FROM organizations o WHERE o.id = om.organization_id);
            ELSE
              DELETE FROM organization_members;
            END IF;
          END IF;

          -- Clean event_participants
          IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'event_participants') THEN
            IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'users_unified') THEN
              DELETE FROM event_participants ep WHERE NOT EXISTS (SELECT 1 FROM users_unified uu WHERE uu.id = ep.user_id);
            ELSE
              DELETE FROM event_participants;
            END IF;
            
            IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'events') THEN
              DELETE FROM event_participants ep WHERE NOT EXISTS (SELECT 1 FROM events e WHERE e.id = ep.event_id);
            ELSE
              DELETE FROM event_participants;
            END IF;
          END IF;

          -- Clean user_event_types
          IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'user_event_types') THEN
            IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'users_unified') THEN
              DELETE FROM user_event_types uet WHERE NOT EXISTS (SELECT 1 FROM users_unified uu WHERE uu.id = uet.user_id);
            ELSE
              DELETE FROM user_event_types;
            END IF;
            
            IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'event_types') THEN
              DELETE FROM user_event_types uet WHERE NOT EXISTS (SELECT 1 FROM event_types et WHERE et.id = uet.event_type_id);
            ELSE
              DELETE FROM user_event_types;
            END IF;
          END IF;

          -- Clean events
          IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'events') THEN
            IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'organizations') THEN
              DELETE FROM events e WHERE NOT EXISTS (SELECT 1 FROM organizations o WHERE o.id = e.organization_id);
            ELSE
              DELETE FROM events;
            END IF;
          END IF;

          -- Clean event_types
          IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'event_types') THEN
            IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'organizations') THEN
              DELETE FROM event_types et WHERE NOT EXISTS (SELECT 1 FROM organizations o WHERE o.id = et.organization_id);
            ELSE
              DELETE FROM event_types;
            END IF;
          END IF;

          -- Clean categories
          IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'categories') THEN
            IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'organizations') THEN
              DELETE FROM categories c WHERE NOT EXISTS (SELECT 1 FROM organizations o WHERE o.id = c.organization_id);
            ELSE
              DELETE FROM categories;
            END IF;
          END IF;

          -- Clean schedules
          IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'schedules') THEN
            IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'organizations') THEN
              DELETE FROM schedules s WHERE NOT EXISTS (SELECT 1 FROM organizations o WHERE o.id = s.organization_id);
            ELSE
              DELETE FROM schedules;
            END IF;
            
            IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'users_unified') THEN
              DELETE FROM schedules s WHERE s.user_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM users_unified uu WHERE uu.id = s.user_id);
            ELSE
              DELETE FROM schedules WHERE user_id IS NOT NULL;
            END IF;
          END IF;

          -- Clean schedule_rules
          IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'schedule_rules') THEN
            IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'schedules') THEN
              DELETE FROM schedule_rules sr WHERE NOT EXISTS (SELECT 1 FROM schedules s WHERE s.id = sr.schedule_id);
            ELSE
              DELETE FROM schedule_rules;
            END IF;
          END IF;
          
          -- Clean resources
          IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'resources') THEN
            IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'organizations') THEN
              DELETE FROM resources r WHERE NOT EXISTS (SELECT 1 FROM organizations o WHERE o.id = r.organization_id);
            ELSE
              DELETE FROM resources;
            END IF;
          END IF;

          -- Clean event_resources
          IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'event_resources') THEN
            IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'events') THEN
              DELETE FROM event_resources er WHERE NOT EXISTS (SELECT 1 FROM events e WHERE e.id = er.event_id);
            ELSE
              DELETE FROM event_resources;
            END IF;
            
            IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'resources') THEN
              DELETE FROM event_resources er WHERE NOT EXISTS (SELECT 1 FROM resources r WHERE r.id = er.resource_id);
            ELSE
              DELETE FROM event_resources;
            END IF;
          END IF;

          -- Clean schedule_exceptions
          IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'schedule_exceptions') THEN
            IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'organizations') THEN
              DELETE FROM schedule_exceptions se WHERE NOT EXISTS (SELECT 1 FROM organizations o WHERE o.id = se.organization_id);
            ELSE
              DELETE FROM schedule_exceptions;
            END IF;
            
            IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'users_unified') THEN
              DELETE FROM schedule_exceptions se WHERE se.user_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM users_unified uu WHERE uu.id = se.user_id);
            ELSE
              DELETE FROM schedule_exceptions WHERE user_id IS NOT NULL;
            END IF;
          END IF;

          -- Clean inbox_messages_v2
          IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'inbox_messages_v2') THEN
            IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'organizations') THEN
              DELETE FROM inbox_messages_v2 m WHERE NOT EXISTS (SELECT 1 FROM organizations o WHERE o.id = m.organization_id);
            ELSE
              DELETE FROM inbox_messages_v2;
            END IF;
            
            IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'users_unified') THEN
              DELETE FROM inbox_messages_v2 m WHERE NOT EXISTS (SELECT 1 FROM users_unified uu WHERE uu.id = m.customer_id);
            ELSE
              DELETE FROM inbox_messages_v2;
            END IF;
          END IF;

          -- Clean transactions_v2
          IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'transactions_v2') THEN
            IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'organizations') THEN
              DELETE FROM transactions_v2 t WHERE NOT EXISTS (SELECT 1 FROM organizations o WHERE o.id = t.organization_id);
            ELSE
              DELETE FROM transactions_v2;
            END IF;
            
            IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'users_unified') THEN
              UPDATE transactions_v2 t SET user_id = NULL WHERE t.user_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM users_unified uu WHERE uu.id = t.user_id);
            ELSE
              UPDATE transactions_v2 SET user_id = NULL;
            END IF;
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
