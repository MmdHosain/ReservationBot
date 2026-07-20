// src/db/index.ts
import { pool } from "./pool.ts";
import { setupEnumsSQL, setupTablesSQL, setupIndexesSQL } from "./schema.ts";
import { AppDataSource } from "./orm.config.ts";

export async function initDB() {
  try {
    // Validate connection
    await pool.query("SELECT 1");

    // Best Practice: Execute schemas sequentially inside a single operation
    // 1. Setup Enums
    await pool.query(setupEnumsSQL);

    // 2. Setup Tables
    await pool.query(setupTablesSQL);

    // 3. Setup Indexes
    await pool.query(setupIndexesSQL);

    console.log("📦 Database ready and new multi-tenant schema ensured.");

    // Initialize TypeORM Data Source
    await AppDataSource.initialize();
    console.log("🔥 TypeORM AppDataSource initialized.");
  } catch (err) {
    console.error("❌ Database initialization failed:", err);
    process.exit(1);
  }
}

export { pool };
